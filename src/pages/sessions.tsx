import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import { NanopubClient } from "@nanopub/nanopub-js";
import DOMPurify from "dompurify";
import MDSessions from "./_previous-sessions.md";
import styles from "./styles.module.css";

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
  subEvents: SubEvent[];
};

type SubEvent = { np: string; label: string; resource: string };

const MIN_SESSION = 27;
const QUERY_TEMPLATE = "RAGxWuFSWFeXyoCZiJpaVMwH-_9-fLX3GFPb5XI-KHIok/get-sub-resources";
const SUPER_RESOURCE = "https://w3id.org/spaces/nanopub/nanosessions";

const MAX_SESSIONS = 15;
// The markdown sessions are revealed once the nanopublished ones have rendered.
// If a fetch fails they never will, so show them anyway rather than stranding
// the whole list behind a request that is not coming back.
const REVEAL_FALLBACK_MS = 6000;

// Only the session list is cached. The query API sends no cache headers, so the
// browser refetches it on every visit and on every SPA navigation back to this
// page, even though the list changes just once a month.
const CACHE_KEY = "nanopub-sessions:v1";

type CachedRow = { number: number; np: string; label: string; resource: string };

function readCachedSessions(): CachedRow[] | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? "null");
    if (!Array.isArray(parsed)) return null;
    const rows = parsed.filter(
      (r): r is CachedRow =>
        !!r &&
        typeof r.number === "number" &&
        typeof r.np === "string" &&
        typeof r.label === "string" &&
        typeof r.resource === "string",
    );
    return rows.length ? rows : null;
  } catch {
    // Storage disabled, or a stale entry from an older shape: treat as a miss.
    return null;
  }
}

function writeCachedSessions(rows: CachedRow[]) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(rows));
  } catch {
    // Quota or disabled storage. Caching is an optimisation, not a requirement.
  }
}

// Nanopub URIs are trusty URIs, i.e. content hashes, so any change to a session
// yields a different np. Comparing the np sequence therefore catches every
// change to the list.
function sameSessions(a: CachedRow[], b: CachedRow[]) {
  return a.length === b.length && a.every((r, i) => r.np === b[i].np);
}

const EMPTY_SET: ReadonlySet<string> = new Set<string>();

function sameSet(a: ReadonlySet<string>, b: ReadonlySet<string>) {
  return a.size === b.size && [...a].every((v) => b.has(v));
}

// Workaround for https://github.com/Nanopublication/nanopub-elements/issues/64:
// <nanopub-item> shows the first resource of a nanopub's assertion, but a
// session's nanopub can list another one first (#36 starts with a preset
// assignment), and the item then renders empty. In that case, fill the item's
// template from the session resource itself, with the fields and date format
// that <nanopub-item> uses.
const FIELDS: Record<string, string> = {
  label: "http://www.w3.org/2000/01/rdf-schema#label",
  startDate: "http://schema.org/startDate",
  description: "http://purl.org/dc/terms/description",
};

type JsonLdValue = { "@value"?: string; "@id"?: string };
type JsonLdNode = { "@id"?: string; [predicate: string]: unknown };
type JsonLdGraph = { "@id"?: string; "@graph"?: JsonLdNode[] };

const itemHeading = (el: Element) => el.querySelector("h3, h4");

function formatDateTime(value: string) {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

// Returns whether the item has a heading afterwards.
async function renderResourceInto(el: HTMLElement, client: NanopubClient) {
  const np = el.getAttribute("uri");
  const resource = el.dataset.resource;
  const template = el.querySelector("template");
  if (!np || !resource || !template) return false;
  const jsonld = (await client.fetchNanopub(np, "jsonld")) as unknown as JsonLdGraph[];
  const node = jsonld
    .find((g) => g["@id"]?.endsWith("/assertion"))
    ?.["@graph"]?.find((n) => n["@id"] === resource);
  if (!node) return false;
  const value = (field: string | undefined) =>
    ((node[FIELDS[field ?? ""] ?? ""] ?? []) as JsonLdValue[])
      .map((v) => v["@value"] ?? v["@id"] ?? "")
      .filter(Boolean)
      .join("\n");
  const fragment = template.content.cloneNode(true) as DocumentFragment;
  fragment.querySelectorAll<HTMLElement>("[data-bind]").forEach((n) => {
    const v = value(n.dataset.bind);
    n.textContent = n.dataset.format === "datetime" ? formatDateTime(v) : v;
  });
  fragment.querySelectorAll<HTMLElement>("[data-bind-html]").forEach((n) => {
    n.innerHTML = DOMPurify.sanitize(value(n.dataset.bindHtml));
  });
  Array.from(el.childNodes).forEach((c) => {
    if (!(c instanceof HTMLTemplateElement)) c.remove();
  });
  el.appendChild(fragment);
  return !!itemHeading(el)?.textContent?.trim();
}

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
  // np URIs whose <nanopub-item> has rendered its own content. Until an item is
  // in here it shows the cached title as a placeholder instead of nothing.
  const [rendered, setRendered] = useState<ReadonlySet<string>>(EMPTY_SET);
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

    // Paint last visit's list straight away; the query below still runs and
    // corrects it. The cache only decides whether the user waits for it.
    const cached = readCachedSessions();
    if (cached) {
      setSessions(cached.map((r) => ({ ...r, subEvents: [] })));
      // The cached titles are already a complete list, so there is nothing left
      // to wait for: holding the markdown back would blank out two thirds of
      // the page on every revisit, which is the thing the cache exists to stop.
      staticShownRef.current = true;
      setStaticShown(true);
    }

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
      writeCachedSessions(shown);

      // Render the sessions right away so each <nanopub-item> can start fetching
      // its own content; waiting for the sub-resource queries below first would
      // serialise the two rounds of requests and roughly double the load time.
      // When the cache was already correct, leave the rendered items alone
      // rather than handing React a fresh array for an unchanged list.
      if (!cached || !sameSessions(cached, shown)) {
        setSessions(shown.map((r) => ({ ...r, subEvents: [] })));
      }

      // Sub-events sit behind a collapsed <details>, so fold them in as they
      // arrive instead of blocking the initial render on all of them.
      await Promise.all(
        shown.map(async (r) => {
          const subEvents: SubEvent[] = [];
          try {
            for await (const sub of client.runQueryTemplate(QUERY_TEMPLATE, {
              super_resource: r.resource,
              "api-version": "latest",
            })) {
              if (!sub.resource || !sub.np || !sub.resource_label) continue;
              subEvents.push({
                np: sub.np,
                label: sub.resource_label,
                resource: sub.resource,
              });
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
    const client = new NanopubClient();
    // Items being filled in by renderResourceInto, and nanopubs where that did
    // not produce a heading either. The latter count as done, so that they do
    // not hold up the markdown sessions, and are not tried again.
    const fixing = new WeakSet<Element>();
    const failed = new Set<string>();
    const uriOf = (el: Element) => el.getAttribute("uri") ?? "";
    const update = () => {
      const staticRoot = staticRef.current;
      const dynamicRoot = dynamicRef.current;

      // A rendered heading without text means <nanopub-item> picked the wrong
      // resource (see renderResourceInto).
      for (const el of Array.from(
        root.querySelectorAll<HTMLElement>("nanopub-item[data-resource]"),
      )) {
        const h = itemHeading(el);
        if (!h || h.textContent?.trim() || fixing.has(el) || failed.has(uriOf(el))) continue;
        fixing.add(el);
        renderResourceInto(el, client)
          .catch(() => false)
          .then((ok) => {
            if (!ok) failed.add(uriOf(el));
            fixing.delete(el);
            update();
          });
      }

      // A <nanopub-item> holds nothing but its inert <template> until its fetch
      // resolves, so a heading with text is what marks it as done. The
      // placeholder title sits outside the element, so it never counts here.
      const items = dynamicRoot
        ? Array.from(
            dynamicRoot.querySelectorAll(":scope > div > nanopub-item"),
          )
        : [];
      const done = new Set(
        items.filter((el) => itemHeading(el)?.textContent?.trim()).map(uriOf),
      );
      // Returning the previous set when nothing changed bails out of the
      // re-render this observer would otherwise trigger on every mutation.
      setRendered((prev) => (sameSet(prev, done) ? prev : done));

      // Only once every item is done do the markdown sessions join the list.
      if (
        !staticShownRef.current &&
        sessions.length > 0 &&
        items.length === sessions.length &&
        items.every((el) => done.has(uriOf(el)) || failed.has(uriOf(el)))
      ) {
        staticShownRef.current = true;
        setStaticShown(true);
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
      <div className={`container margin-vert--lg ${styles.sessionsLayout}`}>
        <main className={styles.sessionsMain}>
          <h1>Nano Sessions</h1>
          <p>
            The Nano Sessions are regular online meetings for everyone
            interested in nanopublications. A session usually has two
            10-minute talks, followed by discussion and news from the
            community. The{" "}
            <a
              href="https://docs.google.com/document/d/1-0aImR4bFHmay8j6bSFgIDi9sw01KXdmYw9szyhAWmY/edit#"
              target="_blank"
              rel="noopener noreferrer"
            >
              description
            </a>{" "}
            has more details.
          </p>
          <p>
            Want to present a use case, an idea, or a problem you can’t
            solve?{" "}
            <a href="mailto:virginia@knowledgepixels.com">Send an email</a> to
            get a slot in an upcoming session. The sessions are hosted by{" "}
            <a
              href="https://knowledgepixels.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Knowledge Pixels
            </a>
            , and others are welcome to become hosts too.
          </p>
          <h2>How to join</h2>
          <ul>
            <li>
              All sessions take place in this{" "}
              <a
                href="https://meet.jit.si/nanosession"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jitsi channel
              </a>
              . Anyone can join, without registration.
            </li>
            <li>
              Invitations are sent to the{" "}
              <a
                href="https://groups.google.com/g/nanopub-users/"
                target="_blank"
                rel="noopener noreferrer"
              >
                nanopub-users mailing list
              </a>
              . To subscribe, click <em>Ask to join group</em>.
            </li>
            <li>
              We take{" "}
              <a
                href="https://docs.google.com/document/d/1_vL-hxsHGcy85g7EIUdLesztXFofQ9QW4VdZG3K5J8g/edit#"
                target="_blank"
                rel="noopener noreferrer"
              >
                notes
              </a>{" "}
              during the sessions and keep them for the record.
            </li>
          </ul>
          <h2>Sessions</h2>
          <section ref={sectionRef} className={styles.sessionList}>
            <div ref={dynamicRef}>
              {sessions.map((s) => (
                <div key={s.np}>
                  {/* Stands in until the element has fetched its own content,
                      so a cached list stays on screen while it revalidates
                      instead of blanking out. The element renders its real
                      heading inside itself, and this one then unmounts. */}
                  {!rendered.has(s.np) && <h3>{s.label}</h3>}
                  <nanopub-item
                    uri={s.np}
                    data-resource={s.resource}
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
                            data-resource={sub.resource}
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

        <aside className={styles.sessionsToc}>
          <SessionsTOC headings={headings} />
        </aside>
      </div>
    </Layout>
  );
}
