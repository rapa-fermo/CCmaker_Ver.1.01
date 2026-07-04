document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const descInput = document.getElementById("descInput");
  const worldSelect = document.getElementById("worldSelect");
  const frameToggle = document.getElementById("frameToggle");
  const noFrameOptions = document.getElementById("noFrameOptions");
  const titleInput = document.getElementById("titleInput");
  const copyrightColor = document.getElementById("copyrightColor");
  const backgroundEditMode = document.getElementById("backgroundEditMode");

  const fontSelect = document.getElementById("fontSelect");
  const fontSize = document.getElementById("fontSize");
  const fontColor = document.getElementById("fontColor");
  const boldCheck = document.getElementById("boldCheck");

  nameInput.value = App.state.texts.name.value;
  descInput.value = App.state.texts.desc.value;
  worldSelect.value = App.state.texts.world.value === "活動ワールド" ? "" : App.state.texts.world.value;
  titleInput.value = App.state.texts.title.value;
  frameToggle.checked = App.state.frameEnabled !== false;
  copyrightColor.value = App.state.texts.copyright.color;
  if (backgroundEditMode) {
    backgroundEditMode.checked = !!App.state.backgroundEditMode;
  }
  updateNoFrameOptions();

  nameInput.addEventListener("input", () => {
    App.state.texts.name.value = nameInput.value || "名前";
    App.render();
    App.saveLocal();
  });

  descInput.addEventListener("input", () => {
    App.state.texts.desc.value = descInput.value || "自己アピール";
    App.render();
    App.saveLocal();
  });

  worldSelect.addEventListener("change", () => {
    App.state.texts.world.value = worldSelect.value || "活動ワールド";
    App.render();
    App.saveLocal();
  });

  frameToggle.addEventListener("change", () => {
    App.state.frameEnabled = frameToggle.checked;
    updateNoFrameOptions();
    App.render();
    App.saveLocal();
  });

  titleInput.addEventListener("input", () => {
    App.state.texts.title.value = titleInput.value || "TITLE";
    App.render();
    App.saveLocal();
  });

  copyrightColor.addEventListener("input", () => {
    App.state.texts.copyright.color = copyrightColor.value;
    App.render();
    App.saveLocal();
  });

  if (backgroundEditMode) {
    backgroundEditMode.addEventListener("change", () => {
      App.state.backgroundEditMode = backgroundEditMode.checked;
      App.renderBackground();
      App.saveLocal();
    });
  }

  function updateNoFrameOptions() {
    noFrameOptions.style.display = frameToggle.checked ? "none" : "block";
  }

  document.querySelectorAll('input[name="mainJob"]').forEach(input => {
    if (input.value === App.state.texts.job.value) {
      input.checked = true;
    }

    input.addEventListener("change", () => {
      App.state.texts.job.value = input.value || "メインジョブ";
      App.render();
      App.saveLocal();
    });
  });

  const jobCategoryMap = {
    ナイト: "ファイター",
    戦士: "ファイター",
    暗黒騎士: "ファイター",
    ガンブレイカー: "ファイター",

    モンク: "近接DPS",
    竜騎士: "近接DPS",
    忍者: "近接DPS",
    侍: "近接DPS",
    リーパー: "近接DPS",
    ヴァイパー: "近接DPS",

    吟遊詩人: "遠隔物理DPS",
    機工士: "遠隔物理DPS",
    踊り子: "遠隔物理DPS",

    黒魔道士: "遠隔魔法DPS",
    召喚士: "遠隔魔法DPS",
    赤魔道士: "遠隔魔法DPS",
    ピクトマンサー: "遠隔魔法DPS",

    白魔道士: "ヒーラー",
    学者: "ヒーラー",
    占星術師: "ヒーラー",
    賢者: "ヒーラー"
  };

  const categoryOrder = [
    "ファイター",
    "近接DPS",
    "遠隔物理DPS",
    "遠隔魔法DPS",
    "ヒーラー"
  ];

  function updateSubJobs() {
    const selectedJobs = [
      ...document.querySelectorAll(".sub-job-buttons input:checked")
    ].map(input => input.value);

    const grouped = {};

    categoryOrder.forEach(category => {
      grouped[category] = [];
    });

    selectedJobs.forEach(job => {
      const category = jobCategoryMap[job];

      if (category) {
        grouped[category].push(job);
      }
    });

    const rows = categoryOrder
      .map(category => grouped[category])
      .filter(jobs => jobs.length > 0)
      .map(jobs => jobs.join("・"));

    App.state.texts.subjob.value =
      rows.length ? rows.join("\n") : "サブジョブ";

    App.render();
    App.saveLocal();
  }

  document.querySelectorAll(".sub-job-buttons input").forEach(input => {
    input.addEventListener("change", updateSubJobs);
  });

  document.querySelectorAll(".draggable").forEach(el => {
    el.addEventListener("click", () => {
      App.selectedKey = el.dataset.key;
      updateEditor();
    });
  });

  fontSelect.addEventListener("change", () => {
    App.state.texts[App.selectedKey].font = fontSelect.value;
    App.render();
    App.saveLocal();
  });

  fontSize.addEventListener("input", () => {
    App.state.texts[App.selectedKey].size = Number(fontSize.value);
    App.render();
    App.saveLocal();
  });

  fontColor.addEventListener("input", () => {
    App.state.texts[App.selectedKey].color = fontColor.value;
    if (App.selectedKey === "copyright") {
      copyrightColor.value = fontColor.value;
    }
    App.render();
    App.saveLocal();
  });

  boldCheck.addEventListener("change", () => {
    App.state.texts[App.selectedKey].bold = boldCheck.checked;
    App.render();
    App.saveLocal();
  });

  window.updateEditor = function() {
    const t = App.state.texts[App.selectedKey];

    fontSelect.value = t.font;
    fontSize.value = t.size;
    fontColor.value = t.color;
    boldCheck.checked = t.bold;
    if (App.selectedKey === "copyright") {
      copyrightColor.value = t.color;
    }
  };

  window.syncEditorInputs = function() {
    nameInput.value = App.state.texts.name.value === "名前" ? "" : App.state.texts.name.value;
    descInput.value = App.state.texts.desc.value === "自己アピール" || App.state.texts.desc.value === "説明文" ? "" : App.state.texts.desc.value;
    worldSelect.value = App.state.texts.world.value === "活動ワールド" ? "" : App.state.texts.world.value;
    titleInput.value = App.state.texts.title.value === "TITLE" ? "" : App.state.texts.title.value;
    frameToggle.checked = App.state.frameEnabled !== false;
    copyrightColor.value = App.state.texts.copyright.color;
    if (backgroundEditMode) {
      backgroundEditMode.checked = !!App.state.backgroundEditMode;
    }
    updateNoFrameOptions();

    document.querySelectorAll('input[name="mainJob"]').forEach(input => {
      input.checked = input.value === App.state.texts.job.value;
    });

    const selectedSubJobs = App.state.texts.subjob.value
      .split(/[・\n]/)
      .map(v => v.trim())
      .filter(Boolean);

    document.querySelectorAll(".sub-job-buttons input").forEach(input => {
      input.checked = selectedSubJobs.includes(input.value);
    });

    updateEditor();
  };

  syncEditorInputs();
});