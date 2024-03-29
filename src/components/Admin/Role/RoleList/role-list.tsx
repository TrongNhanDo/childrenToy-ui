import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as ReactSimpleDialogs from 'react-simple-dialogs';
import { InitReducer, InputActionType, RoleType } from '../Common/types';
import { ActionValues } from '../Common/constants';
import Loader from '../../../Common/Loader/loader';
import * as CommonLogics from '../../../Common/Logic/logics';
import { Input } from '../../../Common/Input/input';
import { FormikBagType, InitFormikBag } from './types';
import { validationSchema } from './validations';
import { ModalCustom } from '../../../Common/Modal/modal-custom';

const RoleList = React.memo(() => {
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const dataPerPage = parseInt(import.meta.env.VITE_PER_PAGE || 10);
  const [modal, setModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const reducer = (state: InitReducer, action: InputActionType) => {
    const { type, payload } = action;
    switch (type) {
      case ActionValues.SET_ROLES:
        return {
          ...state,
          ...payload,
        };
      default:
        return state;
    }
  };

  const initState = {
    roles: [],
    totalPage: 0,
    count: 0,
    returnCnt: 0,
  };

  const [data, dispatch] = useReducer(reducer, initState);
  const fetchApi = useCallback(async () => {
    // get data paginate
    const response = await CommonLogics.callApi(
      'roles/paginate',
      CommonLogics.MethodProps.POST,
      {
        perPage: dataPerPage,
        page: 1,
      }
    ).catch((err) => console.log({ err }));
    const data: InitReducer = response.data || null;
    dispatch({
      type: ActionValues.SET_ROLES,
      payload: data,
    });
    setShowLoader(false);
  }, [dataPerPage]);

  const changePage = useCallback(async (perPage: number, page: number) => {
    setShowLoader(true);
    const response = await CommonLogics.callApi(
      'roles/paginate',
      CommonLogics.MethodProps.POST,
      {
        perPage: perPage || 10,
        page: page || 1,
      }
    ).catch((err) => console.log({ err }));
    const data: InitReducer = response.data || null;
    dispatch({
      type: ActionValues.SET_ROLES,
      payload: data,
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
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
          onClick={() => changePage(dataPerPage, index)}
        >
          {index}
        </button>
      );
    }
    return buttons.length > 0 ? buttons : [];
  }, [changePage, data, dataPerPage]);

  const onSubmit = useCallback(
    async (formikValues: FormikBagType) => {
      setSuccess(false);
      setShowLoader(true);
      const requestPayload = {
        ...formikValues,
        roleName: formikValues.roleName.trim(),
      };
      await CommonLogics.callApi(
        'roles',
        CommonLogics.MethodProps.POST,
        requestPayload
      )
        .then(() => {
          setSuccess(true);
          CommonLogics.showToast(
            'Insert new role success',
            CommonLogics.ToastTypeOptions.Success
          );
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
      await fetchApi();
      setShowLoader(false);
    },
    [fetchApi]
  );

  const deleteRole = useCallback(
    async (roleId: string) => {
      if (
        await ReactSimpleDialogs.simpleConfirm(
          'Are you sure you want to delete this role?'
        )
      ) {
        setShowLoader(true);
        const response = await CommonLogics.callApi(
          'roles',
          CommonLogics.MethodProps.DELETE,
          {
            id: roleId,
          }
        ).catch((err) => console.log({ err }));
        setShowLoader(false);
        if (response) {
          CommonLogics.showToast(
            'Delete role success',
            CommonLogics.ToastTypeOptions.Success
          );
          await fetchApi();
          setShowLoader(false);
        } else {
          CommonLogics.showToast(
            'Delete role fail',
            CommonLogics.ToastTypeOptions.Error
          );
        }
      }
    },
    [fetchApi]
  );

  const formikBag = useFormik({
    initialValues: InitFormikBag,
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

  const handleClose = useCallback(() => {
    try {
      formikBag.resetForm();
      setModal(false);
      setError('');
    } catch (error) {
      console.log({ error });
    }
  }, [formikBag]);

  useEffect(() => {
    if (success) {
      handleClose();
      formikBag.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    fetchApi();
  }, [fetchApi]);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  });

  return (
    <div className="div-contai mb-10">
      {showLoader && <Loader />}
      <ReactSimpleDialogs.SimpleDialogContainer />
      <div>
        <h2 className="text-4xl font-extrabold text-current my-3 text-center mt-10 mb-5">
          LIST OF AGE CATEGORIES
        </h2>
        <div className="flex justify-center mb-3">
          <button
            className="block bg-blue-300 hover:bg-blue-400 px-3 py-2 rounded"
            onClick={() => setModal(true)}
          >
            Add Role
          </button>
          {modal && (
            <ModalCustom>
              <form onSubmit={formikBag.handleSubmit} className="w-96">
                <div className="flex w-full justify-between text-2xl font-bold">
                  <div className="uppercase">add new role</div>
                  <button type="button" onClick={handleClose}>
                    ❌
                  </button>
                </div>
                <hr className="w-full my-3 h-0.5" />
                {error && error !== '' && (
                  <div className="bg-lime-300 w-full text-orange-600 mt-4 py-2 px-5 rounded-md">
                    {error}
                  </div>
                )}
                <div className="flex flex-col w-full">
                  <div className="mb-6">
                    <Input
                      label="Role Id:"
                      name="roleId"
                      id="roleId"
                      type="text"
                      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-1 ${
                        formikBag.errors.roleId && formikBag.touched.roleId
                          ? 'bg-yellow'
                          : ''
                      }`}
                      onChange={formikBag.handleChange}
                      value={formikBag.values.roleId || ''}
                    />
                    {formikBag.errors.roleId && formikBag.touched.roleId && (
                      <p className="text-orange-600">
                        {formikBag.errors.roleId}
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <Input
                      type="text"
                      label="Role Name:"
                      name="roleName"
                      id="roleName"
                      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-1 ${
                        formikBag.errors.roleName && formikBag.touched.roleName
                          ? 'bg-yellow'
                          : ''
                      }`}
                      onChange={formikBag.handleChange}
                      value={formikBag.values.roleName || ''}
                    />
                    {formikBag.errors.roleName &&
                      formikBag.touched.roleName && (
                        <p className="text-orange-600">
                          {formikBag.errors.roleName}
                        </p>
                      )}
                  </div>
                </div>
                <div className="flex w-full flex-col mt-auto">
                  <hr className="w-full my-3 h-0.5" />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="block bg-blue-500 p-2 rounded font-bold"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="block bg-red-500 p-2 rounded font-bold ms-5"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </form>
            </ModalCustom>
          )}
        </div>
        {Pagination.length > 1 && <div className="flex">{Pagination}</div>}
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  no
                </th>
                <th scope="col" className="px-6 py-3">
                  role id
                </th>
                <th scope="col" className="px-6 py-3">
                  role Name
                </th>
                <th scope="col" className="px-6 py-3">
                  created date
                </th>
                <th scope="col" className="px-6 py-3">
                  updated at
                </th>
                <th scope="col" colSpan={2} className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.roles &&
                data.roles.map((value: RoleType, index: number) => (
                  <tr
                    key={index}
                    className="bg-white border-b hover:bg-gray-100 text-black"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{value.roleId || ''}</td>
                    <td className="px-6 py-4">{value.roleName || ''}</td>
                    <td className="px-6 py-4">
                      {CommonLogics.formatDate(value.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {CommonLogics.formatDate(value.updatedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/role-detail/${value._id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteRole(value._id)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default RoleList;
