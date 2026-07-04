document.addEventListener("DOMContentLoaded", () => {
  let resizeTimer = null;

  function stopAllDragging() {
    window.dispatchEvent(new CustomEvent("ccmaker:stop-dragging"));
    document.body.classList.remove("dragging");
  }

  window.addEventListener("orientationchange", () => {
    stopAllDragging();
    setTimeout(() => {
      if (typeof updateCardScale === "function") {
        updateCardScale();
      }
    }, 250);
  });

  window.addEventListener("resize", () => {
    stopAllDragging();

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof updateCardScale === "function") {
        updateCardScale();
      }
    }, 150);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAllDragging();
    }
  });
});
