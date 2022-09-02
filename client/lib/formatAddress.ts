const formatAddress = (address: string) => {
    if (address.length < 12) return address;

    return address.slice(0, 6) + "..." + address.slice(address.length - 6);
};

export default formatAddress;
