const apiKey = '6be92b546ac1d3be8991f39483849b34'; // OpenWeatherMap API Key
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

document.getElementById('get-weather').addEventListener('click', async () => {
  const city = document.getElementById('city-input').value;
  if (!city) {
    alert('Please enter a city name.');
    return;
  }

  try {
    // Fetch current weather
    const weatherResponse = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const weatherData = await weatherResponse.json();
    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    document.getElementById('current-weather').innerText = 
      `Current: ${weatherData.main.temp}°C, ${weatherData.weather[0].description}`;

    // Fetch 3-day forecast
    const forecastResponse = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastResponse.json();
    displayForecast(forecastData);
  } catch (error) {
    alert(error.message);
  }
});

function displayForecast(forecastData) {
  const forecastDiv = document.getElementById('forecast');
  forecastDiv.innerHTML = ''; // Clear previous forecast
  const days = {};

  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!days[date]) {
      days[date] = {
        temp: item.main.temp,
        description: item.weather[0].description
      };
    }
  });

  Object.entries(days).slice(0, 3).forEach(([date, data]) => {
    const dayDiv = document.createElement('div');
    dayDiv.innerHTML = `
      <p>${date}</p>
      <p>${data.temp}°C, ${data.description}</p>
    `;
    forecastDiv.appendChild(dayDiv);
  });
}
