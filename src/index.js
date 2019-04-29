const url = "http://localhost:3000/api/v1";

const imagePath = "https://image.tmdb.org/t/p/w185";

let moodIndex;
let movieScrollIndex;
let movieIndex;
let movieShow;
let allMovies = [];
let allMoods = [];
let allVideos = [];
let searchResults = [];
let header;
let specialMovies;

// function apiGetMoods() {
//   fetch(`${url}/moods`)
//     .then(r => {
//       return r.json();
//     })
//     .then(r => (allMoods = r))
//     .then(r => indexMoods(r));
// }

function apiGetMovies() {
  fetch(`${url}//search/movies/intheatres`)
    .then(r => {
      return r.json();
    })
    .then(r => (allMovies = r.results))
    .then(r => populateIndexAndScroll(r));
}

function populateIndexAndScroll(movies) {
  indexMovies(movies);
  indexScrollMovies(movies);
}

function findMovieById(id) {
  let found = allMovies.find(element => {
    return element.id == id;
  });
  return found;
}

function findMoodById(id) {
  let found = allMoods.find(element => {
    return element.id == id;
  });
  return found;
}

function unique(array, propertyName) {
  return array.filter(
    (e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i
  );
}

function resetMoodIndicators() {
  allMoodContainers = document.querySelectorAll(".mood-card");
  allMoodContainers.forEach(function(card) {
    card.style.borderBottom = "";
  });
}

function showMoodSelected(moodContainer) {
  moodContainer.style.borderBottom = "2px solid white";
}

function muteVideoToggle() {
  muteButtonIcon = document.querySelector("#mute-button-icon");
  if (movieBackgroundVideo.muted) {
    movieBackgroundVideo.muted = false;
    muteButtonIcon.className = "fas fa-volume-up";
  } else {
    movieBackgroundVideo.muted = true;
    muteButtonIcon.className = "fas fa-volume-mute";
  }
}

// function indexMoods(moods) {
//   for (let mood of moods) {
//     moodIndex.innerHTML += `
//     <div data-id="${mood.id}" id="mood-card-${mood.id}" class="mood-card">
//       <i data-id="${mood.id}" class="${mood.image} mood-card-icon hvr-grow"></i>
//       <h4 class="mood-name" data-id="${mood.id}">${mood.name}</h4>
//     </div>

//     `;
//   }
// }

function indexScrollMovies(movies) {
  for (let movie of movies) {
    movieScrollIndex.innerHTML += `
    <div data-id="${movie.id}" id="movie-card-${
      movie.id
    }" class="index-movie-card">
      <img data-id="${movie.id}" class="movie-scroll-image hvr-grow"
     src="${imagePath + movie.poster_path}"
    }" alt="">
      <h4 class="movie-title" data-id="${movie.id}">${movie.title}</h4>
    </div>
    `;
  }
}

function indexMovies(movies) {
  movieScrollIndex.style.display = "none";
  movieShow.innerHTML = "";
  movieIndex.innerHTML = "";

  // let uniqMovies = unique(movies, "title");

  movies.map(movie => {
    console.log(movie);
    movieIndex.innerHTML += `
    <div data-id="${movie.id}" id="movie-card-${movie.id}" class="movie-card">
       <img data-id="${
         movie.id
       }" class="movie-image hvr-grow"  src="${imagePath +
      movie.poster_path}" alt="">
        <h4 class="movie-title" data-id="${movie.id}">${movie.title}</h4>
      </div>
    `;
  });
}

function showMovie(movieId) {
  movieIndex.innerHTML = "";
  movieScrollIndex.style.display = "flex";
  moodIndex.style.display = "none";
  movieBackground.style.display = "none";
  movie = findMovieById(movieId);

  getVideos(movieId);

  window.scrollTo(0, 0);

  movieShow.innerHTML = `
    <div class = "movie-show-image">
    <img  src="${imagePath + movie.poster_path}" alt="">
    </div>
    <div class="movie-show-info">
    <h4>${movie.title}</h4>
    <p>${movie.overview}</p>
  
    <div id="movie_videos_index_${movie.id}"></div>
    </div>

  `;
  videosIndex = document.querySelector(`#movie_videos_index_${movie.id}`);
  generateVideosList(movie.videos, videosIndex);
}

const getVideos = id => {
  fetch(`${url}/search/videos/${id}`)
    .then(r => r.json())
    // .then(r => console.log(r.results[0].key));
    .then(
      r =>
        (movieShow.innerHTML += `
        <div class="trailer-iframe-container">
        <iframe class="trailer-iframe" src="https://www.youtube.com/embed/${
          r.results[0].key
        }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        `)
    );
};

function generateVideosList(videos, destination) {
  for (let video of videos) {
    destination.innerHTML += `

     <div class="trailer-iframe-container">
    <iframe class="trailer-iframe" src="https://www.youtube.com/embed/${
      video.url_key
    } " frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

    `;
  }
}

function homePageConfiguration() {
  movieBackground.style.display = "";
  movieScrollIndex.style.display = "none";
  moodIndex.style.display = "flex";
  movieShow.innerHTML = "";
  movieIndex.innerHTML = "";
  indexMovies(allMovies);
  resetMoodIndicators();
}

document.addEventListener("DOMContentLoaded", e => {
  moodIndex = document.querySelector("#mood-index");
  movieScrollIndex = document.querySelector("#movie-scroll-index");
  movieIndex = document.querySelector("#movie-index");
  movieShow = document.querySelector("#movie-show");
  header = document.querySelector("header");

  // apiGetMoods();
  apiGetMovies();

  header.addEventListener("click", e => {
    if (e.target.id === "header-title") {
      homePageConfiguration();
    }
  }); // end of header button

  moodIndex.addEventListener("click", e => {
    let moodId = e.target.dataset.id;

    let moodButton = document.querySelector(
      `#mood-card-${e.target.dataset.id}`
    );

    relevantMovies = findMoodById(moodId).movies;

    indexMovies(relevantMovies);
    resetMoodIndicators();
    showMoodSelected(moodButton);
  }); //end of mood listener

  movieScrollIndex.addEventListener("click", e => {
    let movieId = e.target.dataset.id;

    showMovie(movieId);
  }); // end of movie index Listener

  movieIndex.addEventListener("click", e => {
    let movieId = e.target.dataset.id;

    showMovie(movieId);
  }); // end of movie index Listener

  document.addEventListener("scroll", e => {
    pageYPosition = window.pageYOffset;

    if (pageYPosition > 150) {
      header.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    } else {
      header.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }
  }); // end of scroll listener

  document.querySelector("#video-overlay").addEventListener("click", e => {
    console.log("hello video");

    muteVideoToggle();
  });
}); //end of dom content loaded
