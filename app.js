const actions = {
  "start-match": () => {
    console.log("TODO: открыть форму подбора сиделки");
  },
  "urgent-call": () => {
    console.log("TODO: открыть модал срочного вызова");
  },
};

// Always open from the top of the page instead of restoring previous scroll.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo({ top: 0, left: 0, behavior: "auto" });

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const actionName = button.dataset.action;
    const handler = actions[actionName];

    if (typeof handler === "function") {
      handler();
    }
  });
});
