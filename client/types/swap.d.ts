type TokenOrigin = "from" | "to";

type Token = {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
    tags: string[];
};
