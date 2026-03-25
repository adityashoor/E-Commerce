import { Link } from 'react-router-dom';
import t1 from '../images/team1.jpg';
import t2 from '../images/team2.jpg';
import t3 from '../images/team3.jpg';
import { useEffect } from 'react';
var About=()=>
{
    useEffect(()=>
    {
        window.scrollTo(0, 0);
    },[])
    return(
        <> <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
            <div className="container">
                <div className="w3breadcrumb-gids">
                    <div className="w3breadcrumb-left text-left">
                        <h2 className="inner-w3-title">
                            About Us </h2>
                    </div>
                    <div className="w3breadcrumb-right">
                        <ul className="breadcrumbs-custom-path">
                            <li><Link to="/homepage">Home</Link></li>
                            <li className="active"><span className="fas fa-angle-double-right mx-2"></span> About Us</li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    </div>
        <div className='gap'></div>

    <div className="w3l-3-grids py-5" id="about-1">
        <div className="container py-md-5 py-2 pb-0">
            <div className="w3abin-top text-center">
                <div className="title-content">
                    <h6 className="title-subw3hny mb-1">Our Info</h6>
                    <h3 className="title-w3l">About Our ShoppyKart</h3>
                </div>
                <p className="mt-3">Lorem ipsum viverra feugiat. Pellen tesque libero ut justo,
                    ultrices in ligula. Semper at tempufddfel. Lorem ipsum dolor sit amet
                    elit ipsum dolor.Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla non ipsum soluta perferendis veniam qui esse magnam commodi quisquam.</p>
                <a href="#" className="btn btn-style btn-primary mt-sm-5 mt-4">Read More<i className="fas fa-arrow-right ms-lg-3 ms-2"></i></a>
            </div>
        </div>
    </div>
    <section id="counts" className="w3lcounts pb-5">
        <div className="container pb-md-5 pb-3">
            <div className="row">
                <div className="col-lg-3 col-md-6 w3stats_info counter_grid">
                    <div className="count-box">
                        <i className="fas fa-users"></i>
                        <p className="counter">960</p>
                        <p>Happy Clients</p>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mt-5 mt-md-0 w3stats_info counter_grid">
                    <div className="count-box">
                        <i className="far fa-images"></i>
                        <p className="counter">1560</p>
                        <p>Projects</p>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mt-5 mt-lg-0 w3stats_info counter_grid">
                    <div className="count-box">
                        <i className="fas fa-headset"></i>
                        <p className="counter">1660</p>
                        <p>Hours Of Support</p>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mt-5 mt-lg-0 w3stats_info counter_grid">
                    <div className="count-box">
                        <i className="fas fa-user-tie"></i>
                        <p className="counter">860</p>
                        <p>Hard Workers</p>
                    </div>
                </div>

            </div>

        </div>
    </section>
    <section className="w3l-index5 py-5">
        <div className="container py-md-3">
            <div className="w3l-project-in">
                <div className="row">
                    <div className="col-lg-7">
                        <div className="bottom-info">
                            <div className="header-section title-content-two pe-lg-5">
                                <h6 className="title-subw3hny mb-1">Our Special Offer</h6>
                                <h3 className="title-w3l two mb-4">Up To 60% Off Now <br/>Enjoy The Season Sale
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 align-self mt-lg-0 mt-sm-5 mt-4">
                        <div className="w3l-buttons d-sm-flex justify-content-end">
                            <Link to="/contact" className="btn btn-style btn-white btn-primary">
                                Contact
                                Us <i className="fas fa-arrow-right ms-lg-3 ms-2"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
	<div className='gap'>

 
</div>
    <section id="team" className="w3lteam py-5">
        <div className="container py-md-5">
            <div className="title-content text-center">
                <h6 className="title-subw3hny mb-1">Our Team</h6>
                <h3 className="title-w3l mb-5">Our Creative Team.</h3>
            </div>
            <div className="row">
                <div className="col-lg-4 col-md-6">
                    <div className="member">
                        <div className="pic"><img src={t1} className="img-fluid radius-image" alt="t1"/></div>
                        <div className="member-info">
                            <h4>Walter White</h4>
                            <span>Chief Executive Officer</span>
                            <div className="social">
                                <a href="#facebook" className="facebook"><span className="fab fa-facebook-f"></span></a>
                                <a href="#twitter" className="twitter"><span className="fab fa-twitter"></span></a>


                                <a href="#linkd" className="linkd"><span className="fab fa-linkedin-in"></span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6">
                    <div className="member">
                        <div className="pic"><img src={t2} className="img-fluid radius-image" alt="t2"/></div>
                        <div className="member-info">
                            <h4>Sarah Jhonson</h4>
                            <span>Product Manager</span>
                            <div className="social">
                                <a href="#facebook" className="facebook"><span className="fab fa-facebook-f"></span></a>
                                <a href="#twitter" className="twitter"><span className="fab fa-twitter"></span></a>


                                <a href="#linkd" className="linkd"><span className="fab fa-linkedin-in"></span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6">
                    <div className="member">
                        <div className="pic"><img src={t3} className="img-fluid radius-image" alt="t3"/></div>
                        <div className="member-info">
                            <h4>William Anderson</h4>
                            <span>Sales Manager</span>
                            <div className="social">
                                <a href="#facebook" className="facebook"><span className="fab fa-facebook-f"></span></a>
                                <a href="#twitter" className="twitter"><span className="fab fa-twitter"></span></a>

                                <a href="#linkd" className="linkd"><span className="fab fa-linkedin-in"></span></a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </section>
<div className='gap'>
</div>
        </>
    )
}
export default About;