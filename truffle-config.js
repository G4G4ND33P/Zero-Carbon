const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "large book spray click plate remove antenna mix gain arm choose basic"

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        ropsten: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/e7559139de5c4fd39e5f0234744eaf42")
            },
            //gasPrice: 25000000000,
            gasPrice: 3000000,
            network_id: 3
        },
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
}