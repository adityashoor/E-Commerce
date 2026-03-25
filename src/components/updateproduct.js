import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

var Updateproduct=()=>
{
    const[productname,setproductname]=useState();
    const[rate,setrate]=useState();
    const[discount,setdiscount]=useState();
    const[description,setdescription]=useState();
    const[stock,setstock]=useState();
    const[fprod,setfprod]=useState();
    const[allcat,setallcat]=useState([]);
    const[allsubcat,setallsubcat]=useState([]);
    const[proddata,setproddata]=useState([]);
    const[cat,setcat]=useState("");
    const[subcat,setsubcat]=useState();
    const[pic, setpic] = useState("");
    const[prodpic, setprodpic] = useState();
    const{pid}=useParams();
    var mynavigate=useNavigate();

    useEffect(()=>
    {
        fetchallcat();
        window.scrollTo(0,0)
    },[])

    useEffect(()=>
    {
      fetch(`http://localhost:9000/api/getprodbyproid/${pid}`).then(resp=>
      {
        if(resp.ok)
        {
          resp.json().then(result=>
            {
              if(result.statuscode===-1)
              {
                  toast.error("Error occured please try again")
              }
              else if(result.statuscode===0)
              {
                toast.error("No Data Found")
              }
              else
              {
                  setproddata(result.proddata[0]);
                  setproductname(result.proddata[0].productname)
                  setrate(result.proddata[0].rate)
                  setdiscount(result.proddata[0].discount)
                  setdescription(result.proddata[0].description)
                  setstock(result.proddata[0].stock)
                  setprodpic(result.proddata[0].prodsetprodpic)
                  setfprod(result.proddata[0].featuredproduct)
                  setprodpic(result.proddata[0].productpic)
                  setcat(result.proddata[0].catid);
                  setsubcat(result.proddata[0].subcatid);
                }
            })
        }
      })
    },[pid])

    useEffect(()=>
    {
       if(cat!=="")
       {
        fetch(`http://localhost:9000/api/getsubcategory?catid=${cat}`).then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(result=>
                    {
                        if(result.statuscode===-1)
                        {
                            toast.error("Error occured please try again")
                        }
                        else if(result.statuscode===0)
                        {
                          toast.error("No Data Found")
                        }
                        else
                        {
                            setallsubcat(result.subcatdata);
                        }
                    })
            }
        })
       }
    },[cat])

    var onpicselect=(event)=>
    {
        setpic(event.target.files[0]);
    }

    var fetchallcat=()=>
    {
        fetch("http://localhost:9000/api/getcategory").then(resp=>
        {
            if(resp.ok)
            {
                resp.json().then(result=>
                    {
                        if(result.statuscode===-1)
                        {
                            toast.error("Error occured please try again")
                        }
                        else if(result.statuscode===0)
                        {
                            toast.error("No Data Found")
                        }
                        else
                        {
                            setallcat(result.catdata);
                        }
                    })
            }
            else
            {
              toast.error("Error occured please try again")
            }
        })
    }

    var onupdate=()=>
    {
        const formdata=new FormData();
        formdata.append('cat',cat);
        formdata.append('subcat',subcat);
        formdata.append('prodname',productname);
        formdata.append('rate',rate);
        formdata.append('discount',discount);
        formdata.append('description',description);
        formdata.append('stock',stock);
        formdata.append('fprod',fprod);
        if(pic!=="")
        {
          formdata.append('prodpic',pic);
        }
        formdata.append('oldpic',prodpic);

        fetch(`http://localhost:9000/api/updateproduct/${pid}`,
        {
            method:"put",
            body:formdata,
        }).then(resp=>
            {
                if(resp.ok)
                {
                    resp.json().then(result=>
                    {    
                    if(result.statuscode===-1)
                    {
                      toast.error("error, please try again")
                    }
                    else if(result.statuscode===0)
                    {
                      toast.error("No Product Updated")
                    }
                    else if(result.statuscode===1)
                    {
                      toast.success("product added successfully");
                      mynavigate("/products");
                    }
                    })  
                }
                else
                {
                  toast.error("Error, please try again")
                }
            })
    }
    return(
        <>
            <section className="w3mid-gap"></section>
      <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
          <div className="container">
            <div className="w3breadcrumb-gids">
              <div className="w3breadcrumb-left text-left">
                <h2 className="inner-w3-title">Update Products </h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/products">Products</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span> Update Products {" "}
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
            <h2>Update Products</h2>

            <div className="form-sub-w3">
                <select className="form-control" onChange={(e)=>setcat(e.target.value)}>
                    <option value="">Choose Category</option>
                    {
                        allcat.map((data,i)=>
                        <option value={data._id} selected={data._id===proddata.catid} key={i}>{data.catname}</option>
                        )
                    }
                </select><br/>
                <select className="form-control" onChange={(e)=>setsubcat(e.target.value)}>
                    <option value="">Choose Sub Category</option>
                    {
                        allsubcat.map((data,i)=>
                        <option value={data._id} selected={data._id===proddata.subcatid} key={i}>{data.subcatname}</option>
                        )
                    }
                </select><br/>

              <input type="text" name="catproduct" value={productname} onChange={(e) => setproductname(e.target.value)} placeholder="Product Name"/>
              <div className="icon-w3">
                <span><i className="fa-brands fa-product-hunt"></i></span>
              </div>
            </div>

            <div className="form-sub-w3">
              <input type="text" name="Rate" value={rate} onChange={(e)=>setrate(e.target.value)} placeholder="Rate"/>
              <div className="icon-w3">
                <span><i className="fa-solid fa-tag"></i></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input type="text" name="discount" value={discount} onChange={(e)=>setdiscount(e.target.value)} placeholder="Discount"/>
              <div className="icon-w3">
                <span><i className="fa-solid fa-percent"></i></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input type="textarea" name="description" value={description} onChange={(e)=>setdescription(e.target.value)} placeholder="Description"/>
              <div className="icon-w3">
                <span><i className="fa-solid fa-note-sticky"></i></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input type="text" name="stock" value={stock} onChange={(e)=>setstock(e.target.value)} placeholder="Stock"/>
              <div className="icon-w3">
                <span><i className="fa-solid fa-box"></i></span>
              </div>
            </div>

            <div className="form-check">
              <p className="fw-100">Is It Featured Product?</p>
             <label><input type="radio" name="featured" value="yes" checked={fprod==="yes"} onChange={(e)=>setfprod(e.target.value)}/>Yes</label>&nbsp;
             <label><input type="radio" name="featured" value="no" checked={fprod==="no"} onChange={(e)=>setfprod(e.target.value)}/>No</label>
            </div>

            <div className="form-sub-w3">
              <input
                type="file"
                name="file"
                onChange={onpicselect}
              />
              <div className="icon-w3">
                <span><i className="fa-solid fa-file"></i></span>
              </div>
            </div>
            <img src={`/idata/${prodpic}`} height="105px" alt="productpic"/>
            <div className="submit-button text-center">
              <button onClick={onupdate} className="btn btn-style btn-primary">
               Update
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="gap"></div>
        </>
    )
}
export default Updateproduct;