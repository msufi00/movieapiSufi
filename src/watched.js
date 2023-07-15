const moviesContainer = document.getElementById('moviesContainer');

// Function to display watched movies in the UI
function displayWatchedMovies() {
  const watchlist = getWatchlist();
  const watchedMovies = watchlist.filter(movie => movie.watched);

  moviesContainer.innerHTML = '';

  watchedMovies.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.innerHTML = `
      <div class="movie-poster">
        <img src="${movie.Poster}" alt="${movie.Title}">
        <div class="button-group">
          <button class="delete-movie" onclick="deleteMovie('${movie.imdbID}')">Delete</button>
        </div>
      </div>
    `;

    moviesContainer.appendChild(movieCard);
  });
}

// Function to delete a movie from the watched list
function deleteMovie(imdbID) {
  const watchlist = getWatchlist();
  const updatedWatchlist = watchlist.map((movie) => {
    if (movie.imdbID === imdbID) {
      movie.watched = false;
    }
    return movie;
  });
  saveWatchlist(updatedWatchlist);
  displayWatchedMovies();
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

// Display watched movies on page load
window.addEventListener('DOMContentLoaded', () => {
  displayWatchedMovies();
});
