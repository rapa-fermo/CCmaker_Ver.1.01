document.addEventListener("DOMContentLoaded", () => {
  const background = document.getElementById("background");

  if (!background) return;

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = 0;

  background.addEventListener("pointerdown", e => {
    if (!App.state.backgroundEditMode) return;

    dragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const t = App.state.backgroundTransform || { x: 0, y: 0 };
    baseX = Number(t.x || 0);
    baseY = Number(t.y || 0);

    background.setPointerCapture(e.pointerId);
  });

  background.addEventListener("pointermove", e => {
    if (!dragging || !App.state.backgroundEditMode) return;

    const delta = App.getPointerDelta(e, startX, startY);

    App.state.backgroundTransform = {
      x: baseX + delta.x,
      y: baseY + delta.y
    };

    // 背景画像の端がカード内に入り込んで空白が出ないように制限する。
    // 画像サイズ取得前は renderBackground 側の再計算後に制限される。
    if (typeof App.clampBackgroundTransform === "function") {
      App.clampBackgroundTransform();
    }

    App.renderBackground();
  });

  function stopDrag(e) {
    if (!dragging) return;

    dragging = false;

    try {
      background.releasePointerCapture(e.pointerId);
    } catch {}

    App.saveLocal();
  }

  background.addEventListener("pointerup", stopDrag);
  background.addEventListener("pointercancel", stopDrag);
});
