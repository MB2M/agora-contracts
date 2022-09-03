// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { NFTs, swap } from "../../../config";

const apiBaseUrl = "https://api.1inch.io/v4.0/";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { from, to, approve } = req.query;
    const { amount, address, slippage, chainId } = req.body;

    if (
        !ethers.utils.isAddress(from as string) ||
        !ethers.utils.isAddress(to as string) ||
        !chainId
    ) {
        res.status(400).json({ error: "bad token address" });
        return;
    }

    if (!amount || !address) {
        res.status(400).json({ error: "missing body info" });
        return;
    }

    const swapParams = {
        fromTokenAddress: from as string, // 1INCH
        toTokenAddress: to as string, // DAI
        amount: amount,
        fromAddress: address,
        slippage: slippage || swap.defaultSlippage,
        referrerAddress: swap.treasury,
        fee: swap.baseFees.toString(),
        allowPartialFill: "false",
    };

    try {
        const response = await fetch(
            `${apiBaseUrl}${chainId}/swap?${new URLSearchParams(
                swapParams
            ).toString()}`
        );
        if (response.ok) {
            const json = await response.json();
            const txData = json.tx;
            res.status(200).json(txData);
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "bad request" });
        return;
    }
}
