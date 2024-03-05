const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
// const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
// const io = socketIo(server);

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';
const API_KEY = 'aa62c144c2c8315e62c19addaf1979db';
// const part = 'minutely,hourly,alerts';

const PORT = process.env.PORT || 5000;

// Middleware for enabling CORS
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

// API endpoint for fetching weather data
app.post('/api/weather', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Call weather API using latitude and longitude
    const weatherData = await getWeatherData(latitude, longitude);

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Function to fetch weather data from API
const getWeatherData = async (latitude, longitude) => {
  // API call
  const response = await axios.get(`${baseUrl}lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
  console.log('Fetching weather data for:', response.data);
  // return response.data;
  const weatherData = response.data;

  return {
    location: weatherData.name,
    temperature: Math.floor(weatherData.main.temp),
    conditions: weatherData.weather[0].main,
    sunrise: weatherData.sys.sunrise,
    sunset: weatherData.sys.sunset,
    feelsLike: weatherData.main.feels_like,
    maxTemp: weatherData.main.temp_max,
    minTemp: weatherData.main.temp_min,
    pressure: weatherData.main.pressure,
    humidity: weatherData.main.humidity,
    icons: weatherData.weather[0].icon
  };
};
