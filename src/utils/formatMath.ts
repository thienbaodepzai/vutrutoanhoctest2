/**
 * Utility to convert raw LaTeX or markup math notations into clean Vietnamese school math representation.
 * For example:
 *   - "\\cdot" -> "." (or "·")
 *   - "\\times" -> "×"
 *   - "^2" -> "²", "^3" -> "³", "^4" -> "⁴", etc.
 *   - "\\frac{a}{b}" -> "a/b"
 */
export function formatMathNotation(text?: string): string {
  if (!text) return '';

  return text
    // Replace \cdot with dot . as used in Vietnamese middle school math
    .replace(/\\cdot/g, ' . ')
    // Replace \times with ×
    .replace(/\\times/g, ' × ')
    // Replace \le, \ge, \ne, \approx
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\ne/g, '≠')
    .replace(/\\approx/g, '≈')
    // Superscript numbers when written with caret ^
    .replace(/\^0/g, '⁰')
    .replace(/\^1/g, '¹')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\^4/g, '⁴')
    .replace(/\^5/g, '⁵')
    .replace(/\^6/g, '⁶')
    .replace(/\^7/g, '⁷')
    .replace(/\^8/g, '⁸')
    .replace(/\^9/g, '⁹')
    .replace(/\^n/g, 'ⁿ')
    .replace(/\^m/g, 'ᵐ')
    // Clean up double spaces
    .replace(/\s+/g, ' ')
    .trim();
}
