import {
	getData,
	createBrowsePage,
	showErrorPopup,
	showBigLoader,
	hideBigLoader,
	createFooter,
	closeAllNotClicked,
	createExploreHeroSection,
	createTrailerWindow,
	hideTrailerWindow,
} from "./components.min.js";

document.addEventListener("DOMContentLoaded", function () {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTYwZjM4MjU3NDQ1ZGE1ZGZkYTYxYzE0YWM4YmM4MyIsIm5iZiI6MTc1OTc2NTAzOC45NCwic3ViIjoiNjhlM2UyMmUyNjY5NzY4MzhlYzI3NzI5Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.nuGfEjclJLepmzzHi2omNhp29THgrJf9Nv6D4_gTdxA",
		},
	};
	const checkAuthorization = async () => {
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
			container.append(showBigLoader());

			container.append(createBrowsePage(translations));
			await getFilmData(container, translations, currentLanguage);

			container.append(createFooter(translations));
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		} finally {
			hideBigLoader();
		}
	};
	const getFilmData = async (container, translations, currentLanguage) => {
		const params = new URLSearchParams(window.location.search);
		const filmID = params.get("id");
		const type = params.get("type") || "movie";
		const URL = `https://api.themoviedb.org/3/${type}/${filmID}?language=${
			currentLanguage || "en-US"
		}`;

		const response = await fetch(URL, options);

		if (response.ok) {
			const data = await response.json();
			container.append(createExploreHeroSection(data, translations));
			return;
		}

		showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
	};

	checkAuthorization();
	window.addEventListener("click", (e) => {
		closeAllNotClicked(e);
	});
	document.body.addEventListener("click", (e) => {
		const windowExists = document.querySelector(".trailer-window");

		if (
			e.target.matches(".browse-main__trailer-btn") ||
			e.target.matches(".explore__film-show-trailer-btn")
		) {
			createTrailerWindow(e);
		} else if (
			windowExists &&
			(e.target.matches(".close-trailer-window") ||
				e.target.matches(".overlay"))
		) {
			hideTrailerWindow();
		}
	});
});
