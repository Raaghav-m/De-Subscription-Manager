import { MAINNET_TOKENS, MAINNET_TOKENS_BY_SYMBOL } from "@/lib/constants";
import Image from "next/image";
import React, { ChangeEvent, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowDownUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Swap = ({ token, amount }: { token: string; amount: string }) => {
  const [sellToken, setSellToken] = useState("eth");
  const [buyToken, setBuyToken] = useState("usdc");
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [tradeDirection, setTradeDirection] = useState<"sell" | "buy">("sell");

  const handleSellTokenChange = (value: string) => {
    setSellToken(value);
  };

  const handleBuyTokenChange = (value: string) => {
    setBuyToken(value);
  };

  useEffect(() => {
    setSellToken(token.toLowerCase());
  }, [token]);

  useEffect(() => {
    setSellAmount(amount);
  }, [amount]);

  const odosSwap = async () => {
    const quoteUrl = "https://api.odos.xyz/sor/quote/v2";

    const quoteRequestBody = {
      chainId: 1,
      inputTokens: [
        {
          tokenAddress: MAINNET_TOKENS_BY_SYMBOL[sellToken].address, // checksummed input token address
          amount: sellAmount, // input amount as a string in fixed integer precision
        },
      ],
      outputTokens: [
        {
          tokenAddress: MAINNET_TOKENS_BY_SYMBOL[buyToken].address, // checksummed output token address
          proportion: 1,
        },
      ],
      userAddr: "0x...", // checksummed user address
      slippageLimitPercent: 0.3, // set your slippage limit percentage (1 = 1%),
      referralCode: 0, // referral code (recommended)
      disableRFQs: true,
      compact: true,
    };

    const quoteResponse = await fetch(quoteUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quoteRequestBody),
    });

    let quote;
    if (quoteResponse.status === 200) {
      quote = await quoteResponse.json();
      // handle quote response data
    } else {
      console.error("Error in Quote:", quoteResponse);
      // handle quote failure cases
    }

    const assembleUrl = "https://api.odos.xyz/sor/assemble";

    const assembleRequestBody = {
      userAddr: "0x...", // the checksummed address used to generate the quote
      pathId: quote.pathId, // Replace with the pathId from quote response in step 1
      simulate: true, // this can be set to true if the user isn't doing their own estimate gas call for the transaction
    };

    const assembleResponse = await fetch(assembleUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assembleRequestBody),
    });

    let assembledTransaction;
    if (assembleResponse.status === 200) {
      assembledTransaction = await assembleResponse.json();
      // handle Transaction Assembly response data
    } else {
      console.error("Error in Transaction Assembly:", assembleResponse);
      // handle quote failure cases
    }

    const Web3 = require("web3");

    // 1. create web3 provider
    let web3;
    if (typeof window.ethereum !== "undefined") {
      web3 = new Web3(window.ethereum);
    }
    // 2. Extract transaction object from assemble API response
    const transaction = assembledTransaction.transaction;

    let txHash;
    // 3a. Sign transaction with a web3 provider / wallet
    txHash = await web3.eth.accounts.signTransaction(transaction);
    console.log(txHash);
  };

  const handleSwapTokens = () => {
    const tempToken = sellToken;
    const tempAmount = sellAmount;
    setSellToken(buyToken);
    setBuyToken(tempToken);
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 max-w-md mx-auto">
      {/* From Section */}
      <div className="space-y-2">
        <label
          htmlFor="sell"
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          From
        </label>
        <section className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
            <Image
              alt={`${sellToken} token`}
              className="h-8 w-8 rounded-full"
              src={MAINNET_TOKENS_BY_SYMBOL[sellToken].logoURI}
              width={32}
              height={32}
            />
            <Select value={sellToken} onValueChange={handleSellTokenChange}>
              <SelectTrigger className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAINNET_TOKENS.map((token) => (
                  <SelectItem 
                    key={token.address} 
                    value={token.symbol.toLowerCase()}
                  >
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <input
            id="sell-amount"
            value={sellAmount}
            className="w-1/3 bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-right"
            type="number"
            placeholder="0.0"
            onChange={(e) => {
              setTradeDirection("sell");
              setSellAmount(e.target.value);
            }}
          />
        </section>
      </div>

      {/* Swap Button */}
      <div className="relative h-16 my-4">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Button
            onClick={handleSwapTokens}
            size="icon"
            className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 shadow-lg"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
      </div>

      {/* To Section */}
      <div className="space-y-2">
        <label
          htmlFor="buy"
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          To
        </label>
        <section className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
            <Image
              alt={`${buyToken} token`}
              className="h-8 w-8 rounded-full"
              src={MAINNET_TOKENS_BY_SYMBOL[buyToken].logoURI}
              width={32}
              height={32}
            />
            <Select value={buyToken} onValueChange={handleBuyTokenChange}>
              <SelectTrigger className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAINNET_TOKENS.map((token) => (
                  <SelectItem 
                    key={token.address} 
                    value={token.symbol.toLowerCase()}
                  >
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <input
            id="buy-amount"
            value={buyAmount}
            className="w-1/3 bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-right"
            type="number"
            placeholder="0.0"
          />
        </section>
      </div>

      {/* Swap Action Button */}
      <Button
        onClick={odosSwap}
        className="w-full mt-6 py-6 text-lg font-semibold"
      >
        Swap Tokens
      </Button>

      {/* Optional: Add exchange rate info */}
    </div>
  );
};

export default Swap;
