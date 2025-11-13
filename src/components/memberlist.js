import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

var Memberlist=()=>
{
    const[listdata,setlistdata]=useState([]); 
    const[msg,setmsg]=useState(); 
    var delids=[];
   
    useEffect(()=>
    {
        fetchall();
        window.scrollTo(0,0)
    },[])

    var deluser=()=>
    {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("do you want to delete user data")===true)
        {
            fetch("http://localhost:9000/api/delmemb",
                    {
                        method:"delete",
                        body:JSON.stringify({uid:delids}),
                        headers:{'Content-type':'application/json;charset=utf-8'}
                    }).then(resp=>
                        {
                            if(resp.ok)
                            {
                                resp.json().then(result=>
                                    {
                                       if(result.statuscode===1)
                                       {
                                        toast.success("members deleted successfully");
                                        fetchall();
                                       }
                                       else if(result.statuscode===0)
                                       {
                                        toast.error("Error occured while deleting, Please try again")
                                       }
                                    })
                            }
                            else
                            {
                                toast.error("Error occured while deleting, please try again")
                            }
                        })
        }
        else
        {
            setmsg("deletion cancelled")
        }
    }
   
    var handlechange=(e)=>
    {
        if(e.target.checked)
        {
            delids.push(e.target.value)
        }
        else
        {
            var itmidx=delids.indexOf(e.target.value);
            delids.splice(itmidx,1)
        }
    }

   var fetchall=()=>
    {
        fetch("http://localhost:9000/api/userlist").then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(result=>
                    {
                       setlistdata(result.userdata);
                    })
            }
            else
            {
                toast.error("Error Occured")
            }
        })
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
                            Members </h2>
                    </div>
                    <div className="w3breadcrumb-right">
                        <ul className="breadcrumbs-custom-path">
                            <li><Link to="/homepage">Home</Link></li>
                            <li className="active"><span className="fas fa-angle-double-right mx-2"></span> Members </li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    </div>
	<div className="gap">
</div>
        <div className="container py-5">
            <h1 className="text-danger text-center my-5">list of our members</h1>
            <h3 className="text-center">Members Count :- {listdata.length}</h3><br/>
            {listdata?<div>
            <table cellPadding="25px">
                <tbody>
                    <tr>
                    <th></th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    </tr>
                    {
                        listdata.map((data,i)=>
                        <tr key={i}>
                            <td><input type="checkbox" value={data._id} onChange={handlechange}/></td>
                            <td>{data.username}</td>
                            <td>{data.email}</td>
                            <td>{data.phone}</td>
                        </tr>
                        )
                    }
                </tbody>
            </table><br/><button onClick={deluser} className="btn btn-style btn-primary ms-5">Delete</button></div>:null}
            
           <h4 className="text-center text-danger"> {msg}</h4>
            </div>
        </>
    )
}
export default Memberlist;