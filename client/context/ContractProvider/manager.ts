import { useEffect, useMemo, useState } from "react";
import { ContractState, CONTRACT_INITIAL_STATE } from "./model";
import { useEVMContext } from "../EVMProvider";

const useContractManager = (): ContractState => {
    const [state, setState] = useState(CONTRACT_INITIAL_STATE);
    const { account, provider } = useEVMContext();

    const { agoraNFT, agoraNFTShop, aggregator, stable } = useMemo(
        () => state,
        [state]
    );

    useEffect(() => {
        setState({
            ...state,
            agoraNFTShop: agoraNFTShop.connect(account || provider),
            agoraNFT: agoraNFT.connect(account || provider),
            stable: stable?.connect(account || provider),
            aggregator: aggregator?.connect(account || provider)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, provider]);

    return state;
};

export default useContractManager;
