/**
 * ShoppyKart — Order Seed Script
 * Generates realistic sample orders in the checkout collection.
 * Run: node seedorders.js
 */

const mongoose = require("mongoose");

const DB_URL = "mongodb://127.0.0.1:27017/record";

const CheckoutSchema = new mongoose.Schema(
    { name: String, city: String, phone: String, address: String, billamt: String, paymode: String, username: String, orderdate: String, status: String },
    { versionKey: false }
);
const CheckoutModel = mongoose.model("checkout", CheckoutSchema, "checkout");

const CUSTOMERS = [
    { username: "alice_ca",   name: "Alice Tremblay",    city: "Toronto",    phone: "4165550101", address: "12 Maple St, Toronto ON M4B 1B4" },
    { username: "bob_ca",     name: "Bob Nguyen",         city: "Vancouver",  phone: "6045550202", address: "88 Pacific Blvd, Vancouver BC V6Z 1W6" },
    { username: "carol_ca",   name: "Carol MacDonald",    city: "Montreal",   phone: "5145550303", address: "34 Rue Saint-Denis, Montreal QC H2X 3J5" },
    { username: "david_ca",   name: "David Okonkwo",      city: "Calgary",    phone: "4035550404", address: "200 Bow Valley Trail, Calgary AB T3Z 3J2" },
    { username: "emma_ca",    name: "Emma Lalonde",       city: "Ottawa",     phone: "6135550505", address: "55 Wellington St, Ottawa ON K1A 0A4" },
    { username: "frank_ca",   name: "Frank Johansson",    city: "Edmonton",   phone: "7805550606", address: "10 Jasper Ave, Edmonton AB T5J 1S8" },
    { username: "grace_ca",   name: "Grace Kim",          city: "Winnipeg",   phone: "2045550707", address: "300 Portage Ave, Winnipeg MB R3C 0B9" },
    { username: "henry_ca",   name: "Henry Beauchamp",    city: "Halifax",    phone: "9025550808", address: "1 Grafton St, Halifax NS B3J 2N1" },
    { username: "iris_ca",    name: "Iris Patel",         city: "Mississauga",phone: "9055550909", address: "77 City Centre Dr, Mississauga ON L5B 1M5" },
    { username: "james_ca",   name: "James Thornton",     city: "Brampton",   phone: "9055551010", address: "45 Bovaird Dr W, Brampton ON L7A 1E2" },
];

const PRODUCTS = [
    { name: "iPhone 15 Pro",             amt: 1649 },
    { name: "Samsung Galaxy S24 Ultra",  amt: 1599 },
    { name: "MacBook Air M3",            amt: 1499 },
    { name: "Sony WH-1000XM5",          amt: 449  },
    { name: "Apple AirPods Pro 2",       amt: 329  },
    { name: "Nike Air Max 270",          amt: 185  },
    { name: "Adidas Ultraboost 23",      amt: 240  },
    { name: "Apple Watch Series 9",      amt: 549  },
    { name: "Dell XPS 15",              amt: 2199 },
    { name: "Dyson Supersonic Hair Dryer", amt: 499 },
    { name: "Ray-Ban Aviator Classic",   amt: 249  },
    { name: "Fossil Gen 6 Smartwatch",   amt: 299  },
    { name: "HP Pavilion 15",           amt: 899  },
    { name: "OnePlus 12",               amt: 999  },
    { name: "Puma RS-X",               amt: 130  },
    { name: "Clarks Oxford Leather Shoes", amt: 179 },
    { name: "Yoga Mat Premium 6mm",      amt: 39   },
    { name: "Adjustable Dumbbell Set 20kg", amt: 149 },
    { name: "NYX Eyeshadow Palette",     amt: 35   },
    { name: "Classic Slim Fit Shirt",    amt: 39   },
];

const PAYMODES = ["COD", "Credit Card", "Debit Card", "UPI", "Net Banking", "PayPal"];
const STATUSES = ["Payment Received, Processing", "Processing", "Shipped", "Delivered", "Cancelled", "Pending"];

// Weighted status distribution for realistic data
const STATUS_WEIGHTS = [
    { status: "Delivered",                   weight: 35 },
    { status: "Payment Received, Processing",weight: 20 },
    { status: "Shipped",                     weight: 18 },
    { status: "Pending",                     weight: 12 },
    { status: "Processing",                  weight: 10 },
    { status: "Cancelled",                   weight: 5  },
];

function weightedStatus() {
    const total = STATUS_WEIGHTS.reduce((s, w) => s + w.weight, 0);
    let r = Math.random() * total;
    for (const w of STATUS_WEIGHTS) { r -= w.weight; if (r <= 0) return w.status; }
    return "Pending";
}

function randomDate(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
    d.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60));
    return d.toISOString();
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateBillAmt() {
    // Pick 1–4 random products, add service charge
    const count = Math.floor(Math.random() * 3) + 1;
    let total = 0;
    for (let i = 0; i < count; i++) total += pick(PRODUCTS).amt;
    // Apply random discount 0–15%
    total = Math.round(total * (1 - Math.random() * 0.15));
    total += 10; // service charge
    return String(total);
}

async function seed() {
    console.log("Connecting to MongoDB…");
    await mongoose.connect(DB_URL);
    console.log("Connected.\n");

    // Clear existing orders
    const deleted = await CheckoutModel.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing orders.\n`);

    const orders = [];

    // Generate 60 orders spread over the last 90 days
    for (let i = 0; i < 60; i++) {
        const customer = pick(CUSTOMERS);
        orders.push({
            name:      customer.name,
            city:      customer.city,
            phone:     customer.phone,
            address:   customer.address,
            billamt:   generateBillAmt(),
            paymode:   pick(PAYMODES),
            username:  customer.username,
            orderdate: randomDate(90),
            status:    weightedStatus(),
        });
    }

    // Sort by date so IDs are chronological
    orders.sort((a, b) => new Date(a.orderdate) - new Date(b.orderdate));

    await CheckoutModel.insertMany(orders);

    // Print summary
    const statusSummary = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
    const totalRevenue = orders.reduce((s, o) => s + Number(o.billamt), 0);

    console.log(`✔ Inserted ${orders.length} orders`);
    console.log(`  Total Revenue: CA$${totalRevenue.toLocaleString("en-CA")}`);
    console.log("\nStatus breakdown:");
    Object.entries(statusSummary).forEach(([s, c]) => console.log(`  ${s}: ${c}`));

    await mongoose.disconnect();
    console.log("\nDone.");
    process.exit(0);
}

seed().catch(err => {
    console.error("Seed failed:", err.message);
    mongoose.disconnect();
    process.exit(1);
});
