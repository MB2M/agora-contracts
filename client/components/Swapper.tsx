import {
    Box,
    Button,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import { ethers } from "ethers";
import Image from "next/image";
import {
    ChangeEvent,
    TextareaHTMLAttributes,
    useEffect,
    useMemo,
    useState,
} from "react";
import { swap } from "../config";
import { useEVMContext } from "../context";
import { useAddress } from "../hooks/useAddress";

const apiBaseUrl = "https://api.1inch.io/v4.0/";

const Swapper = () => {
    const { account, provider } = useEVMContext();
    const address = useAddress(account);
    const [tokenList, setTokenList] = useState<Token[]>([]);
    const [fromToken, setFromToken] = useState<{
        address: string;
        amount: number;
    }>({ address: "", amount: 0 });
    const [toToken, setToToken] = useState<{
        address: string;
        amount: number;
    }>({ address: "", amount: 0 });
    const [allowance, setAllowance] = useState<string>("0");

    const fromTokenDecimals = useMemo(
        () =>
            tokenList.find((token) => token.address === fromToken.address)
                ?.decimals,
        [fromToken.address, tokenList]
    );

    const isAllowed = useMemo(
        () =>
            ethers.BigNumber.from(allowance).sub(
                ethers.utils.parseUnits(
                    fromToken.amount.toString(),
                    fromTokenDecimals
                )
            ) > ethers.constants.Zero,
        [allowance, fromToken.amount, fromTokenDecimals]
    );

    const handleTokenChange = (
        e: SelectChangeEvent<unknown>,
        origin: TokenOrigin
    ) => {
        switch (origin) {
            case "from":
                setFromToken({
                    ...fromToken,
                    address: e.target.value as string,
                });
                break;

            case "to":
                setToToken({
                    ...toToken,
                    address: e.target.value as string,
                });
                break;

            default:
                break;
        }
    };

    const handleTokenAmountChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        origin: TokenOrigin
    ) => {
        switch (origin) {
            case "from":
                setFromToken({
                    ...fromToken,
                    amount: Number(e.target.value),
                });
                break;

            case "to":
                setToToken({
                    ...toToken,
                    amount: Number(e.target.value),
                });
                break;

            default:
                break;
        }
    };

    const handleSwapApproveClick = () => {
        (async () => {
            try {
                if (!isAllowed) {
                    const response = await fetch(
                        `${apiBaseUrl}${provider.network?.chainId}/approve/transaction?tokenAddress=${fromToken.address}`
                    );
                    if (response.ok) {
                        const txData = await response.json();
                        txData.from = address;
                        const tx = await account?.sendTransaction(txData);
                        await tx?.wait();
                    }
                } else {
                    // SETUP NEXTJS API REQUEST
                }
            } catch (err) {
                console.error(err);
            }
        })();
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `${apiBaseUrl}${provider.network?.chainId}/tokens`
                );
                if (response.ok) {
                    const json = await response.json();
                    const tokens = json.tokens;
                    setTokenList(Object.values(tokens));
                }
            } catch (err) {
                console.error(err);
                setTokenList([]);
            }
        })();
    }, [provider.network?.chainId]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `${apiBaseUrl}${provider.network?.chainId}/approve/allowance?tokenAddress=${fromToken.address}&walletAddress=${address}`
                );
                if (response.ok) {
                    const json = await response.json();
                    const allowance = json.allowance;
                    setAllowance(allowance);
                }
            } catch (err) {
                console.error(err);
                setAllowance("0");
            }
        })();
    }, [address, fromToken, fromToken.amount, provider.network?.chainId]);

    return (
        <Box>
            <Select
                onChange={(e) => handleTokenChange(e, "from")}
                sx={{ backgroundColor: "white" }}
            >
                {tokenList.map((token) => {
                    return (
                        <MenuItem key={token.address} value={token.address}>
                            <Image
                                src={token.logoURI}
                                alt={token.name}
                                width={"20px"}
                                height={"20px"}
                            />
                            {token.symbol}
                        </MenuItem>
                    );
                })}
            </Select>
            <TextField
                label="from"
                value={fromToken.amount}
                sx={{ backgroundColor: "white" }}
                onChange={(e) => handleTokenAmountChange(e, "from")}
            />
            <TextField
                label="to"
                value={toToken.amount}
                sx={{ backgroundColor: "white" }}
                onChange={(e) => handleTokenAmountChange(e, "to")}
            />
            <Select
                onChange={(e) => handleTokenChange(e, "to")}
                sx={{ backgroundColor: "white" }}
            >
                {tokenList.map((token) => {
                    return (
                        <MenuItem key={token.address} value={token.address}>
                            <Image
                                src={token.logoURI}
                                alt={token.name}
                                width={"20px"}
                                height={"20px"}
                            />
                            {token.symbol}
                        </MenuItem>
                    );
                })}
            </Select>
            <Button onClick={handleSwapApproveClick}>
                {isAllowed ? "swap" : "approve"}
            </Button>
        </Box>
    );
};

export default Swapper;
