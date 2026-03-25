import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

var Contact=()=>
{
    const[name,setname]=useState();
    const[email,setemail]=useState();
    const[phone,setphone]=useState();
    const[subject,setsubject]=useState();
    const[message,setmessage]=useState();
    const [verify, setverify] = useState();
    const[load,setload]=useState(false);

    useEffect(()=>
    {
        window.scrollTo(0, 0);
    },[])
    var oncontact=()=>
    {
        if(verify)
        {
            setload(true);
            var customerdata={name,email,phone,subject,message}
            fetch("http://localhost:9000/api/contact",
            {
                method:"post",
                body:JSON.stringify(customerdata),
                headers:{'Content-type':'application/json;charset=utf-8'}
            }).then(resp=>
                {
                    if(resp.ok)
                    {
                    resp.json().then(result=>
                        {
                            if(result.statuscode===-1)
                            {
                                toast.error("error please try again");
                            }
                            else if(result.statuscode===1)
                            {
                                setload(false);
                                toast.success("Thanks For Contacting");
                            }
                        })  
                    }
                })
        }
        else
        {
        toast.error("Please Verify Yourself")
        }
    }
    function onChange(value) {
        setverify(value);
      }
    return(
        <>
        <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
            <div className="container">
                <div className="w3breadcrumb-gids">
                    <div className="w3breadcrumb-left text-left">
                        <h2 className="inner-w3-title">
                            Contact Us </h2>
                    </div>
                    <div className="w3breadcrumb-right">
                        <ul className="breadcrumbs-custom-path">
                            <li><Link to="/homepage">Home</Link></li>
                            <li className="active"><span className="fas fa-angle-double-right mx-2"></span> Contact Us</li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    </div>
<div className="gap">


 
</div>
    <section className="w3l-contact-2 py-5" id="contact">
        <div className="container py-lg-4 py-md-3 py-2">
            <div className="title-content text-center">
                <h6 className="title-subw3hny mb-1">Get in touch</h6>
                <h3 className="title-w3l mb-5">Contact with our support <br/>
                    during emergency!</h3>
            </div>

            <div className="contact-grids mt-5 pt-lg-3">
                <div className="contact-left">
                    <div className="row cont-details">
                        <div className="col-lg-4 col-md-6 cont-top margin-up">
                            <div className="cont-left text-center">
                                <span className="fas fa-map-marker-alt"></span>
                            </div>
                            <div className="cont-right">
                                <h6>Office Address:</h6>
                                <p>Lorem ipsum, 343 ShoppyKart, #4148 Honey street, NY - 62617.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 cont-top margin-up ps-lg-5">
                            <div className="cont-left text-center">
                                <span className="fas fa-phone-alt"></span>
                            </div>
                            <div className="cont-right">
                                <h6>Call for help :</h6>
                                <p><a href="tel:+1(21) 234 4567">+1(21) 234 557 4567</a></p>
                                <p><a href="tel:+1(21) 234 4567">+1(21) 234 557 4568</a></p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 cont-top margin-up">
                            <div className="cont-left text-center">
                                <span className="far fa-envelope"></span>
                            </div>
                            <div className="cont-right">
                                <h6>
                                    Mail us:</h6>
                                <p><a href="mailto:support@mail.com" className="mail">support@mail.com</a></p>
                                <p><a href="mailto:contact@mail.com" className="mail">contact@mail.com</a></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-right mt-lg-4">
                    
                        <div className="input-grids">
                            <input type="text" name="w3lName" id="w3lName" onChange={(e)=>setname(e.target.value)} placeholder="Your Name*" className="contact-input" required=""/>
                            <input type="email" name="w3lSender" id="w3lSender" onChange={(e)=>setemail(e.target.value)} placeholder="Your Email*" className="contact-input" required=""/>
                            <input type="text" name="w3lPhone" id="w3lPhone" onChange={(e)=>setphone(e.target.value)} placeholder="Enter your Phone Number *" required=""/>
                            <input type="text" name="w3lSubect" id="w3lSubect" onChange={(e)=>setsubject(e.target.value)} placeholder="Subject*" className="contact-input" required=""/>
                        </div>
                        <div className="form-input">
                            <textarea name="w3lMessage" id="w3lMessage" onChange={(e)=>setmessage(e.target.value)} placeholder="Type your message here*" required=""></textarea>
                        </div>
                        <ReCAPTCHA sitekey="6LcgiAImAAAAALKOjVIINBimTcMi0KeDmyaZU_wl" onChange={onChange}/><br/>

                        {load===true?<div className="text-center"><div className="spinner-border text-danger" role="status">
                        <span>😁</span><br/></div><p className="text-danger pb-3">Loading...</p></div>:null}
                       
                        <div className="submit-w3l-button text-lg-right">
                            <button onClick={oncontact} className="btn btn-style btn-primary">Send Message</button>
                        </div>
                  
                </div>
            </div>
            <div className="map-iframe mt-5">
                <iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317718.69319292053!2d-0.3817765050863085!3d51.528307984912544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C+UK!5e0!3m2!1sen!2spl!4v1562654563739!5m2!1sen!2spl" width="100%" height="400" frameborder="0" allowfullscreen=""></iframe>
            </div>
        </div>
    </section>
	<div className="gap">
</div>
        </>
    )
}
export default Contact;