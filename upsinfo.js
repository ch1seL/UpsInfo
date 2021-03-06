var snmp = require("net-snmp");
var upsIP = require('./settings.json').upsIP || "10.118.134.46";


var options = {
    port: 161,
    retries: 1,
    timeout: 1000,
    transport: "udp4",
    trapPort: 162,
    version: snmp.Version2c
};

var session = snmp.createSession(upsIP, "public", options);

var oids = [{
        name: "epm_temperature",
        oid: "1.3.6.1.4.1.935.10.1.1.6.1.1.0"
    },
    {
        name: "epm_humidity",
        oid: "1.3.6.1.4.1.935.10.1.1.6.2.1.0"
    }
];

module.exports.get = function(callback) {
    session.get(oids.map(function(item) { return item.oid; }), function(error, varbinds) {
        if (error) {
            error.type = "snmp";
            res = { date: Date.now(), error: error };
        } else {
            for (var i = 0; i < varbinds.length; i++)
                if (snmp.isVarbindError(varbinds[i]))
                    console.error(snmp.varbindError(varbinds[i]))
                else {
                    oids.find((item) => { return item.oid === varbinds[i].oid; }).value =
                        varbinds[i].oid === "1.3.6.1.4.1.935.10.1.1.6.1.1.0" ? varbinds[i].value / 10 : varbinds[i].value;
                }

            res = { date: Date.now() };
            oids.forEach((oid) => { res[oid.name] = oid.value })
        }

        callback(res);
    });
}