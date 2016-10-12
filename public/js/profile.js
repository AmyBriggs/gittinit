'use strict';

$(document).ready(() => {
  console.log("i am here");

  // const username = `mrcooper42`;
  const username = $(`h3`).children(`a`).text();
  const repos = [];
  const renderRepos = () => {
    $(`#repos`).empty();
    const sorted = repos.sort((a, b) => {
      (a.updated_at < b.updated_at) ? -1: ((a.updated_at > b.updated_at) ? 1 : 0);
    });
    console.log(sorted);
    for (const sort of sorted) {
      const $col = $('<div class="col s12">');
      const $card = $('<div class="card hoverable">');
      const $content = $('<div class="card-content">');
      const $title = $('<div class="card-title truncate">');
      const $link = $('<a href="#">');
      $link.attr('href', sort.url.replace(/api\./, ``).replace(/\/repos/, ``));
      $title.text(sort.name);
      $link.append($title);
      $content.append($link);
      $card.append($content);
      $col.append($card);
      $(`#repos`).append($col);
      $content.append('updated on: ' + sort.updated_at.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/, "$2/$3/$1 $4:$5:$6"))
      $content.append('<br>created on: ' + sort.created_at.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/, "$2/$3/$1 $4:$5:$6"))
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
