import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
export const AdminPanel = () => {

    const[listdata,setlistdata]=useState([]); 
    const[checkoutdata,setcheckoutdata]=useState([]); 
    const[profits,setprofits]=useState(0);

    useEffect(()=>
    {
        fetchall();
        fetchallorder();
        window.scrollTo(0,0);
    },[])
    
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
    var fetchallorder=()=>
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
    };

    useEffect(()=>
    {      
        var profit=0;
        for(var x=0;x<checkoutdata.length;x++)
        {   
             profit=profit+Number(checkoutdata[x].billamt);
        };
        setprofits(Math.round(profit));
        
    },[checkoutdata])

  return (
        <>
        <section className="w3mid-gap mb-lg-5"></section>

            <div className="row ms-lg-5 mx-lg-0 mx-5">
        <h1>welcome to admin panel</h1><br/><br/><br/><br/>
	<div className="col-xs-2 col-md-2">
		<Link className="info-tile tile-indigo" to="/members">
			<div className="tile-heading">
				<div className="pull-left">Members</div>
                <div className="pull-right">+52.5%</div>
			</div>
			<div className="tile-body">
				<div className="pull-left"><i className="fa-solid fa-user-group"></i></div>
				<div className="pull-right">{listdata.length}</div>
			</div>
		</Link>
	</div>
	<div className="col-xs-2 col-md-2">
		<Link className="info-tile tile-green" to="/vieworders">
			<div className="tile-heading">
				<div className="pull-left">Orders</div>
				<div className="pull-right">+5.5%</div>
			</div>
			<div className="tile-body">
				<div className="pull-left"><i className="fa-solid fa-cart-shopping"></i></div>
				<div className="pull-right">{checkoutdata.length}</div>
			</div>
		</Link>
	</div>
	<div className="col-xs-2 col-md-2">
		<Link className="info-tile tile-magenta" to="/adminpanel">
			<div className="tile-heading">
				<div className="pull-left">Profit</div>
				<div className="pull-right">+14.9%</div>
			</div>
			<div className="tile-body">
				<div className="pull-left"><i className="fa-solid fa-sack-dollar"></i></div>
				<div className="pull-right">₹{profits}</div>
			</div>
		</Link>
	</div>
	</div>
            <section className="w3mid-gap mb-lg-5"></section>
        </>
    )
}
