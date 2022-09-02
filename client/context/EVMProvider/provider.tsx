import React from "react";

import { EVMContext } from "./context";
import useEVMManager from "./manager";
import { ethers } from "ethers";

export interface EVMProviderProps {
    children: React.ReactNode;
}

export function EVMProvider({ children }: EVMProviderProps): JSX.Element {
    const state = useEVMManager();
    return <EVMContext.Provider value={state}>{children}</EVMContext.Provider>;
}
