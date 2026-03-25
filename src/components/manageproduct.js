import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

var ManageProduct=()=>
{
    const[productname,setproductname]=useState();
    const[rate,setrate]=useState();
    const[discount,setdiscount]=useState();
    const[description,setdescription]=useState();
    const[stock,setstock]=useState();
    const[fprod,setfprod]=useState();
    const[allcat,setallcat]=useState([]);
    const[allsubcat,setallsubcat]=useState([]);
    const[allprod,setallprod]=useState([]);
    const[cat,setcat]=useState("");
    const[subcat,setsubcat]=useState("");
    const [pic, setpic] = useState();

    useEffect(()=>
    {
        fetchallcat();
        window.scrollTo(0,0)
    },[])

    useEffect(()=>
    {
       if(subcat!=="")
       {
        fetch(`http://localhost:9000/api/getproductsbysubcatid?scatid=${subcat}`).then(resp=>
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
                            toast.info("No Data Found")
                        }
                        else
                        {
                            setallprod(result.proddata);
                        }
                    })
            }
        })
       }
    },[subcat])

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
        })
    }

    var onadd=()=>
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
        formdata.append('prodpic',pic);

        fetch("http://localhost:9000/api/saveproduct",
        {
            method:"post",
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
                    else
                    {
                      toast.success("product added successfully")
                    }
                    })  
                }
                else
                {
                  toast.error("Error, please try again")
                }
            })
    }

    var delproduct=(proddata)=>
    {
      // eslint-disable-next-line no-restricted-globals
      if(confirm(`do you want to delete ${proddata.productname} product`)===true)
        {
            fetch("http://localhost:9000/api/delproduct",
                    {
                        method:"delete",
                        body:JSON.stringify({prodid:proddata._id}),
                        headers:{'Content-type':'application/json;charset=utf-8'}
                    }).then(resp=>
                        {
                            if(resp.ok)
                            {
                                resp.json().then(result=>
                                    {
                                       if(result.statuscode===1)
                                       {
                                          toast.success("Product deleted successfully");

                                       }
                                       else if(result.statuscode===0)
                                       {
                                          toast.error("Error Occured while deleting, Please try again")
                                       }
                                       else if(result.statuscode===-1)
                                       {
                                          toast.error("Error occured while deleting, Please try again")
                                       }
                                    })
                            }
                            else
                            {
                                toast.error("Error occured while deleting, please try again")
                            }
                        })
        }
        else
        {
          toast.success("deletion cancelled");
        }
    }

    return(
        <>
            <section className="w3mid-gap"></section>
      <div className="inner-banner py-5">
        <section className="w3l-breadcrumb text-left py-sm-5 ">
          <div className="container">
            <div className="w3breadcrumb-gids">
              <div className="w3breadcrumb-left text-left">
                <h2 className="inner-w3-title">Add Products </h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/adminpanel">Admin Panel</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span> Add Products {" "}
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
            <h2>Add New Products</h2>

            <div className="form-sub-w3">
                <select className="form-control" onChange={(e)=>setcat(e.target.value)}>
                    <option value="">Choose Category</option>
                    {
                        allcat.map((data,i)=>
                        <option value={data._id} key={i}>{data.catname}</option>
                        )
                    }
                </select><br/>
                <select className="form-control" onChange={(e)=>setsubcat(e.target.value)}>
                    <option value="">Choose Sub Category</option>
                    {
                        allsubcat.map((data,i)=>
                        <option value={data._id} key={i}>{data.subcatname}</option>
                        )
                    }
                </select><br/>

              <input type="text" name="catproduct" onChange={(e) => setproductname(e.target.value)} placeholder="Product Name"/>
              <div className="icon-w3">
                <span><i className="fa-brands fa-product-hunt"></i></span>
              </div>
            </div>

            <div className="form-sub-w3">
              <input type="text" name="Rate" onChange={(e)=>setrate(e.target.value)} placeholder="Rate"/>
              <div className="icon-w3">
                <span><i className="fa-solid fa-tag"></i></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input type="text" name="discount" onChange={(e)=>setdiscount(e.target.value)} placeholder="Discount"/>
              <div className="icon-w3">
                <span><i className="fa-solid fa-percent"></i></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input type="textarea" name="description" onChange={(e)=>setdescription(e.target.value)} placeholder="Description"/>
              <div className="icon-w3">
                <span><i className="fa-solid fa-note-sticky"></i></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input type="text" name="stock" onChange={(e)=>setstock(e.target.value)} placeholder="Stock"/>
              <div className="icon-w3">
                <span><i className="fa-solid fa-box"></i></span>
              </div>
            </div>

            <div className="form-check">
              <p>Is It Featured Product?</p>
             <label><input type="radio" name="featured" value="yes" onChange={(e)=>setfprod(e.target.value)}/>Yes</label>&nbsp;
             <label><input type="radio" name="featured" value="no" onChange={(e)=>setfprod(e.target.value)}/>No</label>
            </div>

            <div className="form-sub-w3">
              <input type="file" name="file" onChange={onpicselect}/>
              <div className="icon-w3">
                <span><i className="fa-solid fa-file"></i></span>
              </div>
            </div>

            <div className="submit-button text-center">
              <button onClick={onadd} className="btn btn-style btn-primary">
                Add Product
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="gap"></div>
      {
        allprod.length!==0?
        <table cellPadding="25px">
          <tbody>
            <tr>
            <th>product Picture</th>
            <th>product Name</th>
            <th colSpan="2">Options</th></tr>
            {
              allprod.map((data,i)=>
              <tr key={i}>
                <td><img src={`idata/${data.productpic}`} height="75px" alt="productpic"/></td>
                <td>{data.productname}</td>
                <td><Link to={`/updateproduct/${data._id}`}><button className="btn btn-style btn-primary">Update</button></Link></td>
                <td><button className="btn btn-style btn-primary" onClick={()=>delproduct(data)}>Delete</button></td>
              </tr>
              )
            }
          </tbody>
        </table>:null
      }
      <div className="gap"></div>
        </>
    )
}
export default ManageProduct;