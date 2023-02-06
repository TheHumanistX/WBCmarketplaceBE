import css from './Card.css';
import { ethers, providers } from 'ethers';
import ABI from './ABI.json';
import tokenABI from './tokenABI.json';
import { useState, useEffect } from "react";

function Card(props) {
    const [Bought, setBought] = useState(false);
    const [currentAddress, setCurrentAddress] = useState("");
    const [checkBool, setCheckBool] = useState(false);


    const marketplaceAddress = "0x76bB63FB9CAd865DF1C9058E86DA1c0bBff09C3d";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(marketplaceAddress, ABI, signer);

    const getWallet = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const _currentAddress = await signer.getAddress();
        console.log("Current Address: " + _currentAddress);
        setCurrentAddress(_currentAddress);
        
    }

    const checking = async () => {
        const currentAddress = signer.getAddress();
        const checkingBool = await contract.hasPurchased(currentAddress);
        console.log("checkingBool: " + checkingBool);
        console.log("TypeOf checkingBool: " + typeof(checkingBool));
        setCheckBool(checkingBool.valueOf());
        console.log("checkBool: " + checkBool);
        console.log("TypeOf checkBool: " + typeof(checkBool));
    }

    const Connect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts");
        console.log("Trying to connect...");
    }

    const payInETH = async () => {
        Connect();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // const currentAddress = await provider.getSigner().getAddress();
        // const marketplaceAddress = "0x5737a7cF29081C35dc33Fb555E3E95B6f1Ffade2";
        const marketplaceContract = new ethers.Contract(marketplaceAddress, ABI, signer);
        const amount = await provider.getBalance(currentAddress);
        const formattedAmount = ethers.utils.formatEther(amount);
        console.log(formattedAmount);
        const price = await marketplaceContract.getPriceOfETH();
        const formattedPrice = ethers.utils.formatEther(price);
        console.log(price);
        console.log(amount);

        if (formattedAmount >= formattedPrice) {
            // they can buy
            const pay = await marketplaceContract.payInEth({ value: price });
            console.log(pay);
            const receipt = await pay.wait();
            if (receipt.confirmations > 0) {
                setBought(true);
                // console.log("Bought after ETH purchase: " + Bought);
            }
            console.log("Bought after ETH purchase: " + Bought);
        } else {
            // they can't buy
        }
    }


    const payInUSDC = async () => {
        Connect();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // const currentAddress = await provider.getSigner().getAddress();
        // const marketplaceAddress = "0x5737a7cF29081C35dc33Fb555E3E95B6f1Ffade2";
        const marketplaceContract = new ethers.Contract(marketplaceAddress, ABI, signer);
        const usdcToken = new ethers.Contract("0x86F96Bf18BBaA1fb5b0b1fE7CABC26B751dCe7F8", tokenABI, signer);

        const totalHolding = await usdcToken.balanceOf(currentAddress);
        const totalAllowance = await usdcToken.allowance(currentAddress, marketplaceAddress);
        const price = await marketplaceContract.price();
        console.log("Price: " + price);
        console.log("Total Amount Held:" + totalHolding);
        console.log("Total Allowance:" + totalAllowance);


        if (price <= totalHolding) {
            // they have enough to buy
            if (price <= totalAllowance) {
                // they can buy
                const purchase = await marketplaceContract.payInUSDC();
                console.log("Purchase variable: " + purchase);
                setBought(true);
            } else {
                // they have enough money but need to allow it
                const approve = await usdcToken.approve(marketplaceAddress, price);
                const receipt = await approve.wait();
                if (receipt.confirmations > 0) {
                    const purchase = await marketplaceContract.payInUSDC();
                    setBought(true);
                }

            }
        } else {
            // they don't have enough to buy
        }

    }

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const currentAddress = signer.getAddress();
        let hasPurchased;
        contract.functions.getHasPurchased(currentAddress).then( async (result) => {
            console.log("Result: " + result);
            console.log("Result typeOf: " + typeof(result));
            hasPurchased = await result.valueOf();
            console.log("hasPurchased: " + hasPurchased[0]);
            setBought(prevHasPurchased => hasPurchased[0]);
            
        });
        console.log("GetWallet UseEffect Bought Check: " + Bought);
        checking();

        
    },[]);


    // useEffect(() => {
    //     // const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     //const signer = provider.getSigner();
    //     // const contract = new ethers.Contract(marketplaceAddress, ABI, provider);
    //     //const contractWithSigner =  contract.connect(signer);
    //     //const test = contractWithSigner.emitHasPurchasedEvent();
    //     Connect();
    //     const filter = contract.filters.hasPurchasedEvent();

    //     filter.fromBlock = 0;

    //     contract.on(filter, (result) => {
    //         setBought(result.args.value);
    //         console.log("Result: " + result);
    //     });
    //     console.log("Event UseEffect Bought Check: " + Bought);
    // }, []);
    function walletChanged() {
        window.location.reload();
    }

    useEffect(() => {
        window.ethereum.on('accountsChanged', walletChanged);
    },[]);

    
    return (
        <div className="card">
            <div className="card__image-container">
                <img
                    src={props.imageURL}
                    width="400"
                />

            </div>
            <div className="card__content">
                <p className="card__title text--medium">
                    {props.name}
                </p>
                <div className="card__info">
                    <p className="text--medium">{props.description} </p>

                </div>
                
                
                {console.log("Bought: " + Bought)}
                {Bought === true ?
                    <div>
                        
                        <p className="card__price text__price">
                            <a href="/Item1">View Your Product</a>
                        </p>
                    </div>
                    :
                    <div>
                        
                        <div>
                            <img onClick={payInUSDC} className="buyIcon" src="https://imgur.com/MQHRBrg.png" ></img>
                            <img onClick={payInUSDC} className="buyIcon" src="https://imgur.com/wndKTZS.png" ></img>
                            <img onClick={payInETH} className="buyIcon" src="https://imgur.com/sQsv7UD.png" ></img>
                        </div>

                        
                        <div>
                            <p className="card__price text__price">
                                $10
                            </p>
                        </div>
                    </div>
                }
            </div>
        </div>
    );

}

export default Card;