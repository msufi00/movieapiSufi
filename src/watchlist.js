const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const moviesContainer = document.getElementById('moviesContainer');

// Function to fetch movies from OMDB API
async function fetchMovies(searchTerm) {
  const apiKey = 'c1aecf62';
  const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.Search;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Function to display movies in the UI

// Function to display movies in the UI
function displayMovies(movies) {
  moviesContainer.innerHTML = '';

  movies.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.setAttribute('data-imdbid', movie.imdbID);
    movieCard.innerHTML = `
      <div class="movie-poster">
        <img src="${movie.Poster}" alt="${movie.Title}">
        <div class="button-group">
          <button class="mark-as-watched" onclick="markAsWatched('${movie.imdbID}')">Watched</button>
          <button class="delete-movie" onclick="removeFromWatchlist('${movie.imdbID}')">Delete</button>
        </div>
      </div>
      <div class="movie-details">
        <h3>${movie.Title}</h3>
        <p>Year: ${movie.Year}</p>
      </div>
    `;

    moviesContainer.appendChild(movieCard);
  });
}






// ...

// Function to mark a movie as watched
function markAsWatched(imdbID) {
  const watchlist = getWatchlist();
  const movie = watchlist.find((item) => item.imdbID === imdbID);
  if (movie) {
    movie.watched = true;
    saveWatchlist(watchlist);
  }
  redirectToWatched();
}

// Function to redirect to the watched.html page
function redirectToWatched() {
  window.location.href = 'watched.html';
}

// ...


// Function to toggle the watched status of a movie

function toggleWatchedStatus(imdbID) {
  const watchlist = getWatchlist();
  const updatedWatchlist = watchlist.map((item) => {
    if (item.imdbID === imdbID) {
      if (item.watched) {
        item.watched = false;
      } else {
        item.watched = true;
      }
    }
    return item;
  });
  saveWatchlist(updatedWatchlist);
  displayMovies(updatedWatchlist);

  const updateButton = document.querySelector(`.movie-card[data-imdbid="${imdbID}"] .button-group button.update-status`);
  updateButton.classList.add('clicked');
}



// Function to add a movie to the watchlist
function addToWatchlist(movie) {
  const watchlist = getWatchlist();
  watchlist.push(movie);
  saveWatchlist(watchlist);
  alert('Movie added to watchlist!');
}

// Function to remove a movie from the watchlist
function removeFromWatchlist(imdbID) {
  const watchlist = getWatchlist();
  const updatedWatchlist = watchlist.filter((item) => item.imdbID !== imdbID);
  saveWatchlist(updatedWatchlist);
  displayMovies(updatedWatchlist);
}

// Function to save the watchlist to localStorage
function saveWatchlist(watchlist) {
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

// Function to retrieve the watchlist from localStorage
function getWatchlist() {
  const watchlist = localStorage.getItem('watchlist');
  return watchlist ? JSON.parse(watchlist) : [];
}

// Event listener for the search form submission
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();
  if (searchTerm === '') {
    return;
  }

  const watchlist = getWatchlist();
  const filteredMovies = watchlist.filter((movie) =>
    movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayMovies(filteredMovies);
});

// Display movies from the watchlist on page load
window.addEventListener('DOMContentLoaded', () => {
  const watchlist = getWatchlist();
  displayMovies(watchlist);
});


