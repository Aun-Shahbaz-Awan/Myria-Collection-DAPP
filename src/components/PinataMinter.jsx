import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
// Icons
import { BiImageAdd, BiEdit, BiLoaderAlt } from "react-icons/bi";
// Contract
import { abi } from "./../contract/contractAbi";
import { address } from "./../contract/contractAddress";
// Popup
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PinataMinter({ wallet }) {
  const [formInput, setFormInput] = useState({
    name: "",
    description: "",
    external_url: "",
    image: "",
    animation_url: "",
  });
  const [mintingStatus, setMintingStatus] = useState(false);
  // 1.Upload file [i.e. Image] to Pinata
  const handleUploadImage = async (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    toast.promise(
      axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
          pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setFormInput({
            ...formInput,
            image: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`,
          });
        })
        .catch((err) => {
          toast.error("Error in uploading Image to IPFS: ");
          toast.error(err);
        }),
      {
        pending: "Image is uploading to IPFS...",
        success: "Upload Image Successfully 👌",
        error: "Promise rejected 🤯",
      }
    );
  };
  // 2.Creating Item and Saving it to IPFS
  const handleCreateMetadata = async () => {
    const { name, description, external_url, image, animation_url } = formInput;
    if (!name || !description || !image || !animation_url || !external_url) {
      toast.error("Please fill all the fields");
      return;
    }
    setMintingStatus(true);
    const metadata = {
      description: description,
      external_url: external_url,
      image: image,
      animation_url: animation_url,
      name: name,
    };
    setFormInput({
      name: "",
      description: "",
      external_url: "",
      image: "",
      animation_url: "",
    });
    // Save Token Metadata to IPFS
    toast.promise(
      axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: JSON.stringify(metadata),
        headers: {
          pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
          pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          mintItem(`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
          setMintingStatus(false);
        })
        .catch((err) => {
          toast.error("Error Uploading Metadata to IPFS: Metadata ");
          toast.error(err);
          setMintingStatus(false);
        }),
      {
        pending: "Uploading Metadata to IPFS",
        success: "Uploaded Metadata Successfully 👌",
        error: "Promise rejected 🤯",
      }
    );
  };
  // 3.Mint item
  const mintItem = async (metadataURI) => {
    // console.log("URL", metadataURI);
    let contract = new ethers.Contract(address, abi, wallet?.signer);
    toast.promise(
      contract.safeMint(wallet?.address, metadataURI).then((transaction) => {
        toast.promise(
          transaction
            .wait()
            .then((tx) => {
              toast.info(tx);
              setMintingStatus(false);
            })
            .catch((err) => {
              toast.error("Error in Minting Token:", err);
            }),
          {
            pending: "Minting in Process...",
            success: "Mint Successfully 👌",
            error: "Promise rejected 🤯",
          }
        );
      }),
      {
        pending: "Waiting to Sign Transaction...",
        success: "Transaction Signed... 👌",
        error: "Transaction Rejected 🤯",
      }
    );
  };
  // FromData
  // console.log("FormData: ", formInput);
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col justify-center lg:flex-row p-6 h-[calc(h-screen - 12rem)]">
        <div className="w-full lg:w-5/12 h-auto lg:pr-3">
          {/* Image */}
          <div className="mb-6 mr-6 w-full">
            <label className="text-lg font-semibold text-white dark:text-gray-100">
              Image, or 3D Model
              <p className="text-xs mb-2">
                File types supported: JPG, PNG, SVGs. We recommend using a 350 x
                350 image.
              </p>
            </label>
            <div className="rounded relative h-60 sm:h-80 lg:h-[calc(100vh-188px)]">
              {formInput.image ? (
                <img
                  src={formInput.image}
                  alt="pic"
                  className="w-full h-full object-cover rounded absolute shadow"
                />
              ) : (
                <BiImageAdd className="w-full h-full p-10 object-cover rounded absolute shadow" />
              )}

              <div className="absolute bg-black opacity-50 top-0 right-0 bottom-0 left-0 rounded" />
              <div className="flex items-center rounded absolute right-0 mr-4 mt-4">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer p-2 rounded-md font-medium text-gray-200 hover:text-secondary focus:text-green-200"
                >
                  <p className="text-xs flex items-center">
                    Upload Image
                    <span className="ml-2">
                      <BiEdit />
                    </span>
                  </p>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    required
                    onChange={handleUploadImage}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-7/12 lg:pl-12 lg:mt-14">
          {/* Animation Url */}
          <input
            type="text"
            placeholder="Amination Url"
            value={formInput.animation_url}
            onChange={(e) =>
              setFormInput({ ...formInput, animation_url: e.target.value })
            }
            className="w-full h-12 p-4 outline-0 rounded-full outline-hidden bg-back mb-3"
          />
          {/* External Url */}
          <input
            type="text"
            placeholder="External Link"
            value={formInput.external_url}
            onChange={(e) =>
              setFormInput({ ...formInput, external_url: e.target.value })
            }
            className="w-full h-12 p-4 outline-0 rounded-full outline-hidden bg-back mb-3"
          />
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={formInput.name}
            onChange={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
            className="w-full h-12 p-4 outline-0 rounded-full outline-hidden bg-back mb-3"
          />
          {/* Description */}
          <textarea
            type="textarea"
            placeholder="Description"
            value={formInput.description}
            onChange={(e) =>
              setFormInput({ ...formInput, description: e.target.value })
            }
            className="w-full p-4 m-0 outline-0 rounded-xl outline-hidden bg-back"
          />
          {/* Mint */}
          {/* Create */}
          <div className="py-3 text-right">
            <button
              disabled={
                !formInput.image ||
                !formInput.name ||
                !formInput.description ||
                !formInput.animation_url ||
                !formInput.external_url
              }
              type="submit"
              className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-lg text-sm font-medium rounded-md  ${
                formInput.image &&
                formInput.name &&
                formInput.description &&
                formInput.animation_url &&
                formInput.external_url
                  ? "text-primary bg-secondary border-primary hover:bg-primary hover:text-secondary"
                  : " cursor-not-allowed bg-green-100 text-gray-400"
              }`}
              onClick={() => handleCreateMetadata()}
            >
              {mintingStatus ? (
                <span className="flex">
                  <BiLoaderAlt className="animate-spin h-5 w-5 mr-3" />
                  Creating...
                </span>
              ) : (
                <span>Create NFT</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PinataMinter;
