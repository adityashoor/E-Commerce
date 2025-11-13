import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MyContext from "../MyContext";
import ReCAPTCHA from "react-google-recaptcha";

var ChangePass = () => {
  const [uname, setuname] = useState();
  const [pass, setpass] = useState();
  const [newpass, setnewpass] = useState();
  const [cpass, setcpass] = useState();
  var mynavigate = useNavigate();
  const{setuser}=useContext(MyContext);
  const [verify, setverify] = useState();


  var onchangepass = () => {
    
    if(verify)
    {
      if(newpass===cpass)
      {
          fetch("http://localhost:9000/api/changepass", {
            method:"put",
            body:JSON.stringify({username:uname,password:pass,newpass:newpass}),
            headers:{"Content-type":"application/json;charset=utf-8"},
          }).then(resp => {
            if (resp.ok) 
            {
              resp.json().then(result => {
                
                if (result.statuscode===-1) 
                {
                  toast.error("No User Found");
                }
                else if (result.statuscode===-2) 
                {
                  toast.error("invalid password");
                } 
                else if (result.statuscode===1) 
                {
                    toast.success("Password Updated Successfully");
                    setuser(null);
                    sessionStorage.clear('user');
                    mynavigate("/login");
                }
                else if (result.statuscode===0) 
                {
                  toast.error("Error while Updating ,Please Try Again");
                } 
              });
            } 
            else 
            {
              toast.error("Error Occured Please Try Again");
            }
          })
      }
      else
      {
          toast.error("Please Confirm The Password Correctly")
      }
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
      <section className="w3mid-gap"></section>
      <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
          <div className="container">
            <div className="w3breadcrumb-gids">
              <div className="w3breadcrumb-left text-left">
                <h2 className="inner-w3-title">Change Password </h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/homepage">Home</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span> Change Password 
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
            <h2>Change Password </h2>

            <div className="form-sub-w3">
              <input
                type="text"
                name="Username"
                onChange={(e) => setuname(e.target.value)}
                placeholder="Username or Email"
                required=""
              />
              <div className="icon-w3">
                <span className="fas fa-user" aria-hidden="true"></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input
                type="password"
                name="Password"
                onChange={(e) => setpass(e.target.value)}
                placeholder="Current Password"
                required=""
              />
              <div className="icon-w3">
                <span className="fas fa-unlock-alt" aria-hidden="true"></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input
                type="password"
                name="confirmPassword"
                onChange={(e) => setnewpass(e.target.value)}
                placeholder="New Password"
                required=""
              />
              <div className="icon-w3">
                <span className="fas fa-unlock-alt" aria-hidden="true"></span>
              </div>
            </div>

            <div className="form-sub-w3">
              <input
                type="password"
                name="confirmPassword"
                onChange={(e) => setcpass(e.target.value)}
                placeholder="Confirm New Password"
                required=""
              />
              <div className="icon-w3">
                <span className="fas fa-unlock-alt" aria-hidden="true"></span>
              </div>
            </div>
            <ReCAPTCHA sitekey="6LcgiAImAAAAALKOjVIINBimTcMi0KeDmyaZU_wl" onChange={onChange}/>
           
            <div className="submit-button text-center">
              <button onClick={onchangepass} className="btn btn-style btn-primary">
                Change Now
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="gap"></div>
    </>
  );
};
export default ChangePass;
