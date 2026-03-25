import API_URL from "../apiConfig";
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LabelList,
} from 'recharts';

const CHART_COLORS = ["#ef233c", "#2b2d42", "#38b000", "#f4a261", "#4361ee", "#7209b7"];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "#fff", border: "1px solid #ef233c", borderRadius: 6, padding: "8px 14px", fontSize: 13 }}>
                {label && <p style={{ margin: 0, fontWeight: 700, color: "#2b2d42" }}>{label}</p>}
                {payload.map((p, i) => (
                    <p key={i} style={{ margin: "2px 0", color: p.color || "#ef233c" }}>
                        {p.name}: {p.name && p.name.toLowerCase().includes("revenue") ? `CA$${Number(p.value).toLocaleString("en-CA")}` : p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const AdminPanel = () => {

    const [users, setusers] = useState([]);
    const [orders, setorders] = useState([]);
    const [products, setproducts] = useState([]);
    const [categories, setcategories] = useState([]);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        Promise.all([
            fetch(`${API_URL}/api/userlist`),
            fetch(`${API_URL}/api/fetchcheckout`),
            fetch(`${API_URL}/api/getproducts`),
            fetch(`${API_URL}/api/getcategory`),
        ]).then(async ([uResp, oResp, pResp, cResp]) => {
            const [uData, oData, pData, cData] = await Promise.all([
                uResp.ok ? uResp.json() : {},
                oResp.ok ? oResp.json() : {},
                pResp.ok ? pResp.json() : {},
                cResp.ok ? cResp.json() : {},
            ]);
            if (uData.userdata) setusers(uData.userdata);
            if (oData.checkoutdata) setorders(oData.checkoutdata);
            if (pData.proddata) setproducts(pData.proddata);
            if (cData.catdata) setcategories(cData.catdata);
        }).catch(() => toast.error("Failed to load dashboard data")).finally(() => setloading(false));
    }, []);

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.billamt || 0), 0);
    const deliveredRevenue = orders.filter(o => (o.status || "").toLowerCase() === "delivered").reduce((sum, o) => sum + Number(o.billamt || 0), 0);
    const pendingRevenue = orders.filter(o => (o.status || "").toLowerCase() !== "delivered" && (o.status || "").toLowerCase() !== "cancelled").reduce((sum, o) => sum + Number(o.billamt || 0), 0);

    const statusCount = orders.reduce((acc, o) => {
        const s = (o.status || "pending").toLowerCase();
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    const recentOrders = [...orders].reverse().slice(0, 6);
    const recentMembers = [...users].reverse().slice(0, 5);

    // ── Chart data ────────────────────────────────────────────────────────────

    // Monthly revenue bar chart (last 6 months)
    const monthlyRevenue = (() => {
        const map = {};
        const now = new Date();
        // Pre-fill last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleString("en-CA", { month: "short", year: "2-digit" });
            map[key] = { month: key, Revenue: 0, Orders: 0 };
        }
        orders.forEach(o => {
            const d = new Date(o.orderdate);
            if (isNaN(d)) return;
            const key = d.toLocaleString("en-CA", { month: "short", year: "2-digit" });
            if (map[key]) {
                map[key].Revenue += Number(o.billamt || 0);
                map[key].Orders += 1;
            }
        });
        return Object.values(map);
    })();

    // Order status pie chart
    const statusPieData = [
        { name: "Delivered",   value: statusCount["delivered"] || 0 },
        { name: "Processing",  value: (statusCount["processing"] || 0) + (statusCount["payment received, processing"] || 0) },
        { name: "Shipped",     value: statusCount["shipped"] || 0 },
        { name: "Pending",     value: statusCount["pending"] || 0 },
        { name: "Cancelled",   value: statusCount["cancelled"] || 0 },
    ].filter(d => d.value > 0);

    // Revenue by city bar chart (top 6)
    const cityRevenue = (() => {
        const map = {};
        orders.forEach(o => {
            if (!o.city) return;
            map[o.city] = (map[o.city] || 0) + Number(o.billamt || 0);
        });
        return Object.entries(map)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([city, Revenue]) => ({ city, Revenue: Math.round(Revenue) }));
    })();

    // Payment mode pie chart
    const paymodePieData = (() => {
        const map = {};
        orders.forEach(o => { if (o.paymode) map[o.paymode] = (map[o.paymode] || 0) + 1; });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    })();

    if (loading) return (
        <div className="text-center py-5 my-5">
            <div className="spinner-border text-danger" role="status" style={{ width: 48, height: 48 }}></div>
            <p className="mt-3 text-muted">Loading dashboard…</p>
        </div>
    );

    return (
        <>
            <section className="w3mid-gap"></section>

            {/* ── Banner ─────────────────────────────────────── */}
            <div className="inner-banner py-5">
                <section className="w3l-breadcrumb text-left py-sm-5">
                    <div className="container">
                        <div className="w3breadcrumb-gids">
                            <div className="w3breadcrumb-left text-left">
                                <h2 className="inner-w3-title">Admin Dashboard</h2>
                            </div>
                            <div className="w3breadcrumb-right">
                                <ul className="breadcrumbs-custom-path">
                                    <li><Link to="/adminpanel">Admin Panel</Link></li>
                                    <li className="active"><span className="fas fa-angle-double-right mx-2"></span>Dashboard</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="gap"></div>

            <div className="container py-5">

                {/* ── Stat Tiles ─────────────────────────────────── */}
                <div className="row ms-lg-0">
                    <div className="col-md-3 col-sm-6">
                        <Link className="info-tile tile-indigo" to="/members">
                            <div className="tile-heading">
                                <div className="pull-left">Members</div>
                                <div className="pull-right"><i className="fa-solid fa-users"></i></div>
                            </div>
                            <div className="tile-body">
                                <div className="pull-left"><i className="fa-solid fa-user-group"></i></div>
                                <div className="pull-right">{users.length}</div>
                            </div>
                            <div className="tile-footer">
                                {users.filter(u => u.usertype === "normal").length} customers &nbsp;·&nbsp; {users.filter(u => u.usertype === "admin").length} admins
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <Link className="info-tile tile-green" to="/vieworders">
                            <div className="tile-heading">
                                <div className="pull-left">Orders</div>
                                <div className="pull-right"><i className="fa-solid fa-bag-shopping"></i></div>
                            </div>
                            <div className="tile-body">
                                <div className="pull-left"><i className="fa-solid fa-cart-shopping"></i></div>
                                <div className="pull-right">{orders.length}</div>
                            </div>
                            <div className="tile-footer">
                                {statusCount["pending"] || 0} pending &nbsp;·&nbsp; {statusCount["delivered"] || 0} delivered
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <Link className="info-tile tile-magenta" to="/vieworders">
                            <div className="tile-heading">
                                <div className="pull-left">Total Order Value</div>
                                <div className="pull-right"><i className="fa-solid fa-dollar-sign"></i></div>
                            </div>
                            <div className="tile-body">
                                <div className="pull-left"><i className="fa-solid fa-sack-dollar"></i></div>
                                <div className="pull-right">CA${Math.round(totalRevenue).toLocaleString("en-CA")}</div>
                            </div>
                            <div className="tile-footer">
                                CA${Math.round(deliveredRevenue).toLocaleString("en-CA")} delivered &nbsp;·&nbsp; CA${Math.round(pendingRevenue).toLocaleString("en-CA")} pending
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <Link className="info-tile tile-info" to="/products">
                            <div className="tile-heading">
                                <div className="pull-left">Products</div>
                                <div className="pull-right"><i className="fa-solid fa-box-open"></i></div>
                            </div>
                            <div className="tile-body">
                                <div className="pull-left"><i className="fa-solid fa-boxes-stacked"></i></div>
                                <div className="pull-right">{products.length}</div>
                            </div>
                            <div className="tile-footer">
                                {categories.length} categories
                            </div>
                        </Link>
                    </div>
                </div>

                {/* ── Order Status Summary ────────────────────────── */}
                <h3 className="title-w3l mt-5">Order Status Summary</h3>
                <div className="row mt-3">
                    {[
                        { label: "Pending", key: "pending", cls: "tile-magenta", icon: "fa-clock" },
                        { label: "Processing", key: "processing", cls: "tile-indigo", icon: "fa-rotate" },
                        { label: "Delivered", key: "delivered", cls: "tile-green", icon: "fa-circle-check" },
                        { label: "Cancelled", key: "cancelled", cls: "tile-info", icon: "fa-circle-xmark" },
                    ].map(s => (
                        <div className="col-md-3 col-sm-6" key={s.key}>
                            <Link className={`info-tile ${s.cls}`} to="/vieworders">
                                <div className="tile-heading">
                                    <div className="pull-left">{s.label}</div>
                                    <div className="pull-right"><i className={`fa-solid ${s.icon}`}></i></div>
                                </div>
                                <div className="tile-body">
                                    <div className="pull-right">{statusCount[s.key] || 0} orders</div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* ── Charts Row 1: Monthly Revenue Bar + Order Status Pie ── */}
                <h3 className="title-w3l mt-5">Performance Analytics</h3>
                <div className="row mt-4">
                    {/* Monthly Revenue & Orders Bar Chart */}
                    <div className="col-lg-7 mb-4">
                        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0e0e0", boxShadow: "0 2px 12px rgba(239,35,60,0.07)", padding: "24px 16px 16px" }}>
                            <h5 style={{ color: "#2b2d42", fontWeight: 700, marginBottom: 18, fontSize: 15 }}>
                                <i className="fa-solid fa-chart-column me-2" style={{ color: "#ef233c" }}></i>
                                Monthly Revenue (Last 6 Months)
                            </h5>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0e0e0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#2b2d42" }} />
                                    <YAxis tick={{ fontSize: 11, fill: "#888" }} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(1)+"k" : v}`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="Revenue" fill="#ef233c" radius={[4, 4, 0, 0]} name="Revenue (CA$)" />
                                    <Bar dataKey="Orders" fill="#2b2d42" radius={[4, 4, 0, 0]} name="Orders" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Status Pie Chart */}
                    <div className="col-lg-5 mb-4">
                        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0e0e0", boxShadow: "0 2px 12px rgba(239,35,60,0.07)", padding: "24px 16px 16px" }}>
                            <h5 style={{ color: "#2b2d42", fontWeight: 700, marginBottom: 18, fontSize: 15 }}>
                                <i className="fa-solid fa-chart-pie me-2" style={{ color: "#ef233c" }}></i>
                                Order Status Distribution
                            </h5>
                            {statusPieData.length === 0 ? (
                                <p className="text-center text-muted py-5">No order data yet</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={statusPieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={95}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {statusPieData.map((entry, i) => (
                                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [value + " orders", name]} />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Charts Row 2: City Revenue Bar + Payment Mode Pie ── */}
                <div className="row mt-2">
                    {/* Revenue by City */}
                    <div className="col-lg-7 mb-4">
                        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0e0e0", boxShadow: "0 2px 12px rgba(239,35,60,0.07)", padding: "24px 16px 16px" }}>
                            <h5 style={{ color: "#2b2d42", fontWeight: 700, marginBottom: 18, fontSize: 15 }}>
                                <i className="fa-solid fa-location-dot me-2" style={{ color: "#ef233c" }}></i>
                                Revenue by City (Top 6)
                            </h5>
                            {cityRevenue.length === 0 ? (
                                <p className="text-center text-muted py-5">No city data yet</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={cityRevenue} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0e0e0" horizontal={false} />
                                        <XAxis type="number" tick={{ fontSize: 11, fill: "#888" }} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(1)+"k" : v}`} />
                                        <YAxis type="category" dataKey="city" tick={{ fontSize: 12, fill: "#2b2d42" }} width={80} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="Revenue" name="Revenue (CA$)" radius={[0, 4, 4, 0]}>
                                            {cityRevenue.map((_, i) => (
                                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                            <LabelList dataKey="Revenue" position="right" formatter={v => `$${v >= 1000 ? (v/1000).toFixed(1)+"k" : v}`} style={{ fontSize: 11, fill: "#2b2d42" }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Payment Mode Pie */}
                    <div className="col-lg-5 mb-4">
                        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0e0e0", boxShadow: "0 2px 12px rgba(239,35,60,0.07)", padding: "24px 16px 16px" }}>
                            <h5 style={{ color: "#2b2d42", fontWeight: 700, marginBottom: 18, fontSize: 15 }}>
                                <i className="fa-solid fa-credit-card me-2" style={{ color: "#ef233c" }}></i>
                                Payment Methods
                            </h5>
                            {paymodePieData.length === 0 ? (
                                <p className="text-center text-muted py-5">No payment data yet</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={paymodePieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={95}
                                            dataKey="value"
                                            paddingAngle={3}
                                        >
                                            {paymodePieData.map((entry, i) => (
                                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [value + " orders", name]} />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Recent Orders ───────────────────────────────── */}
                <h3 className="title-w3l mt-3">Recent Orders</h3>
                <div className="mt-3">
                    <table className="table table-bordered table-striped table-hover" cellPadding="10px">
                        <thead className="table-dark">
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>City</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr><td colSpan={7} className="text-center text-muted py-4">No orders yet</td></tr>
                            ) : recentOrders.map(o => (
                                <tr key={o._id}>
                                    <td className="text-primary" style={{ fontFamily: "monospace", fontSize: 12 }}>{o._id?.slice(-10)}</td>
                                    <td><strong>{o.username}</strong></td>
                                    <td>{o.city}</td>
                                    <td className="text-danger fw-bold">CA${Number(o.billamt).toLocaleString("en-CA")}</td>
                                    <td>{o.paymode}</td>
                                    <td>
                                        <span className={`badge ${
                                            (o.status||"").toLowerCase()==="delivered" ? "bg-success" :
                                            (o.status||"").toLowerCase()==="processing" ? "bg-primary" :
                                            (o.status||"").toLowerCase().includes("processing") ? "bg-primary" :
                                            (o.status||"").toLowerCase()==="shipped" ? "bg-info" :
                                            (o.status||"").toLowerCase()==="cancelled" ? "bg-danger" : "bg-warning text-dark"
                                        }`}>{o.status || "Pending"}</span>
                                    </td>
                                    <td>
                                        <Link className="btn btn-style btn-primary" style={{ padding: "6px 14px", fontSize: 13 }} to={`/updatestatus?oid=${o._id}&currst=${o.status}`}>Update</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-end">
                        <Link to="/vieworders" className="btn btn-style btn-primary">View All Orders</Link>
                    </div>
                </div>

                {/* ── Recent Members ──────────────────────────────── */}
                <h3 className="title-w3l mt-5">Recent Members</h3>
                <div className="mt-3">
                    <table className="table table-bordered table-striped table-hover" cellPadding="10px">
                        <thead className="table-dark">
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentMembers.length === 0 ? (
                                <tr><td colSpan={4} className="text-center text-muted py-4">No members yet</td></tr>
                            ) : recentMembers.map(u => (
                                <tr key={u._id}>
                                    <td><strong>{u.username}</strong></td>
                                    <td>{u.email}</td>
                                    <td>{u.phone}</td>
                                    <td>
                                        <span className={`badge ${u.usertype === "admin" ? "bg-danger" : "bg-success"}`}>{u.usertype || "user"}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-end">
                        <Link to="/members" className="btn btn-style btn-primary">View All Members</Link>
                    </div>
                </div>

                {/* ── Quick Actions ───────────────────────────────── */}
                <h3 className="title-w3l mt-5">Quick Actions</h3>
                <div className="row mt-3 mb-5">
                    {[
                        { label: "Manage Members",     icon: "fa-users",          link: "/members"      },
                        { label: "View All Orders",    icon: "fa-bag-shopping",   link: "/vieworders"   },
                        { label: "Add Category",       icon: "fa-folder-plus",    link: "/category"     },
                        { label: "Add Sub Category",   icon: "fa-sitemap",        link: "/subcategory"  },
                        { label: "Add Product",        icon: "fa-box-open",       link: "/products"     },
                        { label: "Create Admin",       icon: "fa-user-shield",    link: "/createadmin"  },
                        { label: "Search User",        icon: "fa-magnifying-glass",link: "/searchuser"  },
                        { label: "Update Order Status",icon: "fa-pen-to-square",  link: "/vieworders"   },
                    ].map(a => (
                        <div className="col-md-3 col-sm-6 mb-3" key={a.label}>
                            <Link to={a.link} className="btn btn-style btn-primary w-100">
                                <i className={`fa-solid ${a.icon} me-2`}></i>{a.label}
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
};
