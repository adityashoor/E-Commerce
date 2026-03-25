import API_URL from "../apiConfig";
import React, {useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export const Ordersumary = () => {

    const [orderdata,setorderdata]=useState({});
    const [cartitems,setcartitems]=useState([]);
    const[msg,setmsg]=useState("");
    useEffect(()=>
    {
        fetchorder();
        window.scrollTo(0,0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    var fetchorder=()=>
    {
        var userdata = JSON.parse(sessionStorage.getItem("user"));
        if(!userdata) return;
        fetch(`${API_URL}/api/getorder?username=${userdata.username}`).then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(res=>
                {
                    setorderdata(res.orderdata[0]);
                    fetchcart();
                })
            }
        }).catch(()=> toast.error("Network error, please try again"))
    }
    var fetchcart = () =>
    {
        var userdata = JSON.parse(sessionStorage.getItem("user"));
        if(!userdata) return;
        setcartitems([]);
        fetch(`${API_URL}/api/fetchcart/${userdata.username}`).then(resp => {
            if (resp.ok) {
                resp.json().then(res => {
                    setcartitems(res.cartdata);
                })
            }
        }).catch(()=> toast.error("Network error, please try again"))
    }

    var createorderitems=async()=>
    {
        if(!orderdata._id || cartitems.length === 0) return;
        const orderitems = cartitems.map(item => ({
            orderid: orderdata._id,
            prodid: item.ProdID,
            prodname: item.ProdName,
            prodrate: item.Rate,
            Qty: item.Qty,
            totalcost: item.TotalCost,
            prodpic: item.Picture,
            username: item.Username
        }));
        if (orderitems.length !== 0) 
        {
            try {
            const resp = await fetch(`${API_URL}/api/orderitems`,
                {
                    method: "post",
                    body: JSON.stringify(orderitems),
                    headers:
                    {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                })
                if (resp.ok) 
                {
                    var result = await resp.json();
                    if (result.statuscode === 1) 
                    {
                        updatestockdb();
                    }
                    else {
                        toast.error("Error ");
                    }
                }
            }
            catch (err) {
                toast.error(err);
            }
        }
    }

useEffect(()=>
{
    createorderitems();
// eslint-disable-next-line react-hooks/exhaustive-deps
},[cartitems])

var updatestockdb=async()=>
    {
    const updatestock = cartitems.map(item => ({ pid: item.ProdID, qty: item.Qty }));
    try {
        const resp = await fetch(`${API_URL}/api/updatestock`,
            {
                method: "put",
                body: JSON.stringify(updatestock),
                headers:
                {
                    'Content-type': 'application/json; charset=utf-8',
                }
            })
        if (resp.ok) 
        {
            var result = await resp.json();
            if (result.statuscode === 1) {
               emptycart();
            }
            else {
                toast.error("Error ");
            }
        }
    }
    catch (err) {
        toast.error(err)
    }
  }

  var emptycart = () => {
    var userdata = JSON.parse(sessionStorage.getItem("user"));
    fetch(`${API_URL}/api/emptycart`, {
        method: "delete",
        body: JSON.stringify({ uname:  userdata.username}),
        headers:
        {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }).then(resp => {
        if (resp.ok) {
            resp.json().then(res => {
                if (res.statuscode === 1) {
                    setmsg("Order Confirmed Successfully")
                }
                else {
                    toast.error("Error Occured")
                }
            })
        }
    }).catch(()=> toast.error("Network error, please try again"))
}

  return (

    <div>
       <section className="w3mid-gap"></section>
       
       <h4 className='font-weight-bold text-center border border-danger'>Order ID  :-  <span className='text-danger'> {orderdata._id} </span></h4><br/><br/>
       <div className='body1'>
                    <div className="text-container">
                        <h6>{msg}</h6>
                    </div>
                    </div>

        <section className="w3mid-gap"></section>
    </div>
  )
}
