document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const descInput = document.getElementById("descInput");
  const worldSelect = document.getElementById("worldSelect");
  const frameToggle = document.getElementById("frameToggle");
  const frameOptions = document.getElementById("frameOptions");
  const noFrameOptions = document.getElementById("noFrameOptions");
  const spreadOptions = document.getElementById("spreadOptions");
  const magazineTitlePreset = document.getElementById("magazineTitlePreset");
  const magazineTitleCustom = document.getElementById("magazineTitleCustom");
  const spreadBindingLineToggle = document.getElementById("spreadBindingLineToggle");
  const spreadBindingShadowToggle = document.getElementById("spreadBindingShadowToggle");
  const spreadBgOpacity = document.getElementById("spreadBgOpacity");
  const spreadBgOpacityLabel = document.getElementById("spreadBgOpacityLabel");
  const spreadBgMode = document.getElementById("spreadBgMode");
  const gathererToggle = document.getElementById("gathererToggle");
  const gathererOptions = document.getElementById("gathererOptions");
  const crafterToggle = document.getElementById("crafterToggle");
  const crafterOptions = document.getElementById("crafterOptions");
  const titleInput = document.getElementById("titleInput");
  const copyrightColor = document.getElementById("copyrightColor");
  const backgroundEditMode = document.getElementById("backgroundEditMode");
  const headingLanguageSelect = document.getElementById("headingLanguageSelect");
  const subjobToggle = document.getElementById("subjobToggle");
  const jobGuideLineToggle = document.getElementById("jobGuideLineToggle");
  const subJobOptions = document.getElementById("subJobOptions");
  const activityToggle = document.getElementById("activityToggle");
  const activityStart = document.getElementById("activityStart");
  const activityEnd = document.getElementById("activityEnd");
  const activityStartLabel = document.getElementById("activityStartLabel");
  const activityEndLabel = document.getElementById("activityEndLabel");

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
  if (headingLanguageSelect) {
    headingLanguageSelect.value = App.state.headingLanguage || "kana";
  }
  if (subjobToggle) {
    subjobToggle.checked = App.state.subjobEnabled !== false;
    updateSubjobVisibility(false);
  }
  if (jobGuideLineToggle) {
    jobGuideLineToggle.checked = App.state.jobGuideLinesEnabled !== false;
  }
  if (gathererToggle) {
    gathererToggle.checked = App.state.gathererEnabled !== false;
    updateGatherCraftVisibility(false);
  }
  if (crafterToggle) {
    crafterToggle.checked = App.state.crafterEnabled !== false;
    updateGatherCraftVisibility(false);
  }
  syncGatherCraftInputs();
  if (activityToggle) {
    activityToggle.checked = App.state.activity?.enabled !== false;
    activityStart.value = App.state.activity?.start ?? 21;
    activityEnd.value = App.state.activity?.end ?? 24;
    updateActivityLabels();
  }
  syncSpreadControls(false);
  updateCardTypeOptionsVisibility();
  updateNoFrameOptions();
  updateHeadingLabels(false);

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

  if (magazineTitlePreset) {
    magazineTitlePreset.addEventListener("change", () => {
      App.state.spread = App.state.spread || {};
      App.state.spread.magazineTitlePreset = magazineTitlePreset.value;

      if (magazineTitlePreset.value === "custom") {
        magazineTitleCustom.hidden = false;
        App.state.texts.title.value = magazineTitleCustom.value || App.state.texts.title.value || "CHARACTER FILE";
      } else {
        magazineTitleCustom.hidden = true;
        App.state.texts.title.value = magazineTitlePreset.value;
      }

      titleInput.value = App.state.texts.title.value;
      App.render();
      App.saveLocal();
    });
  }

  if (magazineTitleCustom) {
    magazineTitleCustom.addEventListener("input", () => {
      App.state.spread = App.state.spread || {};
      App.state.spread.magazineTitlePreset = "custom";
      App.state.texts.title.value = magazineTitleCustom.value || "CHARACTER FILE";
      titleInput.value = App.state.texts.title.value;
      App.render();
      App.saveLocal();
    });
  }

  [spreadBindingLineToggle, spreadBindingShadowToggle, spreadBgOpacity, spreadBgMode].forEach(el => {
    if (!el) return;
    el.addEventListener("input", updateSpreadStateFromControls);
    el.addEventListener("change", updateSpreadStateFromControls);
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

  if (headingLanguageSelect) {
    headingLanguageSelect.addEventListener("change", () => {
      App.state.headingLanguage = headingLanguageSelect.value;
      updateHeadingLabels(true);
    });
  }

  if (subjobToggle) {
    subjobToggle.addEventListener("change", () => {
      updateSubjobVisibility(true);
    });
  }

  if (jobGuideLineToggle) {
    jobGuideLineToggle.addEventListener("change", () => {
      App.state.jobGuideLinesEnabled = jobGuideLineToggle.checked;
      App.render();
      App.saveLocal();
    });
  }

  if (gathererToggle) {
    gathererToggle.addEventListener("change", () => updateGatherCraftVisibility(true));
  }

  if (crafterToggle) {
    crafterToggle.addEventListener("change", () => updateGatherCraftVisibility(true));
  }

  document.querySelectorAll(".gatherer-job").forEach(input => {
    input.addEventListener("change", updateGathererText);
  });

  document.querySelectorAll(".crafter-job").forEach(input => {
    input.addEventListener("change", updateCrafterText);
  });

  [activityToggle, activityStart, activityEnd].forEach(el => {
    if (!el) return;
    el.addEventListener("input", () => {
      App.state.activity = App.state.activity || {};
      App.state.activity.enabled = activityToggle.checked;
      App.state.activity.start = Number(activityStart.value);
      App.state.activity.end = Number(activityEnd.value);
      updateActivityLabels();
      App.renderActivityScale();
      App.saveLocal();
    });
    el.addEventListener("change", () => {
      App.state.activity = App.state.activity || {};
      App.state.activity.enabled = activityToggle.checked;
      App.state.activity.start = Number(activityStart.value);
      App.state.activity.end = Number(activityEnd.value);
      updateActivityLabels();
      App.renderActivityScale();
      App.saveLocal();
    });
  });

  function isSpreadLayout() {
    return (App.state.layout || "portrait") === "magazine";
  }

  function updateCardTypeOptionsVisibility() {
    const spreadMode = isSpreadLayout();

    if (frameOptions) frameOptions.style.display = spreadMode ? "none" : "block";
    if (spreadOptions) spreadOptions.hidden = !spreadMode;

    if (spreadMode) {
      syncSpreadControls(false);
    }
  }

  function updateNoFrameOptions() {
    if (!noFrameOptions || !frameToggle) return;
    noFrameOptions.style.display = (!isSpreadLayout() && frameToggle.checked) ? "none" : "block";
  }

  function syncSpreadControls(shouldSave) {
    const spread = App.state.spread || {};
    const preset = spread.magazineTitlePreset || matchMagazinePreset(App.state.texts.title.value);

    if (magazineTitlePreset) magazineTitlePreset.value = preset;
    if (magazineTitleCustom) {
      magazineTitleCustom.hidden = preset !== "custom";
      magazineTitleCustom.value = preset === "custom" ? (App.state.texts.title.value || "") : "";
    }
    if (spreadBindingLineToggle) spreadBindingLineToggle.checked = spread.bindingLine !== false;
    if (spreadBindingShadowToggle) spreadBindingShadowToggle.checked = spread.bindingShadow !== false;
    if (spreadBgOpacity) spreadBgOpacity.value = Number(spread.backgroundOpacity ?? 22);
    if (spreadBgOpacityLabel) spreadBgOpacityLabel.textContent = Number(spread.backgroundOpacity ?? 22) + "%";
    if (spreadBgMode) spreadBgMode.value = spread.backgroundMode || "full";

    if (shouldSave) App.saveLocal();
  }

  function matchMagazinePreset(value) {
    const presets = [
      "CHARACTER FILE",
      "CHARACTER PROFILE",
      "ADVENTURER'S RECORD",
      "WORLD RESIDENT FILE"
    ];
    return presets.includes(value) ? value : "custom";
  }

  function updateSpreadStateFromControls() {
    App.state.spread = App.state.spread || {};
    App.state.spread.bindingLine = spreadBindingLineToggle ? spreadBindingLineToggle.checked : true;
    App.state.spread.bindingShadow = spreadBindingShadowToggle ? spreadBindingShadowToggle.checked : true;
    App.state.spread.backgroundOpacity = spreadBgOpacity ? Number(spreadBgOpacity.value) : 22;
    App.state.spread.backgroundMode = spreadBgMode ? spreadBgMode.value : "full";
    if (spreadBgOpacityLabel) spreadBgOpacityLabel.textContent = App.state.spread.backgroundOpacity + "%";

    App.render();
    App.saveLocal();
  }

  function updateSubjobVisibility(shouldSave) {
    if (!subjobToggle) return;
    App.state.subjobEnabled = subjobToggle.checked;
    if (subJobOptions) subJobOptions.style.display = App.state.subjobEnabled ? "block" : "none";
    App.render();
    if (shouldSave) App.saveLocal();
  }

  function updateGatherCraftVisibility(shouldSave) {
    if (gathererToggle) App.state.gathererEnabled = gathererToggle.checked;
    if (crafterToggle) App.state.crafterEnabled = crafterToggle.checked;
    if (gathererOptions) gathererOptions.style.display = App.state.gathererEnabled ? "grid" : "none";
    if (crafterOptions) crafterOptions.style.display = App.state.crafterEnabled ? "grid" : "none";
    App.render();
    if (shouldSave) App.saveLocal();
  }

  function updateGathererText() {
    const selected = [...document.querySelectorAll(".gatherer-job:checked")].map(input => input.value);
    App.state.texts.gatherer.value = selected.length ? selected.join("・") : "ギャザラー";
    App.render();
    App.saveLocal();
  }

  function updateCrafterText() {
    const selected = [...document.querySelectorAll(".crafter-job:checked")].map(input => input.value);
    App.state.texts.crafter.value = selected.length ? selected.join("・") : "クラフター";
    App.render();
    App.saveLocal();
  }

  function syncGatherCraftInputs() {
    const gatherers = String(App.state.texts.gatherer.value || "").split("・");
    document.querySelectorAll(".gatherer-job").forEach(input => {
      input.checked = gatherers.includes(input.value);
    });

    const crafters = String(App.state.texts.crafter.value || "").split("・");
    document.querySelectorAll(".crafter-job").forEach(input => {
      input.checked = crafters.includes(input.value);
    });
  }

  function updateHeadingLabels(shouldSave) {
    const mode = App.state.headingLanguage || "kana";
    const labels = mode === "en"
      ? { jobLabel: "MAIN JOB", subjobLabel: "SUB JOB", gathererLabel: "GATHERER", crafterLabel: "CRAFTER", activityLabel: "ACTIVE TIME" }
      : { jobLabel: "メインジョブ", subjobLabel: "サブジョブ", gathererLabel: "ギャザラー", crafterLabel: "クラフター", activityLabel: "アクティブタイム" };

    App.state.texts.jobLabel.value = labels.jobLabel;
    App.state.texts.subjobLabel.value = labels.subjobLabel;
    App.state.texts.gathererLabel.value = labels.gathererLabel;
    App.state.texts.crafterLabel.value = labels.crafterLabel;
    App.state.texts.activityLabel.value = labels.activityLabel;
    App.render();
    if (shouldSave) App.saveLocal();
  }

  function updateActivityLabels() {
    if (!activityStartLabel || !activityEndLabel) return;
    const start = Number(activityStart.value);
    const end = Number(activityEnd.value);
    activityStartLabel.textContent = App.formatHour(start);
    activityEndLabel.textContent = App.formatHour(end) + (end < start ? "（翌日）" : "");
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
    剣術士: "初期ジョブ",
    斧術士: "初期ジョブ",
    格闘士: "初期ジョブ",
    槍術士: "初期ジョブ",
    弓術士: "初期ジョブ",
    呪術士: "初期ジョブ",
    巴術士: "初期ジョブ",
    幻術士: "初期ジョブ",
    双剣士: "初期ジョブ",

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
    "初期ジョブ",
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
    updateCardTypeOptionsVisibility();
    updateNoFrameOptions();
    syncSpreadControls(false);

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
    if (headingLanguageSelect) {
      headingLanguageSelect.value = App.state.headingLanguage || "kana";
      updateHeadingLabels(false);
    }
    if (subjobToggle) {
      subjobToggle.checked = App.state.subjobEnabled !== false;
      updateSubjobVisibility(false);
    }
    if (jobGuideLineToggle) {
      jobGuideLineToggle.checked = App.state.jobGuideLinesEnabled !== false;
    }
    if (gathererToggle) {
    gathererToggle.checked = App.state.gathererEnabled !== false;
    updateGatherCraftVisibility(false);
  }
  if (crafterToggle) {
    crafterToggle.checked = App.state.crafterEnabled !== false;
    updateGatherCraftVisibility(false);
  }
  syncGatherCraftInputs();
  if (activityToggle) {
      activityToggle.checked = App.state.activity?.enabled !== false;
      activityStart.value = App.state.activity?.start ?? 21;
      activityEnd.value = App.state.activity?.end ?? 24;
      updateActivityLabels();
    }
    updateCardTypeOptionsVisibility();
    updateNoFrameOptions();
    syncSpreadControls(false);

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