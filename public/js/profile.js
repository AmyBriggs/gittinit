'use strict';

$(document).ready(() => {
  console.log("i am here");

  $.ajax({
    dataType: `json`,
    url: `https://api.github.com/users/mrcooper42/repos`,
    success: (returndata) => {
      console.log(`I was loaded`, returndata);
    },
  });



  //   jQuery.githubUser = (username, callback) => {
  //     jQuery.getJSON(`https://api.github.com/users/` + username + `/repos?callback=?`, callback)
  //   }
  //
  //   jQuery.fn.loadRepositories = (username) => {
  //     this.html(`<span>Query github for ` + username + `'s repos...</span>`)
  //
  //     const target = this;
  //     $.githubUser(username, (data) => {
  //       const repos = data.data;
  //       sortByName(repos);
  //
  //       const list = $(`<dl/>`);
  //       target.empty().append(list);
  //       $(repos).each(() => {
  //         if (this.name != (username.toLowerCase() + `/github.com`)) {
  //           list.append(`<dt><a href="` + (this.homepage ? this.hopepage : this.html_url) + `">` + this.name + `</a> <em>` + (this.language ? (`(` + this.language + `)`) : ``) + `</em></dt>`);
  //           list.append(`<dd>` + this.description + `</dd>`);
  //         };
  //       })
  //     });
  //
  //     const sortByName = (repos) => {
  //       repos.sort((a, b) => a.name - b.name);
  //     }
  //   };
});
