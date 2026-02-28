
import { expect } from "chai";
import { ethers } from "hardhat";

describe("IEyeToken", function () {
  it("mints fixed supply to admin", async function () {
    const [admin] = await ethers.getSigners();
    const FIXED_SUPPLY = BigInt("12000000000000000000") * (10n ** 18n);

    const Token = await ethers.getContractFactory("IEyeToken");
    const token = await Token.deploy(admin.address, FIXED_SUPPLY, false);
    await token.waitForDeployment();

    expect(await token.balanceOf(admin.address)).to.equal(FIXED_SUPPLY);
  });

  it("supports burn (optional)", async function () {
    const [admin] = await ethers.getSigners();
    const FIXED_SUPPLY = BigInt("12000000000000000000") * (10n ** 18n);

    const Token = await ethers.getContractFactory("IEyeToken");
    const token = await Token.deploy(admin.address, FIXED_SUPPLY, false);
    await token.waitForDeployment();

    await token.burn(1n);
    expect(await token.totalSupply()).to.equal(FIXED_SUPPLY - 1n);
  });
});
