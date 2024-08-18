const slider = document.getElementById('password-length');
const passwordLengthCounter = document.querySelector('.password-generator__password-length');
const generateBtnElement = document.getElementById('generate-btn');
const passwordFormElement = document.getElementById('password-generator__form');
const passwordContainerElement = document.querySelector('.password-generator__password-container');
const passwordOutputElement = document.querySelector('.password-generator__password');
const copyPasswordElement = document.querySelector('.password-generator__copy-btn');
const passwordStrengthContainer = document.querySelector('.password-generator__strength-states');
const passwordStrengthBoxesElement = document.querySelector('.password-generator__strength-boxes');
const passwordStrengthLevelElement = document.querySelector('.password-generator__strength-level');

const allLetters = 'abcdefghijklmnopqrstuvwxyz';
const allNumbers = '0123456789';
const allSymbols = '-_#$%*@.!';

const containsLowerLetter = str => str.match(/[a-z]+/);
const containsUpperLetter = str => str.match(/[A-Z]+/);
const containsNumber = str => str.match(/[0-9]+/);
const containsSymbol = str => str.match(new RegExp(`[${allSymbols}]+`));

const renderPasswordStrength = function (password) {
    let strength = password.length / 8;

    if (containsLowerLetter(password)) strength += 0.25;
    if (containsUpperLetter(password)) strength += 0.25;
    if (containsNumber(password)) strength += 0.25;
    if (containsSymbol(password)) strength += 0.25;

    strength = Math.floor(strength);

    if (strength > 3) strength = 3;

    let passwordStrengthText = '';
    if (strength === 0) passwordStrengthText = 'Too weak';
    if (strength === 1) passwordStrengthText = 'Weak';
    if (strength === 2) passwordStrengthText = 'Medium';
    if (strength === 3) passwordStrengthText = 'Strong';

    passwordStrengthBoxesElement.classList.remove('password-generator__strength-boxes--level-0');
    passwordStrengthBoxesElement.classList.remove('password-generator__strength-boxes--level-1');
    passwordStrengthBoxesElement.classList.remove('password-generator__strength-boxes--level-2');
    passwordStrengthBoxesElement.classList.remove('password-generator__strength-boxes--level-3');

    passwordStrengthBoxesElement.classList.add(`password-generator__strength-boxes--level-${strength}`);

    passwordStrengthLevelElement.textContent = passwordStrengthText;
};

const generatePassword = function (data) {
    const { 'password-length': passwordLength, 'include-uppercase': uppercase, 'include-lowercase': lowercase, 'include-numbers': numbers, 'include-symbols': symbols } = data;

    let allCharacters = '';

    if (lowercase) allCharacters += allLetters;
    if (uppercase) allCharacters += allLetters.toUpperCase();
    if (numbers) allCharacters += allNumbers;
    if (symbols) allCharacters += allSymbols;

    if (!allCharacters) return console.error('Must check at least one checkbox');

    let pwdString = '';
    while (pwdString.length < passwordLength) {
        const selectedIndex = Math.floor(Math.random() * allCharacters.length);
        const char = allCharacters.charAt(selectedIndex);

        pwdString += char;
    }

    return pwdString;
};

const handleFormSubmit = function (e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));
    const password = generatePassword(data);

    if (!password) return;

    passwordOutputElement.value = password;

    renderPasswordStrength(password);
};

const handleSlider = function () {
    const fillPercent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

    slider.style.setProperty('--fill-percent', `${fillPercent}%`);

    passwordLengthCounter.textContent = slider.value;
};

const handleCopy = function () {
    navigator.clipboard.writeText(passwordOutputElement.value);

    passwordContainerElement.querySelector('.password-generator__copied-text')?.remove();

    const element = document.createElement('p');
    element.classList.add('password-generator__copied-text');
    element.textContent = 'Copied';

    element.addEventListener('animationend', e => e.target.remove());

    passwordContainerElement.append(element);

    this.blur();
};

slider.addEventListener('input', handleSlider);
passwordFormElement.addEventListener('submit', handleFormSubmit);
copyPasswordElement.addEventListener('click', handleCopy);

handleSlider();
