const API_KEY = "";
const BASE_URL = "https://api.weatherapi.com/v1";

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const errorMessage = document.getElementById("errorMessage");
const weatherResult = document.getElementById("weatherResult");
const forecastResult = document.getElementById("forecastResult");
const forecastContainer = document.getElementById("forecastContainer");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWeather = async () => {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Por favor, insira o nome de uma cidade.");
    return;
  }

  showLoading(true);
  clearResults();

  try {
    // Faz a requisição à API
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&lang=pt`
    );

    await delay(500);

    if (!response.ok) {
      throw new Error("Erro ao buscar a previsão do tempo.");
    }

    const data = await response.json();

    // Exibir os dados
    displayWeather(data);
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
};

const showLoading = (isLoading) => {
  loading.classList.toggle("hidden", !isLoading);
};

const showError = (message) => {
  errorMessage.textContent = message;
  errorDiv.classList.remove("hidden");
};

const clearResults = () => {
  errorDiv.classList.add("hidden");
  weatherResult.classList.add("hidden");
  forecastResult.classList.add("hidden");
};

const displayWeather = (data) => {
  // Clima atual
  cityName.textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
  temperature.textContent = `Temperatura: ${data.current.temp_c}°C`;
  condition.textContent = `Condição: ${data.current.condition.text}`;
  humidity.textContent = `Umidade: ${data.current.humidity}%`;
  wind.textContent = `Vento: ${data.current.wind_kph} km/h`;
  weatherIcon.src = data.current.condition.icon;
  weatherIcon.alt = data.current.condition.text;
  weatherResult.classList.remove("hidden");

  // Previsão dos próximos dias
  forecastContainer.innerHTML = "";
  const forecastDays = data.forecast.forecastday;

  forecastDays.forEach((day) => {
    const forecastDate = new Date(day.date).toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    });
    const forecastHTML = `
      <div class="forecast-card">
        <p class="forecast-date">${forecastDate}</p>
        <img class="forecast-icon" src="${day.day.condition.icon}" alt="${day.day.condition.text}">
        <p class="forecast-temp">Máx: ${day.day.maxtemp_c}°C</p>
        <p class="forecast-temp">Mín: ${day.day.mintemp_c}°C</p>
      </div>
    `;
    forecastContainer.innerHTML += forecastHTML;
  });

  forecastResult.classList.remove("hidden");
};

searchButton.addEventListener("click", fetchWeather);
