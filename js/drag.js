document.addEventListener("DOMContentLoaded", () => {
  let target = null;
  let key = "";
  let activePointerId = null;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = 0;

  document.querySelectorAll(".draggable").forEach(el => {
    el.addEventListener("pointerdown", e => {
      if (App.state.backgroundEditMode) return;

      target = el;
      key = el.dataset.key;
      activePointerId = e.pointerId;

      App.selectedKey = key;

      if (typeof updateEditor === "function") {
        updateEditor();
      }

      target.classList.add("dragging");

      startX = e.clientX;
      startY = e.clientY;

      baseX = App.state.texts[key].x;
      baseY = App.state.texts[key].y;

      target.setPointerCapture(e.pointerId);
    });

    el.addEventListener("pointermove", e => {
      if (!target || e.pointerId !== activePointerId) return;

      const delta = App.getPointerDelta(e, startX, startY);

      App.state.texts[key].x = baseX + delta.x;
      App.state.texts[key].y = baseY + delta.y;

      App.renderTexts();
    });

    el.addEventListener("pointerup", stopTextDrag);
    el.addEventListener("pointercancel", stopTextDrag);
  });

  window.addEventListener("ccmaker:stop-dragging", stopTextDrag);

  function stopTextDrag(e) {
    if (!target) return;

    const pointerId = e && e.pointerId;
    if (pointerId !== undefined && pointerId !== activePointerId) return;

    target.classList.remove("dragging");

    if (pointerId !== undefined) {
      try {
        target.releasePointerCapture(pointerId);
      } catch {}
    }

    target = null;
    key = "";
    activePointerId = null;
    App.saveLocal();
  }
});
