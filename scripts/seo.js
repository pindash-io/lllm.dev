#!/usr/bin/env node
// Post-build: inject Open Graph + Twitter Card meta into all HTML files
const fs = require("fs");
const path = require("path");

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) injectMeta(full);
  }
}

function injectMeta(file) {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes('property="og:title"')) return;

  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="(.*?)">/);
  const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)">/);

  const title = titleMatch ? titleMatch[1] : "lllm.dev";
  const desc = descMatch ? descMatch[1] : "News on local LLMs.";
  const url = canonicalMatch ? canonicalMatch[1] : "https://lllm.dev";

  const ogTags = `
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${url}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
`;

  html = html.replace("</title>", `</title>${ogTags}`);
  fs.writeFileSync(file, html);
}

walk(path.join(__dirname, "..", "site"));
