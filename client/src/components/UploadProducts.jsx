import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import productCategory from "../helpers/productCategory";
import { MdUpload, MdDelete } from "react-icons/md";
import UploadImage from "../helpers/uploadImage";
import DisplayProductImage from "./DisplayProductImage";
import AXIOS from "axios";
import { toast } from "react-toastify";

export default function UploadProducts({ onClose, fetchData }) {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [data, SetData] = useState({
    ProductName: "",
    ProductBrand: "",
    category: "",
    subcategory: "",
    description: "",
    quantity: "",
    price: "",
    sellingPrice: "",
  });
  console.log("image", data.productImage);
  console.log("preview", imagePreviews);

  const [fullScreenImage, SetFullScreenImage] = useState("");
  const [openFullScreenImage, SetOpenFullScreenImage] = useState(false);

  const handleOnChange = (e) => {
    SetData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);

    const previews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleDeleteProductImage = async (product, index) => {
    const newProductImages = [...data.productImage];
    newProductImages.splice(index, 1);
    SetData({ ...data, productImage: newProductImages });

    AXIOS.post(
      "https://zenglow-server.onrender.com/products/delete-product-image",
      {
        image: product,
        imageName: data?.ProductName || "ProductName",
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data", data);

    const formData = new FormData();

    for (let key in data) {
      formData.append(key, data[key]);
    }

    images.forEach((item) => formData.append("images", item));

    console.log(formData.getAll("images"));

    const resData = await AXIOS.post(
      "https://zenglow-server.onrender.com/products/upload-product",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          token: localStorage.getItem("token"),
        },
      }
    );
    if (resData.data.success) {
      toast.success(resData.data.message);
    }
    if (resData.data.error) {
      toast.error(resData.data.message);
    }
    onClose();
    fetchData();
  };

  return (
    <div className="fixed bg-pink-400 bg-opacity-50 w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center px-2 sm:px-0">
      <div className="bg-white shadow-md shadow-accent-dark hover:shadow-accent-dark hover:shadow-lg sm:p-4 p-2 mt-[75px] md:mt-0 pb-10 rounded w-full max-w-2xl h-full max-h-[90%] md:max-h-[80%] scrollbar-none overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Upload Product</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-pink-900 cursor-pointer"
            onClick={onClose}
          >
            <IoIosCloseCircle />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid p-4 gap-2 overflow-y-scroll h-full"
        >
          <div className="relative">
            <input
              type="text"
              id="ProductName"
              name="ProductName"
              value={data.ProductName}
              onChange={handleOnChange}
              className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="ProductName"
              className="absolute sm:text-base text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1   origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Product Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="ProductBrand"
              name="ProductBrand"
              value={data.ProductBrand}
              onChange={handleOnChange}
              className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="ProductBrand"
              className="absolute sm:text-base text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Brand Name
            </label>
          </div>

          <div className="flex gap-5 justify-evenly items-center">
            <div className="relative">
              <select
                name="category"
                id="category"
                value={data.category}
                className="block ring-0 border-0 px-2.5 pb-0.5 w-full sm:text-base text-xs text-gray-500 focus:text-accent-dark bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                placeholder=" "
                required
                onChange={handleOnChange}
              >
                <label
                  htmlFor="category"
                  className="absolute sm:text-base text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Category
                </label>

                <option className="sm:text-base text-xs text-gray-500" value="">
                  Select Category
                </option>

                {productCategory.map((product, index) => {
                  return (
                    <option
                      className="sm:text-base text-xs text-gray-500"
                      value={product.value}
                      key={product.value + index}
                      onChange={handleOnChange}
                    >
                      {product.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="relative">
              <select
                name="subcategory"
                id="subcategory"
                value={data.subcategory}
                className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full sm:text-base text-xs text-gray-500 focus:text-accent-dark bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                placeholder=" "
                required
                onChange={handleOnChange}
              >
                <label
                  htmlFor="subcategory"
                  className="absolute sm:text-base text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Sub Category
                </label>

                <option className="text-base text-gray-500" value="">
                  Select SubCategory
                </option>
                {data.category &&
                  productCategory.map((product, index) => {
                    return (
                      product.value == data.category &&
                      product.sub.map((value, index) => {
                        return (
                          <option
                            className="text-base text-gray-500"
                            value={value.value}
                            key={value.value + index}
                            onChange={handleOnChange}
                          >
                            {value.label}
                          </option>
                        );
                      })
                    );
                  })}
              </select>
            </div>
          </div>

          <label className="mt-3 text-gray-500 font-semibold">
            Product Images :
          </label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 group bg-slate-100 hover:bg-pink-50  border hover:border-accent-light rounded h-36 w-full flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 group-hover:text-accent-dark flex justify-center items-center flex-col gap-2">
                <span className="text-4xl">
                  <MdUpload />
                </span>
                <p className="text-sm">Upload Product Image</p>
                <input
                  className="hidden"
                  type="file"
                  multiple
                  name="uploadImageInput"
                  id="uploadImageInput"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </label>
          <div className="flex max-w-[310px] sm:max-w-xl">
            <div className="flex max-w-xl px-2 gap-2 overflow-x-scroll scrollbar-none py-5">
              {imagePreviews[0] ? (
                imagePreviews.map((product, index) => {
                  return (
                    <div className="relative group">
                      <div className=" w-32 h-40">
                        <img
                          key={index}
                          src={product}
                          width={100}
                          height={100}
                          className="bg-white py-4 border flex justify-center items-center cursor-pointer w-fit max-h-40 mx-auto min-h-40 h-fit"
                          alt={product}
                          onClick={() => {
                            SetOpenFullScreenImage(true);
                            SetFullScreenImage(product);
                          }}
                        />
                      </div>
                      <div
                        className="absolute bottom-1 right-1 p-1 text-xs text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
                        onClick={() => {
                          handleImageDelete(index);
                        }}
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-red-600 text-xs">
                  *Please Upload Product Image
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <input
              type="number"
              id="price"
              name="price"
              value={data.price}
              onChange={handleOnChange}
              className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="price"
              className="absolute sm:text-base text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Price
            </label>
          </div>

          <div className="relative">
            <input
              type="number"
              id="sellingPrice"
              name="sellingPrice"
              value={data.sellingPrice}
              onChange={handleOnChange}
              className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="sellingPrice"
              className="absolute sm:text-base text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Selling Price
            </label>
          </div>
          <div className="relative">
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={data.quantity}
              onChange={handleOnChange}
              className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="quantity"
              className="absolute sm:text-base text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Quantity
            </label>
          </div>
          <div className="mt-3 relative">
            <textarea
              name="description"
              id="description"
              className="block px-2.5 pb-2.5 pt-4 w-full text-base text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-accent-dark focus:outline-none focus:ring-0 focus:border-accent-dark peer"
              placeholder=" "
              rows="4"
              onChange={handleOnChange}
            />
            <label
              htmlFor="description"
              className="absolute text-xl font-semibold text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-accent-dark peer-focus:dark:text-accent-dark peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:top-2"
            >
              Description
            </label>
          </div>

          <button className="px-3 mt-3 py-2 bg-accent-light text-white mb-10 hover:bg-pink-900">
            Upload Product
          </button>
        </form>
      </div>
      {/* display image full screen */}

      {openFullScreenImage && (
        <DisplayProductImage
          onClose={() => SetOpenFullScreenImage(false)}
          imageName={fullScreenImage}
        />
      )}
    </div>
  );
}
