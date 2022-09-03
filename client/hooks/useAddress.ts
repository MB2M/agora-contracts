import { ethers } from "ethers";
import { useState, useEffect } from "react";

export const useAddress = (account?: ethers.providers.JsonRpcSigner) => {
    const [address, setAddress] = useState<string>("");

    useEffect(() => {
        if (account) {
            (async () => {
                setAddress(await account.getAddress());
            })();
        } else {
            setAddress("");
        }
    }, [account]);

    return address;
};
