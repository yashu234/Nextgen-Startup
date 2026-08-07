export const LANDING_PAGE_PROMPT = `You are a Principal Frontend Engineer.
Startup concept: {idea}
Brand context: {brandingOutput}

Generate a high-converting single-page landing page for this exact startup.
Rules:
1. Return ONLY valid, executable raw HTML string. Do NOT wrap in markdown code fences (\`\`\`html), no preamble.
2. Include <script src="https://cdn.tailwindcss.com"></script> in <head>.
3. Use the provided brand colors as Tailwind arbitrary values (e.g. bg-[#hex], text-[#hex]).
4. Structure: Navigation bar, Hero (headline + subhead + CTA button), Feature grid (3-4 cards), Testimonial or Pricing section, Footer.
5. Use real, idea-specific copy — no lorem ipsum, no placeholder text.
6. Fully responsive (mobile-first Tailwind classes).
7. No external image URLs — use CSS gradients, inline SVG icons, or Tailwind visual elements only.`;