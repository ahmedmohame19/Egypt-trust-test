import { useContext, useState } from 'react'
import './Sidenav.scss'
// icons 
import { RiCloseCircleLine } from "react-icons/ri";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaChartBar } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { GoFileSubmodule } from "react-icons/go";
import { HiOutlineHome } from "react-icons/hi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { HiOutlineKey } from "react-icons/hi2";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";
// icons 
import logo from "../../assets/Egypt-Trust-Logo-svg-1.png"
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/Usercontext';
import { useRoleBasedRoute } from '../../helpers/RouteUtils';


export default function Sidenav({ role }) {
    const [collapsed, setcollapsed] = useState(false)
    const [Hide, setHide] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate()
    const { setUserRole } = useContext(UserContext)
    const { getRoute } = useRoleBasedRoute();
    const Logout = () => {
        localStorage.removeItem("Egypt-Trust-Token")
        setUserRole(null)
        navigate('/Login')
    }

    const handleHide = () => {
        setHide(!Hide)
    }
    const handleICon = () => {
        setcollapsed(!collapsed)
    }
    return <>
        <div className={Hide ? "dropback apper-dropback" : "dropback"} onClick={handleHide}>
        </div>
        <aside className={Hide ? 'allnav' : 'allnav apper'} >
            <Sidebar collapsed={collapsed}>
                <Menu className='main-menu'>

                    <Menu className={collapsed ? 'collapsed main-side overflow-y-auto min-h-screen' :
                        'main-side p-1 overflow-y-auto min-h-screen'}>

                        <MenuItem
                            className="mb-10 rounded-3xl text-3xl mt-8 text-white cursor-pointer"
                            onClick={handleICon}
                            icon={collapsed ? <FaBars /> : <RiCloseCircleLine />}
                            component={<span className='Remove_hover'></span>}
                        ></MenuItem>

                        <span className='flex justify-center items-center my-9'>
                            <div className='logo-container'>
                                <img src={logo} loading='lazy' alt="Logo" className={collapsed ? 'Logo-colaps' : 'Logo'} />
                            </div>
                        </span>


                        {/* Admin  */}
                        {role === "Admin" ? (
                            <div className="flex justify-between flex-col">
                                <div className="Links">
                                    <MenuItem onClick={handleHide} className={pathname === getRoute("") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("")} className='Remove_hover transition ease-linear'></Link>}
                                        icon={<HiOutlineHome className={pathname === getRoute("") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                        Dashboard
                                    </MenuItem>
                                    <MenuItem onClick={handleHide} className={pathname === getRoute("warehouses") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("warehouses")} className='Remove_hover transition ease-linear'></Link>}
                                        icon={<HiOutlineBuildingOffice2 className={pathname === getRoute("warehouses") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                        Warehouses
                                    </MenuItem>
                                    <MenuItem onClick={handleHide} className={pathname === getRoute("branches") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("branches")} className='Remove_hover transition ease-linear'></Link>}
                                        icon={<HiOutlineBuildingOffice className={pathname === getRoute("branches") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                        Branches
                                    </MenuItem>
                                    <MenuItem onClick={handleHide} className={pathname === getRoute("tokens") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("tokens")} className='Remove_hover transition ease-linear'></Link>}
                                        icon={<HiOutlineKey className={pathname === getRoute("tokens") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                        Token Management
                                    </MenuItem>
                                    <MenuItem onClick={handleHide} className={pathname === getRoute("requests") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("requests")} className='Remove_hover transition ease-linear'></Link>}
                                        icon={<HiOutlineClipboardDocumentList className={pathname === getRoute("requests") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                        Request Management
                                    </MenuItem>
                                    <SubMenu className='menu-items' label="Reports" icon={<HiOutlineDocumentChartBar className='icon transition ease-linear' />}>
                                        <MenuItem onClick={handleHide} className={pathname === getRoute("comprehensive-reports") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("comprehensive-reports")} className='Remove_hover transition ease-linear'></Link>}
                                            icon={<FaChartBar className={pathname === getRoute("comprehensive-reports") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                            Comprehensive Reports
                                        </MenuItem>
                                        <MenuItem onClick={handleHide} className={pathname === getRoute("inventory-reports") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("inventory-reports")} className='Remove_hover transition ease-linear'></Link>}
                                            icon={<GoFileSubmodule className={pathname === getRoute("inventory-reports") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                            Inventory Reports
                                        </MenuItem>

                                    </SubMenu>
                                    <SubMenu className='menu-items' label="User Management" icon={<HiOutlineUsers className='icon transition ease-linear' />}>
                                        <MenuItem onClick={handleHide} className={pathname === getRoute("warehouse-admins") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("warehouse-admins")} className='Remove_hover transition ease-linear'></Link>}
                                            icon={<HiOutlineUserGroup className={pathname === getRoute("warehouse-admins") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                            Warehouse Admins
                                        </MenuItem>
                                        <MenuItem onClick={handleHide} className={pathname === getRoute("branch-admins") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("branch-admins")} className='Remove_hover transition ease-linear'></Link>}
                                            icon={<GrUserAdmin className={pathname === getRoute("branch-admins") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                            Branch Admins
                                        </MenuItem>
                                    </SubMenu>
                                </div>
                            </div>
                        ) : role === "WarehouseAdmin" ? (
                            <div className="flex justify-between flex-col">
                                <div className="Links">
                                    <MenuItem onClick={handleHide} className={pathname === getRoute("") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("")} className='Remove_hover transition ease-linear'></Link>}
                                        icon={<HiOutlineHome className={pathname === getRoute("") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                        Dashboard
                                    </MenuItem>
                                    <MenuItem onClick={handleHide} className={pathname === getRoute("requests") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("requests")} className='Remove_hover transition ease-linear'></Link>}
                                        icon={<HiOutlineClipboardDocumentList className={pathname === getRoute("requests") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                        Requests
                                    </MenuItem>
                                    <MenuItem onClick={handleHide} className={pathname === getRoute("add-tokens") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("add-tokens")} className='Remove_hover transition ease-linear'></Link>}
                                        icon={<HiOutlineKey className={pathname === getRoute("add-tokens") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                        Add Tokens
                                    </MenuItem>
                                </div>
                            </div>
                        ) : role === "BranchAdmin" ? (
                            <div className="flex justify-between flex-col">
                                <div className="Links">
                                    <MenuItem onClick={handleHide} className={pathname === getRoute("") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("")} className='Remove_hover transition ease-linear'></Link>}
                                        icon={<HiOutlineHome className={pathname === getRoute("") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                        Dashboard
                                    </MenuItem>
                                    <MenuItem onClick={handleHide} className={pathname === getRoute("request-tokens") ? 'menu-items  Active' : 'menu-items'} component={<Link to={getRoute("request-tokens")} className='Remove_hover transition ease-linear'></Link>}
                                        icon={<HiOutlineKey className={pathname === getRoute("request-tokens") ? 'icon transition ease-linear Active' : 'icon transition ease-linear'} />}>
                                        Request Tokens
                                    </MenuItem>
                                </div>
                            </div>
                        ) : null}


                        <MenuItem
                            className="rounded-3xl text-lg text-white
                            font-semibold Logout"
                            icon={<RiLogoutBoxLine />}
                            type={"button"}
                            component={<span className='Remove_hover transition ease-linear'></span>}
                            onClick={Logout}
                        >
                            Log out
                        </MenuItem>
                    </Menu>

                </Menu>
            </Sidebar >
        </aside >

        <span className='bars' onClick={handleHide}>
            {Hide ? <RiCloseCircleLine /> : <FaBars />}
        </span>

    </>
}