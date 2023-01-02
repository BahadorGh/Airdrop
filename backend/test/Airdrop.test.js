const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// Mocha - testing framework
// Chai - assertion JS library

describe("Start Airdrop", function () {
  async function deployAidropContract() {
    // const myDecimal = [6, 9, 18, 20];
    const sampleTokenAddress = "0x53a62bf3807d848f26A4ACA7C2f60f8B6f42C1c4";
    const Airdrop = await ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy();
    await airdrop.startAirdrop(sampleTokenAddress, 18);

    return { airdrop };
  }

  it("Should accept decimals greater than 0", async () => {
    const { airdrop } = await loadFixture(deployAidropContract);

    expect(await airdrop.tokenDecimals()).to.greaterThan(
      ethers.BigNumber.from(10).pow(0)
    );
  });

  it("Should not accept decimals more than 18", async () => {
    const { airdrop } = await loadFixture(deployAidropContract);

    // expect(await airdrop.tokenDecimals()).to.equal(BigInt(10 ** 18));
    expect(await airdrop.tokenDecimals()).to.lessThanOrEqual(
      ethers.BigNumber.from(10).pow(18)
    );
  });
});
