import './css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPics } from './js/fetchPics.js';
import { markupPics } from './js/markupPics.js';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const optios = {
  timeout: 3500,
  clickToClose: true,
};

let page = 1;
let query;

const galleryLB = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
// --------------------Functions-------------------------

function onResponse({ data }) {
  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      optios
    );
    return;
  }
  if (page === 1) {
    Notify.info(`Hooray! We found ${data.totalHits} images.`, optios);
  }
  page += 1;
  appendMarkupPics(data.hits);
  galleryLB.refresh();
}

function appendMarkupPics(data) {
  refs.gallery.insertAdjacentHTML('beforeend', markupPics(data));
}

async function onSubmit(e) {
  e.preventDefault();
  const inputValue = e.target.elements.searchQuery.value;
  query = inputValue.replace(/\s+/g, '+');
  page = 1;
  refs.gallery.innerHTML = '';
  const pics = await fetchPics(query, page);
  onResponse(pics);
  refs.form.reset();
}

refs.form.addEventListener('submit', onSubmit);

window.addEventListener('scroll', async () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    const pics = await fetchPics(query, page);
    onResponse(pics);
  }
});
