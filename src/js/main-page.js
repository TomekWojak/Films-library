import {
	getData,
	createBrowsePage,
	createMainHeroSection,
	showErrorPopup,
	showBigLoader,
	hideBigLoader,
} from "./components.min.js";
document.addEventListener("DOMContentLoaded", function () {
	// https://api.themoviedb.org/3/discover/movie?language=pl
	const CAROUSELL_LENGTH = 5;
	const FILM_AMOUNT_PER_PAGE = 20;
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
		const translations = userData?.translations;
		const currentLanguage = userData?.preferredLanguage;
		const isLoggedIn = userData?.loggedIn;

		const container = document.querySelector(".container");

		if (!userData || !isLoggedIn) {
			window.location.href = "/";
		} else {
			container.prepend(createBrowsePage(translations));
			container.append(showBigLoader());

			chooseFilmsToCarousell(loadFilmsToCarousell, currentLanguage).then(
				(movies) => {
					createMainHeroSection(movies, translations, container);
					handleFilmsCarousell(container, movies);
					setInterval(() => {
						handleFilmsCarousell(container, movies);
					}, carousellSpeed);
				}
			);
		}
	};

	const getPopularFilms = async (lang, pageNum) => {
		const URL = `https://api.themoviedb.org/3/movie/popular?language=${lang}&page=${pageNum}`;

		try {
			const response = await fetch(URL, options);
			const data = await response.json();

			return data;
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		}
	};
	const loadFilmsToCarousell = async (lang, pageNum) => {
		const requests = [];

		for (let i = 1; i <= pageNum; i++) {
			requests.push(getPopularFilms(lang, i));
		}

		try {
			const responses = await Promise.all(requests);
			return responses;
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		}
	};

	const chooseFilmsToCarousell = async (data, currentLanguage) => {
		try {
			const pagesData = await data(currentLanguage, CAROUSELL_LENGTH);
			const randomNumber = Math.trunc(Math.random() * FILM_AMOUNT_PER_PAGE);
			const choosenMovies = pagesData.map((page) => page.results[randomNumber]);

			return choosenMovies;
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		} finally {
			hideBigLoader();
		}
	};

	// CAROUSELL
	let carousellSpeed = 5000;
	let carousellWidth = 100;
	let index = 0;
	const handleFilmsCarousell = (container, movies) => {
		const imageSlider = container.querySelector(".browse-main__images");
		const allImages = imageSlider.querySelectorAll(".browse-main__img-box");
		const carousellControls = container.querySelector(
			".browse-main__carousell-controls"
		);
		// Obsługa ostatniego i pierwszego filmu
		allImages[allImages.length - 1].classList.remove("currentVisible");
		allImages[index - 1]?.classList.remove("currentVisible");

		imageSlider.style.transform = `translateX(${-index * carousellWidth}%)`;
		handleCarousellControlsState(index, carousellControls);

		allImages[index].classList.add("currentVisible");

		index++;

		if (index > movies.length - 1) index = 0;
	};

	const handleCarousellControlsState = (index, carousellControlsBox) => {
		const allControlBtns =
			carousellControlsBox.querySelectorAll(".browse-main__btn");
		const currentBtn = carousellControlsBox.querySelector(
			`.browse-main__btn[data-img="${index}"]`
		);
		const progressBar = currentBtn.querySelector(".browse-main__progress-bar");

		changeProgressBar(progressBar);

		allControlBtns.forEach((btn) => btn.classList.remove("active"));
		currentBtn.classList.add("active");
	};

	const changeProgressBar = (progressBar) => {
		let width = 0;
		const interval = setInterval(() => {
			width += 5;
			progressBar.style.width = `${width}%`;
			if (width >= 100) {
				progressBar.style.width = "0";
				clearInterval(interval);
			}
		}, 250);
	};
	checkAuthorization();
});
