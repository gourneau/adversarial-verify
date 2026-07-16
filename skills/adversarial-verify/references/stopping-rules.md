# When to stop verifying

Verification is unbounded. Nits are infinite. Stop on **decision-stability**, not on nit-exhaustion.

## The rule
Stop when the marginal skeptic stops changing the **decision**:
- Two consecutive verify rounds where no finding flips any candidate's `verdict`; **or**
- Every surviving candidate would remain acceptable even if the newest finding were true.

Then run Step 5 (re-verify the finalist alone) and hand off.

## Cost model
Let `L` = loss from committing to a wrong option, `p` = probability current evidence is wrong, `c` = cost of one more verify round, `Δp` = expected reduction in `p`.

Verify again iff `Δp · L > c`.

For a $3,000 booking with a ruined occasion attached, `L` is large and `c` is a few dollars of tokens — so verify aggressively. For a $30 reversible purchase, `c > Δp·L` almost immediately: **don't run this skill at all.** The harness earns its keep only where `L` is big and the commit is hard to undo.

## Depth heuristics
| Situation | Skeptics per candidate | Lenses |
|---|---|---|
| Quick sanity check | 1 | single |
| Standard high-stakes | 3 | diverse (exists / costs / reproduces) |
| Irreversible + expensive | 3–5 | diverse + a dedicated identity check |

**Majority-refute kills. Ties go to the skeptics.** An honest "I couldn't confirm" is a kill, not a pass.

## Anti-patterns
- **Verifying breadth instead of depth.** Ten candidates checked shallowly is worse than three checked hard. You commit to *one*.
- **Re-searching when you should be refuting.** More candidates feels productive; it isn't. The bottleneck is disproof.
- **Verifying after decorating.** By then the artifact has already sold the answer to the user (and to you).
- **Stopping when you find an answer you like.** That's when to run Step 4 (prove the negative).
