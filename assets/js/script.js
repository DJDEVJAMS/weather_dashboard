const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeatherData = document.getElementById('currentWeatherData');
const forecastData = document.getElementById('forecastData');
const historyList = document.getElementById('historyList');
const apiKey = 'fb361e84ed523bb989390f84590d89c4';

// Load search history from localStorage (if available)
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
updateHistoryList();

// Function to fetch weather data from OpenWeather API
function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
            saveToHistory(city);
        })
        .catch(error => console.error('Error:', error));
}

// Function to display current weather
function displayCurrentWeather(data) {
    const city = data.city.name;
    const weather = data.list[0].weather[0];
    const temp = data.list[0].main.temp;
    const windSpeed = data.list[0].wind.speed;
    const humidity = data.list[0].main.humidity;

    currentWeatherData.innerHTML = `
        <h3>${city} (${new Date().toLocaleDateString()})</h3>
        <img src="http://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}">
        <p>Temperature: ${temp} °C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Humidity: ${humidity}%</p>
    `;
}
// Function to display 5-day forecast
function displayForecast(data) {
    forecastData.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        const weather = forecast.weather[0];
        const temp = forecast.main.temp;
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('weather-card');
        forecastCard.innerHTML = `
            <h4>${date}</h4>
            <img src="http://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}">
            <p>Temp: ${temp} °C</p>
            <p>Wind: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>
        `;
        forecastData.appendChild(forecastCard);
    }
}
