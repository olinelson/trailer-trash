let movies;

// const BaseUrl = "https://api.themoviedb.org/3";
const RailsApi = "http://localhost:3000/api/v1";
const ImagePath = "https://image.tmdb.org/t/p/w185"

let displayedMovie = null;

const getMoviesInTheatres = () => {
  fetch(`${RailsApi}/search/movies/intheatres`)
    .then(r => r.json())
    .then(r => (movies = r))
    .then(() => printMovies());
};

const movieCard = movie => {
  return `
    <div class="movie-card" data-id=${movie.id}>
    <img data-id=${movie.id} src="${
      ImagePath +
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
    .then(r => displayedMovie = r)
    .then(r => showHideFeatureContainer())
    .then(r => console.log(displayedMovie))
    .then( r => getVideos(id))
};

const getVideos = id => {
  fetch(`${RailsApi}/search/videos/${id}`)
  .then(r => r.json())
  .then(r => console.log(r))
}

document.addEventListener("DOMContentLoaded", e => {
  console.log("page has loaded");
  getMoviesInTheatres();
});

document.querySelector("#movies-container").addEventListener("click", e => {
  // console.log("hello", e.target.dataset.id);
  movieId = e.target.dataset.id;
  getMovieInfo(movieId);
});

const featuredContainer = document.querySelector("#featured-container");


const showHideFeatureContainer = () => {

if (displayedMovie != null){
  featuredContainer.style.display = "block"
  console.log(ImagePath + displayedMovie.poster_path)
  featuredContainer.innerHTML = `
   <img src="${ImagePath + displayedMovie.poster_path}"/>
   <h4>${displayedMovie.original_title}</h4>
   <p>${displayedMovie.overview}</p>
  `
}else {
  console.log('nothing here')
}

}

