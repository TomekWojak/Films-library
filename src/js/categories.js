import { createBrowsePage, getData, showErrorPopup } from "./components.min.js";
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
		}
	};
	const renderFilms = () => {};
	const getFilmsByCategory = () => {
		const URL = `https://api.themoviedb.org/3/discover/movie?language=${currentLanguage}&page=1&sort_by=popularity.desc&with_genres=16`;
	};
	checkAuthorization();
});
