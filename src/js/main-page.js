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
} from "./components.min.js";
document.addEventListener("DOMContentLoaded", function () {
	const CAROUSELL_LENGTH = 5;
	const FILM_AMOUNT_PER_PAGE = 20;
	const PAGE_TO_SHOW_ON_SMALL_CAROUSELS = 1;
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

	const POPULAR_FILMS_URL = `https://api.themoviedb.org/3/movie/popular?with_origin_country=US|GB|CA&language=`;
	const HOT_RATED_FILMS_URL = `https://api.themoviedb.org/3/movie/upcoming?language=`;
	const TRENDING_FILMS_URL = `https://api.themoviedb.org/3/trending/all/week?language=`;
	const TOP_RATED_TV_SERIES_URL = `https://api.themoviedb.org/3/discover/tv?with_origin_country=US|GB&language=&sort_by=popularity.desc
`;
	const currentDate = new Date();
	const UPCOMING_FILMS = `https://api.themoviedb.org/3/discover/movie?primary_release_year=2025&primary_release_date.gte=${currentDate.getFullYear()}-${
		currentDate.getMonth() + 1
	}-${currentDate.getDate()}&sort_by=popularity.desc
`;

	const FILMS_PAGES_AMOUNT = `&page=`;

	const checkAuthorization = async () => {
		const userData = getData();
		const translations = userData?.translations;
		const currentLanguage = userData?.preferredLanguage;
		const isLoggedIn = userData?.loggedIn;
		const container = document.querySelector(".container");
		const currentProfile = userData?.currentProfile;
		const userProfiles = Object.keys(userData?.userProfiles);

		if (
			!userData ||
			!isLoggedIn ||
			!currentProfile ||
			userProfiles.length === 0
		) {
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
				HOT_RATED_FILMS_URL,
				TRENDING_FILMS_URL,
				TOP_RATED_TV_SERIES_URL,
				UPCOMING_FILMS
			);

			const main = document.querySelector("main");

			if (!main) {
				showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
			}

			main.append(
				createFilmSlider(
					films,
					translations,
					1,
					translations.browseSection.sectionNames.trending
				),
				createFilmSlider(
					films,
					translations,
					0,
					translations.browseSection.sectionNames.upcoming
				),
				createFilmSlider(
					films,
					translations,
					2,
					translations.browseSection.sectionNames.topRatedSeries
				),
				createFilmSlider(
					films,
					translations,
					3,
					translations.browseSection.sectionNames.futureFilms
				)
			);
			prepareCarouselItems(container);
			container.append(createFooter(translations));
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		} finally {
			hideBigLoader();
		}
	};

	const getAllFilms = async (lang, ...urls) => {
		const filmsArr = [];
		for await (const url of urls) {
			const URL =
				url + lang + FILMS_PAGES_AMOUNT + PAGE_TO_SHOW_ON_SMALL_CAROUSELS;
			const response = await fetch(URL, options);
			const data = await response.json();

			filmsArr.push(data);
		}

		return filmsArr;
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
		const HORIZONTAL_RANGE = 30;
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

	const changeCarousellDataIndex = (slider, index) => {
		slider.dataset.index = index;
	};

	const getCarouselConfig = () => {
		let maxIndex;

		if (window.innerWidth < 576) maxIndex = 9;
		if (window.innerWidth >= 576 && window.innerWidth < 992) maxIndex = 17;
		if (window.innerWidth >= 992 && window.innerWidth < 1200) maxIndex = 4;
		if (window.innerWidth >= 1200) maxIndex = 7;

		return maxIndex;
	};

	const setThreshold = () => {
		let threshold = 2;

		if (window.innerWidth > 576 && window.innerWidth < 992) threshold = 1;
		if (window.innerWidth >= 992 && window.innerWidth < 1200) threshold = 4;

		return threshold;
	};

	const moveSlider = (slider) => {
		const threshold = setThreshold();
		let sliderDataset = slider.dataset.index;
		const sliderCarousell = slider.querySelector(
			".browse-section__slider-images"
		);

		const poster = slider.querySelector(".browse-section__slider-box");
		if (!poster) return;

		const posterWidth = poster.offsetWidth;
		sliderCarousell.style.transform = `translateX(${
			-sliderDataset * posterWidth * threshold
		}px)`;
	};

	const showNextSlide = (slider, index) => {
		let initialIndex = index === 0 ? parseInt(slider.dataset.index) : 0;
		const maxIndex = getCarouselConfig();

		if (initialIndex >= maxIndex) return;

		initialIndex++;
		changeCarousellDataIndex(slider, initialIndex);
		moveSlider(slider);
	};

	const showPrevSlide = (slider, index) => {
		let initialIndex = index === 0 ? parseInt(slider.dataset.index) : 0;

		if (initialIndex <= 0) return;

		initialIndex--;
		changeCarousellDataIndex(slider, initialIndex);
		moveSlider(slider);
	};

	const prepareCarouselItems = (container) => {
		const sliders = container.querySelectorAll(".browse-section__slider");

		sliders.forEach((slider) =>
			slider.addEventListener("click", (e) => {
				let smallCarousellIndex = 0;

				if (e.target.matches(".browse-section__slider-next-btn")) {
					showNextSlide(slider, smallCarousellIndex);
				} else if (e.target.matches(".browse-section__slider-prev-btn")) {
					showPrevSlide(slider, smallCarousellIndex);
				}
			})
		);
	};

	let lastWidth = window.innerWidth;
	window.addEventListener("resize", () => {
		if (window.innerWidth === lastWidth) return;
		lastWidth = window.innerWidth;

		const allSliders = document.querySelectorAll(".browse-section__slider");
		allSliders.forEach((slider) => {
			const sliderCarousell = slider.querySelector(
				".browse-section__slider-images"
			);
			changeCarousellDataIndex(slider, 0);
			sliderCarousell.style.transform = "translateX(0)";
		});
	});
	window.addEventListener("unload", () => {
		clearInterval(carousellInterval);
		progressBarIntervals.forEach((interval) => clearInterval(interval));
		progressBarIntervals.clear();
	});
	window.addEventListener("click", (e) => {
		closeAllNotClicked(e);
	});
	checkAuthorization();
});
