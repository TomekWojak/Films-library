import { getData, createBrowsePage } from "./components.min.js";
document.addEventListener("DOMContentLoaded", function () {
	// https://api.themoviedb.org/3/discover/movie?language=pl
	const CAROUSELL_LENGTH = 5;
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

		if (!userData || !isLoggedIn) {
			window.location.href = "/";
		} else {
			const container = document.querySelector(".container");

			container.prepend(createBrowsePage(translations));
		}
	};
	checkAuthorization();

	const getImagesToCarousell = async (lang, pageNum) => {
		const URL = `https://api.themoviedb.org/3/movie/popular?language=${lang}&page=${pageNum}`;

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

		for (let i = 1; i <= pages; i++) {
			requests.push(getImagesToCarousell(lang, pageNum));
		}

		const responses = Promise.all(requests);
		console.log(responses);
	};
});
