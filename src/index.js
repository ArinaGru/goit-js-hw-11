import 'bootstrap/dist/css/bootstrap.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { LoadMoreBtn } from './js/loadMoreBtn.js';
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
const hitsPerPage = 40;
let totalPages = null;
let query;

const galleryLB = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

const loadMoreBtn = new LoadMoreBtn({ selektor: '.load-more', hidden: true });
// --------------------Functions-------------------------

function onResponse({ data }) {
  totalPages = Math.ceil(data.totalHits / hitsPerPage);
  console.log(totalPages);
  if (data.hits.length === 0) {
    notifyFailure();
    return;
  } else if (page === 1 && totalPages === 1) {
    notifyWeFound(data.totalHits, data.hits);
    loadMoreBtn.hide();
    return;
  } else if (page === 1) {
    page += 1;
    notifyWeFound(data.totalHits, data.hits);
    loadMoreBtn.show();
    return;
  } else if (page === totalPages) {
    notifyEndsearch(data.hits);
    return;
  } else {
    page += 1;
    appendMarkupPics(data.hits);
    onPageScrolling();
    galleryLB.refresh();
  }
}

function notifyFailure() {
  Notify.failure(
    `Sorry, there are no images matching your search: ${query}. Please try again.`,
    optios
  );
  loadMoreBtn.hide();
}

function notifyWeFound(totalHits, hits) {
  Notify.info(`Hooray! We found ${totalHits} images.`, optios);
  appendMarkupPics(hits);
  galleryLB.refresh();
}

function notifyEndsearch(hits) {
  Notify.info(`You've reached the end of search results.`, optios);
  appendMarkupPics(hits);
  onPageScrolling();
  galleryLB.refresh();
  loadMoreBtn.hide();
}

function appendMarkupPics(data) {
  refs.gallery.insertAdjacentHTML('beforeend', markupPics(data));
}

async function onPromis() {
  try {
    const pics = await fetchPics(query, page);
    onResponse(pics);
  } catch (error) {
    console.log(error.message);
  }
}

async function onSubmit(e) {
  e.preventDefault();
  const inputValue = e.target.elements.searchQuery.value;
  query = inputValue.replace(/\s+/g, '+');
  page = 1;
  refs.gallery.innerHTML = '';
  onPromis();
  refs.form.reset();
}

function onPageScrolling() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 1.75,
    behavior: 'smooth',
  });
}

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.refs.button.addEventListener('click', onPromis);
