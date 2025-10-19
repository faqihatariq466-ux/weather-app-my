
        const apiKey = "e80614647a4b4ba9422b07965801d976"; // Replace with your API key

        // Navigation between pages
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all pages
                document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                // Show the selected page
                document.getElementById(`${this.dataset.page}-page`).classList.add('active');
            });
        });

        // Get weather on button click
        document.getElementById('getWeatherBtn').addEventListener('click', function() {
            const city = document.getElementById('cityInput').value;
            if (city.trim() !== '') {
                getWeather(city);
            }
        });

        // Get weather on Enter key press
        document.getElementById('cityInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const city = document.getElementById('cityInput').value;
                if (city.trim() !== '') {
                    getWeather(city);
                }
            }
        });

        function getWeather(city) {
            // Show loading state
            document.getElementById('weatherInfo').innerHTML = `
                <div class="weather-display">
                    <div class="city-name">Loading...</div>
                    <div class="weather-icon"><i class="fas fa-spinner fa-spin"></i></div>
                    <div class="temperature">--°C</div>
                    <div class="weather-description">Fetching weather data</div>
                </div>
            `;

            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        // Update current weather
                        document.getElementById('weatherInfo').innerHTML = `
                            <div class="weather-display">
                                <div class="city-name">${data.name}, ${data.sys.country}</div>
                                <div class="weather-icon">${getWeatherIcon(data.weather[0].main)}</div>
                                <div class="temperature">${Math.round(data.main.temp)}°C</div>
                                <div class="weather-description">${data.weather[0].description}</div>
                                
                                <div class="weather-details">
                                    <div class="detail-item">
                                        <i class="fas fa-temperature-high"></i>
                                        <div class="detail-label">Feels Like</div>
                                        <div class="detail-value">${Math.round(data.main.feels_like)}°C</div>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-tint"></i>
                                        <div class="detail-label">Humidity</div>
                                        <div class="detail-value">${data.main.humidity}%</div>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-wind"></i>
                                        <div class="detail-label">Wind Speed</div>
                                        <div class="detail-value">${data.wind.speed} km/h</div>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-compress-arrows-alt"></i>
                                        <div class="detail-label">Pressure</div>
                                        <div class="detail-value">${data.main.pressure} hPa</div>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        // Get forecast data (using current data as placeholder)
                        updateForecast(data);
                    } else {
                        document.getElementById('weatherInfo').innerHTML = `
                            <div class="error-message">
                                <h3><i class="fas fa-exclamation-triangle"></i> City not found!</h3>
                                <p>Please check the city name and try again.</p>
                            </div>
                        `;
                    }
                })
                .catch(error => {
                    document.getElementById('weatherInfo').innerHTML = `
                        <div class="error-message">
                            <h3><i class="fas fa-exclamation-triangle"></i> Network Error</h3>
                            <p>Unable to fetch weather data. Please check your connection.</p>
                        </div>
                    `;
                });
        }

        function getWeatherIcon(weatherMain) {
            const icons = {
                'Clear': 'fas fa-sun',
                'Clouds': 'fas fa-cloud',
                'Rain': 'fas fa-cloud-rain',
                'Drizzle': 'fas fa-cloud-drizzle',
                'Thunderstorm': 'fas fa-bolt',
                'Snow': 'fas fa-snowflake',
                'Mist': 'fas fa-smog',
                'Smoke': 'fas fa-smog',
                'Haze': 'fas fa-smog',
                'Dust': 'fas fa-smog',
                'Fog': 'fas fa-smog',
                'Sand': 'fas fa-smog',
                'Ash': 'fas fa-smog',
                'Squall': 'fas fa-wind',
                'Tornado': 'fas fa-tornado'
            };
            
            const iconClass = icons[weatherMain] || 'fas fa-cloud';
            return `<i class="${iconClass}"></i>`;
        }

        function updateForecast(data) {
            // In a real app, you would fetch 5-day forecast data from the API
            // For this example, we'll create a simple forecast based on current data
            const forecastContainer = document.getElementById('forecastContainer');
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            let forecastHTML = '';
            for (let i = 1; i <= 5; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dayName = days[date.getDay()];
                
                // Create some variation in temperature for the forecast
                const baseTemp = Math.round(data.main.temp);
                const forecastTemp = baseTemp + Math.floor(Math.random() * 6) - 3;
                
                // Vary the weather condition for demonstration
                const conditions = ['Clear', 'Clouds', 'Rain', 'Thunderstorm'];
                const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
                
                forecastHTML += `
                    <div class="forecast-day">
                        <div class="forecast-date">${dayName}</div>
                        <div class="forecast-icon">${getWeatherIcon(randomCondition)}</div>
                        <div class="forecast-temp">${forecastTemp}°C</div>
                    </div>
                `;
            }
            
            forecastContainer.innerHTML = forecastHTML;
        }

        // Load default weather for a popular city on page load
        window.addEventListener('load', function() {
            getWeather('London');
        });
