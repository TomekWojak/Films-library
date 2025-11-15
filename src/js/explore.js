import {
	getData,
	createBrowsePage,
	createMainHeroSection,
	showErrorPopup,
	showBigLoader,
	hideBigLoader,
	createFilmSlider,
	createFooter,
	closeAllNotClicked,
	createFourCategories,
	createExploreHeroSection,
} from "./components.min.js";

document.addEventListener("DOMContentLoaded", function () {
	const checkAuthorization = () => {
		const userData = getData();
		const translations = userData?.translations;
		const currentLanguage = userData?.preferredLanguage;
		const isLoggedIn = userData?.loggedIn;
		const container = document.querySelector(".container");
		const currentProfile = userData?.currentProfile;

		if (!userData || !isLoggedIn || !currentProfile) {
			window.location.href = "/";
			return;
		}

		try {
			container.append(createBrowsePage(translations));
			container.append(createExploreHeroSection());

			container.append(showBigLoader());
			container.append(createFooter(translations));
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		} finally {
			hideBigLoader();
		}
	};
	const getFilmData = async () => {
		const params = new URLSearchParams(window.location.search);
		const filmID = params.get("id");

        const movieURL = 'https://api.themoviedb.org/3/movie/'
        const tvURL = 
		
        try {
            const response = await fetch()
        }
	};
	getFilmData();
	checkAuthorization();
	window.addEventListener("click", (e) => {
		closeAllNotClicked(e);
	});
});
