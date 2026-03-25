import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import MyContext from "../MyContext";

export const ProductDetails = () => {
  const [proddata, setproddata] = useState([]);
  const [avalstock,] = useState([]);
  const [remamt, setremamt] = useState();
  const [qyt, setqyt] = useState(1);
  const [stock, setstock] = useState();
  const{user}=useContext(MyContext);
  const { prodid } = useParams();
  var mynavigate=useNavigate();

  useEffect(() => {
    fetch(`http://localhost:9000/api/getprodbyproid/${prodid}`).then((resp) => {
      if (resp.ok) {
        resp.json().then((result) => {
          if (result.statuscode === -1) {
            toast.error("Error occured please try again");
          } else if (result.statuscode === 0) {
            toast.error("No Data Found");
          } else {
              setproddata(result.proddata[0]);
              setstock(result.proddata[0].stock)
          }
        });
      }
    });
    
    window.scrollTo(0,0)
  }, [prodid]);

  useEffect(() => {
    setremamt(Number(proddata.rate) - Number((proddata.discount * proddata.rate) / 100));
}, [proddata.rate, proddata.discount])

  useEffect(()=>
  {
    if(stock>10)
    {
        for (var i = 1; i <= 10; i++) {
            avalstock.push(i);
        }
    }
    else
    {
        for (var j = 1; j <= stock; j++) {
            avalstock.push(j);
        }
    }
  },[stock,avalstock])

var addprodtocart=async()=>
{
  var totalcost = remamt*qyt;
  var cartdata={prodid,prodname:proddata.productname,rate:remamt,qyt,totalcost,picname:proddata.productpic,username:user.username};
  
  try {
      const resp = await fetch("http://localhost:9000/api/addtocart",
          {
              method: "post",
              body: JSON.stringify(cartdata),
              headers:
              {
                  'Content-type': 'application/json; charset=UTF-8',
              }
          })
      if (resp.ok) 
      {
          var result = await resp.json();
          if (result.statuscode === 1) 
          {
              mynavigate("/cart")
          }
          else {
              toast.error("Error while adding to cart");
          }
      }
  }
  catch (err) {
      toast.error(err);
  }
}

  var addtocart=()=>
    {
        if(user)
        {
            fetch(`http://localhost:9000/api/searchcart?user=${user.username}&prodid=${prodid}`).then(resp=>
            {
              if(resp.ok)
              {
                resp.json().then(result=>
                  {
                    if(result.statuscode===-1)
                    {
                      toast.error("error occured")
                    }
                    else if(result.statuscode===0)
                    {
                      addprodtocart();
                    }
                    else if(result.statuscode===1)
                    {
                      fetch(`http://localhost:9000/api/pluscart`,{
                        method:"put",
                        body:JSON.stringify({pid:result.searchdata[0]._id,qty:result.searchdata[0].Qty,tcost:result.searchdata[0].TotalCost,rate:result.searchdata[0].Rate,Qyt:qyt}),
                        headers:{'Content-type':'application/json;charset=utf-8'}
                    }).then(resp=>
                        {
                            if(resp.ok)
                            {
                                resp.json().then(result=>
                                    {
                                      if(result.statuscode===1)
                                      {
                                            mynavigate("/cart")
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
                    else
                    {
                        toast.error("Error occured while updating, please try again")
                    }
                      })
                    }

                  })
              }
        else
        {
            mynavigate(`/login?pid=${prodid}`);
        }
    }

  return (
    <div>
      <section className="gap"></section>

      <section className="w3l-ecommerce-main">
        <div className="ecom-contenthny w3l-ecommerce-main-inn py-5">
          <div className="container py-lg-5">
            <div className="sp-store-single-page row">
              <div className="col-lg-5 single-right-left">
                <div className="flexslider1">
                  <div className="thumb-image">
                    <img
                      src={`/idata/${proddata.productpic}`}
                      data-imagezoom="true"
                      className="img-fluid radius-image"
                      alt=" "
                    />
                  </div>

                  <div className="clearfix"></div>
                </div>
                
              </div>
              <div className="col-lg-7 single-right-left ps-lg-5">
                <h3>{proddata.productname}</h3>
                <div className="caption">
                  <h6>
                    <span className="item_price">₹{remamt}</span>
                    <del>{proddata.rate}</del> Free Delivery
                  </h6>
                </div>
                <div className="desc_single my-4">
                  <ul className="emi-views">
                    <li>
                      <span>Special Price</span> Get extra {proddata.discount} off (price
                      inclusive of discount)
                    </li>
                    <li>
                      <span>Bank Offer</span> 5% Unlimited Cashback on Flipkart
                      Axis Bank Credit Card
                    </li>
                  </ul>
                </div>
                <div className="desc_single mb-4">
                  <h5>Description:</h5>
                  <p>
                    {proddata.description}
                  </p>
                  {proddata.stock>=1?
                  <p>
                  <h5>Quantity:</h5>
                  <select className="custom-select" onChange={(e)=>setqyt(e.target.value)}>
                    <option value="1">Choose Quantity</option>
                    {avalstock.map((item,i)=>
                        <option key={i}>{item}</option>
                    )}
                  </select></p>:
                  <h6 className="text-danger"><br/>No Stock Available</h6>}
                  </div>
                
                {!user?
                <div className="description mb-4">
                  <h5>
                    Check delivery, payment options and charges at your location
                  </h5>
                  <form action="#" className="d-flex" method="post">
                    <input type="text" placeholder="Enter pincode" required />
                    <button
                      className="submit btn btn-style btn-primary ms-3"
                      type="submit"
                    >
                      Check
                    </button>
                  </form>
                </div>:null}
                <div className="eco-buttons mt-5 d-flex">
                  <div className="shopv single-item">
                    
                      <button
                        onClick={addtocart}
                        className="shopv-cart pshopv-cart add-to-cart btn btn-style btn-primary"
                      >
                        Add to Cart
                      </button>
                    
                  </div>
                  <div className="buyhny-now">
                    <a href="#buy" className="btn btn-style btn-primary">
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
