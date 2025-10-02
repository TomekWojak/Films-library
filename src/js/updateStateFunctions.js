export const updateElement = (selector, type, value) => {
	const el = document.querySelector(`.${selector}`);
	if (!el) return;

	switch (type) {
		case "text":
			el.textContent = value;
			break;
		case "aria":
			el.setAttribute("aria-label", value);
			break;
		case "alt":
			el.alt = value;
			break;
		default:
			console.warn(`updateElement: nieobsługiwany typ "${type}"`);
	}
};
