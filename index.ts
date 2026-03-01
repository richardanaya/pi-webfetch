import { Type } from "@mariozechner/pi-ai";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import TurndownService from 'turndown'; // or similar
export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "webfetch_to_markdown",
    label: "Web Fetch to Markdown",
    description: "Fetch URL and return as markdown using content negotiation",
    parameters: Type.Object({
      url: Type.String({ description: "URL to fetch" }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const { url } = params;
      
      // Try content negotiation first (Accept: text/markdown)
      const response = await fetch(url, {
        headers: {
          "Accept": "text/markdown, text/html",
        },
      });
      
      const contentType = response.headers.get('content-type') || '';
      let markdown: string;
      
      if (contentType.includes('text/markdown')) {
        // Server supports markdown negotiation
        markdown = await response.text();
      } else {
        // Fallback: convert HTML to markdown
        const html = await response.text();
        const turndownService = new TurndownService();
        
        // Remove script and style tags
        turndownService.remove(['script', 'style', 'noscript']);
        
        markdown = turndownService.turndown(html);
      }
      
      return {
        content: [{ type: "text", text: markdown }],
        details: { url, contentType },
      };
    },
  });
}
