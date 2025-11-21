import {
	getData,
	createBrowsePage,
	showErrorPopup,
	showBigLoader,
	hideBigLoader,
	createFooter,
	closeAllNotClicked,
	createSpecifiedSectionPoster,
	createSearchEngine,
	createFilteredFilmsSection,
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

	const postersAmount = 3;
	const filmsURL = `https://api.themoviedb.org/3/discover/movie?language=`;
	const seriesURL = `https://api.themoviedb.org/3/discover/tv?language=`;
	const category = window.location.href;

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

			const section = await getFilmsOrSeries(
				currentLanguage,
				translations,
				container
			);

			container.append(section);

			container.append(createFooter(translations));
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		} finally {
			hideBigLoader();
		}
	};

	const getFilmsOrSeries = async (currentLanguage, translations, container) => {
		if (category.includes("movies.html")) {
			const films = await renderFilms(currentLanguage);
			return createSpecifiedSectionPoster(films, translations);
		}
		if (category.includes("series.html")) {
			const series = await renderSeries(currentLanguage);
			return createSpecifiedSectionPoster(series, translations);
		}
		if (category.includes("my-list.html")) {
			// wyrenderuj listę
			return;
		}
		if (category.includes("search.html")) {
			const films = await renderFilms(currentLanguage, 1);
			container.append(createSearchEngine(translations));

			handleSearchEngine(currentLanguage, translations);

			return createSpecifiedSectionPoster(films, translations);
		}

		window.location.href = "404.html";
	};

	const renderFilms = async (currentLanguage, customAmount) => {
		const filmsArr = [];
		const choosenFilms = [];

		for (let i = 0; i < (customAmount || postersAmount); i++) {
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

	const handleSearchEngine = (currentLanguage, translations) => {
		const searchEngine = document.querySelector(".search-engine__input");

		searchEngine?.addEventListener("keyup", async (e) => {
			const value = e.target.value;

			if (value.trim() === "") {
				const films = await renderFilms(currentLanguage, 1);
				createFilteredFilmsSection(films[0], translations);
			} else {
				findFilmsByKeyword(value, currentLanguage, translations);
			}
		});
	};

	const findFilmsByKeyword = async (
		inputValue,
		currentLanguage,
		translations
	) => {
		const searchFilmURL = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
			inputValue
		)}&language=${currentLanguage}`;
		const response = await fetch(searchFilmURL, options);
		const data = await response.json();
		const filteredFilms = data.results.filter(
			(film) =>
				film.media_type !== "person" &&
				film.poster_path &&
				film.popularity >= 5.0
		);
		createFilteredFilmsSection(filteredFilms, translations);
	};

	checkAuthorization();
	window.addEventListener("click", (e) => {
		closeAllNotClicked(e);
	});
});
