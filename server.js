const express=require('express');
const mongoose=require("mongoose");
const cors=require('cors');
const multer=require('multer');
const bcrypt=require('bcrypt');
const fs=require('fs');
const nodemailer=require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const port=9000;
const app=express();
app.use(cors());
app.use(express.json());

var picname;
let MyStorage=multer.diskStorage({
    destination:(req,file,cb)=>
    {
        cb(null,'public/idata')
    },
    filename:(req,file,cb)=>
        {
            picname=Date.now()+Math.round(Math.random()*1E9)+file.originalname;
            cb(null,picname);
        }
    });
let upload=multer({storage:MyStorage});

const transporter=nodemailer.createTransport({
    service:'hotmail',
    auth:{user:'shoppykarts@hotmail.com',pass:'shoppy123#'}
})

mongoose.set('strictQuery',false);
mongoose.connect("mongodb://localhost:27017/record",function(err)
{
    if(err)
    {
        console.log("err while connecting to mongoose");
    }
    else
    {
        console.log("connected to mongoose");
    }
})

// signup Api

var MemberSchema= new mongoose.Schema({username:{type:String,unique:true},email:{type:String,unique:true},phone:String,password:String,usertype:String,Activated:Boolean,activationToken:String},{versionKey:false});

var RegisterModel=mongoose.model("member",MemberSchema,"member");

app.post("/api/signup", async(req,res)=>
{

    var user=await RegisterModel.findOne({username:req.body.username})
    var user1=await RegisterModel.findOne({email:req.body.email})
    if(user)
    {
        return res.send({statuscode:0,msg:"This Username Is Already Taken"})
    }
    else if(user1)
    {
        return res.send({statuscode:0,msg:"Account With This Email Already Exist, Please Use Different Email"})
    }

    const hash = bcrypt.hashSync(req.body.password, 10);
    var membrec=new RegisterModel({username:req.body.username,email:req.body.email,phone:req.body.phone,password:hash,usertype:req.body.utype,Activated:false,activationToken:uuidv4()});

    let result=await membrec.save();
    result= result.toObject()
    delete result.password;
    
    const activationlink=`http://localhost:3000/activate?token=${membrec.activationToken}`;
    const mailoptions={
        from:'shoppykarts@hotmail.com',
        to:req.body.email,
        subject:'Account Activation',
        text:`WELCOME ${req.body.username}😀\n\nplease activate your account by clicking on the link below👇\n\n${activationlink}`
    };

    transporter.sendMail(mailoptions,(err,info)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            console.log(`email sent : ${info.response}`);
            res.send({statuscode:1})
        }
    });
});

app.get("/api/activateaccount",(req,res)=>
{
    RegisterModel.find({activationToken:req.query.token},(err,data)=>
    {
        if(err)
        {
            res.send({msg:"invalid token"});
        }
        else 
        {
            if(data.length===0)
            {
                res.send({msg:"No Data Found!"})
            }
            else
            {
                RegisterModel.updateOne({Activated:true},(err,data)=>
                {
                    if(err)
                    {
                        res.send({msg:"Error While Updating"})
                    }
                    else if(data.modifiedCount===1)
                    {
                        res.send({msg:"Congratulations🎉! Account Activated Successfully"})
                    }
                })
            }
        }
    });
})

app.get("/api/searchusers", (req, res)=>
{
  var searchtext=req.query.s;
  RegisterModel.find({$or:[{username:{$regex:'.*'+searchtext,$options:'i'}},{email:{$regex:'.*'+searchtext,$options:'i'}}]}, (err,data)=>
  {
    if (err)
    {
      res.send(err);
    }
    else
    {
      if(data.length===0)
      {
        res.json({statuscode:0})
      }
      else
      {
        res.send({statuscode:1,userdata:data});
      }
    }

  });
});
// contact Api

app.post("/api/contact", async(req,res)=>
{
   const mailoptions={
    from:'shoppykarts@hotmail.com',
    to:'shoppykarts@hotmail.com',
    subject:'Message from shoppykart - Contact Us',
    text:`Name:-${req.body.name}\nEmail:-${req.body.email}\nPhone:-${req.body.phone}\nSubject:-${req.body.subject}\nMessage:-${req.body.message}`
   };

   transporter.sendMail(mailoptions,(err,info)=>
   {
    if(err)
    {
        res.send({statuscode:-1})
    }
    else
    {
        console.log(`Email Sent : ${info.response}`)
        res.send({statuscode:1})
    }
   })

}); 

// subscription Api

var SubscribeSchema= new mongoose.Schema({email:{type:String,unique:true}},{versionKey:false});
var SubscribeModel=mongoose.model("subscriptions",SubscribeSchema,"subscriptions");
app.post("/api/subscribe", async(req,res)=>
{
    var subscriptionrec=new SubscribeModel(req.body);
    let result=await subscriptionrec.save();
    if(!result)
    {
        res.send({statuscode:-1})
    }
    else
    {
        res.send({statuscode:1})
    }
});

// login Api

app.post("/api/login",(req,res)=>
{
    RegisterModel.find({ $or:[{email:req.body.username},{username:req.body.username}]},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
        if(data.length==0)
        {
            res.send({statuscode:0}) 
        }
        else
        {
            var compre=bcrypt.compareSync(req.body.password, data[0].password);
            if(compre===true)
            {
                res.send({statuscode:1,userdata:data})
            }
            else
            {
                res.send({statuscode:0})
            }
             
        }}
    })
});

app.put("/api/changepass",async(req,res)=>
{
    let memb= await RegisterModel.findOne({ $or:[{email:req.body.username},{username:req.body.username}]});
    if(memb)
    {
        var compare=bcrypt.compareSync(req.body.password,memb.password)
        if(compare===true)
        {
            const hash = bcrypt.hashSync(req.body.newpass,10);
            memb.password=hash;
            let upass=await memb.save();
            
            if(upass)
            {
                res.send({statuscode:1});
            }
            else
            {
                res.send({statuscode:0});
            }
        }
        else
        {
            res.send({statuscode:-2})
        }
    }
    else
    {
        res.send({statuscode:-1})
    }
})

var ForgetpassSchema= new mongoose.Schema({username:{type:String,unique:true},expiry:String,token:String},{versionKey:false});
var ForgetpassModel=mongoose.model("forgetpass",ForgetpassSchema,"forgetpass");
app.get("/api/searchemail",(req,res)=>
{
    RegisterModel.find({email:req.query.email},async(err,data)=>
    {
        if(err)
        {
            res.send({msg:"Error Occured"})
        }
        else
        {
            if(data.length===0)
            {
                res.send({msg:"Invalid Email"})
            }
            else
            {
               var passtoken=uuidv4();
               var currdate= Date.now();
               
               var forgetrec=new ForgetpassModel({username:data[0].username,expiry:currdate+900000,token:passtoken});
               let result=await forgetrec.save();
                if(!result)
                {
                    res.send({msg:"Error Occured While Saving"})
                }
                else
                {
                    const changelink=`http://localhost:3000/setpass?token=${passtoken}`;
                    const mailoptions={
                        from:'shoppykarts@hotmail.com',
                        to:req.query.email,
                        subject:'Account Activation',
                        text:`WELCOME ${data[0].username}😀\n\nset your password by clicking on the link below👇 (Valid for 15 mins)\n\n${changelink}`
                    };

                    transporter.sendMail(mailoptions,(err,info)=>
                    {
                        if(err)
                        {
                            res.send({msg:"Error Occured While Sending Link"})
                        }
                        else
                        {
                            res.send({msg:"Please Set Your Password By Clicking On The Link Send To Your Email !"})
                        }
                    });
                }
            }
        }
    })
});

app.get("/api/fetchexpirydate",async(req,res)=>
{
    const resetdata = await ForgetpassModel.findOne({ token: req.query.token });
    if (!resetdata) 
    {
      return res.send({statuscode:-1,msg:'Invalid Reset Token!'});
    }
    else
    {
      if(Date.now()<resetdata.expiry)
      {
        res.send({statuscode:1,username:resetdata.username})
      }
      else
      {
        return res.send({statuscode:0,msg:'Link Expired! It was valid for 15 mins only. Request new link!'});
      }
    }
});

app.put("/api/resetpass",async(req,res)=>
{
    let memb= await RegisterModel.findOne({username:req.body.username});
    if(memb)
    {
            const hash = bcrypt.hashSync(req.body.password,10);
            memb.password=hash;
            let upass=await memb.save();
            
            if(upass)
            {
                res.send({statuscode:1});
            }
            else
            {
                res.send({statuscode:0});
            }
    }
    else
    {
        res.send({statuscode:-1})
    }
})

app.get("/api/userlist",(req,res)=>
{
    // eslint-disable-next-line array-callback-return
    RegisterModel.find((err,data)=>
    {
        if(err)
        {
            res.send({statuscode:0})
        }
        else
        {
            res.send({statuscode:1,userdata:data})
        }
    }).select("-password")
});

app.delete("/api/delmemb",(req,res)=>
{
    RegisterModel.deleteMany({_id:req.body.uid},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.deletedCount>=1)
            {
                res.send({statuscode:1});
            }
            else
            {
                res.send({statuscode:0});
            }
        }
    })
});

// category api;

var CategorySchema=new mongoose.Schema({catname:String,catpic:String},{versionKey:false});

var CategoryModel=mongoose.model("category",CategorySchema,"category")
app.post("/api/savecategory", upload.single("catpic"),function(req,res)
{
    if(!req.file)
    {
        picname="no-image.png";
    };

    var ManageCat= new CategoryModel({catname:req.body.catname,catpic:picname});
    ManageCat.save((err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            res.send({statuscode:1})
        }
    })
});

var SubCategorySchema=new mongoose.Schema({catid:String,subcatname:String,subcatpic:String},{versionKey:false});

var SubCategoryModel=mongoose.model("subcategory",SubCategorySchema,"subcategory")
app.post("/api/savesubcategory", upload.single("subcatpic"),function(req,res)
{
    if(!req.file)
    {
        picname="no-image.png";
    };

    var ManagesubCat= new SubCategoryModel({catid:req.body.cat,subcatname:req.body.subcatname,subcatpic:picname});
    ManagesubCat.save((err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            res.send({statuscode:1})
        }
    })
});

app.get("/api/getcategory",(req,res)=>
{
    // eslint-disable-next-line array-callback-return
    CategoryModel.find((err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.length==0)
            {
                res.send({statuscode:0})
            }
            else
            {
                res.send({statuscode:1,catdata:data})
            }
        }
    })
});

app.get("/api/getsubcategory",(req,res)=>
{
    SubCategoryModel.find({catid:req.query.catid},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.length==0)
            {
                res.send({statuscode:0})
            }
            else
            {
                res.send({statuscode:1,subcatdata:data})
            }
            
        }
    })
});

app.get("/api/getsubcategorybyid/:scatid",(req,res)=>
{
    SubCategoryModel.find({_id:req.params.scatid},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.length==0)
            {
                res.send({statuscode:0})
            }
            else
            {
                res.send({statuscode:1,subcatdata:data})
            }
            
        }
    })
});

app.delete("/api/delcat",(req,res)=>
{
    CategoryModel.deleteOne({_id:req.body.uid},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.deletedCount>=1)
            {
                res.send({statuscode:1});
            }
            else
            {
                res.send({statuscode:0});
            }
        }
    });
});

app.put("/api/updatecat",upload.single("catpic"),(req,res)=>
{
    if(!req.file)
    {
        picname=req.body.oldpic;
    }
    else
    {
        // eslint-disable-next-line eqeqeq
        if(req.body.oldpic!="no-image.png")
        {
            fs.unlink(`public/idata/${req.body.oldpic}`,(err)=>
            {
                if(err) throw err;
                console.log("oldpic deleted")
            });
        }
    }
    CategoryModel.updateOne({_id:req.body.catid},{$set:{catname:req.body.catname,catpic:picname}},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else 
        {
            if(data.modifiedCount===1)
            {
                res.send({statuscode:1})
            }
            else
            {
                res.send({statuscode:0})
            }
        }   
    })
})

app.put("/api/updatesubcategory",upload.single("subcatpic"),(req,res)=>
{
    if(!req.file)
    {
        picname=req.body.oldsubpic;
    }
    else
    {
        if(req.body.oldsubpic!=="no-image.png")
        {
            fs.unlink(`public/idata/${req.body.oldsubpic}`,(err)=>
            {
                if(err) throw err;
                console.log("oldsubpic deleted")
            });
        }
    }
    SubCategoryModel.updateOne({_id:req.body.subid},{$set:{catid:req.body.cat,subcatname:req.body.subcatname,subcatpic:picname}},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else 
        {
            if(data.modifiedCount===1)
            {
                res.send({statuscode:1})
            }
            else
            {
                res.send({statuscode:0})
            }
        }   
    })
})

app.delete("/api/delsubcat",(req,res)=>
{
    SubCategoryModel.deleteOne({catid:req.body.uid},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.deletedCount===1)
            {
                res.send({statuscode:1});
            }
            else
            {
                res.send({statuscode:0});
            }
        }
    })
});

// Product Api

var ProductSchema=new mongoose.Schema({catid:String,subcatid:String,productname:String,rate:String,discount:String,description:String,stock:Number,featuredproduct:String,productpic:String},{versionKey:false});

var ProductModel=mongoose.model("Product",ProductSchema,"Product")
app.post("/api/saveproduct", upload.single("prodpic"),function(req,res)
{
    if(!req.file)
    {
        picname="no-image.png"
    }
    var manageproduct=new ProductModel({catid:req.body.cat,subcatid:req.body.subcat,productname:req.body.prodname,rate:req.body.rate,discount:req.body.discount,description:req.body.description,stock:req.body.stock,featuredproduct:req.body.fprod,productpic:picname})

    manageproduct.save((err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            res.send({statuscode:1})
        }
    })
});

app.get("/api/getproductsbysubcatid",(req,res)=>
{
    ProductModel.find({subcatid:req.query.scatid},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.length==0)
            {
                res.send({statuscode:0})
            }
            else
            {
                res.send({statuscode:1,proddata:data})
            }
        }
    })
});

app.get("/api/featuredprod",(req,res)=>
{
    ProductModel.find({featuredproduct:"yes"},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.length==0)
            {
                res.send({statuscode:0})
            }
            else
            {
                res.send({statuscode:1,fdata:data})
            }
        }
    })
});

app.get("/api/getproducts",(req,res)=>
{
    ProductModel.find((err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.length==0)
            {
                res.send({statuscode:0})
            }
            else
            {
                res.send({statuscode:1,proddata:data})
            }
        }
    })
});

app.delete("/api/delproduct",(req,res)=>
{
    ProductModel.deleteOne({_id:req.body.prodid},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.deletedCount===1)
            {
                res.send({statuscode:1});
            }
            else
            {
                res.send({statuscode:0});
            }
        }
    })
});

app.get("/api/getprodbyproid/:pid",(req,res)=>
{
    ProductModel.find({_id:req.params.pid},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.length==0)
            {
                res.send({statuscode:0})
            }
            else
            {
                res.send({statuscode:1,proddata:data})
            }
        }
    })
});

app.put("/api/updateproduct/:pdid",upload.single("prodpic"),(req,res)=>
{
    if(!req.file)
    {
        picname=req.body.oldpic;
    }
    else
    {
        if(req.body.oldpic!=="no-image.png")
        {
            fs.unlink(`/public/idata/${req.body.oldpic}`,(err)=>
            {
                if(err) throw err;
                console.log(err)
            })
        }
    }
    ProductModel.updateOne({_id:req.params.pdid},{$set:{catid:req.body.cat,subcatid:req.body.subcat,productname:req.body.prodname,rate:req.body.rate,discount:req.body.discount,description:req.body.description,stock:req.body.stock,featuredproduct:req.body.fprod,productpic:picname}},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.modifiedCount===1)
            {
                res.send({statuscode:1})
            }
            else
            {
                res.send({statuscode:0})
            }
        }
    })
})

// cart

var CartSchema = new mongoose.Schema({ProdID:String,ProdName:String,Rate:Number,Qty:Number,TotalCost:Number,Picture:String,Username:String},{versionKey: false});

var CartModel = mongoose.model("cart",CartSchema,"cart")

app.post("/api/addtocart",async (req, res)=> 
{
    var newrecord = new CartModel({ProdID:req.body.prodid,ProdName:req.body.prodname,Rate:req.body.rate,Qty:req.body.qyt,TotalCost:req.body.totalcost,Picture:req.body.picname,Username:req.body.username});

    let result = await newrecord.save();

    if(!result)
    {
        res.send({statuscode:-0});
    }
    else
    {
        res.send({statuscode:1,cartdata:result});
    }        
});

app.get("/api/searchcart",(req,res)=>
{
    CartModel.find({$and:[{Username:req.query.user},{ProdID:req.query.prodid}]},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.length>=1)
            {
                res.send({statuscode:1,searchdata:data})
            }
            else
            {
                res.send({statuscode:0})
            }
        }
    })
});

app.get("/api/getcart",(req,res)=>
{
    CartModel.find({Username:req.query.username},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.length===0)
            {
                res.send({statuscode:0})
            }
            else
            {
                res.send({statuscode:1,cartdata:data})
            }
        }
    })
});

app.delete("/api/delcart",async(req,res)=>
{
    let result= await CartModel.deleteOne({_id:req.body.cid})
    if(!result)
    {
        res.send({statuscode:-1})
    }
    else
    {
        if(result.deletedCount===1)
        {
            res.send({statuscode:1});
        }
    }
    
});

app.put("/api/pluscart",(req,res)=>
{
    CartModel.updateOne({_id:req.body.pid},{$set:{Qty:req.body.qty+1,TotalCost:req.body.tcost+req.body.rate}},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.modifiedCount>=1)
            {
                res.send({statuscode:1});
            }
            else
            {
                res.send({statuscode:0});
            }
        }
    })
});

app.put("/api/minuscart",(req,res)=>
{
    CartModel.updateOne({_id:req.body.pid},{$set:{Qty:req.body.qty-1,TotalCost:req.body.tcost-req.body.rate}},(err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            if(data.modifiedCount>=1)
            {
                res.send({statuscode:1});
            }
            else
            {
                res.send({statuscode:0});
            }
        }
    })
});

// checkout

var CheckoutSchema = new mongoose.Schema({name:String,city:String,phone:String,address:String,billamt:String,paymode:String,username:String,orderdate:String,status:String},{versionKey: false});

var CheckoutModel = mongoose.model("checkout",CheckoutSchema,"checkout")

app.post("/api/checkout",async (req, res)=> 
{
    var orderdt=new Date();
    var newrecord = new CheckoutModel({name:req.body.name,city:req.body.city,phone:req.body.phoneno,address:req.body.addr,billamt:req.body.billamt,paymode:req.body.paymode,username:req.body.uname,orderdate:orderdt,status:"Payment Received, Processing"});

    let result = await newrecord.save();

    if(!result)
    {
      res.send({statuscode:0});
    }
    else
    {
      res.send({statuscode:1,data:result});
    }
});

app.get("/api/fetchcart/:uname",(req,res)=>
{
      CartModel.find({Username:req.params.uname},(err,data)=>
      {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
          if(data.length==0)
          {
            res.send({statuscode:0})
          }
          else
          {
            res.send({statuscode:1,cartdata:data})
          }
        }
      });
})

app.get("/api/getorder", (req, res) =>
{
  CheckoutModel.find({ username: req.query.username}, (err, data)=> {
    if (err)
    {
      console.log(err);
      res.send("Failed");
    }
    else
    {
      res.send({orderdata:data});
    }
  }).sort({"orderdate":-1}).limit(1);
});

app.get("/api/fetchcheckout",(req,res)=>
{
    CheckoutModel.find((err,data)=>
    {
        if(err)
        {
            res.send({statuscode:-1})
        }
        else
        {
            res.send({checkoutdata:data})
        }
    })
})



app.put("/api/updatestatus",(req,res)=>
{
  CheckoutModel.updateOne({_id:req.body.ordid},{ $set: {status:req.body.newst}},(err,data)=>
  {
    if (err)
    {
      res.send({msg:"Error try again"});
    }
    else
    {
      if(data.modifiedCount===1)
      {
        res.send({msg:"Status updated successfully"});
      }
      else
      {
        res.send({msg:"Status not updated"});
      }
    }
  });
});

app.get("/api/searchprods", (req, res)=>
{
  var searchtext=req.query.s;
  ProductModel.find({productname:{$regex:'.*'+searchtext,$options:'i'}}, (err,data)=>
  {
    if (err)
    {
      res.send(err);
    }
    else
    {
      if(data.length===0)
      {
        res.json({statuscode:0})
      }
      else
      {
        res.send({statuscode:1,prodsdata:data});
      }
    }

  });
});

// orderitems

var orderSchema = new mongoose.Schema( {orderid:String,prodid:String,prodname:String,prodrate:Number,Qty:Number,totalcost:Number,prodpic:String,username:String }, { versionKey: false } );

  var OrderModel = mongoose.model("Orders", orderSchema,"Orders");
    
  app.post("/api/orderitems",(req,res)=>
  {
      var orderitems=req.body;
      OrderModel.insertMany(orderitems, (err, data)=> {
      if (err)
      { 
          return console.error(err);
      } 
      else 
      {
        res.json({statuscode:1});
      }
    });
  });

  app.put('/api/updatestock', async (req, res) => 
  {
    let updateresp=false;
   
    var updatelist=req.body;//update array
  
    for(let x=0;x<updatelist.length;x++)
    {
      var updateresult = await ProductModel.updateOne({_id:updatelist[x].pid},{$inc: {"stock":-updatelist[x].qty}});
      if(updateresult.modifiedCount===1)
      {
        updateresp=true;
      }
      else
      {
        updateresp=false;
      }
    }
    console.log(updateresp);
      if(updateresp==true)
      {
            res.json({statuscode:1});
      }
      else
      {
        res.json({statuscode:0});
      }
  })

  app.delete("/api/emptycart", function(req, res) {
    console.log(req.body);
    CartModel.deleteMany({Username: req.body.uname }, (err, data)=>
    {
      if(err)
      { 
        console.log(err);
        res.json({"statuscode":-1})
      }
      else
      {
        if(data.deletedCount>=1)
        {
          res.json({"statuscode":1})
        }
        else
        {
          res.json({"statuscode":0})
        }
      }
    });
  });

  app.get("/api/fetchorderbyusername", (req, res)=>
  {
    OrderModel.find({username:req.query.username}, (err,data)=>
    {
      if (err)
      {
        res.send({statuscode:-1});
      }
      else
      {
        if(data.length===0)
        {
          res.json({statuscode:0})
        }
        else
        {
          res.send({statuscode:1,orderdata:data});
        }
      }
  
    });
  });
  

app.listen(port,()=>
{
    console.log("port 9000 running...")
})
