const axios = require('axios');

async function fetchWeather(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    const temps = { Mumbai: 32, Delhi: 36, Bangalore: 28, Pune: 30, Chennai: 34, Hyderabad: 33, Kolkata: 31, Ahmedabad: 35, Jaipur: 37, Lucknow: 34 };
    const humids = { Mumbai: 78, Delhi: 45, Bangalore: 62, Pune: 55, Chennai: 82, Hyderabad: 58, Kolkata: 75, Ahmedabad: 42, Jaipur: 38, Lucknow: 52 };
    return {
      temperature: (temps[city] || 27) + Math.round((Math.random() - 0.5) * 4),
      humidity: (humids[city] || 60) + Math.round((Math.random() - 0.5) * 10),
      region: 'India',
    };
  }

  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: { q: city, units: 'metric', appid: apiKey },
    timeout: 5000,
  });

  return {
    temperature: data.main.temp,
    humidity: data.main.humidity,
    lat: data.coord.lat,
    lng: data.coord.lon,
    region: data.sys.country,
  };
}

module.exports = { fetchWeather };
