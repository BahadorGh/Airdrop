const path = require('path');
const { ethers } = require("hardhat");
const { artifacts } = require('hardhat');


async function main() {
    const Token = await ethers.getContractFactory("BGToken");
    const token = await Token.deploy();

    await token.deployed();

    console.log(`BGToken deployed to: ${token.address}`);

    saveFrontendFiles(token);
}


function saveFrontendFiles(myContract) {
    const fs = require('fs');
    const contractsDir = path.join(__dirname, "..", "..", "/frontend", "src", "contracts");
  
    if(!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, "Token-address.json"),
      JSON.stringify({["BGToken-address"]: myContract.address}, undefined, 2)
    );
  
    const BGTokenArtifact = artifacts.readArtifactSync("BGToken");
  
    fs.writeFileSync(
      path.join(contractsDir, "BGToken.json"),
      JSON.stringify(BGTokenArtifact, null, 2)
    );
  
  
  }

main().catch( (error) => {
    console.error(error);
    process.exitCode =1 ;
})