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
		case "placeholder":
			el.placeholder = value;
			break;
		default:
			console.warn(`updateElement: nieobsługiwany typ "${type}"`);
	}
};

export const setUserPreference = (option, value, userData) => {
	const currentUserData = JSON.parse?.(localStorage.getItem("userData")) || {};
	currentUserData[option] = value;
	userData = { ...userData, ...currentUserData };
	localStorage.setItem("userData", JSON.stringify(userData));
};
