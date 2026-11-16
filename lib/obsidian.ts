/**
 * Turns Obsidian-only syntax into plain Markdown so a note renders cleanly on the site.
 * Used only for display: the downloadable file stays byte-for-byte the original note.
 * Frontmatter is removed earlier (gray-matter in lib/resources.ts). Code is never changed:
 * fenced blocks and `inline code` are skipped.
 *
 * - `![[file]]` embeds        → removed (the embedded note or image is not on the site)
 * - `[[note|alias]]`          → alias
 * - `[[note#heading]]`        → note › heading
 * - `> [!type] Title` callout → blockquote starting with **Title** (or **Type**)
 * - `%%comment%%`             → removed
 * - `==highlight==`           → the text
 * - `#tags`                   → kept as plain text
 */
export function obsidianToMarkdown(body: string): string {
  let fence: string | null = null;
  return body
    .split("\n")
    .map((line) => {
      const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
      if (fence) {
        if (marker && marker[0] === fence[0] && marker.length >= fence.length && line.trim() === marker) fence = null;
        return line;
      }
      if (marker) {
        fence = marker;
        return line;
      }
      return convertLine(line);
    })
    .join("\n");
}

function convertLine(line: string): string {
  const callout = line.match(/^(\s*(?:>\s*)+)\[!([\w-]+)\][+-]?\s*(.*)$/);
  if (callout) {
    const [, prefix, type, title] = callout;
    return `${prefix}**${title || type[0].toUpperCase() + type.slice(1)}**`;
  }
  // Split off inline code spans (odd indexes) so they stay untouched.
  return line
    .split(/(`[^`]*`)/)
    .map((part, i) =>
      i % 2
        ? part
        : part
            .replace(/%%.*?%%/g, "")
            .replace(/!\[\[[^\]]*\]\]/g, "")
            .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
            .replace(/\[\[([^\]]+)\]\]/g, (_, target: string) => target.replace(/#\^?/, " › "))
            .replace(/==([^=]+)==/g, "$1"),
    )
    .join("");
}
