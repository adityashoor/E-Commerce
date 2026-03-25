import { Navigate, Route, Routes } from "react-router-dom"
import About from "./About";
import CreateAdmin from "./createadmin";
import Category from "./Category";
import Contact from "./Contact";
import Footer from "./Footer";
import Header from './Header';
import Homepage from "./Homepage";
import Login from "./Login";
import ManageProduct from "./manageproduct";
import ManageSubCategory from "./ManageSubCategory";
import Memberlist from "./memberlist";
import Page404 from "./page404";
import Signup from "./signup";
import Updateproduct from "./updateproduct";
import Updatesubcat from "./updatesubcat";
import { AdminPanel } from "./Adminpanel";
import { Activate } from "./Activate";
import ChangePass from "./Changepass";
import { ShowCategory } from "./showCategory";
import { ShowSubCategory } from "./showsubcategory";
import { ShowProducts } from "./showproducts";
import { ProductDetails } from "./Productdetails";
import { Cart } from "./cart";
import Checkout from "./checkout";
import { Ordersumary } from "./ordersumary";
import OrderList from "./viewOrders";
import Updatestatus from "./updatestatus";
import { Searchresults } from "./serachresult";
import { Searchuser } from "./searchuser";
import Forgetpass from "./forgetpass";
import Setpass from "./setpass";
import { Adminshield } from "./adminshield";
import { Usershield } from "./usershield";
import { Weather } from "./weather";
import { Trackorder } from "./trackorder";
var Siteroutes=()=>
{
    return(
        <>
        <Routes>
            <Route path="/" element={<Navigate to="/homepage"/>}/>
            <Route path="/header" element={<Header/>}/>
            <Route path="/weather" element={<Weather/>}/>
            <Route path="/searchresult" element={<Searchresults/>}/>
            <Route path="/searchuser" element={<Adminshield Mycomp={Searchuser}/>}/>
            <Route path="/footer" element={<Footer/>}/>
            <Route path="/homepage" element={<Homepage/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/trackorders" element={<Trackorder/>}/>
            <Route path="/checkout" element={<Usershield Mycomp2={Checkout}/>}/>
            <Route path="/ordersummary" element={<Usershield Mycomp2={Ordersumary}/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/changepass" element={<Usershield Mycomp2={ChangePass}/>}/>
            <Route path="/forgetpass" element={<Forgetpass/>}/>
            <Route path="/setpass" element={<Setpass/>}/>
            <Route path="/aboutus" element={<About/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/members" element={<Adminshield Mycomp={Memberlist}/>}/>
            <Route path="/category" element={<Adminshield Mycomp={Category}/>}/>
            <Route path="/showcategory" element={<ShowCategory/>}/>
            <Route path="/subcategory" element={<Adminshield Mycomp={ManageSubCategory}/>}/>
            <Route path="/showsubcategory/:cid" element={<ShowSubCategory/>}/>
            <Route path="/updatesubcat/:sid" element={<Adminshield Mycomp={Updatesubcat}/>}/>
            <Route path="/products" element={<Adminshield Mycomp={ManageProduct}/>}/>
            <Route path="/showproducts/:scatid" element={<ShowProducts/>}/>
            <Route path="/updateproduct/:pid" element={<Adminshield Mycomp={Updateproduct}/>}/>
            <Route path="/productdetails/:prodid" element={<ProductDetails/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/activate" element={<Activate/>}/>
            <Route path="/createadmin" element={<Adminshield Mycomp={CreateAdmin}/>}/>
            <Route path="/adminpanel" element={<Adminshield Mycomp={AdminPanel} />}/>
            <Route path="/vieworders" element={<Adminshield Mycomp={OrderList}/>}/>
            <Route path="/updatestatus" element={<Adminshield Mycomp={Updatestatus}/>}/>
            <Route path="/*" element={<Page404/>}/>
        </Routes>
        </>
    )
}
export default Siteroutes;