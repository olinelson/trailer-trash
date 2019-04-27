let movies;

// const BaseUrl = "https://api.themoviedb.org/3";
const RailsApi = "http://localhost:3000/api/v1";

const getMoviesInTheatres = () => {
  fetch(`${RailsApi}/search/movies/intheatres`)
    .then(r => r.json())
    .then(r => (movies = r))
    .then(() => printMovies());
};

const movieCard = movie => {
  return `
    <div class="movie-card" data-id=${movie.id}>
    <img data-id=${movie.id} src="https://image.tmdb.org/t/p/w185${
    movie.poster_path
  }"></img>
    <h4>${movie.title}</h4>
    </div>
    `;
};

const printMovies = () => {
  document.querySelector("#movies-container").innerHTML = movies.results
    .map(m => movieCard(m))
    .join("");
};

const getMovieInfo = id => {
  fetch(`${RailsApi}/search/movies/${id}`)
    .then(r => r.json())
    .then(r => console.log(r));
};

document.addEventListener("DOMContentLoaded", e => {
  console.log("page has loaded");
  getMoviesInTheatres();

  document.querySelector("#movies-container").addEventListener("click", e => {
    // console.log("hello", e.target.dataset.id);
    movieId = e.target.dataset.id
    getMovieInfo(movieId)
  });
});
