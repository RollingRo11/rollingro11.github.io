---
title: "Exploring how transformers represent dataset geometry"
date: "2026-03-23"
summary: "Can transformers learn geometric information about a dataset? Maybe! I briefly explain one framework to reason about this using transformers and a toy dataset, and then dive into some experiments building ontop of it."
---

Large language models are a tangled web of different internal mechanisms that represent the model's training process over a large dataset. What if we knew some geometric fact about the dataset? Does the model learn the same geometry internally? [Simplex](https://www.simplexaisafety.com/) says that they do!


## What the hell is a simplex?

A simplex is the simplest possible shape in any dimension: a line segment in 1D, a triangle in 2D, a tetrahedron in 3D. Any probability distribution over $N$ outcomes lives on an $(N{-}1)$-simplex, since the probabilities must be non-negative and sum to 1. A distribution over 3 outcomes is a point on the 2-simplex (a triangle).

Paul Riechers and Adam Shai ([Simplex](https://www.simplexaisafety.com/)) set off to understand if a transformer can learn its dataset's "belief state geometry". The idea: if the data comes from a hidden Markov model (HMM), then at each token position there's a ground-truth belief vector, a probability distribution over latent states given the observed history. 

These belief vectors trace out a fractal geometry on the simplex that's entirely determined by the HMM's parameters. Riechers and Shai showed that transformers trained on such data linearly encode this belief geometry in their residual stream activations. The model doesn't just predict the next token well; it internally reconstructs the geometric structure of the data-generating process.

![Belief state geometry emerging in the residual stream over training. From Shai et al., NeurIPS 2024.](/simplex/mess3/overview.png)

I was lucky enough to perform a worktest for Simplex’s MATS stream! Their assignment pushes this even further: what happens when the data comes from a ***mixture* of HMMs**? Now the model has to do two things at once: figure out which process generated the sequence, **and** track the belief state within that process.


## The setup

I set up 3 Mess3 processes for the training dataset.

| Process | $\alpha$ | $x$ |
|---------|----------|------|
| Mess3 A | 0.50 | 0.20 |
| Mess3 B | 0.75 | 0.10 |
| Mess3 C | 0.85 | 0.05 |

![Belief state geometry for each Mess3 process on the 2-simplex.](/simplex/mess3/belief_geometry.png)

I then train a 2 layer Transformer model ($d_{\text{model}} = 64$, 4 heads, $d_{\text{mlp}} = 256$, context length 12) for 50k steps with batch size 2048 and Adam ($\text{lr} = 3 \times 10^{-4}$, no weight decay).

![Training loss over 50k steps (probably trained for too long here). Dashed line indicates the entropy of a uniform distribution over 3 tokens ($\log 3 \approx 1.099$).](/simplex/training/loss.png)

### How is this type of structure relevant to language models?

Think about the token `i` in a language model. After `"love"`, the model knows it's in a conversational context. After `" in range(5):"`, that same `i` is a Python loop variable. Same token, completely different internal representation. The model has to figure out which context it's in from the tokens alone.

Our 3-Mess3 mixture works the same way. All three processes emit from the same vocabulary $\{0, 1, 2\}$, but with different transition and emission statistics. The model has to figure out which Mess3 it's looking at and track the belief state within that process. Token $0$ in Mess3 A means something different than token $0$ in Mess3 B.

---

## My Prediction

*For Simplex’s work test, I was asked to predict the geometry of the residual stream with respect to our Mess3 mixture. I came up with the following:*

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

This is related to the factored world hypothesis[^1], but there's a key difference. In their paper, simultaneous independent factors live in a tensor-product latent space ($S = S_1 \otimes \cdots \otimes S_N$), and transformers *discover* the factorization, compressing exponential dimensionality down to linear. Our setup is simpler: the latent space is already a direct sum, and the orthogonal structure is baked into the data generator. I was predicting the transformer would *preserve* a factorization that's already there, rather than discovering a hidden one.

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

*Here's where I got to test whether my predictions held up.*

I trained a linear probe on the residual stream, and found that it recovered each Mess3's belief geometry separately.

![Within-component belief recovery via linear regression from residual stream activations.](/simplex/belief/recovery_by_state.png)

The model also encoded the geometry representing *which* Mess3 generated the sequence. I regressed from activations to the full 9D joint belief vector and marginalized over within-component states, which gave me the component posterior $w = (w_A, w_B, w_C)$ on the 2-simplex.

![Component posterior on the 2-simplex.](/simplex/belief/component_posterior.png)

I ran PCA on the residual stream activations, coloring each point by process identity (hue) and within-state belief (shade). At the embedding layer, you can only see the three discrete token identities. After layer 0, fractal simplex-like structure started showing up, but the three processes still overlapped in PC space. By the final layer at later positions, the three clusters fully separated, and each one contained its own internal belief simplex. The residual stream geometry pointed towards three copies of the 2-simplex sitting in $\mathbb{R}^{64}$.

![](/simplex/pca/combined_geometry.png)

---

## Orthogonality

I originally predicted **three mutually orthogonal subspaces** (one per component). To test this, I fit linear probes to each $\beta_k$ and checked cross-subspace prediction: could process $k$'s beliefs be recovered from process $j$'s probe subspace?

Looking across all layers concatenated, A's subspace *was* orthogonal to B and C (cosines $< 0.003$). B and C, on the other hand, heavily overlapped (cosines up to 0.97). That tracked: Mess3B & Mess3C have similar parameters!

![Probe weight cosine similarity (all layers concatenated). A is orthogonal to B and C (blank off-diagonal blocks), but B and C share directions (cosines up to 0.97).](/simplex/belief/concat/probe_cosine_similarity.png)

So, in the end, my block-diagonal prediction was half right! A got its own subspace. B and C shared directions instead of maintaining separate ones.

---

## Conclusion

Learning about residual stream geometry was incredibly exciting. While I was unfortunately not selected to join Simplex through MATS this summer, they liked this work test enough to interview me and we had an incredible conversation over future directions. I’m excited to see where Adam and Paul will take this framework, and particularly look forward to seeing residual stream geometry used as a ground truth to evaluate unsupervised methods adjacent to sparse dictionary learning.

[^1]: Shai et al., "Transformers Represent Belief State Geometry in their Residual Stream", 2026.
