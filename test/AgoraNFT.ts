import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256 } from "ethers/lib/utils";

const MINTER_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("MINTER_ROLE")
);
const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
const URI_SETTER_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("URI_SETTER_ROLE")
);

describe("AgoraNFTShop", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploy() {
        // Contracts are deployed using the first signer/account by default
        const [owner, treasury, user] = await ethers.getSigners();

        const AgoraNFT = await ethers.getContractFactory("AgoraNFT");
        const agoraNFT = await AgoraNFT.deploy();

        return {
            agoraNFT,
            owner,
            treasury,
            user,
        };
    }

    describe("Deployment", function () {
        it("Should set the right role to owner address", async function () {
            const { agoraNFT, owner } = await loadFixture(deploy);

            expect(
                await agoraNFT.hasRole(DEFAULT_ADMIN_ROLE, owner.address)
            ).to.equal(true);
            expect(
                await agoraNFT.hasRole(URI_SETTER_ROLE, owner.address)
            ).to.equal(true);
            expect(await agoraNFT.hasRole(MINTER_ROLE, owner.address)).to.equal(
                true
            );
        });
    });

    describe("setup", function () {
        it("Should revert with the right error if user has not the right role", async function () {
            const { agoraNFT, user } = await loadFixture(deploy);

            await expect(
                agoraNFT.connect(user).setURI("aaaaa")
            ).to.be.revertedWith(
                `AccessControl: account ${user.address.toLowerCase()} is missing role ${URI_SETTER_ROLE}`
            );
        });

        it("Should set a new URI", async function () {
            const { agoraNFT } = await loadFixture(deploy);

            const newUri = "new Uri";

            await agoraNFT.setURI(newUri);

            expect(await agoraNFT.uri(1)).to.be.equal(newUri);
        });
    });

    describe("mint", function () {
        it("Should revert with the right error if user has not the right role", async function () {
            const { agoraNFT, user } = await loadFixture(deploy);

            await expect(
                agoraNFT
                    .connect(user)
                    .mint(user.address, 1, 1, ethers.utils.toUtf8Bytes(""))
            ).to.be.revertedWith(
                `AccessControl: account ${user.address.toLowerCase()} is missing role ${MINTER_ROLE}`
            );
        });

        it("Should revert with the right error if user has not the right role", async function () {
            const { agoraNFT, user } = await loadFixture(deploy);

            await expect(
                agoraNFT
                    .connect(user)
                    .mintBatch(
                        user.address,
                        [1],
                        [1],
                        ethers.utils.toUtf8Bytes("")
                    )
            ).to.be.revertedWith(
                `AccessControl: account ${user.address.toLowerCase()} is missing role ${MINTER_ROLE}`
            );
        });

        it("Should revert with the right error if there is no NFT left", async function () {
            const { agoraNFT, owner } = await loadFixture(deploy);

            await expect(
                agoraNFT.mint(
                    owner.address,
                    1,
                    (await agoraNFT.supplyLeft(1)).add(1),
                    ethers.utils.toUtf8Bytes("")
                )
            ).to.be.revertedWith(`not enough NFT`);
        });

        it("Should revert with the right error if there is no NFT left", async function () {
            const { agoraNFT, owner } = await loadFixture(deploy);

            await expect(
                agoraNFT.mintBatch(
                    owner.address,
                    [1, 1],
                    [(await agoraNFT.supplyLeft(1)).sub(5), 6],
                    ethers.utils.toUtf8Bytes("")
                )
            ).to.be.revertedWith(`not enough NFT`);
        });

        it("Should mint a new NFT with id 3", async function () {
            const { agoraNFT, owner } = await loadFixture(deploy);
            expect(await agoraNFT.balanceOf(owner.address, 3)).to.be.equal(0);
            await agoraNFT.mint(
                owner.address,
                3,
                1,
                ethers.utils.toUtf8Bytes("")
            );

            expect(await agoraNFT.balanceOf(owner.address, 3)).to.be.equal(1);
        });

        it("Should mint 3 news NFT with id 1 , 4 ,7", async function () {
            const { agoraNFT, owner } = await loadFixture(deploy);
            expect(await agoraNFT.balanceOf(owner.address, 1)).to.be.equal(0);
            expect(await agoraNFT.balanceOf(owner.address, 4)).to.be.equal(0);
            expect(await agoraNFT.balanceOf(owner.address, 7)).to.be.equal(0);
            const supplyLeft1 = await agoraNFT.supplyLeft(1);
            const supplyLeft4 = await agoraNFT.supplyLeft(4);
            const supplyLeft7 = await agoraNFT.supplyLeft(7);

            await agoraNFT.mintBatch(
                owner.address,
                [1, 4, 7],
                [4, 1, 1],
                ethers.utils.toUtf8Bytes("")
            );

            expect(await agoraNFT.balanceOf(owner.address, 1)).to.be.equal(4);
            expect(await agoraNFT.balanceOf(owner.address, 4)).to.be.equal(1);
            expect(await agoraNFT.balanceOf(owner.address, 7)).to.be.equal(1);
            expect(await agoraNFT.supplyLeft(1)).to.be.equal(
                supplyLeft1.sub(4)
            );
            expect(await agoraNFT.supplyLeft(4)).to.be.equal(
                supplyLeft4.sub(1)
            );
            expect(await agoraNFT.supplyLeft(7)).to.be.equal(
                supplyLeft7.sub(1)
            );
        });
    });
});
