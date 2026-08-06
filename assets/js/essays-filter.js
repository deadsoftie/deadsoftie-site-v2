// Client-side tag filter for /essays. No search box, no sort — the
// Modernist redesign dropped both. Supports a preselected tag via
// ?tag=<name> so links like a project card can deep-link into a filtered
// view (see /projects "porting notes →").
(function () {
  var essays = window.__essays || [];
  if (!essays.length) return;

  var listEl = document.getElementById("essays-list");
  var tagBtns = document.querySelectorAll("[data-tag]");
  var activeTag = "all";

  var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

  function fmtDate(iso) {
    return iso.replace(/(\d{4})-(\d{2})-(\d{2})/, function (_, y, m, d) {
      return parseInt(d, 10) + " " + months[parseInt(m, 10) - 1] + " " + y;
    });
  }

  function render() {
    var data = essays.slice().sort(function (a, b) {
      return b.date.localeCompare(a.date);
    });

    if (activeTag !== "all") {
      data = data.filter(function (e) {
        return e.tags && e.tags.indexOf(activeTag) !== -1;
      });
    }

    listEl.innerHTML = data
      .map(function (e) {
        var mins = e.read_time || Math.ceil(e.words / 220) || 1;
        var tagsText = (e.tags || []).map(function (t) { return "#" + t; }).join(" ");
        var pin = e.pinned ? '<span class="pin-tag">pinned</span>' : "";
        return (
          '<a href="' + e.url + '" class="post-row">' +
          '<span class="row-top">' + pin + '<span class="post-title">' + e.title + "</span></span>" +
          '<span class="row-meta"><span>' + fmtDate(e.date) + "</span><span>·</span><span>" + mins + " min</span>" +
          (tagsText ? "<span>·</span><span>" + tagsText + "</span>" : "") +
          "</span></a>"
        );
      })
      .join("");
  }

  tagBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeTag = btn.dataset.tag;
      tagBtns.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      render();
    });
  });

  var urlTag = new URLSearchParams(window.location.search).get("tag");
  if (urlTag) {
    activeTag = urlTag;
    tagBtns.forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.tag === urlTag);
    });
  }

  render();
})();
