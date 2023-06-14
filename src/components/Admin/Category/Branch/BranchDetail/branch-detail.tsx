import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
   ActionReducerType,
   FormikBagType,
   InitStateReducerType,
   StateReducerType,
} from "./types";
import { ActionValues } from "../Common/types";
import { callApi } from "../../../../../api/callApi/callApi";
import { useFormik } from "formik";
import { validationSchema } from "./vadidations";
import Loader from "../../../../Common/Loader/loader";
import { formatDate, scrollTop } from "../../../../Common/Logic/logics";
import { ErrorMessages } from "../../../../Common/ErrorMessage/error-message";

const BranchCategoryDetail = React.memo(() => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [msg, setMsg] = useState<string>("");

   const reducer = (state: StateReducerType, action: ActionReducerType) => {
      const { type, payload } = action;
      switch (type) {
         case ActionValues.GET_BRANCH:
            return {
               branch: payload,
            };
         default:
            return state;
      }
   };

   const [data, dispatch] = useReducer(reducer, InitStateReducerType);

   const fetchApi = useCallback(async () => {
      const url = `branches/${id}`;
      const response = await callApi(url, "get").catch((err) =>
         console.log({ err })
      );
      dispatch({
         type: ActionValues.GET_BRANCH,
         payload: response.data || [],
      });
      setIsLoading(false);
   }, [id]);

   const deleteAge = useCallback(
      async (id: string) => {
         if (confirm("Are you sure you want to delete this branch category?")) {
            setIsLoading(true);
            const response = await callApi("branches", "delete", {
               id: id,
            }).catch((err) => console.log({ err }));
            setIsLoading(false);
            if (response) {
               alert("Delete branch category success");
               navigate(-1);
            } else {
               alert("Delete branch category fail");
            }
         }
      },
      [navigate]
   );

   const onSubmit = useCallback(
      async (formikValues: FormikBagType) => {
         setMsg("");
         if (
            formikValues.branchName &&
            data.branch &&
            formikValues.branchName === data.branch.branchName
         ) {
            setMsg("There must be at least one data change");
         } else {
            // show loader while update information
            setIsLoading(true);
            const requestPayload = {
               ...formikValues,
               id: id,
            };
            const response = await callApi(
               "branches",
               "patch",
               requestPayload
            ).catch((err) => console.log({ err }));
            // close loader when updated information
            setIsLoading(false);
            if (response) {
               setMsg("Update account success");
               fetchApi();
            } else {
               setMsg("Age Category Name already existed");
            }
         }
         scrollTop();
      },
      [data, fetchApi, id]
   );

   const formikBag = useFormik({
      initialValues: {
         branchName: "",
      },
      validationSchema,
      onSubmit: (value) => onSubmit(value),
   });

   const handleSubmit = useCallback(() => {
      try {
         formikBag.submitForm();
      } catch (error) {
         console.log({ error });
      }
   }, [formikBag]);

   useEffect(() => {
      fetchApi();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (data.branch && data.branch.branchName !== "") {
         formikBag.setFieldValue("branchName", data.branch.branchName);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [data]);

   return (
      <div>
         {isLoading && <Loader />}
         <div className="div-contai mt-10">
            <h2 className="text-4xl font-extrabold text-current my-3 text-center mt-10">
               BRANCH CATEGORY DETAIL
            </h2>
            {msg && ErrorMessages(msg)}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-auto">
               <form onSubmit={formikBag.handleSubmit}>
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                     <thead className="text-xs text-gray-700 uppercase bg-gray-300">
                        <tr>
                           <th scope="col" className="px-6 py-3">
                              Properties
                           </th>
                           <th scope="col" className="px-6 py-3">
                              Before Change
                           </th>
                           <th scope="col" className="px-6 py-3">
                              After change
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr className="bg-white border-b hover:bg-gray-100 text-black">
                           <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                           >
                              Branch ID
                           </th>
                           <td className="px-6 py-4 text-base">
                              {data.branch ? data.branch.branchId : ""}
                           </td>
                           <td className="px-6 py-4">
                              {data.branch ? data.branch.branchId : ""}
                           </td>
                        </tr>
                        <tr className="bg-white border-b hover:bg-gray-100 text-black">
                           <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                           >
                              Branch Name
                           </th>
                           <td className="px-6 py-4 text-base">
                              {data.branch ? data.branch.branchName : ""}
                           </td>
                           <td className="px-6 py-4">
                              <input
                                 type="text"
                                 id="branchName"
                                 name="branchName"
                                 className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-base ${
                                    formikBag.errors.branchName &&
                                    formikBag.touched.branchName
                                       ? "bg-yellow"
                                       : ""
                                 }`}
                                 value={formikBag.values.branchName || ""}
                                 onChange={formikBag.handleChange}
                              />
                              {formikBag.errors.branchName &&
                                 formikBag.touched.branchName && (
                                    <p className="text-orange-600">
                                       {formikBag.errors.branchName}
                                    </p>
                                 )}
                           </td>
                        </tr>
                        <tr className="bg-white border-b hover:bg-gray-100 text-black">
                           <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                           >
                              Created Date
                           </th>
                           <td className="px-6 py-4 text-base">
                              {data.branch && data.branch.createdAt
                                 ? formatDate(data.branch.createdAt)
                                 : ""}
                           </td>
                           <td className="px-6 py-4 text-base">
                              {data.branch && data.branch.createdAt
                                 ? formatDate(data.branch.createdAt)
                                 : ""}
                           </td>
                        </tr>
                        <tr className="bg-white border-b hover:bg-gray-100 text-black">
                           <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                           >
                              Updated At
                           </th>
                           <td className="px-6 py-4 text-base">
                              {data.branch && data.branch.updatedAt
                                 ? formatDate(data.branch.updatedAt)
                                 : ""}
                           </td>
                           <td className="px-6 py-4 text-base">
                              {data.branch && data.branch.updatedAt
                                 ? formatDate(data.branch.updatedAt)
                                 : ""}
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </form>
            </div>
            <div className="flex w-full mt-10 justify-center">
               <>
                  <button
                     type="button"
                     className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 px-20"
                     onClick={handleSubmit}
                  >
                     Update
                  </button>
                  <button
                     type="button"
                     className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 ms-10 px-20"
                     onClick={() =>
                        deleteAge(data.branch ? data.branch._id : "")
                     }
                  >
                     Delete
                  </button>
                  <button
                     type="button"
                     className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 px-20 ms-10"
                     onClick={() => navigate(-1)}
                  >
                     Back
                  </button>
               </>
            </div>
         </div>
      </div>
   );
});

export default BranchCategoryDetail;
