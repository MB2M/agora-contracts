import { ethers } from "hardhat";

const MINTER_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("MINTER_ROLE")
);
const AGORANFT_URI = "http://localhost:3000/api/nft/{id}";
const ETHUSD = ethers.BigNumber.from("151000000000"); //1510$ -- 8 decimals

async function main() {
    const [owner, treasury] = await ethers.getSigners();

    const Stable = await ethers.getContractFactory("Stable");
    const stable = await Stable.deploy();
    await stable.deployed();
    console.log("Stable deployed to:", stable.address);

    const AgoraNFT = await ethers.getContractFactory("AgoraNFT");
    const agoraNFT = await AgoraNFT.deploy();
    await agoraNFT.deployed();
    console.log("AgoraNFT deployed to:", agoraNFT.address);

    await agoraNFT.setURI(AGORANFT_URI);

    const MockAggregatorV3 = await ethers.getContractFactory(
        "MockAggregatorV3"
    );
    const mockAggregatorV3 = await MockAggregatorV3.deploy(8);
    await mockAggregatorV3.deployed();
    console.log("MockAggregatorV3 deployed to:", mockAggregatorV3.address);
    await mockAggregatorV3.updateAnswer(ETHUSD);

    const AgoraNFTShop = await ethers.getContractFactory("AgoraNFTShop");
    const agoraNFTShop = await AgoraNFTShop.deploy(
        agoraNFT.address,
        stable.address,
        treasury.address,
        mockAggregatorV3.address
    );
    await agoraNFTShop.deployed();
    console.log("AgoraNFTShop deployed to:", agoraNFTShop.address);

    await agoraNFT.grantRole(MINTER_ROLE, agoraNFTShop.address);

    const contractAddresses = {
        stable: stable.address,
        agoraNFT: agoraNFT.address,
        mockAggregatorV3: mockAggregatorV3.address,
        agoraNFTShop: agoraNFTShop.address,
    };
    storeContractAddresses("localhost", contractAddresses);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

const storeContractAddresses = (fileName: string, jsonData: {}) => {
    const fs = require("fs");

    fs.writeFileSync(
        `./client/config/deployedContracts/${fileName}.json`,
        JSON.stringify(jsonData),
        function (err: any) {
            if (err) {
                console.log(err);
            }
        }
    );
};
