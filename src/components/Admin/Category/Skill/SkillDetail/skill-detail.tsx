import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Types from './types';
import { ActionValues } from '../Common/types';
import { useFormik } from 'formik';
import { validationSchema } from './validations';
import Loader from '../../../../Common/Loader/loader';
import * as Logics from '../../../../Common/Logic/logics';
import { ErrorMessages } from '../../../../Common/ErrorMessage/error-message';

const SkillCategoryDetail = React.memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [msg, setMsg] = useState<string>('');

  const reducer = (
    state: Types.StateReducerType,
    action: Types.ActionReducerType
  ) => {
    const { type, payload } = action;
    switch (type) {
      case ActionValues.GET_SKILL:
        return {
          skill: payload,
        };
      default:
        return state;
    }
  };

  const [data, dispatch] = useReducer(reducer, Types.InitStateReducerType);

  const fetchApi = useCallback(async () => {
    const url = `skills/${id}`;
    const response = await Logics.callApi(url, Logics.MethodProps.GET).catch(
      (err) => console.log({ err })
    );
    dispatch({
      type: ActionValues.GET_SKILL,
      payload: response.data || [],
    });
    setIsLoading(false);
  }, [id]);

  const deleteAge = useCallback(
    async (id: string) => {
      if (confirm('Are you sure you want to delete this skill category?')) {
        setIsLoading(true);
        const response = await Logics.callApi(
          'skills',
          Logics.MethodProps.DELETE,
          {
            id: id,
          }
        ).catch((err) => console.log({ err }));
        setIsLoading(false);
        if (response) {
          Logics.showToast(
            'Delete branch category success',
            Logics.ToastTypeOptions.Success
          );
          navigate(-1);
        } else {
          Logics.showToast(
            'Delete branch category fail',
            Logics.ToastTypeOptions.Error
          );
        }
      }
    },
    [navigate]
  );

  const onSubmit = useCallback(
    async (formikValues: Types.FormikBagType) => {
      setMsg('');
      if (
        formikValues.skillName &&
        data.skill &&
        formikValues.skillName === data.skill.skillName
      ) {
        setMsg('There must be at least one data change');
      } else {
        // show loader while update information
        setIsLoading(true);
        const requestPayload = {
          ...formikValues,
          id: id,
        };
        const response = await Logics.callApi(
          'skills',
          Logics.MethodProps.PATCH,
          requestPayload
        ).catch((err) => console.log({ err }));
        // close loader when updated information
        setIsLoading(false);
        if (response) {
          setMsg('Update category success');
          fetchApi();
        } else {
          setMsg('Skill Category Name already existed');
        }
      }
      Logics.scrollTop();
    },
    [data, fetchApi, id]
  );

  const formikBag = useFormik({
    initialValues: {
      skillName: '',
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
    if (data.skill && data.skill.skillName !== '') {
      formikBag.setFieldValue('skillName', data.skill.skillName);
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
            <table className="w-full text-sm text-left text-gray-500">
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
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Skill ID
                  </th>
                  <td className="px-6 py-4 text-base">
                    {data.skill ? data.skill.skillId : ''}
                  </td>
                  <td className="px-6 py-4">
                    {data.skill ? data.skill.skillId : ''}
                  </td>
                </tr>
                <tr className="bg-white border-b hover:bg-gray-100 text-black">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Skill Name
                  </th>
                  <td className="px-6 py-4 text-base">
                    {data.skill ? data.skill.skillName : ''}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      id="skillName"
                      name="skillName"
                      className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-base ${
                        formikBag.errors.skillName &&
                        formikBag.touched.skillName
                          ? 'bg-yellow'
                          : ''
                      }`}
                      value={formikBag.values.skillName || ''}
                      onChange={formikBag.handleChange}
                    />
                    {formikBag.errors.skillName &&
                      formikBag.touched.skillName && (
                        <p className="text-orange-600">
                          {formikBag.errors.skillName}
                        </p>
                      )}
                  </td>
                </tr>
                <tr className="bg-white border-b hover:bg-gray-100 text-black">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Created Date
                  </th>
                  <td className="px-6 py-4 text-base">
                    {data.skill && data.skill.createdAt
                      ? Logics.formatDate(data.skill.createdAt)
                      : ''}
                  </td>
                  <td className="px-6 py-4 text-base">
                    {data.skill && data.skill.createdAt
                      ? Logics.formatDate(data.skill.createdAt)
                      : ''}
                  </td>
                </tr>
                <tr className="bg-white border-b hover:bg-gray-100 text-black">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Updated At
                  </th>
                  <td className="px-6 py-4 text-base">
                    {data.skill && data.skill.updatedAt
                      ? Logics.formatDate(data.skill.updatedAt)
                      : ''}
                  </td>
                  <td className="px-6 py-4 text-base">
                    {data.skill && data.skill.updatedAt
                      ? Logics.formatDate(data.skill.updatedAt)
                      : ''}
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
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm py-2.5 mr-2 mb-2 px-20"
              onClick={handleSubmit}
            >
              Update
            </button>
            <button
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm py-2.5 mr-2 mb-2 ms-10 px-20"
              onClick={() => deleteAge(data.skill ? data.skill._id : '')}
            >
              Delete
            </button>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 mr-2 mb-2 focus:outline-none px-20 ms-10"
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

export default SkillCategoryDetail;
