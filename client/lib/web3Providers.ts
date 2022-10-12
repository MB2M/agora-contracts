import Torus, { TorusParams } from "@toruslabs/torus-embed";
import { ethers } from "ethers";

const getMetamaskProvider = async () => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            return provider;
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("Metamask is not properly injected into the browser");
    }
};

const getTorusProvider = async (options?: TorusParams) => {
    const torus = new Torus({});
    await torus.init(options);
    // torus.hideTorusButton();
    await torus.login();
    const provider = new ethers.providers.Web3Provider(torus.provider);
    return provider;
};

export { getMetamaskProvider, getTorusProvider };
