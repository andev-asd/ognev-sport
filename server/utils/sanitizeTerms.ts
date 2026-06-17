// Deterministic safety net for known model artifacts that prompts can't reliably
// prevent (llama-3.3 keeps turning «ПВХ ткань» into «ПВХ тьма»). Applied to every
// AI text output so the distortion never reaches the saved content.
const TERM_FIXES: Array<[RegExp, string]> = [
  // Exact Russian cases first (nice grammar)…
  [/ПВХ\s+тьмой/gi, 'ПВХ тканью'],
  [/ПВХ\s+тьмою/gi, 'ПВХ тканиною'],
  [/ПВХ\s+тьму/gi, 'ПВХ ткань'],
  [/ПВХ\s+тьмы/gi, 'ПВХ ткани'],
  [/ПВХ\s+тьма/gi, 'ПВХ ткань'],
  // …then a catch-all for any remaining «ПВХ тьм…» form.
  [/ПВХ\s+тьм\wа*/gi, 'ПВХ ткань'],
]

export const sanitizeTerms = (text: string): string =>
  TERM_FIXES.reduce((acc, [re, replacement]) => acc.replace(re, replacement), text ?? '')
