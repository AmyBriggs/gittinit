'use strict';



console.log('hi');




$(document).ready(() => {
  $('#login-button').click(function() {
    console.log('clicked');
    window.location.href = `http://localhost:3000/auth/github`;
  });
  $('#logout-button').click(function() {
    console.log('clicked');
    window.location.href = `http://localhost:3000/logout`;
  });

})