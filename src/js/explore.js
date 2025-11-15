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
			container.append(createBrowsePage(translations));
			await getFilmData(container);

			container.append(showBigLoader());
			container.append(createFooter(translations));
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		} finally {
			hideBigLoader();
		}
	};
	const getFilmData = async (container) => {
		const params = new URLSearchParams(window.location.search);
		const filmID = params.get("id");

		const movieURL = `https://api.themoviedb.org/3/movie/${filmID}`;
		const tvURL = `https://api.themoviedb.org/3/tv/${filmID}`;

		const movieRes = await fetch(movieURL, options);

		if (movieRes.ok) {
			const data = await movieRes.json();
			container.append(createExploreHeroSection(data));
			return;
		}

		const tvRes = await fetch(tvURL, options);

		if (tvRes.ok) {
			const data = await tvRes.json();
			container.append(createExploreHeroSection(data));
			return;
		}

		showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
	};

	checkAuthorization();
	window.addEventListener("click", (e) => {
		closeAllNotClicked(e);
	});
});
