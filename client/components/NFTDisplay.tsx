import { useContractContext, useEVMContext } from "../context";
import { NFTs } from "../config";
import Image from "next/image";
import { Box, Button, Grid, TextField } from "@mui/material";
import { ethers } from "ethers";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { useAddress } from "../hooks/useAddress";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";

type CoinPayment = "eth" | "usd";

const NFTDisplay = () => {
    const { account, connected } = useEVMContext();
    const contracts = useContractContext();
    const [ETHPrice, setETHPrice] = useState<number>(0);
    const address = useAddress(account);

    const handleETHPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        setETHPrice(Number(e.target.value));
    };

    const handleSetETHPRice = async () => {
        try {
            await contracts.aggregator?.updateAnswer(
                ethers.utils.parseUnits(ETHPrice.toString(), 8)
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handlePay = async (tokenType: CoinPayment, nft: NFT) => {
        let tx;
        switch (tokenType) {
            case "eth":
                try {
                    const ethPrice =
                        await contracts.agoraNFTShop.getNFTPriceInETH(nft.id);
                    tx = await contracts.agoraNFTShop.buyInETH(nft.id, {
                        value: ethPrice,
                    });
                } catch (err) {
                    console.log(err);
                }
                break;
            case "usd":
                try {
                    const allowance = await contracts.stable?.allowance(
                        address,
                        contracts.agoraNFTShop.address
                    );
                    if (
                        allowance?.sub(
                            ethers.utils.parseUnits(
                                nft.price.toString(),
                                await contracts.stable?.decimals()
                            )
                        ) < 0
                    ) {
                        const tx = await contracts.stable?.approve(
                            contracts.agoraNFTShop.address,
                            ethers.utils.parseUnits(
                                nft.price.toString(),
                                await contracts.stable?.decimals()
                            )
                        );
                        await tx.wait();
                    }
                    tx = await contracts.agoraNFTShop.buyInUSD(nft.id);
                } catch (err) {
                    console.log(err);
                }
                break;
            default:
                break;
        }
        // await tx.wait();
    };

    return (
        <>
            <Grid container spacing={2} gap={2}>
                {NFTs.map((nft) => (
                    <Grid item xs={2} key={nft.id}>
                        <h4>{nft.name}</h4>
                        <Image
                            src={`/nft/images/${nft.id}.jpeg`}
                            layout={"responsive"}
                            width={"100%"}
                            height={"100%"}
                            alt={nft.name}
                        />
                        Price: {nft.price}
                        <Button onClick={() => handlePay("eth", nft)}>
                            Buy ETH
                        </Button>
                        <Button onClick={() => handlePay("usd", nft)}>
                            Buy USD
                        </Button>
                        <CrossmintPayButton
                            clientId="764df2f4-d61f-4bcc-9013-be09d5f8cc38"
                            mintConfig={{
                                type: "erc-1155",
                                totalPrice: "0.1",
                                _tokenId: "1",
                            }}
                            environment="staging"

                        />
                    </Grid>
                ))}
            </Grid>
            <TextField
                label="amount"
                onChange={handleETHPriceChange}
                value={ETHPrice}
                sx={{ backgroundColor: "white" }}
            ></TextField>
            <Button onClick={handleSetETHPRice}>Set ETH Price</Button>
        </>
    );
};

export default NFTDisplay;
