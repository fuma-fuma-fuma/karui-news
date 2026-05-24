let newsData = null;
let currentCategory = "general";

async function loadNews() {
  const res = await fetch("./data/news.json");
  newsData = await res.json();

  document.getElementById("updated").textContent =
    `Updated: ${newsData.updated}`;

  renderNews();
}

function renderNews() {
  const container = document.getElementById("news-list");
  container.innerHTML = "";

  const list = newsData[currentCategory] || [];

  for (const item of list) {
    const article = document.createElement("article");
    article.className = "news-item";

    article.innerHTML = `
      <div class="news-title">
        <a href="${item.url}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(item.title)}
        </a>
      </div>

      <div class="news-description">
        ${escapeHtml(item.description || "")}
      </div>

      <div class="meta">
        ${escapeHtml(item.source || "")}
        /
        ${escapeHtml(item.publishedAt || "")}
      </div>

      <div class="url-block">
        <div class="url-label">
          News URL
        </div>

        <div class="url-text">
          ${escapeHtml(item.url || "")}
        </div>
      </div>

      <div class="url-block">
        <div class="url-label">
          Image URL
        </div>

        <div class="url-text">
          ${escapeHtml(item.image || "")}
        </div>
      </div>

      <div class="actions">
        <button class="read-btn">
          本文を表示
        </button>
      </div>

      <div class="content"></div>
    `;

    const btn = article.querySelector(".read-btn");
    const contentDiv = article.querySelector(".content");

    let loaded = false;

    btn.addEventListener("click", () => {
      if (!loaded) {
        // contentDiv.textContent = item.content || "本文なし";
        contentDiv.textContent = formatContent(
            item.content || "本文なし"
        );
        loaded = true;
      }

      contentDiv.classList.toggle("visible");

      btn.textContent = contentDiv.classList.contains("visible")
        ? "閉じる"
        : "本文を表示";
    });

    container.appendChild(article);
  }
}

function formatContent(text) {
  return String(text)
    .replace(/\t/g, "　")
    .replace(/\r/g, "");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach(t => t.classList.remove("active"));

    tab.classList.add("active");

    currentCategory = tab.dataset.category;

    renderNews();
  });
});

loadNews();