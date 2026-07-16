# adversarial-verify

**Live pages:** https://gourneau.github.io/adversarial-verify/

**A verify-before-you-commit harness for high-stakes decisions where the data is written by someone who profits from your believing it** — listings, vendors, contractors, marketplaces, job posts.

Plus the story of using a swarm of ~249 AI agents to do something completely mundane: book one vacation condo.

> Searching produces *plausible* candidates. It does not produce *true* ones. When being wrong is expensive, the bottleneck isn't finding more options — it's **killing the bad ones**. Disproof is the scarce resource.

---

## The story

I wanted to book a 12-night Maui trip for two. Simple-sounding: under $3,500 for lodging, an ocean view, and — the part that broke everything — a beach you could actually *swim* at. Soft sand, no rocks.

That last requirement is in no database, and every listing claims its beach is perfect. So a task that sounds like ten minutes of clicking became a real search problem. It took **17 multi-agent workflows, ~249 agent runs, and 41 versions** of a living plan.

Three times a "winner" was crowned and published. Three times a skeptic agent killed it:

1. The top pick was **already booked** — we'd checked too early.
2. A listing said "oceanfront." It fronted a shelf of **lava rock.**
3. Loading a sold-out Airbnb with dates in the URL **silently serves a *different* property** — same page, real price, wrong unit. An owner-direct link `301`'d to a condo nine miles away. A **200 OK means nothing** until you assert the page you landed on *is* what you asked for.

The unit finally booked ([Maui Kamaʻole I-118](https://www.airbnb.com/rooms/22531397)) was never the front-runner — it was the agents' *third* recommendation. The machine narrowed a few hundred candidates to nine survivors; a human picked the final one in thirty seconds. **Agents enforce facts; humans adjudicate values.**

**Read the write-ups (live):**
- ✨ [The story](https://gourneau.github.io/adversarial-verify/story.html) — the 3-minute version
- 📖 [The long version](https://gourneau.github.io/adversarial-verify/planning-with-agents.html)
- 🛠 [How we built it](https://gourneau.github.io/adversarial-verify/how-we-planned-maui.html) — the technical deep-dive
- 📍 [The trip plan itself](https://gourneau.github.io/adversarial-verify/)

---

## What's in here

```
skills/
  adversarial-verify/     ← the reusable harness (the point of this repo)
    SKILL.md              ← the 7-step method
    references/           ← preference-construction, traps, schemas, stopping-rules
    templates/            ← runnable multi-agent workflow scripts
    checklists/           ← pre-commit checklist
  trip-planner/           ← domain application (travel), loads adversarial-verify
docs/                     ← the four write-up / plan pages (self-contained HTML) — served via GitHub Pages
```

The skills are written for [Claude Code](https://claude.com/claude-code) (drop `skills/adversarial-verify` into `~/.claude/skills/`), but the method is tool-agnostic — it works with the Anthropic SDK or any agent harness.

---

## The method, in seven steps

0. **Probe before you search.** People can't *state* their constraints; they *recognize* violations. Don't ask "what do you want?" — show 5–7 deliberately diverse candidates (including ones you expect to be wrong) and ask *"which of these are wrong, and why?"* Rejections are high-bandwidth.
1. **Construct the missing column.** The attribute that decides the purchase is usually in no database and no listing. Build it from independent sources, keyed on something the seller can't fake (coordinates, IDs). Never let the seller grade its own homework.
2. **Fan out** orthogonal finders. Structured output only — `enum` fields deny a model the room to write "stunning ocean vistas!" and force it to commit to a filterable word.
3. **Attack every survivor.** Skeptics, not evaluators — prompted to *refute*. Default to reject when uncertain. Majority-refute kills.
4. **Prove the negative.** "X is best" is an assumption until you've priced the adjacent categories.
5. **Re-verify at commit time.** Availability and price are perishable; the check that matters is the last one.
6. **Audit your own artifact.** Long-lived generated documents accrete contradictions — chunk it, hand agents the ground truth, ask what conflicts.
7. **Hand off the tradeoff.** Among options that all pass, the choice is between incommensurable goods. Name them; let the human decide. Never complete a booking, payment, or form.

See [`skills/adversarial-verify/SKILL.md`](skills/adversarial-verify/SKILL.md) for the full method, and [`references/traps.md`](skills/adversarial-verify/references/traps.md) for the failure catalog (each entry cost a crowned pick).

---

## License

MIT — see [LICENSE](LICENSE). Take it, use it, tell your friends.

Built with Claude Code (Opus 4.8).
