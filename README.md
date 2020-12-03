# Unofficial typescript client for the eero API

Based on my [python eero client](https://github.com/343max/eero-client).

Supports:

- account
- network
- eeros
- devices (on your network)
- reboot and eero

# Usage

You need to provide a `fetch` function for http requests, you can just drop in the one from `node-fetch`.

see the sample.ts for an example.

# Submit your typings!

The types in `types.ts` are mostly educated guesses. So I made it easy to verify if the types are correct:

The sample script will dump it's output in the form of TypeScript code that you can pipe directly into a `.ts` file to see if you setup matches the current types.

Example:

```
npm run sample -s eeros > eeros.ts && code eeros.ts
```

If not please submit a pull request!
