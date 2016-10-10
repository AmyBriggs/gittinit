'use strict';

const editProfileListener = () => {
  $(`#edit-profile`).click((e) => {
    console.log(e);
  });
};

$(document).ready(() => {
  $(`#login-button`).click(function() {
    console.log(`clicked`);
    $(`#login-button`).addClass(`active`);
    window.location.href = `http://localhost:3000/auth/github`;
  });

  if ($(`#login-button`).hasClass(`active`)) {
    $(`login-button`).addClass(`hidden`);
    $(`logout-button`).removeClass(`hidden`);
  }

  $(`#logout-button`).click(function() {
    console.log(`clacked`);
    window.location.href = `http://localhost:3000/logout`;
  });

  editProfileListener();
});
