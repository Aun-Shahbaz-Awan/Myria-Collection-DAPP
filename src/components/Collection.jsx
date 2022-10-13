import React, { useState } from "react";
import { EnvTypes, ModuleFactory, MyriaClient } from "myria-core-sdk";
import NFTCard from "./utils/NFTCard";
import { ListErc721 } from "./../helper/list-single-erc721";
import { getMyriaClient } from "./../helper/get-myria-client";
import { GetMyriaErc721ByStarkKey } from "../helper/get-erc721-by-stark-key";
import { BulkListErc721 } from "./../helper/list-bulk-erc721-custom";

import toast, { Toaster } from "react-hot-toast";

function Collection() {
  const [pageNumber, setPageNumber] = useState(1);
  const [loadMoreStatus, setLoadMoreStatus] = useState({
    option: false,
    status: false,
  });
  const [mintedAssets, setMintedAssets] = useState([]);
  const [assetMeta, setAssetMeta] = useState({});
  console.log("Assets >>>>>>>>>:", mintedAssets);

  const env = EnvTypes.STAGING;
  const STARK_KEY = process.env.REACT_APP_STARK_KEY;
  const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;

  // listing --->
  const [startingIndex, setStartingIndex] = useState(0);
  const [endingIndex, setEndingIndex] = useState(0);
  const [myriaClient, setMyriaClient] = useState({});

  const bulkListMessageGenerator = (tokenId) => {
    setStartingIndex(startingIndex + 1);
    toast.success("NFT #", tokenId ? tokenId : startingIndex + 1, " Listed!");
  };

  const handleBulkListing = () => {
    toast.promise(
      GetMyriaErc721ByStarkKey(myriaClient, STARK_KEY).then((assets) => {
        console.log("Get NFTs:", assets);
        toast.promise(
          BulkListErc721(
            myriaClient,
            PUBLIC_KEY,
            STARK_KEY,
            assets,
            startingIndex,
            endingIndex,
            bulkListMessageGenerator
          ).then((listingResponce) =>
            console.log("Listing Response:", listingResponce)
          ),
          {
            loading: "Listing Myria NFTs",
            success: "Listed Successfully!",
            error: "Listing Error!",
          }
        );
      }),
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
  // listing <---

  const iClient = {
    provider: null,
    networkId: null,
    web3: null,
    env: env,
  };
  // const iClient = await getMyriaClient();
  const mClient = new MyriaClient(iClient);
  const moduleFactory = new ModuleFactory(mClient);
  const assetManager = moduleFactory.getAssetOnchainManager();

  const handleListing = (tokenId) => {
    console.log("Token ID:", tokenId);
    toast.promise(
      getMyriaClient().then((i_client) =>
        ListErc721(i_client, PUBLIC_KEY, STARK_KEY, tokenId).then(
          (response) => {
            console.log("Listing Response:", response);
            window.location.reload();
          }
        )
      ),
      {
        loading: "Listing of Token #" + tokenId,
        success: "Token Listed successfully!",
        error: "Error While Listing!",
      }
    );
  };

  const fetchCollection = () => {
    assetManager
      .getAssetByStarkKey(STARK_KEY, 1, 20)
      .then((responce) => {
        console.log("Collection:", responce);
        setMintedAssets(
          responce?.data?.items
          // responce?.data?.items.filter(
          //   (item) =>
          //     item.tokenAddress === "0xc6dd9ff35aed227a0fbb9bd7d78ed48314fcc8c9"
          // )
        );
        setAssetMeta(responce?.data?.meta);
        // Load More button Status
        responce?.data?.meta?.totalPages > responce?.data?.meta?.currentPage
          ? setLoadMoreStatus({
              option: true,
              status: false,
            })
          : setLoadMoreStatus({
              option: false,
              status: false,
            });
      })
      .catch((err) => console.log("errror:", err));
  };
  const loadMore = () => {
    console.log("Loading Page:", pageNumber + 1);
    setPageNumber(pageNumber + 1);
    setLoadMoreStatus({
      option: false,
      status: true,
    });

    assetManager
      .getAssetByStarkKey(STARK_KEY, pageNumber + 1, 20)
      .then((responce) => {
        const previousAssets = mintedAssets;
        const newAssets = responce?.data?.items;
        // const newAssets = responce?.data?.items.filter(
        //   (item) =>
        //     item.tokenAddress === "0xc6dd9ff35aed227a0fbb9bd7d78ed48314fcc8c9"
        // );

        setAssetMeta(responce?.data?.meta);
        setMintedAssets([...previousAssets, ...newAssets]);
        // Load More button Status
        responce?.data?.meta?.totalPages > responce?.data?.meta?.currentPage
          ? setLoadMoreStatus({
              option: true,
              status: false,
            })
          : setLoadMoreStatus({
              option: false,
              status: false,
            });
      })
      .catch((err) => console.log("errror:", err));
  };
  console.log("Metadata:", assetMeta);

  const [fetched, setFetched] = useState(false);
  React.useEffect(() => {
    if (!fetched) {
      setFetched(true);
      fetchCollection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Toaster />
      <div className="p-3 py-12 lg:p-12 w-full relative">
        {/* Bulk Listing */}
        <div className="px-8 md:px-12 lg:px-24 xl:px-36 mb-4 flex justify-between w-full z-40">
          <div className="bg-primary_card border border-bg_button rounded-xl md:rounded-full w-full flex md:items-center flex-col md:flex-row">
            <p className="px-6 py-2 text-lg font-medium w-auto my-auto">
              <span> Bluk Listing </span>
              <span className="text-xs">
                (Add starting and ending index accordingly to card number)
              </span>
            </p>
            <input
              className="relative text-base font-semibold bg-[#ffffff39] text-black border border-primary rounded-full w-auto mr-4 py-1 px-4"
              type="number"
              placeholder="Starting Index"
              value={startingIndex}
              onChange={(e) => setStartingIndex(e.target.value)}
            />
            <input
              className="relative text-base font-semibold bg-[#ffffff39] text-black border border-primary rounded-full w-auto mr-4 ml-auto py-1 px-4"
              type="number"
              placeholder="Ending Index"
              value={endingIndex}
              onChange={(e) => setEndingIndex(e.target.value)}
            />
            <button
              onClick={handleBulkListing}
              className=" bg-bg_button text-black cursor-pointer text-md font-semibold rounded-full py-1 px-6 mr-2 w-auto ml-auto"
            >
              Bulk List at Price 0.22ETH
            </button>
          </div>
        </div>

        <div className=" px-8 md:px-12 lg:px-24 xl:px-36 mb-4 flex justify-between mt-20">
          <h3>Total Minted: {assetMeta?.totalItems} / 1400</h3>
          <p>Total Listed Items: {assetMeta?.totalAssetsForSale}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8 px-0 md:12 lg:px-24 xl:px-36">
          {mintedAssets.map((asset, index) => (
            <NFTCard
              index={index}
              asset={asset}
              key={"as" + index}
              handleListing={handleListing}
            />
          ))}
        </div>
        <div className="flex justify-between">
          {loadMoreStatus?.option && (
            <button
              onClick={loadMore}
              className="px-8 py-3 text-black font-semibold bg-bg_button rounded-lg cursor-pointer mt-8 mx-auto"
            >
              {loadMoreStatus?.status ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Collection;
