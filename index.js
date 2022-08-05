// https://dynamicdns.park-your-domain.com/update?host=@&domain=dev-r.ml&password=55188bba269744b18a827918f9becc97&ip=127.0.0.1

const axios = require("axios");
const fs = require("fs");
const xml2js = require("xml2js");

if (!fs.existsSync("config.json")) {
    fs.writeFileSync(
        "config.json",
        JSON.stringify({
                updateDelay: 300,
                hosts: [{
                    host: "",
                    domain: "",
                    password: "",
                }, ],
            },
            null,
            2
        )
    );
    console.log("Please update new config file!");
    return;
}

var configRaw = fs.readFileSync("config.json");
var config = JSON.parse(configRaw);

async function sendData(ip) {
    console.log(ip);
    for (var i = 0; i < config.hosts.length; i++) {
        var cdata = config.hosts[i];
        console.log("Updating HOST " + cdata.host + "." + cdata.domain + "!");
        var resp = await axios.get(
            "https://dynamicdns.park-your-domain.com/update?host=" +
            cdata.host +
            "&domain=" +
            cdata.domain +
            "&password=" +
            cdata.password +
            "&ip=" +
            ip
        );
        var data = await xml2js.parseStringPromise(resp.data);
        if (data["interface-response"].ErrCount[0] != "0") {
            console.log(
                "Error updating HOST " + cdata.host + "." + cdata.domain + "!"
            );
            console.log(data["interface-response"].errors);
        } else if (data["interface-response"].Done[0] == "true") {
            console.log(
                "Updated HOST " + cdata.host + "." + cdata.domain + " successfully!"
            );
        } else {
            console.log(
                "Error updating HOST " + cdata.host + "." + cdata.domain + "!"
            );
        }
    }
}

console.log(config);

var first = async() => {
    console.log("Searching for Public IP...");
    var data = await axios.get("https://api.ipify.org?format=json");
    console.log("Found Public IP: " + data.data.ip);
    sendData(data.data.ip);
};

first();

setInterval(async() => {
    first();
}, config.updateDelay * 1000);