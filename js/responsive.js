document.addEventListener("DOMContentLoaded", () => {
  function updateCardScale() {
    const preview = document.querySelector(".preview");
    if (!preview) return;

    const padding = window.innerWidth <= 900 ? 24 : 60;
    const availableWidth = Math.max(320, preview.clientWidth - padding);
    const scale = Math.min(1, availableWidth / 700);

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
