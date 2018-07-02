// Initializing our Auth0Lock
var lock = new Auth0Lock(
  'wN3t3m8umRq7A0XgDQ0qw8icE4wEKZgy',
  'castra.auth0.com',
  options
);

// Listening for the authenticated event
lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getUserInfo() and save it to localStorage
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    document.getElementById('nick').textContent = profile.nickname;

    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    //use JSON.parse when retrieving from Firebase!
  });
});