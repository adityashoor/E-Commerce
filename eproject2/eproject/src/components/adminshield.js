import React, { useContext, useEffect } from 'react'
import MyContext from '../MyContext'
import { useNavigate } from 'react-router-dom';

export const Adminshield = (props) => {

    const {user}=useContext(MyContext);
    const mynavigate=useNavigate();

    useEffect(()=>
    {
        if(!user)
        {
            mynavigate("/login")
        }
        else if(user.usertype !== "admin")
        {
            mynavigate("/login")
        }
        window.scrollTo(0, 0);
    },[user, mynavigate])
  return (
    <>
        <props.Mycomp/>
    </>
  )
}
