const BaseBooru = require("../structures/BaseBooru");
const fetch = require('node-fetch');
const { errorMessage } = require('../utils/ErrorHandler');

module.exports = class Yandere extends BaseBooru {
    constructor() {
        super("yandere", true, false, ["nipples", "breasts", "no_bra", "dildo"]);
    }

    async getPosts(tags, rating, limit) {
        return new Promise( ( resolve, reject ) => {
            let uri = `https://yande.re/post.json?tags=${rating}+${tags}&limit=${limit}&api_version=2`;

            fetch(uri)
            .then((res) => res.json())
            .then(async (json) => {
                if (json == undefined) {
                    resolve(new errorMessage('BOORU_NOT_AVAILABLE'));
                    return;
                }
        
                const posts = json.posts;
        
                if (posts == undefined) {
                    resolve(new errorMessage('NO_POSTS_FOUND'));
                    return;
                }

                if (posts.length == 0) {
                    resolve(new errorMessage('NO_POSTS_FOUND'));
                    return;
                }
        
                var postsArray = [];
        
                await posts.forEach(element => {
                    var json = `{ "id":"${element.id}", "tags":"${element.tags}", "author":"${element.author}", "compressed_file_url":"${element.sample_url}", "original_file_url":"${element.file_url}", "rating":"${element.rating}", "booru":"yandere"}`
        
                    postsArray.push(JSON.parse(json));
                });
        
                resolve(postsArray);
            });
        });
    }
};