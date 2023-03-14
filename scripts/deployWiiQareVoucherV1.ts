import { ethers } from "hardhat";

async function main() {

  const WiiQareVoucherV1 = await ethers.getContractFactory("WiiQareVoucherV1");
  const wiiQareVoucherV1 = await WiiQareVoucherV1.deploy();

  await wiiQareVoucherV1.deployed();

  console.log(
    `Wiiqare contract deployed to ${wiiQareVoucherV1.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
