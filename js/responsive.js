document.addEventListener("DOMContentLoaded", () => {
  function updateCardScale() {
    const preview = document.querySelector(".preview");
    if (!preview) return;

    const isMobile = window.innerWidth <= 900;
    const padding = isMobile ? 24 : 60;
    const availableWidth = Math.max(280, preview.clientWidth - padding);
    const baseScale = Math.min(1, availableWidth / 700);
    const scale = isMobile && document.body.classList.contains("mobile-edit")
      ? Math.min(baseScale, 0.44)
      : baseScale;

    document.documentElement.style.setProperty(
      "--card-scale",
      String(scale)
    );

    App.cardScale = scale;
  }

  updateCardScale();
  window.addEventListener("resize", updateCardScale);
  window.addEventListener("orientationchange", updateCardScale);
});
