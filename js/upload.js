document.addEventListener("DOMContentLoaded", () => {

  const photoInput =
    document.getElementById("photoInput");

  const backgroundInput =
    document.getElementById("backgroundInput");

  const photoArea =
    App.el.photoArea;

  const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
  const WARN_IMAGE_BYTES = 8 * 1024 * 1024;
  const OPTIMIZE_TRIGGER_BYTES = 2 * 1024 * 1024;
  const MAX_LONG_EDGE = 2048;
  const WARN_LONG_EDGE = 4096;
  const JPEG_QUALITY = 0.9;

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

  async function loadBackground(e) {

    const file =
      e.target.files[0];

    if (!file) return;

    try {
      const dataUrl = await optimizeImportedImage(file, "背景画像");

      App.state.background = dataUrl;

      App.state.backgroundTransform = {
        x: 0,
        y: 0
      };

      App.backgroundImageInfo = {
        src: "",
        width: 0,
        height: 0
      };

      App.render();
      App.saveLocal();
    } catch (err) {
      console.error(err);
      alert(err.message || "背景画像を読み込めませんでした");
      e.target.value = "";
    }

  }

  async function loadPhoto(e) {

    const file =
      e.target.files[0];

    if (!file) return;

    try {
      const dataUrl = await optimizeImportedImage(file, "写真");

      App.state.photo = dataUrl;

      App.state.photoTransform = {
        x: 0,
        y: 0,
        scale: 1
      };

      App.render();
      App.saveLocal();
    } catch (err) {
      console.error(err);
      alert(err.message || "写真を読み込めませんでした");
      e.target.value = "";
    }

  }

  async function optimizeImportedImage(file, label) {
    if (!file.type || !file.type.startsWith("image/")) {
      throw new Error(`${label}は画像ファイルを選択してください。`);
    }

    if (!/image\/(jpeg|jpg|png|webp)/i.test(file.type)) {
      throw new Error(`${label}は JPG / PNG / WebP を使用してください。`);
    }

    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error(`${label}の容量が大きすぎます。25MB以下の画像を使用してください。`);
    }

    const originalDataUrl = await readFileAsDataURL(file);
    const img = await loadImage(originalDataUrl);

    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    const longEdge = Math.max(width, height);

    if (file.size > WARN_IMAGE_BYTES || longEdge > WARN_LONG_EDGE) {
      alert(`${label}が大きいため、スマホで安定して保存できるよう自動最適化します。`);
    }

    if (file.size <= OPTIMIZE_TRIGGER_BYTES && longEdge <= MAX_LONG_EDGE) {
      return originalDataUrl;
    }

    const scale = Math.min(1, MAX_LONG_EDGE / longEdge);
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);

    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
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

  window.addEventListener("ccmaker:stop-dragging", stopDrag);

  function stopDrag(e) {

    const pointerId = e && e.pointerId;

    if (pointerId !== undefined) {
      activePointers.delete(pointerId);
    } else {
      activePointers.clear();
    }

    if (!dragging && activePointers.size === 0) {
      App.saveLocal();
      return;
    }

    dragging = false;

    if (pointerId !== undefined) {
      try {
        photoArea.releasePointerCapture(pointerId);
      } catch {}
    }

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
