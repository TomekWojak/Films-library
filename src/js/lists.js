import {
	getData,
	createBrowsePage,
	showErrorPopup,
	showBigLoader,
	hideBigLoader,
	createFooter,
	closeAllNotClicked,
	createExploreHeroSection,
	createSpecifiedSectionPoster,
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

	const postersAmount = 2;
	const filmsURL = `https://api.themoviedb.org/3/discover/movie?language=`;
	const seriesURL = `https://api.themoviedb.org/3/discover/tv?language=`;

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

			const section = await getFilmsOrSeries(currentLanguage, translations);

			container.append(section);

			container.append(createFooter(translations));
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		} finally {
			hideBigLoader();
		}
	};

	const getFilmsOrSeries = async (currentLanguage, translations) => {
		const category = window.location.href;

		if (category.includes("movies.html")) {
			// wyrenderuj filmy
			const films = await renderFilms(currentLanguage);
			return createSpecifiedSectionPoster(films, translations);
		}
		if (category.includes("series.html")) {
			// wyrenderuj seriale
			const series = await renderSeries(currentLanguage);
			return createSpecifiedSectionPoster(series, translations);
			return;
		}
		if (category.includes("my-list.html")) {
			// wyrenderuj moja lista{
			return;
		}
		if (category.includes("search.html")) {
			// wyrenderuj search
			return;
		}

		window.location.href = "404.html";
	};

	const renderFilms = async (currentLanguage) => {
		const filmsArr = [];
		const choosenFilms = [];

		for (let i = 0; i < postersAmount; i++) {
			const response = await fetch(
				`${filmsURL}${currentLanguage || "en-US"}&page=${i + 1}`,
				options
			);
			const filmData = await response.json();
			choosenFilms.push(...filmData.results);
		}
		filmsArr.push(choosenFilms);

		return filmsArr;
	};
	const renderSeries = async (currentLanguage) => {
		const seriesArr = [null];
		const choosenSeries = [];
		for (let i = 0; i < postersAmount; i++) {
			const response = await fetch(
				`${seriesURL}${currentLanguage || "en-US"}&page=${i + 1}`,
				options
			);
			const seriesData = await response.json();
			choosenSeries.push(...seriesData.results);
		}

		seriesArr.push(choosenSeries);

		return seriesArr;
	};

	checkAuthorization();
	window.addEventListener("click", (e) => {
		closeAllNotClicked(e);
	});
});
