import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

var CreateAdmin=()=>
{
    const[username,setusername]=useState();
    const[email,setemail]=useState();
    const[phone,setphone]=useState();
    const[password,setpassword]=useState();
    const[cpassword,setcpassword]=useState();
    var mynavigate=useNavigate();
    useEffect(()=>
    {
        window.scrollTo(0, 0);
    },[])
    var registeruser=()=>
    {
        var userdata={username,email,phone,password,utype:"admin"};
        if(password===cpassword)
        {
            fetch("http://localhost:9000/api/signup",
        {
            method:"post",
            body:JSON.stringify(userdata),
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
                            toast.success("Admin Created Successfully");
                            mynavigate("/adminpanel");
                        }
                    })  
                }
            })
        }
        else
        {
            toast.error("please comfirm password correctly");
        } 
    }
        
    return(
        <>
            <section className="w3mid-gap"></section>
    <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
            <div className="container">
                <div className="w3breadcrumb-gids">
                    <div className="w3breadcrumb-left text-left">
                        <h2 className="inner-w3-title">
                            Create Admin</h2>
                    </div>
                    <div className="w3breadcrumb-right">
                        <ul className="breadcrumbs-custom-path">
                            <li><Link to="/adminpanel">Admin Panel</Link></li>
                            <li className="active"><span className="fas fa-angle-double-right mx-2"></span> Create Admin </li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    </div>
	<div className="gap">


 
</div>
    <section className="w3l-forml-main py-5">
        <div className="form-hnyv-sec py-sm-5 py-3">
            <div className="form-wrapv">

                <h2>Create New Admin</h2>
               
                    <div className="form-sub-w3">
                        <input type="text" name="Username" onChange={(e)=>setusername(e.target.value)} placeholder="Username " required="" />
                        <div className="icon-w3">
                            <span className="fas fa-user" aria-hidden="true"></span>
                        </div>
                    </div>
                    <div className="form-sub-w3">
                        <input type="text" name="email" onChange={(e)=>setemail(e.target.value)} placeholder="Email " required="" />
                        <div className="icon-w3">
                            <span aria-hidden="true"><i className="fa-solid fa-envelope"></i></span>
                        </div>
                    </div>
                    <div className="form-sub-w3">
                        <input type="text" name="phone" onChange={(e)=>setphone(e.target.value)} placeholder="Phone " required="" />
                        <div className="icon-w3">
                            <span aria-hidden="true"><i className="fa-solid fa-phone"></i></span>
                        </div>
                    </div>
                    <div className="form-sub-w3">
                        <input type="password" name="Password" onChange={(e)=>setpassword(e.target.value)} placeholder="Password" required="" />
                        <div className="icon-w3">
                            <span className="fas fa-unlock-alt" aria-hidden="true"></span>
                        </div>
                    </div>
                    <div className="form-sub-w3">
                        <input type="password" name="comfirmpassword" onChange={(e)=>setcpassword(e.target.value)} placeholder="comfirm password " required="" />
                        <div className="icon-w3">
                        <span className="fas fa-unlock-alt" aria-hidden="true"></span>
                        </div>
                    </div>
                    <div className="form-sub-content">
                        <p className="forgot-w3ls"> Forgot Password?<Link to="/forgetpass"> Click here</Link></p>
                        <p className="forgot-w3ls1">Already a Admin? <Link to="/login">login here</Link></p>
                    </div>
                    <div className="submit-button text-center">
                        <button onClick={registeruser} className="btn btn-style btn-primary">Create Admin</button>
                    </div>
            </div>
        </div>
    </section>
	<div className="gap"></div>
 

        </>
    )
}
export default CreateAdmin;