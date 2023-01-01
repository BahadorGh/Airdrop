const fs = require("fs");
const hre = require("hardhat");
const path = require("path");


async function main() {
  
  const Airdrop = await hre.ethers.getContractFactory("Airdrop");
  console.log(Airdrop);
  console.log('-----------------');
  const airdrop = await Airdrop.deploy();
  console.log(airdrop);
  console.log('-----------------');
  
  await airdrop.deployed();

  saveFrontendFiles(airdrop);
  
  console.log(
    `Airdrop contract deployed to ${airdrop.address}`
  );
}

function saveFrontendFiles(myContract) {
  const fs = require('fs');
  const contractsDir = path.join(__dirname, "..", "..", "/frontend", "src", "contracts");

  if(!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "Airdrop-address.json"),
    JSON.stringify({["Airdrop-address"]: myContract.address}, undefined, 2)
  );

  const airdropArtifact = artifacts.readArtifactSync("Airdrop");

  fs.writeFileSync(
    path.join(contractsDir, "Aidrop.json"),
    JSON.stringify(airdropArtifact, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
