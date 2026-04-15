import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import { NanopubClient } from "@nanopub/nanopub-js";
import MDSessions from "./previous-sessions.md";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "nanopub-item": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { uri?: string },
        HTMLElement
      >;
    }
  }
}

type SessionRow = { number: number; np: string; label: string };

const MIN_SESSION = 27;

function extractSessionNumber(label: string): number | undefined {
  const m = label.match(/#\s*(\d+)/);
  return m ? parseInt(m[1], 10) : undefined;
}

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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

const ITEM_TEMPLATE = `
<template>
  <h3 data-bind="label"></h3>
  <p><em data-bind="startDate" data-format="datetime"></em></p>
  <div data-bind-html="description"></div>
</template>
`;

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [headings, setHeadings] = useState<{ id: string; label: string }[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Dynamic: the module calls customElements.define at load time, which throws during SSR.
    import("@nanopub/nanopub-elements");
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const client = new NanopubClient();
      const rows: SessionRow[] = [];
      for await (const row of client.runQueryTemplate(
        "RAtZM16vOCcoQ_W_nDS3lKwp2oOIZc515ZS2fz4X-IG2g/get-sub-resources",
        { super_resource: "https://w3id.org/spaces/nanopub/nanosessions" },
      )) {
        const label = row.resource_label;
        const np = row.np;
        if (!label || !np) continue;
        const number = extractSessionNumber(label);
        if (!number || number < MIN_SESSION) continue;
        rows.push({ number, np, label });
      }
      if (cancelled) return;
      rows.sort((a, b) => b.number - a.number);
      setSessions(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const update = () => {
      const h3s = Array.from(root.querySelectorAll("h3"));
      const seen = new Set<string>();
      const all: { id: string; label: string }[] = [];
      for (const h of h3s) {
        const label = h.textContent?.trim() ?? "";
        if (!label) continue;
        if (!h.id) h.id = slugify(label);
        if (seen.has(h.id)) continue;
        seen.add(h.id);
        all.push({ id: h.id, label });
      }
      setHeadings(all);
    };
    const observer = new MutationObserver(update);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    update();
    return () => observer.disconnect();
  }, [sessions]);

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
          <section ref={sectionRef}>
            {sessions.map((s) => (
              <nanopub-item
                key={s.np}
                uri={s.np}
                dangerouslySetInnerHTML={{ __html: ITEM_TEMPLATE }}
              />
            ))}
          </section>
          <section>
            <MDSessions />
          </section>
        </main>

        <aside style={{ width: "220px" }}>
          <SessionsTOC headings={headings} />
        </aside>
      </div>
    </Layout>
  );
}
