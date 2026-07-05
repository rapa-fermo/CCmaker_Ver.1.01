document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("saveButton");
  const saveJson = document.getElementById("saveJson");
  const loadJson = document.getElementById("loadJson");

  saveButton.addEventListener("click", savePNG);
  saveJson.addEventListener("click", saveJSON);
  loadJson.addEventListener("change", loadJSON);

  async function savePNG() {
    let holder = null;

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }

      // html2canvas が背景画像・写真・フレームを取得しきる前に描画すると
      // スマホで失敗することがあるため、使用中画像を先に読み込む
      await preloadExportImages();

      const clone = App.el.card.cloneNode(true);

      clone.style.width = "700px";
      clone.style.height = "1000px";
      clone.style.transform = "none";
      clone.style.margin = "0";

      // iOS Safari では left:-9999px のような画面外要素で
      // html2canvas が失敗することがあるため、透明な固定領域に置く
      holder = document.createElement("div");
      holder.style.position = "fixed";
      holder.style.left = "0";
      holder.style.top = "0";
      holder.style.width = "700px";
      holder.style.height = "1000px";
      holder.style.overflow = "hidden";
      holder.style.opacity = "0";
      holder.style.pointerEvents = "none";
      holder.style.zIndex = "-1";
      holder.appendChild(clone);
      document.body.appendChild(holder);

      // html2canvas は background-position: calc(...) を環境によって正しく反映しないため、
      // 保存用クローンでは背景を <img> として再配置する。
      // これにより、背景調整モードで動かした位置がPNGにそのまま反映される。
      const cloneBackground = clone.querySelector("#background");
      if (cloneBackground) {
        cloneBackground.style.backgroundImage = "none";
        cloneBackground.style.overflow = "hidden";

        if (App.state.background) {
          const bgImg = await loadImage(App.state.background);
          const t = App.state.backgroundTransform || { x: 0, y: 0 };

          const cardW = 700;
          const cardH = 1000;
          const ratio = Math.max(
            cardW / bgImg.naturalWidth,
            cardH / bgImg.naturalHeight
          );

          const w = bgImg.naturalWidth * ratio;
          const h = bgImg.naturalHeight * ratio;

          bgImg.style.position = "absolute";
          bgImg.style.width = w + "px";
          bgImg.style.height = h + "px";
          bgImg.style.left = (cardW - w) / 2 + Number(t.x || 0) + "px";
          bgImg.style.top = (cardH - h) / 2 + Number(t.y || 0) + "px";
          bgImg.style.maxWidth = "none";
          bgImg.style.pointerEvents = "none";

          cloneBackground.appendChild(bgImg);
        }
      }

      // V29: 写真はCSS backgroundのままでは、縦長画像＋calc(background-position)で
      // 一部ブラウザのhtml2canvasが失敗することがある。
      // 保存用クローンでは、プレビューと同じ計算式で <img> として再配置する。
      // プレビュー仕様: background-size: `${100 * scale}% auto`
      // つまり「写真エリア幅に合わせる」ため、縦長画像でも上下位置が一致する。
      const clonePhotoArea = clone.querySelector("#photoArea");
      if (clonePhotoArea) {
        clonePhotoArea.style.backgroundImage = "none";
        clonePhotoArea.style.overflow = "hidden";

        if (App.state.photo) {
          const photoImg = await loadImage(App.state.photo);
          const area = App.state.photoArea || { left: 0, top: 0, width: 700, height: 1000 };
          const p = App.state.photoTransform || { x: 0, y: 0, scale: 1 };

          const areaW = Number(area.width || 700);
          const areaH = Number(area.height || 1000);
          const scale = Number(p.scale || 1);

          const baseRatio = areaW / photoImg.naturalWidth;
          const w = photoImg.naturalWidth * baseRatio * scale;
          const h = photoImg.naturalHeight * baseRatio * scale;

          photoImg.style.position = "absolute";
          photoImg.style.width = w + "px";
          photoImg.style.height = h + "px";
          photoImg.style.left = ((areaW - w) / 2 + Number(p.x || 0)) + "px";
          photoImg.style.top = ((areaH - h) / 2 + Number(p.y || 0)) + "px";
          photoImg.style.maxWidth = "none";
          photoImg.style.maxHeight = "none";
          photoImg.style.pointerEvents = "none";

          clonePhotoArea.appendChild(photoImg);
        }
      }

      // 描画直前に1フレーム待って、スマホSafari/Chromeのレイアウト確定とメモリ解放を促す。
      await waitForNextFrame();

      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: isMobileDevice() ? 1.5 : 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000
      });

      holder.remove();
      holder = null;

      const fileName = createName("png");
      const blob = await canvasToBlob(canvas);
      const file = new File([blob], fileName, { type: "image/png" });

      // スマホではWeb Share APIを優先して、共有シートから「写真に保存」を選べるようにする
      if (isMobileDevice() && navigator.share) {
        try {
          if (!navigator.canShare || navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "Character Card"
            });
            return;
          }
        } catch (shareError) {
          if (shareError && (shareError.name === "AbortError" || shareError.name === "NotAllowedError")) {
            return;
          }
          console.warn("共有保存に失敗したため通常保存に切り替えます", shareError);
        }
      }

      downloadBlob(blob, fileName);

    } catch (err) {
      console.error(err);
      alert("PNG保存に失敗しました。ページを再読み込みしてからもう一度お試しください。");
    } finally {
      if (holder && holder.parentNode) {
        holder.remove();
      }
    }
  }

  async function preloadExportImages() {
    const targets = [
      App.state.background,
      App.state.frame,
      App.state.photo
    ].filter(Boolean);

    await Promise.all(
      targets.map(src => loadImage(src).catch(err => {
        console.warn("画像の事前読み込みに失敗しました", err);
      }))
    );
  }

  function waitForNextFrame() {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("PNG変換に失敗しました"));
        }
      }, "image/png");
    });
  }

  function isMobileDevice() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }


  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function saveJSON() {
    const json = JSON.stringify(App.state, null, 2);
    const blob = new Blob([json], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = createName("json");
    link.click();

    URL.revokeObjectURL(url);
  }

  function loadJSON(e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);

        App.state = App.deepMerge(App.state, data);
        App.render();

        if (typeof syncEditorInputs === "function") {
          syncEditorInputs();
        } else if (typeof updateEditor === "function") {
          updateEditor();
        }

        App.saveLocal();

      } catch (err) {
        console.error(err);
        alert("JSONを読み込めませんでした");
      }
    };

    reader.readAsText(file);
  }

  function createName(ext) {
    const d = new Date();

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    return `card_${y}${m}${day}_${h}${min}.${ext}`;
  }
});