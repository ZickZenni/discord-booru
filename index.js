const fs = require('fs').promises;
const tinyurl = require("tinyurl");
const { MessageEmbed } = require('discord.js');
const path = require('path');
const BaseBooru = require('./structures/BaseBooru');
const { errorMessage } = require('./utils/ErrorHandler');
const updateUtils = require('./utils/UpdateUtils');

let boorus = new Map();
let boorusArray = [];

async function getPosts(booru, tags = [], { limit = 200, rating = "s" } = {}) {
    if (boorusArray.length == 0) {
        await registerBoorus('./boorus');
    }

    booru = stringToBooru(booru);

    if (booru === false) {
        return new errorMessage('BOORU_NOT_FOUND');
    }

    if (tags instanceof Array) {
        var _tags = "";

        var index;
        for (index = 0; index < tags.length; index++) {
            if (_tags == "") {
                _tags = tags[index];
            } else {
                _tags = _tags + "+" + tags[index];
            }
        }

        tags = _tags;
    } else {
        tags = tags.split(' ').join('+');
    }

    if (typeof limit !== 'number' && !Number.isNaN(limit)) {
        return new errorMessage('LIMIT_MUST_BE_A_NUMBER');
    }

    rating = resolveRating(rating);

    if (rating === false)
        rating = "rating:s";

    const response = await booru.getPosts(tags, rating, limit);

    return response;
}

async function getRandomPost(posts) {
    if (boorusArray.length == 0) {
        await registerBoorus('./boorus');
    }

    const index = Math.floor(Math.random() * posts.length);
    let post = posts[index];

    return post;
}

async function randomBooru() {
    if (boorusArray.length == 0) {
        await registerBoorus('./boorus');
    }

    const index = Math.floor(Math.random() * boorusArray.length);
    let booru = boorusArray[index];

    return booru.name;
}

function isErrorMessage(post) {
    if (post.err != undefined) {
        return true;
    } 
    return false;
}

function getErrorMessage(post) {
    if (post.err == undefined)
        return "NOT_AN_ERROR";

    return post.err;
}

async function isNSFW(post) {
    if (boorusArray.length == 0) {
        await registerBoorus('./boorus');
    }

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

function containsNSFWPosts(booru) {
    const booruClass = boorus.get(booru);

    if (booruClass == undefined) {
        return false;
    }

    return booruClass.containsNSFW;
}

function onlyNSFWPosts(booru) {
    const booruClass = boorus.get(booru);

    if (booruClass == undefined) {
        return false;
    }

    return booruClass.onlyNSFWPosts;
}

async function createEmbed(post, showSource = false, { color = '', title = '', description = '', footer = '' } = {}) {
    let embed = new MessageEmbed()
        .setColor(color)
        .setImage(post.compressed_file_url)
        .setTitle(title)
        .setDescription(description)
        .setFooter(footer);

    if (showSource) {
        await tinyurl.shorten(post.original_file_url).then(function (res) {
            embed.addFields(
                { name: 'Source', value: `||${res}||` });
        });
    }

    return embed;
}

function resolveRating(rating) {
    if (typeof rating !== 'string')
        return false;

    switch (rating) {
        case "s":
            return "rating:s";
        case "q":
            return "rating:q";
        case "e":
            return "rating:e";
        default:
            return "rating:s";
    }
}

function stringToBooru(booru) {
    if (typeof booru !== 'string')
        return false;

    booru = booru.toLowerCase();

    const booruClass = boorus.get(booru);

    if (booruClass != undefined)
        return booruClass;

    return false;
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

module.exports.getPosts = getPosts;
module.exports.getRandomPost = getRandomPost;
module.exports.randomBooru = randomBooru;
module.exports.isErrorMessage = isErrorMessage;
module.exports.getErrorMessage = getErrorMessage;
module.exports.isNSFW = isNSFW;
module.exports.isChannelNSFW = isChannelNSFW;
module.exports.containsNSFWPosts = containsNSFWPosts;
module.exports.onlyNSFWPosts = onlyNSFWPosts;
module.exports.createEmbed = createEmbed;
module.exports.checkUpdate = updateUtils.checkUpdate;
module.exports.getCurrentVersion = updateUtils.getCurrentVersion;