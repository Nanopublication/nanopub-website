# What is a Nanopublication?

A nanopublication is a small knowledge graph snippet with metadata that is treated as an independent (scientific) publication.
This information in a nanopublication can be about anything, for example a relation between a gene and a disease or an opinion.
Nanopublications are expressed in a knowledge graph format that is formal and machine-interpretable.
With nanopublications, it is possible to disseminate individual data as independent publications with or without an accompanying research article.
Furthermore, because nanopublications can be attributed and cited, they provide incentives for researchers to make their data available in standard formats that drive data accessibility and interoperability.
Nanopublications have the following general structure:

<div style={{width: '100%', textAlign: "center"}}>
    <img src="/img/nanopub.png" alt="Nanopublication" style={{maxWidth: '100%', maxHeight: '100%'}} />
</div>

As can be seen in this image, a nanopublication has three basic elements:

1. **Assertion**: The assertion is the main content of a nanopublication in the form of an small atomic unit of information
2. **Provenance**: This part describes how the assertion above came to be.  This can include the scientific methods that were used to generate the  assertion, for example a reference to the kind of study that was  performed and its parameters.
3. **Publication Info**: This part contains metadata about the  nanopublication as a whole, such as when and by whom it was created and  the license terms for its reuse.

Nanopublications are implemented in the language RDF and come with an evolving ecosystem of tools and systems. They can be published to a  decentralized server network, for example, and then queried, accessed,  reused, and linked. To find out more, see the [guidelines](/docs), the [examples](/docs/examples), or the [published articles](https://scholar.google.com/scholar?hl=en&q=nanopublications) about nanopublications.

Nanopublications can also be created, published, and queried conversationally with AI coding agents, through the [nanopub Agent Skill](https://github.com/knowledgepixels/nanopub-skill).
