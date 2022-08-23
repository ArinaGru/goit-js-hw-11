export const fetchCountries = (url, name, fields) =>
  fetch(`${url}${name}?fields=${fields}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
