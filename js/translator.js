let translations;
const defaultLanguage = "slovenian";

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

let currentLanguage = getCookie("selectedLanguage") || defaultLanguage;

function updateTextContent(language) {
  const elementsToTranslate = document.querySelectorAll("[data-translate]");
  elementsToTranslate.forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (translations[language] && translations[language][key]) {
      element.textContent = translations[language][key];
    }
  });
}

function updateToggleText(language) {
  const toggleLink = document.getElementById("languageToggle");
  if (toggleLink) {
    const flag = language === "slovenian" ? "uk" : "si";
    const label = language === "slovenian" ? "English" : "Slovenščina";
    toggleLink.innerHTML = `
      <img src="img/switch_${flag}.png" alt="${label}" style="width: 24px; height: 24px; margin-right: 6px;">
      ${label}
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("json/translations.json")
    .then((response) => response.json())
    .then((data) => {
      translations = data;

      updateTextContent(currentLanguage);
      updateToggleText(currentLanguage);

      const toggleLink = document.getElementById("languageToggle");
      if (toggleLink) {
        toggleLink.addEventListener("click", (e) => {
          e.preventDefault();

          currentLanguage =
            currentLanguage === "slovenian" ? "english" : "slovenian";

          updateTextContent(currentLanguage);
          updateToggleText(currentLanguage);
          document.cookie = `selectedLanguage=${currentLanguage}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
        });
      }
    })
    .catch((error) => {
      console.error("Error loading translations:", error);
    });
});
