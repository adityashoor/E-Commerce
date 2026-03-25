import API_URL from "../apiConfig";
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ShowSubCategory = () => {

    const [allsubcat, setallsubcat] = useState([]);
    const { cid } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/api/getsubcategory?catid=${cid}`).then(resp => {
            if (resp.ok) {
                resp.json().then(result => {
                    if (result.statuscode === 1) {
                        setallsubcat(result.subcatdata);
                    } else if (result.statuscode === 0) {
                        toast.warning("No Subcategories found");
                    } else {
                        toast.error("Error occurred, please try again");
                    }
                });
            } else {
                toast.error("Error occurred, please try again");
            }
        }).catch(() => toast.error("Network error, please try again"));
    }, [cid]);

    return (
        <>
            <section className="w3mid-gap"></section>

            <div className="inner-banner py-5">
                <section className="w3l-breadcrumb text-left py-sm-5">
                    <div className="container">
                        <div className="w3breadcrumb-gids">
                            <div className="w3breadcrumb-left text-left">
                                <h2 className="inner-w3-title">Sub Categories</h2>
                            </div>
                            <div className="w3breadcrumb-right">
                                <ul className="breadcrumbs-custom-path">
                                    <li><Link to="/homepage">Home</Link></li>
                                    <li><span className="fas fa-angle-double-right mx-2"></span><Link to="/showcategory">Categories</Link></li>
                                    <li className="active"><span className="fas fa-angle-double-right mx-2"></span>Sub Categories</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="gap"></div>

            <section className="w3l-witemshny-main py-5">
                <div className="container py-md-4">
                    <h3 className="title-w3l">Sub Categories</h3>
                    <p>Select a subcategory to browse products</p>

                    {allsubcat.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fa-solid fa-folder-open text-muted" style={{ fontSize: 48 }}></i>
                            <p className="text-muted mt-3">No subcategories found.</p>
                            <Link to="/showcategory" className="btn btn-style btn-primary mt-2">Back to Categories</Link>
                        </div>
                    ) : (
                        <div className="witemshny-grids row mt-lg-3">
                            {allsubcat.map(data => (
                                <div className="col-xl-2 col-md-4 col-6 product-incfhny mt-4" key={data._id}>
                                    <Link to={`/showproducts/${data._id}`}>
                                        <div className="weitemshny-grid">
                                            <img
                                                src={`/idata/${data.subcatpic}`}
                                                alt={data.subcatname}
                                                className="img-fluid news-image"
                                                style={{ height: 175, width: "100%", objectFit: "cover", borderRadius: 8 }}
                                                onError={e => { e.target.src = "images/d1.jpg"; }}
                                            />
                                        </div>
                                        <h4 className="gdnhy-1 mt-3 text-center">{data.subcatname}</h4>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-5">
                        <Link to="/showcategory" className="btn btn-style btn-primary">
                            <i className="fas fa-arrow-left me-2"></i> Back to Categories
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};
