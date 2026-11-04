---
id: tools
title: Tools
description: User interfaces, the command-line tool, libraries, and AI agent support for nanopublications.
---

These tools let you create, publish, and query nanopublications.
The [quick start](/docs/) shows the command-line tool and the JavaScript library in action.

## User interfaces

- [**Nanodash**](https://nanodash.knowledgepixels.com/) ([code](https://github.com/knowledgepixels/nanodash)) is a web interface for browsing, searching, and publishing nanopublications, with templates that make it easy to create them without writing RDF.
- The [**Knowledge Collaboratory**](https://collaboratory.semanticscience.org/) helps annotate biomedical text, publish those annotations as nanopublications, and browse them.

## Command line

The [nanopub-java](https://github.com/Nanopublication/nanopub-java) release jar is also a command-line tool, with commands such as `check`, `sign`, `publish`, `retract`, `query`, and `mkkeys`:

```bash
java -jar nanopub-<version>-jar-with-dependencies.jar check my-nanopub.trig
```

The jar is on [Maven Central](https://repo1.maven.org/maven2/org/nanopub/nanopub/), and the [quick start](/docs/) shows how to download the latest one.

## Libraries

| Language | Library | Install |
| --- | --- | --- |
| Java | [nanopub-java](https://nanopublication.github.io/nanopub-java/), the reference implementation | Maven: `org.nanopub:nanopub` |
| Python | [nanopub-py](https://nanopublication.github.io/nanopub-py/) | `pip install nanopub` |
| JavaScript / TypeScript | [nanopub-js](https://github.com/nanopublication/nanopub-js), for Node.js and the browser | `npm install @nanopub/nanopub-js` |
| Rust | [nanopub-rs](https://vemonet.github.io/nanopub-rs/), with bindings for Python and JavaScript | `cargo add nanopub` |

All of them can sign, verify, and publish nanopublications.

## AI agents

[**nanopub-skill**](https://github.com/knowledgepixels/nanopub-skill) is an Agent Skill that lets AI coding agents work with nanopublications in natural language: creating, signing, publishing, querying, superseding, and retracting them, as well as authoring templates, resource views, and Spaces.
It follows the open [Agent Skills](https://agentskills.io) format, and so works with Claude Code, OpenAI Codex, Gemini CLI, Cursor, GitHub Copilot, and many other agents.

## Related links

- More tools are in the [Nanopublication](https://github.com/Nanopublication/) and [Knowledge Pixels](https://github.com/knowledgepixels/) GitHub organizations.
- [Trusty URIs](https://trustyuri.net/) are the hash-based identifiers that nanopublications use.
- [A Robust Decentralized Infrastructure for Trust-Aware Open Knowledge Sharing](https://knowledgepixels.com/nanopub-ecosystem-paper/) (ISWC 2026) is the paper on the nanopublication ecosystem: its services, network, and trust algorithm.
