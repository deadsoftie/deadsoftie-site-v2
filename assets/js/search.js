(function () {
  const essays = window.__essays || [];
  if (!essays.length) return;

  const searchInput = document.getElementById("essay-search");
  const countEl = document.getElementById("essay-count");
  const listEl = document.getElementById("essays-list");
  const tagBtns = document.querySelectorAll("[data-tag]");
  const sortBtns = document.querySelectorAll(".sort-btn");

  let activeTag = "all";
  let activeSort = "new";
  let query = "";

  function pluralize(n, s, p) {
    return n === 1 ? s : p;
  }

  function calcReadTime(words, declared) {
    return declared || Math.ceil(words / 220) || 1;
  }

  function render() {
    let data = essays.slice();

    if (activeTag !== "all") {
      data = data.filter(function (e) {
        return e.tags && e.tags.includes(activeTag);
      });
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(function (e) {
        return (
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.summary && e.summary.toLowerCase().includes(q))
        );
      });
    }

    if (activeSort === "long")
      data.sort(function (a, b) {
        return b.words - a.words;
      });
    if (activeSort === "short")
      data.sort(function (a, b) {
        return a.words - b.words;
      });
    if (activeSort === "new")
      data.sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });

    countEl.textContent = data.length + " matching";

    // Group by year
    const grouped = {};
    data.forEach(function (e) {
      (grouped[e.year] = grouped[e.year] || []).push(e);
    });
    const years = Object.keys(grouped).sort(function (a, b) {
      return b - a;
    });

    listEl.innerHTML = years
      .map(function (year) {
        const rows = grouped[year];
        return (
          '<div class="year-group">' +
          '<div class="year-header">' +
          '<h2 class="year-num">' +
          year +
          "</h2>" +
          '<span class="year-count">' +
          rows.length +
          " " +
          pluralize(rows.length, "essay", "essays") +
          "</span>" +
          "</div>" +
          rows
            .map(function (e) {
              const mins = calcReadTime(e.words, e.read_time);
              const dateStr = e.date
                ? e.date.replace(
                    /(\d{4})-(\d{2})-(\d{2})/,
                    function (_, y, m, d) {
                      const months = [
                        "jan",
                        "feb",
                        "mar",
                        "apr",
                        "may",
                        "jun",
                        "jul",
                        "aug",
                        "sep",
                        "oct",
                        "nov",
                        "dec",
                      ];
                      return parseInt(d) + " " + months[parseInt(m) - 1];
                    },
                  )
                : "";
              const tags = (e.tags || [])
                .map(function (t) {
                  return '<span class="tag">#' + t + "</span>";
                })
                .join("");
              const pinStyle = e.pinned
                ? ' style="background: linear-gradient(90deg, var(--accent-2-glow), transparent 40%);"'
                : "";
              const pinTag = e.pinned
                ? '<span class="pin-tag">★ pinned</span>'
                : "";
              return (
                '<a href="' +
                e.url +
                '" class="post-row"' +
                pinStyle +
                ">" +
                '<div class="date">' +
                dateStr +
                "</div>" +
                '<div class="post-title">' +
                pinTag +
                e.title +
                "</div>" +
                '<div class="post-tags">' +
                tags +
                "</div>" +
                '<div class="read">' +
                mins +
                " min</div>" +
                "</a>"
              );
            })
            .join("") +
          "</div>"
        );
      })
      .join("");
  }

  // Tag filter
  tagBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeTag = btn.dataset.tag;
      tagBtns.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      render();
    });
  });

  // Sort
  sortBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeSort = btn.dataset.sort;
      sortBtns.forEach(function (b) {
        b.style.color = b === btn ? "var(--accent)" : "var(--fg-dim)";
      });
      render();
    });
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      query = searchInput.value;
      render();
    });

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        query = "";
        searchInput.value = "";
        render();
      }
    });
  }

  function initRender() {
    var urlQ = new URLSearchParams(window.location.search).get("q");
    if (urlQ) {
      query = urlQ;
      if (searchInput) searchInput.value = urlQ;
      var chromeInput = document.getElementById("chrome-search");
      if (chromeInput) chromeInput.value = urlQ;
    }
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRender);
  } else {
    initRender();
  }
})();
