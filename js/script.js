window.App = {
  selectedKey: "name",
  cardScale: 1,
  backgroundImageInfo: {
    src: "",
    width: 0,
    height: 0
  },

  state: {
    template: "fantasy",

    background: "",
    frame: "",
    frameEnabled: true,

    backgroundEditMode: false,
    backgroundTransform: {
      x: 0,
      y: 0
    },

    photo: "",

    photoTransform: {
      x: 0,
      y: 0,
      scale: 1
    },

    photoArea: {
      left: 0,
      top: 0,
      width: 700,
      height: 1000
    },

    texts: {
title: {
  value: "TITLE",
  x: 45,
  y: 70,
  size: 54,
  color: "#ffffff",
  font: "Cinzel",
  bold: true,
  shadow: true
},

name: {
  value: "名前",
  x: 150,
  y: 575,
  size: 64,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: true,
  shadow: true
},

job: {
  value: "メインジョブ",
  x: 150,
  y: 665,
  size: 30,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: false,
  shadow: true
},

subjob: {
  value: "サブジョブ",
  x: 150,
  y: 705,
  size: 18,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: false,
  shadow: true
},

desc: {
  value: "自己アピール",
  x: 180,
  y: 845,
  size: 22,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: false,
  shadow: true
},

world: {
  value: "活動ワールド",
  x: 470,
  y: 665,
  size: 22,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: true,
  shadow: true
},

copyright: {
  value: "© SQUARE ENIX",
  x: 470,
  y: 940,
  size: 16,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: false,
  shadow: true
}
    }
  },

  el: {},

  init() {
    this.el.card = document.getElementById("card");
    this.el.background = document.getElementById("background");
    this.el.photoArea = document.getElementById("photoArea");
    this.el.frame = document.getElementById("frame");

    this.el.titleText = document.getElementById("titleText");
    this.el.nameText = document.getElementById("nameText");
    this.el.jobText = document.getElementById("jobText");
    this.el.subjobText = document.getElementById("subjobText");
    this.el.descText = document.getElementById("descText");
    this.el.worldText = document.getElementById("worldText");
    this.el.copyrightText = document.getElementById("copyrightText");

    this.loadLocal();
    this.render();
  },

  render() {
    this.renderBackground();
    this.renderPhotoArea();
    this.renderPhoto();
    this.renderTexts();
  },

  renderBackground() {
    this.prepareBackgroundImageInfo();
    this.clampBackgroundTransform();

    const t = this.state.backgroundTransform || { x: 0, y: 0 };

    this.el.background.style.backgroundImage =
      this.state.background
        ? `url("${this.state.background}")`
        : "";

    this.el.background.style.backgroundPosition =
      `calc(50% + ${t.x}px) calc(50% + ${t.y}px)`;

    document.body.classList.toggle(
      "bg-editing",
      !!this.state.backgroundEditMode
    );

    this.el.frame.src =
      this.state.frameEnabled ? (this.state.frame || "") : "";

    this.el.frame.style.display =
      this.state.frameEnabled ? "block" : "none";
  },

  prepareBackgroundImageInfo() {
    const src = this.state.background || "";

    if (!src) {
      this.backgroundImageInfo = {
        src: "",
        width: 0,
        height: 0
      };
      return;
    }

    if (this.backgroundImageInfo.src === src) return;

    this.backgroundImageInfo = {
      src,
      width: 0,
      height: 0
    };

    const img = new Image();
    img.onload = () => {
      if (this.backgroundImageInfo.src !== src) return;

      this.backgroundImageInfo.width = img.naturalWidth || img.width || 0;
      this.backgroundImageInfo.height = img.naturalHeight || img.height || 0;

      const changed = this.clampBackgroundTransform();
      if (changed) {
        this.renderBackground();
        this.saveLocal();
      }
    };
    img.src = src;
  },

  getBackgroundBounds() {
    const info = this.backgroundImageInfo || {};
    const imgW = Number(info.width || 0);
    const imgH = Number(info.height || 0);

    if (!imgW || !imgH) {
      return null;
    }

    const cardW = 700;
    const cardH = 1000;
    const ratio = Math.max(cardW / imgW, cardH / imgH);
    const renderW = imgW * ratio;
    const renderH = imgH * ratio;

    return {
      minX: -Math.max(0, (renderW - cardW) / 2),
      maxX: Math.max(0, (renderW - cardW) / 2),
      minY: -Math.max(0, (renderH - cardH) / 2),
      maxY: Math.max(0, (renderH - cardH) / 2)
    };
  },

  clampBackgroundTransform() {
    if (!this.state.backgroundTransform) {
      this.state.backgroundTransform = { x: 0, y: 0 };
    }

    const bounds = this.getBackgroundBounds();
    if (!bounds) return false;

    const beforeX = Number(this.state.backgroundTransform.x || 0);
    const beforeY = Number(this.state.backgroundTransform.y || 0);

    const afterX = Math.min(bounds.maxX, Math.max(bounds.minX, beforeX));
    const afterY = Math.min(bounds.maxY, Math.max(bounds.minY, beforeY));

    this.state.backgroundTransform.x = afterX;
    this.state.backgroundTransform.y = afterY;

    return beforeX !== afterX || beforeY !== afterY;
  },

  renderPhotoArea() {
    const p = this.state.photoArea;

    this.el.photoArea.style.left = p.left + "px";
    this.el.photoArea.style.top = p.top + "px";
    this.el.photoArea.style.width = p.width + "px";
    this.el.photoArea.style.height = p.height + "px";
  },

  renderPhoto() {
    const p = this.state.photoTransform;

    this.el.photoArea.style.backgroundImage =
      this.state.photo
        ? `url("${this.state.photo}")`
        : "";

    this.el.photoArea.style.backgroundSize =
      `${100 * p.scale}% auto`;

    this.el.photoArea.style.backgroundPosition =
      `calc(50% + ${p.x}px) calc(50% + ${p.y}px)`;

    this.el.photoArea.style.backgroundRepeat =
      "no-repeat";
  },

renderTexts() {
  this.applyText(this.el.titleText, this.state.texts.title);
  this.el.titleText.style.display = this.state.frameEnabled ? "none" : "block";
  this.applyText(this.el.nameText, this.state.texts.name);
  this.applyText(this.el.jobText, this.state.texts.job);
  this.applyText(this.el.subjobText, this.state.texts.subjob);
  this.applyText(this.el.descText, this.state.texts.desc);
  this.applyText(this.el.worldText, this.state.texts.world);
  this.applyText(this.el.copyrightText, this.state.texts.copyright);
  this.el.copyrightText.style.display = this.state.frameEnabled ? "none" : "block";
},

  applyText(el, data) {
    el.textContent = data.value;

    el.style.left = data.x + "px";
    el.style.top = data.y + "px";

    el.style.fontSize = data.size + "px";
    el.style.color = data.color;
    el.style.fontFamily = data.font;

    el.style.fontWeight =
      data.bold ? "bold" : "normal";

    el.style.textShadow =
      data.shadow
        ? "3px 3px 8px rgba(0,0,0,.5)"
        : "none";
  },

  getPointerDelta(e, startX, startY) {
    const scale = this.cardScale || 1;

    return {
      x: (e.clientX - startX) / scale,
      y: (e.clientY - startY) / scale
    };
  },

  // localStorageは容量が小さいため、アップロード画像は自動保存しない。
  // 写真・背景画像を含めた完全保存は「JSON保存」で行う。
  getLightStateForLocalSave() {
    return {
      ...this.state,
      photo: "",
      background: ""
    };
  },

  saveLocal() {
    try {
      const saveData = this.getLightStateForLocalSave();

      // 旧版で保存された巨大なBase64画像を消してから軽量保存する。
      localStorage.removeItem("magCardState");
      localStorage.setItem(
        "magCardState",
        JSON.stringify(saveData)
      );
    } catch (err) {
      // 容量超過などでPNG保存や編集処理を止めない。
      console.warn("localStorageへの自動保存をスキップしました", err);
    }
  },

  loadLocal() {
    const saved =
      localStorage.getItem("magCardState");

    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      this.state = this.deepMerge(
        this.state,
        data
      );

      // 旧版の巨大なlocalStorageデータを、起動時に軽量版へ置き換える。
      this.saveLocal();
    } catch (err) {
      console.error(err);
    }
  },

  deepMerge(target, source) {
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        target[key] = this.deepMerge(
          target[key] || {},
          source[key]
        );
      } else {
        target[key] = source[key];
      }
    }

    return target;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});