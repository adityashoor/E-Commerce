import React, { useEffect } from 'react'

export const NoInternet = () => {
    useEffect(()=>
    {
        window.scrollTo(0, 0);
    },[])
  return (
    <div className="pt-4">
        <div className="astrobody">
        <div className="text">
        <div>ERROR</div>
        <h1 className="text-danger">Offline!</h1>
        <hr/>
        <div className=''>No Internet Connection</div>
        <hr/>
        <div>
            <ul class="list-group">
                <li class="list-group-item bg-dark text-success">Try :</li>
                <li class="list-group-item bg-dark text-light">Checking the network cables, modem, and router</li>
                <li class="list-group-item bg-dark text-light">Reconnecting to Wi-Fi</li>
            </ul><br/>
            ERR_INTERNET_DISCONNECTED
        </div>
        </div>

        <div className="astronaut">
        <img src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png" alt="astronaut" className="src"/>
        </div>
        </div>
        </div>
  )
}
