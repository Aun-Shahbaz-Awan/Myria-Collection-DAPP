import React, { useState, useRef } from "react";
import { EnvTypes, FeeType, MintingManager } from "myria-core-sdk";
import toast, { Toaster } from "react-hot-toast";
import CollectionGIF from "../images/everyday_sheroe.gif";

export default function Minter() {
  const [mintedAssets, setMintedAssets] = useState([]);
  const [startingIndex, setStartingIndex] = useState(0);
  // const {}
  let inputRef = useRef();

  const env = EnvTypes.PRODUCTION;

  //------------------------------------------------------------------------------------------------
  const mintingManager = new MintingManager(env);
  const STARK_KEY = process.env.REACT_APP_STARK_KEY;
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
  const METADATA_API_URL = process.env.REACT_APP_METADATA_API_URL;
  const ROYALTY_RECIPIENT = process.env.REACT_APP_PUBLIC_KEY;
  // Get Minted NFTs ------------------>
  const handleFetchMintedNFTS = async () => {
    const params = {
      starkKey: STARK_KEY,
    };
    const records = await mintingManager
      .getMintedAssetByStarkKey(params)
      .then((responce) => {
        console.log("Mint_TX_Responce:", responce);
        setMintedAssets(responce?.data);
        return responce;
      })
      .catch((error) => {
        console.log("Get_Minted_Asset_By_Stark_Key_Error:", error);
      });
    return records;
  };

  // ------------------> Bulk mint
  const handleMinting = async (start, startingIndex) => {
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    try {
      console.log("Initiating a bulk minting...");
      for (var i = start + 1; i <= startingIndex; i++) {
        console.log("Minting #:", i, );
        const params = {
          starkKey: STARK_KEY,
          contractAddress: CONTRACT_ADDRESS,
          uri: `${METADATA_API_URL}/${i}`,
          tokenId: i.toString(),
          description: `EverydaySHEROE # ${i} Description`,
          fees: [
            {
              percentage: 5,
              receiptAddress: ROYALTY_RECIPIENT,
              feeType: FeeType.ROYALTY,
            },
          ],
        };
        // Listing
        toast.promise(
          mintingManager
            .createMintTransactionERC721(params)
            .then((response) => console.log("Minting...", response))
            .catch((error) => console.log("Bulk Mint Error:", error)),
          {
            loading: "Minting token #" + i,
            success: "Token #" + i + " Minted successfully!",
            error: "Error when Minting Token #" + i,
          }
        );
        // const mintTransactionResponse = await mintingManager
        //   .createMintTransactionERC721(params)
        //   .then((response) => console.log("Minting...", response))
        //   .catch((error) => console.log("Bulk Mint Error:", error))
        // if (mintTransactionResponse) {
        //   console.log(`Minted asset #${i}`);
        //   //   bulkMintResult.push(mintTransactionResponse);
        // }
        await timer(2000);
      }
      console.log(`Bulk minting is completed.`);
    } catch (error) {
      // throw new Error(JSON.stringify(error, null, 2));
    }
    // console.log(bulkMintResult);
  };
  const submit = () => {
    console.log("Submiting....");
    console.log(inputRef.current.value);

    handleMinting(
      startingIndex,
      parseInt(inputRef.current.value, 10) + startingIndex
    );
  };
  const fetchCollection = async () => {
    await handleFetchMintedNFTS().then((res) => {
      setStartingIndex(
        // res.data.filter(
        //   (item) =>
        //     item.tokenAddress === "0xc6dd9ff35aed227a0fbb9bd7d78ed48314fcc8c9"
        // ).length
        res?.data?.length
      );

      console.log(
        "Starting Index:",
        res?.data?.length
        // res.data.filter(
        //   (item) =>
        //     item.tokenAddress === "0xc6dd9ff35aed227a0fbb9bd7d78ed48314fcc8c9"
        // ).length
      );
    });
  };

  React.useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Toaster />
      <div className="p-3 py-12 lg:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 px-0 md:12 lg:px-24 xl:px-36">
          <div className=" rounded-xl">
            <img src={CollectionGIF} alt="GIF" className=" rounded-xl" />
          </div>
          <div className="flex flex-col">
            {/* <div
            class="flex items-center flex-wrap max-w-md px-10 bg-white shadow-xl rounded-2xl h-20 w-full mb-6 mt-7"
            x-data="{ circumference: 50 * 2 * Math.PI, percent: 80 }"
          >
            <div class="flex items-center justify-center -m-6 overflow-hidden bg-white rounded-full">
              <svg
                class="w-32 h-32 transform translate-x-1 translate-y-1"
                x-cloak
                aria-hidden="true"
              >
                <circle
                  class="text-gray-300"
                  stroke-width="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="50"
                  cx="60"
                  cy="60"
                />
                <circle
                  class="text-blue-600"
                  stroke-width="10"
                  stroke-dasharray="180"
                //   stroke-dashoffset="50"
                  stroke-linecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="50"
                  cx="60"
                  cy="60"
                />
              </svg>
              <span
                class="absolute text-2xl text-blue-700"
                x-text="`${percent}%`"
              ></span>
            </div>
            <p class="ml-10 font-medium text-gray-600 sm:text-xl">
              Total Minted NFTs
            </p>

            <span class="ml-auto text-xl font-medium text-blue-600 hidden sm:block">
              50%
            </span>
          </div> */}

            {/* Input --------------------------- */}
            <label className="my-2 text-xl font-semibold">
              Enter Bulk NFT Amount to Mint
            </label>
            <div className="flex">
              <input
                className="relative text-xl font-semibold bg-[#ffffff39] text-black border border-primary rounded-full w-full mr-4 py-1 px-4"
                type="number"
                ref={inputRef}
              />
              <button
                onClick={submit}
                className=" bg-bg_button cursor-pointer text-md font-semibold rounded-full py-2 px-6 w-auto mx-auto"
              >
                Mint
              </button>
            </div>
            <a
              href="https://staging.nonprod-myria.com/marketplace/collection/?id=eaa2d616-ee97-46e6-83c6-4641f9b46441"
              target="_blank"
              className=" underline cursor-pointer text-blue-400 mt-4 ml-2"
              rel="noreferrer"
            >
              View Collection
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
