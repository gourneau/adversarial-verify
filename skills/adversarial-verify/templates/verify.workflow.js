// Step 3 — Adversarial verify. Skeptics, not evaluators.
// Usage: adapt CANDS + the 5 questions; run via the Workflow tool.
export const meta = {
  name: 'adversarial-verify',
  description: 'Refute each finalist before committing',
  phases: [{ title: 'Verify', detail: 'refute each candidate' }],
}

const CEILING = args?.ceiling ?? '$3,500'
const PARAMS  = args?.params  ?? 'the exact parameters'
const CANDS   = args?.candidates ?? []   // [{ id, name, claim }]

// Perspective diversity beats redundancy: each skeptic gets a different lens.
const LENSES = [
  'IDENTITY + AVAILABILITY: did you land on the exact item requested (ID/title/coords match)? Is it actually available/valid for the parameters right now?',
  'COST: compute the true ALL-IN cost including every fee and tax. State the basis. Is it truly under the ceiling?',
  'THE HEADLINE CLAIM: attack the one attribute the pick is sold on. Demand evidence, not marketing copy. Check independent sources.',
]

phase('Verify')
const verdicts = await parallel(CANDS.flatMap(c => LENSES.map((lens, i) => () =>
  agent(
    `Adversarially verify this before we commit. Your job is to REFUTE, not evaluate.
     Parameters: ${PARAMS}. Ceiling: ${CEILING}.

     CANDIDATE: ${c.name}
     CLAIM TO TEST: ${c.claim}

     YOUR LENS: ${lens}

     Also scan for red flags (construction, for-sale showings, hidden fees, bad reviews).
     Use live tools. Cite what you actually saw.

     Final verdict: CONFIRMED (claims hold) or PROBLEM (what breaks).
     DEFAULT TO PROBLEM IF UNCERTAIN. An honest "could not confirm" is a PROBLEM.`,
    {
      label: `verify:${c.id}:L${i}`, phase: 'Verify',
      schema: {
        type: 'object', additionalProperties: false,
        required: ['candidateId','verdict','identityMatches','availability','headlineAttr','allInPrice','underCap','redFlags','confidence'],
        properties: {
          candidateId:     { type: 'string' },
          verdict:         { type: 'string', enum: ['CONFIRMED','PROBLEM'] },
          identityMatches: { type: 'string', enum: ['yes','no','unknown'] },
          availability:    { type: 'string', enum: ['yes','no','unknown'] },
          headlineAttr:    { type: 'string', enum: ['yes','partial','no','unknown'] },
          allInPrice:      { type: 'string' },
          underCap:        { type: 'string', enum: ['yes','no','unknown'] },
          redFlags:        { type: 'string' },
          confidence:      { type: 'string', enum: ['high','medium','low'] },
        },
      },
    }
  )
)))

// Majority-refute kills. Ties go to the skeptics. Filter in code, never in a prompt.
const byCand = {}
for (const v of verdicts.filter(Boolean)) (byCand[v.candidateId] ||= []).push(v)

const survivors = Object.entries(byCand).filter(([, vs]) => {
  const problems = vs.filter(v => v.verdict === 'PROBLEM').length
  const hardFail = vs.some(v => v.identityMatches !== 'yes' || v.availability !== 'yes' || v.underCap === 'no')
  return problems < vs.length / 2 && !hardFail
}).map(([id, vs]) => ({ id, votes: vs }))

log(`${survivors.length}/${CANDS.length} survived`)
return { survivors, killed: Object.keys(byCand).filter(id => !survivors.find(s => s.id === id)), verdicts }
