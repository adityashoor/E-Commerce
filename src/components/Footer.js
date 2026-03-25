import { useEffect } from "react";

var Footer=()=>
{
    useEffect(()=>
    {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    },[])

     window.onscroll = function() {
                scrollFunction()
            };

            function scrollFunction() {
                if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
                    document.getElementById("movetop").style.display = "block";
                } else {
                    document.getElementById("movetop").style.display = "none";
                }
            }

            // When the user clicks on the button, scroll to the top of the document
            function topFunction() {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
    return(
        <>
        
    <footer className="w3l-footer-29-main">
        <div className="footer-29 py-3">
            <div className="container py-lg-4">
                <h2>Special Offer All Branded Sandals are <br/>Flat 50% Discount</h2>
                <div className="row footer-top-29 mt-md-5">
                   <div className="col-lg-3 col-md-6 footer-list-29 footer-3 pe-lg-5">
                        <h6 className="footer-title-29">USeful Links</h6>
                        <div className="footer-listw3-grids">
                            <ul className="footer-listw3">
                                <li><a href="index.html">Home</a></li>
                                <li><a href="about.html">About</a></li>
                                <li><a href="blog.html">Blogs</a></li>
                                <li><a href="contact.html">Contact</a></li>
                                <li><a href="#support">Support</a></li>
                                <li><a href="#news">News & Media</a></li>
                                <li><a href="#Careers">Careers</a></li>

                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 footer-list-29 footer-1 ps-lg-5 mt-lg-0 mt-md-5 mt-4">
                        <h6 className="footer-title-29">Information</h6>
                        <div className="footer-listw3-grids">
                            <ul className="footer-listw3">
                                <li><a href="#terms">Terms & Conditions</a></li>
                                <li><a href="#deivery">Delivery Terms</a></li>
                                <li><a href="#order">Order Tracking</a></li>
                                <li><a href="#returns">Returns Policy</a></li>
                                <li><a href="#support">Privacy Policy</a></li>
                                <li><a href="#faq">FAQ</a></li>
                                <li><a href="#shop">The Shop</a></li>

                            </ul>

                        </div>

                    </div>
                    <div className="col-lg-3 col-md-6 footer-list-29 footer-3 mt-lg-0 mt-md-5 mt-4 pe-lg-5">
                        <h6 className="footer-title-29">Address</h6>
                        <div className="footer-listw3-grids">
                            <ul className="footer-listw3">
                                <li>London, UK</li>
                                <li>998 13h Street, Office 436</li>
                                <li>Harlo 61466</li>
                                <li><a href="tel:+(21) 255 999 8888">+(21) 255 999 8888</a></li>
                                <li><a href="mailto:ShoppyKart@mail.com" className="mail">ShoppyKart@mail.com</a></li>

                            </ul>

                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 footer-list-29 footer-4 mt-lg-0 mt-md-5 mt-4  ps-lg-5">
                        <h6 className="footer-title-29">Payment Method</h6>
                        <div className="pay-method-grids">
                            <a className="pay-method"><span className="fab fa-cc-visa" aria-hidden="true"></span></a>
                           
                            <a className="pay-method"><span className="fab fa-cc-discover" aria-hidden="true"></span></a>
                           
                            <a className="pay-method"><span className="fab fa-cc-paypal" aria-hidden="true"></span></a>
                           
                            <a className="pay-method"><span className="fab fa-cc-mastercard" aria-hidden="true"></span></a>
                            <a className="pay-method"><span className="fab fa-cc-stripe" aria-hidden="true"></span></a>
                            <a className="pay-method"><span className="fab fa-cc-amex" aria-hidden="true"></span></a>
                           
                            <a className="pay-method"><span className="fab fa-cc-jcb" aria-hidden="true"></span></a>
                           
                            <a className="pay-method"><span className="cc-diners-club" aria-hidden="true"></span></a>
                           

                        </div>
                    </div>
                </div>
                <div className="row bottom-copies">
                    <p className="copy-footer-29 col-lg-8">© 2021 ShoppyKart. All rights reserved | Designed by <a href="#">Aditya Shoor</a></p>
                    <div className="col-lg-4 main-social-right mt-lg-0 mt-4">
                        <div className="main-social-footer-29">
                            <a href="#facebook" className="facebook"><span className="fab fa-facebook-f"></span></a>
                            <a href="#twitter" className="twitter"><span className="fab fa-twitter"></span></a>
                            <a href="#instagram" className="instagram"><span className="fab fa-instagram"></span></a>
                            <a href="#linkd" className="linkd"><span className="fab fa-linkedin-in"></span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button onClick={topFunction} id="movetop" title="Go to top">
            <span className="fa fa-angle-up"></span>
        </button>
        </footer>
        </>
    )
}
export default Footer;