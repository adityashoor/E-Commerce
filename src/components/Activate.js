import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';

export const Activate = () => {

    const[msg,setmsg]=useState();
    const[searchparams]=useSearchParams();
    var [token]=useState(searchparams.get('token'))
    useEffect(()=>
    {
        fetch(`http://localhost:9000/api/activateaccount?token=${token}`).then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(result=>
                    {
                        setmsg(result.msg);
                    })
            }
            else
            {
                toast.error("Error Occured")
            }
        })
    },[token])

  return (
    <div>
        
        <section className="w3mid-gap"></section>
    <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
            <div className="container">
                <div className="w3breadcrumb-gids">
                    <div className="w3breadcrumb-left text-left">
                        <h2 className="inner-w3-title">
                            Activation </h2>
                    </div>
                    <div className="w3breadcrumb-right">
                        <ul className="breadcrumbs-custom-path">
                            <li><Link to="/login">Login</Link></li>
                            <li className="active"><span className="fas fa-angle-double-right mx-2"></span> Activation </li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    </div>
	<div className="gap mt-lg-5"></div>
    
        <h1 className='text-center'>Activate</h1><br/>
        <h2 className='text-center text-danger'>{msg}</h2>

        <div className="gap mb-lg-5"></div>
    </div>
  )
}
