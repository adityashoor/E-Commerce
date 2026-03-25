import API_URL from "../apiConfig";
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MyContext from '../MyContext';

export const Searchresults = () => {

    const [myparams] = useSearchParams();
    const searchq = myparams.get("q");
    const [prodsdata,setprodsdata] = useState([]);
    const[allcat,setallcat]=useState([]);
    const[msg,setmsg]=useState();
    const { user } = useContext(MyContext);
    const mynavigate = useNavigate();

    const discountedPrice = (rate, discount) =>
        Math.round(Number(rate) - (Number(discount) * Number(rate)) / 100);

    const handleAddToCart = (prod) => {
        if (!user) { mynavigate(`/login?pid=${prod._id}`); return; }
        mynavigate(`/productdetails/${prod._id}`);
    };

    useEffect(()=>
    {
        fetchallcat();
        window.scrollTo(0,0)
    },[])

    var fetchallcat=()=>
    {
      fetch(`${API_URL}/api/getcategory`).then(resp=>
      {
        if(resp.ok)
        {
          resp.json().then(result=>
            {
              if(result.statuscode===0)
              {
                toast.error("No Categories Added");
              }
              else if(result.statuscode===1)
              {
                setallcat(result.catdata);
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
      }).catch(()=> toast.error("Network error, please try again"))
    }

    useEffect(()=>
    {
            fetch(`${API_URL}/api/searchprods?s=${searchq}`).then(resp=>
            {
                if(resp.status>=400)
                {
                    toast.error("Error Occured, please try again");
                }
                else
                {
                    resp.json().then(result=>
                    {
                        if(result.statuscode===-1)
                        {
                            toast.error("Error Occured while fetching products");
                        }
                        else if(result.statuscode===0)
                        {
                            setmsg("No products found");
                            setprodsdata([]);
                        }
                        else if(result.statuscode===1)
                        {
                            setprodsdata(result.prodsdata);
                            setmsg(`Showing ${result.prodsdata.length} Results`)
                        }
                    })
                }
            }).catch(()=> toast.error("Network error, please try again"))
    },[searchq])

  return (
    <>
    <section className="w3mid-gap"></section>
    <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
          <div className="container">
            <div className="w3breadcrumb-gids">
              <div className="w3breadcrumb-left text-left">
                <h2 className="inner-w3-title">Products</h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/homepage">Home</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span>Products
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>



      <section className="w3l-ecommerce-main">
        <div className="ecom-contenthny w3l-ecommerce-main-inn py-5">
            <div className="container py-lg-5">
                <div className="ecommerce-grids row">
                    <div className="ecommerce-left-hny col-lg-4">
                        <aside className="pe-lg-4">
                            <div className="sider-bar">

                                <div className="single-gd mb-5">
                                    <h4>Product Categories</h4>
                                    <ul className="list-group single">
                                        {allcat.map((data)=>
                                   <li key={data._id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <Link to={`/showsubcategory/${data._id}`}><span className="text-secondary">{data.catname}</span></Link>
                                        </li>)}
                                    </ul>
                                </div>

                                <div className="single-gd mb-5 border-0">
                                    <h4>Recent Products</h4>
                                    <Link to="/showcategory"> <div className="row special-sec1 mt-4">
                                        <div className="col-4 img-deals">
                                            <img src="images/shop-1.jpg" className="img-fluid radius-image" alt=""/>
                                        </div>
                                        <div className="col-8 img-deal1">
                                            <h5 className="post-title">
                                                Blue Sweater
                                            </h5>

                                            $499.00
                                        </div>
                                    </div></Link>

                                    <Link to="/showcategory"> <div className="row special-sec1 mt-4">
                                        <div className="col-4 img-deals">
                                            <img src="images/shop-2.jpg" className="img-fluid radius-image" alt=""/>
                                        </div>
                                        <div className="col-8 img-deal1">
                                            <h5 className="post-title">
                                                White T-Shirt
                                            </h5>
                                            $575.00
                                        </div>
                                    </div></Link>
                                </div>

                            </div>
                        </aside>
                    </div>
                    <div className="ecommerce-right-hny col-lg-8">
                        <div className="row ecomhny-topbar">
                            <div className="col-6 ecomhny-result">
                                <h4 className="ecomhny-result-count"> {msg}</h4>
                            </div>
                            <div className="col-6 ecomhny-topbar-ordering">

                                <div className="ecom-ordering-select d-flex">
                                    <span className="fa fa-angle-down" aria-hidden="true"></span>
                                    <select defaultValue="menu_order">
                                        <option value="menu_order">Default Sorting</option>
                                        <option value="popularity">Sort by Popularity</option>
                                        <option value="rating">Sort by Average rating</option>
                                        <option value="date">Sort by latest</option>
                                        <option value="price">Sort by Price: low to high</option>
                                        <option value="price-desc">Sort by Price: high to low</option>
                                    </select>
                                </div>

                            </div>
                        </div>

                        <div className="ecom-products-grids row">

                            {prodsdata.map((data)=>
                            <div key={data._id} className="col-lg-4 col-6 product-incfhny mt-4">
                                <div className="product-grid2">
                                    <div className="product-image2" style={{ position: "relative" }}>
                                        {data.discount && Number(data.discount) > 0 && (
                                            <span style={{
                                                position: "absolute", top: 8, left: 8, background: "#dc2626",
                                                color: "#fff", fontSize: 11, fontWeight: 700,
                                                padding: "2px 8px", borderRadius: 4, zIndex: 2
                                            }}>{data.discount}% OFF</span>
                                        )}
                                        <Link to={`/productdetails/${data._id}`}>
                                            <img className="pic-1 img-fluid radius-image" alt="prodpic" src={`/idata/${data.productpic}`} onError={e => { e.target.src = "images/shop-1.jpg"; }}/>
                                            <img className="pic-2 img-fluid radius-image" alt="prodpic" src={`/idata/${data.productpic}`} onError={e => { e.target.src = "images/shop-1.jpg"; }}/>
                                        </Link>
                                        <ul className="social">
                                            <li><Link to={`/productdetails/${data._id}`}><span className="fa fa-eye"></span></Link></li>
                                            <li>
                                                <button title="Add to Cart" onClick={() => handleAddToCart(data)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                                    <span className="fa fa-shopping-bag"></span>
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="shopv single-item">
                                            <Link to={`/productdetails/${data._id}`}>
                                                <button type="button" className="shopv-cart pshopv-cart add-to-cart">View Product</button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="product-content">
                                        <h3 className="title"><Link to={`/productdetails/${data._id}`}>{data.productname}</Link></h3>
                                        <span className="price">
                                            {Number(data.discount) > 0 && <del>CA${data.rate}</del>}
                                            {" "}CA${discountedPrice(data.rate, data.discount)}
                                        </span>
                                    </div>
                                </div>
                            </div> )}

                        </div>
                        <div className="row w3l-3-grids mt-5">
                            <div className="col-md-6 mt-md-0">
                                <div className="grids3-info position-relative">
                                    <Link to="/showcategory" className="d-block zoom"><img src="images/banner5.jpg" alt="" className="img-fluid news-image"/></Link>
                                    <div className="w3-grids3-info">
                                        <h4 className="gdnhy-1">
                                            <span>Platform Velvet<br/>Sandals</span>
                                            <Link className="w3item-link btn btn-style mt-3" to="/showcategory">Shop Now <i className="fas fa-arrow-right ms-2"></i></Link>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mt-md-0 mt-4 grids3-info2">
                                <div className="grids3-info second position-relative">
                                    <Link to="/showcategory" className="d-block zoom"><img src="images/banner4.jpg" alt="" className="img-fluid news-image"/></Link>
                                    <div className="w3-grids3-info second">
                                        <h4 className="gdnhy-1">
                                            <span>Pebbled Weekend<br/>Bag</span>
                                            <Link className="w3item-link btn btn-style mt-3" to="/showcategory">Shop Now <i className="fas fa-arrow-right ms-2"></i></Link>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}
