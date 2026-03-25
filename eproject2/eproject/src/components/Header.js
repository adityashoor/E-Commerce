import API_URL from "../apiConfig";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState} from "react";

import MyContext from "../MyContext";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

var Header=()=>
{
    const{user,setuser,cartlen,setcartlen}=useContext(MyContext);
    const[term,setterm]=useState("");
    const[allproducts,setallproducts]=useState([]);
    const[isDark,setIsDark]=useState(()=>localStorage.getItem('theme')==='dark');
    var mynavigate=useNavigate();
    const cookies = new Cookies();

    useEffect(()=>
    {
        document.documentElement.setAttribute('data-theme', isDark?'dark':'light');
        localStorage.setItem('theme', isDark?'dark':'light');
    },[isDark]);


    var handlelogout=()=>
    {
       setuser(null);
       setcartlen(0);
       sessionStorage.clear('user');
       mynavigate("/login");
       cookies.remove("rememberMe");
    }

    useEffect(()=>
    {
        if(user)
        {
        fetch(`${API_URL}/api/getcart?username=${user.username}`).then((resp)=>
            {
                if(resp.ok)
                {
                    resp.json().then((result)=>
                    {
                        if(result.statuscode===1)
                        {
                            setcartlen(result.cartdata.length);
                        }
                    })
                }
            })
        }
    },[user,setcartlen])

    useEffect(()=>
    {
        fetch(`${API_URL}/api/getproducts`).then(resp=>
                {
                  if(resp.ok)
                  {
                    resp.json().then(result=>
                      {
                        if(result.statuscode===0)
                        {
                          toast.warning("No products Added");
                        }
                        else if(result.statuscode===1)
                        {
                            setallproducts(result.proddata);
                        }
                        else
                        {
                          toast.error("error occured, please try again")
                        }
                      })
                  }
                  else
                  {
                    toast.error("error occured, please try again")
                  }
                })
      
    },[])
    
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
                            <NavLink to="/homepage" className={({isActive})=>`nav-link${isActive?" active":""}`}>Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/aboutus" className={({isActive})=>`nav-link${isActive?" active":""}`}>About</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#Pages" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Products <i className="fa-solid fa-bag-shopping text-danger font-weight-bold"></i>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><NavLink className={({isActive})=>`dropdown-item pt-2${isActive?" active":""}`} to="/showcategory">Products Categories</NavLink></li>
                                <li><NavLink className={({isActive})=>`dropdown-item${isActive?" active":""}`} to="/cart">Cart Page</NavLink></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/contact" className={({isActive})=>`nav-link${isActive?" active":""}`}>Contact</NavLink>
                        </li>
                        <li className="nav-item search-right">
                            <a href="#search" className="btn search-btn" title="search"><span className="fas fa-search me-2" aria-hidden="true"></span></a>
                           
                            <div id="search" className="pop-overlay">
                                <div className="popup">
                                    <h3 className="title-w3l two mb-4 text-left">Search Here</h3>
                                    <form  className="search-box d-flex position-relative">
                                        <input list="prods" type="search" onChange={(e)=>setterm(e.target.value)} placeholder="Enter Keyword here" name="search" required="required" minLength={2} autofocus=""/>

                                        <datalist id="prods">
                                            {
                                                allproducts.map((data,i)=>
                                                    <option key={i} value={data.productname}></option>
                                                )
                                            }
                                        </datalist>

                                        <Link to={`/searchresult?q=${term}`}><button className="btn"><span className="fas fa-search" aria-hidden="true"></span></button></Link>
                                    </form>
                                </div>
                                <a className="close" href="#close">×</a>
                            </div>
                        </li>
                    </ul>

               
                <ul className="header-search me-lg-4 d-flex">
                    {user===null?
                    <li className="get-btn me-2">
                        <Link to="/login"><span className="btn btn-style btn-primary"><i className="fas fa-user me-lg-2"></i> <span className="btn-texe-inf">Login</span></span></Link>
                    </li>:<li className="get-btn me-2 dropdown">
                            <a className="dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                            <span className="btn btn-style btn-primary"><i className="fas fa-user me-lg-2"></i> <span className="btn-texe-inf me-2">{user.username}</span><i className="fa-solid fa-angle-down"></i></span>
                            </a>
                            <ul className="dropdown-menu">
                                <li className="dropdown-item ms-1 p-2 text-success">Welcome {user.username}</li>
                                <li><Link to="/changepass"><a className="dropdown-item pt-2">Change Password</a></Link></li>
                                <li><Link to="/forgetpass"><a className="dropdown-item pt-2">Forget Password</a></Link></li>
                                <li><Link to="/trackorders"><a className="dropdown-item pt-2">Track Orders</a></Link></li>
                                <li><Link to="/weather"><a className="dropdown-item pt-2">Weather</a></Link></li>
                                <hr></hr>
                                <li><button onClick={handlelogout} className="dropdown-item">Logout<i className="fa-solid fa-right-from-bracket ms-1"></i></button></li>
                            </ul>
                        </li>}
                    <li className="shopvcart galssescart2 cart cart box_1 get-btn">
                           <Link to="/cart">
                            
                           <button type="button" className="top_shopv_cart position-relative">
                            <span className="fas fa-shopping-bag me-lg-2"></span><span className="btn-texe-inf ">Cart</span>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartlen}
                            </span>
                            </button>
                           </Link>
                    </li>
                </ul>
                 </div>
                <div className="mobile-position">
                    <nav className="navigation">
                        <div className="theme-switch-wrapper">
                            <label className="theme-switch" for="checkbox">
                                <input type="checkbox" id="checkbox" checked={isDark} onChange={e=>setIsDark(e.target.checked)}/>
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
export default Header;