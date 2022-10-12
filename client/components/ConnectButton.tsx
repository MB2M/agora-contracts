import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Modal, Box } from "@mui/material";
import { getMetamaskProvider, getTorusProvider } from "../lib/web3Providers";
import formatAddress from "../lib/formatAddress";
import { useEVMContext } from "../context";

const modalStyle = {
    position: "absolute",
    top: "48%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#212529",
    borderRadius: "10px",
    p: 4,
};

const ConnectButton = () => {
    const { account, connectBrowserWallet, connected, setConnected } =
        useEVMContext();
    const [address, setAddress] = useState<string | undefined>("");
    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        (async () => {
            setAddress(await account?.getAddress());
        })();
    }, [account, setAddress]);

    useEffect(() => {
        (async () => {
            if (account && (address?.length || 0) > 0) {
                setConnected(true);
            }
        })();
    }, [account, address, setConnected]);

    const handleConnect = async (walletType: string) => {
        let provider;
        switch (walletType) {
            case "torus":
                provider = await getTorusProvider({
                    network: {
                        host: "https://polygon-rpc.com/",
                        chainId: 137,
                        networkName: "Polygon",
                        ticker: "MATIC",
                        tickerName: "MATIC",
                    },
                    enableLogging: false,
                });
                break;
            case "metamask": {
                provider = await getMetamaskProvider();
                window.ethereum.on(
                    "accountsChanged",
                    async (_accounts: any) => {
                        provider = await getMetamaskProvider();
                        if (provider) connectBrowserWallet(provider);
                    }
                );
                window.ethereum.on("chainChanged", async (_chainId: any) => {
                    provider = await getMetamaskProvider();
                    if (provider) connectBrowserWallet(provider);
                    // window.location.reload();
                });
                break;
            }
            default:
                break;
        }
        if (provider) connectBrowserWallet(provider);
        handleClose();
    };

    const handleDisconnect = () => {
        setConnected(false);
        handleClose();
    };

    return (
        <>
            <Button
                // variant="outlined"
                onClick={handleOpen}
                sx={{
                    border: "2px black solid",
                    borderRadius: "10px",
                    color: "black",
                    padding: "10px 25px",
                    background: "linear-gradient(to right, #ff4f63, #911bed)",
                    fontWeight: "bold",
                    "&:hover": {
                        filter: "brightness(1.2)",
                        color: "none",
                    },
                }}
            >
                {connected
                    ? address && formatAddress(address)
                    : "connect wallet"}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={modalStyle}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    {!connected ? (
                        <>
                            <Box width="100%">
                                <Button
                                    sx={{
                                        borderRadius: "10px",
                                        padding: "10px",
                                        border: "1px solid #ff9800",
                                        color: "#ff9800",
                                        ":hover": {
                                            background: "#ff9800",
                                            border: "1px solid #ff9800",
                                            color: "white",
                                        },
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => handleConnect("metamask")}
                                >
                                    Metamask
                                </Button>
                            </Box>
                            <Box mt="20px" width="100%">
                                <Button
                                    sx={{
                                        borderRadius: "10px",
                                        padding: "10px",
                                        background: "none",
                                        color: "#2196f3",
                                        border: "1px solid #2196f3",
                                        ":hover": {
                                            background: "#2196f3",
                                            border: "1px solid #2196f3",
                                            color: "white",
                                        },
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => handleConnect("torus")}
                                >
                                    Torus
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Button
                            sx={{
                                width: "100%",
                                borderRadius: "10px",
                                padding: "10px",
                                background: "none",
                                border: "1px solid #f44336",
                                color: "#f44336",
                                ":hover": {
                                    background: "#f44336",
                                    color: "white",
                                    border: "1px solid #f44336",
                                },
                            }}
                            variant="outlined"
                            onClick={handleDisconnect}
                            color="error"
                        >
                            Disconnect
                        </Button>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default ConnectButton;
