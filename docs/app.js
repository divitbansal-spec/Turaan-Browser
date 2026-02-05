const addressInput = document.getElementById("address");
const frame = document.getElementById("browser-frame");
const status = document.getElementById("status");
const newtab = document.getElementById("newtab");
const news = document.getElementById("news");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const tabs = document.querySelectorAll(".tab[data-tab]");
const viewer = document.getElementById("viewer");
const viewerUrl = document.getElementById("viewer-url");
const viewerOpen = document.getElementById("viewer-open");

const TURAAN_SEARCH = "https://www.google.com/search?igu=1&q=";
const TURAAN_PROXY = "https://r.jina.ai/http://";
const START_DOMAIN = "start.tb";
const NEWS_DOMAIN = "news.tb";

const updateStatus = (message) => {
  status.textContent = message;
};

const showNewTab = () => {
  newtab.classList.remove("hidden");
  news.classList.add("hidden");
  tabs.forEach((tab) => tab.classList.remove("tab--active"));
  document.querySelector('[data-tab="newtab"]')?.classList.add("tab--active");
  frame.classList.remove("visible");
  frame.removeAttribute("src");
  viewer.classList.add("hidden");
  viewerUrl.textContent = START_DOMAIN;
  addressInput.value = START_DOMAIN;
  updateStatus("Turaan is ready.");
};

const showNewsTab = () => {
  newtab.classList.add("hidden");
  news.classList.remove("hidden");
  tabs.forEach((tab) => tab.classList.remove("tab--active"));
  document.querySelector('[data-tab="news"]')?.classList.add("tab--active");
  frame.classList.remove("visible");
  frame.removeAttribute("src");
  viewer.classList.add("hidden");
  viewerUrl.textContent = NEWS_DOMAIN;
  addressInput.value = NEWS_DOMAIN;
  updateStatus("Viewing Turaan News.");
};

const isExternalUrl = (url) => /^https?:\/\//i.test(url);

const showFrame = () => {
  newtab.classList.add("hidden");
  news.classList.add("hidden");
  frame.classList.add("visible");
  viewer.classList.remove("hidden");
};

const toProxyUrl = (url) => `${TURAAN_PROXY}${url.replace(/^https?:\/\//i, "")}`;

const formatUrl = (value) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed === START_DOMAIN) {
    return START_DOMAIN;
  }

  if (trimmed === NEWS_DOMAIN) {
    return NEWS_DOMAIN;
  }

  if (trimmed.includes(" ")) {
    return `${TURAAN_SEARCH}${encodeURIComponent(trimmed)}`;
  }

  if (isExternalUrl(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes(".")) {
    return `https://${trimmed}`;
  }

  return `${TURAAN_SEARCH}${encodeURIComponent(trimmed)}`;
};

const navigate = (value) => {
  const target = formatUrl(value);
  if (!target) {
    updateStatus("Enter a search or URL to navigate.");
    return;
  }

  if (target === START_DOMAIN) {
    showNewTab();
    updateStatus("Returned to start.tb");
    return;
  }

  if (target === NEWS_DOMAIN) {
    showNewsTab();
    return;
  }

  if (isExternalUrl(target)) {
    frame.src = toProxyUrl(target);
    viewerUrl.textContent = target;
    showFrame();
    updateStatus(`Previewing ${target} in Turaan View.`);
    return;
  }

  frame.src = target;
  viewerUrl.textContent = target;
  showFrame();
  updateStatus(`Turaan is navigating to ${target}`);
};

const actionHandlers = {
  back: () => frame.contentWindow?.history.back(),
  forward: () => frame.contentWindow?.history.forward(),
  refresh: () => frame.contentWindow?.location.reload(),
  go: () => navigate(addressInput.value),
  newtab: () => showNewTab(),
  news: () => showNewsTab(),
};

addressInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    navigate(addressInput.value);
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  navigate(searchInput.value);
});

frame.addEventListener("load", () => {
  const current = frame.src || "New tab";
  updateStatus(`Loaded ${current}`);
  addressInput.value = current;
});

for (const button of document.querySelectorAll("[data-action]")) {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    actionHandlers[action]?.();
  });
}

for (const chip of document.querySelectorAll("[data-url]")) {
  chip.addEventListener("click", () => {
    const url = chip.dataset.url;
    addressInput.value = url;
    navigate(url);
  });
}

viewerOpen.addEventListener("click", async () => {
  const url = viewerUrl.textContent || "";
  if (!url) {
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    updateStatus(`Copied ${url}`);
  } catch (error) {
    updateStatus(`Copy failed. URL: ${url}`);
  }
});

showNewTab();
