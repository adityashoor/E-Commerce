import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

var Updatestatus = () => {
    const [newstatus, setnewstatus] = useState("");
    const [myparams] = useSearchParams();
    const orderid = myparams.get("oid");
    const currstatus = myparams.get("currst");
    var mynavigate=useNavigate();

    useEffect(()=>
  {
      window.scrollTo(0, 0);
  },[])

	var onupdate=()=> 
    {
        var updatedata = {ordid:orderid,newst:newstatus}
        fetch("http://localhost:9000/api/updatestatus",
			{
				method: "put",
				body: JSON.stringify(updatedata),
                headers:
                {
                    'Content-type': 'application/json; charset=UTF-8',
                }
			}).then(resp => {
				if(resp.ok)
                {
                    resp.json().then(result=>
                        {
                            toast.info(result.msg);
                            mynavigate("/vieworders")
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
                <h2 className="inner-w3-title">Update Order Status </h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/adminpane">Admin Panel </Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span> Update Order Status
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="gap"></div>

      <section className="w3l-forml-main py-5">
        <div className="form-hnyv-sec py-sm-5 py-3">
          <div className="form-wrapv">
            <h2>Update Order Status</h2>
            <h5>Current Status:- <span className="text-success">{currstatus}</span></h5><br/>

                <select name="newstatus" className="form-control" onChange={(e)=>setnewstatus(e.target.value)}>
                    <option value="">Choose New Status</option>
                    <option>Ordered</option>
                    <option>Shipped</option>
                    <option>Out For Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                    <option>Returned</option>
                </select><br/>
                <button className="btn btn-primary btn-style" onClick={onupdate}>Update</button>
            </div>
            </div>
      </section>
      <div className="gap"></div>
    </>
  );
};
export default Updatestatus;
