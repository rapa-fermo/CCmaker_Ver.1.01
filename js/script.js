window.App = {
  selectedKey: "name",
  cardScale: 1,

  state: {
    template: "fantasy",

    background: "",
    frame: "",

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
name: {
  value: "名前",
  x: 40,
  y: 740,
  size: 68,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: true,
  shadow: true
},

job: {
  value: "メインジョブ",
  x: 45,
  y: 820,
  size: 32,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: false,
  shadow: true
},

subjob: {
  value: "サブジョブ",
  x: 45,
  y: 860,
  size: 16,
  color: "#ffffff",
  font: "Noto Sans JP",
  bold: false,
  shadow: true
},

desc: {
  value: "説明文",
  x: 45,
  y: 950,
  size: 22,
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

    this.el.nameText = document.getElementById("nameText");
    this.el.jobText = document.getElementById("jobText");
    this.el.subjobText = document.getElementById("subjobText");
    this.el.descText = document.getElementById("descText");

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
    this.el.background.style.backgroundImage =
      this.state.background
        ? `url("${this.state.background}")`
        : "";

    this.el.frame.src =
      this.state.frame || "";
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
  this.applyText(this.el.nameText, this.state.texts.name);
  this.applyText(this.el.jobText, this.state.texts.job);
  this.applyText(this.el.subjobText, this.state.texts.subjob);
  this.applyText(this.el.descText, this.state.texts.desc);
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

  saveLocal() {
    localStorage.setItem(
      "magCardState",
      JSON.stringify(this.state)
    );
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