// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { NFTs } from "../../../config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        res.status(400).json({ error: "bad id" });
        return;
    }

    const idFormated = Number(id);
    // const nft = NFT[idFormated as keyof typeof NFT];
    const nft = NFTs.find((nft) => nft.id === idFormated);
    if (!nft) {
        res.status(400).json({ error: "bad id" });
        return;
    }
    const nftJson = {
        name: nft.name,
        description: nft.description,
        image:
            `${req.cookies["next-auth.callback-url"]}/nft/images/${id}.jpeg` ||
            "",
        attributes: [
            {
                display_type: "boost_percentage",
                trait_type: "affiliation lvl 1",
                value: nft.affiliationLevel1,
            },
            {
                display_type: "boost_percentage",
                trait_type: "affiliation lvl 2",
                value: nft.affiliationLevel2,
            },
            {
                display_type: "boost_percentage",
                trait_type: "reduction transaction fees",
                value: nft.fees,
            },
            {
                display_type: "boost_percentage",
                trait_type: "cashback CB",
                value: nft.cashback,
            },
        ],
    };

    res.status(200).json(nftJson);
}
