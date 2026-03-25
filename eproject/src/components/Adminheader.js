import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState} from "react";
import MyContext from "../MyContext";
var AdminHeader=()=>
{
    const{user,setuser}=useContext(MyContext);
    const[term,setterm]=useState("");
    const mynavigate=useNavigate();

    var handlelogout=()=>
    {
       setuser(null);
       sessionStorage.clear('user')
       mynavigate("/login");
    }
    
    return(
        <>
<header id="site-header" className="fixed-top">
        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light stroke py-lg-0">
                <h1><Link className="navbar-brand pe-xl-5 pe-lg-4" to="/homepage">
                        <span className="fz-neon">Cemetex</span> <span style={{color:'var(--fz-text)'}}>Admin</span>
                    </Link></h1>
                <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon fa icon-expand fa-bars"></span>
                    <span className="navbar-toggler-icon fa icon-close fa-times"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-lg-auto my-2 my-lg-0 navbar-nav-scroll align-items-lg-center">
                        <li className="nav-item">
                        <Link to="/adminpanel" className="nav-link active">Admin Panel</Link>
                        </li>
                        <li className="nav-item">
                        <Link to="/members" className="nav-link">Members</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/vieworders" className="nav-link ">Orders</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#Pages" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Add Options<span className="fa fa-angle-down ms-1"></span>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><Link className="dropdown-item pt-2" to="/category">Categories</Link></li>
                                <li><Link className="dropdown-item" to="/subcategory">Sub Categories</Link></li>
                                <li><Link className="dropdown-item" to="/products">Products</Link></li>
                            </ul> 
                        </li>
                        <li className="nav-item">
                           <Link to="/createadmin" className="nav-link">Create Admin</Link>
                        </li>
                        <li className="nav-item search-right">
                            <a href="#search" className="btn search-btn" title="search user"><span className="fas fa-search me-2" aria-hidden="true"></span>Search User</a>
                           
                            <div id="search" className="pop-overlay">
                                <div className="popup">
                                    <h3 className="title-w3l two mb-4 text-left">Search Here</h3>
                                    <form  className="search-box d-flex position-relative">
                                        <input type="search" onChange={(e)=>setterm(e.target.value)} placeholder="Enter Keyword here" name="search" required="required" autofocus=""/>
                                        <Link to={`/searchuser?q=${term}`}><button className="btn"><span className="fas fa-search" aria-hidden="true"></span></button></Link>
                                    </form>
                                </div>
                                <a className="close" href="#close">×</a>
                            </div>
                        </li>
                    </ul>
               
                <ul className="header-search ms-lg-auto d-flex align-items-center gap-2">
                    {user===null?
                    <li className="get-btn me-2">
                        <Link to="/login"><span className="btn btn-style btn-primary"><i className="fas fa-user fz-icon-lg me-lg-2"></i> <span className="btn-texe-inf fz-hide-sm">Login</span></span></Link>
                    </li>:
                    <li className="get-btn me-2 dropdown">
                            <a className="dropdown-toggle" href="#Pages" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                            <span className="btn btn-style btn-primary"><i className="fas fa-user fz-icon-lg me-lg-2"></i> <span className="btn-texe-inf me-2 fz-hide-sm">{user.username}</span><i className="fa-solid fa-angle-down"></i></span>
                            </a>
                            <ul className="dropdown-menu">
                                <li className="dropdown-item ms-1 p-2 text-success">Welcome {user.username}</li>
                                <li><Link to="/changepass"><a className="dropdown-item pt-2">Change Password</a></Link></li>
                                <li><Link to="/forgetpass"><a className="dropdown-item pt-2">Forget Password</a></Link></li>
                                <hr></hr>
                                <li><button onClick={handlelogout} className="dropdown-item">Logout<i className="fa-solid fa-right-from-bracket ms-1"></i></button></li>
                            </ul>
                        </li>}
                        <li className="get-btn">
                        <Link to="/weather"><span className="btn btn-style btn-primary"><i className="fa-solid fa-cloud fz-icon-lg"></i> <span className="btn-texe-inf fz-hide-sm">Weather</span></span></Link>
                        </li>
                </ul>
                </div>
            </nav>
        </div>
        <div className="fz-admin-bar">
            <div className="container">
                <ul className="nav py-2">
                    <li className="nav-item"><NavLink to="/adminpanel" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Dashboard</NavLink></li>
                    <li className="nav-item"><NavLink to="/vieworders" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Orders</NavLink></li>
                    <li className="nav-item"><NavLink to="/products" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Products</NavLink></li>
                    <li className="nav-item"><NavLink to="/category" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Categories</NavLink></li>
                    <li className="nav-item"><NavLink to="/subcategory" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Subcategories</NavLink></li>
                    <li className="nav-item"><NavLink to="/members" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Members</NavLink></li>
                    <li className="nav-item"><NavLink to="/createadmin" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Admins</NavLink></li>
                </ul>
            </div>
        </div>
    </header>
        </>
    )
}
export default AdminHeader;