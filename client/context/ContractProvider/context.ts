import React from "react";

import { ContractState, CONTRACT_INITIAL_STATE } from "./model";

export const ContractContext = React.createContext<ContractState>(
    CONTRACT_INITIAL_STATE
);

export function useContractContext() {
    return React.useContext(ContractContext);
}
