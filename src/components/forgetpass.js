import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

var Forgetpass = () => {
  const [email, setemail] = useState();
  const [msg, setmsg] = useState();
  const[activate,setactivate]=useState(false);
  const[load,setload]=useState(false);
  const [verify, setverify] = useState();

  var onsearch = () => {
    if(verify)
    {
    setload(true);
    fetch(`http://localhost:9000/api/searchemail?email=${email}`).then(resp=>
    {
        if(resp.ok)
        {
            resp.json().then(result=>
                {
                    setmsg(result.msg);
                        setload(false);
                        setactivate(true);
                })
        }
        else
        {
            setmsg("Error Occured")
        }
    })
    }
    else
    {
      toast.error("Please Verify Yourself")
    }
  };
  function onChange(value) {
    setverify(value);
  }
  return (
    <>
      <section class="w3mid-gap"></section>
      <div class="inner-banner py-5">
        <section class="w3l-breadcrumb text-left py-sm-5 ">
          <div class="container">
            <div class="w3breadcrumb-gids">
              <div class="w3breadcrumb-left text-left">
                <h2 class="inner-w3-title">Forget Password </h2>
              </div>
              <div class="w3breadcrumb-right">
                <ul class="breadcrumbs-custom-path">
                  <li>
                    <Link to="/homepage">Home</Link>
                  </li>
                  <li class="active">
                    <span class="fas fa-angle-double-right mx-2"></span> Forget Password{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="gap"></div>

      <section class="w3l-forml-main py-5">
        <div class="form-hnyv-sec py-sm-5 py-3">
          <div class="form-wrapv">
            <h2>Enter Your Email </h2>

            <div class="form-sub-w3">
              <input
                type="email"
                name="Username"
                onChange={(e) => setemail(e.target.value)}
                placeholder="Email"
                required=""
              />
              <div class="icon-w3">
                <span class="fas fa-user" aria-hidden="true"></span>
              </div>
            </div>
            <ReCAPTCHA sitekey="6LcgiAImAAAAALKOjVIINBimTcMi0KeDmyaZU_wl" onChange={onChange}/><br/>

            <div className="text-center">{load===true?<div><div class="spinner-border text-danger" role="status">
                    <span>😁</span><br/></div><p className="text-danger pb-3">Loading...</p></div>:null}

                    {activate===true?<div class="text-success fw-bold p-3 ">{msg}<br/></div>:null}

                        <button onClick={onsearch} className="btn btn-style btn-primary">Search</button>
                            
            </div>
          </div>
        </div>
      </section>
      <div className="gap"></div>
    </>
  );
};
export default Forgetpass;
