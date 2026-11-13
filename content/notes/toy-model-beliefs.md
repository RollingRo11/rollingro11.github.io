---
title: "Background for toy models of various belief representations"
date: "2026-11-13T15:15:46Z"
---

*This is a huge literature review on previous toy work on belief states, which might be useful when trying to reason about how larger models operate/internally represent beliefs*

A potential nice small output to have as part of this exploratory phase is a more meta analysis[^1] of what we believe beliefs are, and how a transformer can represent them. This might be *too* toy, but I think even if we never use or publish this toy model it can be helpful to think *as if we were* to make clear our assumptions of beliefs.


## Reading Between the Dots: Decoding Hidden Computation across Filler Tokens [(Brauer et al., 2026)](https://arxiv.org/abs/2607.03502)

Kaley Brauer, who was at CBAI, found that if you provide the model dots to reason across, it becomes better at answering questions!

![](/notes/toy-model-beliefs/filler-tokens-decoding.png)
__Figure 1: ⁣__*Without filler the model fails (left); with filler, it succeeds (middle); our unsupervised pipeline decodes the intermediates (A1 = 77, A2 = 35) and their sum (112) from the residual stream at filler positions (right)*

She also found that filler tokens just generally improve reasoning over time, even when you aren’t using dots explicitly, and that it generalizes!

![](/notes/toy-model-beliefs/filler-tokens-uplift.png)

**Figure 2:** *Filler tokens improve accuracy across tasks, models, and filler types. Uplift increases with filler length until, at very long lengths, it asymptotes and degrades. Top left: 1-fact addition on DeepSeek V3 (API; 800 examples); all filler types give comparable uplift while scrambled variants underperform. Top right: 2-fact addition on DeepSeek V3 and Kimi K2 (4-bit quantized; 1500 examples). Bottom left: 2-hop letter position on both models (API; 637 examples; dot filler). Bottom right: system of equations on both models (API; 800 examples).*

A cool excerpt from the paper: *“When filler tokens are present, the model shifts attention from the question to the filler tokens”*

For our toy model, having some standard [CoT] token might be beneficial here!

## On Limitation(s?) of Transformer for Learning HMMs [(Hu et al., 2024)](https://arxiv.org/pdf/2406.04089)

The authors show that transformers are much worse at converging to learn to generate HMM emissions than RNNs, in both speed to converge and accuracy. They solve this by giving the transformer the ability to reason via a CoT.

## Superposition, Memorization, and Double Descent [(Henighan et al., 2023)](https://transformer-circuits.pub/2023/toy-double-descent/index.html)

**(Transformer Circuits thread). TL;DR from the paper:** (Memorization = Overfitting)
- Overfitting corresponds to storing data points, rather than features, in superposition.
- Depending on dataset size, our models fall into two different regimes: an overfitting regime (characterized by storing data points in superposition), and a generalizing regime (characterized by storing features in superposition).
- We observe double descent as the model transitions between these regimes.

**This is super duper toy performed on the TMS**

$$h = W(x)$$
$$x’ = \text{ReLU}(W^\top h + b) = \text{ReLU}(W^\top W x + b)$$

![](/notes/toy-model-beliefs/double-descent.png)

## The geometry of nonergodic composition [(Ray et al., 2026)](https://belief-updates.pub/nonergodic-geometry/)

This was pretty much exactly my work test for Simplex’s MATS stream. The idea is that if you have a nonergodic[^2] dataset, the model can represent the various probabilities of different things happening as separate geometries in the residual stream.

![](/notes/toy-model-beliefs/nonergodic-geometry.png)
**Figure 1:** *In the setting studied here, each token sequence comes from one of multiple generators (here, Component $\text{Mess3}_A$ or $\text{Mess3}_B$). As tokens are read, an ideal next-token predictor holds two beliefs at once: a belief about which component is generating the tokens and a belief about what internal latent state that component is in (a point $η_A$​ or $η_B$​ in that component’s belief simplex; drawn are all the belief states the component can reach). Their products, $w_Aη_A​$ and $w_Bη_B$, are the predicted geometry. The belief states over all weights fill a cone, and the slice at the current weight slides along it as evidence accumulates; one grows while the other shrinks. Together they are the composition’s belief, $η=(wA, wB)$. Right: A linear probe for the belief geometry, applied to the residual-stream; the highlighted points are the contexts whose posterior matches the one being read.*

I include this because I think Mess3 processes or HMMs in general are very easy to manipulate, meaning we can come up with analogous toy settings easily with them. This paper just shows we can have different HMMs and combine them to develop a diverse dataset (not diverse in content, but in pattern).

## Desiderata

More importantly than any of these ideas above, we want our toy model to be an apt representation of how LLMs (explicitly or implicitly) reason, generalize, and memorize.

[^1]: Not to be confused with [meta-analysis](https://en.wikipedia.org/wiki/Meta-analysis) 🫪
[^2]: *”A non-ergodic system is one where a single element's average trajectory over time does not equal the average outcome of the entire group (the ensemble average) at a single point in time”*