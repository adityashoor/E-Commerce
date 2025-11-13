import { useContext, useEffect, useState } from "react";
import { Link,useNavigate,useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import MyContext from "../MyContext";

var Setpass = () => {
  const [pass, setpass] = useState();
  const [cpass, setcpass] = useState();
  const [user1, setuser1] = useState();
  const [flag, setflag] = useState(false);
  const [msg, setmsg] = useState();
  const[myparams]=useSearchParams();
  let mynavigate=useNavigate();
  const {setuser}=useContext(MyContext);
   let token= myparams.get("token")

useEffect(()=>
{
    fetch(`http://localhost:9000/api/fetchexpirydate?token=${token}`).then(resp=>
    {
      if(resp.ok)
      {
        resp.json().then(result=>
          {
            if(result.statuscode===1)
            {
                  setflag(true);
                  setuser1(result.username)
            }
            else if(result.statuscode===0)
            {
              setflag(false);
              setmsg(result.msg)
            }
            else if(result.statuscode===-1)
            {
                setflag(false);
                setmsg(result.msg)
            }
          }
        )}
        else
        {
          toast.error("Error Occured")
        }
    })
},[token])

  var newpass = () => {
    if(pass===cpass)
    {
      fetch("http://localhost:9000/api/resetpass", {
        method:"put",
        body:JSON.stringify({username:user1,password:pass}),
        headers:{"Content-type":"application/json;charset=utf-8"},
      }).then(resp => {
        if (resp.ok) 
        {
          resp.json().then(result => {
            
            if (result.statuscode===-1) 
            {
              toast.error("No User Found");
            }
            else if (result.statuscode===1) 
            {
                toast.success("Password Reseted Successfully");
                setuser(null);
                sessionStorage.clear('user');
                mynavigate("/login");
            }
            else if (result.statuscode===0) 
            {
              toast.warning("Please Use Different Password From Previous One");
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
        setmsg("Please Confirm Password Correctly")
    }
  };

  return (
    <>
      <section className="w3mid-gap"></section>
      <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
          <div className="container">
            <div className="w3breadcrumb-gids">
              <div className="w3breadcrumb-left text-left">
                <h2 className="inner-w3-title">Forget Password </h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/homepage">Home</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span> Forget Password{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="gap"></div>
{flag===true?<>
      <section className="w3l-forml-main py-5">
        <div className="form-hnyv-sec py-sm-5 py-3">
          <div className="form-wrapv">
            <h2>Enter New Password </h2>

            <div className="form-sub-w3">
              <input
                type="password"
                name="pass"
                onChange={(e) => setpass(e.target.value)}
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
                name="cpass"
                onChange={(e) => setcpass(e.target.value)}
                placeholder="Confirm New Password"
                required=""
              />
              
            </div>
            <div className="submit-button text-center">
              <button onClick={newpass} className="btn btn-style btn-primary">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </section></>:<h2 className="text-center my-5">{msg}</h2>}
      <div className="gap"></div>
    </>
  );
};
export default Setpass;
