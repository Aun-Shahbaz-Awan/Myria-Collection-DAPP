import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// import { FeeType, ModuleFactory, TokenType } from "myria-core-sdk";
import { getMyriaClient } from "./../helper/get-myria-client";
import { GetMyriaErc721ByStarkKey } from "../helper/get-erc721-by-stark-key";
import { BulkListErc721 } from "./../helper/list-bulk-erc721";

function BulkListing() {
  const [myriaClient, setMyriaClient] = useState("");
  // const [myriaAssets, setMyriaAssets] = useState("");
  const [startingIndex, setStartingIndex] = useState(0);
  const [endingIndex, setEndingIndex] = useState(2);

  const STARK_KEY = process.env.REACT_APP_STARK_KEY;
  const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;

  const handleBulkListing = () => {
    toast.promise(
      GetMyriaErc721ByStarkKey(myriaClient, STARK_KEY).then(
        (assets) =>
          toast.promise(
            BulkListErc721(myriaClient, PUBLIC_KEY, STARK_KEY, assets, startingIndex, endingIndex).then(
              (listingResponce) =>
                console.log("Listing Response:", listingResponce)
            )
          ),
        {
          loading: "Listing Myria NFTs",
          success: "Listed Successfully!",
          error: "Listing Error!",
        }
      ),
      {
        loading: "Fetching Myria Assets For Listing...",
        error: "Fetching Error!",
      }
    );
  };

  React.useEffect(() => {
    getMyriaClient().then((mClient) => {
      setMyriaClient(mClient);
    });
  }, []);

  console.log("Myria Client:", myriaClient);
  // console.log("Myria Assets:", myriaAssets);
  console.log("Wallet Address:", myriaClient?.provider?.selectedAddress);
  return (
    <div>
      <Toaster />
      {/* List Bulk NFT */}
      <div className="px-4">
        <p className="px-3 mb-2 text-xl font-semibold mt-4">
          Lising Your NFT Here:
        </p>
        <div className="flex">
          <input
            className="relative text-base font-semibold bg-[#ffffff39] text-black border border-primary rounded-full w-full mr-4 py-1 px-4"
            type="number"
            placeholder="Starting Index"
            value={startingIndex}
            onChange={(e) => setStartingIndex(e.target.value)}
          />
          <input
            className="relative text-base font-semibold bg-[#ffffff39] text-black border border-primary rounded-full w-full mr-4 py-1 px-4"
            type="number"
            placeholder="Ending Index"
            value={endingIndex}
            onChange={(e) => setEndingIndex(e.target.value)}
          />
          <button
            onClick={handleBulkListing}
            className=" bg-bg_button cursor-pointer text-md font-semibold rounded-full py-2 px-6 w-auto mx-auto"
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}

export default BulkListing;
