import { ContractState } from "../context";
import localhostAddresses from "./deployedContracts/localhost.json";
import rinkebyAddresses from "./deployedContracts/rinkeby.json";

export const contractAddresses = {
    localhost: {
        nft: localhostAddresses.agoraNFT,
        nftShop: localhostAddresses.agoraNFTShop,
        stable: localhostAddresses.stable,
        aggregator: localhostAddresses.mockAggregatorV3,
    },
    ethereum: {
        nft: "sss",
        nftShop: "ez",
    },
    goerli: {
        nft: "sss",
        nftShop: "ez",
        stable: "ds",
        aggregator: "ddddd",
    },
    rinkeby: {
        nft: rinkebyAddresses.agoraNFT,
        nftShop: rinkebyAddresses.agoraNFTShop,
        stable: rinkebyAddresses.stable,
        aggregator: rinkebyAddresses.mockAggregatorV3,
    },
    bsc: {
        nft: "sss",
        nftShop: "ez",
    },
    bscTestnet: {
        nft: "sss",
        nftShop: "ez",
        stable: "ds",
        aggregator: "ddddd",
    },
};
