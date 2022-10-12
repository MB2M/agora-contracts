import React, { useMemo } from "react";

// Here we import the needed Interfaces of the StarknetJS & default provider
import { ethers } from "ethers";

import { EVMState } from "./model";

// Internal state management
interface StarknetManagerState {
    account?: ethers.providers.JsonRpcSigner;
    connected?: boolean;
    provider: ethers.providers.BaseProvider;
}

interface SetAccount {
    type: "set_account";
    account?: ethers.providers.JsonRpcSigner;
}

interface SetProvider {
    type: "set_provider";
    provider: ethers.providers.BaseProvider;
}

interface SetConnected {
    type: "set_connected";
    con: boolean;
}

type Action = SetAccount | SetProvider | SetConnected;

// Internal reducer
function reducer(
    state: StarknetManagerState,
    action: Action
): StarknetManagerState {
    switch (action.type) {
        case "set_account": {
            return { ...state, account: action.account };
        }
        case "set_provider": {
            return { ...state, provider: action.provider };
        }
        case "set_connected": {
            return { ...state, connected: action.con };
        }
        default: {
            return state;
        }
    }
}

// Start of Starknet manager
const useEVMManager = (): EVMState => {
    // Init the reducer, & set the provider to default one
    // TODO: set the default provider as initial provider
    const [state, dispatch] = React.useReducer(reducer, {
        provider: ethers.providers.getDefaultProvider(),
    });

    const { account, connected, provider } = useMemo(() => state, [state]);

    // Connect the user wallet
    // Display the "Wallet chooser" modal
    // TODO: use 'connect' & 'enable' function of get-starknet lib to let user choose a wallet to connect
    // TODO: get account & provider after connection
    // TODO: see https://github.com/starknet-community-libs/get-starknet#readme
    const connectBrowserWallet = React.useCallback(
        async (web3Provider: ethers.providers.Web3Provider) => {
            try {
                dispatch({
                    type: "set_account",
                    account: web3Provider.getSigner(),
                });
                dispatch({
                    type: "set_provider",
                    provider: web3Provider,
                });
            } catch (e) {
                console.log(e);
            }
        },
        []
    );

    // Set state as connected
    const setConnected = React.useCallback(async (con: boolean) => {
        dispatch({ type: "set_connected", con });
        if (!con) {
            dispatch({ type: "set_account", account: undefined });
            dispatch({
                type: "set_provider",
                provider: ethers.providers.getDefaultProvider(),
            });
        }
    }, []);

    return {
        account,
        connected,
        setConnected,
        connectBrowserWallet,
        provider,
    };
};

export default useEVMManager;
