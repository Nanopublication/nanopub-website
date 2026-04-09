import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import DOMPurify from "dompurify";
import { NanopubClient } from "@nanopub/nanopub-js";
import MDSessions from "./previous-sessions.md";

export type NanoSession = {
  number: number;
  label: string;
  iri?: string;
  nanopub?: string;
  description?: string;
  date?: string;
};

function extractSessionNumber(label: string): number | undefined {
  const match = label.match(/#\s*(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

function extractSessionDetails(jsonld: any) {
  const assertion = jsonld.find((e: any) => e["@id"]?.endsWith("/assertion"))?.[
    "@graph"
  ]?.[0];
  if (!assertion) return {};
  return {
    label:
      assertion["http://www.w3.org/2000/01/rdf-schema#label"]?.[0]?.["@value"],
    description:
      assertion["http://purl.org/dc/terms/description"]?.[0]?.["@value"],
    startDate: assertion["http://schema.org/startDate"]?.[0]?.["@value"],
  };
}

function SessionsTOC({
  headings,
}: {
  headings: { id: string; label: string }[];
}) {
  return (
    <nav style={{ position: "sticky", top: "1rem" }}>
      <strong>Sessions</strong>
      <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0" }}>
        {headings.map((h) => (
          <li key={h.id} style={{ margin: "0.25rem 0" }}>
            <a href={`#${h.id}`}>{h.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function SessionsPage() {
  const [dynamicSessions, setDynamicSessions] = useState<NanoSession[]>([]);
  const [headings, setHeadings] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const MIN_SESSION = 27; // start of nanopub based sessions

  useEffect(() => {
    async function loadSessions() {
      const client = new NanopubClient();
      const results: NanoSession[] = [];

      for await (const row of client.runQueryTemplate(
        "RAtZM16vOCcoQ_W_nDS3lKwp2oOIZc515ZS2fz4X-IG2g/get-sub-resources",
        { super_resource: "https://w3id.org/spaces/nanopub/nanosessions" }
      )) {
        const label = row.resource_label;
        const iri = row.resource;
        const npIri = row.np;
        if (!label || !iri || !npIri) continue;

        const number = extractSessionNumber(label);
        if (!number || number < MIN_SESSION) continue;

        const nanopub = await client.fetchNanopub(npIri, "jsonld");
        const details = extractSessionDetails(nanopub);

        results.push({
          number,
          label: details.label ?? label,
          iri,
          nanopub: npIri,
          description: details.description,
          date: details.startDate,
        });
      }

      setDynamicSessions(results.sort((a, b) => b.number - a.number));
      setLoading(false);
    }

    loadSessions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const h3s = Array.from(document.querySelectorAll("h3"));
      const seen = new Set<string>();
      const allHeadings = h3s
        .map((h) => ({ id: h.id, label: h.textContent || "" }))
        .filter((h) => {
          if (seen.has(h.id)) return false;
          seen.add(h.id);
          return true;
        });
      setHeadings(allHeadings);
    }, 50);
    return () => clearTimeout(timer);
  }, [dynamicSessions]);

  function formatSessionDate(iso?: string) {
    if (!iso) return;
    const date = new Date(iso);
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  }

  return (
    <Layout title="Nano Sessions" description="All nanopublication sessions">
      <div
        className="container margin-vert--lg"
        style={{ display: "flex", gap: "2rem" }}
      >
        <main style={{ flex: 1, maxWidth: "800px" }}>
          <h1>Nano Sessions</h1>
          <p>
            The Nano Sessions connect the people who are interested in
            nanopublications and who want to learn from each other about the
            related technologies. Every session consists of two 10-minute talks,
            discussion, and a news sharing part. See the{" "}
            <a
              href="https://docs.google.com/document/d/1-0aImR4bFHmay8j6bSFgIDi9sw01KXdmYw9szyhAWmY/edit#"
              target="_blank"
              rel="noopener noreferrer"
            >
              description
            </a>{" "}
            for more information.
          </p>
          <p>
            <a
              href="https://knowledgepixels.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Knowledge Pixels
            </a>{" "}
            hosts the first meetings, but we are happy to let others join and
            become hosts too. Do you want to share some insights, a problem you
            can’t solve, or a use case you are working on? Send an{" "}
            <a href="mailto:virginia@knowledgepixels.com">email</a> to get a
            slot in an upcoming session.
          </p>
          <h2>Important Links</h2>
          <ul>
            <li>
              All sessions are in this{" "}
              <a
                href="https://vu-live.zoom.us/j/91057846609?pwd=ON5eF2Ovs1fY8KQUCnEvSM2Eltfod1.1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Zoom channel
              </a>
              . Anyone can join without registration.
            </li>
            <li>
              We use these{" "}
              <a
                href="https://docs.google.com/document/d/1_vL-hxsHGcy85g7EIUdLesztXFofQ9QW4VdZG3K5J8g/edit#"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                notes{" "}
              </a>{" "}
              during the sessions and for the record.
            </li>
            <li>
              The meetings are open to everyone and invitations are sent out by
              email. Subscribe to our{" "}
              <a
                href="https://groups.google.com/g/nanopub-users/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Group
              </a>{" "}
              by hitting <em>Ask to join group</em> and be notified.
            </li>
          </ul>
          {loading ? (
            <p>Loading Nano Sessions...</p>
          ) : (
            <>
              <section>
                {dynamicSessions.map((s) => (
                  <div key={s.number}>
                    <h3 id={`nano-session-${s.number}`}>{s.label}</h3>
                    {s.date && (
                      <p>
                        <em>{formatSessionDate(s.date)}</em>
                      </p>
                    )}
                    {s.description && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(s.description),
                        }}
                      />
                    )}
                  </div>
                ))}
              </section>
              <section>
                <MDSessions />
              </section>
            </>
          )}
        </main>

        <aside style={{ width: "220px" }}>
          <SessionsTOC headings={headings} />
        </aside>
      </div>
    </Layout>
  );
}
