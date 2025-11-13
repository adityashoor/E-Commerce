import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MyContext from "../MyContext";
import ReCAPTCHA from "react-google-recaptcha";

var Checkout = () => {
  const[pmode,setpmode]=useState();
  const[flag,setflag]=useState(false);
  const[name,setname]=useState();
  const[phoneno,setphoneno]=useState();
  const[shiploc,setshiploc]=useState();
  const[city,setcity]=useState();
  const [verify, setverify] = useState();
  var mynavigate = useNavigate();
  const{user}=useContext(MyContext);

  var oncheckout=async()=>
  {
    if(verify)
    {
      var checkoutdata = {addr:shiploc,city,name,phoneno,billamt:sessionStorage.getItem("gtot"),paymode:pmode,uname:user.username}
      try {
          const resp = await fetch("http://localhost:9000/api/checkout",
              {
                  method: "post",
                  body: JSON.stringify(checkoutdata),
                  headers:
                  {
                      'Content-type': 'application/json; charset=UTF-8',
                  }
              })
          if (resp.ok) {
              var result = await resp.json();
              if (result.statuscode === 1) {
                   mynavigate("/ordersummary")
              }
              else {
                  toast.error("Error while placing order, try again");
              }
          }
      }
      catch (err) {
          console.log(err);
      }
    }
    else 
      {
        toast.error("Error Occured Please Try Again");
      }
  }

  var handlemode=(e)=>
    {
       setpmode(e.target.value);
       var paymode = e.target.value;
        if(paymode==='cod')
        {
            setflag(false)
        }
        else if(paymode==="card")
        {
            setflag(true);
        }
        else
        {
            setflag(false)
        }

    }
    function onChange(value) {
      setverify(value);
    }
  return (
    <>
      <section className="w3mid-gap"></section>
      <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
          <div className="container">
            <div className="w3breadcrumb-gids">
              <div className="w3breadcrumb-left text-left">
                <h2 className="inner-w3-title">Checkout </h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/homepage">Home</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span> checkout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="gap"></div>

      <section className="w3l-forml-main py-5">
        <div className="form-hnyv-sec py-sm-5 py-3">
          <div className="form-wrapv">
            <h2>Add Your Details</h2>

            <div className="form-sub-w3">
              <input
                type="text"
                name="Username"
                onChange={(e) => setname(e.target.value)}
                placeholder="Full Name"
                required=""
              />
              <div className="icon-w3">
                <span><i className="fa-solid fa-user"></i></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input
                type="text"
                name="phone"
                onChange={(e) => setphoneno(e.target.value)}
                placeholder="Mobile Number"
                required=""
              />
              <div className="icon-w3">
              <span><i className="fa-solid fa-phone"></i></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input
                type="text"
                name="Username"
                onChange={(e) => setcity(e.target.value)}
                placeholder="City/Town"
                required=""
              />
              <div className="icon-w3">
              <span><i className="fa-solid fa-city"></i></span>
              </div>
            </div>
            <div className="form-sub-w3">
            <textarea name="saddr" placeholder="Additional Shipping Address" className="form-control" onChange={(e)=>setshiploc(e.target.value)}></textarea>
              <div className="icon-w3">
              <span><i className="fa-solid fa-location-dot"></i></span>
              </div>
            </div>
            <h4 className='fw-bold'>Choose Payment Mode</h4><br/>
                        <select name="pmode" className="form-control" onChange={handlemode}>
                            <option value="">Choose</option>
                            <option value="cod">Cash on Delivery</option>
                            <option value="card">Credit/Debit Card</option>
                        </select><br/>
                        {flag?<div>
                            <select name="coname" className="form-control">
                                <option value=''>Choose Company Name</option>
                                <option>MasterCard</option>
                                <option>VISA</option>
                            </select><br/>
                            <div className="form-sub-w3">
                            <input
                                type="text"
                                name="ccno"
                                placeholder="Credit Card No   ( •••• •••• •••• •••• )"
                                inputmode="numeric"
                                required=""
                            />
                                <div className="icon-w3">
                                <span><i className="fa-solid fa-credit-card"></i></span>
                                </div>
                            </div>
                            <div className="form-sub-w3">
                            <input
                                type="text"
                                name="hname"
                                placeholder="Holder Name"
                                required=""
                            />
                                <div className="icon-w3">
                                <span><i className="fa-solid fa-input-text"></i></span>
                                </div>
                            </div>
                            <div className="form-sub-w3">
                            <input
                                type="text"
                                name="exp"
                                placeholder="Expiry   ( MM/YY )"
                                required=""
                            />
                            </div>
                            <div className="form-sub-w3">
                            <input
                                type="password"
                                name="cvv"
                                placeholder="CVV   ( ••• )"
                                inputMode="numeric"
                                required=""
                            />
                            </div>
                        </div>:null}
                        <ReCAPTCHA sitekey="6LcgiAImAAAAALKOjVIINBimTcMi0KeDmyaZU_wl" onChange={onChange}/>
            
            <div className="submit-button text-center">
              <button className="btn btn-style btn-primary" onClick={oncheckout}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="gap"></div>
    </>
  );
};
export default Checkout;
