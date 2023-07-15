function buttonClicked() {
  var movieTitle = document.getElementById("searchData").value;
  fetch(`https://www.omdbapi.com/?apikey=f2d11c2b&s=${movieTitle}`)
    .then((response) => response.json())
    .then((data) => {
      const movies = data.Search;

      if (movies) {
        // Sort movies based on year in descending order
        movies.sort((a, b) => b.Year.localeCompare(a.Year));

        const demoElement = document.getElementById("demo");
        demoElement.innerHTML = ""; // Clear previous search results

        movies.forEach((movie) => {
          const movieId = movie.imdbID;

          const movieContainer = document.createElement("div");
          movieContainer.id = movieId;
          movieContainer.classList.add("movie-container");

          const posterImg = document.createElement("img");
          posterImg.src = movie.Poster;
          posterImg.alt = movie.Title;
          movieContainer.appendChild(posterImg);

          const titlePara = document.createElement("p");
          titlePara.textContent = `Title: ${movie.Title}`;
          movieContainer.appendChild(titlePara);

          const yearPara = document.createElement("p");
          yearPara.textContent = `Year: ${movie.Year}`;
          movieContainer.appendChild(yearPara);

          const movieIdPara = document.createElement("p");
          movieIdPara.textContent = `Movie ID: ${movieId}`;
          movieContainer.appendChild(movieIdPara);

          demoElement.appendChild(movieContainer);
        });
      } else {
        document.getElementById("demo").innerHTML = 'No movies found.';
      }
    })
    .catch((error) => {
      console.log(error);
      document.getElementById("demo").innerHTML = 'Error occurred while fetching data.';
    });
}
