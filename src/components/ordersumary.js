import React, {useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export const Ordersumary = () => {

    const [orderdata,setorderdata]=useState({});
    const [cartitems,setcartitems]=useState([]);
    const[msg,setmsg]=useState("");
    const orderitems = [];
    const updatestock = [];
    useEffect(()=>
    {
        fetchorder();
        window.scrollTo(0,0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    var fetchorder=()=>
    {
        var userdata = JSON.parse(sessionStorage.getItem("user"));
        fetch(`http://localhost:9000/api/getorder?username=${userdata.username}`).then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(res=>
                {
                    setorderdata(res.orderdata[0]);
                    fetchcart();
                })
            }
        })
    }
    var fetchcart = () => 
    {
        var userdata = JSON.parse(sessionStorage.getItem("user"));
        setcartitems([]);
        fetch(`http://localhost:9000/api/fetchcart/${userdata.username}`).then(resp => {
            if (resp.ok) {
                resp.json().then(res => {
                    setcartitems(res.cartdata);
                })
            }
        })
    }

    var createorderitems=async()=>
    {
        for(var i=0;i<cartitems.length;i++)
        {
            var myorderitems={orderid:orderdata._id,prodid:cartitems[i].ProdID,prodname:cartitems[i].ProdName,prodrate:cartitems[i].Rate,Qty:cartitems[i].Qty,totalcost:cartitems[i].TotalCost,prodpic:cartitems[i].Picture,username:cartitems[i].Username};
            orderitems.push(myorderitems)
        }
        if (orderitems.length !== 0) 
        {
            try {
            const resp = await fetch("http://localhost:9000/api/orderitems",
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
    for(let x=0;x<cartitems.length;x++)
    {
      let updatedata={pid:cartitems[x].ProdID,qty:cartitems[x].Qty}
      updatestock.push(updatedata);
    }
    try {
        const resp = await fetch("http://localhost:9000/api/updatestock",
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
    fetch("http://localhost:9000/api/emptycart", {
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
                    setmsg("Order Comfirmed Successfully")
                }
                else {
                    toast.error("Error Occured")
                }
            })
        }
    })
}

  return (

    <div>
       <section className="w3mid-gap"></section>
       
       <h4 className='font-weight-bold text-center border border-danger'>Order ID  :-  <span className='text-danger'> {orderdata._id} </span></h4><br/><br/>
       <body className='body1'>
                    <div className="text-container">
                        <h6>{msg}</h6>
                    </div>
                    </body>

        <section className="w3mid-gap"></section>
    </div>
  )
}
