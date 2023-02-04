import css from './Card.css';
import { ethers, providers } from 'ethers';
import ABI from './ABI.json';
import tokenABI from './tokenABI.json';
import { useState, useEffect } from "react";

/**
 * 
 * @param {*} props 
 * @returns 
 */
function Card(props) {
    const [Bought, setBought] = useState(false);

    const checkBought = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const currentAddress = await provider.getSigner().getAddress();
        const marketplaceContract = new ethers.Contract("0x5737a7cF29081C35dc33Fb555E3E95B6f1Ffade2", ABI, signer);
        const boughtYet = await marketplaceContract.hasPurchased(currentAddress);
        setBought(boughtYet);
        console.log(Bought);
    }


    const Connect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts");
        console.log("Trying to connect...");
    }

    // const setupWalletEmpty = {
    //     provider: new ethers.providers.Web3Provider(window.ethereum),
    //     signer: setupObject.provider.getSigner(),
    //     currentAddress: setupObject.provider.getSigner().getAddress(),

    // };

    const payInETH = async () => {
        Connect();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const currentAddress = await provider.getSigner().getAddress();
        const marketplaceAddress = "0x5737a7cF29081C35dc33Fb555E3E95B6f1Ffade2";
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
            }
        } else {
            // they can't buy
        }
    }


    const payInUSDC = async () => {
        Connect();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const currentAddress = await provider.getSigner().getAddress();
        const marketplaceAddress = "0x5737a7cF29081C35dc33Fb555E3E95B6f1Ffade2";
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
                setBought(purchase);
            } else {
                // they have enough money but need to allow it
                const approve = await usdcToken.approve(marketplaceAddress, price);
                const receipt = await approve.wait();
                if (receipt.confirmations > 0) {
                    const purchase = await marketplaceContract.payInUSDC();
                    setBought(purchase);
                }

            }
        } else {
            // they don't have enough to buy
        }

    }

    useEffect(() => {
        checkBought();
    }, []);

    return (
        <div className="card">
            <div class="card__image-container">
                <img
                    src={props.imageURL}
                    width="400"
                />

            </div>
            <div class="card__content">
                <p class="card__title text--medium">
                    {props.name}
                </p>
                <div class="card__info">
                    <p class="text--medium">{props.description} </p>

                </div>

                {Bought == true ?
                    <div>
                        <p className="card__price text__price">
                            <a href="/Item1">View Your Product</a>
                        </p>
                    </div>
                    :
                    <div>
                        <div>
                            <img onClick={payInUSDC} class="buyIcon" src="https://imgur.com/MQHRBrg.png" ></img>
                            <img onClick={payInUSDC} class="buyIcon" src="https://imgur.com/wndKTZS.png" ></img>
                            <img onClick={payInETH} class="buyIcon" src="https://imgur.com/sQsv7UD.png" ></img>
                        </div>


                        <div>
                            <p class="card__price text__price">
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