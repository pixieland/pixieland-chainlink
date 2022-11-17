import { ethers } from "hardhat";

async function main() {
  
  const PixielandNFTMarketplace = await ethers.getContractFactory("PixielandNFTMarketplace");
  const pixielandNFTMarketplace = await PixielandNFTMarketplace.deploy();

  await pixielandNFTMarketplace.deployed();

  console.log(`pixielandNFTMarketplace address: ${pixielandNFTMarketplace.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
