document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("saveButton");
  const saveJson = document.getElementById("saveJson");
  const loadJson = document.getElementById("loadJson");

  saveButton.addEventListener("click", savePNG);
  saveJson.addEventListener("click", saveJSON);
  loadJson.addEventListener("change", loadJSON);

  async function savePNG() {
    try {
      if (document.fonts) {
        await document.fonts.ready;
      }

      const clone = App.el.card.cloneNode(true);

      clone.style.position = "fixed";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = "700px";
      clone.style.height = "1000px";

      document.body.appendChild(clone);

      const clonePhotoArea = clone.querySelector("#photoArea");

      clonePhotoArea.style.backgroundImage = "none";

      if (App.state.photo) {
        const img = await loadImage(App.state.photo);

        const area = App.state.photoArea;
        const p = App.state.photoTransform;

        const ratio = Math.min(
          area.width / img.naturalWidth,
          area.height / img.naturalHeight
        );

        const w = img.naturalWidth * ratio * p.scale;
        const h = img.naturalHeight * ratio * p.scale;

        img.style.position = "absolute";
        img.style.width = w + "px";
        img.style.height = h + "px";
        img.style.left = (area.width - w) / 2 + p.x + "px";
        img.style.top = (area.height - h) / 2 + p.y + "px";
        img.style.maxWidth = "none";

        clonePhotoArea.appendChild(img);
      }

      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      document.body.removeChild(clone);

      const fileName = createName("png");
      const blob = await canvasToBlob(canvas);
      const file = new File([blob], fileName, { type: "image/png" });

      // スマホでは共有シートを開き、「写真に保存」を選べるようにする
      if (isMobileDevice() && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({
          files: [file],
          title: "Character Card",
          text: "作成したキャラクターカードです"
        });
      } else {
        // PC・共有非対応ブラウザでは従来通りダウンロード
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = fileName;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }

    } catch (err) {
      console.error(err);
      alert("PNG保存に失敗しました");
    }
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