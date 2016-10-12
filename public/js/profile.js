/* eslint-disable max-len */
'use strict';

$(document).ready(() => {
  const username = $(`h3`).children(`a`).text();
  const repos = [];
  const renderRepos = () => {
    $(`#repos`).empty();
    const sorted = repos.sort((a, b) => b.updated_at < a.updated_at);

    for (const sort of sorted) {
      const $col = $(`<div class="col s12">`);
      const $card = $(`<div class="card hoverable">`);
      const $content = $(`<div class="card-content">`);
      const $title = $(`<div class="card-title truncate">`);
      const $link = $(`<a href="#">`);
      $link.attr(`href`, sort.url.replace(/api\./, ``).replace(/\/repos/, ``));
      $title.text(sort.name);
      $link.append($title);
      $content.append($link);
      $card.append($content);
      $col.append($card);
      $(`#repos`).append($col);
      $content.append(`updated on: ${sort.updated_at.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/, `$2/$3/$1 $4:$5:$6`)}`);
      $content.append(`<br>created on: ${sort.created_at.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/, `$2/$3/$1 $4:$5:$6`)}`);
    }
  };
  $.ajax({
    dataType: `json`,
    success: (returnData) => {
      for (let i = 0; i < returnData.length; i++) {
        repos.push(returnData[i]);
      }
      renderRepos();
    },
    url: `https://api.github.com/users/${username}repos`,
  });
});
