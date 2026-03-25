import React, { useContext, useEffect } from 'react'
import MyContext from '../MyContext'
import { useNavigate } from 'react-router-dom';

export const Usershield = (props) => {

    const {user}=useContext(MyContext);
    const mynavigate=useNavigate();

    useEffect(()=>
    {
        if(!user)
        {
            mynavigate("/login")
        }
        window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])
  return (
    <>
        <props.Mycomp2/>
    </>
  )
}
