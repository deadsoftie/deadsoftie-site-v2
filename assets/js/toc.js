(function () {
  const proseBody = document.getElementById("prose-body");
  const tocLinks = document.getElementById("toc-links");
  const progressBar = document.getElementById("progress-bar");
  const progressMeta = document.getElementById("progress-meta");

  if (!proseBody || !tocLinks) return;

  // Build TOC from H2 / H3 headings
  const headings = proseBody.querySelectorAll("h2, h3");
  const totalMin =
    parseInt(progressMeta && progressMeta.textContent.match(/\d+ min$/)?.[0]) ||
    1;

  headings.forEach(function (h) {
    if (!h.id) {
      h.id = h.textContent
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
    }
    const a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    if (h.tagName === "H3") a.classList.add("lvl-3");
    tocLinks.appendChild(a);
  });

  // Scroll handler: progress bar + active link
  const links = tocLinks.querySelectorAll("a");

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    if (progressBar) progressBar.style.width = pct + "%";
    if (progressMeta) {
      const minRead = Math.round((pct / 100) * totalMin);
      progressMeta.textContent =
        pct + "% · " + minRead + " of " + totalMin + " min";
    }

    // Active heading
    let current = null;
    headings.forEach(function (h) {
      if (h.getBoundingClientRect().top < 120) current = h.id;
    });
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Move footnotes into sidenotes rail
  const sidenotes = document.getElementById("sidenotes-container");
  const fnList = document.querySelector(".footnotes ol");
  if (sidenotes && fnList) {
    Array.from(fnList.children).forEach(function (li, i) {
      const div = document.createElement("div");
      div.className = "sidenote";
      const num = document.createElement("div");
      num.className = "sidenote-num";
      num.textContent = i + 1;
      div.appendChild(num);
      div.innerHTML += li.innerHTML.replace(/<a[^>]*↩︎?<\/a>/g, "");
      sidenotes.appendChild(div);
    });
    document.querySelector(".footnotes") &&
      document.querySelector(".footnotes").remove();
  }

  // Smooth-scroll TOC links
  tocLinks.addEventListener("click", function (e) {
    const target = e.target.closest("a");
    if (!target) return;
    e.preventDefault();
    const el = document.getElementById(target.getAttribute("href").slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
