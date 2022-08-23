import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector('#search-box'),
  ul: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;
const URL = 'https://restcountries.com/v3.1/name/';
const fields = 'name,capital,population,flags,languages';
const optios = {
  timeout: 3500,
  clickToClose: true,
};

const responseFn = data => {
  if (data.length >= 10) {
    Notify.info(
      'Too many matches found. Please enter a more specific name.',
      optios
    );
    return;
  }
  if (data.length < 10 && data.length > 1) {
    renderCountryList(data);
    return;
  }
  renderCountry(data);
  console.log(data);
};

const renderCountryList = countries => {
  const markup = countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="country">
    <img src="${svg}" alt="${official}" class="list-svg">
          <h2> ${official}</h2>
        </li>`;
    })
    .join('');
  refs.ul.innerHTML = markup;
};

const renderCountry = data => {
  const country = data[0];
  const languages = Object.values(country.languages).join(', ');
  const {
    name: { official },
    flags: { svg },
    capital,
    population,
  } = country;
  const markup = `
    <div class="country-title"><img src="${svg}" alt="${official}" class="country-flag">
          <h1> ${official}</h2></div>
          <ul>
  <li><span>Capital:</span> ${capital}</li>
  <li><span>Population:</span> ${population}</li>
  <li><span>Languages:</span> ${languages}</li>
</ul>
        `;
  refs.div.innerHTML = markup;
};

const clearList = () => {
  refs.ul.innerHTML = '';
};

const clearCountryInfo = () => {
  refs.div.innerHTML = '';
};

refs.input.addEventListener(
  'input',
  debounce(e => {
    clearList();
    clearCountryInfo();
    const country = refs.input.value.trim();

    if (country.length === 0) {
      return;
    }

    fetchCountries(URL, country, fields)
      .then(responseFn)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name', optios);
        console.log(error);
      });
  }, DEBOUNCE_DELAY)
);
