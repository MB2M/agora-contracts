import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import ConnectButton from "../components/ConnectButton";
import NFTDisplay from "../components/NFTDisplay";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <ConnectButton></ConnectButton>
            <NFTDisplay></NFTDisplay>
        </div>
    );
};

export default Home;
