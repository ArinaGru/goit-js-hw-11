export function markupPics(pics) {
  return pics
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card card" style="width: 18rem;">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" class="card-img-top" loading="lazy" /></a>
  <div class="info card-body">
    <p class="info-item">
      <b>Likes</b> - <span class="about-item">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b> - <span class="about-item">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b> - <span class="about-item">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b> - <span class="about-item">${downloads}</span>
    </p>
  </div>
</div>`
    )
    .join('');
}
