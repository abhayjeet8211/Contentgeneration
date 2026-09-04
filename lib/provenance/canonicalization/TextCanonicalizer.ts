/**
 * TextCanonicalizer
 * Produces deterministic canonical representation of textual content.
 * 
 * Rules:
 * 1. Unicode NFC Normalization
 * 2. Line ending normalization: CRLF (\r\n), CR (\r) -> LF (\n)
 * 3. Horizontal whitespace normalization: runs of spaces and tabs collapsed to a single space
 * 4. Trailing line whitespace removal
 * 5. Paragraph preservation: consecutive empty lines (> 2 newlines) collapsed to standard double newline (\n\n)
 * 6. Outer whitespace trimming
 * 7. Strictly preserves semantic words, casing, and punctuation.
 */

export class TextCanonicalizer {
  public static canonicalize(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // 1. Unicode NFC normalization
    let text = input.normalize('NFC');

    // 2. Normalize line endings to standard LF (\n)
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 3. Process line-by-line: collapse horizontal whitespace and trim line edges
    const lines = text.split('\n').map((line) => {
      // Collapse consecutive spaces and tabs to a single space
      return line.replace(/[ \t]+/g, ' ').trim();
    });

    // 4. Rejoin with LF
    text = lines.join('\n');

    // 5. Normalize paragraph gaps: collapse 3+ consecutive newlines to \n\n
    text = text.replace(/\n{3,}/g, '\n\n');

    // 6. Trim outer leading and trailing whitespace
    return text.trim();
  }

  public static canonicalizeToBuffer(input: string): Buffer {
    const canonicalText = this.canonicalize(input);
    return Buffer.from(canonicalText, 'utf-8');
  }
}
