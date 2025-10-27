const BASE = "https://www.googleapis.com/books/v1/volumes";
const $grid = $("#grid");
const $query = $("#searchInput");
const $status = $("#status");
const $error = $("#error");

function getCover(v) {
  const img = v?.imageLinks?.thumbnail || v?.imageLinks?.smallThumbnail;
  return img || "https://via.placeholder.com/200x280/0b1023/ffffff?text=No+Cover";
}

function makeCard(item) {
  const v = item.volumeInfo || {};
  const $card = $("<div>").addClass("card");
  $("<img>").addClass("cover").attr("src", getCover(v)).appendTo($card);
  const $body = $("<div>").addClass("card-body").appendTo($card);
  $("<h3>").addClass("book-title").text(v.title || "Untitled").appendTo($body);
  $("<p>").addClass("meta").text((v.authors && v.authors[0]) || "Unknown").appendTo($body);
  return $card;
}

function showBooks(items) {
  $grid.empty();
  const list = Array.isArray(items) ? items.slice(0, 20) : [];
  if (!list.length) $grid.append($("<p>").text("No books found."));
  else list.forEach(it => $grid.append(makeCard(it)));
  $status.text("");
}

async function fetchBooks(q = "the") {
  $status.text("Loading books...");
  $error.text("");
  $grid.empty();
  try {
    const url = `${BASE}?q=${encodeURIComponent(q)}&maxResults=20&printType=books`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    showBooks(data.items || []);
  } catch (err) {
    $status.text("");
    $error.text(`Failed to fetch books: ${err.message || "Network error"}`);
  }
}

$("#btnLoad").on("click", () => fetchBooks());
$("#btnSearch").on("click", () => { const q = $query.val().trim(); if (q) fetchBooks(q); });
$query.on("keydown", e => { if (e.key === "Enter") { e.preventDefault(); const q = $query.val().trim(); if (q) fetchBooks(q); }});
$(document).ready(() => fetchBooks());