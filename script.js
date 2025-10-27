const BASE = "https://openlibrary.org/search.json";
const $grid = $("#grid");
const $query = $("#searchInput");
const $status = $("#status");
const $error = $("#error");

function getCover(book) {
  if (book.cover_i) return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  return "https://via.placeholder.com/200x280/0b1023/ffffff?text=No+Cover";
}

function makeCard(book) {
  const $card = $("<div>").addClass("card");
  $("<img>").addClass("cover").attr("src", getCover(book)).appendTo($card);
  const $body = $("<div>").addClass("card-body").appendTo($card);
  $("<h3>").addClass("book-title").text(book.title || "Untitled").appendTo($body);
  $("<p>").addClass("meta").text((book.author_name || ["Unknown"])[0]).appendTo($body);
  return $card;
}

function showBooks(books) {
  $grid.empty();
  if (!books.length) {
    $grid.append($("<p>").text("No books found."));
  } else {
    books.slice(0, 20).forEach(b => $grid.append(makeCard(b)));
  }
  $status.text("");
}

async function fetchBooks(query = "the") {
  $status.text("Loading books...");
  $error.text("");
  $grid.empty();
  try {
    const res = await fetch(`${BASE}?q=${encodeURIComponent(query)}&limit=20`);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    showBooks(data.docs || []);
  } catch (err) {
    $status.text("");
    $error.text(`Failed to fetch books: ${err.message}`);
  }
}

$("#btnLoad").on("click", () => fetchBooks());
$("#btnSearch").on("click", () => {
  const q = $query.val().trim();
  if (q) fetchBooks(q);
});
$query.on("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    fetchBooks($query.val().trim());
  }
});

$(document).ready(() => fetchBooks());