import { OnchainAssetManager } from "myria-core-sdk";
// import { useState } from "react";

export const GetMyriaErc721ByStarkKey = async (client, starkKey) => {
  const assetManager = new OnchainAssetManager(client);
  //   const [assets, setAssets] = useState([]);
  let assets;
  try {
    console.log(`Retrieving a list of assets with ${starkKey} stark key...`);
    await assetManager.getFullInfoAssetByStarkKey(starkKey).then((data) => {
      //   console.log("Data:", data);
      if (data.data.MINTABLE_ERC721) {
        data.data.MINTABLE_ERC721.forEach((item, index) => {
          console.log("Asset #", index, ": ", item);
          //   setAssets((assets) => [...assets, item]);
          //   assets = [...assets, ...item];
          assets = item;
        });
      } else {
        return;
      }
    });
    console.log(assets);
    return assets;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    return;
  }
};
