document.addEventListener("DOMContentLoaded", function () {
  fetch("JSON/bulgarian.json")
    .then((response) => response.json())
    .then((data) => createTable(data));
});

function createTable(data) {
  const tableContainer = document.getElementById("alphabet-table");
  const cyrillic = data.cyrillic;
  const latin = data.latin;

  cyrillic.forEach((letter, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = letter;
    cell.dataset.latin = latin[index];

    cell.addEventListener("mouseenter", function () {
      this.textContent = this.dataset.latin;
    });

    cell.addEventListener("mouseleave", function () {
      this.textContent = letter;
    });

    tableContainer.appendChild(cell);
  });
}
