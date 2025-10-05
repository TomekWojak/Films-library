import { createElement } from "./helpers.min.js";
import { setUserPreference } from "./updateStateFunctions.min.js";

const getData = () => {
	try {
		const data = localStorage.getItem("userData");

		if (!data) return {};

		const parsedData = JSON.parse(data);

		if (typeof parsedData !== "object" || parsedData === null) {
			throw new Error("Nieprawidłowa struktura danych");
			// przypadek kiedy użytkownik usunie dane z local storage, lub jeśli z jakiegoś powodu zamiast obiektu pojawi się tam cokolwiek innego
		}
		return parsedData;
	} catch {
		console.log("Błąd pobierania danych z local storage");
		localStorage.removeItem("userData"); // powinno się czyścić uszkodzone dane!!
		return {};
	}
};

const USERNAME = "handsomeUser404";
const PASSWORD = "5jksH9d.";

export const createLoginHeader = (
	{
		header: {
			alt: { logo },
			aria: { logoLink, changeLanguageButton },
		},
	},
	langAmount,
	langNames,
	language,
	handleLangSelect
) => {
	// logo
	const header = createElement("header", ["header"]);
	const pageLogo = createElement("a", ["header__logo", "login-header__logo"], {
		href: "/",
		"aria-label": `${logoLink}`,
	});
	const logoImg = createElement(
		"img",
		["header__logo-img", "login-header__logo-img"],
		{
			src: "./src/icons/logo.svg",
			alt: `${logo}`,
			width: "24",
			height: "24",
		}
	);
	const logoText = createElement("span", [
		"header__logo-text",
		"login-header__logo-text",
	]);
	logoText.textContent = "Stream";
	pageLogo.append(logoImg, logoText);
	header.append(pageLogo);
	// end of logo

	// language selector
	const langSelect = createElement("button", ["login-header__lang-select"], {
		"aria-label": `${changeLanguageButton}`,
	});
	const langPlatformLang = createElement("span", [
		"login-header__lang-platform-lang",
	]);
	const langArrow = createElement("img", ["login-header__lang-arrow"], {
		src: "./src/icons/chevron-down.svg",
		alt: "",
		width: "24",
		height: "24",
	});
	const langList = createElement("ul", ["login-header__lang-list"]);

	for (let i = 0; i < langAmount; i++) {
		const langChoice = createElement("li", ["login-header__lang-choice"], {
			tabindex: 0,
		});
		const data = Object.keys(langNames)[i];
		const text = Object.values(langNames)[i];

		langChoice.dataset.lang = data;
		langChoice.textContent = text;
		langChoice.style.animationDelay = i * 100 + "ms";
		langList.append(langChoice);
	}

	langPlatformLang.textContent = langNames[language];

	langSelect.addEventListener("click", (e) => {
		handleLangSelect.call(langSelect, e, langPlatformLang);
	});

	langSelect.append(langPlatformLang, langArrow, langList);
	header.append(langSelect);

	return header;
	// end of language selector
};

export const createLoginPage = ({
	main: {
		text: { title, subtitle, description, button },
		placeholder: { username, password },
	},
}) => {
	const mainContent = createElement("main", ["main"]);
	const wrapper = createElement("div", ["wrapper"]);
	const loginTitle = createElement("h1");
	const loginTitleTop = createElement("span", ["main__title"]);
	const loginTitleBottom = createElement("span", ["main__subtitle"]);
	const loginText = createElement("p", ["main__text"]);
	const form = createElement("form", ["main__form"]);
	const usernameInput = createElement(
		"input",
		["main__form-input", "main__form-input--username"],
		{ type: "text", placeholder: username }
	);
	const passwordInput = createElement(
		"input",
		["main__form-input", "main__form-input--password"],
		{ type: "password", placeholder: password }
	);
	const submitBtn = createElement("button", ["main__form-button"], {
		type: "submit",
	});
	const buttonText = createElement("span", ["main__form-button-text"]);

	const errorTxt = createElement("p", ["main__form-error-txt"]);
	loginTitleTop.textContent = title;
	loginTitleBottom.textContent = subtitle;
	loginText.textContent = description;
	buttonText.textContent = button;

	loginTitle.append(loginTitleTop, loginTitleBottom);
	submitBtn.append(buttonText);
	form.append(usernameInput, passwordInput, submitBtn, errorTxt);

	wrapper.append(loginTitle, loginText, form);
	mainContent.append(wrapper);

	submitBtn.addEventListener("click", (e) => {
		const userData = getData();

		const results = handleLoginValidation(
			e,
			usernameInput,
			passwordInput,
			translations.main.text.errorRequired,
			translations.main.text.errorInvalid,
			USERNAME,
			PASSWORD,
			errorTxt
		);

		if (!results) {
			errorTxt.classList.remove("visible");
			e.target.append(showSmallLoader());
			e.target.disabled = true;

			setTimeout(() => {
				e.target.disabled = false;
				hideSmallLoader();

				setUserPreference("translations", translations, userData);
				setUserPreference("loggedIn", true, userData);
				window.location.href = "profiles.html"; // przejście na stronę z profilami
			}, 3000);
		}
	});

	return mainContent;
};

const handleLoginValidation = (
	e,
	usernameInput,
	passwordInput,
	requireError,
	invalidError,
	username,
	password,
	errorTxt
) => {
	e.preventDefault();

	if (usernameInput.value.trim() === "" || passwordInput.value.trim() === "") {
		errorTxt.classList.add("visible");
		errorTxt.textContent = requireError;
		return requireError;
	} else if (
		usernameInput.value.trim() !== username ||
		passwordInput.value.trim() !== password
	) {
		e.target.disabled = true;
		e.target.append(showSmallLoader());
		errorTxt.classList.remove("visible");

		setTimeout(() => {
			errorTxt.classList.add("visible");
			errorTxt.textContent = invalidError;

			e.target.disabled = false;

			hideSmallLoader();
		}, 3000);
		return invalidError;
	} else {
		return null;
	}
};

export const showBigLoader = () => {
	const loadingArea = createElement("div", ["loading-area"]);
	loadingArea.innerHTML = `            <svg class="loader-big" viewBox="0 0 120 120" width="120" height="120">
                <defs>
                    <linearGradient id="loader-accent" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#4da8da" stop-opacity="0.8" />
                        <stop offset="70%" stop-color="#4da8da" stop-opacity="0.4" />
                        <stop offset="100%" stop-color="#4da8da" stop-opacity="0" />
                    </linearGradient>
                </defs>
                <circle class="loading-circle-big" r="35" cx="60" cy="60"></circle>
            </svg>`;
	return loadingArea;
};
export const hideBigLoader = () => {
	const loadingArea = document.querySelector(".loading-area");
	loadingArea?.remove();
};

export const showSmallLoader = () => {
	const loadingArea = createElement("div", ["loading-area-small"]);
	loadingArea.innerHTML = `<svg class="loader-small" viewBox="0 0 120 120" width="120" height="120">
                <defs>
                    <linearGradient id="loader-accent-small" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="white" stop-opacity="0.8" />
                        <stop offset="70%" stop-color="white" stop-opacity="0.3" />
                        <stop offset="100%" stop-color="white" stop-opacity="0" />
                    </linearGradient>
                </defs>
                <circle class="loading-circle-small" r="12" cx="60" cy="60"></circle>
            </svg>`;

	return loadingArea;
};
export const hideSmallLoader = () => {
	const loadingArea = document.querySelector(".loading-area-small");
	loadingArea.remove();
};

export const createProfilesPage = ({
	profiles: {
		text: { title, addProfileInfo },
		aria: { addProfileBtn, userProfileBtn, userBtnCustomize },
	},
	errorPopup: {
		text: { maxProfiles, emptyField },
	},
}) => {
	const userData = getData();
	const userProfilesList = userData?.userProfiles;

	const container = document.querySelector(".container");
	const profilesPageMain = createElement("main", ["main-profiles"]);
	const wrapper = createElement("div", ["wrapper"]);
	const profilesTitle = createElement("h1", [
		"main__title",
		"main-profiles__title",
	]);
	const profilesBox = createElement("div", ["main-profiles__box"]);

	profilesTitle.textContent = title;

	if (userProfilesList && Object.keys(userProfilesList).length !== 0) {
		for (const key in userProfilesList) {
			profilesBox.append(
				createProfile(
					userProfileBtn,
					userBtnCustomize,
					userBtnCustomize,
					emptyField,
					key, // dodaj klucz profilu
					userProfilesList[key] // dodaj nazwę profilu
				)
			);
		}
	}
	profilesBox.append(
		createProfileAddBtn(
			addProfileBtn,
			addProfileInfo,
			userProfileBtn,
			profilesBox,
			userBtnCustomize,
			userBtnCustomize,
			maxProfiles,
			emptyField
		)
	);
	wrapper.append(profilesTitle, profilesBox);
	profilesPageMain.append(wrapper);

	container.append(profilesPageMain);
};

const createProfile = (
	ariaInfo,
	userBtnInfo,
	saveBtnAria,
	emptyFieldError,
	existingProfileId = null, // nowy parametr
	existingProfileName = null // nowy parametr
) => {
	const userData = getData();
	const existingProfiles = userData?.userProfiles || {};

	let color;
	let profileId;
	let profileName;

	const colors = ["#dc4a34", "#062E63", "#FAC044"];

	// Jeśli to istniejący profil (ładowany z localStorage)
	if (existingProfileId) {
		profileId = existingProfileId;
		profileName = existingProfileName;
		const profileNumber = parseInt(profileId.split("-").pop());
		color = colors[profileNumber - 1];
	} else {
		// Jeśli to nowy profil
		if (Object.keys(existingProfiles).length >= 3) return;

		// Znajdź najmniejszy dostępny numer ID
		let nextNumber = 1;
		while (existingProfiles[`user-profile-${nextNumber}`]) {
			nextNumber++;
		}

		profileId = `user-profile-${nextNumber}`;
		profileName = `Handsome User ${nextNumber}`;
		color = colors[nextNumber - 1];
	}

	const userProfile = createElement("div", ["main-profiles__profile"]);
	const userAvatarBox = createElement("div", ["main-profiles__avatar"]);
	const userProfileBtn = createElement("button", ["main-profiles__btn"], {
		"aria-label": ariaInfo,
		"data-id": profileId,
	});

	const userProfileInfoBox = createElement("div", ["main-profiles__user-info"]);
	const userProfileInfo = createElement("input", ["main-profiles__name"], {
		type: "text",
		readonly: true,
		value: profileName,
	});
	const editUserInfoBtn = createElement(
		"button",
		["main-profiles__edit-name"],
		{ "aria-label": userBtnInfo }
	);
	const removeUserBtn = createElement(
		"button",
		["main-profiles__remove-user"],
		{ "aria-label": "Przycisk umożliwiający usunięcie użytkownika" }
	);
	const removeUserIcon = createElement("img", ["main-profiles__remove-icon"], {
		width: "24",
		height: "24",
		loading: "lazy",
		alt: "",
		src: "./src/icons/remove-profile-icon.svg",
	});
	const editUserInfoIcon = createElement("img", ["main-profiles__edit-icon"], {
		width: "24",
		height: "24",
		loading: "lazy",
		alt: "",
		src: "./src/icons/edit.svg",
	});

	userProfileBtn.innerHTML = `<svg class="main-profiles__img" width="150" height="150" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="70" r="8" fill="white" />
    <circle cx="130" cy="70" r="8" fill="white" />
    <path d="M60 110 Q100 150 140 110" stroke="white" stroke-width="6"
    fill="transparent" stroke-linecap="round" />
    </svg>`;
	userProfileBtn.style.backgroundColor = color;

	userAvatarBox.append(userProfileBtn);
	editUserInfoBtn.append(editUserInfoIcon);
	removeUserBtn.append(removeUserIcon);
	userProfileInfoBox.append(userProfileInfo, editUserInfoBtn, removeUserBtn);
	userProfile.append(userAvatarBox, userProfileInfoBox);

	// Zapisz profil tylko jeśli to nowy profil
	if (!existingProfileId) {
		const updatedProfiles = {
			...existingProfiles,
			[profileId]: profileName,
		};
		setUserPreference("userProfiles", updatedProfiles, userData);
	}

	editUserInfoBtn.addEventListener("click", (e) => {
		editUsername(e, userProfileInfoBox, saveBtnAria, emptyFieldError);
	});
	removeUserBtn.addEventListener("click", (e) => {
		removeUser(e);
	});

	userProfileInfo.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			saveUsername(e, emptyFieldError);
		}
	});

	return userProfile;
};

const createProfileAddBtn = (
	ariaInfo,
	info,
	userBtnAria,
	profilesBox,
	userBtnInfo,
	saveBtnAria,
	maxProfilesError,
	emptyFieldError
) => {
	const addProfileBox = createElement("div", ["main-profiles__add-profile"]);
	const addProfileAvatar = createElement("div", ["main-profiles__avatar"]);
	const addProfileBtn = createElement(
		"button",
		["main-profiles__btn", "main-profiles__btn--add-profile"],
		{ "aria-label": ariaInfo }
	);
	const addProfilePlusIcon = createElement("img", ["main-profiles__add-img"], {
		src: "./src/icons/add-profile.svg",
		loading: "lazy",
		alt: "",
	});
	const addProfileInfo = createElement("span", ["main-profiles__name"]);

	addProfileInfo.textContent = info;

	addProfileBtn.append(addProfilePlusIcon);
	addProfileAvatar.append(addProfileBtn);
	addProfileBox.append(addProfileAvatar, addProfileInfo);

	addProfileBtn.addEventListener("click", () => {
		const userData = getData();
		const existingProfiles = userData?.userProfiles || {};

		if (Object.keys(existingProfiles).length >= 3) {
			showErrorPopup(maxProfilesError, "#dc4a34");
			return;
		}

		const profile = createProfile(
			userBtnAria,
			userBtnInfo,
			saveBtnAria,
			emptyFieldError
		);

		if (profile) {
			profilesBox.insertBefore(profile, addProfileBox);
		}
	});

	return addProfileBox;
};

const editUsername = (e, parent, saveBtnAria, emptyFieldError) => {
	resetStateOfEditing(e);

	const editBtn = e.target;
	const nameToEdit = editBtn.previousElementSibling;
	const saveBtn = createSaveBtn(saveBtnAria);

	editBtn.classList.add("hidden");
	saveBtn.classList.remove("hidden");

	parent.append(saveBtn);

	nameToEdit.focus();
	nameToEdit.select();
	nameToEdit.removeAttribute("readonly");
	nameToEdit.classList.add("focused");

	saveBtn.addEventListener("click", (e) => {
		saveUsername(e, emptyFieldError);
	});
};

const saveUsername = (e, emptyFieldError) => {
	const userData = getData();
	const existingProfiles = userData?.userProfiles || [];

	const saveBtn = e.target;
	const closestProfile = saveBtn.closest(".main-profiles__profile");
	const closestProfileId = closestProfile.querySelector(".main-profiles__btn")
		.dataset.id;
	const closestProfileName = closestProfile.querySelector(
		".main-profiles__name"
	);

	const allEditBtns = document.querySelectorAll(".main-profiles__edit-name");

	allEditBtns.forEach((btn) => btn.removeAttribute("disabled"));

	if (closestProfileName.value.trim() === "") {
		allEditBtns.forEach((btn) => btn.setAttribute("disabled", true));
		return showErrorPopup(emptyFieldError, "#FAC044");
	}

	const updatedProfiles = {
		...existingProfiles,
		[closestProfileId]: closestProfileName.value,
	};
	setUserPreference("userProfiles", updatedProfiles, userData);

	resetStateOfEditing(e);
};

const createSaveBtn = (saveBtnAria) => {
	const saveUserInfoBtn = createElement(
		"button",
		["main-profiles__save-name", "hidden"],
		{ "aria-label": saveBtnAria }
	);
	const saveUserInfoIcon = createElement("img", ["main-profiles__save-icon"], {
		width: "24",
		height: "24",
		loading: "lazy",
		alt: "",
		src: "./src/icons/save.svg",
	});

	saveUserInfoBtn.append(saveUserInfoIcon);

	return saveUserInfoBtn;
};

const resetStateOfEditing = (e) => {
	const focusedNames = document.querySelectorAll(".focused");
	const allSaveBtns = document.querySelectorAll(".main-profiles__save-name");
	const allEditBtns = document.querySelectorAll(".main-profiles__edit-name");

	focusedNames.forEach((el) => {
		el.setAttribute("readonly", true);
		el.classList.remove("focused");
		el.blur();
	});
	allSaveBtns.forEach((btn) => btn.classList.add("hidden"));
	allEditBtns.forEach((btn) => btn.classList.remove("hidden"));
};

let popupVisible = false;
const showErrorPopup = (text, color) => {
	if (popupVisible) return;
	popupVisible = true;

	const root = document.documentElement;
	const container = document.querySelector(".container");

	const popup = createElement("div", ["error-popup"]);
	const popupError = createElement("p", ["error-popup__text"]);

	popupError.textContent = text;
	root.style.setProperty("--errorTxtColor", color);

	popup.append(popupError);
	container.append(popup);

	setTimeout(() => {
		popup.classList.add("hidden");
	}, 2000);
	setTimeout(() => {
		popup.remove();
		popupVisible = false;
	}, 2500);
};

const removeUser = (e) => {
	const userData = getData();
	const userProfiles = userData?.userProfiles;
	const allEditBtns = document.querySelectorAll(".main-profiles__edit-name");

	const deleteBtn = e.target;
	const closestProfile = deleteBtn.closest(".main-profiles__profile");
	const closestProfileBtn = closestProfile.querySelector(".main-profiles__btn");
	allEditBtns.forEach((btn) => btn.removeAttribute("disabled"));

	delete userProfiles[closestProfileBtn.dataset.id];

	setUserPreference("userProfiles", userProfiles, userData);

	closestProfile.remove();
};
