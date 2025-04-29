---
id: network
title: Architecture and Network
---

## Overall Architecture

Nanopublications are published in a **decentralized ecosystem of services and applications**.

This is the overall architecture of the current nanopublication ecosystem:

<div style={{width: '100%', textAlign: "center"}}>
  <img src="/img/nanopub-architecture.svg" alt="Nanopublication" style={{maxWidth: '100%', maxHeight: '100%'}} />
  (arrows represent data flow; gray components are yet to be developed)
</div>


## Core Components

**Nanopub Registry** is the second-generation kind of service for publishing and retrieving nanopublications in a decentralized fashion: ([instance](https://registry.knowledgepixels.com/), [code](https://github.com/knowledgepixels/nanopub-registry)).

**Nanopub Query** ([instance](https://query.knowledgepixels.com/), [code](https://github.com/knowledgepixels/nanopub-query)) forms the second-generation of services to query nanopublications.
They allow for decentrally querying the published nanopublications via a number of SPARQL endpoints covering different subsets and aspects of nanopublications.

**Nanodash**  ([instance](https://nanodash.knowledgepixels.com/), [code](https://github.com/knowledgepixels/nanodash)) is a general client and user interface for nanopublications,
It allows for user-friendly browsing, querying, and publishing nanopublications, but can also be used as an API and intermediary layer for other services to build upon.


## Auxiliary Components

The **Nanopub Monitor** ([instance](http://purl.org/nanopub/monitor), [code](https://github.com/tkuhn/nanopub-monitor/)) is a service to observe the services running the core components of the nanopublication ecosystem.

**Vodex** ([code](https://github.com/knowledgepixels/vodex/)) is a vocabulary index service, used to provide auto-complete on third-party vocabularies.

**nanopub-http** ([code](https://github.com/knowledgepixels/nanopub-http/)) is a service that provides features of the nanopublication libraries, most importantly for signing and publishing, over HTTP.


## Libraries

See [Tools](/docs/tools).