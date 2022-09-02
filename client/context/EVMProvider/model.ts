import { ethers } from "ethers";

export interface EVMState {
    account?: ethers.providers.JsonRpcSigner;
    connected?: boolean;
    connectBrowserWallet: (web3Provider: ethers.providers.Web3Provider) => void;
    setConnected: (con: boolean) => void;
    provider: ethers.providers.BaseProvider;
}

export const EVM_STATE_INITIAL_STATE: EVMState = {
    account: undefined,
    connected: false,
    connectBrowserWallet: () => undefined,
    setConnected: () => undefined,
    provider: ethers.providers.getDefaultProvider(),
};
