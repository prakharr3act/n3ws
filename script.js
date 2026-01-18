const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
const proxy = "https://api.allorigins.win/raw?url=";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

async function fetchNews(query) {
    if (!query) return;
    try {
        const res = await fetch(`${proxy}${encodeURIComponent(url + query + "&apiKey=" + API_KEY)}`);
        const data = await res.json();

        if (!data.articles || data.articles.length === 0) {
            document.getElementById("cards-container").innerHTML = "<h2>No news found.</h2>";
            return;
        }

        bindData(data.articles);
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById("cards-container").innerHTML =
          "<h2>r3act.technologies detected unusual request activity.<br>System integrity protection triggered.<br>Failed to load N3WS. Try again later.</h2>";
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");
    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector(".news-img");
    const newsTitle = cardClone.querySelector(".news-title");
    const newsSource = cardClone.querySelector(".news-source");
    const newsDesc = cardClone.querySelector(".news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.textContent = article.title || "";
    newsDesc.textContent = article.description || "";

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });
    newsSource.textContent = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
    searchText.value = "";
});

