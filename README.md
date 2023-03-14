# Wiiqare Smart Contract

This project contains the smart contracts, deployments scripts, unit tests and utils for the blockchain infrastructure.

## Architecture
![Wiiqare Blockchain Architecture](resources/wiiqare_architecture.png)
## How to run?
On root run:
1. To install all dependencies  ``` npm i ```
2. To start a local node: ``` npx hardhat node ```
3. To compile the smart contracts: ``` npx hardhat compile ```
4. To execute the unit tests: ```npx hardhat test```
3. To deploy a smart contract ```npx hardhat run --network localhost scripts/deployWiiQareVoucherV1.ts``` (change the network option for deploying on testnet to mumbai or mainnet polygon)