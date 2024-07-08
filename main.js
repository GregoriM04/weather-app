const body = document.querySelector("body");
const modeToggle = document.getElementById("slider");

/* Dark mode settings */
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

// Main functionality
const container = document.getElementById("container");
const searchBox = document.getElementById("search-box");
const userInput = document.getElementById("user-input");
const submitButton = document.getElementById("submit-btn");
const errorFound = document.getElementById("errorStatus");
const weatherBox = document.getElementById("weather-box");
const weatherImage = document.getElementById("weather-img");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const details = document.getElementById("details");
const humidity = document.querySelector(".humidity .info p");
const windSpeed = document.querySelector(".wind-speed .info p");
const notFound = document.getElementById("not-found");
const notValid = document.getElementById("not-valid");

function mainProcess() {
  // check if the input has a valid value
  if (userInput.value === "" || userInput.value === " ") {
    userInput.classList.add("shake");
    userInput.classList.add("error");
    container.style.height = "105px";
    notValid.style.display = "block";
    setTimeout(() => {
      userInput.classList.remove("shake");
      userInput.classList.remove("error");
      userInput.placeholder = "Ex. France";
      notValid.style.display = "none";
      userInput.value = "";
    }, 2100);
  } else {
    let city = userInput.value;
    (async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f9ab410e8c21da04ab0df82a437adb82`
        );

        // not-found case
        if (response.status == 404) {
          notFound.style.display = "flex";
          notFound.classList.add("fadeIn");
          container.style.justifyContent = "space-around";
          container.style.height = "405px";

          // success case
        } else if (response.status == 200) {
          const data = await response.json();

          switch (data.weather[0].main) {
            case "Clear":
              weatherImage.src = "./assets/images/sunny.png";
              break;

            case "Rain":
              weatherImage.src = "./assets/images/rainy.png";
              break;

            case "Snow":
              weatherImage.src = "./assets/images/snowy.png";
              break;

            case "Clouds":
              weatherImage.src = "./assets/images/cloudy.png";
              break;

            case "Haze":
              weatherImage.src = "./assets/images/windy.png";
              break;

            default:
              weatherImage.src = "";
          }

          // print all data fetched
          temperature.innerHTML = `${parseInt(data.main.temp)}<span>°C</span>`;
          description.innerHTML = `${data.weather[0].description}`;
          humidity.innerHTML = `${data.main.humidity}%`;
          windSpeed.innerHTML = `${parseInt(data.wind.speed)}Km/h`;

          container.style.justifyContent = "space-between";
          container.style.height = "605px";
          weatherBox.style.display = "flex";
          weatherBox.classList.add("fadeIn");

          details.style.display = "flex";
        }
      } catch (error) {
        // error found case
        errorFound.style.display = "flex";
        errorFound.classList.add("fadeIn");
        container.style.justifyContent = "space-around";
        container.style.height = "405px";
      }
    })();
  }
}

submitButton.addEventListener("click", () => {
  resetState();
  mainProcess();
});

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    resetState();
    mainProcess();
  }
});

userInput.addEventListener("keydown", () => {
  spaceChecker();
});

function resetState() {
  userInput.value === "";
  container.style.justifyContent = "center";
  errorFound.style.display = "none";
  weatherBox.style.display = "none";
  details.style.display = "none";
  notFound.style.display = "none";
}

function spaceChecker() {
  if (userInput.value === "  ") {
    userInput.value = "";
    resetState();
    mainProcess();
  }
}
