const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

let tokenUris = [
    "ipfs://QmcB2XkPuTQbDHxXLh6ePceFJrrFVTzdTJivVYcUrd2iao",
    "ipfs://QmcgnU1uAmixfkhAB23v3p4U2qxSKadEkLzqe2QW3wk7Rf",
    "ipfs://Qmas9KVEPyK9MEpJeQoxPQAkJEzxQTF4iXPS7qmsjstGjy",
    "ipfs://QmW7Bg7UjdqdxCbXufzrmPqPjAM6fgr2G3iyZobYNZU75H",
]

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId

    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
    subscriptionId = networkConfig[chainId].subscriptionId

    log("----------------------------------------------------")
    arguments = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["mintFee"],
        networkConfig[chainId]["callbackGasLimit"],
        tokenUris,
    ]
    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(randomIpfsNft.address, arguments)
    }
}

module.exports.tags = ["all", "randomipfs", "main"]
