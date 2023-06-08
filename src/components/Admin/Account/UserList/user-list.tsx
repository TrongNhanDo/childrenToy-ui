import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import {
   ActionType,
   ActionTypes,
   InitStateType,
   UserType,
} from "../common/types";
import { callApi } from "../../../../api/callApi/callApi";
import { formatDate, formatRole } from "../../../Common/Logic/logics";
import { Loader } from "../../../Common/Loader/loader";

export const UserList = () => {
   const [showLoader, setShowLoader] = useState<boolean>(true);
   const dataPerPage = useMemo(
      () => parseInt(import.meta.env.VITE_PER_PAGE || 10),
      []
   );
   const reducer = (state: InitStateType, action: ActionType) => {
      const { type, payload } = action;
      switch (type) {
         case ActionTypes.SET_USERS:
            return {
               ...state,
               users: payload && payload.users ? payload.users : [],
               totalPage:
                  payload && payload.totalPage
                     ? Math.ceil(payload.totalPage / dataPerPage)
                     : 0,
            };
            break;
         default:
            return state;
      }
   };

   const initState = {
      users: [],
      totalPage: 0,
   };

   const [data, dispatch] = useReducer(reducer, initState);

   const fetchApi = useCallback(async () => {
      // get totalPage
      const response = await callApi("users", "get").catch((err) =>
         console.log({ err })
      );
      // get data paginate
      const responsePaginate = await callApi("users/paginate", "post", {
         perPage: dataPerPage,
         page: 1,
      }).catch((err) => console.log({ err }));
      dispatch({
         type: ActionTypes.SET_USERS,
         payload: {
            totalPage: response.data.length || 0,
            users: responsePaginate.data || [],
         },
      });
      setShowLoader(false);
   }, [dataPerPage]);

   const changePage = useCallback(async (perPage: number, page: number) => {
      setShowLoader(true);
      const response = await callApi("users", "get").catch((err) =>
         console.log({ err })
      );
      const responsePaginate = await callApi("users/paginate", "post", {
         perPage: perPage || 10,
         page: page || 1,
      }).catch((err) => console.log({ err }));
      dispatch({
         type: ActionTypes.SET_USERS,
         payload: {
            totalPage: response.data.length || 0,
            users: responsePaginate.data || [],
         },
      });
      setShowLoader(false);
   }, []);

   const Pagination = useMemo(() => {
      const buttons = [];
      for (let index = 1; index <= data.totalPage; index++) {
         buttons.push(
            <button
               key={index}
               type="button"
               className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
               onClick={() => changePage(dataPerPage, index)}
            >
               {index}
            </button>
         );
      }
      return buttons.length > 0 ? buttons : [];
   }, [changePage, data, dataPerPage]);

   useEffect(() => {
      fetchApi();
   }, [fetchApi]);

   return (
      <div>
         {showLoader && <Loader />}
         <div className="container m-auto">
            <h2 className="text-4xl font-extrabold text-current my-3 text-center mt-10 mb-5">
               LIST OF USER ACCOUNTS
            </h2>
            <div className="flex justify-center mb-2">
               <Link
                  to="/admin/add-user"
                  type="button"
                  className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
               >
                  INSERT NEW ACCOUNT
               </Link>
            </div>
            {Pagination.length > 1 && <div className="flex">{Pagination}</div>}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg  m-auto">
               <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                     <tr>
                        <th scope="col" className="px-6 py-3">
                           No
                        </th>
                        <th scope="col" className="px-6 py-3">
                           user name
                        </th>
                        <th scope="col" className="px-6 py-3">
                           role
                        </th>
                        <th scope="col" className="px-6 py-3">
                           created date
                        </th>
                        <th scope="col" className="px-6 py-3">
                           updated at
                        </th>
                        <th scope="col" className="px-6 py-3">
                           <span className="sr-only">Edit</span>
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {data &&
                        data.users &&
                        data.users.map((value: UserType, index: number) => (
                           <tr
                              key={index}
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                           >
                              <td className="px-6 py-4">{index + 1}</td>
                              <th
                                 scope="row"
                                 className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                 {value.username || ""}
                              </th>
                              <td className="px-6 py-4">
                                 {formatRole(value.role)}
                              </td>
                              <td className="px-6 py-4">
                                 {formatDate(value.createdAt)}
                              </td>
                              <td className="px-6 py-4">
                                 {formatDate(value.updatedAt)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <Link
                                    to={`/admin/user-detail/${value._id}`}
                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                 >
                                    Detail
                                 </Link>
                              </td>
                           </tr>
                        ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};