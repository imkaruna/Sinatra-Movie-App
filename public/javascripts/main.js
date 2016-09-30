//Declare variables for HTML elements
var searchResults = document.getElementById("search-results");
var searchBtn = document.getElementById("search-btn");
var favoritesList = document.getElementById("favorites-list");
var favoriteElement = document.getElementById("favorite-element");

var count; //favorites counter

var xhr = new XMLHttpRequest(); // new HTTP request
var showFavorites = document.getElementById("show-favorites");

//If favorites are already in list then show them
showFavorites.onclick = function () {
  elementDisplay(favoritesList);
  getFavorites();
  return false;
}

//Function to search on search button click
searchBtn.onclick = function () {
  var searchText = document.getElementById("search-text").value;
  searchMovies(searchText);
  if (searchResults.style.display = "none") {
    searchResults.style.display = "block";
  }
  return false;
};

//The actual search function which makes the GET request
function searchMovies(searchText) {
  xhr.open("GET", "http://www.omdbapi.com/?s="+searchText);
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    var results = JSON.parse(xhr.response)["Search"];
    showResults(results);
  };
  xhr.send();
}

//Function to display hidden elements
function elementDisplay(el) {
  if (el.style.display === "none") {
    el.style.display = "block";
  }
}

//Function to display the search results
function showResults(movies) {
  var newDiv;
  searchResults.innerHTML = "";
  movies.forEach(function (movie) {
    newDiv = document.createElement("a");
    newDiv.innerHTML = '<div class="row"><a href="movie">"'+ movie["Title"] +'"</a></div><div class="row"><div class="col-xs-12 col-sm-8 col-md-8" id="'+movie["imdbID"]+'" style="display:none; border:1px solid #555555; border-radius: 5px; padding:5px;"><div class="pull-left"> Title: " '+ movie["Title"]+' "<br>Year: " '+movie["Year"] +'"</div><div class="pull-right"><i id="fav'+movie["imdbID"]+'" class="fa fa-lg fa-heart" style="color:red;" aria-hidden="true"></i></div></div></div><br>';
    newDiv.addEventListener("click", function (e) {
      e.preventDefault();
      // Adding event listeners for each element
      var detailsDiv = document.getElementById(movie["imdbID"]);
      var favMovie = document.getElementById("fav"+movie["imdbID"]);
      elementDisplay(detailsDiv);
      favMovie.addEventListener("click", function(e){
        e.preventDefault();
        addFavorite(movie);
      });
    });
    searchResults.appendChild(newDiv);
  });
}



//Get favorite movies from the saved file
function getFavorites() {
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = xhr.responseText;
      displayFavorites(response);
    }
    console.log("No results");
  }
  // sending the AJAX GET request
  xhr.open("GET", "/favorites", true);
  xhr.send();

}


//Function to handle favorites
function addFavorite(movie) {
  // movie variable will get us the information for the movie

  //Create the params to be sent to the server
  var params = "name=" + movie["Title"] + "&oid=" + movie["imdbID"];

  //Make a get request to check if this movie is already on file
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      console.log(response);
      alert(response.message);
      updateFavoriteCount(response.favcount);
    }
  }
  // Send the AJAX request
  xhr.open("POST", "/favorites", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(params);

}

//Function to update favorites count
function updateFavoriteCount(count) {
  var counterElement =  document.getElementById("counter");
  counterElement.innerHTML = " "+count;
}

//Function to display the favorites in the favorites div
function displayFavorites(favorites) {
  var newDiv;
  favHash = JSON.parse(favorites);
  favoriteElement.innerHTML = "";
  for(var key in favHash)
  {
    newDiv = document.createElement("li");
    console.log(key);
    console.log(favHash[key]);
    newDiv.innerHTML = favHash[key];
    favoriteElement.appendChild(newDiv);
  }
  updateFavoriteCount(Object.keys(favHash).length); //Update favorite count
}
//Call getFavorites in case user already has some favorites before beginning
getFavorites();
