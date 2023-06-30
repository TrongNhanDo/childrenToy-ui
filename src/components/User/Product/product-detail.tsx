import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../../../api/callApi/callApi";
import { FormikProps, ProductType } from "./types";
import Loader from "../../Common/Loader/loader";
import { formatCurrency, renderStar } from "../../Common/Logic/logics";
import { useFormik } from "formik";
import { validationSchema } from "./validations";
import { useTranslation } from "react-i18next";
import { SumProductContext } from "../../../context/SumProductContext";

const UserProductDetail = React.memo(() => {
   const { t } = useTranslation();
   const { productId } = useParams();
   const navigate = useNavigate();
   const [showLoading, setShowLoading] = useState<boolean>(true);
   const [viewData, setViewData] = useState<ProductType>();
   const [mainImage, setMainImage] = useState<string>();
   const { sumProduct, setSumProduct, userId } = useContext(SumProductContext);
   const [isBuyNow, setIsBuyNow] = useState<boolean>();

   const fetchApi = useCallback(async () => {
      const url = `products/${productId}`;
      const response = await callApi(url, "get").catch((err) =>
         console.log({ err })
      );
      if (!response || !response.data) {
         alert("Sản phẩm không tồn tại");
         navigate(-1);
      } else {
         const viewData: ProductType = response.data;
         setViewData(viewData);
      }
      setShowLoading(false);
   }, [productId, navigate]);

   const onSubmit = useCallback(
      async (formikBagValues: FormikProps) => {
         try {
            setShowLoading(true);
            const newValue = sumProduct + parseInt(formikBagValues.amount);
            setSumProduct(newValue);
            await callApi("carts", "post", formikBagValues).catch((err) =>
               console.log({ err })
            );
            if (isBuyNow) {
               navigate("/carts");
            }
            setShowLoading(false);
         } catch (error) {
            console.log({ error });
         }
      },
      [sumProduct, setSumProduct, isBuyNow, navigate]
   );

   const formikBag = useFormik({
      initialValues: {
         userId: "",
         productId: "",
         price: "",
         amount: "",
      },
      validationSchema: validationSchema(t),
      onSubmit: (value) => onSubmit(value),
   });

   const handleSubmit = useCallback(
      (isBuyNow: boolean) => {
         try {
            setIsBuyNow(isBuyNow);
            formikBag.submitForm();
         } catch (error) {
            console.log({ error });
         }
      },
      [formikBag]
   );

   useEffect(() => {
      if (!productId) {
         navigate(-1);
      }
   }, [productId, navigate, viewData]);

   useEffect(() => {
      fetchApi();
   }, [fetchApi]);

   useEffect(() => {
      if (viewData && viewData.images && viewData.images[0]) {
         setMainImage(viewData.images[0]);
      }
   }, [viewData]);

   useEffect(() => {
      if (viewData) {
         formikBag.setFieldValue("userId", userId || "");
         formikBag.setFieldValue("productId", viewData._id || "");
         formikBag.setFieldValue("price", viewData.price || "");
         formikBag.setFieldValue("amount", 1);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [viewData]);

   return (
      <div className="div-contai flex flex-col my-5 bg-white p-5 rounded">
         {showLoading && <Loader />}
         <div className="flex w-full">
            <div className="w-2/12 pe-5">
               {viewData && viewData.images.length ? (
                  viewData.images.map((value: string, index: number) => {
                     return (
                        <img
                           key={index}
                           src={
                              value ||
                              import.meta.env.VITE_IMAGE_NOT_FOUND ||
                              ""
                           }
                           alt=""
                           className={`w-full h-36 object-cover rounded mb-2 border-solid border-2 border-gray-200 ${
                              value === mainImage ? "cursor-not-allowed" : ""
                           }`}
                           onClick={() => setMainImage(value)}
                        />
                     );
                  })
               ) : (
                  <img
                     src={import.meta.env.VITE_IMAGE_NOT_FOUND || ""}
                     alt=""
                  />
               )}
            </div>
            <div className="w-5/12">
               <img
                  src={mainImage || import.meta.env.VITE_IMAGE_NOT_FOUND}
                  alt=""
                  className="w-full h-auto object-cover rounded"
               />
            </div>
            <div className="w-5/12 px-10 flex flex-col">
               <form onSubmit={formikBag.handleSubmit}>
                  <input
                     type="hidden"
                     name="userId"
                     id="userId"
                     value={formikBag.values.userId || ""}
                     onChange={formikBag.handleChange}
                  />
                  <input
                     type="hidden"
                     name="productId"
                     id="productId"
                     value={formikBag.values.productId || ""}
                     onChange={formikBag.handleChange}
                  />
                  <input
                     type="hidden"
                     name="price"
                     id="price"
                     value={formikBag.values.price || ""}
                     onChange={formikBag.handleChange}
                  />

                  <div className="text-2xl font-bold line-clamp-3">
                     {viewData ? viewData.productName : ""}
                  </div>
                  <div className="mt-3">
                     {t("user.product_detail.branch")}:{" "}
                     <span className="text-xl font-bold">
                        {viewData && viewData.branch
                           ? viewData.branch.branchName
                           : ""}
                     </span>
                  </div>
                  <div className="mt-3">
                     {t("user.product_detail.skill")}:{" "}
                     <span className="text-xl font-bold">
                        {viewData && viewData.skill
                           ? viewData.skill.skillName
                           : ""}
                     </span>
                  </div>
                  <div className="mt-3">
                     {t("user.product_detail.age")}:{" "}
                     <span className="text-xl font-bold">
                        {viewData && viewData.age ? viewData.age.ageName : ""}
                     </span>
                  </div>
                  <div className="mt-3">
                     {t("user.product_detail.price")}:{" "}
                     <span className="text-2xl font-bold">
                        {viewData ? formatCurrency(viewData.price || 0) : ""}
                     </span>
                  </div>
                  <div className="flex mt-3">
                     <div>
                        {renderStar(
                           viewData && viewData.rate ? viewData.rate : 0
                        )}
                     </div>
                     <div className="underline mx-2">0</div>
                     {t("user.product_detail.rate")}
                  </div>
                  <div className="flex mt-5 items-center">
                     {t("user.product_detail.amount")}:
                     <input
                        type="number"
                        name="amount"
                        id="amount"
                        className="ms-5 px-4 py-2 rounded border-solid border-2 border-gray-200 font-bold text-xl w-24"
                        min={1}
                        value={formikBag.values.amount || ""}
                        onChange={formikBag.handleChange}
                     />
                  </div>
                  <div className="flex mt-10">
                     <button
                        type="button"
                        className="block bg-orange-200 hover:bg-orange-400 py-1 px-5 rounded"
                        onClick={() => handleSubmit(false)}
                     >
                        {t("user.product_detail.btn_add")}
                     </button>
                     <button
                        type="button"
                        onClick={() => handleSubmit(true)}
                        className="block bg-orange-400 hover:bg-orange-200 py-1 px-5 rounded ms-5"
                     >
                        {t("user.product_detail.btn_buy")}
                     </button>
                  </div>
               </form>
               <div className="mt-10">
                  <div className="text-xl font-bold ">
                     {t("user.product_detail.heading1")}
                  </div>
                  <form className="mt-3">
                     <input
                        type="email"
                        name="customer-email"
                        id="customer-email"
                        placeholder={t("user.product_detail.email_placeholder")}
                        className="px-4 py-2 rounded border-solid border-2 border-gray-200"
                     />
                     <button
                        type="button"
                        className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white"
                     >
                        {t("user.product_detail.btn_send")}
                     </button>
                  </form>
               </div>
            </div>
         </div>
         <div className="flex flex-col w-full mt-20">
            <div className="text-xl font-bold">
               {t("user.product_detail.description")}
            </div>
            <div className="mt-4">
               {viewData && viewData.describes ? viewData.describes : ""}
            </div>
         </div>
      </div>
   );
});

export default UserProductDetail;
