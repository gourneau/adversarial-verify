# Schema library

**`enum` is a safety device, not a convenience.** It denies the model the ability to hedge. The single highest-value line in this skill is putting `'partial'` and `'unknown'` in an enum and treating both as failing.

## Rules
1. Every **judgment** field is an `enum`. Every enum contains `unknown`. `unknown` fails.
2. Every **quantity** carries its basis: not `price` but `allInPrice` ("nightly x N + fees + tax, source, date").
3. `additionalProperties: false`. Force the agent into your ontology.
4. Verdicts are binary and pessimistic: `['CONFIRMED','PROBLEM']`, default `PROBLEM`.
5. Separate *what was found* from *whether it passes*. The agent reports; the script filters.

## Verdict schema (Step 3)
```js
{
  type: 'object', additionalProperties: false,
  required: ['verdict','identityMatches','availability','headlineAttr','allInPrice','underCap','redFlags','confidence'],
  properties: {
    verdict:         { type:'string', enum:['CONFIRMED','PROBLEM'] },
    identityMatches: { type:'string', enum:['yes','no','unknown'] },  // did we land on the thing we asked for?
    availability:    { type:'string', enum:['yes','no','unknown'] },
    headlineAttr:    { type:'string', enum:['yes','partial','no','unknown'] }, // the claim under test
    allInPrice:      { type:'string' },   // must state its basis
    underCap:        { type:'string', enum:['yes','no','unknown'] },
    redFlags:        { type:'string' },
    confidence:      { type:'string', enum:['high','medium','low'] },
  }
}
```

Filter, in code, never in a prompt:
```js
const survivors = verdicts.filter(Boolean).filter(v =>
  v.verdict === 'CONFIRMED' &&
  v.identityMatches === 'yes' &&
  v.availability === 'yes' &&
  v.underCap === 'yes' &&
  v.headlineAttr !== 'no' && v.headlineAttr !== 'unknown'
)
```

## Category sweep schema (Step 4)
```js
{
  type:'object', additionalProperties:false,
  required:['category','beatsIncumbent','verdict','options'],
  properties:{
    category:       { type:'string' },
    beatsIncumbent: { type:'string', enum:['yes','no','maybe'] },
    verdict:        { type:'string' },   // WHY it lost — this is the deliverable
    options:        { type:'array', items:{ /* name, allIn, tradeoff, link */ } },
  }
}
```
