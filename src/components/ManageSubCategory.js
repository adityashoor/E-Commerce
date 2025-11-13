import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

var ManageSubCategory=()=>
{
    const [cat, setcat] = useState("");
    const [allcat, setallcat] = useState([]);
    const [allsubcat, setallsubcat] = useState([]);
    const [subcatname, setsubcatname] = useState();
    const [pic, setpic] = useState();

    useEffect(()=>
    {
        fetchallcat();
        window.scrollTo(0,0)
    },[])

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
                        if(result.statuscode===0)
                        {
                          toast.warning("No Sub Categories Added");
                        }
                        else if(result.statuscode===1)
                        {
                          setallsubcat(result.subcatdata);
                        }
                        else
                        {
                          toast.error("error occured, please try again")
                        }
                      })
                  }
                  else
                  {
                    toast.error("error occured, please try again")
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

    var onbtnclick=()=>
    {
        const formdata=new FormData();
        formdata.append('cat',cat);
        formdata.append('subcatname',subcatname);
        formdata.append('subcatpic',pic);

        fetch("http://localhost:9000/api/savesubcategory",
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
                        toast.success("sub category added successfully")
                    }
                    })  
                }
                else
                {
                    toast.error("Error, please try again")
                }
            })
      }
    

    var delsubcat=(subcatdata)=>
    {
      // eslint-disable-next-line no-restricted-globals
      if(confirm(`do you want to delete ${subcatdata.subcatname} subcategory`)===true)
        {
            fetch("http://localhost:9000/api/delsubcat",
                    {
                        method:"delete",
                        body:JSON.stringify({uid:subcatdata.catid}),
                        headers:{'Content-type':'application/json;charset=utf-8'}
                    }).then(resp=>
                        {
                            if(resp.ok)
                            {
                                resp.json().then(result=>
                                    {
                                       if(result.statuscode===1)
                                       {
                                          toast.success("SubCategory deleted successfully");

                                       }
                                       else if(result.statuscode===0)
                                       {
                                          toast.error("Error Occured while deleting, Please try again")
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
          toast.warning("deletion cancelled");
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
                <h2 className="inner-w3-title">Sub Category </h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/adminpanel">Admin Panel</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span> Sub Category{" "}
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
            <h2>Create New Sub Category</h2>

            <div className="form-sub-w3">
                <select className="form-control" onChange={(e)=>setcat(e.target.value)}>
                    <option value="">Choose Category</option>
                    {
                        allcat.map((data,i)=>
                        <option value={data._id} key={i}>{data.catname}</option>
                        )
                    }
                </select><br/>

              <input type="text" name="catname" onChange={(e)=>setsubcatname(e.target.value)} placeholder="Sub Category Name"/>
             
              <div className="icon-w3">
                <span className="fas fa-user" aria-hidden="true"></span>
              </div>
            </div>
            <div className="form-sub-w3">
              <input type="file" name="file" onChange={onpicselect}/>

              <div className="icon-w3">
                <span><i className="fa-solid fa-file"></i></span>
              </div>
            </div>
            <div className="submit-button text-center">
              <button onClick={onbtnclick} className="btn btn-style btn-primary">
                Create Sub Category</button>
            </div>
          </div>
        </div>
      </section>
      <div className="gap"></div>
      {
        cat!==""?
        <table cellPadding="25px">
          <tbody>
            <tr>
            <th>Subcategory Picture</th>
            <th>Subcategory Name</th>
            <th colSpan="2">Options</th></tr>
            {
              allsubcat.map((data,i)=>
              <tr key={i}>
                <td><img src={`idata/${data.subcatpic}`} height="75px" alt="subcatpic"/></td>
                <td>{data.subcatname}</td>
                <td><Link to={`/updatesubcat/${data._id}`}><button className="btn btn-style btn-primary">Update</button></Link></td>
                <td><button className="btn btn-style btn-primary" onClick={()=>delsubcat(data)}>Delete</button></td>
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
export default ManageSubCategory;