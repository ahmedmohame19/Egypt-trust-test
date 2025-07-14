import { useRef, useState } from 'react'
import "../WarehousesAdmins/WarehousesAdmins.scss"

import { useQuery } from 'react-query';
import axios from 'axios';
import { Baseurl } from './../../../Api/Baseurl';

import { AnimatePresence, motion, useInView } from 'framer-motion';

import { toast } from 'react-toastify';
import { ToastOptions } from '../../../helpers/ToastOptions';
import { MdDelete } from "react-icons/md";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';




export default function BranchAdmins() {
    const [addform, setaddform] = useState(false)
    const token = localStorage.getItem('Egypt-Trust-Token');
    const animationRef = useRef();
    const animationInView = useInView(animationRef, { once: true });

    const handleaddmod = () => {
        setaddform(!addform)
    }

    // delete admin 
    async function adminDel(adminId) {
        Swal.fire({
            title: "Are you sure?",
            text: "The admin will be removed",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1c3766",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (res) => {
            if (res.isConfirmed) {
                try {
                    const response = await axios.delete(`${Baseurl}/auth/delete-admin`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        data: {
                            adminId: adminId
                        }
                    });

                    if (response.data.success) {
                        toast.success(response.data.message || "Admin deleted successfully", ToastOptions("success"));
                        refetch();
                    } else {
                        toast.error(response.data.message || "Failed to delete admin", ToastOptions("error"));
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.message || "There is a technical fault, please try again.";
                    toast.error(errorMessage, ToastOptions("error"));
                }
            }
        });
    }

    async function adminadd(values) {
        try {

            const response = await axios.post(
                `${Baseurl}/auth/create-admin`,
                {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: 'BranchAdmin',
                    phoneNumber: values.phoneNumber,
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    },
                }
            );
            if (response.data.success) {
                toast.success(response.data.message || "Admin added successfully", ToastOptions("success"));
                formik.resetForm()
                refetch();
            } else {
                toast.error(response.data.message || "Failed to add admin", ToastOptions("error"));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "There is a technical fault, please try again.";
            toast.error(errorMessage, ToastOptions("error"));
        }
    }

    const Validation = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Email is not valid").required("Email is required"),
        password: Yup.string().required("Password is required"),
        phoneNumber: Yup.string().nullable(),
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            role: 'BranchAdmin',
            phoneNumber: '',
        },
        validationSchema: Validation,
        onSubmit: adminadd
    })

    // get all warehouse admins 
    const AllAllbranches = async () => {
        let data = await axios.get(`${Baseurl}/branches/BranchAdmins`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return data?.data.data
    }
    const { data: Allbranches, refetch } = useQuery("Allbranches", AllAllbranches, {
        cacheTime: 300000,
    })
    // get all warehouse admins

    // animation 
    const animationVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "max-content" },
        exit: { opacity: 0, height: 0 }
    };
    // animation 
    return <>
        < div className="add" >
            <button className='transition-all duration-500' onClick={handleaddmod}>
                {addform ? "Close Add Admin" : "Add Admin"}
            </button>
        </ div>
        {addform &&
            <AnimatePresence>
                <motion.div key="addadmin" layout className="addmoderator" variants={animationVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="addbody">
                        <form onSubmit={formik.handleSubmit} className=" mx-auto justify-between items-center">
                            <div className="mb-5 teachfield">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01677e] focus:border-[#01677e] block w-full p-2.5 "
                                    placeholder="Admin Name"
                                    required
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                                )}
                            </div>
                            <div className="mb-5 teachfield">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01677e] focus:border-[#01677e] block w-full p-2.5 "
                                    placeholder="admin@example.com"
                                    required
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                )}
                            </div>
                            <div className="mb-5 teachfield">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formik.values.password}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01677e] focus:border-[#01677e] block w-full p-2.5 "
                                    placeholder="Password"
                                    required
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                )}
                            </div>

                            <div className="mb-5 teachfield">
                                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formik.values.phoneNumber}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01677e] focus:border-[#01677e] block w-full p-2.5 "
                                    placeholder="Phone Number (Optional)"
                                />
                                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
                                )}
                            </div>

                            <button type="submit" className="text-whitefont-medium px-5 py-2.5 text-center ">Add Admin</button>
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
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Phone Number</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Allbranches?.map((ele, index) => {
                            return (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{ele.name}</td>
                                    <td className="px-6 py-4">{ele.email}</td>
                                    <td className="px-6 py-4">{ele.role}</td>
                                    <td className="px-6 py-4">{ele.phoneNumber || "No phone"}</td>
                                    <td className="px-6 py-4 svg-del">
                                        <span className='flex'>
                                            <MdDelete onClick={() => adminDel(ele._id)} />
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </div>

        </motion.div>
    </>
}
