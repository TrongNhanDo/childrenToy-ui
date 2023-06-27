import React from "react";
import { Link } from "react-router-dom";
import i18n from "../../../../i18n/i18n";
import { useTranslation } from "react-i18next";

const HeaderUser = React.memo(() => {
   const { t } = useTranslation();
   const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const languageValue = e.target.value;
      i18n.changeLanguage(languageValue);
   };

   return (
      <>
         <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:border-gray-700">
            <li>
               <Link
                  to="/"
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
               >
                  {t("header.home")}
               </Link>
            </li>
            <li>
               <Link
                  to="/product-list"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
               >
                  {t("header.product")}
               </Link>
            </li>
            <li>
               <Link
                  to="/"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
               >
                  {t("header.service")}
               </Link>
            </li>
            <li>
               <Link
                  to="/about"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
               >
                  {t("header.about")}
               </Link>
            </li>
            <li>
               <Link
                  to="/contact"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
               >
                  {t("header.contact")}
               </Link>
            </li>
            <li>
               <Link
                  to="/carts"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 relative"
               >
                  {t("header.cart")}
                  <span className="absolute px-1 text-white bg-blue-700 rounded-full sum-count font-bold">
                     10
                  </span>
               </Link>
            </li>
            <li>
               <Link
                  to="/login"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
               >
                  {t("header.login")}
               </Link>
            </li>
            <li>
               <Link
                  to="/register"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
               >
                  {t("header.register")}
               </Link>
            </li>
            <li>
               <select
                  id="countries"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2"
                  onChange={(e) => changeLanguage(e)}
               >
                  <option value="eng">English</option>
                  <option value="vie">Vietnamese</option>
               </select>
            </li>
         </ul>
      </>
   );
});

export default HeaderUser;
