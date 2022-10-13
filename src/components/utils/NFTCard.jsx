// import { axios } from "axios";
import React from "react";

function NFTCard({ index, asset, handleListing }) {
  // const [metadata, setMetadata] = React.useState(null)
  // axios.get(asset?.blueprint).then((response) => {
  //   console.log("Metadata:",response)
  //   setMetadata()
  // });
  console.log("Asset:", asset, "ID:", asset?.id);
  return (
    <div className="relative">
      <p className="bg-bg_button text-black font-semibold text-sm leading-none h-7 w-7 flex justify-center items-center rounded-full absolute top-3 left-3">
        {index + 1}
      </p>
      <img
        src={asset?.metadataOptional?.image}
        alt="collection-imag"
        className="w-full h-64 rounded-t-xl bg-cover"
        style={{ objectFit: "cover", position: "center" }}
      />
      <div className="bg-primary_card p-4 rounded-b-xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-300">Sigil Metaverse</p>
            <p className=" text-sm font-semibold mb-4">{asset?.name}</p>
          </div>
          {asset?.order ? (
            <a
              href={`https://staging.nonprod-myria.com/marketplace/asset-detail/?id=${asset?.id}#inventory`}
              className=" bg-green-400 text-black text-sm font-medium py-px px-4 mb-auto rounded-xl cursor-pointer"
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          ) : (
            <button
              onClick={() => handleListing(asset?.id)}
              className=" bg-bg_button text-black py-px px-4 text-sm font-medium mb-auto rounded-xl cursor-pointer"
            >
              List at 0.22
            </button>
          )}
        </div>

        <div className="flex justify-between">
          <p className="text-xs text-gray-300">Creator</p>
          <p className="text-xs text-gray-300">Price</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm font-medium">Everyday SHEROE</p>
          <p className="text-sm font-medium">
            {asset?.order
              ? asset?.order?.nonQuantizedAmountBuy + " ETH"
              : "______"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NFTCard;
