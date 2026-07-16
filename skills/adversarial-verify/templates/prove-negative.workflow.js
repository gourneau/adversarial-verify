// Step 4 — Prove the negative. "X is best" is an assumption until you exhaust the neighbours.
export const meta = {
  name: 'prove-the-negative',
  description: 'Sweep adjacent categories with live prices; judge vs the incumbent',
  phases: [{ title: 'Explore', detail: 'one agent per category' }, { title: 'Judge', detail: 'rank by value' }],
}

const CTX        = args?.context ?? ''
const INCUMBENT  = args?.incumbent ?? ''
const CATEGORIES = args?.categories ?? []   // [{ key, prompt }]

phase('Explore')
const found = await parallel(CATEGORIES.map(c => () =>
  agent(
    `${CTX}\n\nINCUMBENT TO BEAT: ${INCUMBENT}\n\nYOUR CATEGORY: ${c.prompt}\n\n` +
    `Use live tools for real prices on the exact parameters — no estimates.\n` +
    `If nothing in your category beats the incumbent, SAY SO PLAINLY. A clean "no" is a valid, valuable result.`,
    { label: `explore:${c.key}`, phase: 'Explore', schema: {
        type:'object', additionalProperties:false,
        required:['category','beatsIncumbent','verdict','options'],
        properties:{
          category:       { type:'string' },
          beatsIncumbent: { type:'string', enum:['yes','no','maybe'] },
          verdict:        { type:'string' },   // WHY it lost — the real deliverable
          options:        { type:'array', items:{ type:'object', additionalProperties:false,
            required:['name','allIn','tradeoff','link'],
            properties:{ name:{type:'string'}, allIn:{type:'string'}, tradeoff:{type:'string'}, link:{type:'string'} } } },
        } } }
)))

phase('Judge')
const verdict = await agent(
  `${CTX}\n\nCross-category sweep results:\n${JSON.stringify(found.filter(Boolean), null, 1)}\n\n` +
  `Rank the top options across ALL categories by value for this user. Then answer directly: ` +
  `is the incumbent category really best, or is there something better? If it wins, explain WHY it wins — ` +
  `name the leg every alternative drops. Convert the preference into a finding.`,
  { label: 'judge', phase: 'Judge', schema: {
      type:'object', additionalProperties:false,
      required:['answer','bestOverall','incumbentWins','alternatives'],
      properties:{
        answer:        { type:'string' },
        bestOverall:   { type:'string' },
        incumbentWins: { type:'string', enum:['yes','no'] },
        alternatives:  { type:'array', items:{ type:'object', additionalProperties:false,
          required:['name','allIn','whyConsider','tradeoff'],
          properties:{ name:{type:'string'}, allIn:{type:'string'}, whyConsider:{type:'string'}, tradeoff:{type:'string'} } } },
      } } }
)

return { found: found.filter(Boolean), verdict }
