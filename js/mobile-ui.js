document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editTabButton");
  const previewBtn = document.getElementById("previewTabButton");
  const floatingSave = document.getElementById("floatingSaveButton");
  const saveButton = document.getElementById("saveButton");
  const installButton = document.getElementById("installPwaButton");
  const iosHint = document.getElementById("iosInstallHint");

  function isMobileLayout() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function setMode(mode) {
    document.body.classList.toggle("mobile-edit", mode === "edit");
    document.body.classList.toggle("mobile-preview", mode === "preview");
    editBtn?.classList.toggle("active", mode === "edit");
    previewBtn?.classList.toggle("active", mode === "preview");

    if (mode === "preview") {
      requestAnimationFrame(() => {
        if (typeof App !== "undefined" && typeof App.render === "function") {
          App.render();
        }
        window.dispatchEvent(new Event("resize"));
      });
    }
  }

  editBtn?.addEventListener("click", () => setMode("edit"));
  previewBtn?.addEventListener("click", () => setMode("preview"));

  floatingSave?.addEventListener("click", () => {
    saveButton?.click();
  });

  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("focus", () => {
      if (isMobileLayout()) setMode("edit");
    });
  });

  let deferredInstallPrompt = null;

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (installButton) installButton.hidden = false;
  });

  installButton?.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    try {
      await deferredInstallPrompt.userChoice;
    } finally {
      deferredInstallPrompt = null;
      installButton.hidden = true;
    }
  });

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
  if (isIOS && !isStandalone && iosHint) {
    iosHint.hidden = false;
    setTimeout(() => {
      iosHint.hidden = true;
    }, 8000);
  }

  if (isMobileLayout()) setMode("edit");
});
