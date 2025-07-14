import React, { useContext, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { GoMail } from "react-icons/go";
import { RiLock2Line } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiEyeFill } from "react-icons/ri";
import { RiEyeCloseLine } from "react-icons/ri";
import { motion } from 'framer-motion'
import "./Login.scss"
import logo from "../../../assets/Egypt-Trust-Logo-svg-1.png"
import logo2 from "../../../assets/Egypt-Trust-Logo-svg-1.png"
import axios from 'axios';

import { toast } from 'react-toastify';
import { ToastOptions } from '../../../helpers/ToastOptions.jsx';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../../Context/Usercontext.jsx';
import { Baseurl } from '../../../Api/Baseurl.js';

export default function Login() {
    const [Show, setShow] = useState(false)
    const [Loading, setLoading] = useState(false)
    const { setUserRole, setuserId } = useContext(UserContext);

    const navigate = useNavigate()
    async function UserLogin(values) {
        try {
            setLoading(true)

            let res = await axios.post(`${Baseurl}/auth/login`, {
                email: values?.email,
                password: values?.password
            });
            console.log(res.data);
            if (res.data.message === "success") {

                localStorage.setItem("Egypt-Trust-Token", res.data.token)

                let { role: userRole, _id } = jwtDecode(res.data.token);
                setuserId(_id)
                setUserRole(userRole);


                switch (userRole) {
                    case 'Admin':
                        navigate('/');
                        break;
                    case 'WarehouseAdmin':
                        navigate('/WarehouseAdmin');
                        break;
                    case 'BranchAdmin':
                        navigate('/BranchAdmin');
                        break;
                    default:
                        navigate('/login');
                        break;
                }

                setLoading(false)
                toast.success("Login successful welcome", ToastOptions("success"));

            }

        } catch (error) {
            if (error.response.data.msg === "Unauthorized") {
                formik.resetForm()
                setLoading(false)
                toast.error("Login failed. Please check your credentials.", ToastOptions("error"));

            }
        }
    }

    const Validation = Yup.object({
        email: Yup.string().email("Email is not valid").required("Email is required"),
        password: Yup.string().required("Password is required")
    })
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        }, validationSchema: Validation, onSubmit: UserLogin
    })
    const ShowPassword = () => {
        setShow(Show ? false : true)
    }
    return (
        <div className="Login md:min-h-screen  h-full flex">
            <div className='FormContainer flex justify-center items-center'>
                <motion.form onSubmit={formik.handleSubmit} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, type: 'spring' }}
                    className='flex flex-col max-xl:px-0 max-lg:px-10 max-md:px-5 max-sm:px-5'>
                    <img src={logo} alt="Logo" width={"120px"} height={"120px"} className='self-center relative bottom-8' />
                    <h1 className='text-3xl font-semibold'>Login</h1>
                    <div className="relative mt-16">
                        <div className="input_Icon absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-lg">
                            <GoMail />
                        </div>
                        <input type="text" value={formik.values.email} id="input-group-1" className="border border-gray-300 text-gray-900 
                         text-lg rounded-3xl transition focus:ring-[#1c3766] focus:border-[#1c3766] block w-full 
                         ps-10 p-2.5" placeholder="Email" name='email' onBlur={formik.handleBlur} onChange={formik.handleChange} />
                    </div>
                    {formik.errors.email && formik.touched.email ? <p className='p-2.5 font-semibold text-[#44546A]'>{formik.errors.email}</p> : null}
                    <div className="relative mt-4">
                        <div className="input_Icon absolute inset-y-0 start-0 flex items-center  ps-3.5 pointer-events-none text-lg">
                            <RiLock2Line />
                        </div>
                        <input type={Show ? "text" : "password"} value={formik.values.password} id="input-group-2" className="border border-gray-300 text-gray-900 
                         text-lg rounded-3xl transition  focus:ring-[#1c3766] focus:border-[#1c3766] block w-full ps-10
                          p-2.5" placeholder="Password" name='password' onBlur={formik.handleBlur}
                            onChange={formik.handleChange} autoComplete='********' />

                        {Show ? <RiEyeFill onClick={ShowPassword} className='cursor-pointer text-lg absolute end-5 top-4 text-[#1c3766]' />
                            : <RiEyeCloseLine onClick={ShowPassword} className='cursor-pointer text-lg absolute 
                        end-5 top-4 text-[#1c3766]' />}

                    </div>
                    {formik.errors.password && formik.touched.password ? <p className='p-2.5 font-semibold text-[#44546A]'>{formik.errors.password}</p> : null}

                    {Loading ? <button className="text-white bg-[#1c3766] hover:bg-[#01677e]
                     focus:outline-none focus:ring-4 focus:ring-[#1c3766] font-medium rounded-full text-md px-5 py-3
                    transition cursor-pointer mb-2 mt-7 flex justify-center ">
                        <AiOutlineLoading3Quarters className='LoadingButton' />
                    </button> : <input type="submit" value="Login" className="text-white bg-[#1c3766] hover:bg-[#8eaadc]
                     focus:outline-none focus:ring-4 focus:ring-[#1c3766] font-medium rounded-full text-md px-5 py-2
                     text-center transition cursor-pointer mb-2 mt-7"/>}

                </motion.form>
            </div>
            <div className="Login_Logo flex justify-center items-center">
                <div className='container-of-logo'>

                    <motion.img src={logo2} width={"250px"} height={"250px"} alt="Logo" loading='lazy'
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, type: 'spring', delay: 0.2 }} />
                </div>
            </div>
        </div>
    )
}
