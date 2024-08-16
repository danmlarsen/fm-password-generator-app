const slider = document.getElementById('password-length');

slider.addEventListener('input', e => {
    const fillPercent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

    slider.style.setProperty('--fill-percent', `${fillPercent}%`);
});
