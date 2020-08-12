const { tenorKey } = require('./config.json');
const fetch = require("node-fetch");
let settings = {method: "Get"};

module.exports = {
    GetReaction: GetReaction = (queryString, resultLimit) => {
        return new Promise((resolve, reject) => {
            const limit = (resultLimit == null || isNaN(resultLimit) || resultLimit < 1 || resultLimit > 50) ? 50 : resultLimit;
            const url = `https://api.tenor.com/v1/search?q=${queryString}&key=${tenorKey}&limit=${limit}&media_filter=minimal`;
            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    const results = json.results;
                    let targetResult;
                    if(limit > 1){
                        targetResult = results[Math.floor(Math.random() * results.length)];
                    }
                    else {
                        targetResult = results[0]; //this if else could be removed but not sure if floor and random are expensive :/
                    }                    
                    resolve(targetResult.media[0].gif.url);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                })
        });
    },

    GetNotFoundReactionUrl: GetNotFoundReactionUrl = (queryString, resultLimit) => {
        return GetReaction('lost', 50);
    },

    GetLaughingReactionUrl: GetLaughingReactionUrl = (queryString, resultLimit) => {
        return GetReaction('lol', 50);
    }
}