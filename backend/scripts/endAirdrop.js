require("@nomicfoundation/hardhat-toolbox");;
const { ethers } = require("hardhat");
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

const beginAirdrop = async () => {
    const tx = await airdropContract.stopAirdrop();
    const txReciept = await tx.wait();

    console.log(`----------------`);
    console.log(`Done!`);
    const currentTime = new Date(Date.now());
    console.log(`Aidrop stoped at ${currentTime}!`);
    console.log(`the transaction details:${txReciept.transactionHash }`);

}


beginAirdrop().catch( (error) => {
    console.error(error);
    process.exitCode = 1;
})