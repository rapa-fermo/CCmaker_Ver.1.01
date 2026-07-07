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
    layout: "portrait",
    cardSize: {
      width: 700,
      height: 1000
    },

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

    headingLanguage: "kana",
    subjobEnabled: true,
    gathererEnabled: true,
    crafterEnabled: true,
    jobGuideLinesEnabled: true,

    spread: {
      bindingLine: true,
      bindingShadow: true,
      backgroundOpacity: 22,
      backgroundMode: "full",
      magazineTitlePreset: "CHARACTER FILE"
    },

    activity: {
      enabled: true,
      start: 21,
      end: 24
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
  y: 535,
  size: 64,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: true,
  shadow: true
},

jobLabel: {
  value: "メインジョブ",
  x: 150,
  y: 615,
  size: 16,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: true,
  shadow: true
},

job: {
  value: "メインジョブ",
  x: 150,
  y: 638,
  size: 28,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: false,
  shadow: true
},

subjobLabel: {
  value: "サブジョブ",
  x: 150,
  y: 685,
  size: 15,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: true,
  shadow: true
},

subjob: {
  value: "サブジョブ",
  x: 150,
  y: 708,
  size: 18,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: false,
  shadow: true
},

gathererLabel: {
  value: "ギャザラー",
  x: 1050,
  y: 650,
  size: 22,
  color: "#7a4f32",
  font: "Bebas Neue",
  bold: true,
  shadow: false
},

gatherer: {
  value: "ギャザラー",
  x: 1050,
  y: 682,
  size: 26,
  color: "#3b3028",
  font: "Noto Sans JP",
  bold: false,
  shadow: false
},

crafterLabel: {
  value: "クラフター",
  x: 1420,
  y: 650,
  size: 22,
  color: "#7a4f32",
  font: "Bebas Neue",
  bold: true,
  shadow: false
},

crafter: {
  value: "クラフター",
  x: 1420,
  y: 682,
  size: 26,
  color: "#3b3028",
  font: "Noto Sans JP",
  bold: false,
  shadow: false
},

desc: {
  value: "自己アピール",
  x: 180,
  y: 850,
  size: 21,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: false,
  shadow: true
},

activityLabel: {
  value: "アクティブタイム",
  x: 150,
  y: 800,
  size: 15,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: true,
  shadow: true
},

world: {
  value: "活動ワールド",
  x: 470,
  y: 705,
  size: 21,
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
    this.el.bindingLine = document.getElementById("bindingLine");
    this.el.bindingShadow = document.getElementById("bindingShadow");
    this.el.photoArea = document.getElementById("photoArea");
    this.el.frame = document.getElementById("frame");

    this.el.titleText = document.getElementById("titleText");
    this.el.nameText = document.getElementById("nameText");
    this.el.jobLabelText = document.getElementById("jobLabelText");
    this.el.jobText = document.getElementById("jobText");
    this.el.jobLine = document.getElementById("jobLine");
    this.el.subjobLabelText = document.getElementById("subjobLabelText");
    this.el.subjobText = document.getElementById("subjobText");
    this.el.subjobLine = document.getElementById("subjobLine");
    this.el.gathererLabelText = document.getElementById("gathererLabelText");
    this.el.gathererText = document.getElementById("gathererText");
    this.el.gathererLine = document.getElementById("gathererLine");
    this.el.crafterLabelText = document.getElementById("crafterLabelText");
    this.el.crafterText = document.getElementById("crafterText");
    this.el.crafterLine = document.getElementById("crafterLine");
    this.el.descText = document.getElementById("descText");
    this.el.worldText = document.getElementById("worldText");
    this.el.activityLabelText = document.getElementById("activityLabelText");
    this.el.activityScale = document.getElementById("activityScale");
    this.el.copyrightText = document.getElementById("copyrightText");

    this.loadLocal();
    this.render();
  },

  render() {
    this.renderCardLayout();
    this.renderBackground();
    this.renderSpreadDecoration();
    this.renderPhotoArea();
    this.renderPhoto();
    this.renderTexts();
    this.renderActivityScale();
  },

  getCardSize() {
    const size = this.state.cardSize || {};
    return {
      width: Number(size.width || 700),
      height: Number(size.height || 1000)
    };
  },

  renderCardLayout() {
    const size = this.getCardSize();
    const layout = this.state.layout || "portrait";

    document.documentElement.style.setProperty("--card-width", size.width + "px");
    document.documentElement.style.setProperty("--card-height", size.height + "px");

    this.el.card.style.width = size.width + "px";
    this.el.card.style.height = size.height + "px";
    this.el.card.dataset.layout = layout;
    this.el.card.classList.toggle("layout-magazine", layout === "magazine");
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

    const isMagazine = (this.state.layout || "portrait") === "magazine";
    const spread = this.state.spread || {};
    const opacity = Math.max(0, Math.min(100, Number(spread.backgroundOpacity ?? 22))) / 100;
    const mode = spread.backgroundMode || "full";

    this.el.background.style.opacity = isMagazine ? String(opacity) : "1";
    this.el.background.style.filter = isMagazine ? "saturate(.8) contrast(.9)" : "none";

    if (isMagazine && mode === "left") {
      this.el.background.style.left = "0";
      this.el.background.style.right = "auto";
      this.el.background.style.width = "50%";
    } else if (isMagazine && mode === "right") {
      this.el.background.style.left = "50%";
      this.el.background.style.right = "auto";
      this.el.background.style.width = "50%";
    } else {
      this.el.background.style.left = "0";
      this.el.background.style.right = "auto";
      this.el.background.style.width = "100%";
    }

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

    const size = this.getCardSize();
    const cardW = size.width;
    const cardH = size.height;
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

  renderSpreadDecoration() {
    const isMagazine = (this.state.layout || "portrait") === "magazine";
    const spread = this.state.spread || {};

    if (this.el.bindingLine) {
      this.el.bindingLine.style.display =
        isMagazine && spread.bindingLine !== false ? "block" : "none";
    }

    if (this.el.bindingShadow) {
      this.el.bindingShadow.style.display =
        isMagazine && spread.bindingShadow !== false ? "block" : "none";
    }

    document.body.classList.toggle("is-spread-card", isMagazine);
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
  this.el.titleText.style.display = ((this.state.layout || "portrait") === "magazine" || !this.state.frameEnabled) ? "block" : "none";
  this.applyText(this.el.nameText, this.state.texts.name);
  this.applyText(this.el.jobLabelText, this.state.texts.jobLabel);
  this.applyText(this.el.jobText, this.state.texts.job);
  this.applyText(this.el.subjobLabelText, this.state.texts.subjobLabel);
  this.applyText(this.el.subjobText, this.state.texts.subjob);
  const isMagazine = (this.state.layout || "portrait") === "magazine";
  const showSubjob = this.state.subjobEnabled !== false;
  const showGatherer = isMagazine && this.state.gathererEnabled !== false;
  const showCrafter = isMagazine && this.state.crafterEnabled !== false;
  this.el.subjobLabelText.style.display = showSubjob ? "block" : "none";
  this.el.subjobText.style.display = showSubjob ? "block" : "none";
  this.applyText(this.el.gathererLabelText, this.state.texts.gathererLabel);
  this.applyText(this.el.gathererText, this.state.texts.gatherer);
  this.applyText(this.el.crafterLabelText, this.state.texts.crafterLabel);
  this.applyText(this.el.crafterText, this.state.texts.crafter);
  this.el.gathererLabelText.style.display = showGatherer ? "block" : "none";
  this.el.gathererText.style.display = showGatherer ? "block" : "none";
  this.el.crafterLabelText.style.display = showCrafter ? "block" : "none";
  this.el.crafterText.style.display = showCrafter ? "block" : "none";
  this.renderJobGuideLines(showSubjob, showGatherer, showCrafter);
  this.applyText(this.el.descText, this.state.texts.desc);
  this.applyText(this.el.worldText, this.state.texts.world);
  this.applyText(this.el.activityLabelText, this.state.texts.activityLabel);
  this.applyText(this.el.copyrightText, this.state.texts.copyright);
  this.el.copyrightText.style.display = ((this.state.layout || "portrait") === "magazine" || !this.state.frameEnabled) ? "block" : "none";
},


renderJobGuideLines(showSubjob = true, showGatherer = false, showCrafter = false) {
  const enabled = this.state.jobGuideLinesEnabled !== false;
  const layout = this.state.layout || "portrait";

  const syncLine = (lineEl, label, visible) => {
    if (!lineEl || !label) return;
    lineEl.style.display = enabled && visible ? "block" : "none";
    if (!enabled || !visible) return;

    const lineWidth = layout === "magazine" ? 260 : 150;
    const lineTopOffset = Math.max(16, Number(label.size || 16) + 5);

    lineEl.style.left = (Number(label.x || 0)) + "px";
    lineEl.style.top = (Number(label.y || 0) + lineTopOffset) + "px";
    lineEl.style.width = lineWidth + "px";
    lineEl.style.background = label.color || "#ffffff";
    lineEl.style.opacity = layout === "magazine" ? ".55" : ".72";
    lineEl.style.boxShadow = label.shadow === false ? "none" : "2px 2px 6px rgba(0,0,0,.35)";
  };

  syncLine(this.el.jobLine, this.state.texts.jobLabel, true);
  syncLine(this.el.subjobLine, this.state.texts.subjobLabel, showSubjob);
  syncLine(this.el.gathererLine, this.state.texts.gathererLabel, showGatherer);
  syncLine(this.el.crafterLine, this.state.texts.crafterLabel, showCrafter);
},

  renderActivityScale() {
    if (!this.el.activityScale) return;

    const activity = this.state.activity || { enabled: true, start: 21, end: 24 };
    this.el.activityScale.style.display = activity.enabled === false ? "none" : "block";
    this.el.activityLabelText.style.display = activity.enabled === false ? "none" : "block";

    // サブジョブ非表示時は、活動時間を少し上へ詰めて余白を減らす。
    if (this.state.subjobEnabled === false) {
      if ((this.state.layout || "portrait") === "magazine") {
        this.el.activityLabelText.style.top = "365px";
        this.el.activityScale.style.top = "400px";
      } else {
        this.el.activityLabelText.style.top = "735px";
        this.el.activityScale.style.top = "765px";
      }
    } else {
      this.el.activityLabelText.style.top = (this.state.texts.activityLabel.y || 790) + "px";
      this.el.activityScale.style.top = ((this.state.layout || "portrait") === "magazine" ? "535px" : "820px");
    }

    const start = Math.max(0, Math.min(24, Number(activity.start ?? 21)));
    const end = Math.max(0, Math.min(24, Number(activity.end ?? 24)));
    const track = this.el.activityScale.querySelector(".activity-track");
    const timeText = this.el.activityScale.querySelector(".activity-time-text");

    // 0時またぎ対応：終了時刻が開始時刻より小さい場合は翌日扱い。
    // バーは「開始→24時」と「0時→終了」の2区間で表示する。
    const fills = this.ensureActivityFills(track);
    fills.forEach(fill => {
      fill.style.display = "none";
      fill.style.left = "0%";
      fill.style.width = "0%";
    });

    const setFill = (index, leftHour, rightHour) => {
      const widthHour = Math.max(0, rightHour - leftHour);
      if (!fills[index] || widthHour <= 0) return;
      fills[index].style.display = "block";
      fills[index].style.left = (leftHour / 24 * 100) + "%";
      fills[index].style.width = Math.max(1, widthHour / 24 * 100) + "%";
    };

    const isOvernight = end < start;
    const isFullDay = start === 0 && end === 24;

    if (isFullDay) {
      setFill(0, 0, 24);
    } else if (isOvernight) {
      setFill(0, start, 24);
      setFill(1, 0, end);
    } else if (end > start) {
      setFill(0, start, end);
    } else {
      // 開始と終了が同じ場合は短い目印として表示。
      setFill(0, start, Math.min(24, start + 0.25));
    }

    timeText.textContent = `${this.formatHour(start)} - ${this.formatHour(end)}${isOvernight ? "（翌日）" : ""}`;
    this.el.activityScale.classList.toggle("is-overnight", isOvernight);
  },

  ensureActivityFills(track) {
    if (!track) return [];
    let fills = Array.from(track.querySelectorAll(".activity-fill"));
    while (fills.length < 2) {
      const fill = document.createElement("div");
      fill.className = "activity-fill";
      track.appendChild(fill);
      fills.push(fill);
    }
    return fills;
  },

  formatHour(hour) {
    const n = Number(hour || 0);
    return String(n).padStart(2, "0") + ":00";
  },

  applyText(el, data) {
    if (!el || !data) return;
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
      localStorage.removeItem("magCardState_v31_cover_restore");
      localStorage.removeItem("magCardState_v31_job_group_cover_adjust");
      localStorage.removeItem("magCardState_v31_1_cover_job_lines");
      localStorage.removeItem("magCardState_v31_2_spread_options");
      localStorage.setItem(
        "magCardState_v31_3_gather_craft",
        JSON.stringify(saveData)
      );
    } catch (err) {
      // 容量超過などでPNG保存や編集処理を止めない。
      console.warn("localStorageへの自動保存をスキップしました", err);
    }
  },

  loadLocal() {
    // v31.1では表紙風の初期配置を修正しているため、
    // 旧v31系の自動保存座標は引き継がず、新しい初期配置を優先する。
    localStorage.removeItem("magCardState_v31_job_group_cover_adjust");
    localStorage.removeItem("magCardState_v31_cover_restore");
    localStorage.removeItem("magCardState_v31_1_cover_job_lines");
    const saved =
      localStorage.getItem("magCardState_v31_3_gather_craft");

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