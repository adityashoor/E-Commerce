import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ShowCategory = () => {

    const[allcat,setallcat]=useState([]);

    useEffect(()=>
    {
        fetchallcat();
        window.scrollTo(0,0)
    },[])

    var fetchallcat=()=>
    {
      fetch("http://localhost:9000/api/getcategory").then(resp=>
      {
        if(resp.ok)
        {
          resp.json().then(result=>
            {
              if(result.statuscode===0)
              {
                toast.error("No Categories Added");
              }
              else if(result.statuscode===1)
              {
                setallcat(result.catdata);
              }
              else
              {
                toast.error("error occured, please try again")
              }
            })
        }
        else
        {
          toast.error("error occured, please try again")
        }
      })
    }

  return (
    <>
    
    <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
          <div className="container">
            <div className="w3breadcrumb-gids">
              <div className="w3breadcrumb-left text-left">
                <h2 className="inner-w3-title">Categories</h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/homepage">Home</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span>Categories
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

    <div className='gap'></div>
    <div className="ecom-contenthny py-5">
            <div className="container py-lg-5">
                <h3 className="title-w3l">Categories</h3>
                <p className="">Handpicked Favourites just for you</p>
        <div className="cards mt-lg-5">
        {allcat.map((data,i)=>
             <div key={i} className="mt-4"><Link to={`/showsubcategory/${data._id}`}>
              <div className="card" style={{width:"12rem"}}>
                <img src={`/idata/${data.catpic}`} alt="catpic"/>
                <div className="card-body">
                  <h5 className="card-title text-center">{data.catname}</h5>
                </div>
              </div></Link></div>
        )}
        </div>
        </div>
        </div>

    </>
  )
}
