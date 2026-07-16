// Step 6 — Audit your own artifact. Generated documents accrete contradictions.
export const meta = {
  name: 'artifact-audit',
  description: 'Chunk a long generated artifact; find anything contradicting current ground truth',
  phases: [{ title: 'Audit', detail: 'chunked contradiction sweep' }],
}

const FILE   = args?.file   ?? ''
const TRUTH  = args?.truth  ?? ''   // the CURRENT locked facts: winner, price, dates, ruled-out
const CHUNKS = args?.chunks ?? []   // [{ label, range: '1-240' }]

phase('Audit')
const issues = await parallel(CHUNKS.map(c => () =>
  agent(
    `Read lines ${c.range} of ${FILE} (use Read with offset/limit).\n\n` +
    `CURRENT GROUND TRUTH:\n${TRUTH}\n\n` +
    `Find every STALE / WRONG / CONTRADICTORY statement in this chunk. Look for: superseded picks presented as live; ` +
    `old prices, dates, or counts; items that were ruled out but still recommended; internal contradictions; dead links. ` +
    `Quote the exact stale text and give a concrete fix with its line number.`,
    { label: `audit:${c.label}`, phase: 'Audit', schema: {
        type:'object', additionalProperties:false, required:['chunk','issues'],
        properties:{ chunk:{type:'string'},
          issues:{ type:'array', items:{ type:'object', additionalProperties:false,
            required:['line','staleText','fix'],
            properties:{ line:{type:'string'}, staleText:{type:'string'}, fix:{type:'string'} } } } } } }
)))

const all = issues.filter(Boolean).flatMap(i => i.issues)
log(`${all.length} contradictions found`)
return { issues: all }
