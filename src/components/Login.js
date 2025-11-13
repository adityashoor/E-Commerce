import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import MyContext from "../MyContext";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "universal-cookie";

var Login = () => {
  const [uname, setuname] = useState();
  const [pass, setpass] = useState();
  const [verify, setverify] = useState();
  const [remember, setremember] = useState();
  var mynavigate = useNavigate();
  const[searchparams]=useSearchParams();
  const pid=searchparams.get('pid')
  const{setuser}=useContext(MyContext);
  const cookies = new Cookies();

  useEffect(()=>
  {
      window.scrollTo(0, 0);
  },[])
  
  var onlogin = () => {
    if(verify)
    {
    fetch("http://localhost:9000/api/login", {
      method:"post",
      body:JSON.stringify({username:uname,password:pass}),
      headers:{"Content-type":"application/json;charset=utf-8"},
    }).then(resp => {
      if (resp.ok) 
      {
        resp.json().then(result => {
          
          if (result.statuscode===-1) 
          {
            toast.error("error occured,please try again");
            console.log(result.errinfo);
          }
          else if (result.statuscode===0) 
          {
            toast.error("invalid username or password");
          } 
          else if (result.statuscode===1) 
          {
              if(result.userdata[0].Activated===true)
              {
                setuser(result.userdata[0]);
                sessionStorage.setItem('user',JSON.stringify(result.userdata[0]))
                if(remember===true)
                {
                  cookies.set("rememberMe",result.userdata[0],{maxAge:604800,path:"/"})
                }

                if(result.userdata[0].usertype==="normal")
                {
                  if(pid!=null)
                  {
                    mynavigate(`/productdetails/${pid}`)
                  }
                  else
                  {
                    mynavigate("/homepage");
                  }
                }
                else if(result.userdata[0].usertype==="admin")
                {
                  mynavigate("/adminpanel");
                }
              } 
               else
              {
                toast.error("This Account is Not Activated")
              }
          }
        });
      } 
      else 
      {
        toast.error("Error Occured Please Try Again");
      }
    });
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
                <h2 className="inner-w3-title">Login </h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/homepage">Home</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span> Login{" "}
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
            <h2>Login to your account</h2>

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
                placeholder="Password"
                required=""
              />
              <div className="icon-w3">
                <span className="fas fa-unlock-alt" aria-hidden="true"></span>
              </div>
            </div>
            <label for="rememberMe" className="fw-bold"><input className="ms-2" type="checkbox" onChange={(e)=>setremember(e.target.checked)}/> Remember me</label><br/><br/>
             <ReCAPTCHA sitekey="6LcgiAImAAAAALKOjVIINBimTcMi0KeDmyaZU_wl" onChange={onChange}/><br/>
            <div className="form-sub-content">
              <p className="forgot-w3ls1">
                Forgot Password?
                <Link to="/forgetpass">Click here</Link>
              </p>
              <p className="forgot-w3ls1">
                New User? <Link to="/signup">Signup here</Link>
              </p>
            </div>
           
            <div className="submit-button text-center">
              <button onClick={onlogin} className="btn btn-style btn-primary">
                Login Now
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="gap"></div>
    </>
  );
};
export default Login;
