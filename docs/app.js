const addressInput = document.getElementById("address");
const frame = document.getElementById("browser-frame");
const status = document.getElementById("status");
const newtab = document.getElementById("newtab");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const TURAAN_SEARCH = "search.html?q=";

const updateStatus = (message) => {
  status.textContent = message;
};

const showNewTab = () => {
  newtab.classList.remove("hidden");
  frame.classList.remove("visible");
  frame.removeAttribute("src");
  updateStatus("Turaan is ready.");
};

const showFrame = () => {
  newtab.classList.add("hidden");
  frame.classList.add("visible");
};

const formatUrl = (value) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.includes(" ")) {
    return `${TURAAN_SEARCH}${encodeURIComponent(trimmed)}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
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
