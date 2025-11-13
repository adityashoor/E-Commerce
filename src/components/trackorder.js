import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import MyContext from '../MyContext';

export const Trackorder = () => {

    const[orderdata,setorderdata]=useState([]); 
    const[msg,setmsg]=useState(); 
    const[table,settable]=useState(false); 
    const {user}=useContext(MyContext);
   
    useEffect(()=>
    {
        if(!user)
        {
            setmsg("Please Login To Track Your Orders")
            settable(false);
        }
        else
        {
            fetchallorder();
        }
        window.scrollTo(0,0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])


    var fetchallorder=()=>
    {
        fetch(`http://localhost:9000/api/fetchorderbyusername?username=${user.username}`).then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(result=>
                    {
                        if(result.statuscode===-1)
                        {
                            toast.error("Error Occured")
                        }
                        else if(result.statuscode===0)
                        {
                            setmsg("No Orders To Track");
                            settable(false)
                        }
                        else if(result.statuscode===1)
                        {
                            setorderdata(result.orderdata);
                            settable(true);
                        }
                       
                    })
            }
            else
            {
               toast.error("Error Occured")
            }
        })
    }

  return (
    <>
    <section className="w3mid-gap"></section>
    <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
            <div className="container">
                <div className="w3breadcrumb-gids">
                    <div className="w3breadcrumb-left text-left">
                        <h2 className="inner-w3-title">
                            Track Orders </h2>
                    </div>
                    <div className="w3breadcrumb-right">
                        <ul className="breadcrumbs-custom-path">
                            <li><Link to="/homepage">Home</Link></li>
                            <li className="active"><span className="fas fa-angle-double-right mx-2"></span> Track Orders </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <section className="trackbody"></section>
{table===true?<>
    <div className='trackbody'>
        <div className="container-fluid d-sm-flex row">
            
            {orderdata.map((data,i)=>

            <div key={i} className="card px-2 mt-lg-5 mt-4 ms-sm-2 col-lg-3 col-10">
                    <div className="card-header bg-white">
                    <div className="row justify-content-between">
                        <div className="col">
                            <p className="text-muted"> Order ID  :<span className="font-weight-bold text-dark">{data.orderid}</span></p> 
                            <p className="text-muted"> Bill Amount <span className="font-weight-bold text-dark"></span>₹{data.totalcost}</p></div>
                    </div>
                    </div>
                    <div className="card-body">
                        <div className="media flex-column flex-sm-row">
                            <div className="media-body ">
                                <h5 className="bold">{data.prodname}</h5>
                                <p className="text-muted"> Quantity : {data.Qty}</p>
                                <h4 className="mt-3 mb-4 bold"> <span className="mt-5">&#x20B9;</span> {data.prodrate} <span className="small text-muted"> via (cod) </span></h4>
                                <p className="text-muted">Tracking Status on: <span className="Today">11:30pm, Today</span></p>
                                <Link className="btn  btn-outline-primary d-flex" to="/contact">Contact Us</Link>    
                            </div><Link to={`/productdetails/${data.prodid}`}><img className="align-self-center img-fluid" src={`/idata/${data.prodpic}`} width="180 " alt="prodpic" height="180"/></Link>
                        </div>
                    </div>
                    <div className="row px-3">
                        <div className="col">
                            <ul id="progressbar" >
                                <li className="step0 active " id="step1">PLACED</li>
                                <li className="step0 active text-center" id="step2">SHIPPED</li>
                                <li className="step0  text-muted text-end" id="step3">DELIVERED</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

    </div>
    </div></>:<body className='body1'>
            <div className="text-container">
                <h6>{msg}</h6>
            </div>
            </body>}
            <section className="w3mid-gap trackbody"></section>
    
    </>
  )
}
