# Why constraints arrive late (and how to design for it)

This is a fact about people, not a failure of prompting. Design the harness around it.

## The phenomenon
People do not *retrieve* preferences from a stable internal utility function. They **construct** them at the moment of choice, and the construction is shaped by what they're shown (Slovic, *The Construction of Preference*, 1995; Lichtenstein & Slovic, 2006). Ask someone to specify what they want and you get a lossy, partial reconstruction. Show them a violation and you get an instant, confident, correct rejection.

Justice Potter Stewart's "I know it when I see it" (*Jacobellis v. Ohio*, 1964) is not a joke about laziness. It is an accurate report of how categorization works for concepts that resist necessary-and-sufficient definition — Wittgenstein's **family resemblance**. "A good beach" has no definition. It has exemplars.

Two consequences:
- **Recognition ≫ recall.** Recognizing a bad option is fast, cheap, and reliable. Generating a complete spec is slow, expensive, and lossy.
- **Rejections are high-bandwidth.** "Ugh, that one's on rocks" transmits a hard filter that no amount of *"do you have beach preferences?"* would have retrieved.

## What this actually is
It is **preference learning, run by hand.** The user cannot write the reward function. Neither can you. But they can label comparisons, and each rejection is a label. The locked constraint table is the learned reward model — fitted online, from negatives.

If that sounds like RLHF, it is. The reason RLHF exists is the same reason "ask for requirements" fails: for the things that matter most, humans can evaluate but not specify.

## Design consequences
1. **Probe with counterexamples before searching.** Spend ~1% of budget on 5–7 deliberately diverse candidates, including ones you expect to be wrong. Ask *"which of these are wrong, and what makes them wrong?"* — never *"what do you want?"*
2. **Order probes by discriminating power per dollar.** The cheapest question that splits the space the most goes first.
3. **Formalize every rejection immediately.** The moment a constraint surfaces, write it into the locked table, state which prior results it invalidates, and re-run. A rejection that stays in chat is a constraint you will violate again.
4. **Budget for N late constraints.** They are not a defect of the process; they *are* the process. Make re-running cheap: cache candidate pools, use resumable workflows, keep raw findings.
5. **Do not polish before the objective stabilizes.** This is the sharpest rule here. A well-formatted, confident artifact **teaches the user to want what it found** — anchoring plus the persuasive force of good typography. Polish applied to a wrong answer is worse than no polish: it converts a bad recommendation into a bad decision. Verify, then decorate.

## The economics of why this is newly viable
Stigler's *The Economics of Information* (1961): optimal search depth is a function of the **marginal cost of one more query**. When each iteration costs a weekend of browsing, the rational move is to commit early to a spec you haven't tested — or to satisfice (Simon) and stop at "good enough."

Collapse the marginal cost of an iteration to minutes and a few hundred thousand tokens, and the calculus inverts. *"I'll know it when I see it"* stops being an unaffordable luxury and becomes the efficient strategy. Stating everything up front would have made the origin project ~3× cheaper. It would **not** have made it better, because two of the constraints did not exist until a wrong answer conjured them.

**The product isn't the search. It's making the iteration cheap enough that preference construction can happen inside the loop.**

## The hazard on the other side
Cheap generation makes mis-specification *more* dangerous, not less. An agent will pursue the stated objective with superhuman efficiency and produce a confidently wrong answer, beautifully formatted (Goodhart; specification gaming). The counterweight is verification: it is what keeps preference *discovery* from becoming preference *manufacture*.

## Where the human is irreplaceable
Once every hard constraint is satisfied, what remains is a choice among **incommensurable goods** — beachfront vs. 1,000 sq ft vs. $500. There is no objectively correct exchange rate between them. A weighted score at this stage is your opinion wearing a lab coat.

> **Agents enforce facts. Humans adjudicate values.**

Constraints are verifiable and delegable. Tradeoffs among satisfied constraints are not. That is why, in the origin project, 249 agent runs narrowed a few hundred candidates to nine survivors — and the final choice took a human thirty seconds. Both numbers are correct. Neither could do the other's job.
