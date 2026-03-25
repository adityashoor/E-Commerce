import API_URL from "../apiConfig";
import { useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import Slider from "react-slick";
import { Link, useNavigate } from 'react-router-dom';
import MyContext from '../MyContext';

var Homepage = () => {

    const [featuredprods, setfeaturedprods] = useState([]);
    const [allprods, setallprods]           = useState([]);
    const [categories, setcategories]       = useState([]);
    const [email, setemail]                 = useState("");
    const [counts, setcounts]               = useState({ products: 0, categories: 0, secure: 0 });
    const { user } = useContext(MyContext);
    const mynavigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        Promise.all([
            fetch(`${API_URL}/api/featuredprod`),
            fetch(`${API_URL}/api/getproducts`),
            fetch(`${API_URL}/api/getcategory`),
        ]).then(async ([fResp, pResp, cResp]) => {
            const [fData, pData, cData] = await Promise.all([
                fResp.ok ? fResp.json() : {},
                pResp.ok ? pResp.json() : {},
                cResp.ok ? cResp.json() : {},
            ]);
            const prods = pData.proddata || [];
            const cats  = cData.catdata  || [];
            const feat  = fData.fdata    || [];
            setfeaturedprods(feat);
            setallprods(prods);
            setcategories(cats);
            // Animate counters
            animateCounters(prods.length, cats.length);
        }).catch(() => toast.error("Failed to load homepage data"));
    }, []);

    const animateCounters = (totalProds, totalCats) => {
        const duration = 1500;
        const steps    = 40;
        const interval = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setcounts({
                products:   Math.round(totalProds  * progress),
                categories: Math.round(totalCats   * progress),
                secure:     Math.round(100 * progress),
            });
            if (step >= steps) clearInterval(timer);
        }, interval);
    };

    // Slider settings
    const bannerSettings = {
        dots: true, autoplay: true, autoplaySpeed: 5000,
        infinite: true, slidesToShow: 1, slidesToScroll: 1, fade: true,
    };
    const testimonialSettings = {
        dots: true, arrows: true, infinite: true, speed: 500,
        slidesToShow: 2, slidesToScroll: 1, responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
    };

    const discountedPrice = (rate, discount) =>
        Math.round(Number(rate) - (Number(discount) * Number(rate)) / 100);

    const onsubscribe = () => {
        if (!email) { toast.error("Please enter your email"); return; }
        fetch(`${API_URL}/api/subscribe`, {
            method: "post",
            body: JSON.stringify({ email }),
            headers: { 'Content-type': 'application/json;charset=utf-8' }
        }).then(resp => {
            if (resp.ok) {
                resp.json().then(result => {
                    if (result.statuscode === 1) {
                        toast.success("Thanks for subscribing!");
                        setemail("");
                    } else {
                        toast.error("This email is already subscribed.");
                        setemail("");
                    }
                });
            } else { toast.error("Error occurred, please try again"); }
        }).catch(() => toast.error("Network error, please try again"));
    };

    const handleAddToCart = (prod) => {
        if (!user) { mynavigate(`/login?pid=${prod._id}`); return; }
        mynavigate(`/productdetails/${prod._id}`);
    };

    // Show up to 12 featured; fill from allprods if fewer than 8 featured
    const featuredIds = new Set(featuredprods.map(p => p._id));
    const fillerProds = allprods.filter(p => !featuredIds.has(p._id));
    const displayFeatured = featuredprods.length >= 8
        ? featuredprods.slice(0, 12)
        : [...featuredprods, ...fillerProds].slice(0, 12);

    // 12 products for "Shop With Us" (different from featured)
    const shopProds = allprods.slice(0, 12);

    return (
        <>
        <section className="w3mid-gap"></section>

        {/* ── Hero Banner Slider ──────────────────────────────────── */}
        <section className="w3l-main-slider banner-slider position-relative" id="home">
            <Slider {...bannerSettings}>
                {[
                    { bg: "banner-top1", tag: "Up To 60% Off Now", title: "Mid Season Sale", sub: "Final Clearance: Take 20% off Sale Must-Haves" },
                    { bg: "banner-top2", tag: "Fall Summer Clearance", title: "Enjoy The Season Sale", sub: "Fresh arrivals across all categories — shop now" },
                    { bg: "banner-top3", tag: "New Arrivals", title: "Shop The Latest Trends", sub: "Electronics, Fashion, Footwear & More" },
                    { bg: "banner-top4", tag: "Best Deals Today", title: "Unbeatable Prices", sub: "Discounts up to 30% on top brands" },
                ].map((slide, i) => (
                    <div key={i}>
                        <div className="item">
                            <div className={`slider-info banner-view ${slide.bg}`}>
                                <div className="container">
                                    <div className="banner-info header-hero-19">
                                        <h5>{slide.tag}</h5>
                                        <h3 className="title-hero-19">{slide.title}</h3>
                                        <p>{slide.sub}</p>
                                        <Link to="/showcategory" className="btn btn-style btn-primary mt-sm-5 mt-4">
                                            Start Shopping <i className="fas fa-arrow-right ms-lg-3 ms-2"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>

        {/* ── Trust Badges ────────────────────────────────────────── */}
        <section style={{ background: "#fff", borderTop: "3px solid #ef233c", borderBottom: "1px solid #f0e0e0" }}>
            <div className="container">
                <div className="row g-0">
                    {[
                        { icon: "fa-truck",         text: "Free Shipping",  sub: "On orders above $49 CAD" },
                        { icon: "fa-rotate-left",   text: "Easy Returns",   sub: "7-day return policy"  },
                        { icon: "fa-shield-halved", text: "Secure Payment", sub: "100% protected"       },
                        { icon: "fa-headset",       text: "24/7 Support",   sub: "Always here for you"  },
                    ].map((b, i) => (
                        <div className="col-md-3 col-6" key={b.text}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: 14,
                                padding: "20px 24px",
                                borderRight: i < 3 ? "1px solid #fce4e4" : "none",
                                borderBottom: "none",
                            }}>
                                <div style={{
                                    width: 50, height: 50, borderRadius: "50%",
                                    background: "#fef2f2",
                                    border: "2px solid #ef233c",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                }}>
                                    <i className={`fa-solid ${b.icon}`} style={{ fontSize: 20, color: "#ef233c" }}></i>
                                </div>
                                <div>
                                    <strong style={{ fontSize: 14, color: "#2b2d42", display: "block", fontWeight: 700 }}>{b.text}</strong>
                                    <span style={{ fontSize: 12, color: "#888" }}>{b.sub}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Shop By Category ────────────────────────────────────── */}
        {categories.length > 0 && (
            <section className="w3l-witemshny-main py-5">
                <div className="container py-md-4">
                    <h3 className="title-w3l">Shop By Category</h3>
                    <p>Browse our wide range of categories</p>
                    <div className="witemshny-grids row mt-lg-3">
                        {categories.map(cat => (
                            <div className="col-xl-2 col-md-4 col-6 product-incfhny mt-4" key={cat._id}>
                                <Link to={`/showsubcategory/${cat._id}`}>
                                    <div className="weitemshny-grid oposition-relative">
                                        <img
                                            src={`/idata/${cat.catpic}`}
                                            alt={cat.catname}
                                            className="img-fluid news-image"
                                            style={{ height: 175, width: "100%", objectFit: "cover", borderRadius: 8 }}
                                            onError={e => { e.target.src = "images/d1.jpg"; }}
                                        />
                                    </div>
                                    <h4 className="gdnhy-1 mt-3 text-center">{cat.catname}</h4>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* ── Promo Banners ───────────────────────────────────────── */}
        <div className="w3l-3-grids py-5" id="grids-3">
            <div className="container py-md-4">
                <div className="row">
                    {[
                        { img: "images/banner1.jpg", tag: "New Collection", title: "Platform Velvet", sub: "Sandals", link: "/showsubcategory" },
                        { img: "images/banner2.jpg", tag: "Trending Now",   title: "Pebbled Weekend", sub: "Bag",     link: "/showcategory" },
                    ].map((b, i) => (
                        <div className={`col-md-6 ${i === 1 ? "mt-md-0 mt-4 grids3-info2" : "mt-md-0"}`} key={b.title}>
                            <div className={`grids3-info${i === 1 ? " second" : ""} position-relative`} style={{ overflow: "hidden", borderRadius: 4 }}>
                                <Link to={b.link} className="d-block zoom">
                                    <img src={b.img} alt={b.title} className="img-fluid news-image" style={{ display: "block" }}/>
                                </Link>
                                {/* Overlay */}
                                <div style={{
                                    position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                                    background: "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 100%)",
                                    display: "flex", flexDirection: "column", justifyContent: "center",
                                    padding: "2rem 2.2rem",
                                }}>
                                    <span style={{
                                        display: "inline-block", background: "#ef233c",
                                        color: "#fff", fontSize: 11, fontWeight: 700,
                                        letterSpacing: 2, textTransform: "uppercase",
                                        padding: "3px 12px", borderRadius: 2, marginBottom: 12, width: "fit-content",
                                    }}>{b.tag}</span>
                                    <h3 style={{
                                        color: "#fff", fontWeight: 800,
                                        fontSize: "clamp(22px, 3vw, 32px)",
                                        lineHeight: 1.2, margin: 0,
                                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                    }}>
                                        {b.title}<br/>
                                        <span style={{ color: "#ef233c" }}>{b.sub}</span>
                                    </h3>
                                    <Link
                                        to={b.link}
                                        className="btn btn-style btn-primary"
                                        style={{ marginTop: 20, width: "fit-content", fontSize: 13 }}
                                    >
                                        Shop Now <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* ── Featured Products ────────────────────────────────────── */}
        {displayFeatured.length > 0 && (
            <section className="w3l-witemshny-main py-5" style={{ background: "#f9fafb" }}>
                <div className="container py-md-4">
                    <h3 className="title-w3l">Best Featured Products</h3>
                    <p>Handpicked just for you</p>
                    <div className="witemshny-grids row mt-lg-3">
                        {displayFeatured.map(prod => (
                            <div className="col-xl-2 col-md-4 col-6 product-incfhny mt-4" key={prod._id}>
                                <Link to={`/productdetails/${prod._id}`}>
                                    <div className="weitemshny-grid oposition-relative" style={{ position: "relative" }}>
                                        {prod.discount && Number(prod.discount) > 0 && (
                                            <span style={{
                                                position: "absolute", top: 8, left: 8, background: "#dc2626",
                                                color: "#fff", fontSize: 11, fontWeight: 700,
                                                padding: "2px 8px", borderRadius: 4, zIndex: 1
                                            }}>{prod.discount}% OFF</span>
                                        )}
                                        <img
                                            src={`/idata/${prod.productpic}`}
                                            alt={prod.productname}
                                            style={{ height: 175, width: "100%", objectFit: "cover" }}
                                            onError={e => { e.target.src = "images/d1.jpg"; }}
                                        />
                                    </div>
                                    <h4 className="gdnhy-1 mt-3" style={{ fontSize: 13, fontWeight: 600 }}>
                                        {prod.productname}
                                    </h4>
                                    <div>
                                        <span className="badge bg-danger me-1">
                                            CA${discountedPrice(prod.rate, prod.discount)}
                                        </span>
                                        {Number(prod.discount) > 0 && (
                                            <small><del className="text-muted">CA${prod.rate}</del></small>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-5">
                        <Link to="/showcategory" className="btn btn-style btn-primary">
                            View All Products <i className="fas fa-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>
            </section>
        )}

        {/* ── Shop With Us (real products) ─────────────────────────── */}
        {shopProds.length > 0 && (
            <section className="w3l-ecommerce-main">
                <div className="ecom-contenthny py-5">
                    <div className="container py-lg-5">
                        <h3 className="title-w3l">Shop With Us</h3>
                        <p>Explore our latest products</p>
                        <div className="ecom-products-grids row mt-lg-4 mt-3">
                            {shopProds.map(prod => (
                                <div className="col-lg-3 col-6 product-incfhny mt-4" key={prod._id}>
                                    <div className="product-grid2">
                                        <div className="product-image2" style={{ position: "relative" }}>
                                            {prod.discount && Number(prod.discount) > 0 && (
                                                <span style={{
                                                    position: "absolute", top: 8, left: 8, background: "#dc2626",
                                                    color: "#fff", fontSize: 11, fontWeight: 700,
                                                    padding: "2px 8px", borderRadius: 4, zIndex: 2
                                                }}>{prod.discount}% OFF</span>
                                            )}
                                            <Link to={`/productdetails/${prod._id}`}>
                                                <img
                                                    className="pic-1 img-fluid radius-image"
                                                    src={`/idata/${prod.productpic}`}
                                                    alt={prod.productname}
                                                    style={{ height: 220, width: "100%", objectFit: "cover" }}
                                                    onError={e => { e.target.src = "images/shop-1.jpg"; }}
                                                />
                                                <img
                                                    className="pic-2 img-fluid radius-image"
                                                    src={`/idata/${prod.productpic}`}
                                                    alt={prod.productname}
                                                    style={{ height: 220, width: "100%", objectFit: "cover" }}
                                                    onError={e => { e.target.src = "images/shop-1.jpg"; }}
                                                />
                                            </Link>
                                            <ul className="social">
                                                <li>
                                                    <Link to={`/productdetails/${prod._id}`} title="Quick View">
                                                        <span className="fa fa-eye"></span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button
                                                        title="Add to Cart"
                                                        onClick={() => handleAddToCart(prod)}
                                                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                                    >
                                                        <span className="fa fa-shopping-bag"></span>
                                                    </button>
                                                </li>
                                            </ul>
                                            <div className="shopv single-item">
                                                <Link to={`/productdetails/${prod._id}`}>
                                                    <button type="button" className="shopv-cart pshopv-cart add-to-cart">
                                                        View Product
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <h3 className="title">
                                                <Link to={`/productdetails/${prod._id}`}>{prod.productname}</Link>
                                            </h3>
                                            <span className="price">
                                                {Number(prod.discount) > 0 && (
                                                    <del>CA${prod.rate}</del>
                                                )}
                                                {" "}CA${discountedPrice(prod.rate, prod.discount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-5">
                            <Link to="/showcategory" className="btn btn-style btn-primary">
                                Browse All Categories <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* ── Stats / Why Us ───────────────────────────────────────── */}
        <section id="counts" className="w3lcounts pb-5">
            <div className="container">
                <div className="text-center mb-5">
                    <h6 className="title-subw3hny mb-1">Our Numbers</h6>
                    <h3 className="title-w3l">India's Most Trusted Online Store</h3>
                </div>
                <div className="row">
                    {[
                        { num: counts.products,   suffix: "+", label: "Products",   icon: "fas fa-box-open"      },
                        { num: counts.categories, suffix: "",  label: "Categories", icon: "fa-solid fa-sitemap"  },
                        { num: counts.secure,     suffix: "%", label: "Secure",     icon: "fa-solid fa-shield-halved" },
                        { num: "24/7",            suffix: "",  label: "Support",    icon: "fas fa-headset"       },
                    ].map((s, i) => (
                        <div className="col-lg-3 col-md-6 w3stats_info counter_grid mb-4" key={i}>
                            <div className="count-box">
                                <i className={s.icon}></i>
                                <p className="counter">{s.num}{s.suffix}</p>
                                <p>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Testimonials ────────────────────────────────────────── */}
        <section className="w3l-clients w3l-test" id="testimonials">
            <div className="container py-lg-5 py-md-4 pt-5 pb-5">
                <div className="row">
                    <div className="col-lg-4 testimonials-con-left-info py-sm-5 pt-0 py-3">
                        <div className="title-content text-left p-xl-3">
                            <h6 className="title-subw3hny">Reviews</h6>
                            <h3 className="title-w3l two">What Our Customers Say</h3>
                            <p className="test-p mt-3">
                                Thousands of happy customers trust ShoppyKart for quality products and fast delivery.
                            </p>
                            <Link to="/showcategory" className="btn btn-style btn-primary mt-3">
                                Shop Now <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-8 testimonials-con-right mt-lg-0 mt-3 p-xl-3 pb-4">
                        <Slider {...testimonialSettings} className="testimonials-2 py-sm-5 pt-0 py-3">
                            {[
                                { name: "Rahul Sharma", city: "Mumbai", img: "images/team1.jpg", text: "Great quality products and super fast delivery. ShoppyKart is my go-to store for all online shopping!" },
                                { name: "Priya Mehta", city: "Delhi", img: "images/team2.jpg", text: "Amazing deals and discounts. Got my iPhone at the best price. Highly recommend!" },
                                { name: "Arjun Singh", city: "Bangalore", img: "images/team3.jpg", text: "Customer support is excellent. Resolved my issue within minutes. Very satisfied!" },
                                { name: "Sneha Patel", city: "Ahmedabad", img: "images/team4.jpg", text: "Love the variety of products. Found everything I needed in one place. 5 stars!" },
                                { name: "Vikram Nair", city: "Chennai", img: "images/team1.jpg", text: "Smooth checkout experience and genuine products. Will definitely shop again!" },
                                { name: "Ananya Roy", city: "Kolkata", img: "images/team3.jpg", text: "Best online shopping experience. Easy returns and super packaging!" },
                            ].map((t, i) => (
                                <div key={i}>
                                    <div className="item slick-slidew">
                                        <div className="testimonial-content">
                                            <div className="testimonial">
                                                <p>
                                                    <i className="fas fa-quote-left me-2"></i>
                                                    {t.text}
                                                </p>
                                                <div className="mt-2">
                                                    {[1,2,3,4,5].map(s => (
                                                        <i key={s} className="fas fa-star text-warning" style={{ fontSize: 12 }}></i>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bottom-info mt-4">
                                                <a className="comment-img" href="#testimonials">
                                                    <img src={t.img} className="img-fluid radius-image" alt={t.name}/>
                                                </a>
                                                <div className="people-info align-self">
                                                    <h3>{t.name}</h3>
                                                    <p className="identity">{t.city}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </section>

        {/* ── Newsletter ───────────────────────────────────────────── */}
        <section className="w3l-subscription-infhny py-5">
            <div className="container py-md-5">
                <div className="subscription-info text-center mx-auto">
                    <i className="far fa-envelope"></i>
                    <h3 className="title-w3l mb-2">Get On The List</h3>
                    <p>Shop Exclusive Promos &amp; SAVE 20% on Your First Order</p>
                    <section className="w3l-signin-form mt-4 mb-3">
                        <div className="forms-gds">
                            <div className="form-input">
                                <input
                                    type="email"
                                    name="subscribe"
                                    value={email}
                                    onChange={e => setemail(e.target.value)}
                                    placeholder="Your email here"
                                    required
                                />
                            </div>
                            <div className="form-input">
                                <button onClick={onsubscribe} className="btn btn-style btn-primary">Subscribe</button>
                            </div>
                        </div>
                    </section>
                    <p>By entering your email, you accept our <a href="#pr">Terms of Use</a> and <a href="#pr">Privacy Policy</a>.</p>
                </div>
            </div>
        </section>
        </>
    );
};
export default Homepage;
