const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

async function loadMovies(searchTerm) {
  const apiKey = 'f2d11c2b';
  const URL = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`;
  const res = await fetch(URL);
  const data = await res.json();
  if (data.Response == 'True') {
    displayMovieList(data.Search);
  }
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  } else {
    searchList.classList.add('hide-search-list');
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = '';
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[idx].imdbID;
    movieListItem.classList.add('search-list-item');
    let moviePoster =
      movies[idx].Poster != 'N/A' ? movies[idx].Poster : 'image_not_found.png';

    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
        <img src="${moviePoster}">
      </div>
      <div class="search-item-info">
        <h3>${movies[idx].Title}</h3>
        <p>${movies[idx].Year}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;movie ID : ${movies[idx].imdbID}</p>
        
      </div>
    `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll('.search-list-item');
  searchListMovies.forEach((movie) => {
    movie.addEventListener('click', async () => {
      searchList.classList.add('hide-search-list');
      movieSearchBox.value = '';
      const apiKey = 'f2d11c2b';
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${apiKey}`
      );
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(Search) {
  resultGrid.innerHTML = `
    <div class="movie-poster">
      <img src="${Search.Poster != 'N/A' ? Search.Poster : 'image_not_found.png'}" alt="movie poster">
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${Search.Title}</h3>
      <ul class="movie-misc-info">
        <li class="year">Year: ${Search.Year}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li>
        <li class="rated">Ratings: ${Search.imdbRating}&nbsp;&nbsp;</li>
        <li class="released">Release date: ${Search.Released}</li>
      </ul>
      <p class="genre"><b>Genre:</b> ${Search.Genre}</p>
      <p class="writer"><b>Writer:</b> ${Search.Writer}</p>
      <p class="director"><b>Director:</b> ${Search.Director}</p>
      <p class="actors"><b>Actors: </b>${Search.Actors}</p>
      <p class="plot"><b>Synopsis:</b> ${Search.Plot}</p>
      <button class="add-to-watchlist">Add to Watchlist</button>
    </div>
  `;

  const year = Search.Year.split('–')[0].trim(); // Extract the year from the search result

  loadRelatedMovies(Search.Title, year);

  const addToWatchlistButton = resultGrid.querySelector('.add-to-watchlist');
  addToWatchlistButton.addEventListener('click', () => {
    addToWatchlist(Search);
  });
}


async function loadRelatedMovies(movieTitle) {
  const apiKey = 'f2d11c2b';
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${movieTitle}`);
  const data = await response.json();
  const movies = data.Search;
  displayRelatedMovies(movies);
}

function displayRelatedMovies(movies) {
  const relatedMoviesContainer = document.getElementById('relatedMovies');
  relatedMoviesContainer.innerHTML = '';

  if (movies) {
    movies.sort((a, b) => b.Year.localeCompare(a.Year)); // Sort movies based on year (newer to older)

    movies.forEach((movie) => {
      const movieCard = document.createElement('div');
      movieCard.className = 'related-movie-card';
      movieCard.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title}">
        <div class="related-movie-details">
          <h3>${movie.Title}</h3>
          <p>Year: ${movie.Year}</p>
          <button class="add-to-watchlist">Add to Watchlist</button>
        </div>
      `;

      movieCard.querySelector('.add-to-watchlist').addEventListener('click', () => {
        addToWatchlist(movie);
      });

      relatedMoviesContainer.appendChild(movieCard);
    });

    // Scroll to the beginning of the related movies section
    relatedMoviesContainer.scrollLeft = 0;
  } else {
    relatedMoviesContainer.innerHTML = 'No related movies found';
  }
}


function redirectToCrud() {
  window.location.href = '../watchlist.html';
}

function addToWatchlist(movie) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

  const existingMovie = watchlist.find((item) => item.imdbID === movie.imdbID);
  if (!existingMovie) {
    watchlist.push(movie);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert('Movie added to watchlist!');
    redirectToCrud();
  } else {
    alert('Movie is already in the watchlist!');
  }
}


