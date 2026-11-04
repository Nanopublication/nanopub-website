---
id: guidelines
title: Guidelines
description: The formal structure of nanopublications, in short.
---

The [Nanopublication Guidelines](https://nanopub.net/guidelines/working_draft/) specify the minimal formal structure of a nanopublication, and the [Nanopublication Schema](https://nanopub.net/nschema) defines its vocabulary in RDF.
This page summarizes them.

## Structure

A nanopublication is a set of RDF quads in four named graphs:

- The **assertion** graph holds the main content.
- The **provenance** graph says how the assertion came to be, and must refer to the assertion graph.
- The **publication info** graph has metadata about the nanopublication as a whole, such as its creator and creation time, and must refer to the nanopublication.
- The **head** graph ties the three together and identifies the nanopublication.

This is a minimal nanopublication in [TriG](https://www.w3.org/TR/trig/), the recommended syntax:

```trig
@prefix : <http://example.org/pub1/> .
@prefix ex: <http://example.org/> .
@prefix np: <http://www.nanopub.org/nschema#> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix orcid: <https://orcid.org/> .

:Head {
  : a np:Nanopublication .
  : np:hasAssertion :assertion .
  : np:hasProvenance :provenance .
  : np:hasPublicationInfo :pubinfo .
}

:assertion {
  ex:trastuzumab ex:is-indicated-for ex:breast-cancer .
}

:provenance {
  :assertion prov:wasDerivedFrom :experiment .
  :assertion prov:wasAttributedTo orcid:0000-0003-3934-0072 .
}

:pubinfo {
  : dct:creator orcid:0000-0003-0183-6910 .
  : dct:created "2020-07-10T10:20:22.382+02:00"^^xsd:dateTime .
}
```

## Well-formed nanopublications

A nanopublication is well-formed if:

- every triple is in one of the four graphs, and every graph has a URI;
- the head graph contains exactly one `rdf:type np:Nanopublication` triple, which identifies the nanopublication URI;
- the head graph links the nanopublication to exactly one assertion, one provenance, and one publication info graph;
- the URIs of the nanopublication and its four graphs are all different;
- the provenance graph refers to the assertion graph at least once, and the publication info graph refers to the nanopublication at least once.

## Identifiers

Nanopublications are immutable, and their identifiers make this checkable.
The recommended way is a [Trusty URI](https://trustyuri.net/): a URI that ends in a cryptographic hash of the nanopublication's content, like `RAlohixCBW...` in [this example](https://w3id.org/np/RAlohixCBWPuGLSKA7mmR8k01EQvC_dRWwAU70kvvwKPo).
Anyone who has the content can recompute the hash and check that it matches.
The URIs of the graphs and of other resources the nanopublication defines are derived from its URI, so they are fixed by the hash too.

## Signatures

In the current ecosystem, nanopublications are also signed.
The publication info graph then contains the creator's public key and a signature, and the trusty URI is computed over the signed content.
The [quick start](/docs/) shows how to sign, verify, and publish nanopublications.

## Learn more

- [Examples](/docs/examples) of published nanopublications
- [Tools](/docs/tools) to create and process nanopublications
- [A Robust Decentralized Infrastructure for Trust-Aware Open Knowledge Sharing](https://knowledgepixels.com/nanopub-ecosystem-paper/) (ISWC 2026), the paper on the nanopublication ecosystem
