'use strict';

// login button clicked!
const loginButtonListener = () => {
  $(`#login-button`).click(() => {
    $(`#login-button`).addClass(`active`);
    window.location = `/auth/github`;
  });
};

// logout button clicked!
const logoutButtonListener = () => {
  $(`#logout-button`).click(() => {
    window.location = `/logout`;
  });
};

// profile edit button clicked!
const editProfileListener = () => {
  $(`#edit-profile`).click(() => {
    window.location = `/edit`;
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
      url: `/edit`,
    })
    .done(() => { window.location = `/index`; });
  });
};

$(document).ready(() => {
  loginButtonListener();
  logoutButtonListener();
  editProfileListener();
  updateProfileListener();
});
