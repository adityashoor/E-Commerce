import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Searchresults = () => {

    const [myparams] = useSearchParams();
    const searchq = myparams.get("q");
    const [prodsdata,setprodsdata] = useState([]);
    const[allcat,setallcat]=useState([]);
    const[msg,setmsg]=useState();

    useEffect(()=>
    {
        fetchallcat();
        window.scrollTo(0,0)
    },[])

    var fetchallcat=()=>
    {
      fetch("http://localhost:9000/api/getcategory").then(resp=>
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
      })
    }

    useEffect(()=>
    {
            fetch(`http://localhost:9000/api/searchprods?s=${searchq}`).then(resp=>
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
            })
    },[searchq])

  return (
    <>
    
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
                                        {allcat.map((data,i)=>
                                   <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
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
                                    <select>
                                        <option value="menu_order" selected="selected">Default Sorting</option>
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
       
                            {prodsdata.map((data,i)=>
                            <Link to={`/productdetails/${data._id}`}><div key={i} className="col-lg-4 col-6 product-incfhny mt-4">
                                <div className="product-grid2">
                                    <div className="product-image2">
                                       
                                            <img className="pic-1 img-fluid radius-image" alt="prodpic" src={`idata/${data.productpic}`}/>
                                            <img className="pic-2 img-fluid radius-image" alt="prodpic" src={`idata/${data.productpic}`}/>
                                        
                                        <ul className="social">
                                            <li><Link to={`/productdetails/${data._id}`}><span className="fa fa-eye"></span></Link></li>

                                            <li><Link to={`/productdetails/${data._id}`}><span className="fa fa-shopping-bag"></span></Link>
                                            </li>
                                        </ul>
                                        <div className="shopv single-item">
                                            <form >
                                                <button type="submit" className="shopv-cart pshopv-cart add-to-cart">
                                                    Add to Cart
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="product-content">
                                        <h3 className="title">{data.productname}</h3>
                                        <span className="price"><del>₹{data.rate*2}</del>₹{data.rate}</span>
                                    </div>
                                </div>
                            </div></Link> )}

                        </div>
                        <div className="row w3l-3-grids mt-5">
                            <div className="col-md-6 mt-md-0">
                                <div className="grids3-info position-relative">
                                    <a href="products-1.html" className="d-block zoom"><img src="images/banner5.jpg" alt="" className="img-fluid news-image"/></a>
                                    <div className="w3-grids3-info">
                                        <h4 className="gdnhy-1"><Link to="/homepage">Platform Velvet <br/>Sandals</Link>

                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mt-md-0 mt-4 grids3-info2">
                                <div className="grids3-info second position-relative">
                                    <a href="products-1.html" className="d-block zoom"><img src="images/banner4.jpg" alt="" className="img-fluid news-image"/></a>
                                    <div className="w3-grids3-info second">
                                        <h4 className="gdnhy-1"><Link to="/homepage">Pebbled Weekend <br/>Bag</Link>
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
