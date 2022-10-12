import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256 } from "ethers/lib/utils";

const NFTUSDPrice = [50000, 10000, 5000, 2500, 1000, 500, 100, 50];
const MINTER_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("MINTER_ROLE")
);

describe("AgoraNFTShop", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploy() {
        const ETHUSD = ethers.BigNumber.from("151000000000"); //1510$ -- 8 decimals
        const ONE_MILLION = ethers.BigNumber.from("1000000000000000000000000");

        // Contracts are deployed using the first signer/account by default
        const [owner, treasury, user] = await ethers.getSigners();

        const Stable = await ethers.getContractFactory("Stable");
        const stable = await Stable.deploy();

        const AgoraNFT = await ethers.getContractFactory("AgoraNFT");
        const agoraNFT = await AgoraNFT.deploy();

        const MockAggregatorV3 = await ethers.getContractFactory(
            "MockAggregatorV3"
        );
        const mockAggregatorV3 = await MockAggregatorV3.deploy(8);

        await mockAggregatorV3.updateAnswer(ETHUSD);

        const AgoraNFTShop = await ethers.getContractFactory("AgoraNFTShop");
        const agoraNFTShop = await AgoraNFTShop.deploy(
            agoraNFT.address,
            stable.address,
            treasury.address,
            mockAggregatorV3.address
        );

        return {
            stable,
            agoraNFT,
            mockAggregatorV3,
            agoraNFTShop,
            owner,
            treasury,
            user,
            ONE_MILLION,
            ETHUSD,
        };
    }

    describe("Deployment", function () {
        it("Should set the right agoraNFT address", async function () {
            const { agoraNFTShop, agoraNFT } = await loadFixture(deploy);

            expect(await agoraNFTShop.agoraNFT()).to.equal(agoraNFT.address);
        });

        it("Should set the right stableUSD address", async function () {
            const { agoraNFTShop, stable } = await loadFixture(deploy);

            expect(await agoraNFTShop.stableUSD()).to.equal(stable.address);
        });

        it("Should set the right fundsRecipient address", async function () {
            const { agoraNFTShop, treasury } = await loadFixture(deploy);

            expect(await agoraNFTShop.fundsRecipient()).to.equal(
                treasury.address
            );
        });

        it("Should set the right owner", async function () {
            const { agoraNFTShop, owner } = await loadFixture(deploy);

            expect(await agoraNFTShop.owner()).to.equal(owner.address);
        });

        it("Should set the right USD Price for each NFT", async function () {
            const { agoraNFTShop } = await loadFixture(deploy);
            for (let i = 0; i < NFTUSDPrice.length; i++) {
                expect(await agoraNFTShop.USDPrice(i + 1)).to.equal(
                    NFTUSDPrice[i]
                );
            }
        });
    });

    describe("Buy", function () {
        describe("InUSD", function () {
            it("Should revert with the right error if allowance is not set", async function () {
                const { agoraNFTShop, user } = await loadFixture(deploy);

                await expect(
                    agoraNFTShop.connect(user).buyInUSD(1, user.address, 1)
                ).to.be.revertedWith("ERC20: insufficient allowance");
            });

            it("Should revert with the right error if user doesn't have enought stable USD", async function () {
                const { agoraNFTShop, stable, user, ONE_MILLION } =
                    await loadFixture(deploy);

                await stable
                    .connect(user)
                    .approve(agoraNFTShop.address, ONE_MILLION);

                await expect(
                    agoraNFTShop.connect(user).buyInUSD(1, user.address, 1)
                ).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
            });

            it("Should revert with the right error if agoraNFTSHop has not the right role", async function () {
                const { agoraNFTShop, stable, agoraNFT, user, ONE_MILLION } =
                    await loadFixture(deploy);

                await stable
                    .connect(user)
                    .approve(agoraNFTShop.address, ONE_MILLION);

                await stable.transfer(user.address, ONE_MILLION);
                // await agoraNFT.grantRole(MINTER_ROLE, agoraNFTShop.address);
                await expect(
                    agoraNFTShop.connect(user).buyInUSD(1, user.address, 1)
                ).to.be.revertedWith(
                    `AccessControl: account ${agoraNFTShop.address.toLowerCase()} is missing role ${MINTER_ROLE}`
                );
            });

            it("Should buy NFT with id 1", async function () {
                const { agoraNFTShop, stable, agoraNFT, user, ONE_MILLION } =
                    await loadFixture(deploy);
                await stable
                    .connect(user)
                    .approve(agoraNFTShop.address, ONE_MILLION);

                await stable.transfer(user.address, ONE_MILLION);
                await agoraNFT.grantRole(MINTER_ROLE, agoraNFTShop.address);

                expect(await agoraNFT.balanceOf(user.address, 1)).to.equal(0);
                expect(await stable.balanceOf(user.address)).to.equal(
                    ONE_MILLION
                );

                await agoraNFTShop.connect(user).buyInUSD(1, user.address, 1);

                expect(await agoraNFT.balanceOf(user.address, 1)).to.equal(1);
                expect(await stable.balanceOf(user.address)).to.equal(
                    ONE_MILLION.sub(
                        ethers.BigNumber.from("50000000000000000000000")
                    )
                );
            });
        });

        describe("InETH", function () {
            it("Should revert with the right error if sent ETH dont respect 0.1% splippage", async function () {
                const { agoraNFTShop, user } = await loadFixture(deploy);

                await expect(
                    agoraNFTShop.connect(user).buyInETH(1, user.address, 1, {
                        value: ethers.BigNumber.from("1000000000"),
                    })
                ).to.be.revertedWith("bad ETH amount");
            });

            it("Should buy NFT with id 1", async function () {
                const { agoraNFTShop, agoraNFT, user } = await loadFixture(
                    deploy
                );

                await agoraNFT.grantRole(MINTER_ROLE, agoraNFTShop.address);

                expect(await agoraNFT.balanceOf(user.address, 1)).to.equal(0);
                const balance = await user.getBalance();
                const NFTPriceInETH = await agoraNFTShop.getNFTPriceInETH(1);

                const tx = await agoraNFTShop
                    .connect(user)
                    .buyInETH(1,user.address,1, { value: NFTPriceInETH });

                expect(await agoraNFT.balanceOf(user.address, 1)).to.equal(1);
                expect(await user.getBalance()).to.be.lessThan(
                    balance.sub(NFTPriceInETH)
                );
            });
        });
    });

    describe("Setup", function () {
        it("Should set the a new USD price for nft with id 4", async function () {
            const { agoraNFTShop } = await loadFixture(deploy);
            await agoraNFTShop.setPrice(4, 3444);
            expect(await agoraNFTShop.USDPrice(4)).to.equal(3444);
        });
    });
});
