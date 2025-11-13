import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Weather = () => {

    const[wrecord,setwrecord]=useState({}); 
    const[city,setcity]=useState("jalandhar");
    
    useEffect(()=>
    {
      window.scrollTo(0,0)
    },[])
    var fetchweather=()=>
    {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c581a0b4fd457929e2bc30f431a95c12&units=metric`).then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(result=>
                    {
                        setwrecord(result);
                    })
            }
            else
            {
               toast.error("Error Occured while fetching weather")
            }
        })
    };


  return (
    <div>
      <section className="w3mid-gap"></section>
    <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
            <div className="container">
                <div className="w3breadcrumb-gids">
                    <div className="w3breadcrumb-left text-left">
                        <h2 className="inner-w3-title">
                            Weather </h2>
                    </div>
                    <div className="w3breadcrumb-right">
                        <ul className="breadcrumbs-custom-path">
                            <li><Link to="/homepage">Home</Link></li>
                            <li className="active"><span className="fas fa-angle-double-right mx-2"></span> Weather </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>

        <div className="App trackbody">
    <header className="d-flex justify-content-center align-items-center">
      <h2> Weather </h2>
    </header>
    <div className="container">
      <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
        <div className="col-auto">
          <label for="location-name" className="col-form-label">
            Enter Location :
          </label>
        </div>
        <div className="col-auto">
          <input
            type="text"
            id="location-name"
            className="form-control"
            onChange={(e)=>setcity(e.target.value)}
            value={city}
          />
        </div>
        <button className="btn btn-primary mt-2" onClick={fetchweather}>
          Search
        </button>
      </div>
<br/>
        {wrecord.main ? <section className="">
  <div className="container">

    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-md-8 col-lg-6 col-xl-4 me-4">

        <div className="card color3">
          <div className="card-body p-4">

            <div className="d-flex">
              <h6 className="flex-grow-1">{wrecord.name}</h6>
              <h6>{new Date().getHours()}:{new Date().getMinutes()}</h6>
            </div>

            <div className="d-flex flex-column text-center mt-5 mb-4">
              <h6 className="display-4 mb-0 font-weight-bold color2"> {wrecord.main.temp}<span>&deg;</span></h6>
              <span className="small color1">{wrecord.weather[0].main}</span>
            </div>

            <div className="d-flex align-items-center">
              <div className="flex-grow-1 h6">
                <div><i className="fas fa-wind fa-fw color1"></i> <span className="ms-1"> {wrecord.wind.speed}km/h
                  </span></div>
                <div><i className="fas fa-tint fa-fw color1"></i> <span className="ms-1">{wrecord.main.humidity}% </span>
                </div>
                <div><i className="fas fa-sun fa-fw color1"></i> <span className="ms-1"> 0.2h </span>
                </div>
              </div>
              <div>
                <img src={`http://openweathermap.org/img/w/${wrecord.weather[0].icon}.png`} alt="icon" width="100px"/>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

  </div>
</section>: null}

      </div>
    </div>
    <section className="w3mid-gap"></section>
  </div>
  )
}
