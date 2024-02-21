export function createMeterialIconEl(iconName) {
    const spanEl = document.createElement('span');
    spanEl.classList.add('material-icons');
    spanEl.textContent = iconName;
    return spanEl;
}