import API_URL from "../apiConfig";
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MyContext from '../MyContext';

export const ShowProducts = () => {

    const [allproducts, setallproducts] = useState([]);
    const { scatid } = useParams();
    const { user } = useContext(MyContext);
    const mynavigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        fetch(`${API_URL}/api/getproductsbysubcatid?scatid=${scatid}`).then(resp => {
            if (resp.ok) {
                resp.json().then(result => {
                    if (result.statuscode === 0) {
                        toast.warning("No products in this subcategory");
                    } else if (result.statuscode === 1) {
                        setallproducts(result.proddata);
                    } else {
                        toast.error("Error occurred, please try again");
                    }
                });
            } else {
                toast.error("Error occurred, please try again");
            }
        }).catch(() => toast.error("Network error, please try again"));
    }, [scatid]);

    const discountedPrice = (rate, discount) =>
        Math.round(Number(rate) - (Number(discount) * Number(rate)) / 100);

    const handleAddToCart = (prod) => {
        if (!user) { mynavigate(`/login?pid=${prod._id}`); return; }
        mynavigate(`/productdetails/${prod._id}`);
    };

    return (
        <>
            <section className="w3mid-gap"></section>

            <div className="inner-banner py-5">
                <section className="w3l-breadcrumb text-left py-sm-5">
                    <div className="container">
                        <div className="w3breadcrumb-gids">
                            <div className="w3breadcrumb-left text-left">
                                <h2 className="inner-w3-title">Products</h2>
                            </div>
                            <div className="w3breadcrumb-right">
                                <ul className="breadcrumbs-custom-path">
                                    <li><Link to="/homepage">Home</Link></li>
                                    <li><span className="fas fa-angle-double-right mx-2"></span><Link to="/showcategory">Categories</Link></li>
                                    <li className="active"><span className="fas fa-angle-double-right mx-2"></span>Products</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="gap"></div>

            <section className="w3l-ecommerce-main">
                <div className="ecom-contenthny py-5">
                    <div className="container py-lg-5">
                        <h3 className="title-w3l">Products</h3>
                        <p>Handpicked Favourites just for you</p>

                        {allproducts.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fa-solid fa-box-open text-muted" style={{ fontSize: 48 }}></i>
                                <p className="text-muted mt-3">No products found in this subcategory.</p>
                                <Link to="/showcategory" className="btn btn-style btn-primary mt-2">Browse Categories</Link>
                            </div>
                        ) : (
                            <div className="ecom-products-grids row mt-lg-4 mt-3">
                                {allproducts.map(data => (
                                    <div className="col-lg-3 col-6 product-incfhny mt-4" key={data._id}>
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
                                                    <img
                                                        className="pic-1 img-fluid radius-image"
                                                        src={`/idata/${data.productpic}`}
                                                        alt={data.productname}
                                                        style={{ height: 220, width: "100%", objectFit: "cover" }}
                                                        onError={e => { e.target.src = "images/shop-1.jpg"; }}
                                                    />
                                                    <img
                                                        className="pic-2 img-fluid radius-image"
                                                        src={`/idata/${data.productpic}`}
                                                        alt={data.productname}
                                                        style={{ height: 220, width: "100%", objectFit: "cover" }}
                                                        onError={e => { e.target.src = "images/shop-1.jpg"; }}
                                                    />
                                                </Link>
                                                <ul className="social">
                                                    <li>
                                                        <Link to={`/productdetails/${data._id}`} title="Quick View">
                                                            <span className="fa fa-eye"></span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <button
                                                            title="Add to Cart"
                                                            onClick={() => handleAddToCart(data)}
                                                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                                        >
                                                            <span className="fa fa-shopping-bag"></span>
                                                        </button>
                                                    </li>
                                                </ul>
                                                <div className="shopv single-item">
                                                    <Link to={`/productdetails/${data._id}`}>
                                                        <button type="button" className="shopv-cart pshopv-cart add-to-cart">
                                                            View Product
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="product-content">
                                                <h3 className="title">
                                                    <Link to={`/productdetails/${data._id}`}>{data.productname}</Link>
                                                </h3>
                                                <span className="price">
                                                    {Number(data.discount) > 0 && <del>CA${data.rate}</del>}
                                                    {" "}CA${discountedPrice(data.rate, data.discount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-5">
                            <Link to="/showcategory" className="btn btn-style btn-primary">
                                Browse All Categories <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
