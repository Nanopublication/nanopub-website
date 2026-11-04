---
id: quickstart
title: Quick Start
slug: /
description: Fetch, query, verify, and publish nanopublications from the command line.
---

This page goes from reading nanopublications to publishing your own. Steps 1 and 2 only need `curl`. Steps 3 and 4 use the command-line tool, which needs Java 21 or newer.

## 1. Fetch a nanopublication

Every nanopublication has a resolvable URI. Ask for TriG and you get the RDF:

```bash
curl -L -H "Accept: application/trig" \
  https://w3id.org/np/RAlohixCBWPuGLSKA7mmR8k01EQvC_dRWwAU70kvvwKPo
```

Open the [same URI](https://w3id.org/np/RAlohixCBWPuGLSKA7mmR8k01EQvC_dRWwAU70kvvwKPo) in a browser and you get a human-readable view in Nanodash.
The [examples page](/docs/examples) has more to try.

## 2. Query the network

Published nanopublications are loaded into [Nanopub Query](https://query.knowledgepixels.com/) instances, which offer SPARQL endpoints.
These are the five most recent nanopublications:

```bash
curl -G https://query.knowledgepixels.com/repo/full \
  -H "Accept: text/csv" \
  --data-urlencode 'query=
    PREFIX npa: <http://purl.org/nanopub/admin/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?np ?label ?date WHERE {
      GRAPH npa:graph { ?np dct:created ?date ; rdfs:label ?label . }
    }
    ORDER BY DESC(?date) LIMIT 5'
```

The `npa:graph` graph holds metadata that the query service adds for each nanopublication, such as its label, its date, and the public key it was validly signed with.

Since nanopublications are immutable, old versions stay on the network.
This query finds all nanopublications whose assertion mentions a given beetle species, leaving out the ones that their authors retracted or superseded with a new version:

```bash
curl -G https://query.knowledgepixels.com/repo/full \
  -H "Accept: text/csv" \
  --data-urlencode 'query=
    PREFIX np: <http://www.nanopub.org/nschema#>
    PREFIX npa: <http://purl.org/nanopub/admin/>
    PREFIX npx: <http://purl.org/nanopub/x/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?np ?label ?date WHERE {
      GRAPH ?assertion { ?s ?p <https://www.gbif.org/species/1036789> }
      GRAPH npa:graph {
        ?np np:hasAssertion ?assertion ;
            rdfs:label ?label ;
            dct:created ?date ;
            npa:hasValidSignatureForPublicKey ?pubkey .
        FILTER NOT EXISTS {
          ?newer npx:invalidates ?np ; npa:hasValidSignatureForPublicKey ?pubkey .
        }
      }
    }'
```

To experiment, use the [SPARQL editor](https://query.knowledgepixels.com/tools/full/yasgui.html) in your browser.
There are also ready-made queries that run as a REST API. Each one is itself published as a nanopublication, and [this one](https://query.knowledgepixels.com/api/RAQqjXQYlxYQeI4Y3UQy9OrD5Jx1E3PJ8KwKKQlWbiYSw/get-queries.csv) lists all of them.

## 3. Verify a nanopublication

Download the command-line tool of [nanopub-java](https://github.com/Nanopublication/nanopub-java) from Maven Central:

```bash
V=$(curl -s https://repo1.maven.org/maven2/org/nanopub/nanopub/maven-metadata.xml \
  | sed -n 's:.*<release>\(.*\)</release>.*:\1:p')
curl -L -o nanopub.jar \
  https://repo1.maven.org/maven2/org/nanopub/nanopub/$V/nanopub-$V-jar-with-dependencies.jar
alias np='java -jar nanopub.jar'
```

Save the beetle nanopublication and check it:

```bash
curl -sL -H "Accept: application/trig" -o beetle.trig \
  https://w3id.org/np/RAlohixCBWPuGLSKA7mmR8k01EQvC_dRWwAU70kvvwKPo
np check beetle.trig
```

```text
Summary: 1 trusty with signature; 1 nanopub with issues
```

"Trusty with signature" means that the hash in the URI matches the content, and that the signature is valid.
The issue is only a warning that the nanopublication was created more than an hour ago, which matters when you publish a new one (`np check -v` shows the details).

Now change a single label and check again:

```bash
sed 's/Linnaeus, 1758"/Linnaeus"/' beetle.trig > tampered.trig
np check tampered.trig
```

```text
Looks like a trusty nanopub BUT VERIFICATION FAILED: https://w3id.org/np/RAlohixCBWPuGLSKA7mmR8k01EQvC_dRWwAU70kvvwKPo
Summary: 1 valid (not trusty); 1 nanopub with issues
```

## 4. Publish your own

Create a key pair. It is written to `~/.nanopub/`, and existing keys are never overwritten:

```bash
np mkkeys
```

Write a nanopublication. It uses a temporary URI, which signing replaces with the final, hash-based one:

```bash
cat > hello.trig <<EOF
@prefix this: <http://purl.org/nanopub/temp/np001/> .
@prefix sub: <http://purl.org/nanopub/temp/np001/> .
@prefix np: <http://www.nanopub.org/nschema#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix orcid: <https://orcid.org/> .
@prefix wd: <http://www.wikidata.org/entity/> .
@prefix wdt: <http://www.wikidata.org/prop/direct/> .

sub:Head {
  this: a np:Nanopublication ;
    np:hasAssertion sub:assertion ;
    np:hasProvenance sub:provenance ;
    np:hasPublicationInfo sub:pubinfo .
}

sub:assertion {
  wd:Q148 wdt:P36 wd:Q956 .  # China - capital - Beijing
}

sub:provenance {
  sub:assertion prov:wasAttributedTo orcid:0000-0002-1825-0097 .
}

sub:pubinfo {
  this: dct:created "$(date -u +%Y-%m-%dT%H:%M:%SZ)"^^xsd:dateTime ;
    dct:creator orcid:0000-0002-1825-0097 ;
    dct:license <https://creativecommons.org/licenses/by/4.0/> ;
    rdfs:label "The capital of China is Beijing" .
}
EOF
```

Replace `0000-0002-1825-0097` with your own ORCID iD. This one belongs to Josiah Carberry, ORCID's fictional test researcher.
Then sign the nanopublication and publish it to the **test server**:

```bash
np sign -s https://orcid.org/0000-0002-1825-0097 -o hello.signed.trig hello.trig
np publish -u https://test.registry.knowledgepixels.com/ hello.signed.trig
grep '@prefix this:' hello.signed.trig
```

The last line shows the trusty URI of your new nanopublication.
`publish` may warn that no templates are declared. Templates only matter for how [Nanodash](https://nanodash.knowledgepixels.com/) displays and edits a nanopublication, so you can ignore this warning here.

Two things to know before you publish on the live network, which is what `publish` does without `-u`:

- **Nothing can be deleted.** You can supersede a nanopublication with a new version, or retract it with `np retract`, but the original stays on the network.
- **Your key has to be linked to you.** A signature proves which key signed, not who owns the key. For your nanopublications to be attributed to your ORCID iD, you declare your key in an introduction nanopublication ([example](https://w3id.org/np/RASg5YBHpsSUMkLa4RVy55dTDZL9XA-Q3F-lqDIc9Jm7Q)), which an already trusted user then endorses. Nanodash can set this up for you when you log in with your ORCID iD.

## From code

The same steps in JavaScript with [nanopub-js](https://github.com/nanopublication/nanopub-js) (`npm install @nanopub/nanopub-js`):

```js
import { Nanopub, NanopubClient } from '@nanopub/nanopub-js';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';

// Fetch and search
const client = new NanopubClient();
console.log(await client.fetchNanopub(
  'https://w3id.org/np/RAlohixCBWPuGLSKA7mmR8k01EQvC_dRWwAU70kvvwKPo'));
for await (const row of client.findNanopubsWithText('Carabus granulatus')) {
  console.log(row.np, row.label);
}

// Sign and publish to the test server
const np = Nanopub.fromRdf(readFileSync('hello.trig', 'utf8'), 'trig', {
  privateKey: readFileSync(`${homedir()}/.nanopub/id_rsa`, 'utf8'),
  orcid: 'https://orcid.org/0000-0002-1825-0097',
});
await np.sign();
const { uri } = await np.publish('https://test.registry.knowledgepixels.com/np/');
console.log(uri);
```

There are also libraries for Python, Java, and Rust, listed under [Tools](/docs/tools).

## Next steps

- Read the [guidelines](/docs/guidelines) for the formal structure of nanopublications.
- See how the network fits together in the [technical architecture](/docs/architecture).
- Create nanopublications from templates in your browser with [Nanodash](https://nanodash.knowledgepixels.com/).
- Let an AI coding agent do all of the above with the [nanopub Agent Skill](https://github.com/knowledgepixels/nanopub-skill).
- Ask questions in the [Matrix channel](https://matrix.to/#/#nanopub:matrix.org).
