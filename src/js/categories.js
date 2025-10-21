import {
	createBrowsePage,
	getData,
	showErrorPopup,
	createSpecifiedSectionPoster,
	showBigLoader,
	hideBigLoader,
	closeAllNotClicked,
} from "./components.min.js";
import { noPageFoundRedirection } from "./updateStateFunctions.min.js";

document.addEventListener("DOMContentLoaded", function () {
	const container = document.querySelector(".container");
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTYwZjM4MjU3NDQ1ZGE1ZGZkYTYxYzE0YWM4YmM4MyIsIm5iZiI6MTc1OTc2NTAzOC45NCwic3ViIjoiNjhlM2UyMmUyNjY5NzY4MzhlYzI3NzI5Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.nuGfEjclJLepmzzHi2omNhp29THgrJf9Nv6D4_gTdxA",
		},
	};

	const checkAuthorization = () => {
		const userData = getData();

		if (!userData) {
			showErrorPopup(`An unexpected error occured`, "#dc4a34");
			return;
		}

		const isLoggedIn = userData?.loggedIn;
		const translations = userData?.translations;
		const currentLanguage = userData?.preferredLanguage;
		const searchParams = new URLSearchParams(window.location.search);

		const param = searchParams.get("category");

		if (
			param !== "animated" &&
			param !== "horror" &&
			param !== "fantasy" &&
			param !== "comedy"
		) {
			noPageFoundRedirection();
		}

		if (!userData || !isLoggedIn) {
			window.location.href = "/";
		} else {
			container.append(createBrowsePage(translations));
			getFilmsByCategory(param, currentLanguage, translations);
		}
	};
	const getFilmsByCategory = async (param, currentLanguage, translations) => {
		const genre = specifyGenre(param);
		const FILMS_URL = `https://api.themoviedb.org/3/discover/movie?with_origin_country=US|GB&language=${currentLanguage}&sort_by=popularity.desc&with_genres=${genre}`;
		const TV_SERIES_URL = `https://api.themoviedb.org/3/discover/tv?with_origin_country=US|GB&language=${currentLanguage}&sort_by=popularity.desc&with_genres=${genre}`;

		const requests = [];
		const pagesNum = 4;

		container.append(showBigLoader());

		try {
			for (let i = 1; i <= pagesNum; i++) {
				requests.push(fetch(`${FILMS_URL}&page=${i}`, options));
				requests.push(fetch(`${TV_SERIES_URL}&page=${i}`, options));
			}

			const responses = await Promise.all(requests);
			const data = await Promise.all(responses.map((res) => res.json()));

			renderFilms(data, translations);
		} catch {
			showErrorPopup(`An unexpected error occured`, "#dc4a34");
			return;
		} finally {
			hideBigLoader();
		}
	};
	const renderFilms = (data, translations) => {
		const allFilms = data.map((film) => film.results);
		container.append(createSpecifiedSectionPoster(allFilms, translations));
	};
	const specifyGenre = (param) => {
		let genre;
		switch (param) {
			case "animated":
				genre = 16;
				break;
			case "horror":
				genre = 27;
				break;
			case "fantasy":
				genre = 14;
				break;
			case "comedy":
				genre = 35;
				break;
		}

		return genre;
	};
	window.addEventListener("click", (e) => {
		closeAllNotClicked(e);
	});
	checkAuthorization();
});
