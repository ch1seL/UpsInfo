var snmp = require("net-snmp");

var options = {
    port: 161,
    retries: 1,
    timeout: 5000,
    transport: "udp4",
    trapPort: 162,
    version: snmp.Version2c
};

var session = snmp.createSession("10.118.134.46", "public", options);

var oids = [
    {
        name: "epm temperature",
        oid: "1.3.6.1.4.1.935.10.1.1.6.1.1.0"
    },
    {
        name: "epm humidity",
        oid: "1.3.6.1.4.1.935.10.1.1.6.2.1.0"
    }
];

module.exports.get = function (callback) {

callback({name: 'qweqweqwe'});
return;

    session.get(oids.map(function (item) { return item.oid; }), function (error, varbinds) {
        if (error) {
            console.error(error);
            callback(error);
        } else {
            for (var i = 0; i < varbinds.length; i++)
                if (snmp.isVarbindError(varbinds[i]))
                    console.error(snmp.varbindError(varbinds[i]))
                else {
                    oids.find((item) => { return item.oid === varbinds[i].oid; }).value =
                        varbinds[i].oid === "1.3.6.1.4.1.935.10.1.1.6.1.1.0" ? varbinds[i].value / 10 : varbinds[i].value;
                }
            callback(oids.map((item) => { return { name: item.name, value: item.value } }));
        }
    });
}