
import { useRef, useState } from 'react'
import "./WarehousesAdmins.scss"

import { useQuery } from 'react-query';
import axios from 'axios';
import { Baseurl } from './../../../Api/Baseurl';

import { AnimatePresence, motion, useInView } from 'framer-motion';

import { toast } from 'react-toastify';
import { ToastOptions } from '../../../helpers/ToastOptions';
import { MdDelete } from "react-icons/md";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

export default function WarehousesAdmins() {
    const [addform, setaddform] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [limit] = useState(3)
    const token = localStorage.getItem('Egypt-Trust-Token');
    const animationRef = useRef();
    const animationInView = useInView(animationRef, { once: true });

    const handleaddmod = () => {
        setaddform(!addform)
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset to first page when searching
    }

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page)
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
                    role: 'WarehouseAdmin',
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
            role: 'WarehouseAdmin',
            phoneNumber: '',
        },
        validationSchema: Validation,
        onSubmit: adminadd
    })

    // get all warehouse admins with pagination and search
    const AllWarehouseAdmins = async () => {
        const params = new URLSearchParams({
            page: currentPage,
            limit: limit,
            ...(searchTerm && { search: searchTerm })
        });

        let data = await axios.get(`${Baseurl}/warehouses/WarehouseAdmins?${params}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return data?.data
    }

    const { data: warehouseAdminsData, refetch, isLoading } = useQuery(
        ["Allwarehouses", currentPage, searchTerm],
        AllWarehouseAdmins,
        {
            cacheTime: 300000,
            keepPreviousData: true
        }
    )

    const warehouseAdmins = warehouseAdminsData?.data || []
    const pagination = warehouseAdminsData?.pagination || {}

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        const pages = []
        const totalPages = pagination.totalPages || 1
        const currentPageNum = pagination.currentPage || 1

        // Always show first page
        if (totalPages > 0) {
            pages.push(1)
        }

        // Show pages around current page
        const start = Math.max(2, currentPageNum - 1)
        const end = Math.min(totalPages - 1, currentPageNum + 1)

        if (start > 2) {
            pages.push('...')
        }

        for (let i = start; i <= end; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i)
            }
        }

        if (end < totalPages - 1) {
            pages.push('...')
        }

        // Always show last page if there's more than one page
        if (totalPages > 1) {
            pages.push(totalPages)
        }

        return pages
    }

    // animation 
    const animationVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "max-content" },
        exit: { opacity: 0, height: 0 }
    };
    // animation 
    return <>
        <div className="add" >
            <button className='transition-all duration-500' onClick={handleaddmod}>
                {addform ? "Close Add Admin" : "Add Admin"}
            </button>
        </div>

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
            {/* Search  */}
            <div className="m-6 flex justify-center">
                <div className="relative max-w-md w-full mx-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#01677e] focus:border-[#01677e] sm:text-sm"
                        placeholder="Search by name or email..."
                    />
                </div>
            </div>

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
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : warehouseAdmins.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    {searchTerm ? 'No admins found matching your search.' : 'No warehouse admins found.'}
                                </td>
                            </tr>
                        ) : (
                            warehouseAdmins.map((ele, index) => {
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
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center px-4 py-6 bg-white border-t border-gray-200 sm:px-6">
                    <div className="flex flex-col items-center space-y-4 w-full max-w-4xl">
                        {/* Results Info */}
                        <div className="text-sm text-gray-700 text-center">
                            <span>
                                Showing{' '}
                                <span className="font-medium">
                                    {((pagination.currentPage - 1) * pagination.limit) + 1}
                                </span>
                                {' '}to{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}
                                </span>
                                {' '}of{' '}
                                <span className="font-medium">{pagination.totalCount}</span>
                                {' '}results
                            </span>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center space-x-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${pagination.hasPrevPage
                                    ? 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                    : 'text-gray-300 bg-white border border-gray-200 cursor-not-allowed'
                                    }`}
                            >
                                <FaChevronLeft className="h-4 w-4" />
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center space-x-1">
                                {generatePageNumbers().map((page, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                                        disabled={page === '...'}
                                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${page === pagination.currentPage
                                            ? 'text-white bg-[#01677e] border border-[#01677e]'
                                            : page === '...'
                                                ? 'text-gray-400 cursor-default'
                                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${pagination.hasNextPage
                                    ? 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                    : 'text-gray-300 bg-white border border-gray-200 cursor-not-allowed'
                                    }`}
                            >
                                <FaChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    </>
}
