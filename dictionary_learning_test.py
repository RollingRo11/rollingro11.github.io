from nnsight import LanguageModel
from dictionary_learning.dictionary import AutoEncoder
import torch

from dictionary_learning import AutoEncoder
from circuitsvis.tokens import colored_tokens_multi

weights_path = "./dictionaries/pythia-70m-deduped/mlp_out_layer0/10_32768/ae.pt"
activation_dim = 512  # dimension of the NN's activations to be autoencoded
dictionary_size = 64 * activation_dim  # number of features in the dictionary

ae = AutoEncoder(activation_dim, dictionary_size)
ae.load_state_dict(torch.load(weights_path, weights_only=True, map_location=torch.device("cpu")))


model = LanguageModel("EleutherAI/pythia-70m-deduped", device_map="cpu")
tokenizer = model.tokenizer

prompt2 = """
have you ever played blox fruits with your life on the line, while having a BUNCH of mangos in your mouth? Heh. Well, this is called DARK MANGO PSYCHOLOGY. Now in dark mango psychology you will realise, the mangos ain't your normal mangos, they are DARK. And when you eat a mango you'll realise, that the seratonins inside the mangos go all the way to your brain. And then when it enters your brain and touches the membrane, it ACTIVATES something inside of you. You start to look at people like seeds, seeds waiting to get sprouted. And when that happens you will realise you are somewhere deep, somewhere VERY deep. Wanna guess where that is?
"""

prompt = """
Call me Ishmael. Some years ago--never mind how long precisely--having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people's hats off--then, I account it high time to get to sea as soon as I can.
"""

prompt3 = """
Solved by standard Gammas, unvarying Deltas, uniform Epsilons. Millions of
identical twins. The principle of mass production at last applied to biology.
“But, alas,” the Director shook his head, “we can’t bokanovskify indefinitely.”
Ninety-six seemed to be the limit; seventy-two a good average. From the sa-
me ovary and with gametes of the same male to manufacture as many batches
of identical twins as possible-that was the best (sadly a second best) that they
could do. And even that was difficult.
“For in nature it takes thirty years for two hundred eggs to reach maturity. But
our business is to stabilize the population at this moment, here and now. Drib-
bling out twins over a quarter of a century-what would be the use of that?”
Obviously, no use at all. But Podsnap’s Technique had immensely accelerated
the process of ripening. They could make sure of at least a hundred and fifty
mature eggs within two years. Fertilize and bokanovskify-in other words, mul-
tiply by seventy-two-and you get an average of nearly eleven thousand brothers
and sisters in a hundred and fifty batches of identical twins, all within two years
of the same age.
“And in exceptional cases we can make one ovary yield us over fifteen thousand
adult individuals.”
Beckoning to a fair-haired, ruddy young man who happened to be passing at
the moment. “Mr. Foster,” he called. The ruddy young man approached. “Can
you tell us the record for a single ovary, Mr. Foster?”
“Sixteen thousand and twelve in this Centre,” Mr. Foster replied without hesi-
tation. He spoke very quickly, had a vivacious blue eye, and took an evident
pleasure in quoting figures. “Sixteen thousand and twelve; in one hundred
and eighty-nine batches of identicals. But of course they’ve done much better,”
he rattled on, “in some of the tropical Centres. Singapore has often produced
over sixteen thousand five hundred; and Mombasa has actually touched the
seventeen thousand mark. But then they have unfair advantages. You should
see the way a negro ovary responds to pituitary! It’s quite astonishing, when
you’re used to working with European material. Still,” he added, with a laugh
(but the light of combat was in his eyes and the lift of his chin was challenging),
“still, we mean to beat them if we can. I’m working on a wonderful Delta-Minus
ovary at this moment. Only just eighteen months old. Over twelve thousand
seven hundred children already, either decanted or in embryo. And still going
strong. We’ll beat them yet.”
"""

# Extract layer 0 MLP output from base model
with model.trace(prompt3) as tracer:
    mlp_0 = model.gpt_neox.layers[0].mlp.output.save()

# Use SAE to get features from activations
features = ae.encode(mlp_0)
ae

# Find top features using the autoencoder
summed_activations = features.abs().sum(dim=1)  # Sort by max activations
top_activations_indices = summed_activations.topk(20).indices  # Get indices of top 20

compounded = []
for i in top_activations_indices[0]:
    compounded.append(features[:, :, i.item()].cpu()[0])

compounded = torch.stack(compounded, dim=0)

tokens = tokenizer.encode(prompt3)
str_tokens = [tokenizer.decode(t) for t in tokens]

# Visualize activations for top 20 most prominent features
html_out = colored_tokens_multi(str_tokens, compounded.T)

with open("token_visualization.html", "w", encoding="utf-8") as f:
    f.write(html_out._repr_html_())
