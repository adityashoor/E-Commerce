import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import MyContext from '../MyContext';
import { Link, useNavigate } from 'react-router-dom';

export const Cart = () => {

    const[msg,setmsg]=useState();
    const[table,settable]=useState(false);
    const[cartdata,setcartdata]=useState([]);
    const[gtotal,setgtotal]=useState(0);
    const {user,setcartlen}=useContext(MyContext);
    var mynavigate = useNavigate();

    useEffect(()=>
    {
        if(!user)
        {
            setmsg("Please Login To Access Your Cart")
            settable(false);
        }
        else
        {
            fetchcart();
        }
        window.scrollTo(0,0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])

    var fetchcart=()=>
    {
            fetch(`http://localhost:9000/api/getcart?username=${user.username}`).then((resp)=>
            {
                if(resp.ok)
                {
                    resp.json().then((result)=>
                    {
                        if(result.statuscode===-1)
                        {
                            toast.error("Error Occured ,Please Try Again");
                        }
                        else if(result.statuscode===0)
                        {
                            setmsg("Your ShoppyCart Cart is empty");
                            settable(false);
                        }
                        else if(result.statuscode===1)
                        {
                            setcartdata(result.cartdata);
                            setcartlen(result.cartdata.length);
                            settable(true);
                        }
                    })
                }
            })
    }

    var onplus=(data)=>
    {
        if(data.Qty>9)
        {
            toast.info("Quantity cannot exceed more than 10")
        }
        else
        {
            fetch(`http://localhost:9000/api/pluscart`,{
            method:"put",
            body:JSON.stringify({pid:data._id,qty:data.Qty,tcost:data.TotalCost,rate:data.Rate}),
            headers:{'Content-type':'application/json;charset=utf-8'}
            }).then(resp=>
            {
                if(resp.ok)
                {
                    resp.json().then(result=>
                        {
                        if(result.statuscode===1)
                        {
                            fetchcart();
                        }
                        else if(result.statuscode===0)
                        {
                            toast.error("Error occured while updating, Please try again")
                        }
                        })
                }
                else
                {
                    toast.error("Error occured while updating, please try again")
                }
            })
    }
    }
    var onminus=(data)=>
    {
        fetch(`http://localhost:9000/api/minuscart`,{
        
        method:"put",
        body:JSON.stringify({pid:data._id,qty:data.Qty,tcost:data.TotalCost,rate:data.Rate}),
        headers:{'Content-type':'application/json;charset=utf-8'}
    }).then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(result=>
                    {
                       if(result.statuscode===1)
                       {
                            fetchcart();
                       }
                       else if(result.statuscode===0)
                       {
                            toast.error("Error occured while updating, Please try again");
                       }
                    })
            }
            else
            {
                toast.error("Error occured while updating, please try again")
            }
        })
    }

    var delcart=(cartid)=>
    {
        fetch(`http://localhost:9000/api/delcart`,{
        
        method:"delete",
        body:JSON.stringify({cid:cartid}),
        headers:{'Content-type':'application/json;charset=utf-8'}
    }).then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(result=>
                    {
                       if(result.statuscode===1)
                       {
                            fetchcart();
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

    useEffect(()=>
    {
            var tcost=0;
            for(var i=0;i<cartdata.length;i++)
            {
                tcost=tcost+cartdata[i].TotalCost;
            }
            setgtotal(tcost);
        
    },[cartdata])

    var oncheckout=()=>
    {
        sessionStorage.setItem('gtot',gtotal);
        mynavigate("/checkout");
    }

  return (
    <div>
        <section className="w3mid-gap"></section>
    <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
            <div className="container">
                <div className="w3breadcrumb-gids">
                    <div className="w3breadcrumb-left text-left">
                        <h2 className="inner-w3-title">
                            Cart </h2>
                    </div>
                    <div className="w3breadcrumb-right">
                        <ul className="breadcrumbs-custom-path">
                            <li><Link to="/homepage">Home</Link></li>
                            <li className="active"><span className="fas fa-angle-double-right mx-2"></span> Cart </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <section className="w3l-ecommerce-main">
        <div className="ecom-contenthny py-5">
            <div className="container py-lg-5">
                {table===true?<><div className="ecom-contenthny-w3lcheckout privacy">
                    <h3>Chec<span>kout</span></h3>
                    
                    <div className="checkout-right">
                        <p className="mb-5">Your shopping cart contains: <span> {cartdata.length } Products</span></p>
                        <table className="timetable_sub">
                            <thead>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Product</th>
                                    <th>Quality</th>
                                    <th>Product Name</th>

                                    <th>Price</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartdata.map((data,i)=>

                                <tr key={i}>
                                    <td className="invert">{i+1}</td>
                                    <td className="invert-image"><a href="product-single.html">
                                            <img src={`/idata/${data.Picture}`} className="radius-image cardimg" alt="prodpic"/></a></td>
                                    <td className="invert">
                                        <div className="quantity">
                                            <div className="quantity-select">
                                                <button onClick={()=>onminus(data)} className="entry value-minus buttonx">&nbsp;</button>
                                                <div className="entry value"><span>{data.Qty>0? data.Qty:delcart(data._id)}</span></div>
                                                <button onClick={()=>onplus(data)} className="entry value-plus buttonx">&nbsp;</button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="invert">{data.ProdName}</td>

                                    <td className="invert">₹{Math.floor(data.TotalCost)}</td>
                                    <td className="invert">
                                        <div className="rem">
                                            <button className="close1 buttonx me-lg-3" onClick={()=>delcart(data._id)}><i className="far fa-window-close"></i> </button> 
                                        </div>

                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                    <div className="row checkout-left mt-5">
                        <div className="col-md-8 checkout-left-basket ms-auto ps-lg-5">
                            <h4>Continue to basket</h4>
                           <ul>
                            {cartdata.map((data,i)=>
                                <li key={i}>{data.ProdName} <i>-</i> <span>₹{data.TotalCost} </span></li>
                            )}
                                <li>Total Service Charges <i>-</i> <span>₹10.00</span></li>
                                <li className='checkout-left-basketmain'>Total <i>-</i> <span>₹{gtotal+10}</span></li>
                            </ul>
                            <div className='ms-auto col-lg-2'>
                                <button className='btn btn-primary btn-style' onClick={oncheckout}>Checkout</button>
                            </div>
                        </div>
                    </div>
                </div></>:<div className='body1'>
                    <div className="text-container">
                        <h6>{msg}</h6>
                    </div>
                    </div>}
            </div>
        </div>
    </section>
    </div>
  )
}
