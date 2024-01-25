// Load translations from the JSON file
let translations;
const defaultLanguage = "slovenian";

// Function to get the value of a specific cookie
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

// Check if a language preference cookie exists
const storedLanguage = getCookie("selectedLanguage");

// Use the stored language or default language if not set
const initialLanguage = storedLanguage || defaultLanguage;

// Function to update text content based on the selected language
function updateTextContent(language) {
  const elementsToTranslate = document.querySelectorAll("[data-translate]");
  elementsToTranslate.forEach((element) => {
    const translationKey = element.getAttribute("data-translate");
    if (translations[language] && translations[language][translationKey]) {
      element.textContent = translations[language][translationKey];
    }
  });
}

// Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // Event listener for the language switch button
    document
      .getElementById("languageSwitch")
      .addEventListener("change", function () {
        let currentLanguage;
        if (this.checked) {
          currentLanguage = "slovenian";
        } else {
          currentLanguage = "english";
        }
        updateTextContent(currentLanguage);

        // Store the selected language in a cookie
        document.cookie = `selectedLanguage=${currentLanguage}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
      });

    // Fetch translations from the JSON file after the delay
    fetch("JSON/translations.json")
      .then((response) => response.json())
      .then((data) => {
        translations = data;

        // Set the initial language based on the stored language or default language
        updateTextContent(initialLanguage);

        // Update the language switch checkbox based on the initial language
        if (initialLanguage === "slovenian") {
          document.getElementById("languageSwitch").checked = true;
        } else {
          document.getElementById("languageSwitch").checked = false;
        }
      })
      .catch((error) => {
        console.error("Error loading translations:", error);
      });
  }, 500); // Half-second delay (500 milliseconds)
});
