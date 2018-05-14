export default function promisifyWeb3(web3) {
    // Pipes values from a Web3 callback.
    const newWeb3 = Object.assign({}, web3);
    const callbackToResolve = function (resolve, reject) {
        return function (error, value) {
            if (error) {
                reject(error);
            } else {
                resolve(value);
            }
        };
    };

    // List synchronous functions masquerading as values.
    const syncGetters = {
        db: [],
        eth: ["accounts", "blockNumber", "coinbase", "gasPrice", "hashrate",
            "mining", "protocolVersion", "syncing"
        ],
        net: ["listening", "peerCount"],
        personal: ["listAccounts"],
        shh: [],
        version: ["ethereum", "network", "node", "whisper"]
    };

    Object.keys(syncGetters).forEach(function (group) {
        Object.keys(newWeb3[group]).forEach(function (method) {
            if (syncGetters[group].indexOf(method) > -1) {
                // Skip
            } else if (typeof newWeb3[group][method] === "function") {
                newWeb3[group][method + "Promise"] = function () {
                    let args = arguments;
                    return new Promise(function (resolve, reject) {
                        args[args.length] = callbackToResolve(resolve, reject);
                        args.length++;
                        newWeb3[group][method].apply(newWeb3[group], args);
                    });
                };
            }
        });
    });
    return newWeb3;
}