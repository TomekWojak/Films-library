import { getData, createBrowsePage } from "./components.min.js";
document.addEventListener("DOMContentLoaded", function () {
	// https://api.themoviedb.org/3/discover/movie?language=pl
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
		const isLoggedIn = userData?.loggedIn;

		if (!userData || !isLoggedIn) {
			window.location.href = "/";
		} else {
			const container = document.querySelector(".container");
		}
	};
	checkAuthorization();
});
