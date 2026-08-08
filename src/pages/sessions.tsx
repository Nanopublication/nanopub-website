import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import { NanopubClient } from "@nanopub/nanopub-js";
import MDSessions from "./previous-sessions.md";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "nanopub-item": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { uri?: string },
        HTMLElement
      >;
    }
  }
}

type SessionRow = {
  number: number;
  np: string;
  label: string;
  resource: string;
  subEvents: { np: string; label: string }[];
};

const MIN_SESSION = 27;
const QUERY_TEMPLATE = "RAGxWuFSWFeXyoCZiJpaVMwH-_9-fLX3GFPb5XI-KHIok/get-sub-resources";
const SUPER_RESOURCE = "https://w3id.org/spaces/nanopub/nanosessions";

const MAX_SESSIONS = 15;
// The markdown sessions are revealed once the nanopublished ones have rendered.
// If a fetch fails they never will, so show them anyway rather than stranding
// the whole list behind a request that is not coming back.
const REVEAL_FALLBACK_MS = 6000;

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

const ITEM_TEMPLATE = {
  __html: `
<template>
  <h3 data-bind="label"></h3>
  <p><em data-bind="startDate" data-format="datetime"></em></p>
  <div data-bind-html="description"></div>
</template>
`,
};

const SUB_ITEM_TEMPLATE = {
  __html: `
<template>
  <h4 data-bind="label"></h4>
  <p><em data-bind="startDate" data-format="datetime"></em></p>
  <div data-bind-html="description"></div>
</template>
`,
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [headings, setHeadings] = useState<{ id: string; label: string }[]>([]);
  const [staticShown, setStaticShown] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const dynamicRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  // Mirrors staticShown so the MutationObserver below reads it synchronously
  // instead of through a render-lagged closure.
  const staticShownRef = useRef(false);

  useEffect(() => {
    // Dynamic: the module calls customElements.define at load time, which throws during SSR.
    import("@nanopub/nanopub-elements");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      staticShownRef.current = true;
      setStaticShown(true);
    }, REVEAL_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const client = new NanopubClient();

      type RawRow = { number: number; np: string; label: string; resource: string };
      const rawRows: RawRow[] = [];
      for await (const row of client.runQueryTemplate(QUERY_TEMPLATE, {
        super_resource: SUPER_RESOURCE,
        "api-version": "latest",
      })) {
        const label = row.resource_label;
        const np = row.np;
        const resource = row.resource;
        if (!label || !np || !resource) continue;
        const number = extractSessionNumber(label);
        if (!number || number < MIN_SESSION) continue;
        rawRows.push({ number, np, label, resource });
      }
      if (cancelled) return;

      rawRows.sort((a, b) => b.number - a.number);
      const shown = rawRows.slice(0, MAX_SESSIONS);
      // Render the sessions right away so each <nanopub-item> can start fetching
      // its own content; waiting for the sub-resource queries below first would
      // serialise the two rounds of requests and roughly double the load time.
      setSessions(shown.map((r) => ({ ...r, subEvents: [] })));

      // Sub-events sit behind a collapsed <details>, so fold them in as they
      // arrive instead of blocking the initial render on all of them.
      await Promise.all(
        shown.map(async (r) => {
          const subEvents: { np: string; label: string }[] = [];
          try {
            for await (const sub of client.runQueryTemplate(QUERY_TEMPLATE, {
              super_resource: r.resource,
              "api-version": "latest",
            })) {
              if (!sub.resource || !sub.np || !sub.resource_label) continue;
              subEvents.push({ np: sub.np, label: sub.resource_label });
            }
          } catch {
            // Treat sub-resource fetch failures as "no sub-events".
          }
          if (cancelled || !subEvents.length) return;
          setSessions((prev) =>
            prev.map((s) => (s.np === r.np ? { ...s, subEvents } : s)),
          );
        }),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const update = () => {
      const staticRoot = staticRef.current;
      const dynamicRoot = dynamicRef.current;

      // A <nanopub-item> holds nothing but its inert <template> until its fetch
      // resolves, so a rendered heading is what marks it as done. Only once
      // every one of them is done do the markdown sessions join the list.
      if (!staticShownRef.current && dynamicRoot && sessions.length > 0) {
        const items = Array.from(
          dynamicRoot.querySelectorAll(":scope > div > nanopub-item"),
        );
        if (
          items.length === sessions.length &&
          items.every((el) => el.querySelector("h3"))
        ) {
          staticShownRef.current = true;
          setStaticShown(true);
        }
      }

      // The markdown sessions top the list up to MAX_SESSIONS. They render as a
      // flat run of siblings, so each <h3> opens an entry that owns every node
      // up to the next one; hide whole entries past the budget.
      if (staticRoot) {
        let budget = Math.max(0, MAX_SESSIONS - sessions.length);
        let keep = false;
        for (const node of Array.from(staticRoot.children) as HTMLElement[]) {
          if (node.tagName === "H3") keep = budget-- > 0;
          node.style.display = keep ? "" : "none";
        }
      }

      const h3s = Array.from(root.querySelectorAll("h3"));
      const seen = new Set<string>();
      const all: { id: string; label: string }[] = [];
      for (const h of h3s) {
        // Skip anything trimmed above, and the whole markdown block while it is
        // still waiting on the dynamic sessions.
        if (h.style.display === "none") continue;
        if (!staticShownRef.current && staticRoot?.contains(h)) continue;
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
                href="https://meet.jit.si/nanosession"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Jitsi channel
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
            <div ref={dynamicRef}>
              {sessions.map((s) => (
                <div key={s.np}>
                  <nanopub-item
                    uri={s.np}
                    dangerouslySetInnerHTML={ITEM_TEMPLATE}
                  />
                  {s.subEvents.length > 0 && (
                    <details style={{ marginBottom: "1rem" }}>
                      <summary style={{ cursor: "pointer" }}>
                        Sub-events ({s.subEvents.length})
                      </summary>
                      <div style={{ marginTop: "0.5rem" }}>
                        {s.subEvents.map((sub) => (
                          <nanopub-item
                            key={sub.np}
                            uri={sub.np}
                            dangerouslySetInnerHTML={SUB_ITEM_TEMPLATE}
                          />
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
            {/* Sessions up to #26 predate the nanopublished ones and live in
                markdown. The query above only yields #27 upwards, so appending
                them here continues the same descending list without a visible
                seam. Kept mounted but hidden rather than conditionally rendered,
                so the effect above can trim it before it is ever on screen. */}
            <div
              ref={staticRef}
              style={{ display: staticShown ? undefined : "none" }}
            >
              <MDSessions />
            </div>
          </section>
        </main>

        <aside style={{ width: "220px" }}>
          <SessionsTOC headings={headings} />
        </aside>
      </div>
    </Layout>
  );
}
