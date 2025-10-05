import { getData } from "./components.min.js";
document.addEventListener("DOMContentLoaded", function () {
	const checkAuthorization = () => {
		const userData = getData();
		const isLoggedIn = userData?.loggedIn;

		if (!userData || !isLoggedIn) {
			window.location.href = "/";
		} else {
			console.log('ok');
		}
	};
	checkAuthorization();
});
