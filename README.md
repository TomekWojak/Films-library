<h1 align="center">Movie Browser App — Overview </h1>

<p align="center">
  <a href="https://tomekwojak.github.io/Films-library/">See Demo Page</a>
</p>

<br>

**Username:** handsomeuser404@test.com

**Password:** 123456789

For educational purposes only, the TMDb API key and Firebase configuration used in this project are hardcoded. They should not be used in production or shared publicly, as this poses a security risk.

## Table of Contents

- [Instalation](#Instalation)
- [Project functionality](#Authentication)
  - [Authentication](#Authentication)
  - [Language Selection](#Language-Selection)
  - [Profile Management](#Profile-Management)
  - [Save User Preferences](#User-Preferences-and-State-Management)
  - [Navigation and Routing](#Navigation-and-Routing)
- [Gallery](#Small-gallery-section)

## Description:

The project is **unfinished**.
It will include in the future:
Separate filtering for movies and TV series,
View trailers for specific movies/TV series,
Add movies/TV series to the list,
Mini user panel
<br>
This project simulates a streaming platform interface with:
<br>
<br>

## Authentication

- **Login process simulation** – mimics real authentication flow.

- **Form validation** – checks if fields are filled correctly.

- **Fake database lookup** – simulates checking whether a user exists in a database.

- **Redirection** – users who are not logged in are automatically redirected to the login form page.
  <br>
  <br>

## Language Selection

- **Determining language based on user browser data**- After entering the website, the language in the browser is checked and automatically set

- **Dynamic language switching** – users can select a preferred language.

- **Instant UI translation** – interface text updates automatically after choosing a new language.

- **Language persistence** – the selected language is stored in user preferences.
  <br>
  <br>

## Profile Management

- **Create profiles** – users can create multiple profiles (just like Netflix).

- **Edit profile names** – profile titles can be updated directly in the UI.

- **Delete profiles** – users can remove unwanted profiles.

- **Active profile tracking** – the system remembers which profile is currently selected.
  <br>
  <br>

## User Preferences and State Management

- **Persistent storage** – saves user data (language, profiles, active profile, login status).

- **Session continuity** – preferences are automatically loaded on page refresh.

- **Personalized experience** – UI and data adapt based on the active profile and stored preferences.
  <br>
  <br>

## Navigation and Routing

- **Automatic redirects** – ensures users always end up on the correct page depending on login state.

- **Logged-in users** → redirected to browse page.

- **Not logged-in users** → redirected to login form.
  <br>
  <br>

## Instalation
### Requirements:
- Installed Node.js
- Installed gitBash

1. Clone the repository

    ```
    git clone https://github.com/TomekWojak/Films-library.git
    ```

2. Change path to the project directory:

    ```
    cd Films-library
    ```


3. Install the dependencies:

    ```
    npm install
    ```

4. Start the server:

    ```
    npx gulp
    ```


<br>
<br>

## Small gallery section

![loginPage](https://i.imgur.com/JZtTU4h.png)
![profilesPage](https://i.imgur.com/6oWTj2B.png)
![mainPage](https://i.imgur.com/fZNnuXu.png)
