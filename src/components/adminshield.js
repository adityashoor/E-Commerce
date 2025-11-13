import React, { useContext, useEffect } from 'react'
import MyContext from '../MyContext'
import { useNavigate } from 'react-router-dom';

export const Adminshield = (props) => {

    const {user}=useContext(MyContext);
    const mynavigate=useNavigate();

    useEffect(()=>
    {
        if(user)
        {
        if(!user)
        {
            mynavigate("/login")
        }
        else
        {
            // eslint-disable-next-line eqeqeq
            if(user.usertype!="admin")
            {
                mynavigate("/login")
            }
        }
    }
    else
    {
        mynavigate("/login")
    }
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])
  return (
    <>
        <props.Mycomp/>
    </>
  )
}
