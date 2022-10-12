import "../styles/globals.css";
import type { AppProps } from "next/app";
import { EVMProvider } from "../context/EVMProvider";
import { ContractProvider } from "../context";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <EVMProvider>
            <ContractProvider>
                <Component {...pageProps} />
            </ContractProvider>
        </EVMProvider>
    );
}

export default MyApp;
