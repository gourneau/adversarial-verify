---
name: adversarial-verify
description: Verify-before-you-commit harness for high-stakes, multi-constraint choices where the data is written by someone who profits from your believing it — listings, vendors, contractors, marketplaces, job posts, suppliers. Elicits hidden constraints with a cheap counterexample probe, fans out orthogonal finders, spawns skeptics prompted to REFUTE each survivor, proves the negative across adjacent categories, and re-verifies at commit time. Use when the user is choosing something expensive or irreversible and "just search" isn't enough — "find me the best X", "is this really the best option?", "did we miss anything?", "verify this before I book/buy/sign", "compare these seriously".
---

# Adversarial verify

**Searching produces plausible candidates. It does not produce true ones.** When being wrong is expensive, the bottleneck is never finding more options — it's killing bad ones. Disproof is the scarce resource. Budget accordingly: expect to spend more compute refuting than discovering.

## Use when
The data source is **adversarial**: the seller writes the listing. Rentals, travel, contractors, vendors, procurement, hiring, used goods. High stakes, low frequency, several constraints, one irreversible commit.

**Don't use for** cheap reversible purchases, or when the user already knows exactly what they want and just needs a link.

---

## Step 0 — Probe before you search

> The user cannot tell you their constraints. They can only recognize violations. **So don't ask. Show.**

Asking "what are your requirements?" reliably fails — people retrieve maybe half, and the missing half surfaces later as an *accusation* after you've done the work. (In the origin project the hard budget cap arrived on turn 47 of 59, after a pick 1.8× over it was crowned. Three of four hard filters were discovered by rejecting a finished answer. Each rejection invalidated a full research pass.) See `references/preference-construction.md` for why this is a fact about people, not a failure of prompting.

**The counterexample probe.** Before any expensive search, spend ~1% of the budget generating **5–7 deliberately diverse candidates** — spanning the extremes, including a couple you expect to be wrong:

- the cheapest thing that technically qualifies
- the expensive/luxurious one
- one that's perfect-but-for-one-flaw (far away, no kitchen, shared bathroom)
- one that's odd (different category entirely)
- one that satisfies the stated brief exactly

Present them in a compact table and ask exactly this:

> **"Before I go deep: which of these are wrong, and what specifically makes them wrong?"**

Rejections are high-bandwidth. "Ugh, that one's on rocks" surfaces a hard filter that no amount of *"do you have beach preferences?"* would have retrieved. Ten minutes here saves the whole project.

Then write the **locked table** — hard filters, ceiling (a number), decision date — and get confirmation. Do not begin deep pricing until dates/parameters are locked; in most domains every price is keyed to them, and a parameter change silently rots every number you've collected.

**Expect late constraints anyway.** When one lands: append it to the locked table, state plainly which prior results it invalidates, re-run. Never let a stale winner survive a new filter. Don't be precious; do be explicit.

## Step 1 — Construct the missing column

The attribute that actually decides the purchase is usually **in no database and in no listing.** (Canonical: *"is this beach soft and swimmable?"* — no field exists, and every listing claims yes.)

Name it, then build it yourself from **independent sources** — guides, review corpora, public data, forums — keyed on something the seller cannot fake: coordinates, addresses, VINs, license numbers. **Never let the seller grade its own homework.** This is usually the highest-leverage hour in the project.

## Step 2 — Fan out along orthogonal angles

Parallel finders, blind to each other, one per *source class* (marketplace API, owner-direct, aggregator, independent reference, adjacent category). Structured output only — see `references/schemas.md`.

**`enum` is a safety device, not a convenience.** `oceanView: ['yes','partial','no','unknown']` denies a model the option of writing *"stunning ocean vistas!"* and forces it to commit to a filterable word. Two finalists whose listings both said "ocean view" resolved to `partial`. Free text would have laundered both into a yes. Always include `unknown`, and **treat `unknown` as failing.**

## Step 3 — Attack every survivor

Skeptics, not evaluators. Their only instruction is to **refute**. Template: `templates/verify.workflow.js`.

Rules that matter:
- **Default to PROBLEM when uncertain.** An honest "I couldn't confirm" must kill the candidate, not pass it.
- **Perspective diversity beats redundancy.** If a claim can fail in several ways, give each skeptic a *different lens* (does-it-exist / does-it-cost-that / does-it-reproduce / security) rather than N identical refuters.
- **Majority-refute kills.** Ties go to the skeptics.
- **Assert identity, always.** Confirm the thing you landed on *is the thing you asked for* — room ID, title, coordinates. See `references/traps.md`; this single check would have saved two crowned picks.

## Step 4 — Prove the negative

"X is the best category" is an assumption until adjacent categories are exhausted. One agent per category, priced live, each returning `beatsIncumbent: yes|no|maybe` + *why it lost*. Template: `templates/prove-negative.workflow.js`.

A verdict of *"condos win **because** they're the only category satisfying all three legs"* is worth far more than a ranked list of forty condos. It converts a preference into a finding.

## Step 5 — Re-verify at commit time

**Availability, price, and stock are perishable.** The check that matters is the *last* one, not the best one. Immediately before the user acts, re-run Step 3 on the finalist alone. In the origin project this caught a crowned pick that had been booked out from under the plan — twice.

## Step 6 — Audit your own artifact

Long-lived generated documents **accrete contradictions**: a hero section crowning a pick that a later section marks disqualified. Nobody writes that bug; it grows. Chunk the artifact, hand each agent the current ground truth, ask *"what in your chunk contradicts this?"* Template: `templates/artifact-audit.workflow.js`.

Corollary, and it is a serious one: **an unverified but beautifully-formatted answer will teach the user to want what it found.** Polish applied to a wrong answer is worse than no polish. Verify before you decorate.

## Step 7 — Hand off the tradeoff

Once every hard constraint is satisfied, what remains is a choice among **incommensurable goods** — beachfront vs. square footage vs. $500. There is no legitimate scalarization; a weighted score here is your opinion wearing a lab coat.

**Agents enforce facts. Humans adjudicate values.** Present the survivors with their tradeoffs named, and stop. Never complete a booking, payment, or form.

---

## When to stop verifying
Stop when the marginal skeptic stops changing the *decision*, not when it stops finding nits. Concretely: two consecutive rounds where no finding flips a candidate's `verdict`, or where every surviving candidate would still be acceptable if the finding were true. Then re-verify the finalist (Step 5) and hand off. See `references/stopping-rules.md`.

## Bundled resources
| Path | What |
|---|---|
| `references/preference-construction.md` | Why constraints arrive late; how to design elicitation around it |
| `references/traps.md` | Failure catalog — the 200-OK lie, marketing laundering, perishability |
| `references/schemas.md` | Enum-constrained schema library + why free text is unsafe |
| `references/stopping-rules.md` | Verification cost/benefit; when enough is enough |
| `templates/verify.workflow.js` | Adversarial verify phase, parameterized |
| `templates/prove-negative.workflow.js` | Adjacent-category sweep |
| `templates/artifact-audit.workflow.js` | Chunked contradiction audit |
| `checklists/pre-commit.md` | Read aloud before the user clicks buy |

## Ops scars
- Never `perl -pi` a UTF-8 file with wide-char replacements — it double-encodes the document. Python with explicit `encoding='utf-8'`.
- An SRI `integrity=` hash that doesn't byte-match **silently blocks** the script. Your feature renders as an empty box, no obvious error.
- Embedded third-party widgets (maps, players) get blocked by ad-blockers. When the failure mode is a blank rectangle, ship a plain link. Boring beats clever.
- Before publishing any generated artifact: UTF-8 validity, tag balance, `node --check` each inline script, and `local size == remote size` after deploy.

## Related
Domain application: [[trip-planner]]. The pattern generalizes to any purchase where the seller writes the data.
