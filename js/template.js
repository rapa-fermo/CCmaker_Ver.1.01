document.addEventListener("DOMContentLoaded", () => {
  const templateSelect = document.getElementById("templateSelect");

  function applyTemplate(key, shouldSave = true) {
    const t = templates[key];
    if (!t) return;

    App.state.template = key;
    App.state.background = t.background || "";
    App.state.frame = t.frame || "";

    if (t.photoArea) {
      App.state.photoArea = {
        ...App.state.photoArea,
        ...t.photoArea
      };
    }

    ["title", "name", "job", "subjob", "desc", "copyright"].forEach(textKey => {
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

    if (typeof window.updateEditor === "function") {
      window.updateEditor();
    }

    if (shouldSave) {
      App.saveLocal();
    }
  }

  window.applyTemplate = applyTemplate;

  function createTemplateOptions() {
    templateSelect.innerHTML = "";

    Object.keys(templates).forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = templates[key].name;
      templateSelect.appendChild(option);
    });
  }

  createTemplateOptions();

  if (!templates[App.state.template]) {
    App.state.template = Object.keys(templates)[0];
  }

  templateSelect.value = App.state.template;
  applyTemplate(App.state.template, false);

  templateSelect.addEventListener("change", () => {
    applyTemplate(templateSelect.value, true);
  });
});