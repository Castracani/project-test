window.addEventListener('load', function() {

  var webAuth = new auth0.WebAuth({
    domain: 'castra.auth0.com',
    clientID: 'ZdhdhXqh492VnXOFor3RKhcYzLdJ6Mf3',
    responseType: 'token id_token',
    audience: 'https://castra.auth0.com/userinfo',
    scope: 'openid',
    redirectUri: window.location.href
  });

  var loginBtn = document.getElementById('btn-login');

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

});