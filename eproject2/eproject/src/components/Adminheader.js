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
                        <span className="w3yellow">Shoppy</span>Kart
                    </Link></h1>
                <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon fa icon-expand fa-bars"></span>
                    <span className="navbar-toggler-icon fa icon-close fa-times"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-lg-auto my-2 my-lg-0 navbar-nav-scroll">
                        <li className="nav-item">
                            <NavLink to="/adminpanel" className={({isActive})=>`nav-link${isActive?" active":""}`}>Admin Panel</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/members" className={({isActive})=>`nav-link${isActive?" active":""}`}>Members</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/vieworders" className={({isActive})=>`nav-link${isActive?" active":""}`}>Orders</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#Pages" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Add Options<span className="fa fa-angle-down ms-1"></span>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><NavLink className={({isActive})=>`dropdown-item pt-2${isActive?" active":""}`} to="/category">Categories</NavLink></li>
                                <li><NavLink className={({isActive})=>`dropdown-item${isActive?" active":""}`} to="/subcategory">Sub Categories</NavLink></li>
                                <li><NavLink className={({isActive})=>`dropdown-item${isActive?" active":""}`} to="/products">Products</NavLink></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/createadmin" className={({isActive})=>`nav-link${isActive?" active":""}`}>Create Admin</NavLink>
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
               
                <ul className="header-search me-lg-4 d-flex">
                    {user===null?
                    <li className="get-btn me-2">
                        <Link to="/login"><span href="login.html" className="btn btn-style btn-primary"><i className="fas fa-user me-lg-2"></i> <span className="btn-texe-inf">Login</span></span></Link>
                    </li>:
                    <li className="get-btn me-2 dropdown">
                            <a className="dropdown-toggle" href="#Pages" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                            <span href="login.html" className="btn btn-style btn-primary"><i className="fas fa-user me-lg-2"></i> <span className="btn-texe-inf me-2">{user.username}</span><i className="fa-solid fa-angle-down"></i></span>
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
                        <Link to="/weather"><span href="login.html" className="btn btn-style btn-primary"><i className="fa-solid fa-cloud"></i> <span className="btn-texe-inf"></span></span></Link>
                        </li>
                </ul>
                 </div>
                <div className="mobile-position">
                    <nav className="navigation">
                        <div className="theme-switch-wrapper">
                            <label className="theme-switch" for="checkbox">
                                <input type="checkbox" id="checkbox"/>
                                <div className="mode-container">
                                    <i className="gg-sun"></i>
                                    <i className="gg-moon"></i>
                                </div>
                            </label>
                        </div>
                    </nav>
                </div>
            </nav>
        </div>
    </header>
        </>
    )
}
export default AdminHeader;