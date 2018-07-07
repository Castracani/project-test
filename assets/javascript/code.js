
// firebase
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBZvq3N02QOEG6fa-6qiDLwOHoSeIBza0Q",
    authDomain: "game-website-9813e.firebaseapp.com",
    databaseURL: "https://game-website-9813e.firebaseio.com",
    projectId: "game-website-9813e",
    storageBucket: "game-website-9813e.appspot.com",
    messagingSenderId: "70919236665"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  firebase.database().ref('/users/' + JSON.stringify(sessionStorage.getItem("uid")).once('value').then(function (snapshot) {
    console.log(snapshot.val().firstname);
    console.log(snapshot.val().lastName);
   });

  // maybe set these values initally to the firebase values?
var curUser = {
  username: "", 
  firstName: "",
  lastName: "",
  email: "",
  avatar: "",
  steamName: "",
  psnName: "",
  xboxName: "",
  nintendoId: "",
  aboutMe: "",
  status: "",
  steamOnline: "",
  steamLastOnline: ""
}



$(document).ready(function () {

  var user = firebase.auth().currentUser;
  var name, email, photoUrl, uid, emailVerified;
  
  if (user != null) {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                     // this value to authenticate with your backend server, if
                     // you have one. Use User.getToken() instead.
  }


  

  // giantbomb API start (for game library) =================================================================>>>
  
  var gameLibrary = [];
  var searchResults = [];

  function addGames(game) {


    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      crossDomain: true,
      jsonp: 'json_callback',
      url: 'https://www.giantbomb.com/api/search/?format=jsonp&api_key=47d89cf2776025d8ace3e66e641a4eb8bd066fc5&query=' + game
    }).done(function (data) {
      var results = data.results
      console.log(results)
      $("#search-results").html("")
      // clear search array
      searchResults = [];
      for (i = 0; i < 10; i++) {
        //  game icon
        var gameImg = results[i].image.icon_url;
        var image = $("<img src='" + gameImg + "' />")
        //  game name
        var gameName = $("<h3>").text(results[i].name)
        //  is there a release date available? if so...
        if (results[i].original_release_date !== undefined) {
          //  format release date
          var date = new Date(results[i].original_release_date);
          var newDate = date.toString('dd-MM-yy')
          // gets rid of unnecessary data
          newDate = newDate.replace(/00:00.*/, "");
          // save the release date
          var gameRelease = $("<p>").text("Release date: " + newDate);
          // if there is no release date, return 'unknown'
        } else if (results[i].original_release_date == undefined) {
          var gameRelease = $("<p>").text("Release date: unknown");
        }
        //  game description
        var gameInfo = $("<p>").text("Description: " + results[i].deck);
        //  add library button
        var newButton = $("<button>" + "add to library" + "</button>");
        newButton.addClass("add-game");
        newButton.val([i]);
        //  create a horizontal line
        var hr = $("<hr>")
        //  push game to search array
        searchResults.push(results[i].name);

        $("#search-results").append(gameName, image, gameInfo, gameRelease, newButton, hr)
      }

    }).fail(function () {
      console.log("error");
    }).always(function () {

    });

  }

    // game search input+++++++++++++++++++++++++++++++++++++++++

  $("#search-game").on("click", function (event) {
    event.preventDefault();
    var inputGame = $("#search-input").val().trim();
    //  console.log(inputGame)
    addGames(inputGame);
  })


    // add game to library
  
    $(document).on("click", ".add-game", function () {
    event.preventDefault();
    var x = $(this).val(); //grabs value that will match location within array and assigns to a new variable

    var newGame = searchResults[x]; //grabs game title from searchResults array
    gameLibrary.push(newGame); //adds to libray variable
    console.log(gameLibrary)
  
    
    // store within firebase !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    database.ref("users/" + curUser.username).update({
      gamelibrary: gameLibrary
    })
  })

  $(document).on("click", "#library-refresh", function(){
    event.preventDefault();
    var list = $("<ul>");
    $("#library").append(list);
    for(i=0; i<gameLibrary.length; i++){
      
      var listItem = $("<li>");
      listItem.text(gameLibrary[i]);
      $("#library").append(listItem);
    }
  })


  // giantbomb API end <<<=================================================================




  // Profile creation start ============================================================>>>


  $(document).on("click", "#profile-submit", function () {
    event.preventDefault();
    curUser.firstName = $("#firstname").val();
    curUser.lastName = $("#lastname").val();
    curUser.username = $("#username").val();
    curUser.email = $("#email").val();
    curUser.steamName = $("#steam-name").val();
    curUser.psnName = $("#psn-name").val();
    curUser.xboxName = $("#gamer-tag").val();
    curUser.nintendoId = $("#nintendo-id").val();
    curUser.aboutMe = $("#about-input").val();

    // set local storage
    localStorage.setItem("firstname", curUser.firstName);
    localStorage.setItem("lastname", curUser.lastName);
    localStorage.setItem("username", curUser.username);


    // store data into firebase  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    database.ref("users/" + curUser.username).update({
      
        username: curUser.username,
        firstname: curUser.firstName,
        lastName: curUser.lastName,
        email: curUser.email,
        steamName: curUser.steamName,
        psnName: curUser.psnName,
        xboxName: curUser.xboxName,
      

    })
  })
  // Profile creation end <<<=================================================================




  // steam API start ===============================================================================================>>>>


  // find steam id from create profile page
  $(document).on("click", "#get-steam", function () {
    event.preventDefault();
    var vanityName = $("#steam-name").val().trim();
    getSteamName(vanityName)
  })
  function getSteamName(name) {
    // Fetches steam user ID number
    var queryURL = "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=597FC535B0A81C139B5227A808EAA15B&vanityurl=" + name
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (data) {

      var steamNumber = data.response.steamid;

      returnSteamName(steamNumber);

    })
  }
  function returnSteamName(id) {
    var queryURL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=597FC535B0A81C139B5227A808EAA15B&steamids=" + id;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (data) {
      var steamName = data.response.players[0].personaname;
      console.log(steamName)
      $("#steam-name").val(steamName);
      curUser.avatar = data.response.players[0].avatarmedium;
     
      //  $("#image-share").html(image);
      var lastLogOff = data.response.players[0].lastlogoff;
      var newDate = $.parseJSON(lastLogOff);
      var formatDate = new Date(1000 * newDate);
      curUser.steamLastOnline = formatDate
      // store in firebase  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      // check if online 
      var online = data.response.players[0].personastate;
      if (online === 0) {
        curUser.steamOnline = "no"
      } else if (online === 1) {
        curUser.steamOnline = "yes"
      }
      // store in firebase  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    })
  }

// steam API end <<<================================================================================



  

// populate profile page start ==================================================================>>>>

// need to add onload="populatePage();" to <body> of page <---------------------!!!!!!


function populatePage(){

// This will all be populated with firebase!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// username

// $("#nameOfUser").html("<h1>" + firebase variable will go here + "</h1>") 


// screen names


// status

// game library

// Gamer ID card

// contact

// 
}
// populate profile page end  <<<<==================================================================



// gamer id card start ==================================================================>>>>

// need to add onload="draw();" to body of page <---------------------!!!!!!
function draw() {
  // text
  var par = document.getElementById('canvas').getContext('2d');
  par.font = '30px serif';
  par.fillText("Gamer ID Card", 8, 40);
  // psn name
  if (curUser.psnName !== undefined) {
    par.fillText("psn: " + curUser.psnName, 220, 100);
  } else {
    par.fillText("psn: none", 220, 100);
  }
  // xbox name
  if (curUser.xboxName !== undefined) {
    par.fillText("xbox: " + curUser.xboxName, 220, 150);
  } else {
    par.fillText("xbox: none", 220, 150);
  }
  // steam name
  if (curUser.steamName !== undefined) {
    par.fillText("steam: " + curUser.steamName, 220, 200);
  } else {
    par.fillText("steam: none", 220, 200);
  }

  // avatar image
  var ctx = canvas.getContext('2d');
  ctx.drawImage(document.getElementById('image-source'), 8, 60, 180, 180)
}

// gamer id card ends  <<<==================================================================

// start page floating button
$('.fixed-action-btn').floatingActionButton();

// tabs
$('.tabs').tabs();



$('.fixed-action-btn').floatingActionButton();
  

$('.carousel.carousel-slider').carousel({
  fullWidth: true,
  indicators: true,
  next: 3
});

$('.sidenav').sidenav();
$('.tabs').tabs({ swipeable: true });

setInterval(function () {
  $('.carousel').carousel('next');
}, 5000);


$("#signout-btn").click(function () {
  firebase.auth().signOut();
  localStorage.clear();
  window.location = "startpage.html";

});


firebase.database().ref('/users/' + localStorage.getItem("UID")).once('value').then(function (snapshot) {
  console.log(snapshot.val().firstname);
  console.log(snapshot.val().lastName);
 });

})








// // Steam api =========================================================================================================================
  
// function getSteamId(steamId) {
//   // Fetch steam user ID number
//   var queryURL = "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=597FC535B0A81C139B5227A808EAA15B&vanityurl=" + steamId
//   $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).then(function (data) {

//     var steamNumber = data.response.steamid;

//     getSteamProfile(steamNumber);

//   })
// }
// //  get steam ID from vanity URL search
// $("#steam-submit").on("click", function () {
//   event.preventDefault();
//   var steamId = $("#steam-input").val().trim();

//   getSteamId(steamId);
// })


// // Fetch steam user profile page

// // nick's steam ID for testing purposes: 76561197972752173

// function getSteamProfile(number) {
//   var queryURL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=597FC535B0A81C139B5227A808EAA15B&steamids=" + number;
//   $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).then(function (data) {
//     // save avatar
//     curUser.avatar = data.response.players[0].avatarmedium;
//     // last online
//     var lastLogOff = data.response.players[0].lastlogoff;
//     var newDate = $.parseJSON(lastLogOff);
//     var formatDate = new Date(1000 * newDate);
//     curUser.steamLastOnline = formatDate
//     // check if online 
//     var online = data.response.players[0].personastate;
//     if (online === 0) {
//       curUser.steamOnline = "no"
//     } else if (online === 1) {
//       curUser.steamOnline = "yes"
//     }
    
//   })
// }
// // ==================================================================================================================================
