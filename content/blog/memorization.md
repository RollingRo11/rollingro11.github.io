---
title: "Preserving knowledge via dataset-specific loss curvature"
date: "2026-01-30"
summary: "You can see what a model has memorized vs. what it knows by looking at the curvature of its loss landscape. I extend this method with domain-specific Hessians to preserve math reasoning."
---

I like this quote from Andrej's conversation with Dwarkesh on the Dwarkesh Podcast:
> _"One thing [agents are] not very good at is going off the data manifold of what exists on the internet. If they had less knowledge or less memory, actually maybe they would be better. […] I actually think we need to figure out ways to remove some of the knowledge and to keep what I call this cognitive core" [^1] [^2]_

If we want really, truly intelligent models, we might want them to _generalize as much knowledge as possible_. We should think the same for humans! Memorizing that $7 \cdot 7 = 49$ is fast, but not as useful as **knowing how to multiply**.

Researchers from Goodfire set out to try and **remove** memorized information from models and see how they perform! They aren't the first ones to do this:

---

### BalancedSubnet (BSN)

BalancedSubnet is an unlearning-based method for mitigating memorization in language models, introduced by Sakarvadia et al.[^3] It builds on a simpler method called **Subnet**, which trains a binary mask over model weights to locate sparse subnetworks responsible for memorization, then prunes them. The problem with Subnet alone is that it can't distinguish whether those subnetworks are also used for non-memorization tasks—pruning them may hurt general performance.

BalancedSubnet fixes this by adding a second term to the mask optimization objective that penalizes removing weights important for non-memorized sequences. Given model weights $\theta$, learnable importance scores $s$, and a pruning ratio $p$, Subnet constructs a binary mask $M = \text{topk}(p, s)$ that zeros out the highest-scoring weights per layer. Only $s$ is optimized—$\theta$ stays frozen. Subnet minimizes the loss on memorized data $\mathcal{D}_\text{mem}$ through $s$, so that pruning the identified subnetwork removes memorization.

---

## What Goodfire found

Merullo et al.[^4] finds a different way of reasoning about how models memorize: claiming the **curvature** of the loss function might reveal what a model has memorized vs. what it "knows".

### The method

Merullo et al. exploits a connection between memorization and the curvature (second derivative) of the model's loss. When you compute how sharply the loss reacts to weight perturbations, and average this behavior across a large datset you get a spectrum:

- High-curvature directions are used consistently across many examples (generalizing circuits)
- Low-curvature directions are used idiosyncratically for specific examples (memorization).

The authors use K-FAC to efficiently approximate this curvature by collecting activation and gradient statistics as data flows through each MLP layer.

Specifically, they accumulate the covariance of activations **entering** each weight matrix and the covariance of gradients **exiting** it. They then take the Kronecker product (multiplying every value) of these two covariance matrices to approximate what's called the Fisher Information Matrix. This gives us a matrix of information equivalent to the Hessian, or second derivative $\text{w.r.t.}$ the loss (showing us curvature).

![](https://arxiv.org/html/2510.24256v2/x1.png)

Eigendecomposing these covariances lets them rank weight components by curvature. The eigenvalue of each component is the product of the corresponding activation and gradient eigenvalues. The authors remove components below a curvature threshold, suppressing memorization while preserving general capabilities.

$$
A = \mathbb{E}[aa^\top], \quad G = \mathbb{E}[gg^\top]
$$

$$
F_W \approx G \otimes A
$$

$$
G = U_G \, \text{diag}(\lambda) \, U_G^\top, \quad A = U_A \, \text{diag}(\mu) \, U_A^\top
$$

$$
\Pi_{ij} = \lambda_i \mu_j \quad \text{(curvature mass of component } i,j \text{)}
$$

#### Intuition

- "Sharp directions" above the curve threshold are kept because if they are sharp in the Hessian they have a large influence on the loss across the whole dataset.  We can infer that this is information that the model has learned to apply to multiple different types of problems!
- "Flat directions" under the curve threshold are removed because being flat on average means they aren't important in the context of the whole dataset (but might be in the context of a single example!)

#### Why math might suffer

The problem is that any concept represented as a minority in the training data can appear low-curvature in the general Hessian (even if computationally important).

For example, the following screenshot from Goodfire's blogpost shows OLMo-2-7B before and after the top-$k$ eigenvectors have been removed:

![](https://research-posts.s3.amazonaws.com/kfac-gsm8k-example.png)

So I hypothesized a way to fix it by "zooming in" our dataset context to look at eigenvectors specifically related to a topic!

## A tale of two (or more) Hessians

My idea to improve math performance is to compute additional, domain-specific Hessians by running the same procedure on domain-specific data. The idea is that within a more focused distribution, domain-specific circuits appear high-curvature because they're used/seen more frequently rather than being diluted across diverse text.

$$
A_{\text{general}} = \mathbb{E}_{x \sim \mathcal{D}_{\text{general}}}[aa^\top], \quad G_{\text{general}} = \mathbb{E}_{x \sim \mathcal{D}_{\text{general}}}[gg^\top]
$$

$$
A_{\text{math}} = \mathbb{E}_{x \sim \mathcal{D}_{\text{math}}}[aa^\top], \quad G_{\text{math}} = \mathbb{E}_{x \sim \mathcal{D}_{\text{math}}}[gg^\top]
$$


To apply this, we preserve the top-$k$% of eigenvector pairs from the union of high-curvature directions from both Hessians.

$$
\mathcal{S}_{\text{general}} = \left\{ (i,j) : \sum_{(i,j) \in \mathcal{S}} \Pi_{ij}^{\text{general}} \geq \rho \cdot M_{\text{tot}}^{\text{general}} \right\}
$$

$$
\mathcal{S}_{\text{math}} = \left\{ (i,j) : \sum_{(i,j) \in \mathcal{S}} \Pi_{ij}^{\text{math}} \geq \rho \cdot M_{\text{tot}}^{\text{math}} \right\}
$$

$$
\mathcal{S}_{\text{final}} = \mathcal{S}_{\text{general}} \cup \mathcal{S}_{\text{math}}
$$

$$
W_{\text{edited}} = \sum_{(i,j) \in \mathcal{S}_{\text{final}}} C_{ij} \, u_i v_j^\top, \quad \text{where } C_{ij} = u_i^\top W v_j
$$

I also use an $\alpha$ value control how much you weight domain-specific knowledge.($\alpha = 0$ means we don't use the math Hessian whatsoever, $\alpha = 1$ means they're equally weighted, $\alpha > 1$ means that the math Hessian dominates). So, concretely:

$$
S_{\text{final}} = S_{\text{general}} + \alpha \cdot S_{\text{math}}
$$

## Results

I got some *very* interesting results that might help us reason about what **in** math models are memorizing vs. actually learning!

### GSM8K scores across defense Hessian configurations

| **Configuration** | **General removed** | **General + GSM8K (Train)** | **General + MetaMathQA** | **General + SimpleMath** | **BASE (no removal)** |
|---|---|---|---|---|---|
| **Score (GSM8K)** | 33.43% | 32.37% | 39.50% | **43.67%** | 56.56% |

For context, here's a quick description of each dataset:

- **[SimpleMath](https://huggingface.co/datasets/fblgit/simple-math):** 500,000 examples of simple arithmetic (addition, subtraction, division, multiplication).
- **[GSM8K-Train](https://huggingface.co/datasets/openai/gsm8k):** ~7,000 examples of grade 2-8 multi-step word problems.
- **[MetaMathQA](https://huggingface.co/datasets/meta-math/MetaMathQA):** ~400,000 examples augmented from GSM8K and MATH datasets. Varied difficulty levels.

### Best Result

Increasing top-$k$ to 0.7 and pinning $\alpha = 0.5$ allowed us to get shockingly close to the original benchmark! Comparing our final (very messily hyperparameter swept) results to the original paper's result comparison:

| **Metric** | **Baseline** | **BSN** | **(paper) K-FAC** | **(mine) general K-FAC** |**(mine) math-mixed K-FAC** | **SVD** |
|---|---|---|---|---|---|---|
| **Strict (%)** | 99.9 | 6.0 | 3.4 | 0.0280 | 3.8 | 3.0 |
| **Loose (%)** | 100.0 | 11.0 | 8.8 | 0.0760 | 7.6 | 6.8 |
| **Avg Lev ↑** | 0.002 | 0.860 | 0.704 | 0.7422 |0.739 | 0.754 |
| **GSM8K** | **56.56%** | - | - | 33.43% | **52.39%** | - |

**Here's what those stats actually mean:**

- **Strict (%):** Exact match rate. The percentage of sequences where the model reproduces the memorized suffix perfectly (lower is better).
- **Loose (%):** Near-match rate. The percentage of sequences where the normalized token-level Levenshtein similarity is $\geq 75\%$. This captures cases where the model almost reproduces the memorized text. Lower is better.
- **Avg Lev $\uparrow$:** Average normalized Levenshtein distance across all test sequences. Higher means the model's outputs are further from the memorized targets.


### What does this mean?

Specifically, we got the best results on GSM8K by performing the Hessian Union from the general information to the SimpleMath dataset. Tuning our $\alpha$ and `topk` hyperparameters, we can get shockingly close to the baseline GSM8K score of **56.56%**. We also *keep* around the same Loose memorization score of **~7.6%**. However, I do achieve a worse strict score (my **3.8%** vs. the OLMo-2-7B (BASE) with General K-FAC's score of 2.8%). I also get a worse average Levenshtein score, but only by about 0.001.

Generally, this setup with SimpleMath seems to be a really good tradeoff (noticable but minor hits to strict and avg. lev., no hit to loose) with a massive increase in math performance.

This suggests something similar to what Goodfire posits in their blogpost on this topic:

> _"Perhaps we shouldn't be so surprised that our edit affects arithmetic so strongly: when doing mental math, humans tend to rely heavily on memorized patterns like multiplication tables, and previous work has identified quite granular features involved in LLM arithmetic which correspond to adding specific ranges of numbers."_

Since SimpleMath is a dataset made up of just addition, subtraction, multiplication, and division, we have even more evidence that **this** type of arithmetic is what models "memorize" the most! It also had the greatest effect on our GSM8K performance.

## Future Directions

My goal here was to see if we can continue to more deeply understand what models memorize in specific domains. It's an extremely interesting finding that models seem to *memorize* simple arithmetic "facts", similarly to how they do general knowledge.

I'm excited to apply this method to other tasks, like factual recall, and see how the model performs! It would be great to understand what models memorize in domain-specific context!

---

[^1]: This is also quoted by Goodfire in their [blogpost](https://www.goodfire.ai/research/understanding-memorization-via-loss-curvature#) on this topic. I thought it was the best representation of why we might want to understand more about when an LLM is _memorizing_ vs. _understanding_.

[^2]: [Dwarkesh Podcast: Andrej Karpathy — "We're summoning ghosts, not building animals"](https://youtu.be/lXUZvyajciY?si=Ji6wygIjDslulXZH&t=807) (starts at 13:27)

[^3]: [Mitigating Memorization in Language Models](https://arxiv.org/abs/2410.02159) (2024)

[^4]: [From Memorization to Reasoning in the Spectrum of Loss Curvature](https://arxiv.org/abs/2510.24256) (2025)
