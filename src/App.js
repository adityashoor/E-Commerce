import Footer from "./components/Footer";
import Header from "./components/Header";
import Siteroutes from "./components/Siteroutes";
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from "react";
import MyContext from "./MyContext";
import AdminHeader from "./components/Adminheader";
import Cookies from "universal-cookie";
import { NoInternet } from "./components/nointernet";

var App=()=>{

  const [user,setuser]=useState(null);
  const [cartlen,setcartlen]=useState(0);
  const [utype,setutype]=useState("guest");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const cookies = new Cookies();

  useEffect(()=>
  {
    var storeduser=sessionStorage.getItem('user');
    if(storeduser)
    {
      setuser(JSON.parse(storeduser));
    }
  },[])

useEffect(()=>
{
  var remember=cookies.get("rememberMe");
  if(remember)
  {
    setuser(remember)
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])

  useEffect(()=>
  {
    if(user)
    {
      if(user.usertype==="admin")
      {
        setutype("admin");
      }
      else if(user.usertype==="normal")
      {
        setutype("normal");
      }
    }
    else
    {
      setutype("guest");
    }
  },[user])

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);

  return (
    <>
    {isOnline ?  
    <MyContext.Provider value={{user,setuser,cartlen,setcartlen}}>
      {utype==="admin"?<AdminHeader/>:<Header/>}
      <ToastContainer theme="colored"/>
      <Siteroutes/>
      <Footer/>
      </MyContext.Provider>: <NoInternet/>}
    </>
  );
}

export default App;
