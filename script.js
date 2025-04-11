const cityinput = document.querySelector('.city-input');
const searchbtn = document.querySelector('.search-button');
const notfoundsection = document.querySelector('.not-found');
const searchcitysection = document.querySelector('.search-city');
const weatherinfosection = document.querySelector('.weather-info');
const countrytext = document.querySelector('.country-text');
const temptext = document.querySelector('.temp-text');
const conditiontext = document.querySelector('.condition-text');
const humidityvaluetext = document.querySelector('.humidity-value-text');
const windvaluetext = document.querySelector('.wind-value-text');
const weathersummaryimg = document.querySelector('.weather-summary-img');
const currentdatetext = document.querySelector('.current-date-text');
const forecastitemcontainer = document.querySelector('.forecast-items-container');

const apikey = 'ce442cea18e1c9aa88f9912f17bbaf63';

searchbtn.addEventListener('click', () => {
    if (cityinput.value.trim() !== '') {
        updateWeatherinfo(cityinput.value);
        cityinput.value = '';
        cityinput.blur();
    }
});

cityinput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityinput.value.trim() !== '') {
        updateWeatherinfo(cityinput.value);
        cityinput.value = '';
        cityinput.blur();
    }
});

async function getFetchData(endpoint, city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`;
    const response = await fetch(apiurl);
    return response.json();
}

function getweathericon(id) {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id === 800) return 'clear.svg';
    return 'clouds.svg';
}

function getcurrentdate() {
    const currentdate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return currentdate.toLocaleDateString('en-GB', options);
}

async function updateWeatherinfo(city) {
    const weatherdata = await getFetchData('weather', city);
    if (weatherdata.cod !== 200) {
        showDisplaySection(notfoundsection);
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherdata;

    countrytext.textContent = country;
    temptext.textContent = Math.round(temp) + ' °C';
    conditiontext.textContent = main;
    humidityvaluetext.textContent = humidity + '%';
    windvaluetext.textContent = speed + ' M/s';
    currentdatetext.textContent = getcurrentdate();
    weathersummaryimg.src = `assets/weather/${getweathericon(id)}`;

    await updateforecastinfo(city);
    showDisplaySection(weatherinfosection);
}

async function updateforecastinfo(city) {
    const forecastdata = await getFetchData('forecast', city);
    const timetaken = '12:00:00';
    const todaydate = new Date().toISOString().split('T')[0];

    forecastitemcontainer.innerHTML = '';
    forecastdata.list.forEach(forecastweather => {
        if (forecastweather.dt_txt.includes(timetaken) && !forecastweather.dt_txt.includes(todaydate)) {
            updateforecastitems(forecastweather);
        }
    });
}

function updateforecastitems(weatherdata) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherdata;

    const datetaken = new Date(date);
    const dateoption = {
        day: '2-digit',
        month: 'short'
    };
    const dateresult = datetaken.toLocaleDateString('en-US', dateoption);

    const forecastitem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-text">${dateresult}</h5>
            <img src="assets/weather/${getweathericon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>`;

    forecastitemcontainer.insertAdjacentHTML('beforeend', forecastitem);
}

function showDisplaySection(section) {
    [weatherinfosection, searchcitysection, notfoundsection]
        .forEach(sec => sec.style.display = 'none');
    section.style.display = 'flex';
}
