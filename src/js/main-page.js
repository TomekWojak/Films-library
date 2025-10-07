import { getData, createBrowsePage } from "./components.min.js";
document.addEventListener("DOMContentLoaded", function () {
	// https://api.themoviedb.org/3/discover/movie?language=pl
	const CAROUSELL_LENGTH = 5;
	const FILM_AMOUNT_PER_PAGE = 20;
	const API_KEY = "3560f38257445da5dfda61c14ac8bc83";
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTYwZjM4MjU3NDQ1ZGE1ZGZkYTYxYzE0YWM4YmM4MyIsIm5iZiI6MTc1OTc2NTAzOC45NCwic3ViIjoiNjhlM2UyMmUyNjY5NzY4MzhlYzI3NzI5Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.nuGfEjclJLepmzzHi2omNhp29THgrJf9Nv6D4_gTdxA",
		},
	};
	// const getFilmsData = async () => {
	// 	const response = await fetch(
	// 		'',
	// 		options
	// 	);
	// 	const data = await response.json();
	// 	console.log(data);
	// };
	// getFilmsData();
	const checkAuthorization = () => {
		const userData = getData();
		const translations = userData?.translations;
		const currentLanguage = userData?.preferredLanguage;
		const isLoggedIn = userData?.loggedIn;

		const container = document.querySelector(".container");

		if (!userData || !isLoggedIn) {
			window.location.href = "/";
		} else {
			container.prepend(createBrowsePage(translations));

			chooseImagesToCarousell(loadImagesToCarousell, currentLanguage);
		}
	};

	const getImagesToCarousell = async (lang, pageNum) => {
		const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${lang}&page=${pageNum}`;

		try {
			const response = await fetch(URL);
			const data = await response.json();

			return data;
		} catch (err) {
			console.log(err);
		}
	};
	const loadImagesToCarousell = async (lang, pageNum) => {
		const requests = [];

		for (let i = 1; i <= pageNum; i++) {
			requests.push(getImagesToCarousell(lang, i));
		}

		const responses = await Promise.all(requests);
		return responses;
	};

	const chooseImagesToCarousell = (data, currentLanguage) => {
		const pagesData = data(currentLanguage, 5).then((pages) => {
			const randomNumber = Math.trunc(Math.random() * FILM_AMOUNT_PER_PAGE);
			const choosenMovies = pages.map((page) => {
				return page.results[randomNumber];
			});
			console.log(choosenMovies);
		});
	};

	checkAuthorization();
});
