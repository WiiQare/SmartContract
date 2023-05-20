# Wiiqare Smart Contract

[![codecov](https://codecov.io/gh/WiiQare/SmartContract/branch/main/graph/badge.svg?token=6SISWMAK0V)](https://codecov.io/gh/WiiQare/SmartContract)

This project contains the smart contracts, deployments scripts, unit tests and utils for the blockchain infrastructure.

## Architecture

![Wiiqare Blockchain Architecture](resources/wiiqare_architecture.png)

## How to run?

On root run:

1. To install all dependencies `npm i`
2. To start a local node: `npm run dev`
3. To compile the smart contracts: `npm run compile`
4. To execute the unit tests: `npm run test`
5. To deploy a smart contract `npx hardhat run --network localhost scripts/deployWiiQareVoucherV1.ts` (change the network option for deploying on testnet to mumbai or mainnet polygon)
