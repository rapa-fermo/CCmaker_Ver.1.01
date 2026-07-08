document.addEventListener("DOMContentLoaded", () => {
  function isMobileLayout() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function isFormFocused() {
    const active = document.activeElement;
    return !!(
      active &&
      ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)
    );
  }

  window.updateCardScale = function updateCardScale() {
    const preview = document.querySelector(".preview");
    if (!preview) return;

    // Android Chromeはキーボード表示時にもresizeが連続発火するため、
    // 編集画面で入力中はカード倍率の再計算を止めてスクロール位置を保護する。
    if (isMobileLayout() && document.body.classList.contains("mobile-edit") && isFormFocused()) {
      return;
    }

    const size = App.getCardSize ? App.getCardSize() : { width: 700, height: 1000 };
    const isMobile = window.innerWidth <= 900;
    const isSpreadLandscapeWorkspace = isMobile
      && document.body.classList.contains("mobile-spread-workspace")
      && document.body.classList.contains("mobile-landscape");
    const padding = isSpreadLandscapeWorkspace ? 28 : (isMobile ? 24 : 60);
    const availableWidth = Math.max(280, preview.clientWidth - padding);
    const availableHeight = Math.max(220, (isSpreadLandscapeWorkspace ? preview.clientHeight : window.innerHeight) - padding);

    const widthScale = availableWidth / size.width;
    const heightScale = availableHeight / size.height;
    const baseScale = Math.min(1, widthScale, heightScale);
    const scale = isSpreadLandscapeWorkspace
      ? baseScale
      : (isMobile && document.body.classList.contains("mobile-edit")
        ? Math.min(baseScale, size.width > size.height ? 0.32 : 0.44)
        : baseScale);

    document.documentElement.style.setProperty(
      "--card-scale",
      String(scale)
    );

    App.cardScale = scale;
  };

  let resizeTimer = null;
  function scheduleCardScaleUpdate(delay = 120) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      window.updateCardScale();
    }, delay);
  }

  window.updateCardScale();
  window.addEventListener("resize", () => scheduleCardScaleUpdate(140));
  window.addEventListener("orientationchange", () => scheduleCardScaleUpdate(260));
});
