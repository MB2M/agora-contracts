import { ethers } from "ethers";
import { contractAddresses } from "../../config";
import agoraNFTJSON from "../../../artifacts/contracts/AgoraNFT.sol/AgoraNFT.json";
import agoraNFTShopJSON from "../../../artifacts/contracts/AgoraNFTShop.sol/AgoraNFTShop.json";
import stableJSON from "../../../artifacts/contracts/Stable.sol/Stable.json";
import AggregatorJSON from "../../../artifacts/contracts/MockAggregatorV3.sol/MockAggregatorV3.json";

export interface ContractState {
    agoraNFT: ethers.Contract;
    agoraNFTShop: ethers.Contract;
    stable?: ethers.Contract;
    aggregator?: ethers.Contract;
}

export const CONTRACT_INITIAL_STATE: ContractState = {
    agoraNFT: new ethers.Contract(
        contractAddresses.localhost.nft,
        agoraNFTJSON.abi
    ),
    agoraNFTShop: new ethers.Contract(
        contractAddresses.localhost.nftShop,
        agoraNFTShopJSON.abi
    ),
    stable: new ethers.Contract(
        contractAddresses.localhost.stable,
        stableJSON.abi
    ),
    aggregator: new ethers.Contract(
        contractAddresses.localhost.aggregator,
        AggregatorJSON.abi
    ),
};
