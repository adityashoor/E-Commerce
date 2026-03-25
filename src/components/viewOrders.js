import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

var OrderList=()=>
{
    const[checkoutdata,setcheckoutdata]=useState([]); 
   
    useEffect(()=>
    {
        fetchall();
        window.scrollTo(0,0)
    },[])


   var fetchall=()=>
    {
        fetch("http://localhost:9000/api/fetchcheckout").then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(result=>
                    {
                       setcheckoutdata(result.checkoutdata);
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
                            OrderList </h2>
                    </div>
                    <div className="w3breadcrumb-right">
                        <ul className="breadcrumbs-custom-path">
                            <li><Link to="/adminpanel">Admin Panel</Link></li>
                            <li className="active"><span className="fas fa-angle-double-right mx-2"></span> OrderList </li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    </div>
	<div className="gap">
</div>
        <div className="container py-5">
            <h1 className="text-danger text-center my-5">list of our Orders</h1>
            <h3>Orders Count :- {checkoutdata.length}</h3><br/>
            {checkoutdata?<div>
            <table cellPadding="13px">
                <tbody>
                    <tr>
                    <th>Order ID</th>
                    <th>UserName</th>
                    <th>City</th>
                    <th>Address</th>
                    <th>Order Amount</th>
                    <th>Payment Mode</th>
                    <th>Order Date</th>
                    <th>Status</th>
                    <th>Update</th>
                    </tr>
                    {
                        checkoutdata.map((data,i)=>
                        <tr key={i}>
                            <td className="text-primary">{data._id}</td>
                            <td>{data.username}</td>
                            <td>{data.city}</td>
                            <td>{data.address}</td>
                            <td className="text-danger">{data.billamt}</td>
                            <td>{data.paymode}</td>
                            <td>{data.orderdate}</td>
                            <td className="text-success">{data.status}</td>
                            <td><Link className="btn btn-primary" to={`/updatestatus?oid=${data._id}&currst=${data.status}`}>Update</Link></td>
                        </tr>
                        )
                    }
                </tbody>
            </table></div>:null}
            </div>
        </>
    )
}
export default OrderList;