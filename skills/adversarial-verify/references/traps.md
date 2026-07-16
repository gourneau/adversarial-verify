# Failure catalog

Each of these cost a crowned pick in the origin project. Detection recipe included.

## 1. The 200-OK lie (most dangerous)
**A page loading is not the page you asked for.**

- Marketplaces **silently redirect** sold-out listings to a *different* item — same layout, real price, wrong product. A scraper reports a confident, precise, wrong number.
- An owner-direct URL `301`'d to a different property nine miles away, on a different beach. The "verified owner-direct price" was for a unit that did not exist at that URL.

**Detect:** after every fetch, assert identity against what you requested — canonical ID in the final URL, title match, coordinates within tolerance. Log the final URL after redirects, never the requested one. If identity fails, the result is `unknown`, which fails.

## 2. Marketing laundering
"Oceanfront" can mean the building fronts a shelf of lava rock. "Ocean view" can be a strip of blue over a neighbor's roof. "Steps from the beach" is unfalsifiable.

**Detect:** never let the seller supply the value of a deciding attribute. Force `enum` output and require *evidence* (photo, amenity flag, independent source), not copy. Cross-reference against sources keyed on coordinates.

## 3. Perishability
Availability, price, and stock are properties of a **moment**, not of a listing. A price scraped today for parameters that changed yesterday is fiction.

**Detect:** stamp every number with `(value, parameters, source, timestamp)`. Re-verify the finalist immediately before commit. Treat any number older than the last parameter change as unverified.

## 4. Source disagreement
The API said available; the browser said booked. **The browser wins** — it sees what the user will see. Structured APIs lag, cache, and lie by omission.

**Detect:** when sources conflict on a *blocking* attribute, escalate to the most user-faithful channel and record the disagreement in the artifact.

## 5. Artifact drift
Long-lived generated documents accrete contradictions — a hero crowning a pick a later section marks disqualified. Nobody writes that bug; it grows one edit at a time.

**Detect:** chunk the artifact, hand each agent the current ground truth, ask *"what here contradicts this?"* Run before every publish.

## 6. Free-text hedging
An agent allowed to write prose will hedge its way to a false positive. "Generally considered to have nice views" passes a human skim and fails a filter.

**Detect:** `enum` on every judgment field, `unknown` always present, `unknown` always fails.
