import localhostAddresses from "./deployedContracts/localhost.json";

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
        Aggregator: "ddddd",
    },
    bsc: {
        nft: "sss",
        nftShop: "ez",
    },
    bscTestnet: {
        nft: "sss",
        nftShop: "ez",
        stable: "ds",
        Aggregator: "ddddd",
    },
};
