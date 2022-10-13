import { FeeType, ModuleFactory, TokenType } from "myria-core-sdk";

async function getAssets(assets, assetManager) {
  const listingAssets = [];
  assets.forEach(async (asset) => {
    const assetDetails = (await assetManager.getAssetById(asset.id)).data;
    listingAssets.push(assetDetails);
  });
  return listingAssets;
}

export async function BulkListErc721(
  client,
  account,
  starkKey,
  assets,
  startAssetIndex,
  endAssetIndex,
  bulkListMessageGenerator
) {
  const moduleFactory = new ModuleFactory(client);
  const orderManager = moduleFactory.getOrderManager();
  const assetManager = moduleFactory.getAssetOnchainManager();
  const listingAssets = await getAssets(assets, assetManager);


  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  let bulkListResult = [];

  try {
    console.log("Initiating a bulk listing...");
    await timer(2000);

    const price = "0.22";
    // const startAssetIndex = 0;
    // const endAssetIndex = 2;

    for (let i = startAssetIndex; i < endAssetIndex; i++) {
      const signableFee =
        (listingAssets[i]?.fee && listingAssets[i]?.fee?.length) > 0
          ? [
              {
                address: listingAssets[i]?.fee[0].address,
                percentage: listingAssets[i]?.fee[0].percentage,
                feeType: FeeType.ROYALTY,
              },
            ]
          : undefined;

      const payload = {
        orderType: "SELL",
        ethAddress: account,
        assetRefId: parseInt(listingAssets[i].id, 10),
        starkKey: starkKey,
        tokenSell: {
          type: TokenType.MINTABLE_ERC721,
          data: {
            tokenId: listingAssets[i]?.tokenId,
            tokenAddress: listingAssets[i]?.tokenAddress,
          },
        },
        amountSell: "1",
        tokenBuy: {
          type: TokenType.ETH,
          data: {
            quantum: "10000000000",
          },
        },
        amountBuy: price + "",
        includeFees: signableFee ? true : false,
        fees: signableFee,
      };

      const signature = await orderManager?.signableOrder(payload);
      await timer(2000);

      const feeSign = signature?.feeInfo
        ? {
            feeLimit: signature?.feeInfo?.feeLimit,
            feeToken: signature?.feeInfo?.assetId,
            feeVaultId: signature?.feeInfo?.sourceVaultId,
          }
        : undefined;

      const feeData = signature?.feeInfo
        ? [
            {
              feeType: FeeType.ROYALTY,
              percentage: listingAssets[i]?.fee[0].percentage,
              address: account,
            },
          ]
        : undefined;

      if (signature) {
        const paramCreateOrder = {
          assetRefId: parseInt(listingAssets[i].id, 10),
          orderType: "SELL",
          feeSign: feeSign,
          includeFees: true,
          amountSell: signature.amountSell,
          amountBuy: signature.amountBuy,
          sellerStarkKey: starkKey,
          vaultIdSell: signature.vaultIdSell,
          vaultIdBuy: signature.vaultIdBuy,
          sellerAddress: account,
          assetIdBuy: signature.assetIdBuy,
          assetIdSell: signature.assetIdSell,
          fees: feeData,
        };
        const listResponse = await orderManager?.createOrder(paramCreateOrder);
        if (listResponse) {
          console.log(`Listed asset #${listingAssets[i].id}`);
          bulkListMessageGenerator(listingAssets[i].id);
          bulkListResult.push(listResponse);
        }
      }
      await timer(2000);
    }
    if (bulkListResult && bulkListResult.length) {
      console.log(
        `Bulk listing is completed. Listed ${bulkListResult.length} assets...`
      );
    }
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }
}
