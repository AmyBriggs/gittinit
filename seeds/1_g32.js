'use strict';

exports.seed = (knex) => {
  return knex(`g32`).del().then(() => {
    return knex(`g32`).insert([
      {
        avatar: `https://avatars.githubusercontent.com/u/20324499?v=3`,
        name: `Ali Hobbs`,
        username: `Alisuehobbs`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/18018191?v=3`,
        name: `Anna Baldwin`,
        username: `ambaldwin21`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/17297958?v=3`,
        name: `Amy Briggs`,
        username: `AmyBriggs`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/17367713?v=3`,
        name: `Beth Mason`,
        username: `BAMason`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/983780?v=3`,
        name: `Cole Chambers`,
        username: `colechambers`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/19787971?v=3`,
        name: `Courtney Sanders`,
        username: `courtneysanders418`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/6265115?v=3`,
        name: `Craig Quincy`,
        username: `craigquincy`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/20618692?v=3`,
        name: `David Hernandez`,
        username: `David-H-152402`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/7654369?v=3`,
        name: `Elana Kopelevich`,
        username: `elanalynn`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/17663335?v=3`,
        name: `Gordon Graham`,
        username: `gordonhgraham`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/13577826?v=3`,
        name: `James Freeman`,
        username: `FreemanJamesH`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/18269184?v=3`,
        name: `Kelsey Chapman`,
        username: `kelseychapman`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/19519598?v=3`,
        name: `Kristin Sztengel`,
        username: `ksztengel`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/11381042?v=3`,
        name: `Lisa Ma`,
        username: `limawebdev1`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/19481583?v=3`,
        name: `Maria Bogomaz`,
        username: `mariajcb`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/10106752?v=3`,
        name: `Matthew Bouchard`,
        username: `MatieuB`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/20565731?v=3`,
        name: `Matt Cooper`,
        username: `MrCooper42`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/19732249?v=3`,
        name: `Matt Gardner`,
        username: `mattlg24`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/14320947?v=3`,
        name: `Matthew Works`,
        username: `mworks4905`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/6216194?v=3`,
        name: `Scotty Van Gilder`,
        username: `ScottyVG`,
      },
      {
        avatar: `https://avatars.githubusercontent.com/u/16392373?v=3`,
        name: `Zach Dillie`,
        username: `Dillie-Z`,
      },
    ]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(`g32`);
};
