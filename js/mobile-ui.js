document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editTabButton");
  const layoutBtn = document.getElementById("layoutTabButton");
  const previewBtn = document.getElementById("previewTabButton");
  const floatingSave = document.getElementById("floatingSaveButton");
  const saveButton = document.getElementById("saveButton");
  const installButton = document.getElementById("installPwaButton");
  const iosHint = document.getElementById("iosInstallHint");
  const zoomOutBtn = document.getElementById("previewZoomOut");
  const zoomInBtn = document.getElementById("previewZoomIn");
  const zoomResetBtn = document.getElementById("previewZoomReset");
  const zoomLabel = document.getElementById("previewZoomLabel");
  const landscapePrompt = document.getElementById("landscapePrompt");
  const landscapeContinueBtn = document.getElementById("landscapeContinueButton");
  const landscapeFullscreenBtn = document.getElementById("landscapeFullscreenButton");
  const landscapeBackEditBtn = document.getElementById("landscapeBackEdit");
  const landscapeModeLabel = document.getElementById("landscapeModeLabel");
  let previewZoom = 1;
  let allowPortraitSpreadWorkspace = false;

  function isMobileLayout() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function isLandscape() {
    return window.matchMedia("(orientation: landscape)").matches;
  }

  function isSpreadLayout() {
    return !!(window.App && App.state && App.state.layout === "magazine");
  }

  function updateLandscapeWorkspaceState() {
    const isWorkspaceMode = document.body.classList.contains("mobile-layout") || document.body.classList.contains("mobile-preview");
    const active = isMobileLayout() && isSpreadLayout() && isWorkspaceMode;
    const landscape = isLandscape();

    document.body.classList.toggle("mobile-spread-workspace", active);
    document.body.classList.toggle("mobile-landscape", active && landscape);
    document.body.classList.toggle("mobile-needs-landscape", active && !landscape && !allowPortraitSpreadWorkspace);

    if (landscapeModeLabel) {
      landscapeModeLabel.textContent = document.body.classList.contains("mobile-preview") ? "確認" : "レイアウト";
    }
  }

  function setMode(mode) {
    document.body.classList.toggle("mobile-edit", mode === "edit");
    document.body.classList.toggle("mobile-layout", mode === "layout");
    document.body.classList.toggle("mobile-preview", mode === "preview");
    editBtn?.classList.toggle("active", mode === "edit");
    layoutBtn?.classList.toggle("active", mode === "layout");
    previewBtn?.classList.toggle("active", mode === "preview");

    if (mode === "edit") {
      allowPortraitSpreadWorkspace = false;
    }

    updateLandscapeWorkspaceState();

    if (mode === "layout" || mode === "preview") {
      requestAnimationFrame(() => {
        if (typeof App !== "undefined" && typeof App.render === "function") {
          App.render();
        }
        window.dispatchEvent(new Event("resize"));
        updateLandscapeWorkspaceState();
      });
    }
  }

  editBtn?.addEventListener("click", () => setMode("edit"));
  layoutBtn?.addEventListener("click", () => setMode("layout"));
  previewBtn?.addEventListener("click", () => setMode("preview"));

  function setPreviewZoom(value) {
    previewZoom = Math.max(0.5, Math.min(2.5, Number(value) || 1));
    document.documentElement.style.setProperty("--preview-zoom", String(previewZoom));
    if (zoomLabel) zoomLabel.textContent = Math.round(previewZoom * 100) + "%";
  }

  zoomOutBtn?.addEventListener("click", () => setPreviewZoom(previewZoom - 0.1));
  zoomInBtn?.addEventListener("click", () => setPreviewZoom(previewZoom + 0.1));
  zoomResetBtn?.addEventListener("click", () => setPreviewZoom(1));
  setPreviewZoom(1);

  const previewArea = document.querySelector(".preview");
  let pinchStartDistance = 0;
  let pinchStartZoom = 1;

  function getTouchDistance(touches) {
    if (!touches || touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  previewArea?.addEventListener("touchstart", event => {
    if (!document.body.classList.contains("mobile-preview")) return;
    if (event.touches.length === 2) {
      pinchStartDistance = getTouchDistance(event.touches);
      pinchStartZoom = previewZoom;
    }
  }, { passive: true });

  previewArea?.addEventListener("touchmove", event => {
    if (!document.body.classList.contains("mobile-preview")) return;
    if (event.touches.length === 2 && pinchStartDistance > 0) {
      event.preventDefault();
      const distance = getTouchDistance(event.touches);
      setPreviewZoom(pinchStartZoom * (distance / pinchStartDistance));
    }
  }, { passive: false });

  landscapeContinueBtn?.addEventListener("click", () => {
    allowPortraitSpreadWorkspace = true;
    updateLandscapeWorkspaceState();
  });

  landscapeFullscreenBtn?.addEventListener("click", async () => {
    allowPortraitSpreadWorkspace = true;
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock("landscape");
      }
    } catch (err) {
      console.warn("横向き全画面への切り替えはブラウザ側で制限されました", err);
    } finally {
      updateLandscapeWorkspaceState();
      window.dispatchEvent(new Event("resize"));
    }
  });

  landscapeBackEditBtn?.addEventListener("click", () => setMode("edit"));

  window.addEventListener("resize", updateLandscapeWorkspaceState);
  window.addEventListener("orientationchange", () => {
    allowPortraitSpreadWorkspace = false;
    setTimeout(updateLandscapeWorkspaceState, 250);
  });

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
  setInterval(updateLandscapeWorkspaceState, 800);
});
