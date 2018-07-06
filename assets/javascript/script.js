

$(document).ready(function () {
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

  $('.carousel.carousel-slider').carousel({
    fullWidth: true,
    indicators: true,
    next: 3
  });

  setInterval(function () {
    $('.carousel').carousel('next');
  }, 5000);

  $('.tabs').tabs({ swipeable: true });

  $('.modal').modal();

  $('#profile-modal').on("click", function () {

    $('#modal1').modal('open');

  });

  $("#formValidate").validate({
    rules: {
      firstname: {
        required: true
      },
      lastname: {
        required: true
      },
      username: {
        required: true,
        minlength: 5
      },
      pwd: {
        required: true,
        minlength: 5
      },
      conf_pwd: {
        required: true,
        minlength: 5,
        equalTo: "#id_pwd"
      },
    },
    //For custom messages
    messages: {
      firstname: { required: "Enter a First Name" },
      lastname: { required: "Enter a Last Name" },
      username: {
        required: "Enter a Last Name",
        minlength: "Must be at least 5 characters"
      },
      pwd: {
        required: "Enter a Password",
        minlength: "Must be at least 5 characters"
      },
      conf_pwd: {
        required: "Re-Enter Password",
        minlength: "Must be at least 5 characters",
        equalTo: "Password does not match"
      }

    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
  });


  firebase.auth().onAuthStateChanged(function (user) {
    var user = firebase.auth().currentUser;
    var email, uid;

    curUser.firstName = $("#firstname").val();
    curUser.lastName = $("#lastname").val();
    curUser.username = $("#username").val();
    curUser.email = $("#email").val();
    curUser.steamName = $("#steam-name").val();
    curUser.psnName = $("#psn-name").val();
    curUser.xboxName = $("#gamer-tag").val();
    curUser.nintendoId = $("#nintendo-id").val();
    curUser.aboutMe = $("#about-input").val();



    if (!user) {
      event.preventDefault();
    }
    else if (user) {
      // User is signed in.
      console.log("There's a user signed in!");
      $("#logged-in").css("display", "inline-block");
      $("#not-logged-in").css("display", "none");

      var email = user.email;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      var database = firebase.database();
      database.ref('users/' + uid).set({
        username: curUser.username,
        firstname: curUser.firstName,
        lastName: curUser.lastName,
        email: curUser.email,
        steamName: curUser.steamName,
        psnName: curUser.psnName,
        xboxName: curUser.xboxName,
      });

      console.log(email, isAnonymous, uid, providerData);
      localStorage.setItem("username", username);
      localStorage.setItem("UID", uid);


      $("#welcome-text").text(" Happy to have you here, " + email + "!");
      console.log(name, email, uid);

    } else {
      // No user is signed in.
      console.log("Nobody's here!");
      $("#logged-in").css("display", "none");
      $("#not-logged-in").css("display", "inline-block");
      $("#welcome-text").empty();
    }
  });

  $("#submit-btn").click(function (user) {
    var email = $("#email").val().trim();
    var password = $("#id_pwd").val().trim();
    if (user != null) {
      firebase.auth().signOut();
    }
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().createUserWithEmailAndPassword(email, password);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorMessage = error.message;
        window.alert("Error: " + errorMessage);
      });
    
  });



  $("#login-btn").click(function (user) {
    var user = firebase.auth().currentUser;
    $(".modal-content").html("");
    var email = $("#login-email").val().trim();
    var password = $("#login-password").val().trim();
    $("#login-email").val("");
    $("#login-password").val("");
    if (user != null) {
      console.log("Hi!");
      window.alert("You are already signed into an account. Please sign out before attempting to log into a different account.");
    } else {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function () {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.
          return firebase.auth().signInWithEmailAndPassword(email, password);
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorMessage = error.message;
          window.alert("Error: " + errorMessage);
        });
        
      
    }
  
  });
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      window.location = 'profile.html'; //After successful login, user will be redirected to home.html
    }
  });

  $("#signout-btn").click(function () {
    firebase.auth().signOut();
    localStorage.clear();
    window.location = "startpage.html";

  });

  //very last brackets (Document Ready) below here!  
  // $(document).on("click", "#submit-btn", function () {
  //   event.preventDefault();
  //   var uid = firebase.auth().currentUser;
  //   curUser.firstName = $("#firstname").val();
  //   curUser.lastName = $("#lastname").val();
  //   curUser.username = $("#username").val();
  //   curUser.email = $("#email").val();
  //   curUser.steamName = $("#steam-name").val();
  //   curUser.psnName = $("#psn-name").val();
  //   curUser.xboxName = $("#gamer-tag").val();
  //   curUser.nintendoId = $("#nintendo-id").val();
  //   curUser.aboutMe = $("#about-input").val();

  //   // print and format data to DIV containing user info on profile page
  //   // store data into firebase
  //   database.ref("users/" + localStorage.getItem("UID")).update({
  //     username: curUser.username,
  //     firstname: curUser.firstName,
  //     lastName: curUser.lastName,
  //     email: curUser.email,
  //     steamName: curUser.steamName,
  //     psnName: curUser.psnName,
  //     xboxName: curUser.xboxName,


  //   })

  //   window.location = "profile.html";
  // })


});