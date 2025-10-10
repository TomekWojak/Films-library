import {
	getData,
	createBrowsePage,
	createMainHeroSection,
	showErrorPopup,
	showBigLoader,
	hideBigLoader,
	createFilmSlider,
} from "./components.min.js";
document.addEventListener("DOMContentLoaded", function () {
	// https://api.themoviedb.org/3/discover/movie?language=pl
	const CAROUSELL_LENGTH = 5;
	const FILM_AMOUNT_PER_PAGE = 20;
	const DOWNLOADED_PAGE = 1;
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTYwZjM4MjU3NDQ1ZGE1ZGZkYTYxYzE0YWM4YmM4MyIsIm5iZiI6MTc1OTc2NTAzOC45NCwic3ViIjoiNjhlM2UyMmUyNjY5NzY4MzhlYzI3NzI5Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.nuGfEjclJLepmzzHi2omNhp29THgrJf9Nv6D4_gTdxA",
		},
	};
	const progressBarIntervals = new Map();
	let carousellSpeed = 10000;
	let carousellStrokeRange = 2;
	let intervalSpeed = (carousellSpeed * carousellStrokeRange) / 100;
	let carousellWidth = 100;
	let index = 0;
	let carousellInterval;

	const POPULAR_FILMS_URL = `https://api.themoviedb.org/3/movie/popular?language=`;
	const UPCOMING_FILMS_URL = `https://api.themoviedb.org/3/movie/upcoming?language=`;
	const FILMS_PAGES_AMOUNT = `&page=`;

	const checkAuthorization = async () => {
		const userData = getData();
		const translations = userData?.translations;
		const currentLanguage = userData?.preferredLanguage;
		const isLoggedIn = userData?.loggedIn;

		const container = document.querySelector(".container");

		if (!userData || !isLoggedIn) {
			window.location.href = "/";
			return;
		}

		container.prepend(createBrowsePage(translations));
		container.append(showBigLoader());

		try {
			const movies = await chooseFilmsToCarousell(
				loadFilmsToCarousell,
				currentLanguage
			);

			createMainHeroSection(movies, translations, container);
			handleFilmsCarousell(container, movies);

			carousellInterval = setInterval(
				() => handleFilmsCarousell(container, movies),
				carousellSpeed
			);

			changeCurrentImg(movies, container);
			setTouchEventListener(container, movies);

			const films = await getAllFilms(
				currentLanguage,
				DOWNLOADED_PAGE,
				UPCOMING_FILMS_URL
			);

			const main = document.querySelector("main");
			if (!main) {
				container.append(
					createFilmSlider(
						films,
						translations,
						0,
						translations.browseSection.sectionNames.upcoming
					)
				);
			}
			main.append(
				createFilmSlider(
					films,
					translations,
					0,
					translations.browseSection.sectionNames.upcoming
				)
			);
			prepareCarouselItems(container);
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		} finally {
			hideBigLoader();
		}
	};

	const getAllFilms = async (lang, pageNum, ...urls) => {
		const responses = [];
		for await (const url of urls) {
			const URL = url + lang + FILMS_PAGES_AMOUNT + pageNum;
			const response = await fetch(URL, options);
			const data = await response.json();

			responses.push(data);
		}
		return responses;
	};

	const getFilms = async (lang, pageNum, url) => {
		const URL = url + lang + FILMS_PAGES_AMOUNT + pageNum;

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
			requests.push(getFilms(lang, i, POPULAR_FILMS_URL));
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

	const handleFilmsCarousell = (container, movies) => {
		const imageSlider = container.querySelector(".browse-main__images");
		const allImages = imageSlider.querySelectorAll(".browse-main__img-box");
		const carousellControls = container.querySelector(
			".browse-main__carousell-controls"
		);
		allImages.forEach((img) => img.classList.remove("currentVisible"));

		imageSlider.style.transform = `translateX(${-index * carousellWidth}%)`;
		handleCarousellControlsState(index, carousellControls);
		allImages[index].classList.add("currentVisible");

		index++;

		if (index > movies.length - 1) index = 0;

		handleBtnsVisibility(container);
	};

	const handleCarousellControlsState = (index, carousellControlsBox) => {
		const allControlBtns =
			carousellControlsBox.querySelectorAll(".browse-main__btn");
		const currentBtn = carousellControlsBox.querySelector(
			`.browse-main__btn[data-img="${index}"]`
		);
		const progressBar = currentBtn.querySelector(".browse-main__progress-bar");
		const allProgressBars = carousellControlsBox.querySelectorAll(
			".browse-main__progress-bar"
		);

		progressBarIntervals.forEach((interval) => clearInterval(interval));
		progressBarIntervals.clear();

		allProgressBars.forEach((bar) => (bar.style.width = "0"));

		changeProgressBar(progressBar, index);

		allControlBtns.forEach((btn) => btn.classList.remove("active"));
		currentBtn.classList.add("active");
	};

	const changeProgressBar = (progressBar, btnIndex) => {
		if (progressBarIntervals.has(btnIndex)) {
			clearInterval(progressBarIntervals.get(btnIndex));
		}

		let width = 0;
		const progressBarInterval = setInterval(() => {
			width += carousellStrokeRange;
			progressBar.style.width = `${width}%`;
			if (width >= 100) {
				progressBar.style.width = "0";
				clearInterval(progressBarInterval);

				progressBarIntervals.delete(btnIndex);
			}
		}, intervalSpeed);

		progressBarIntervals.set(btnIndex, progressBarInterval);
	};

	const changeCurrentImg = (movies, container) => {
		const carousellControls = container.querySelector(
			".browse-main__carousell-controls"
		);

		carousellControls.addEventListener("click", (e) => {
			if (e.target.matches(".browse-main__btn")) {
				if (e.target.classList.contains("active")) return;

				clearInterval(carousellInterval);

				const currentBtn = e.target;
				const imgData = parseInt(currentBtn.dataset.img);

				index = imgData;
				handleFilmsCarousell(container, movies);

				carousellInterval = setInterval(() => {
					handleFilmsCarousell(container, movies);
				}, carousellSpeed);
			}
		});
	};

	const handleBtnsVisibility = (container) => {
		const allFilms = container.querySelectorAll(".browse-main__img-box");

		allFilms.forEach((film) => {
			const isActive = film.classList.contains("currentVisible");
			const tabindex = isActive ? 0 : -1;
			const visibility = tabindex === 0 ? "visible" : "hidden";
			giveBtnsAttribute(film, tabindex, visibility);
		});
	};
	const giveBtnsAttribute = (film, tabindex, visibility) => {
		const trailerBtn = film.querySelector(".browse-main__trailer-btn");
		const seeMoreBtn = film.querySelector(".browse-main__see-more-btn");

		trailerBtn.setAttribute("tabindex", tabindex);
		seeMoreBtn.setAttribute("tabindex", tabindex);
		trailerBtn.style.visibility = visibility;
		seeMoreBtn.style.visibility = visibility;
	};

	let startX;
	let endX;
	let startY;
	let endY;

	const handleTouchStartEvent = (e) => {
		startX = e.touches[0].clientX;
		startY = e.touches[0].clientY;
	};

	const handleTouchEndEvent = (e, container, movies) => {
		endX = e.changedTouches[0].clientX;
		endY = e.changedTouches[0].clientY;
		handleSwipe(container, movies);
	};

	const handleSwipe = (container, movies) => {
		const HORIZONTAL_RANGE = 50;
		const VERTICAL_RANGE = 30;

		const horizontalDistance = Math.abs(startX - endX);
		const verticalDistance = Math.abs(startY - endY);

		if (
			horizontalDistance < HORIZONTAL_RANGE ||
			verticalDistance > VERTICAL_RANGE
		) {
			return;
		}
		if (endX - startX > HORIZONTAL_RANGE) {
			index = (index - 2 + movies.length) % movies.length;
			handleFilmsCarousell(container, movies);
		} else if (startX - endX > HORIZONTAL_RANGE) {
			handleFilmsCarousell(container, movies);
		}

		clearInterval(carousellInterval);
		carousellInterval = setInterval(() => {
			handleFilmsCarousell(container, movies);
		}, carousellSpeed);
	};

	const setTouchEventListener = (container, movies) => {
		const imageSlider = container.querySelector(".browse-main__images");

		imageSlider.addEventListener("touchstart", (e) => {
			handleTouchStartEvent(e);
		});

		imageSlider.addEventListener("touchend", (e) => {
			handleTouchEndEvent(e, container, movies);
		});
	};

	let smallCarousellIndex = 0;
	const prepareCarouselItems = (container) => {
		const slider = container.querySelector(".browse-section__slider-images");
		const showNextSlideBtn = container.querySelector(
			".browse-section__slider-next-btn"
		);
		const showPrevSlideBtn = container.querySelector(
			".browse-section__slider-prev-btn"
		);
		const allPosters = container.querySelectorAll(
			".browse-section__slider-box"
		);

		showNextSlideBtn.addEventListener("click", () => {
			showNextSlide(slider, showPrevSlideBtn);
		});
		showPrevSlideBtn.addEventListener("click", (e) => {
			showPrevSlide(e, slider);
		});
	};
	const getMaxIndex = () => {
		const width = window.innerWidth;
		if (width < 1200) return 16;
		if (width < 992) return 6;
		if (width < 576) return 9;

		return 10;
	};
	const showNextSlide = (slider, prevBtn) => {
		const maxIndex = getMaxIndex();

		let smallCarousellThreshold = window.innerWidth < 992 ? 100 : 25;

		if (smallCarousellIndex >= maxIndex) return;

		smallCarousellIndex++;

		if (smallCarousellIndex > 0) {
			prevBtn.removeAttribute("disabled");
		} else {
			prevBtn.setAttribute("disabled", true);
		}

		slider.style.transform = `translateX(${
			-smallCarousellIndex * smallCarousellThreshold
		}%)`;
	};
	const showPrevSlide = (e, slider) => {
		let smallCarousellThreshold = window.innerWidth < 992 ? 100 : 25;

		if (smallCarousellIndex <= 0) {
			return;
		} else if (smallCarousellIndex === 1) {
			e.target.setAttribute("disabled", true);
		}
		smallCarousellIndex--;

		slider.style.transform = `translateX(${
			-smallCarousellIndex * smallCarousellThreshold
		}%)`;
	};
	checkAuthorization();
});
