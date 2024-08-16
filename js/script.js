const slider = document.getElementById("password-length");
const passwordLengthCounter = document.querySelector(
  ".password-generator__password-length"
);
const generateBtnElement = document.getElementById("generate-btn");
const passwordFormElement = document.getElementById("password-generator__form");
const passwordOutputElement = document.querySelector(
  ".password-generator__password"
);

const handleGenerate = function (e) {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));
  const {
    "password-length": passwordLength,
    "include-uppercase": uppercase,
    "include-lowercase": lowercase,
    "include-numbers": numbers,
    "include-symbols": symbols,
  } = data;

  const allLetters = "abcdefghijklmnopqrstuvwxyz";
  const allNumbers = "0123456789";
  const allSymbols = "!-#$%";

  let allCharacters = "";

  if (lowercase) allCharacters += allLetters;
  if (uppercase) allCharacters += allLetters.toUpperCase();
  if (numbers) allCharacters += allNumbers;
  if (symbols) allCharacters += allSymbols;

  if (!allCharacters) return console.error("Must check at least one checkbox");

  let pwdString = "";
  while (pwdString.length < passwordLength) {
    const selectedIndex = Math.floor(Math.random() * allCharacters.length);
    const char = allCharacters.charAt(selectedIndex);

    pwdString += char;
  }

  if (pwdString.length >= 20) {
    passwordOutputElement.classList.add("password-generator__password--long");
  }

  passwordOutputElement.textContent = pwdString;
};

slider.addEventListener("input", (e) => {
  const fillPercent =
    ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

  slider.style.setProperty("--fill-percent", `${fillPercent}%`);

  passwordLengthCounter.textContent = slider.value;
});

passwordFormElement.addEventListener("submit", handleGenerate);
