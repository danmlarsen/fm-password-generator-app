const slider = document.getElementById('password-length');
const passwordLengthCounter = document.querySelector('.password-generator__password-length');
const generateBtnElement = document.getElementById('generate-btn');
const passwordFormElement = document.getElementById('password-generator__form');
const passwordOutputElement = document.querySelector('.password-generator__password');
const copyPasswordIconElement = document.querySelector('.password-generator__copy-icon');
const passwordStrengthContainer = document.querySelector('.password-generator__strength-states');
const passwordStrengthBoxesElement = document.querySelector('.password-generator__strength-boxes');
const passwordStrengthLevelElement = document.querySelector('.password-generator__strength-level');

const allLetters = 'abcdefghijklmnopqrstuvwxyz';
const allNumbers = '0123456789';
const allSymbols = '-_#$%*@.!';

const renderPasswordStrength = function (password) {
    let strength = password.length / 16;

    if (password.match(/[a-z]+/)) strength += .5;
    if (password.match(/[A-Z]+/)) strength += .5;
    if (password.match(/[0-9]+/)) strength += .5;
    if (password.match(new RegExp(`[${allSymbols}]+`))) strength += .5;

    strength = Math.floor(strength);

    if (strength > 3) strength = 3;
    if (strength < 0) strength = 0;


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

const handleSlide = function (e) {
    const fillPercent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

    slider.style.setProperty('--fill-percent', `${fillPercent}%`);

    passwordLengthCounter.textContent = slider.value;
};

const handleCopy = function (e) {
    navigator.clipboard.writeText(passwordOutputElement.value);
};

slider.addEventListener('input', handleSlide);
passwordFormElement.addEventListener('submit', handleFormSubmit);
copyPasswordIconElement.addEventListener('click', handleCopy);
