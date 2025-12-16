(function () {
  const titleEl = document.getElementById("wTitle");
  const dateEl = document.getElementById("wDate");
  const slugEl = document.getElementById("wSlug");
  const categoriesEl = document.getElementById("wCategories");
  const contentEl = document.getElementById("wContent");
  const outputEl = document.getElementById("wOutput");
  const pathEl = document.getElementById("wPath");
  const statusEl = document.getElementById("wStatus");
  const downloadBtn = document.getElementById("wDownload");
  const copyBtn = document.getElementById("wCopy");

  if (!titleEl || !dateEl || !slugEl || !categoriesEl || !contentEl || !outputEl || !pathEl || !downloadBtn || !copyBtn) return;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tzOffsetString(d) {
    const offMin = -d.getTimezoneOffset();
    const sign = offMin >= 0 ? "+" : "-";
    const abs = Math.abs(offMin);
    return `${sign}${pad(Math.floor(abs / 60))}${pad(abs % 60)}`;
  }

  function defaultDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${tzOffsetString(d)}`;
  }

  function slugify(input) {
    const s = String(input || "").trim().toLowerCase();
    const ascii = s
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
    if (ascii) return ascii;
    const d = new Date();
    return `post-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  function parseCategories(input) {
    return String(input || "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }

  function buildMarkdown() {
    const title = String(titleEl.value || "").trim() || "Untitled";
    const date = String(dateEl.value || "").trim() || defaultDateString();
    const slug = String(slugEl.value || "").trim() || slugify(title);
    const cats = parseCategories(categoriesEl.value);
    const body = String(contentEl.value || "").replace(/\r\n/g, "\n").trim();

    const frontMatter = [
      "---",
      "layout: post",
      `title: ${JSON.stringify(title)}`,
      `date: ${date}`,
      `categories: ${JSON.stringify(cats)}`,
      "---",
      "",
    ].join("\n");

    const markdown = frontMatter + (body ? body + "\n" : "");
    const fileDate = date.slice(0, 10);
    const filename = `${fileDate}-${slug}.md`;
    const path = `_posts/${filename}`;
    return { markdown, path, filename };
  }

  function render() {
    const { markdown, path } = buildMarkdown();
    outputEl.textContent = markdown;
    pathEl.textContent = path;
  }

  function setStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    if (msg) setTimeout(() => (statusEl.textContent = ""), 2000);
  }

  downloadBtn.addEventListener("click", () => {
    const { markdown, filename } = buildMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus("Downloaded");
  });

  copyBtn.addEventListener("click", async () => {
    const { markdown } = buildMarkdown();
    try {
      await navigator.clipboard.writeText(markdown);
      setStatus("Copied");
    } catch (_e) {
      setStatus("Copy failed");
    }
  });

  dateEl.value = defaultDateString();
  render();

  [titleEl, dateEl, slugEl, categoriesEl, contentEl].forEach((el) => el.addEventListener("input", render));
})();
