'use strict';

// profile edit button clicked!
const editProfileListener = () => {
  $(`#edit-profile`).click((e) => {
    window.location.href = `/edit`;
  });
};

// profile change form submitted!
const updateProfileListener = () => {
  $(`#edit-profile-btn`).click((e) => {
    e.preventDefault();
    const changes = {};

    for (let i = 0; i < e.target.form.length; i++) {
      if (e.target.form[i].value !== ``) {
        changes[e.target.form[i].name] = e.target.form[i].value;
      }
    }

    $.ajax({
      data: changes,
      method: `POST`,
      success: () => {
        console.log(`profile updated`);
      },
      url: `/edit`,
    })
    .done(() => {
      window.location = `/index`; // redirect when finished!
    });
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
    window.location.href = `http://localhost:3000/splash`;
  });

  // $(`#logout-edit-btn`).click(function() {
  //   window.location.href = `http://localhost:3000/splash`;
  // });

  editProfileListener();
  updateProfileListener();
});
