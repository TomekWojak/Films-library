export const createElement = (tag, classNames = [], attributes = {}) => {
    const element = document.createElement(tag);
    classNames.forEach(className => element.classList.add(className));
    for (const attr in attributes) {
        element.setAttribute(attr, attributes[attr]);
    }
}