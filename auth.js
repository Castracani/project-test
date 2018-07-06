

$(document).ready(function () {

  firebase.auth().onAuthStateChanged(function (user) {
    var user = firebase.auth().currentUser;
    var email, uid;


    if (user) {
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
        username: name,
        email: email
      });

      console.log(email, isAnonymous, uid, providerData);


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
    var password = $("#password").val().trim();
    $("#email").val("");
    $("#password").val("");
    if (user != null) {
      firebase.auth().signOut();
    }
    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: 'https://castracani.github.io/Project-1/create-profile.html',
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.example.ios'
      },
      android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
      }
    };
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
      })
      .then(function () {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
      })
      .catch(function (error) {
        // Some error occurred, you can inspect the code: error.code
        var errorMessage = error.message;
        window.alert("Error: " + errorMessage);
      });
  });
  $("#login-btn").click(function (user) {
    var user = firebase.auth().currentUser;
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    $("#email").val("");
    $("#password").val("");
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

  $("#signout-btn").click(function () {
    firebase.auth().signOut();
  });

  //very last brackets (Document Ready) below here!  
});