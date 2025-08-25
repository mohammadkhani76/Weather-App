const timezone = document.querySelector("#timezone");
const icon = document.querySelector("#icon");
const degree = document.querySelector("#degree");
const tempDesc = document.querySelector("#temp-description");

let currentTempUnit = "celsius";
let currentTempCelsius = null; // متغیر ذخیره دمای سلسیوس

//========== Get Location API ==========
async function getLocation() {
  try {
    const response = await fetch("https://geolocation-db.com/json/");

    if (!response.ok) {
      throw new Error(`HTTP ERROR! Status:${response.status}`);
    }
    const locationData = await response.json();
    console.log(locationData);

    timezone.innerHTML = `${locationData.city || "Unknown City"} / ${
      locationData.country_name || locationData.country_code
    }`;
    const lat = parseFloat(locationData.latitude);
    const lon = parseFloat(locationData.longitude);
    await getWeather(lat, lon);
  } catch (error) {
    console.log("error!", error);
  }
}

// ========== Get Weather API ===========
async function getWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=926dd4ca9cf4413b3e5164f432004851&units=metric`
    );

    if (!response.ok) {
      throw new Error(`HTTP ERROR! Status:${response.status}`);
    }
    const WeatherData = await response.json();
    console.log(WeatherData);

    currentTempCelsius = WeatherData.main.temp; // ذخیره دما
    icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${WeatherData.weather[0].icon}@2x.png" alt="${WeatherData.weather[0].description}">`;
    degree.textContent = `${currentTempCelsius.toFixed(2)} °C`; // نمایش دمای اولیه
    tempDesc.textContent = WeatherData.weather[0].description;
    currentTempUnit = "celsius"; // واحد اولیه
  } catch (error) {
    console.log("error!", error);
  }
}

//=========== تبدیل دما و تغییر واحد celsius → fahrenheit → kelvin → celsius ===========
function tempConverter() {
  if (currentTempCelsius === null) return; // اگر هنوز دما دریافت نشده

  if (currentTempUnit === "celsius") {
    const fahrenheit = currentTempCelsius * 1.8 + 32;
    degree.textContent = `${fahrenheit.toFixed(2)} °F`;
    currentTempUnit = "fahrenheit";
  } else if (currentTempUnit === "fahrenheit") {
    const kelvin = currentTempCelsius + 273.15;
    degree.textContent = `${kelvin.toFixed(2)} K`;
    currentTempUnit = "kelvin";
  } else {
    degree.textContent = `${currentTempCelsius.toFixed(2)} °C`;
    currentTempUnit = "celsius";
  }
}

// ========== Event ===========
degree.addEventListener("click", () => {
  tempConverter();
});

// ========== Load ===========
window.addEventListener("DOMContentLoaded", () => {
  getLocation();
});
