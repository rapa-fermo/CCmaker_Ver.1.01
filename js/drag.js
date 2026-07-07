document.addEventListener("DOMContentLoaded", () => {
  let target = null;
  let key = "";
  let activePointerId = null;
  let startX = 0;
  let startY = 0;
  let dragKeys = [];
  let basePositions = {};

  const dragGroups = {
    jobLabel: ["jobLabel", "job"],
    job: ["jobLabel", "job"],
    subjobLabel: ["subjobLabel", "subjob"],
    subjob: ["subjobLabel", "subjob"],
    gathererLabel: ["gathererLabel", "gatherer"],
    gatherer: ["gathererLabel", "gatherer"],
    crafterLabel: ["crafterLabel", "crafter"],
    crafter: ["crafterLabel", "crafter"]
  };

  function getDragKeys(textKey) {
    return dragGroups[textKey] || [textKey];
  }

  document.querySelectorAll(".draggable").forEach(el => {
    el.addEventListener("pointerdown", e => {
      if (App.state.backgroundEditMode) return;

      target = el;
      key = el.dataset.key;
      activePointerId = e.pointerId;
      dragKeys = getDragKeys(key).filter(k => App.state.texts[k]);
      basePositions = {};

      App.selectedKey = key;

      if (typeof updateEditor === "function") {
        updateEditor();
      }

      dragKeys.forEach(k => {
        const groupEl = document.querySelector(`.draggable[data-key="${k}"]`);
        if (groupEl) groupEl.classList.add("dragging");
        basePositions[k] = {
          x: App.state.texts[k].x,
          y: App.state.texts[k].y
        };
      });

      startX = e.clientX;
      startY = e.clientY;

      target.setPointerCapture(e.pointerId);
    });

    el.addEventListener("pointermove", e => {
      if (!target || e.pointerId !== activePointerId) return;

      const delta = App.getPointerDelta(e, startX, startY);

      dragKeys.forEach(k => {
        if (!basePositions[k]) return;
        App.state.texts[k].x = basePositions[k].x + delta.x;
        App.state.texts[k].y = basePositions[k].y + delta.y;
      });

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

    dragKeys.forEach(k => {
      const groupEl = document.querySelector(`.draggable[data-key="${k}"]`);
      if (groupEl) groupEl.classList.remove("dragging");
    });

    if (pointerId !== undefined) {
      try {
        target.releasePointerCapture(pointerId);
      } catch {}
    }

    target = null;
    key = "";
    activePointerId = null;
    dragKeys = [];
    basePositions = {};
    App.saveLocal();
  }
});
