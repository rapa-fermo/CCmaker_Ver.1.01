window.templates = {
  fantasy: {
    name: "WOL",
    type: "cover",
    typeName: "表紙風（縦型）",
    background: "assets/backgrounds/bg1.jpg",
    frame: "assets/frames/frame1.png",
    font: "Cinzel",
    textColor: "#ffffff",
    layout: "portrait",
    cardSize: { width: 700, height: 1000 },
    activity: { enabled: false, start: 21, end: 24 },
    photoArea: { left: 0, top: 0, width: 700, height: 1000 },
    texts: {
      title: { x: 45, y: 70, size: 54, bold: true },
      name: { x: 150, y: 535, size: 64, bold: true },
      jobLabel: { x: 150, y: 615, size: 16, bold: true },
      job: { x: 150, y: 638, size: 28, bold: false },
      subjobLabel: { x: 150, y: 685, size: 15, bold: true },
      subjob: { x: 150, y: 708, size: 18, bold: false },
      activityLabel: { x: 150, y: 800, size: 15, bold: true },
      world: { x: 470, y: 705, size: 21, bold: true },
      desc: { x: 180, y: 850, size: 21, bold: false },
      copyright: { x: 470, y: 940, size: 16, bold: false }
    }
  },

  cyber: {
    name: "Crystarium",
    type: "cover",
    typeName: "表紙風（縦型）",
    background: "assets/backgrounds/bg2.jpg",
    frame: "assets/frames/frame2.png",
    font: "Orbitron",
    textColor: "#00ffff",
    layout: "portrait",
    cardSize: { width: 700, height: 1000 },
    activity: { enabled: false, start: 21, end: 24 },
    photoArea: { left: 35, top: 30, width: 630, height: 800 },
    texts: {
      title: { x: 56, y: 64, size: 48, bold: true },
      name: { x: 72, y: 570, size: 58, bold: true },
      jobLabel: { x: 72, y: 635, size: 16, bold: true },
      job: { x: 72, y: 658, size: 27, bold: false },
      subjobLabel: { x: 72, y: 705, size: 14, bold: true },
      subjob: { x: 72, y: 727, size: 17, bold: false },
      activityLabel: { x: 72, y: 812, size: 14, bold: true },
      world: { x: 455, y: 730, size: 20, bold: true },
      desc: { x: 72, y: 858, size: 20, bold: false },
      copyright: { x: 465, y: 940, size: 16, bold: false }
    }
  },

  simple: {
    name: "Tuliyollal",
    type: "cover",
    typeName: "表紙風（縦型）",
    background: "assets/backgrounds/bg3.jpg",
    frame: "assets/frames/frame3.png",
    font: "Noto Sans JP",
    textColor: "#ffffff",
    layout: "portrait",
    cardSize: { width: 700, height: 1000 },
    activity: { enabled: false, start: 21, end: 24 },
    photoArea: { left: 0, top: 0, width: 700, height: 1000 },
    texts: {
      title: { x: 45, y: 70, size: 54, bold: true },
      name: { x: 245, y: 545, size: 62, bold: true },
      jobLabel: { x: 250, y: 625, size: 16, bold: true },
      job: { x: 250, y: 648, size: 28, bold: false },
      subjobLabel: { x: 250, y: 695, size: 15, bold: true },
      subjob: { x: 250, y: 718, size: 18, bold: false },
      activityLabel: { x: 250, y: 805, size: 15, bold: true },
      world: { x: 500, y: 705, size: 21, bold: true },
      desc: { x: 205, y: 850, size: 21, bold: false },
      copyright: { x: 470, y: 940, size: 16, bold: false }
    }
  },

  magazine: {
    name: "Magazine Spread",
    type: "spread",
    typeName: "見開き風（横型）",
    background: "assets/backgrounds/bg1.jpg",
    frame: "",
    font: "Noto Sans JP",
    textColor: "#2b2118",
    layout: "magazine",
    cardSize: { width: 1920, height: 1080 },
    activity: { enabled: true, start: 21, end: 24 },
    frameEnabled: false,
    gathererEnabled: true,
    crafterEnabled: true,
    spread: {
      bindingLine: true,
      bindingShadow: true,
      backgroundOpacity: 22,
      backgroundMode: "full",
      magazineTitlePreset: "CHARACTER FILE"
    },
    photoArea: { left: 90, top: 120, width: 790, height: 840 },
    texts: {
      title: { value: "CHARACTER FILE", x: 80, y: 48, size: 54, bold: true, color: "#4a3527", font: "Cinzel" },
      name: { x: 1040, y: 150, size: 92, bold: true, color: "#2b2118", font: "Cinzel" },
      jobLabel: { x: 1050, y: 270, size: 22, bold: true, color: "#7a4f32", font: "Bebas Neue" },
      job: { x: 1050, y: 300, size: 42, bold: true, color: "#7a4f32", font: "Noto Sans JP" },
      subjobLabel: { x: 1050, y: 365, size: 22, bold: true, color: "#7a4f32", font: "Bebas Neue" },
      subjob: { x: 1050, y: 395, size: 28, bold: false, color: "#3b3028", font: "Noto Sans JP" },
      activityLabel: { x: 1050, y: 500, size: 22, bold: true, color: "#7a4f32", font: "Bebas Neue" },
      world: { x: 1420, y: 300, size: 32, bold: true, color: "#7a4f32", font: "Noto Sans JP" },
      gathererLabel: { value: "ギャザラー", x: 1050, y: 650, size: 22, bold: true, color: "#7a4f32", font: "Bebas Neue" },
      gatherer: { value: "ギャザラー", x: 1050, y: 682, size: 26, bold: false, color: "#3b3028", font: "Noto Sans JP" },
      crafterLabel: { value: "クラフター", x: 1420, y: 650, size: 22, bold: true, color: "#7a4f32", font: "Bebas Neue" },
      crafter: { value: "クラフター", x: 1420, y: 682, size: 26, bold: false, color: "#3b3028", font: "Noto Sans JP" },
      desc: { x: 1050, y: 800, size: 32, bold: false, color: "#2b2118", font: "Noto Sans JP" },
      copyright: { x: 1340, y: 980, size: 22, bold: false, color: "#6d5c4f", font: "Noto Sans JP" }
    }
  }
};
