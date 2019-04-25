let movies;

const BaseUrl="https://api.themoviedb.org/3"

const getMoviesInTheatres = () => {
  fetch("http://localhost:3000/api/v1/search/movies/intheatres")
    .then(r => r.json())
    .then(r => (movies = r))
    .then(() => printMovies());
};

const movieCard = movie => {
  return `
    <div class="movie-card">
    <img src="${BaseUrl + movie.poster_path}"></img>
    <h4>${movie.title}</h4>
    </div>
    `;
};

const printMovies = () => {
  console.log(movies);
  document.querySelector("#movies-container").innerHTML = movies.results.map(
    m => movieCard(m)
  ).join("");
};

document.addEventListener("DOMContentLoaded", e => {
  console.log("page has loaded");
  getMoviesInTheatres();
});
