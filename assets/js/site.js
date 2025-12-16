(function () {
  const postList = document.getElementById("postList");
  const tabs = Array.from(document.querySelectorAll(".tab[data-category]"));
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  function setActiveTab(activeButton) {
    tabs.forEach((t) => {
      const isActive = t === activeButton;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function filterPostsByCategory(category) {
    if (!postList) return;
    const items = Array.from(postList.querySelectorAll("li[data-categories]"));
    items.forEach((li) => {
      if (category === "__all__") {
        li.hidden = false;
        return;
      }
      const raw = li.getAttribute("data-categories") || "[]";
      let cats = [];
      try {
        cats = JSON.parse(raw);
      } catch (_e) {
        cats = raw.split("|");
      }
      if (typeof cats === "string") cats = [cats];
      cats = (cats || []).map((c) => String(c).trim()).filter(Boolean);
      li.hidden = !cats.includes(category);
    });
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");
      setActiveTab(btn);
      filterPostsByCategory(category);
    });
  });

  function closeResults() {
    if (!searchResults) return;
    searchResults.classList.remove("is-open");
    searchResults.innerHTML = "";
  }

  async function loadSearchIndex() {
    const res = await fetch((window.__searchJsonUrl || "/search.json"), { cache: "no-store" });
    if (!res.ok) throw new Error("search.json fetch failed");
    return res.json();
  }

  function normalize(str) {
    return String(str || "").toLowerCase();
  }

  function renderResults(items) {
    if (!searchResults) return;
    if (!items.length) {
      searchResults.innerHTML = `<div class="search-results__item"><span class="muted">No results</span></div>`;
      searchResults.classList.add("is-open");
      return;
    }
    searchResults.innerHTML = items
      .map((p) => {
        const cats = Array.isArray(p.categories) ? p.categories.join(", ") : "";
        return `
          <div class="search-results__item">
            <a href="${p.url}">
              <div><strong>${escapeHtml(p.title)}</strong></div>
              <div class="search-results__meta">${p.date}${cats ? " · " + escapeHtml(cats) : ""}</div>
            </a>
          </div>`;
      })
      .join("");
    searchResults.classList.add("is-open");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  let searchIndexPromise = null;
  let lastQuery = "";
  let debounceTimer = null;

  if (searchInput && searchResults) {
    searchInput.addEventListener("input", () => {
      const q = normalize(searchInput.value).trim();
      lastQuery = q;
      clearTimeout(debounceTimer);

      if (!q) {
        closeResults();
        return;
      }

      debounceTimer = setTimeout(async () => {
        try {
          searchIndexPromise = searchIndexPromise || loadSearchIndex();
          const posts = await searchIndexPromise;
          const hits = posts
            .map((p) => {
              const catList = Array.isArray(p.categories) ? p.categories : p.categories ? [p.categories] : [];
              const hay =
                normalize(p.title) +
                "\n" +
                normalize(p.excerpt) +
                "\n" +
                normalize(p.content) +
                "\n" +
                normalize(catList.join(" "));
              const idx = hay.indexOf(lastQuery);
              return idx === -1 ? null : { p, idx };
            })
            .filter(Boolean)
            .sort((a, b) => a.idx - b.idx)
            .slice(0, 8)
            .map((x) => x.p);

          renderResults(hits);
        } catch (_e) {
          searchResults.innerHTML = `<div class="search-results__item"><span class="muted">Search unavailable</span></div>`;
          searchResults.classList.add("is-open");
        }
      }, 120);
    });

    document.addEventListener("click", (e) => {
      if (!searchResults.classList.contains("is-open")) return;
      if (e.target === searchInput) return;
      if (searchResults.contains(e.target)) return;
      closeResults();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeResults();
    });
  }
})();
