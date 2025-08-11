const timezone = document.querySelector("#timezone");
const icon = document.querySelector("#icon");
const degree = document.querySelector("#degree");
const tempDesc = document.querySelector("#temp-description");

let currentTempUnit = loadFromLocalstorage();
let currentTempCelsius = null;

//========== Localstorage ==========
function saveToLocalstorage(unit) {
  localStorage.setItem("currentTempUnit", unit);
}

function loadFromLocalstorage() {
  return localStorage.getItem("currentTempUnit") || "celsius";
}

//========== Get Location API ==========
async function getLocation() {
  try {
    const response = await fetch("https://geolocation-db.com/json/");

    if (!response.ok) throw new Error(`HTTP ERROR! Status: ${response.status}`);

    const locationData = await response.json();
    console.log(locationData);

    timezone.innerHTML = `${locationData.city || "Unknown City"} / ${
      locationData.country_name || locationData.country_code
    }`;

    const lat = parseFloat(locationData.latitude);
    const lon = parseFloat(locationData.longitude);
    await getWeather(lat, lon);
  } catch (error) {
    console.error("Error fetching location:", error);
  }
}

// ========== Get Weather API ===========
async function getWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=926dd4ca9cf4413b3e5164f432004851&units=metric`
    );
    if (!response.ok) throw new Error(`HTTP ERROR! Status: ${response.status}`);

    const weatherData = await response.json();
    console.log(weatherData);

    currentTempCelsius = weatherData.main.temp;
    icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}">`;
    tempDesc.textContent = weatherData.weather[0].description;

    displayTemperature();
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}
// displayTemperature() فقط نمایش دماست، بدون تغییر چیزی
// نمایش دما در صفحه بر اساس واحد دمای فعلی (سلسیوس، فارنهایت یا کلوین)
function displayTemperature() {
  if (currentTempCelsius === null) return;

  if (currentTempUnit === "celsius") {
    degree.textContent = `${currentTempCelsius.toFixed(2)} °C`;
  } else if (currentTempUnit === "fahrenheit") {
    const fahrenheit = currentTempCelsius * 1.8 + 32;
    degree.textContent = `${fahrenheit.toFixed(2)} °F`;
  } else if (currentTempUnit === "kelvin") {
    const kelvin = currentTempCelsius + 273.15;
    degree.textContent = `${kelvin.toFixed(2)} K`;
  }
}

// tempConverter() واحد دما رو تغییر میده و بعد دما رو نمایش میده
// تابع تغییر واحد دما به ترتیب celsius → fahrenheit → kelvin → celsius
function tempConverter() {
  if (currentTempCelsius === null) return;

  if (currentTempUnit === "celsius") {
    currentTempUnit = "fahrenheit";
  } else if (currentTempUnit === "fahrenheit") {
    currentTempUnit = "kelvin";
  } else {
    currentTempUnit = "celsius";
  }

  saveToLocalstorage(currentTempUnit);
  displayTemperature();
}

degree.addEventListener("click", () => {
  tempConverter();
});

window.addEventListener("DOMContentLoaded", () => {
  getLocation();
});
