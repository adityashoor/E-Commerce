import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState} from "react";
import MyContext from "../MyContext";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

var Header=()=>
{
    const{user,setuser,cartlen,setcartlen}=useContext(MyContext);
    const[term,setterm]=useState("");
    const[allproducts,setallproducts]=useState([]);
    var mynavigate=useNavigate();
    const cookies = new Cookies();


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
        fetch(`http://localhost:9000/api/getcart?username=${user.username}`).then((resp)=>
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
        fetch(`http://localhost:9000/api/getproducts`).then(resp=>
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
                        <Link to="/homepage" className="nav-link active">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/aboutus" className="nav-link ">About</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#Pages" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Products <i className="fa-solid fa-bag-shopping text-danger font-weight-bold"></i><span className="fa fa-angle-down ms-1"></span>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><Link className="dropdown-item pt-2" to="/showcategory">Products Categories</Link></li>
                                <li><Link className="dropdown-item" to="/">Product Single</Link></li>
                                <li><Link className="dropdown-item pt-2" to="/cart">Cart Page</Link></li>
                            </ul> 
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#Pages" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Pages <i className="fa-solid fa-fire text-danger font-weight-bold"></i><span className="fa fa-angle-down ms-1"></span>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item pt-2" href="blog.html">Blog Page</a></li>
                                <li><a className="dropdown-item" href="blog-single.html">Blog Single</a></li>
                                <li><a className="dropdown-item" href="elements.html">Elements</a></li>
                                <li><a className="dropdown-item" href="error.html">Error Page</a></li>
                                <li><a className="dropdown-item" href="faq.html">FaQ</a></li>

                            </ul>
                        </li>
                        <li className="nav-item">
                           <Link to="/contact" className="nav-link">Contact</Link>
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
export default Header;