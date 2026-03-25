import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

var Category=()=>
{
    const [catname, setcatname] = useState();
    const [catid, setcatid] = useState();
    const [catpic, setcatpic] = useState();
    const [allcat, setallcat] = useState([]);
    const [editmode, seteditmode] = useState(false);
    const [pic, setpic] = useState("");

  useEffect(()=>
  {
    fetchallcat();
  },[])

    var onpicselect=(event)=>
    {
        setpic(event.target.files[0]);
    }

    var onbtnclick=()=>
    {
      if(editmode===true)
      {
        const formdata=new FormData();
        if(pic!=="")
        {
          formdata.append('catpic',pic);
        }
        formdata.append('catname',catname);
        formdata.append('oldpic',catpic);
        formdata.append('catid',catid);

        fetch("http://localhost:9000/api/updatecat",
        {
          method:"put",
          body:formdata,
        }).then(resp=>{
          if(resp.ok)
          {
            resp.json().then(result=>
              {
                if(result.statuscode===1)
                {
                  toast.success("Category Data Updated Successfully");
                  fetchallcat();
                  oncancel();
                }
                else if(result.statuscode===-1)
                {
                  toast.error("Error While Updating, please try again");
                }
                else
                {
                  toast.error("No Data Deleted")
                }
              })
          }
          else
          {
            toast.error("Error While Updating, please try again");
          }
        })

      }
      else if(editmode===false)
      {
        const formdata=new FormData();
        formdata.append('catname',catname);
        formdata.append('catpic',pic);

        fetch("http://localhost:9000/api/savecategory",
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
                        toast.success("category added successfully");
                        fetchallcat();
                    }
                    })  
                }
                else
                {
                    toast.error("Error, please try again")
                }
            })
    }}
    var fetchallcat=()=>
    {
      fetch("http://localhost:9000/api/getcategory").then(resp=>
      {
        if(resp.ok)
        {
          resp.json().then(result=>
            {
              if(result.statuscode===0)
              {
                toast.error("No Categories Added");
              }
              else if(result.statuscode===1)
              {
                setallcat(result.catdata);
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
    var updatecat=(catdata)=>
    {
      seteditmode(true);
      setcatname(catdata.catname);
      setcatpic(catdata.catpic);
      setcatid(catdata._id);
    }

    var oncancel=()=>
    {
      seteditmode(false);
      setcatname("");
      setcatpic("");
      setcatid("");
    }

    var delcat=(catdata)=>
    {
      // eslint-disable-next-line no-restricted-globals
      if(confirm(`do you want to delete ${catdata.catname} category`)===true)
        {
            fetch("http://localhost:9000/api/delcat",
                    {
                        method:"delete",
                        body:JSON.stringify({uid:catdata._id}),
                        headers:{'Content-type':'application/json;charset=utf-8'}
                    }).then(resp=>
                        {
                            if(resp.ok)
                            {
                                resp.json().then(result=>
                                    {
                                       if(result.statuscode===1)
                                       {
                                        toast.success("Category deleted successfully");
                                        fetchallcat();
                                       }
                                       else if(result.statuscode===0)
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
                <h2 className="inner-w3-title">Category </h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/adminpanel">Admin Panel</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span> Category{" "}
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

            <h2>Create New Category</h2>

            <div className="form-sub-w3">
              <input
                type="text"
                value={catname}
                name="catname"
                onChange={(e) => setcatname(e.target.value)}
                placeholder="Category Name"
                required=""
              />
              <div className="icon-w3">
                <span className="fas fa-user" aria-hidden="true"></span>
              </div>
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

            <div className="submit-button text-center">
              <button onClick={onbtnclick} className="btn btn-style btn-primary">
                {editmode===true?"update":"Create Category"}
              </button>&nbsp;
              {editmode===true?<button className="btn btn-style btn-primary" onClick={oncancel}>Cancel</button>:null}&nbsp;&nbsp;
              {editmode===true?<img src={`idata/${catpic}`} height="75px" alt="catpic"/>:null}
            </div>
          </div>
        </div>
      </section>
      <div className="gap"></div>
      <h1 className="text-danger text-center">All Categories</h1><br/>
      {
        allcat.length>=1?
        <table cellPadding="25px">
          <tbody>
            <tr>
              <th>Category Picture</th>
              <th>Category Name</th>
              <th colSpan="2">Options</th>
            </tr>
            {
              allcat.map((catdata,i)=>
                <tr key={i}>
                  <td><img src={`idata/${catdata.catpic}`} height="75px" alt="catpic"/></td>
                  <td>{catdata.catname}</td>
                  <td><button className="btn btn-primary" onClick={()=>updatecat(catdata)}>Update</button></td>
                  <td><button className="btn btn-danger" onClick={()=>delcat(catdata)}>delete</button></td>
                </tr>
              )
            }
          </tbody>
        </table>:null
      }<br/><br/>
      </>    
    )
}
export default Category;