import { ethers } from "ethers";
import contractAddresses from "../contractAddresses.json";
import payerArtifact from "../artifacts/contracts/Payer.sol/Payer.json";
import tokenArtifact from "../artifacts/contracts/TestToken.sol/TestToken.json";
import { jEUR } from "../config";

const getPayerContract = (web3Provider: ethers.providers.Web3Provider) => {
    try {
        const signer = web3Provider.getSigner();
        return new ethers.Contract(
            contractAddresses.payer,
            payerArtifact.abi,
            signer
        );
    } catch (err) {
        console.error(err);
    }
};

const getTokenContract = (web3Provider: ethers.providers.Web3Provider) => {
    try {
        const signer = web3Provider.getSigner();
        return new ethers.Contract(jEUR.address, tokenArtifact.abi, signer);
    } catch (err) {
        console.error(err);
    }
};

export { getPayerContract, getTokenContract };
