import { createElement, getImageUrl } from "./helpers.min.js";
import { setUserPreference } from "./updateStateFunctions.min.js";
const HIDE_LOADER_TIME = 3000;
const HIDE_POPUP_TIME = 2500;
export const getData = () => {
	try {
		const data = localStorage.getItem("userData");

		if (!data) return null;

		const parsedData = JSON.parse(data);

		if (typeof parsedData !== "object" || parsedData === null) {
			showErrorPopup("An unexpected error occurred", "#dc4a34");
			throw new Error("Nieprawidłowa struktura danych");
		}
		return parsedData;
	} catch {
		localStorage.removeItem("userData");
		return {};
	}
};

// DEMO ONLY - Never hardcode credentials in production!
const USERNAME = "handsomeUser404";
const PASSWORD = "123456789";

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
		const choosenLang = userData?.preferredLanguage;

		if (!choosenLang) {
			setUserPreference("preferredLanguage", "pl", userData);
		}

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
			}, HIDE_LOADER_TIME);
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
		}, HIDE_LOADER_TIME);
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
		aria: { addProfileBtn, userProfileBtn, userBtnCustomize, removeUserInfo },
	},
	errorPopup: {
		text: { maxProfiles, emptyField },
	},
}) => {
	const userData = getData();
	const userProfilesList = userData?.userProfiles;

	const container = document.querySelector(".container");

	container.append(showBigLoader());

	setTimeout(() => {
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
						removeUserInfo,
						key,
						userProfilesList[key]
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
				emptyField,
				removeUserInfo
			)
		);
		wrapper.append(profilesTitle, profilesBox);
		profilesPageMain.append(wrapper);

		container.append(profilesPageMain);
		hideBigLoader();
	}, 500);
};

const createProfile = (
	ariaInfo,
	userBtnInfo,
	saveBtnAria,
	emptyFieldError,
	removeAria,
	existingProfileId = null,
	existingProfileName = null
) => {
	const userData = getData();
	const existingProfiles = userData?.userProfiles || {};

	if (userData === null) {
		showErrorPopup("An unexpected error occurred", "#dc4a34");
		setTimeout(() => {
			window.location.reload();
		}, HIDE_POPUP_TIME);
		return;
	}

	let color;
	let profileId;
	let profileName;

	const colors = ["#dc4a34", "#062E63", "#FAC044"];

	if (existingProfileId) {
		profileId = existingProfileId;
		profileName = existingProfileName.name;
		const profileNumber = parseInt(profileId.split("-").pop());
		color = colors[profileNumber - 1];
	} else {
		if (Object.keys(existingProfiles).length >= 3) return;

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
	const nameBorder = createElement("span", ["name-border"]);
	const editUserInfoBtn = createElement(
		"button",
		["main-profiles__edit-name"],
		{ "aria-label": userBtnInfo }
	);
	const removeUserBtn = createElement(
		"button",
		["main-profiles__remove-user"],
		{ "aria-label": removeAria }
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
	userProfileInfoBox.append(
		userProfileInfo,
		nameBorder,
		editUserInfoBtn,
		removeUserBtn
	);
	userProfile.append(userAvatarBox, userProfileInfoBox);

	if (!existingProfileId) {
		const updatedProfiles = {
			...existingProfiles,
			[profileId]: {
				name: profileName,
			},
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
	userProfileBtn.addEventListener("click", (e) => setCurrentProfile(e));

	userProfile.classList.add("visible");
	return userProfile;
};
// wybór profilu
const setCurrentProfile = (e) => {
	const userData = getData();
	const profileData = e.target.dataset.id;

	setUserPreference("currentProfile", profileData, userData);

	window.location.href = "browse.html";
};
// koniec wyboru profilu

const createProfileAddBtn = (
	ariaInfo,
	info,
	userBtnAria,
	profilesBox,
	userBtnInfo,
	saveBtnAria,
	maxProfilesError,
	emptyFieldError,
	removeAria
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
			emptyFieldError,
			removeAria
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
	const nameToEdit = editBtn
		.closest(".main-profiles__profile")
		.querySelector(".main-profiles__name");

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
		[closestProfileId]: {
			...existingProfiles[closestProfileId],
			name: closestProfileName.value,
		},
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
export const showErrorPopup = (text, color) => {
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
	}, HIDE_POPUP_TIME);
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

	closestProfile.classList.add("hidden");

	setTimeout(() => {
		closestProfile.remove();
	}, 400);
};

export const createBrowsePage = ({
	header: {
		alt: { logo },
		aria: { logoLink },
	},
	browsePage: {
		names: { filmLink, seriesLink, myListLink, searchLink },
		aria: { userButton },
	},
}) => {
	const wrapper = createElement("div", ["wrapper"]);
	const header = createElement("header", ["browse-header"]);
	const logoMainLink = createElement("a", ["browse-header__logo"], {
		"aria-label": logoLink,
		href: "",
	});
	const logoMainImg = createElement("img", ["browse-header__logo-img"], {
		alt: logo,
		src: "./src/icons/logo.svg",
	});
	const mainTitle = createElement("span", ["browse-header__logo-text"]);

	mainTitle.textContent = "Stream";

	logoMainLink.append(logoMainImg, mainTitle);
	header.append(
		logoMainLink,
		createBrowserNav(filmLink, seriesLink, myListLink, searchLink),
		createUserBtn(userButton)
	);

	return header;
};

const createBrowserNav = (filmLink, seriesLink, myListLink, searchLink) => {
	const nav = createElement("nav", ["browse-header__nav"]);
	const navLinks = createElement("ul", ["browse-header__links"]);

	const linkNames = [
		{
			name: filmLink,
			src: "./src/icons/film-icon.svg",
		},
		{ name: seriesLink, src: "./src/icons/series-icon.svg" },
		{
			name: myListLink,
			src: "./src/icons/list-icon.svg",
		},
		{ name: searchLink, src: "./src/icons/search-icon.svg" },
	];

	linkNames.forEach((link) => {
		const listItem = createElement("li", ["browse-header__item"]);
		const linkEl = createElement("a", ["browse-header__link"], { href: "" });
		const icon = createElement("img", ["browse-header__link-icon"], {
			width: "24",
			height: "24",
			loading: "lazy",
			src: link.src,
			alt: "",
		});
		const text = createElement("span", ["browse-header__link-text"]);

		text.textContent = link.name;

		linkEl.append(icon, text);
		listItem.append(linkEl);

		navLinks.append(listItem);
	});

	nav.append(navLinks);

	return nav;
};

const createUserBtn = (userBtnAria) => {
	const userBox = createElement("div", ["browse-header__user-box"]);
	const userBtn = createElement("button", ["browse-header__user"], {
		"aria-label": userBtnAria,
	});
	const userIcon = createElement("img", ["browse-header__user-icon"], {
		width: "24",
		height: "24",
		loading: "lazy",
		src: "./src/icons/user-icon.svg",
		alt: "",
	});

	userBtn.append(userIcon);
	userBox.append(userBtn);

	return userBox;
};

export const createMainHeroSection = (movies, translations, parent) => {
	const browseMain = createElement("main", ["browse-main"]);
	const browseMainSection = createElement("section", [
		"browse-main__hero-section",
	]);
	const imagesCarousell = createElement("div", [
		"browse-main__image-carousell",
	]);
	const imagesInsideSlider = createElement("div", ["browse-main__images"]);
	movies.forEach(({ id, title, overview = "", backdrop_path }) => {
		const imgSrc = backdrop_path;
		const imageBox = createElement("div", ["browse-main__img-box"]);
		const image = createElement("img", ["browse-main__img"], {
			alt: `${translations?.browsePage?.carousellImages?.aria.carousellImageAlt} ${title}`,
			src: imgSrc
				? getImageUrl(imgSrc, "original")
				: "./dist/img/img-placeholder.svg",
		});
		const textBox = createElement("div", ["browse-main__text-box"]);
		const filmTitle = createElement("h2", ["browse-main__carousell-title"]);
		const filmInfo = createElement("p", ["browse-main__carousell-overview"]);

		filmTitle.textContent = title;
		filmInfo.textContent = overview;

		textBox.append(filmTitle, filmInfo, createActionButtons(id, translations));
		imageBox.append(image, textBox);
		imagesInsideSlider.append(imageBox);
		imagesCarousell.append(imagesInsideSlider);

		browseMainSection.append(imagesCarousell);
		browseMain.append(browseMainSection);

		parent.append(browseMain);
	});

	imagesCarousell.append(createCarousellControls(movies, translations));
};
const createActionButtons = (
	id,
	{
		browsePage: {
			actionBtns: { trailerBtnText, moreInfoBtnText },
		},
	}
) => {
	const actionBtnsPanel = createElement("div", ["browse-main__action-btns"]);
	const showTrailerBtn = createElement("button", ["browse-main__trailer-btn"], {
		"data-trailer": id,
	});
	const showTrailerText = createElement("span", ["browse-main__see-trailer"]);
	const seeMoreBtn = createElement("a", ["browse-main__see-more-btn"], {
		"data-movie": id,
		href: "",
	});

	showTrailerText.textContent = trailerBtnText;
	seeMoreBtn.textContent = moreInfoBtnText;

	showTrailerBtn.innerHTML = `<svg class="browse-main__trailer-play-icon"
	xmlns="http://www.w3.org/2000/svg" width="24" height="24"
	viewBox="0 0 24 24" fill="#000" stroke="#000" stroke-width="2"
	stroke-linecap="round" stroke-linejoin="round"
	class="feather feather-play">
	<polygon points="5 3 19 12 5 21 5 3"></polygon>
	</svg>`;

	showTrailerBtn.append(showTrailerText);

	actionBtnsPanel.append(showTrailerBtn, seeMoreBtn);

	return actionBtnsPanel;
};

const createCarousellControls = (
	movies,
	{
		browsePage: {
			carousellBtns: { aria },
		},
	}
) => {
	const carousellControls = createElement("div", [
		"browse-main__carousell-controls",
	]);

	movies.forEach((movie, index) => {
		const carousellBtn = createElement("button", ["browse-main__btn"], {
			"data-img": index,
			"aria-label": `${aria} ${index}`,
		});
		const carousellBtnProgressBar = createElement("span", [
			"browse-main__progress-bar",
		]);

		carousellBtn.append(carousellBtnProgressBar);

		carousellControls.append(carousellBtn);
	});
	return carousellControls;
};
