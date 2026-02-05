const addressInput = document.getElementById("address");
const frame = document.getElementById("browser-frame");
const status = document.getElementById("status");
const newtab = document.getElementById("newtab");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const TURAAN_SEARCH = "https://www.google.com/search?igu=1&q=";
const START_DOMAIN = "start.tb";

const updateStatus = (message) => {
  status.textContent = message;
};

const showNewTab = () => {
  newtab.classList.remove("hidden");
  frame.classList.remove("visible");
  frame.removeAttribute("src");
  addressInput.value = START_DOMAIN;
  updateStatus("Turaan is ready.");
};

const isExternalUrl = (url) => /^https?:\/\//i.test(url);

const showFrame = () => {
  newtab.classList.add("hidden");
  frame.classList.add("visible");
};

const formatUrl = (value) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed === START_DOMAIN) {
    return START_DOMAIN;
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

  if (isExternalUrl(target)) {
    window.open(target, "_blank", "noopener,noreferrer");
    showNewTab();
    updateStatus(`Opened ${target} in a new tab.`);
    return;
  }

  frame.src = target;
  showFrame();
  updateStatus(`Turaan is navigating to ${target}`);
};

const actionHandlers = {
  back: () => frame.contentWindow?.history.back(),
  forward: () => frame.contentWindow?.history.forward(),
  refresh: () => frame.contentWindow?.location.reload(),
  go: () => navigate(addressInput.value),
  newtab: () => showNewTab(),
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

showNewTab();
