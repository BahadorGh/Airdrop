require("@nomicfoundation/hardhat-toolbox");
const { ethers } = require("hardhat");
const path = require('path');

require('dotenv').config(
    {path: path.resolve(__dirname, "../.env")}
);

const [private_key, network] = [process.env.PRIVATE_KEY, process.env.NETWORK_PROVIDER];

const contractABI = require('../artifacts/contracts/Airdrop.sol/Airdrop.json');
const contractAddr = require("../../frontend/src/contracts/Airdrop-address.json");
// const contractABI = ethers.artifacts.readArtifact("Airdrop");

const provider = new ethers.providers.JsonRpcProvider(network);
const signer = new ethers.Wallet(private_key, provider);
const airdropContract = new ethers.Contract(contractAddr["Airdrop-address"], contractABI.abi, signer);


async function main() {
    const whiteListed = await currentAccounts();
    let my = [];
    let my1 = [];
    for(const item in whiteListed) {
        let my2 = new WhiteListData('','');
        my.push(whiteListed[item]);
        my1.push(100000000000000000000);
    }
    addToWhiteList(my,my1);

}

const beginAirdrop = async () => {
    const tokenAddress = require('../../frontend/src/contracts/Token-address.json');
    const tokenDecimal = 18;

    const tx = await airdropContract.startAirdrop(tokenAddress, tokenDecimal);
    const txReciept = await tx.wait();

    console.log(`----------------`);
    const currentTime = new Date(Date.now());
    console.log(`Aidrop started at ${currentTime}!`);
    console.log(`The transaction status:${txReciept.status }`);
    showTransactionHash(txReciept);

}


function WhiteListData(walletAddress, airdropAmount) {
    this.walletAddress = walletAddress;
    this.airdropAmount = airdropAmount;
    this.FullData = function() {
        return this.walletAddress + " " + this.airdropAmount;
    }
}


const addToWhiteList = async (whiteListedAccount, airdropAmount) => {
    this.whiteListedAccount = whiteListedAccount;
    this.airdropAmount = airdropAmount;

    const tx = await airdropContract.setWhitelist(this.whiteListedAccount, this.airdropAmount);
    const txReceipe = await tx.wait();
    showTransactionHash(txReceipe);
}


const stopAirdrop = async () => {
    const stopTx = await airdropContract.stopAirdrop();
    const txReceipe = await stopTx.wait();
    showTransactionHash(txReceipe);
}


const currentAccounts = async () => {
    const wallets = await ethers.getSigners();
    // const walletProvider = ethers.provider;
    let walletAddresses = [];
    for (const wallet of wallets) {
        walletAddresses.push(wallet.address);
    }
    // console.log(walletAddresses);
    // checkAccontBalances(walletAddresses);
    return walletAddresses;
}


const checkAccontBalances = async (accountAddress) => {
    const walletProvider = ethers.provider;
    for (const wallet of accountAddress) {
        console.log(
            "%s (%s ETH)",
            wallet,
            ethers.utils.formatEther(
                await walletProvider.getBalance(wallet))
        );
    }
}


const checkTokenDecimals = async () => {
    const txTokenDecimals = await airdropContract.tokenDecimals();
    await txTokenDecimals.wait();
    console.log(`Token decimals is: ${txTokenDecimals}`);
}


const showTransactionHash = async (txHash) => {
    console.log(`Transaction hash is: ${txHash.transactionHash}`);
}


main().catch( (error) => {
    console.error(error);
    process.exitCode = 1;
})