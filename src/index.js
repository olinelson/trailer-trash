let movies;

let moviesContainer;

let closeFeatureButton;

// const BaseUrl = "https://api.themoviedb.org/3";
const RailsApi = "http://localhost:3000/api/v1";
const ImagePath = "https://image.tmdb.org/t/p/w185";

let displayedMovie = null;

const getMoviesInTheatres = () => {
  fetch(`${RailsApi}/search/movies/intheatres`)
    .then(r => r.json())
    .then(r => (movies = r))
    .then(() => printMovies());
};

const movieCard = movie => {
  return `
    <div class="movie-card" id="movie-card-${movie.id}" data-id=${movie.id}>
    <img data-id=${movie.id} src="${ImagePath + movie.poster_path}"></img>
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
  fetch(`${RailsApi}/search/movies/${id}`).then(r => r.json());
};

const getVideos = id => {
  fetch(`${RailsApi}/search/videos/${id}`)
    .then(r => r.json())
    // .then(r => console.log(r.results[0].key));
    .then(
      r =>
        `<iframe class="trailer-iframe" src="https://www.youtube.com/embed/${
          r.results[0].key
        }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    );
};

document.addEventListener("DOMContentLoaded", e => {
  console.log("page has loaded");

  moviesContainer = document.querySelector("#movies-container");
  getMoviesInTheatres();
});

document.querySelector("#movies-container").addEventListener("click", e => {
  // console.log("hello", e.target.dataset.id);
  movieId = e.target.dataset.id;
  // getMovieInfo(movieId);
  expandMovie(movieId);
});

const featuredContainer = document.querySelector("#featured-container");

const showHideFeatureContainer = () => {
  if (displayedMovie != null) {
    featuredContainer.style.display = "block";
    console.log(ImagePath + displayedMovie.poster_path);
    featuredContainer.innerHTML = `
   <img src="${ImagePath + displayedMovie.poster_path}"/>
   <h4>${displayedMovie.original_title}</h4>
   <p>${displayedMovie.overview}</p>
  `;
  } else {
    console.log("nothing here");
  }
};

const expandMovie = movieId => {
  id = `#movie-card-${movieId}`;
  let card = document.querySelector(id);

  card.className = "movie-card featured";

  fetch(`${RailsApi}/search/movies/${movieId}`)
    .then(r => r.json())
    .then(
      r =>
        (card.innerHTML += `
      <p>${r.overview}<p/>
      `)
    );
  fetch(`${RailsApi}/search/videos/${movieId}`)
    .then(r => r.json())

    .then(
      r =>
        (card.innerHTML += `
        <button data-id="${movieId}" class="close-featured-button"> X </button>
        <div class="iframe-wrapper">
        <iframe class="trailer-iframe" src="https://www.youtube.com/embed/${
          r.results[0].key
        }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        `)
    )
    .then(
      closeFeatureButton = document.querySelector(".close-featured-button")
    );
  
};



closeFeatureButton.addEventListener("CLICK", e => {
  console.log(e.dataset.id);
});
