---
layout: default
title: Write
permalink: /write/
---

<header class="page-header">
  <h1>Write a post</h1>
  <p class="muted">Generates a ready-to-commit <code>_posts/YYYY-MM-DD-title.md</code> file (download or copy).</p>
</header>

<div class="writer">
  <div class="writer__form">
    <label class="label" for="wTitle">Title</label>
    <input class="input" id="wTitle" type="text" placeholder="e.g., Learning strategies that work" />

    <div class="writer__row">
      <div>
        <label class="label" for="wDate">Date</label>
        <input class="input" id="wDate" type="text" />
      </div>
      <div>
        <label class="label" for="wSlug">Slug (optional)</label>
        <input class="input" id="wSlug" type="text" placeholder="auto from title" />
      </div>
    </div>

    <label class="label" for="wCategories">Categories (comma separated)</label>
    <input class="input" id="wCategories" type="text" placeholder="e.g., LLM and Agent, Notes" />

    <label class="label" for="wContent">Content (Markdown)</label>
    <textarea class="textarea" id="wContent" rows="14" placeholder="Write in Markdown…"></textarea>

    <div class="writer__actions">
      <button class="btn" id="wDownload" type="button">Download .md</button>
      <button class="btn btn--ghost" id="wCopy" type="button">Copy Markdown</button>
      <span class="muted" id="wStatus" aria-live="polite"></span>
    </div>

    <p class="muted">
      Output path: <code id="wPath">_posts/</code>
    </p>
  </div>

  <aside class="writer__preview">
    <div class="writer__panel">
      <div class="writer__panelTitle">Preview (raw)</div>
      <pre class="writer__pre"><code id="wOutput"></code></pre>
    </div>
  </aside>
</div>

<script src="{{ '/assets/js/write.js' | relative_url }}" defer></script>
