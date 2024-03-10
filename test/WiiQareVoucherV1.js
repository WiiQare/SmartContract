const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Wiiqare Voucher Contract Events", function () {
  async function deployContractFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    const WiiqareVoucher = await ethers.getContractFactory("WiiQareVoucherV1");
    const wiiqareVoucher = await WiiqareVoucher.deploy(owner.address);
    await wiiqareVoucher.deployed();
    return { wiiqareVoucher, owner, user1, user2 };
  }

  describe("Wiiqare Voucher Contract Functions", function () {
    it("Should allow the contract owner to burn a voucher", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const newVoucher = [ethers.BigNumber.from(50), "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const burnedVoucher = [ethers.BigNumber.from(0), "", "", "", "", ""];

      await wiiqareVoucher.mintVoucher(newVoucher);
      const currentVoucherID = await wiiqareVoucher.getCurrentVoucherID();
      await wiiqareVoucher.burn(parseInt(currentVoucherID));
      expect(await wiiqareVoucher.vouchers(parseInt(currentVoucherID))).to.eql(burnedVoucher);
    });

    it("Should allow the contract owner to mint a voucher", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const newVoucher = [ethers.BigNumber.from(50), "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const currentVoucherID = await wiiqareVoucher.getCurrentVoucherID();
      await wiiqareVoucher.mintVoucher(newVoucher);
      const voucherMinted = await wiiqareVoucher.vouchers(parseInt(currentVoucherID));
      expect(voucherMinted.slice(0)).to.eql(newVoucher);
    });

    it("Should allow the contract owner to transfer the ownership of a voucher", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const newVoucher = [ethers.BigNumber.from(50), "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const newOwner = "platformUserA";

      const currentVoucherID = await wiiqareVoucher.getCurrentVoucherID();
      await wiiqareVoucher.mintVoucher(newVoucher);
      await wiiqareVoucher.transferVoucher(parseInt(currentVoucherID), newOwner);
      const voucher = await wiiqareVoucher.vouchers(parseInt(currentVoucherID));
      expect(voucher.ownerID).to.equal(newOwner);
    });

    it("Should allow the contract owner to alter a voucher", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const oldVoucher = [ethers.BigNumber.from(30), "USD", "hospitalB", "hospitalB", "pacientA", "claimed"];

      const newVoucher = [ethers.BigNumber.from(50), "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const currentVoucherID = await wiiqareVoucher.getCurrentVoucherID();
      await wiiqareVoucher.mintVoucher(oldVoucher);
      const initialVoucher = await wiiqareVoucher.vouchers(parseInt(currentVoucherID));
      expect(initialVoucher.slice(0)).to.eql(oldVoucher);

      await wiiqareVoucher.alterVoucher(parseInt(currentVoucherID), newVoucher);
      const alteredVoucher = await wiiqareVoucher.vouchers(parseInt(currentVoucherID));
      expect(alteredVoucher.slice(0)).to.eql(newVoucher);
    });

    it("Should allow the contract owner to split a voucher", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const initialVoucher = [225, "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const firstVoucher = [125, "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const secondVoucher = [100, "USD", "hospitalA", "hospitalA", "pacientA", "claimed"];

      const burnVoucher = [ethers.BigNumber.from(0), "", "", "", "", ""];
      await wiiqareVoucher.mintVoucher(initialVoucher);
      await wiiqareVoucher.mintVoucher(initialVoucher);
      await wiiqareVoucher.splitVoucher(1, firstVoucher, secondVoucher);

      expect(await wiiqareVoucher.vouchers(1).value).to.eql(burnVoucher.value);
      expect(await wiiqareVoucher.vouchers(1).currencySymbol).to.eql(burnVoucher.currencySymbol);
      expect(await wiiqareVoucher.vouchers(1).ownerID).to.eql(burnVoucher.ownerID);
      expect(await wiiqareVoucher.vouchers(1).providerID).to.eql(burnVoucher.providerID);
      expect(await wiiqareVoucher.vouchers(1).beneficiaryID).to.eql(burnVoucher.beneficiaryID);
      expect(await wiiqareVoucher.vouchers(1).status).to.eql(burnVoucher.status);

      expect(await wiiqareVoucher.vouchers(2).value).to.eql(firstVoucher.value);
      expect(await wiiqareVoucher.vouchers(2).currencySymbol).to.eql(firstVoucher.currencySymbol);
      expect(await wiiqareVoucher.vouchers(2).ownerID).to.eql(firstVoucher.ownerID);
      expect(await wiiqareVoucher.vouchers(2).providerID).to.eql(firstVoucher.providerID);
      expect(await wiiqareVoucher.vouchers(2).beneficiaryID).to.eql(firstVoucher.beneficiaryID);
      expect(await wiiqareVoucher.vouchers(2).status).to.eql(firstVoucher.status);

      expect(await wiiqareVoucher.vouchers(3).value).to.eql(secondVoucher.value);
      expect(await wiiqareVoucher.vouchers(3).currencySymbol).to.eql(secondVoucher.currencySymbol);
      expect(await wiiqareVoucher.vouchers(3).ownerID).to.eql(secondVoucher.ownerID);
      expect(await wiiqareVoucher.vouchers(3).providerID).to.eql(secondVoucher.providerID);
      expect(await wiiqareVoucher.vouchers(3).beneficiaryID).to.eql(secondVoucher.beneficiaryID);
      expect(await wiiqareVoucher.vouchers(3).status).to.eql(secondVoucher.status);
    });

    it("Should allow the caller to get the next voucher id that will be minted", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const newVoucher = [ethers.BigNumber.from(50), "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const currentVoucherID = await wiiqareVoucher.getCurrentVoucherID();
      await wiiqareVoucher.mintVoucher(newVoucher);
      await wiiqareVoucher.mintVoucher(newVoucher);
      expect(parseInt(currentVoucherID) + 2).to.equal(parseInt(await wiiqareVoucher.getCurrentVoucherID()));
    });

    it("Should allow the caller to get all minted vouchers", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const newVoucher = [ethers.BigNumber.from(50), "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const currentVoucherID = await wiiqareVoucher.getCurrentVoucherID();
      await wiiqareVoucher.mintVoucher(newVoucher);
      await wiiqareVoucher.mintVoucher(newVoucher);
      expect(parseInt(currentVoucherID) + 2).to.equal(parseInt(await wiiqareVoucher.getCurrentVoucherID()));
    });
  });

  describe("Wiiqare Voucher Misc", function () {
    it("Should check if the contract owner is the deployer", async function () {
      const { wiiqareVoucher, owner } = await loadFixture(deployContractFixture);
      expect(await wiiqareVoucher.owner()).to.equal(owner.address);
    });

    it("Should check if the contract execution is paused or not", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);
      expect(await wiiqareVoucher.paused()).to.equal(false);
      await wiiqareVoucher.pause();
      expect(await wiiqareVoucher.paused()).to.equal(true);
      await wiiqareVoucher.unpause();
      expect(await wiiqareVoucher.paused()).to.equal(false);
    });

    it("Should allow the contract owner to transfer ownership", async function () {
      const { wiiqareVoucher, user1 } = await loadFixture(deployContractFixture);
      await wiiqareVoucher.transferOwnership(user1.address);
      expect(await wiiqareVoucher.owner()).to.equal(user1.address);
    });
  });

  describe("Wiiqare Voucher Contract Events", function () {
    it("Should fire an event when a voucher is minted", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const newVoucher = [50, "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const currentVoucherID = await wiiqareVoucher.getCurrentVoucherID();

      await expect(wiiqareVoucher.mintVoucher(newVoucher)).to.emit(wiiqareVoucher, "mintVoucherEvent").withArgs(parseInt(currentVoucherID), newVoucher);
    });

    it("Should fire the an event when a voucher ownership changes", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const newVoucher = [50, "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const currentVoucherID = await wiiqareVoucher.getCurrentVoucherID();
      await wiiqareVoucher.mintVoucher(newVoucher);
      await wiiqareVoucher.vouchers(parseInt(currentVoucherID));

      await expect(wiiqareVoucher.transferVoucher(parseInt(currentVoucherID), "pacientA"))
        .to.emit(wiiqareVoucher, "transferVoucherEvent")
        .withArgs(parseInt(currentVoucherID), "pacientA");
    });

    it("Should fire the an event when a voucher is altered", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const initialVoucher = [50, "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const newVoucher = [150, "USD", "pacientB", "hospitalA", "pacientB", "unclaimed"];

      const currentVoucherID = await wiiqareVoucher.getCurrentVoucherID();
      await wiiqareVoucher.mintVoucher(initialVoucher);
      await wiiqareVoucher.vouchers(parseInt(currentVoucherID));

      await expect(wiiqareVoucher.alterVoucher(parseInt(currentVoucherID), newVoucher))
        .to.emit(wiiqareVoucher, "alterVoucherEvent")
        .withArgs(parseInt(currentVoucherID), newVoucher);
    });

    it("Should fire the an event when a voucher is splitted", async function () {
      const { wiiqareVoucher } = await loadFixture(deployContractFixture);

      const initialVoucher = [250, "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const firstVoucher = [150, "USD", "wiiqare_admin", "hospitalA", "pacientA", "unclaimed"];

      const secondVoucher = [100, "USD", "wiiqare_admin", "hospitalA", "pacientA", "claimed"];

      await wiiqareVoucher.mintVoucher(initialVoucher);
      const currentVoucherID = await wiiqareVoucher.getCurrentVoucherID();
      await wiiqareVoucher.mintVoucher(initialVoucher);
      await wiiqareVoucher.vouchers(currentVoucherID);

      await expect(wiiqareVoucher.splitVoucher(currentVoucherID, firstVoucher, secondVoucher))
        .to.emit(wiiqareVoucher, "splitVoucherEvent")
        .withArgs(currentVoucherID, firstVoucher, secondVoucher);
    });
  });
});
