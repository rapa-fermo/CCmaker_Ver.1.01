document.addEventListener("DOMContentLoaded", () => {
  const templateSelect = document.getElementById("templateSelect");
  const cardTypeSelect = document.getElementById("cardTypeSelect");

  function applyTemplate(key, shouldSave = true) {
    const t = templates[key];
    if (!t) return;

    App.state.template = key;
    App.state.background = t.background || "";
    App.state.frame = t.frame || "";
    App.state.layout = t.layout || "portrait";
    App.state.cardSize = {
      ...(App.state.cardSize || {}),
      ...(t.cardSize || { width: 700, height: 1000 })
    };
    App.state.frameEnabled = typeof t.frameEnabled === "boolean" ? t.frameEnabled : true;
    if (typeof t.gathererEnabled === "boolean") App.state.gathererEnabled = t.gathererEnabled;
    if (typeof t.crafterEnabled === "boolean") App.state.crafterEnabled = t.crafterEnabled;
    App.state.backgroundTransform = { x: 0, y: 0 };

    App.state.spread = {
      ...(App.state.spread || {}),
      ...(t.spread || {})
    };

    if (t.activity) {
      App.state.activity = {
        ...(App.state.activity || {}),
        ...t.activity
      };
    }

    if (t.photoArea) {
      App.state.photoArea = {
        ...App.state.photoArea,
        ...t.photoArea
      };
    }

    ["title", "name", "jobLabel", "job", "subjobLabel", "subjob", "gathererLabel", "gatherer", "crafterLabel", "crafter", "activityLabel", "desc", "world", "copyright"].forEach(textKey => {
      if (t.font) {
        App.state.texts[textKey].font = t.font;
      }

      if (t.textColor) {
        App.state.texts[textKey].color = t.textColor;
      }

      if (t.texts && t.texts[textKey]) {
        App.state.texts[textKey] = {
          ...App.state.texts[textKey],
          ...t.texts[textKey]
        };
      }
    });

    App.render();

    if (typeof window.updateCardScale === "function") {
      window.updateCardScale();
    }

    if (typeof window.updateEditor === "function") {
      window.updateEditor();
    }

    if (shouldSave) {
      App.saveLocal();
    }
  }

  window.applyTemplate = applyTemplate;

  function getTemplateType(key) {
    return (templates[key] && templates[key].type) || "cover";
  }

  function getTypeLabel(type) {
    if (type === "spread") return "見開き風（横型）";
    return "表紙風（縦型）";
  }

  function createCardTypeOptions() {
    if (!cardTypeSelect) return;
    cardTypeSelect.innerHTML = "";

    const types = [];
    Object.keys(templates).forEach(key => {
      const type = getTemplateType(key);
      if (!types.includes(type)) types.push(type);
    });

    types.forEach(type => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = getTypeLabel(type);
      cardTypeSelect.appendChild(option);
    });
  }

  function createTemplateOptions(filterType) {
    templateSelect.innerHTML = "";

    const groups = {};
    Object.keys(templates).forEach(key => {
      const type = getTemplateType(key);
      if (filterType && type !== filterType) return;
      if (!groups[type]) {
        groups[type] = document.createElement("optgroup");
        groups[type].label = getTypeLabel(type);
        templateSelect.appendChild(groups[type]);
      }

      const option = document.createElement("option");
      option.value = key;
      option.textContent = templates[key].name;
      groups[type].appendChild(option);
    });
  }

  createCardTypeOptions();

  if (!templates[App.state.template]) {
    App.state.template = Object.keys(templates)[0];
  }

  const currentType = getTemplateType(App.state.template);
  if (cardTypeSelect) cardTypeSelect.value = currentType;
  createTemplateOptions(cardTypeSelect ? currentType : null);
  templateSelect.value = App.state.template;
  applyTemplate(App.state.template, false);

  if (cardTypeSelect) {
    cardTypeSelect.addEventListener("change", () => {
      const type = cardTypeSelect.value;
      createTemplateOptions(type);
      const firstKey = Object.keys(templates).find(key => getTemplateType(key) === type);
      if (firstKey) {
        templateSelect.value = firstKey;
        applyTemplate(firstKey, true);
      }
    });
  }

  templateSelect.addEventListener("change", () => {
    const key = templateSelect.value;
    if (cardTypeSelect) cardTypeSelect.value = getTemplateType(key);
    applyTemplate(key, true);
  });
});
