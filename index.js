const path = require('path');
const tinyurl = require("tinyurl");
const { MessageEmbed } = require('discord.js');
const fs = require('fs').promises;

const BaseBooru = require('./structures/BaseBooru');
var boorus = new Map();
var boorusArray = [];

async function getPosts(booru, tags = '', rating = 'rating:s') {
  if (boorusArray.length == 0) {
    await registerBoorus('./boorus');
  }

  const booruClass = boorus.get(booru.toLowerCase());

  if (booruClass == undefined)
    return;

  const posts = await booruClass.getPosts(tags, rating);

  if (posts == undefined)
    return;

  return posts;
}

async function registerBoorus(dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);

  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerBoorus(path.join(dir, file));
    if (file.endsWith('.js')) {
      const Booru = require(path.join(filePath, file));
      if (Booru.prototype instanceof BaseBooru) {
        const booru = new Booru();
        boorus.set(booru.name, booru);
        boorusArray.push(booru);
      }
    }
  }
}

function getRandomPost(posts) {
  const index = Math.floor(Math.random() * posts.length);
  let post = posts[index];

  return post;
}

async function isNSFW(post) {

  if (post.rating === "e") {
    return true;
  }

  var nsfw = false;

  if (post.rating === "q") {
    const booruClass = boorus.get(post.booru);

    await booruClass.nsfwtags.forEach(element => {
      if (post.tags.includes(element))
        nsfw = true;
    });
  }

  return nsfw;
}

function isChannelNSFW(channel) {
  return channel.nsfw;
}

async function createEmbed(post, showSource = false, color = '', title = '', description = '', footer = '') {
  let embed = new MessageEmbed()
  .setColor(color)
  .setImage(post.compressed_file_url)
  .setTitle(title)
  .setDescription(description)
  .setFooter(footer);

  if (showSource) {
    await tinyurl.shorten(post.original_file_url).then(function(res) {
      embed.addFields(
        { name: 'Source', value: `||${res}||`});
    });
  }

  return embed;
}

module.exports = {
  getPosts,
  getRandomPost,
  isNSFW,
  isChannelNSFW,
  createEmbed,
}