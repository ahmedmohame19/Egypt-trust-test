import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Warehouses.scss"

import { useQuery } from 'react-query';
import axios from 'axios';
import { Baseurl } from './../../../Api/Baseurl';

import { MdOutlineEditNote } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdCloseFullscreen } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

import { AnimatePresence, motion, useInView } from 'framer-motion';

import { toast } from 'react-toastify';
import { ToastOptions } from '../../../helpers/ToastOptions';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

export default function warehouses() {
    const navigate = useNavigate()
    const [popup, setpopup] = useState(false)
    const [addform, setaddform] = useState(false)
    const [warehouseData, setWarehouseData] = useState(null);
    const [warehouseAdmins, setWarehouseAdmins] = useState([]);
    const token = localStorage.getItem('Egypt-Trust-Token');
    const animationRef = useRef();
    const animationInView = useInView(animationRef, { once: true });


    const handleaddmod = () => {
        setaddform(!addform)
    }

    // Get warehouse admins for dropdown
    const getWarehouseAdmins = async () => {
        try {
            const response = await axios.get(`${Baseurl}/warehouses/WarehouseAdmins`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response?.data?.data || [];
        } catch (error) {
            console.error('Error fetching warehouse admins:', error);
            return [];
        }
    };

    // Load warehouse admins when add form opens or popup opens
    useEffect(() => {
        if (addform || popup) {
            getWarehouseAdmins().then(setWarehouseAdmins);
        }
    }, [addform, popup]);

    // delete warehouse 
    async function warehouseDel(id) {
        Swal.fire({
            title: "Are you sure?",
            text: "The warehouse will be removed",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#01677e",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (res) => {
            if (res.isConfirmed) {
                await axios.delete(`${Baseurl}/warehouses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        id: id
                    }
                }).then(() => {
                    toast.success("Warehouse deleted successfully", ToastOptions("success"));
                    refetch()
                }).catch(() => {
                    toast.error("There is a technical fault, please try again.", ToastOptions("error"));
                })
            }
        })
    }

    async function warehouseadd(values) {
        try {
            const response = await axios.post(
                `${Baseurl}/warehouses/`,
                {
                    name: values.name,
                    location: values.location,
                    warehouseAdmin: values.warehouseAdmin,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            if (response.data.success) {
                toast.success("Warehouse added successfully", ToastOptions("success"));
                formik.resetForm()
                refetch();
            } else {
                toast.error(response.data.message || "Failed to add warehouse", ToastOptions("error"));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "There is a technical fault, please try again.";
            toast.error(errorMessage, ToastOptions("error"));
        }
    }

    const Validation = Yup.object({
        name: Yup.string().required("Warehouse name is required"),
        location: Yup.string().required("Location is required"),
        warehouseAdmin: Yup.string(),
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            location: '',
            warehouseAdmin: '',
        },
        validationSchema: Validation,
        onSubmit: warehouseadd
    })

    // get all warehouses 
    const Allwarehouses = async () => {
        let data = await axios.get(`${Baseurl}/warehouses/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return data?.data.data
    }
    const { data: warehouses, refetch } = useQuery("Allwarehouses", Allwarehouses, {
        cacheTime: 300000,
        onError: () => {
            navigate("/Login")
        }
    })
    // get all warehouses


    const closeprofile = () => {
        setpopup(!popup)
    }

    const editWarehouse = async (id) => {
        try {
            const response = await axios.get(`${Baseurl}/warehouses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const warehouse = response?.data?.data
            if (warehouse) setWarehouseData(warehouse)
            return
        } catch (error) {
            console.error(error);
            toast.error("There is a technical fault, please try again.", ToastOptions("error"));
        } finally {
            setpopup(!popup)
        }
    };



    // update profile 
    const profileValidation = Yup.object({
        name: Yup.string().required("Name is required"),
        location: Yup.string().required("Location is required"),
        warehouseAdmin: Yup.string(),
    });


    const updatewarehouse = async (values) => {
        try {
            const response = await axios.put(`${Baseurl}/warehouses/${warehouseData.id}`, { ...values },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            console.log(response)
            if (response.data.success) {
                toast.success("Warehouse updated successfully", ToastOptions("success"));
                refetch();
                setpopup(!popup);
            } else {
                toast.error(response.data.message || "Failed to update warehouse", ToastOptions("error"));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "There is a technical fault, please try again.";
            toast.error(errorMessage, ToastOptions("error"));
        }
    }


    const profileFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: warehouseData?.name || "",
            location: warehouseData?.location || "",
            warehouseAdmin: warehouseData?.warehouseAdmin?._id || "",
        },
        validationSchema: profileValidation,
        onSubmit: updatewarehouse,
    })


    // animation 
    const animationVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "max-content" },
        exit: { opacity: 0, height: 0 }
    };
    // animation 
    return <>
        < div className="add" >
            <button onClick={handleaddmod}>
                {addform ? "Close Add warehouse" : "Add warehouse"}
            </button>
        </ div>
        {addform &&
            <AnimatePresence>
                <motion.div key="addwarehouse" layout className="addmoderator" variants={animationVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="addbody">
                        <form onSubmit={formik.handleSubmit} className=" mx-auto justify-between items-center">
                            <div className="mb-5 teachfield">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Warehouse Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01677e] focus:border-[#01677e] block w-full p-2.5 "
                                    placeholder="Warehouse Name"
                                    required
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                                )}
                            </div>
                            <div className="mb-5 teachfield">
                                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formik.values.location}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01677e] focus:border-[#01677e] block w-full p-2.5 "
                                    placeholder="Warehouse Location"
                                    required
                                />
                                {formik.touched.location && formik.errors.location && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.location}</div>
                                )}
                            </div>
                            <div className="mb-5 teachfield">
                                <label htmlFor="warehouseAdmin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Warehouse Admin</label>
                                <select
                                    id="warehouseAdmin"
                                    name="warehouseAdmin"
                                    value={formik.values.warehouseAdmin}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01677e] focus:border-[#01677e] block w-full p-2.5 "
                                >
                                    <option value="">Select Warehouse Admin</option>
                                    {warehouseAdmins.map((admin) => (
                                        <option key={admin._id} value={admin._id}>
                                            {admin.name}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.warehouseAdmin && formik.errors.warehouseAdmin && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.warehouseAdmin}</div>
                                )}
                            </div>

                            <button type="submit" className="text-white focus:ring-blue-300 font-medium px-5 py-2.5 text-center ">Add Warehouse</button>
                        </form>

                    </div>
                </motion.div >
            </AnimatePresence>
        }

        <motion.div layout ref={animationRef} initial={{ opacity: 0 }} animate={animationInView && { opacity: 1 }} transition={{ duration: 0.5 }} className='main-Orders'>
            <div className=" overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3">Warehouse Admin</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses?.map((ele, index) => {
                            return (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{ele.name}</td>
                                    <td className="px-6 py-4">{ele.location}</td>
                                    <td className="px-6 py-4">{ele.warehouseAdmin?.name || "No admin assigned"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ele.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {ele.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 svg-del ">
                                        <span className='flex'>
                                            <MdOutlineEditNote onClick={() => editWarehouse(ele._id)} />
                                            <MdDelete onClick={() => warehouseDel(ele._id)} />
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
                {popup && <div onClick={closeprofile} className="back-drop">
                </div>}
                <div className={popup ? "popup apperdetails" : "popup"}>
                    <MdCloseFullscreen className='closedetails' onClick={closeprofile} />
                    <div className="profile">
                        <div className="img flex items-center justify-center" style={{
                            width: '120px',
                            height: '120px'
                        }}>
                            <HiOutlineBuildingOffice2 className="text-6xl text-[#01677e]" />
                        </div>
                        <form onSubmit={profileFormik.handleSubmit} className=" mx-auto justify-between items-center">
                            <div className="mb-5 teachfield">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input type="text" id="name" name="name" value={profileFormik.values.name} onBlur={profileFormik.handleBlur} onChange={profileFormik.handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01677e] focus:border-[#01677e] block w-full p-2.5 " placeholder="Warehouse Name" required />
                                {profileFormik.touched.name && profileFormik.errors.name && (
                                    <div className="text-red-500 text-sm mt-1">{profileFormik.errors.name}</div>
                                )}
                            </div>
                            <div className="mb-5 teachfield">
                                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                                <input type="text" id="location" name="location" value={profileFormik.values.location} onBlur={profileFormik.handleBlur} onChange={profileFormik.handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01677e] focus:border-[#01677e] block w-full p-2.5 " placeholder="Warehouse Location" required />
                                {profileFormik.touched.location && profileFormik.errors.location && (
                                    <div className="text-red-500 text-sm mt-1">{profileFormik.errors.location}</div>
                                )}
                            </div>
                            <div className="mb-5 teachfield">
                                <label htmlFor="warehouseAdmin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Warehouse Admin</label>
                                <select
                                    id="warehouseAdmin"
                                    name="warehouseAdmin"
                                    value={profileFormik.values.warehouseAdmin}
                                    onBlur={profileFormik.handleBlur}
                                    onChange={profileFormik.handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01677e] focus:border-[#01677e] block w-full p-2.5 "
                                >
                                    <option value="">Select Warehouse Admin</option>
                                    {warehouseAdmins.map((admin) => (
                                        <option key={admin._id} value={admin._id}>
                                            {admin.name}
                                        </option>
                                    ))}
                                </select>
                                {profileFormik.touched.warehouseAdmin && profileFormik.errors.warehouseAdmin && (
                                    <div className="text-red-500 text-sm mt-1">{profileFormik.errors.warehouseAdmin}</div>
                                )}
                            </div>
                            <button type="submit" className="text-white bg-[#96cb63] font-medium px-5 py-2.5 text-center ">Update Warehouse</button>
                        </form>
                    </div>

                </div>
            </div>

        </motion.div>
    </>
}
