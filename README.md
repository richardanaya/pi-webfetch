# pi-webfetch

A [pi](https://github.com/mariohack/pi) extension that fetches web content and returns it as Markdown, optimized for AI consumption.

## The Problem

Modern websites are built for humans, not AI agents. Raw HTML contains navigation bars, scripts, styling, and semantic markup that adds noise and increases token usage when processed by AI systems. As Cloudflare notes in their ["Markdown for Agents"](https://blog.cloudflare.com/markdown-for-agents/) article, feeding raw HTML to AI is inefficient:

> *"Feeding raw HTML to an AI is like paying by the word to read packaging instead of the letter inside."*

## The Solution

This extension implements a two-tier approach:

### 1. Content Negotiation (Cloudflare's Markdown for Agents)

Following the [Cloudflare "Markdown for Agents"](https://blog.cloudflare.com/markdown-for-agents/) standard, this extension first attempts to request Markdown directly from the server using the HTTP `Accept: text/markdown` header. When a website supports this (like Cloudflare-enabled zones), the server returns clean, structured Markdown instead of HTML.

**Benefits:**
- ~80% reduction in token usage compared to HTML
- No computation overhead for conversion
- Preserves the content creator's intent
- Returns metadata via frontmatter (title, description, etc.)

### 2. Fallback: Turndown HTML-to-Markdown Conversion

When a server doesn't support content negotiation, the extension falls back to [Turndown](https://github.com/mixmark-io/turndown) — a robust HTML-to-Markdown converter. Turndown intelligently strips:

- Scripts and styles
- Navigation elements
- Non-semantic markup
- Inline styles and classes

**Result:** Clean, readable Markdown that AI can process efficiently.

## Installation

Install via [pi](https://pi.dev/) from npm:

```bash
pi install npm:pi-webfetch
```

Or install directly from GitHub:

```bash
pi install git:github.com/richardanaya/pi-webfetch-to-markdown
```

Pin to a specific version with `@version` (e.g., `pi install npm:pi-webfetch@1.0.0`).

Test without installing using `pi -e git:github.com/richardanaya/pi-webfetch-to-markdown`.

## Usage

Once installed in your pi environment, the extension provides the `webfetch_to_markdown` tool:

```javascript
// The tool accepts a URL and returns markdown
{
  url: "https://example.com/article"
}
```

## How It Works

1. **Request:** Sends HTTP request with `Accept: text/markdown, text/html`
2. **Negotiation:** If server returns `text/markdown`, returns it directly
3. **Conversion:** If server returns HTML, Turndown converts it to Markdown
4. **Output:** Returns clean Markdown with source metadata

## Why Markdown for AI?

As outlined in the Cloudflare article:

| Format | Token Count | Efficiency |
|--------|-------------|------------|
| HTML | ~16,180 tokens | Baseline |
| Markdown | ~3,150 tokens | **~80% reduction** |

Markdown's explicit structure (headings, lists, links) makes it ideal for AI processing, resulting in better comprehension and reduced context window pressure.

## Related

- [Cloudflare Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/) — The original announcement and philosophy
- [Turndown](https://github.com/mixmark-io/turndown) — The HTML-to-Markdown conversion library
- [Content Signals](https://contentsignals.org/) — Framework for expressing content usage preferences

## License

MIT
