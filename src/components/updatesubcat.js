import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

var Updatesubcat=()=>
{
    const [cat, setcat] = useState("");
    const [allcat, setallcat] = useState([]);
    const [allsubcat, setallsubcat] = useState([]);
    const [subcatname, setsubcatname] = useState();
    const [pic, setpic] = useState("");
    const [subcatpic, setsubcatpic] = useState();
    const {sid}=useParams();

    useEffect(()=>
    {
        fetchallcat();
        window.scrollTo(0,0)
    },[])

    useEffect(()=>
    {
        fetch(`http://localhost:9000/api/getsubcategorybyid/${sid}`).then(resp=>
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
                            setallsubcat(result.subcatdata[0]);
                            setsubcatpic(result.subcatdata[0].subcatpic);
                            setsubcatname(result.subcatdata[0].subcatname);
                            setcat(result.subcatdata[0].catid);
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
      
    },[sid])

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
        formdata.append('subid',sid);
        formdata.append('subcatname',subcatname);
        if(pic!=="")
        {
            formdata.append('subcatpic',pic);
        }
        formdata.append('oldsubpic',subcatpic);

        fetch("http://localhost:9000/api/updatesubcategory",
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
                    else if(result.statuscode===1)
                    {
                        toast.success("sub category updated successfully")
                    }
                    else if(result.statuscode===0)
                    {
                        toast.success("sub category not updated")
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
                <h2 className="inner-w3-title">Update Sub Category </h2>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li>
                    <Link to="/subcategory">Sub category</Link>
                  </li>
                  <li className="active">
                    <span className="fas fa-angle-double-right mx-2"></span> Update Sub Category{" "}
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
            <h2>Update Sub Category</h2>

            <div className="form-sub-w3">
                <select className="form-control" onChange={(e)=>setcat(e.target.value)}>
                    <option value="">Choose Category</option>
                    {
                        allcat.map((data,i)=>
                        data._id===allsubcat.catid?<option selected value={data._id}>{data.catname}</option>:
                        <option value={data._id} key={i}>{data.catname}</option>
                        )
                    }
                </select><br/>

              <input
                type="text"
                value={subcatname}
                name="catname"
                onChange={(e) => setsubcatname(e.target.value)}
                placeholder="Sub Category Name"
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
              <button onClick={onbtnclick} className="btn btn-style btn-primary">update</button>&nbsp;
               <img src={`/idata/${subcatpic}`} border='2px' height="75" alt="subcatpic"/>
            </div>
          </div>
        </div>
      </section>
      <div className="gap"></div>
        </>
    )
}
export default Updatesubcat;