const BaseBooru = require("../structures/BaseBooru");
const fetch = require('node-fetch');

module.exports = class Yandere extends BaseBooru {
    constructor() {
        super("yandere", ["naked", "nipples", "breasts", "no_bra", "dildo"]);
    }

    async getPosts(tags, rating) {
        const response = await fetch(`https://yande.re/post.json?tags=${rating}+${tags.split(' ').join('+')}&limit=200&api_version=2`);
        const _json = await response.json();

        if (_json == undefined) {
            return ["Error occured"];
        }

        const posts = _json.posts;

        if (posts == undefined) {
            return ["No posts found"];
        }

        var postsArray = [];

        posts.forEach(element => {
            var json = `{ "id":"${element.id}", "tags":"${element.tags}", "author":"${element.author}", "compressed_file_url":"${element.sample_url}", "original_file_url":"${element.file_url}", "rating":"${element.rating}", "booru":"yandere"}`

            postsArray.push(JSON.parse(json));
        });

        return postsArray;
    }
};