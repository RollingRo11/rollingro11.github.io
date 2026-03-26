---
title: "Transformers learn factored representations of non-ergodic HMMs"
date: "2026-03-23"
summary: "I train a 2-layer transformer on a mixture of 3 Mess3 processes and find that the model linearly encodes both within-component belief states and the posterior over which component generated the sequence. The residual stream geometry mirrors the block-diagonal structure of the data generator."
---

I train a 2-layer transformer on a non-ergodic mixture of 3 Mess3 processes. The model linearly encodes the within-component belief state (each Mess3's fractal simplex geometry) and the posterior over which component generated the sequence. PCA shows the activations splitting into three process clusters at later context positions, with simplex structure visible inside each one. I then test whether the three component representations sit in orthogonal subspaces of the residual stream, which is what the block-diagonal data generator would predict.

Code can be found [here](https://github.com/RollingRo11/simplex).

---

## Non-Ergodic Training Dataset

I set up 3 Mess3 processes for the non-ergodic training dataset.

| Process | $\alpha$ | $x$ |
|---------|----------|------|
| Mess3 A | 0.50 | 0.20 |
| Mess3 B | 0.75 | 0.10 |
| Mess3 C | 0.85 | 0.05 |

![Belief state geometry for each Mess3 process on the 2-simplex.](/simplex/mess3/belief_geometry.png)

I train a 2 layer Transformer model ($d_{\text{model}} = 64$, 4 heads, $d_{\text{mlp}} = 256$, context length 12) for 50k steps with batch size 2048 and Adam ($\text{lr} = 3 \times 10^{-4}$, no weight decay).

![Training loss over 50k steps (probably trained for too long here). Dashed line indicates the entropy of a uniform distribution over 3 tokens ($\log 3 \approx 1.099$).](/simplex/training/loss.png)

### Why is this type of structure interesting and/or relevant to language models?

Think about the token `i` in a language model. After `"love"`, the model knows it's in a conversational context. After `"n range(5):"`, that same `i` is a Python loop variable. Same token, completely different internal representation. The model has to figure out which context it's in from the tokens alone.

Our 3-Mess3 mixture works the same way. All three processes emit from the same vocabulary $\{0, 1, 2\}$, but with different transition and emission statistics. The model has to figure out which Mess3 it's looking at and track the belief state within that process. Token $0$ in Mess3 A means something different than token $0$ in Mess3 B.

---

## My Prediction

We can write the non-ergodic mixture as a single block-diagonal GHMM with 9 latent states (3 per Mess3 component). Before seeing any tokens, the predictive vector is uniform over all 9 states.

$$\beta^{\emptyset} = \frac{1}{9} [\underbrace{1, 1, 1}_{\text{Mess3A}}, \underbrace{1, 1, 1}_{\text{Mess3B}}, \underbrace{1, 1, 1}_{\text{Mess3C}}]$$

Because $T^{x}_{\text{big}}$ is block-diagonal, the three components' latent states never interact. The predictive vector decomposes as:

$$\beta^{x_{1:\ell}} = [w_A \cdot \beta_A^{x_{1:\ell}}, \quad w_B \cdot \beta_B^{x_{1:\ell}}, \quad w_C \cdot \beta_C^{x_{1:\ell}}]$$

where $w_A, w_B, w_C$ are posterior component weights (they sum to 1) and each $\beta_n^{x_{1:\ell}}$ is the within-component belief. The weights update via Bayes' rule:

$$w_n^{(\ell)} = \frac{w_n^{(\ell-1)} \cdot P(x_\ell \mid \text{component } n, \beta_n^{(\ell-1)})}{\sum_m w_m^{(\ell-1)} \cdot P(x_\ell \mid \text{component } m, \beta_m^{(\ell-1)})}$$

and each within-component belief updates independently with its own transition matrix.

**My main prediction: the residual stream will organize into three mutually orthogonal subspaces, one per Mess3 component, mirroring the block-diagonal structure of the data generator.**

Why? The GHMM's latent space is a direct sum by construction:

$$S = S_A \oplus S_B \oplus S_C = \mathbb{R}^3 \oplus \mathbb{R}^3 \oplus \mathbb{R}^3$$

The block-diagonal transitions keep these subspaces from ever interacting:

$$T^{x}_{\text{big}} \begin{pmatrix} v_A \\ v_B \\ v_C \end{pmatrix} = \begin{pmatrix} T^{x}_A v_A \\ T^{x}_B v_B \\ T^{x}_C v_C \end{pmatrix}$$

So the ground truth vectors already sit in three orthogonal subspaces of $\mathbb{R}^9$. If the transformer learns a linear map of these predictive vectors, that orthogonal structure should show up in the residual stream: three separate 2D subspaces (one per component's 2-simplex), each encoding that component's belief.

This is related to the factored world hypothesis[^1], but there's a key difference. In their paper, simultaneous independent factors live in a tensor-product latent space ($S = S_1 \otimes \cdots \otimes S_N$), and transformers *discover* the factorization, compressing exponential dimensionality down to linear. Our setup is simpler: the latent space is already a direct sum, and the orthogonal structure is baked into the data generator. I'm predicting the transformer *preserves* a factorization that's already there, rather than discovering a hidden one.

### Dimensionality

The full latent space is 9-dimensional (8 after normalization). Each component's belief geometry is a 2-simplex (2 degrees of freedom), and the three components sit in orthogonal subspaces. PCA across the full population of sequences would pick up variance from all three simultaneously: $3 \times 2 = 6$ effective dimensions.

### Geometry across context position

The geometry should also change as the model sees more tokens.

**Early positions** ($\ell = 1, 2$): The component weights are still near uniform ($w_A \approx w_B \approx w_C \approx 1/3$), so all three subspaces are active at once. Activations should look noisy.

**Later positions** ($\ell = 7, 8$): By now the weights have concentrated ($w \approx (1,0,0)$ or $(0,1,0)$ or $(0,0,1)$), so only one subspace matters per sequence. I'd expect three distinct clusters, with the fractal belief geometry of each respective Mess3 emerging inside its cluster.

### Geometry across layers

My guess is that earlier layers handle component identification (separating activations into the three orthogonal subspaces) and later layers refine the within-component belief. But with only 2 layers, these could easily happen in parallel.

---

## Residual Stream Geometry Analysis

A linear probe on the residual stream recovers each Mess3's belief geometry separately.

![Within-component belief recovery via linear regression from residual stream activations.](/simplex/belief/recovery_by_state.png)

The model also encodes which Mess3 generated the sequence. Regressing from activations to the full 9D joint belief vector and marginalizing over within-component states gives us the component posterior $w = (w_A, w_B, w_C)$ on the 2-simplex.

![Component posterior on the 2-simplex.](/simplex/belief/component_posterior.png)

The PCA below colors each point by process identity (hue) and within-state belief (shade). At the embedding layer, you only see the three discrete token identities. After layer 0, fractal simplex-like structure starts showing up, but the three processes still overlap in PC space. By the final layer at later positions, the three clusters fully separate, and each one contains its own internal belief simplex. The residual stream geometry points towards three copies of the 2-simplex sitting in $\mathbb{R}^{64}$.

![2D PCA of residual stream activations across layers and context positions. Hue encodes process identity (red/blue/green); shade variation within each cluster encodes within-component belief state. The progression from left to right (more context) and top to bottom (deeper layers) shows the model simultaneously separating process clusters and refining within-belief structure.](/simplex/pca/combined_geometry.png)

---

## Orthogonality

I predicted three mutually orthogonal subspaces, one per component. To test this, I fit linear probes to each $\beta_k$ and checked cross-subspace prediction: can process $k$'s beliefs be recovered from process $j$'s probe subspace?

In the final layer, off-diagonal $R^2$ is 0.92-0.98 (random baseline: 0.36). All three probes are reading from the same directions. But when I look across all layers concatenated, A's subspace *is* orthogonal to B and C (cosines $< 0.003$). B and C, on the other hand, heavily overlap (cosines up to 0.97). That tracks: B ($\alpha = 0.75, x = 0.10$) and C ($\alpha = 0.85, x = 0.05$) have similar parameters.

![Cross-subspace prediction $R^2$ (final layer).](/simplex/belief/cross_prediction.png)

![Probe weight cosine similarity (all layers concatenated). A is orthogonal to B and C (blank off-diagonal blocks), but B and C share directions (cosines up to 0.97).](/simplex/belief/concat/probe_cosine_similarity.png)

So the block-diagonal prediction is half right. A gets its own subspace. B and C share directions instead of maintaining separate ones.

---

## Conclusion

Thank you Paul and Adam for giving me the opportunity to do this work test. I'd never dipped my toes into computational mechanics before this weekend. It was an incredibly exciting challenge to learn everything, and apply it to this problem.

[^1]: Shai et al., "Transformers Represent Belief State Geometry in their Residual Stream", 2026.
