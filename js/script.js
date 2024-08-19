//
//  Config
//
const PASSWORD_MINLENGTH = 10;
const PASSWORD_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const PASSWORD_NUMBERS = '0123456789';
const PASSWORD_SYMBOLS = '!@#$%^&*()-+';

//
// DOM Selections
//
const sliderElement = document.getElementById('password-length');
const passwordLengthCounterElement = document.querySelector('.password-generator__password-length');
const generateBtnElement = document.getElementById('generate-btn');
const passwordFormElement = document.getElementById('password-generator__form');
const passwordContainerElement = document.querySelector('.password-generator__password-container');
const passwordOutputElement = document.querySelector('.password-generator__password');
const copyPasswordElement = document.querySelector('.password-generator__copy-btn');
const passwordStrengthContainerElement = document.querySelector('.password-generator__strength-states');
const passwordStrengthBoxesElement = document.querySelector('.password-generator__strength-boxes');
const passwordStrengthLevelElement = document.querySelector('.password-generator__strength-level');

//
// Helper functions
//
const containsLowerLetter = str => str.match(/[a-z]+/);
const containsUpperLetter = str => str.match(/[A-Z]+/);
const containsNumber = str => str.match(/[0-9]+/);
const containsSymbol = str => str.match(new RegExp(`[${PASSWORD_SYMBOLS}]+`));

const calcPasswordStrengthScore = function (password) {
    let strength = (password.length - PASSWORD_MINLENGTH) / 2;

    if (containsLowerLetter(password)) strength += 1;
    if (containsUpperLetter(password)) strength += 1;
    if (containsNumber(password)) strength += 0.5;
    if (containsSymbol(password)) strength += 0.5;

    strength = Math.floor(strength);

    if (strength > 3) strength = 3;
    if (strength < 0) strength = 0;

    return strength;
};

const calcSliderFillPercent = slider => ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

const shuffleString = function (str) {
    arr = str.split('');
    let currentIndex = arr.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }

    return arr.join('');
};

const selectRandomCharacter = function (chars) {
    const selectedIndex = Math.floor(Math.random() * chars.length);
    return chars.charAt(selectedIndex);
};

const generatePassword = function ({ passwordLength, uppercase, lowercase, numbers, symbols }) {
    let allCharacters = '';

    if (lowercase) allCharacters += PASSWORD_LETTERS;
    if (uppercase) allCharacters += PASSWORD_LETTERS.toUpperCase();
    if (numbers) allCharacters += PASSWORD_NUMBERS;
    if (symbols) allCharacters += PASSWORD_SYMBOLS;

    let passwordString = '';
    while (passwordString.length < passwordLength) {
        if (lowercase && !containsLowerLetter(passwordString)) {
            passwordString += selectRandomCharacter(PASSWORD_LETTERS);
        } else if (uppercase && !containsUpperLetter(passwordString)) {
            passwordString += selectRandomCharacter(PASSWORD_LETTERS.toUpperCase());
        } else if (numbers && !containsNumber(passwordString)) {
            passwordString += selectRandomCharacter(PASSWORD_NUMBERS);
        } else if (symbols && !containsSymbol(passwordString)) {
            passwordString += selectRandomCharacter(PASSWORD_SYMBOLS);
        } else {
            passwordString += selectRandomCharacter(allCharacters);
        }
    }

    return shuffleString(passwordString);
};

//
// Render Functions
//
const renderStrengthBoxes = function (passwordStrength) {
    passwordStrengthBoxesElement.classList.remove('password-generator__strength-boxes--level-0');
    passwordStrengthBoxesElement.classList.remove('password-generator__strength-boxes--level-1');
    passwordStrengthBoxesElement.classList.remove('password-generator__strength-boxes--level-2');
    passwordStrengthBoxesElement.classList.remove('password-generator__strength-boxes--level-3');

    passwordStrengthBoxesElement.classList.add(`password-generator__strength-boxes--level-${passwordStrength}`);
};

const renderPasswordStrength = function (password) {
    const passwordStrength = calcPasswordStrengthScore(password);

    let passwordStrengthText = '';
    if (passwordStrength === 0) passwordStrengthText = 'Too weak';
    if (passwordStrength === 1) passwordStrengthText = 'Weak';
    if (passwordStrength === 2) passwordStrengthText = 'Medium';
    if (passwordStrength === 3) passwordStrengthText = 'Strong';

    renderStrengthBoxes(passwordStrength);
    passwordStrengthLevelElement.textContent = passwordStrengthText;
};

const renderPassword = function (password) {
    if (!password) return;
    passwordOutputElement.value = password;
};

const renderCopyNotification = function () {
    passwordContainerElement.querySelector('.password-generator__copied-text')?.remove();

    const element = document.createElement('p');
    element.classList.add('password-generator__copied-text');
    element.textContent = 'Copied';

    element.addEventListener('animationend', e => e.target.remove());

    passwordContainerElement.append(element);
};

const renderSliderFillPercent = function (fillPercent) {
    sliderElement.style.setProperty('--fill-percent', `${fillPercent}%`);
};

//
// Event handlers
//
const handleFormSubmit = function (e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));
    const { 'password-length': passwordLength, 'include-uppercase': uppercase, 'include-lowercase': lowercase, 'include-numbers': numbers, 'include-symbols': symbols } = data;

    if (passwordLength <= 0) return;
    if (!uppercase && !lowercase && !numbers && !symbols) return console.error('Must check at least one checkbox');

    const password = generatePassword({
        passwordLength,
        uppercase,
        lowercase,
        numbers,
        symbols,
    });

    renderPassword(password);
    renderPasswordStrength(password);
};

const handleSliderInput = function () {
    renderSliderFillPercent(calcSliderFillPercent(sliderElement));
    passwordLengthCounterElement.textContent = sliderElement.value;
};

const handleCopyPasswordClick = function () {
    if (!passwordOutputElement.value.trim()) return console.error('No password to copy!');

    navigator.clipboard.writeText(passwordOutputElement.value);

    renderCopyNotification();

    this.blur();
};

//
// Events
//
sliderElement.addEventListener('input', handleSliderInput);
passwordFormElement.addEventListener('submit', handleFormSubmit);
copyPasswordElement.addEventListener('click', handleCopyPasswordClick);

//
// Initial setup
//
renderSliderFillPercent(calcSliderFillPercent(sliderElement));
