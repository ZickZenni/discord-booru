const package = require('../package.json');
const fetch = require('node-fetch');

function checkUpdate(logConsole = false) {
    fetch("https://raw.githubusercontent.com/ZickZenni/discord-booru/main/package.json", { method: "GET" })
    .then((res) => res.json())
    .then((json) => {
        if (package.version != json.version) {
            if (logConsole) {
                console.log("[discord-booru] There is currently a update available, " + json.version);
                console.log("[discord-booru] Update it using: npm install discord-booru@latest");
            }

            return json.version;
        }
    });

    return package.version;
}

function getCurrentVersion() {
    return package.version;
}

module.exports = {
    checkUpdate,
    getCurrentVersion,
}