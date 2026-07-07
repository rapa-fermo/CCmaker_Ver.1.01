document.addEventListener("DOMContentLoaded", () => {
  window.updateCardScale = function updateCardScale() {
    const preview = document.querySelector(".preview");
    if (!preview) return;

    const size = App.getCardSize ? App.getCardSize() : { width: 700, height: 1000 };
    const isMobile = window.innerWidth <= 900;
    const padding = isMobile ? 24 : 60;
    const availableWidth = Math.max(280, preview.clientWidth - padding);
    const availableHeight = Math.max(280, window.innerHeight - padding);

    const widthScale = availableWidth / size.width;
    const heightScale = availableHeight / size.height;
    const baseScale = Math.min(1, widthScale, heightScale);
    const scale = isMobile && document.body.classList.contains("mobile-edit")
      ? Math.min(baseScale, size.width > size.height ? 0.32 : 0.44)
      : baseScale;

    document.documentElement.style.setProperty(
      "--card-scale",
      String(scale)
    );

    App.cardScale = scale;
  };

  window.updateCardScale();
  window.addEventListener("resize", window.updateCardScale);
  window.addEventListener("orientationchange", window.updateCardScale);
});
