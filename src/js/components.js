import { createElement } from "./helpers.min.js";
import { setUserPreference } from "./updateStateFunctions.min.js";
const userData = JSON.parse?.(localStorage.getItem("userData"));

let profilesCount = userData?.profilesCount || 0;
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
		const userData = JSON.parse?.(localStorage.getItem("userData"));

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
}) => {
	const userData = JSON.parse?.(localStorage.getItem("userData"));

	const container = document.querySelector(".container");
	const profilesPageMain = createElement("main", ["main-profiles"]);
	const wrapper = createElement("div", ["wrapper"]);
	const profilesTitle = createElement("h1", [
		"main__title",
		"main-profiles__title",
	]);
	const profilesBox = createElement("div", ["main-profiles__box"]);

	profilesTitle.textContent = title;

	// if (!userData || !userProfilesArr || userProfilesArr.length === 0) {

	// }

	profilesBox.append(
		createProfileAddBtn(
			addProfileBtn,
			addProfileInfo,
			userProfileBtn,
			profilesBox,
			userBtnCustomize
		)
	);
	wrapper.append(profilesTitle, profilesBox);
	profilesPageMain.append(wrapper);

	container.append(profilesPageMain);
};

const createProfile = (ariaInfo, userBtnInfo) => {
	const userData = JSON.parse?.(localStorage.getItem("userData"));
	const existingProfiles = userData?.userProfiles || [];

	let profileData = {};
	let color;

	const colors = ["#dc4a34", "#062E63", "#FAC044"];

	if (profilesCount == 3 || existingProfiles.length === 3) return;

	profilesCount++;
	color = colors[profilesCount];

	const userProfile = createElement("div", ["main-profiles__profile"]);
	const userAvatarBox = createElement("div", ["main-profiles__avatar"]);
	const userProfileBtn = createElement("button", ["main-profiles__btn"], {
		"aria-label": ariaInfo,
		"data-id": `user-profile-${profilesCount}`,
	});

	const userProfileInfoBox = createElement("div", ["main-profiles__user-info"]);
	const userProfileInfo = createElement("input", ["main-profiles__name"], {
		type: "text",
		readonly: true,
		value: `${
			existingProfiles[0] || "Handsome User"
		} ${profilesCount}`,
	});
	const editUserInfoBtn = createElement(
		"button",
		["main-profiles__edit-name"],
		{ "aria-label": userBtnInfo }
	);
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
	userProfileInfoBox.append(userProfileInfo, editUserInfoBtn);
	userProfile.append(userAvatarBox, userProfileInfoBox);

	// setUserPreference("profilesCount", profilesCount, userData);

	const updatedProfiles = [...existingProfiles, profileData];

	setUserPreference("userProfiles", updatedProfiles, userData);

	return userProfile;
};

const createProfileAddBtn = (
	ariaInfo,
	info,
	userBtnAria,
	profilesBox,
	userBtnInfo
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
		const profile = createProfile(userBtnAria, userBtnInfo);

		if (profile) {
			profilesBox.append(profile);
		} else {
			alert("Osiągnięto maksymalną liczbę profilów!");
		}
	});

	return addProfileBox;
};
