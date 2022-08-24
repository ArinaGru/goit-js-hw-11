import axios from 'axios';
const URL = 'https://pixabay.com/api/';
const KEY = '29459514-4ff3b1a06a484609b866e5052';
const searchOptions = 'image_type=photo&orientation=horizontal&safesearch=true';
const perPage = 40;

export async function fetchPics(query, page) {
  try {
    return await axios.get(
      `${URL}?key=${KEY}&q=${query}&page=${page}&per_page=${perPage}&${searchOptions}`
    );
  } catch (error) {
    console.log(error.message);
  }
}
