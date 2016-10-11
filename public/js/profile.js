'use strict';

$(document).ready(() => {
  console.log("i am here");

  const username = `mrcooper42`;
  const repos = [];
  const renderRepos = () => {
    $(`#repos`).empty();

    for (const repo of repos) {
      const $col = $('<div class="col s12">');
      const $card = $('<div class="card hoverable">');
      const $content = $('<div class="card-content">');
      const $title = $('<div class="card-title truncate">');
      const $link = $('<a href="#">');
      $link.attr('href', repo.url.replace(/api\./, ``).replace(/\/repos/, ``));
      $title.text(repo.name);
      $link.append($title);
      $content.append($link);
      $card.append($content);
      $col.append($card);
      $(`#repos`).append($col);
    }
  };
  $.ajax({
    dataType: `json`,
    url: `https://api.github.com/users/` + username + `/repos`,
    success: (returnData) => {
      for (let i = 0; i < returnData.length; i++) {
        repos.push(returnData[i]);
      }
      renderRepos();
      console.log(repos[2].name);
      console.log(`I was loaded`, returnData.length);
    },
  });
});
