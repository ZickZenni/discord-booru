const BaseBooru = require("../structures/BaseBooru");
const fetch = require('node-fetch');
const parseString = require("xml2js").parseString;
const booru = require('../index');
const { errorMessage } = require('../utils/ErrorHandler');

module.exports = class Konachan extends BaseBooru {
    constructor() {
        super("konachan", true, false, []);
    }

    async getPosts(tags, rating, limit) {

        return new Promise(( resolve, reject ) => {
            var postsArray = [];

            fetch(`https://konachan.com/post.xml?tags=${rating}+${tags}&limit=${limit}`)
            .then( function(res) {
                try {
                    res = res.text();
                } catch (e) {
                    console.log(e);

                    if (!res) {
                        resolve(new errorMessage('NO_POSTS_FOUND'));
                        return;
                    }

                    resolve(new errorMessage('UNKNOWN_ERROR'));
                    return;
                }

                return res;
            })
            .then(async function(almostJSON) {
                await parseString(almostJSON, async function(err, res) {
                    if (err) {
                        resolve(new errorMessage('BOORU_NOT_AVAILABLE'));
                        return;
                    }
        
                    const json = JSON.parse(JSON.stringify(res, null, 2));
        
                    if (json == undefined) {
                        resolve(new errorMessage('ERROR_JSON_PARSE'));
                        return;
                    }
        
                    if (json.posts["post"] == undefined) {
                        resolve(new errorMessage('NO_POSTS_FOUND'));
                        return;
                    }
        
                    const posts = json.posts["post"];
        
                    var postsArray = [];
        
                    posts.forEach(element => {
                        const jsonTags = element['$'].tags.replace(/[^a-zA-Z ]/g, "")
            
                        var json = `{ "id":"${element['$'].id}", "tags":"${jsonTags}", "author":"${element['$'].creator_id}", "compressed_file_url":"${encodeURI(element['$'].sample_url)}", "original_file_url":"${encodeURI(element['$'].file_url)}", "rating":"${element['$'].rating}", "booru":"konachan"}`
            
                        try {
                            var aJSON = JSON.parse(json);
                        } catch(e) {
                            console.log(e);
                            resolve(new errorMessage('ERROR_JSON_PARSE'));
                            return;
                        }
            
                        postsArray.push(aJSON);
                    });
            
                    resolve(postsArray);
                });
            });
        });
    }
};