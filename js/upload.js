document.addEventListener("DOMContentLoaded", () => {

  const photoInput =
    document.getElementById("photoInput");

  const backgroundInput =
    document.getElementById("backgroundInput");

  const photoArea =
    App.el.photoArea;

  /*=========================
    アップロード
  =========================*/

  photoInput.addEventListener(
    "change",
    loadPhoto
  );

  if (backgroundInput) {
    backgroundInput.addEventListener(
      "change",
      loadBackground
    );
  }

  function loadBackground(e) {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = () => {

      App.state.background =
        reader.result;

      App.state.backgroundTransform = {
        x: 0,
        y: 0
      };

      App.render();
      App.saveLocal();

    };

    reader.readAsDataURL(file);

  }

  function loadPhoto(e) {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = () => {

      App.state.photo =
        reader.result;

      App.state.photoTransform = {
        x: 0,
        y: 0,
        scale: 1
      };

      App.render();
      App.saveLocal();

    };

    reader.readAsDataURL(file);

  }

  /*=========================
    ドラッグ
  =========================*/

  let dragging = false;
  const activePointers = new Map();
  let pinchStartDistance = 0;
  let pinchBaseScale = 1;

  let startX = 0;
  let startY = 0;

  let baseX = 0;
  let baseY = 0;

  photoArea.addEventListener(
    "pointerdown",
    startDrag
  );

  function startDrag(e) {

    if (App.state.backgroundEditMode) return;

    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.size === 2) {
      dragging = false;
      pinchStartDistance = getPointerDistance();
      pinchBaseScale = App.state.photoTransform.scale;
      return;
    }

    dragging = true;

    startX = e.clientX;
    startY = e.clientY;

    baseX =
      App.state.photoTransform.x;

    baseY =
      App.state.photoTransform.y;

    photoArea.setPointerCapture(
      e.pointerId
    );

  }

  photoArea.addEventListener(
    "pointermove",
    dragMove
  );

  function dragMove(e) {

    if (!activePointers.has(e.pointerId)) return;

    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.size === 2) {
      const distance = getPointerDistance();
      if (pinchStartDistance > 0) {
        App.state.photoTransform.scale = clampScale(
          pinchBaseScale * (distance / pinchStartDistance)
        );
        App.renderPhoto();
      }
      return;
    }

    if (!dragging) return;

    const delta = App.getPointerDelta(e, startX, startY);

    App.state.photoTransform.x = baseX + delta.x;
    App.state.photoTransform.y = baseY + delta.y;

    App.renderPhoto();

  }

  photoArea.addEventListener(
    "pointerup",
    stopDrag
  );

  photoArea.addEventListener(
    "pointercancel",
    stopDrag
  );

  function stopDrag(e) {

    activePointers.delete(e.pointerId);

    if (!dragging && activePointers.size === 0) {
      App.saveLocal();
      return;
    }

    if (!dragging) return;

    dragging = false;

    try {

      photoArea.releasePointerCapture(
        e.pointerId
      );

    } catch {}

    App.saveLocal();

  }

  /*=========================
    ズーム
  =========================*/

  photoArea.addEventListener(
    "wheel",
    zoomPhoto,
    {
      passive: false
    }
  );

  function zoomPhoto(e) {

    e.preventDefault();

    if (e.deltaY < 0) {

      App.state.photoTransform.scale +=
        0.1;

    } else {

      App.state.photoTransform.scale -=
        0.1;

    }

    App.state.photoTransform.scale = clampScale(
      App.state.photoTransform.scale
    );

    App.renderPhoto();

    App.saveLocal();

  }

  /*=========================
    ダブルクリック
  =========================*/

  photoArea.addEventListener(
    "dblclick",
    resetPhoto
  );

  function getPointerDistance() {
    const points = [...activePointers.values()];
    if (points.length < 2) return 0;

    return Math.hypot(
      points[0].x - points[1].x,
      points[0].y - points[1].y
    );
  }

  function clampScale(scale) {
    return Math.max(0.1, Math.min(10, scale));
  }

  function resetPhoto() {

    App.state.photoTransform = {
      x: 0,
      y: 0,
      scale: 1
    };

    App.renderPhoto();

    App.saveLocal();

  }

});