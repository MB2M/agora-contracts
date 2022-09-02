import React from "react";

import { EVMState, EVM_STATE_INITIAL_STATE } from "./model";

export const EVMContext = React.createContext<EVMState>(
    EVM_STATE_INITIAL_STATE
);

export function useEVMContext() {
    return React.useContext(EVMContext);
}
