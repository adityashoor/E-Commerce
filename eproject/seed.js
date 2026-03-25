/**
 * ShoppyKart Database Seed Script
 * Run: node seed.js
 * Images: loremflickr.com — keyword-specific, lock=N for determinism
 */

const mongoose = require("mongoose");
const https = require("https");
const http  = require("http");
const fs    = require("fs");
const path  = require("path");

const FRONTEND_IDATA = path.join(__dirname, "..", "eproject2", "eproject", "public", "idata");
const IDATA_DIR = fs.existsSync(FRONTEND_IDATA) ? FRONTEND_IDATA : path.join(__dirname, "public", "idata");
const DB_URL = "mongodb://127.0.0.1:27017/record";

const CategorySchema    = new mongoose.Schema({ catname: String, catpic: String }, { versionKey: false });
const SubCategorySchema = new mongoose.Schema({ catid: String, subcatname: String, subcatpic: String }, { versionKey: false });
const ProductSchema     = new mongoose.Schema({
    catid: String, subcatid: String, productname: String, rate: String,
    discount: String, description: String, stock: Number,
    featuredproduct: String, productpic: String
}, { versionKey: false });

const CategoryModel    = mongoose.model("category", CategorySchema, "category");
const SubCategoryModel = mongoose.model("subcategory", SubCategorySchema, "subcategory");
const ProductModel     = mongoose.model("Product", ProductSchema, "Product");

// ── Downloader with redirect + size check ─────────────────────────────────────
function downloadImage(url, filename, depth) {
    depth = depth || 0;
    if (depth > 10) return Promise.reject(new Error("Too many redirects"));

    return new Promise((resolve, reject) => {
        const dest = path.join(IDATA_DIR, filename);
        if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) { resolve(filename); return; }
        if (fs.existsSync(dest)) fs.unlinkSync(dest);  // delete 0-byte or tiny files

        let parsedUrl;
        try { parsedUrl = new URL(url); } catch (e) { reject(e); return; }

        const options = {
            hostname: parsedUrl.hostname,
            port:     parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
            path:     parsedUrl.pathname + parsedUrl.search,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept":     "image/jpeg,image/*,*/*",
            }
        };

        const get = parsedUrl.protocol === "https:" ? https : http;
        const req = get.get(options, (res) => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
                res.resume(); // drain response
                let loc = res.headers.location || "";
                if (!loc.startsWith("http")) loc = `${parsedUrl.protocol}//${parsedUrl.hostname}${loc}`;
                downloadImage(loc, filename, depth + 1).then(resolve).catch(reject);
                return;
            }
            if (res.statusCode !== 200) {
                res.resume();
                reject(new Error(`HTTP ${res.statusCode}`));
                return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on("finish", () => {
                file.close(() => {
                    const size = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
                    if (size < 1000) {
                        fs.unlinkSync(dest);
                        reject(new Error(`Tiny file (${size} bytes) — blocked`));
                    } else {
                        resolve(filename);
                    }
                });
            });
            file.on("error", (e) => { if (fs.existsSync(dest)) fs.unlinkSync(dest); reject(e); });
        });
        req.on("error", (e) => { if (fs.existsSync(dest)) fs.unlinkSync(dest); reject(e); });
        req.setTimeout(15000, () => { req.abort(); reject(new Error("Timeout")); });
    });
}

// loremflickr: keyword-based, ?lock=N keeps the same image each run
// Single keywords only — no commas (avoids Node.js URL parse issues)
const lf = (keyword, lock, w, h) =>
    `https://loremflickr.com/${w||400}/${h||400}/${keyword}?lock=${lock||1}`;

// ── Seed data with relevant loremflickr image keywords ────────────────────────
const SEED = [
    {
        catname: "Electronics",
        catpic_url: lf("electronics", 1, 600, 400),
        subcategories: [
            {
                subcatname: "Smartphones",
                subcatpic_url: lf("smartphone", 1),
                products: [
                    { productname: "iPhone 15 Pro",            rate: "1649", discount: "5",  stock: 25,  featuredproduct: "yes", description: "Apple iPhone 15 Pro with A17 Pro chip, 48MP main camera, titanium design, and USB-C connectivity.",           productpic_url: lf("iphone", 1) },
                    { productname: "Samsung Galaxy S24 Ultra",  rate: "1599", discount: "8",  stock: 18,  featuredproduct: "yes", description: "Samsung Galaxy S24 Ultra with 200MP camera, built-in S Pen, Snapdragon 8 Gen 3, and 5000mAh battery.",        productpic_url: lf("samsung", 1) },
                    { productname: "OnePlus 12",                rate: "999",  discount: "10", stock: 30,  featuredproduct: "no",  description: "OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera system, and 100W SUPERVOOC charging.",                  productpic_url: lf("smartphone", 2) },
                ],
            },
            {
                subcatname: "Laptops",
                subcatpic_url: lf("laptop", 1),
                products: [
                    { productname: "MacBook Air M3",  rate: "1499", discount: "5",  stock: 15, featuredproduct: "yes", description: "Apple MacBook Air with M3 chip, 13.6-inch Liquid Retina display, up to 18 hours battery life.",      productpic_url: lf("macbook", 1) },
                    { productname: "Dell XPS 15",     rate: "2199", discount: "7",  stock: 10, featuredproduct: "no",  description: "Dell XPS 15 with Intel Core i9, NVIDIA RTX 4060, 15.6-inch OLED touch display.",                    productpic_url: lf("laptop", 2) },
                    { productname: "HP Pavilion 15",  rate: "899",  discount: "12", stock: 22, featuredproduct: "no",  description: "HP Pavilion 15 with AMD Ryzen 7, 512GB SSD, and Full HD micro-edge display.",                        productpic_url: lf("laptop", 3) },
                ],
            },
            {
                subcatname: "Headphones",
                subcatpic_url: lf("headphones", 1),
                products: [
                    { productname: "Sony WH-1000XM5",     rate: "449", discount: "15", stock: 40, featuredproduct: "yes", description: "Sony WH-1000XM5 with industry-leading noise cancellation, 30-hour battery, and Hi-Res Audio.",    productpic_url: lf("headphones", 2) },
                    { productname: "Apple AirPods Pro 2",  rate: "329", discount: "10", stock: 35, featuredproduct: "no",  description: "AirPods Pro 2 with Active Noise Cancellation, H2 chip, and 30 hours total battery with case.",    productpic_url: lf("earphones", 1) },
                ],
            },
        ],
    },
    {
        catname: "Clothing & Fashion",
        catpic_url: lf("fashion", 1, 600, 400),
        subcategories: [
            {
                subcatname: "Men's Wear",
                subcatpic_url: lf("menswear", 1),
                products: [
                    { productname: "Classic Slim Fit Shirt", rate: "39", discount: "20", stock: 100, featuredproduct: "yes", description: "Premium cotton slim fit formal shirt for men. Available in multiple colours. Perfect for office.",        productpic_url: lf("shirt", 1) },
                    { productname: "Chino Trousers",          rate: "55", discount: "15", stock: 80,  featuredproduct: "no",  description: "Comfortable stretch chino trousers with a modern slim fit. Made from 97% cotton and 3% elastane.",       productpic_url: lf("trousers", 1) },
                    { productname: "Casual Polo T-Shirt",     rate: "29", discount: "25", stock: 120, featuredproduct: "yes", description: "Premium pique polo shirt with ribbed collar and cuffs. Suitable for semi-formal and casual occasions.", productpic_url: lf("polo", 1) },
                ],
            },
            {
                subcatname: "Women's Wear",
                subcatpic_url: lf("womenswear", 1),
                products: [
                    { productname: "Floral Wrap Dress", rate: "65", discount: "18", stock: 60, featuredproduct: "yes", description: "Elegant floral wrap dress with adjustable tie waist, V-neckline, and flutter sleeves. Lightweight chiffon.",       productpic_url: lf("dress", 1) },
                    { productname: "High Waist Jeans",  rate: "49", discount: "20", stock: 75, featuredproduct: "no",  description: "Stretchable high-waist skinny jeans with a classic 5-pocket design. Premium denim with elastane for comfort.",      productpic_url: lf("jeans", 1) },
                    { productname: "Embroidered Kurti", rate: "35", discount: "10", stock: 90, featuredproduct: "no",  description: "Beautiful hand-embroidered cotton kurti with intricate designs. Perfect for festive occasions and daily wear.",     productpic_url: lf("ethnic", 1) },
                ],
            },
            {
                subcatname: "Kids' Wear",
                subcatpic_url: lf("children", 1),
                products: [
                    { productname: "Kids Cartoon Printed T-Shirt", rate: "19", discount: "30", stock: 150, featuredproduct: "no",  description: "Soft 100% cotton cartoon printed t-shirt for kids. Available in sizes 2-12 years.",             productpic_url: lf("kids", 1) },
                    { productname: "Kids Denim Dungaree",           rate: "29", discount: "25", stock: 70,  featuredproduct: "yes", description: "Trendy denim dungaree for kids with adjustable straps and multiple pockets. Durable for play.", productpic_url: lf("children", 2) },
                ],
            },
        ],
    },
    {
        catname: "Footwear",
        catpic_url: lf("shoes", 1, 600, 400),
        subcategories: [
            {
                subcatname: "Sneakers",
                subcatpic_url: lf("sneakers", 1),
                products: [
                    { productname: "Nike Air Max 270",     rate: "185", discount: "10", stock: 45, featuredproduct: "yes", description: "Nike Air Max 270 with the largest heel Air unit, exceptional comfort, and breathable mesh upper.", productpic_url: lf("nike", 1) },
                    { productname: "Adidas Ultraboost 23", rate: "240", discount: "12", stock: 30, featuredproduct: "yes", description: "Adidas Ultraboost 23 with responsive BOOST midsole, Primeknit upper, and Continental rubber outsole.", productpic_url: lf("adidas", 1) },
                    { productname: "Puma RS-X",            rate: "130", discount: "20", stock: 55, featuredproduct: "no",  description: "Puma RS-X with bold retro design, RS technology cushioning, and leather and mesh upper.", productpic_url: lf("sneakers", 2) },
                ],
            },
            {
                subcatname: "Formal Shoes",
                subcatpic_url: lf("oxford", 1),
                products: [
                    { productname: "Clarks Oxford Leather Shoes", rate: "179", discount: "15", stock: 35, featuredproduct: "no", description: "Classic Oxford leather shoes with cushioned insole. Perfect for office, weddings, and formal events.", productpic_url: lf("oxford", 2) },
                    { productname: "Red Tape Derby Shoes",         rate: "99",  discount: "25", stock: 40, featuredproduct: "no", description: "Genuine leather derby shoes with brogue detailing, lace-up closure, and lightweight rubber sole.", productpic_url: lf("leather", 1) },
                ],
            },
            {
                subcatname: "Sandals & Slippers",
                subcatpic_url: lf("sandals", 1),
                products: [
                    { productname: "Crocs Classic Clog",    rate: "65", discount: "10", stock: 80,  featuredproduct: "yes", description: "Iconic Crocs Classic Clog made with Croslite foam. Lightweight, water-friendly, and odour resistant.", productpic_url: lf("sandals", 2) },
                    { productname: "Bata Men's Flip Flops", rate: "19", discount: "30", stock: 120, featuredproduct: "no",  description: "Comfortable EVA flip flops with anti-skid sole and soft footbed. Perfect for home, beach, and casual use.", productpic_url: lf("slippers", 1) },
                ],
            },
        ],
    },
    {
        catname: "Accessories",
        catpic_url: lf("accessories", 1, 600, 400),
        subcategories: [
            {
                subcatname: "Watches",
                subcatpic_url: lf("watch", 1),
                products: [
                    { productname: "Apple Watch Series 9",   rate: "549", discount: "5",  stock: 20, featuredproduct: "yes", description: "Apple Watch Series 9 with S9 chip, always-on Retina display, blood oxygen sensor, and ECG app.", productpic_url: lf("smartwatch", 1) },
                    { productname: "Fossil Gen 6 Smartwatch", rate: "299", discount: "15", stock: 25, featuredproduct: "no",  description: "Fossil Gen 6 with Wear OS, Snapdragon 4100+, SpO2 sensor, and rapid charging.", productpic_url: lf("watch", 2) },
                    { productname: "Titan Analog Watch",      rate: "89",  discount: "20", stock: 50, featuredproduct: "no",  description: "Titan Edge analog watch with ultra-slim ceramic dial, sapphire crystal glass, and genuine leather strap.", productpic_url: lf("watch", 3) },
                ],
            },
            {
                subcatname: "Sunglasses",
                subcatpic_url: lf("sunglasses", 1),
                products: [
                    { productname: "Ray-Ban Aviator Classic", rate: "249", discount: "10", stock: 40, featuredproduct: "yes", description: "Iconic Ray-Ban Aviator with gold metal frame and G-15 glass lens with 100% UV protection.", productpic_url: lf("sunglasses", 2) },
                    { productname: "Polaroid Wayfarer",        rate: "59",  discount: "15", stock: 60, featuredproduct: "no",  description: "Stylish wayfarer sunglasses with polarised lenses, UV400 protection, and lightweight plastic frame.", productpic_url: lf("sunglasses", 3) },
                ],
            },
            {
                subcatname: "Bags & Wallets",
                subcatpic_url: lf("bag", 1),
                products: [
                    { productname: "Wildcraft Backpack 30L", rate: "65", discount: "18", stock: 55,  featuredproduct: "no",  description: "Wildcraft 30L backpack with laptop compartment, rain cover, and ergonomic padded shoulder straps.", productpic_url: lf("backpack", 1) },
                    { productname: "Leather Bifold Wallet",  rate: "29", discount: "20", stock: 100, featuredproduct: "yes", description: "Genuine leather bifold wallet with 8 card slots, 2 currency compartments, and RFID blocking.", productpic_url: lf("wallet", 1) },
                ],
            },
        ],
    },
    {
        catname: "Sports & Fitness",
        catpic_url: lf("fitness", 1, 600, 400),
        subcategories: [
            {
                subcatname: "Gym Equipment",
                subcatpic_url: lf("gym", 1),
                products: [
                    { productname: "Adjustable Dumbbell Set 20kg", rate: "149", discount: "15", stock: 30,  featuredproduct: "no",  description: "Adjustable dumbbell set 2kg to 20kg. Cast iron with chrome plated handles. Includes carry case.", productpic_url: lf("dumbbells", 1) },
                    { productname: "Yoga Mat Premium 6mm",          rate: "39",  discount: "20", stock: 80,  featuredproduct: "yes", description: "Non-slip premium TPE yoga mat, 6mm thick, with alignment lines. Eco-friendly and sweat-resistant.", productpic_url: lf("yoga", 1) },
                    { productname: "Resistance Bands Set",           rate: "25",  discount: "25", stock: 100, featuredproduct: "no",  description: "Set of 5 resistance bands (10-50 lbs) made from 100% natural latex. For all fitness levels.", productpic_url: lf("exercise", 1) },
                ],
            },
            {
                subcatname: "Sportswear",
                subcatpic_url: lf("sportswear", 1),
                products: [
                    { productname: "Nike Dri-FIT T-Shirt", rate: "49", discount: "10", stock: 90, featuredproduct: "yes", description: "Nike Dri-FIT technology moves sweat away for dry and comfortable performance during workouts.", productpic_url: lf("sportswear", 2) },
                    { productname: "Track Pants Pro",       rate: "45", discount: "15", stock: 70, featuredproduct: "no",  description: "Comfortable track pants with moisture-wicking fabric, elastic waistband, and zippered pockets.", productpic_url: lf("running", 1) },
                ],
            },
            {
                subcatname: "Outdoor & Adventure",
                subcatpic_url: lf("camping", 1),
                products: [
                    { productname: "Quechua Camping Tent 2 Person", rate: "149", discount: "12", stock: 20, featuredproduct: "no", description: "Quechua 2-person camping tent with UV protection, waterproof 2000mm rating, quick pitch design.", productpic_url: lf("tent", 1) },
                    { productname: "Trekking Pole Set",              rate: "55",  discount: "20", stock: 35, featuredproduct: "no", description: "Lightweight aluminium trekking poles with cork handles, adjustable height 60-130cm.", productpic_url: lf("hiking", 1) },
                ],
            },
        ],
    },
    {
        catname: "Beauty & Personal Care",
        catpic_url: lf("beauty", 1, 600, 400),
        subcategories: [
            {
                subcatname: "Skincare",
                subcatpic_url: lf("skincare", 1),
                products: [
                    { productname: "Neutrogena Hydrating Serum", rate: "25", discount: "10", stock: 60,  featuredproduct: "yes", description: "Neutrogena Hydro Boost hyaluronic acid serum. Instantly hydrates and locks in moisture for 72 hours.", productpic_url: lf("serum", 1) },
                    { productname: "Lakme Sun Expert SPF 50",    rate: "15", discount: "15", stock: 90,  featuredproduct: "no",  description: "Lakme Sun Expert SPF 50 PA+++ sunscreen. Lightweight, non-greasy, for daily use under makeup.", productpic_url: lf("skincare", 2) },
                    { productname: "Himalaya Neem Face Wash",    rate: "9",  discount: "5",  stock: 200, featuredproduct: "no",  description: "Himalaya Purifying Neem Face Wash with neem and turmeric. Controls oil and unclogs pores.", productpic_url: lf("facewash", 1) },
                ],
            },
            {
                subcatname: "Haircare",
                subcatpic_url: lf("haircare", 1),
                products: [
                    { productname: "Dyson Supersonic Hair Dryer",    rate: "499", discount: "8",  stock: 15,  featuredproduct: "yes", description: "Dyson Supersonic with intelligent heat control, fast drying, and multiple styling attachments.", productpic_url: lf("hairdryer", 1) },
                    { productname: "TRESemmé Shampoo + Conditioner", rate: "19",  discount: "20", stock: 100, featuredproduct: "no",  description: "TRESemmé Keratin Smooth shampoo and conditioner combo. Tames frizz, makes hair 3x smoother.", productpic_url: lf("shampoo", 1) },
                ],
            },
            {
                subcatname: "Makeup",
                subcatpic_url: lf("makeup", 1),
                products: [
                    { productname: "Maybelline Fit Me Foundation", rate: "19", discount: "15", stock: 75,  featuredproduct: "yes", description: "Maybelline Fit Me Matte + Poreless Foundation with 24-hour wear and oil-control. 40 shades.", productpic_url: lf("foundation", 1) },
                    { productname: "Lakme 9 to 5 Lipstick",        rate: "15", discount: "10", stock: 110, featuredproduct: "no",  description: "Lakme 9 to 5 Primer + Matte Lip Color with 16-hour wear, smooth application, 30 shades.", productpic_url: lf("lipstick", 1) },
                    { productname: "NYX Eyeshadow Palette",         rate: "35", discount: "12", stock: 45,  featuredproduct: "no",  description: "NYX Professional 16-shade eyeshadow palette — matte, satin, and shimmer finishes.", productpic_url: lf("eyeshadow", 1) },
                ],
            },
        ],
    },
];

async function seed() {
    console.log("Connecting to MongoDB…");
    await mongoose.connect(DB_URL);
    console.log("Connected.\n");

    await CategoryModel.deleteMany({});
    await SubCategoryModel.deleteMany({});
    await ProductModel.deleteMany({});
    console.log("Cleared existing data.\n");

    let totalProducts = 0;

    for (const cat of SEED) {
        process.stdout.write(`Downloading [${cat.catname}]… `);
        const catPic = `seed_cat_${cat.catname.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;
        try { await downloadImage(cat.catpic_url, catPic); console.log("OK"); }
        catch (e) { console.log(`FAILED: ${e.message}`); }

        const catDoc = await CategoryModel.create({ catname: cat.catname, catpic: catPic });
        console.log(`  ✔ ${cat.catname}`);

        for (const sub of cat.subcategories) {
            process.stdout.write(`    [${sub.subcatname}]… `);
            const subPic = `seed_sub_${sub.subcatname.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;
            try { await downloadImage(sub.subcatpic_url, subPic); console.log("OK"); }
            catch (e) { console.log(`FAILED: ${e.message}`); }

            const subDoc = await SubCategoryModel.create({
                catid: String(catDoc._id), subcatname: sub.subcatname, subcatpic: subPic
            });

            for (const prod of sub.products) {
                process.stdout.write(`      [${prod.productname}]… `);
                const prodPic = `seed_prod_${prod.productname.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;
                try { await downloadImage(prod.productpic_url, prodPic); console.log("OK"); }
                catch (e) { console.log(`FAILED: ${e.message}`); }

                await ProductModel.create({
                    catid: String(catDoc._id), subcatid: String(subDoc._id),
                    productname: prod.productname, rate: prod.rate, discount: prod.discount,
                    description: prod.description, stock: prod.stock,
                    featuredproduct: prod.featuredproduct, productpic: prodPic,
                });
                console.log(`        ✔ ${prod.productname}`);
                totalProducts++;
            }
        }
        console.log("");
    }

    console.log("─────────────────────────────────────────────────");
    console.log(`Seed complete! ${SEED.length} cats · ${SEED.reduce((s,c)=>s+c.subcategories.length,0)} subcats · ${totalProducts} products`);
    console.log("─────────────────────────────────────────────────");
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed failed:", err.message);
    mongoose.disconnect();
    process.exit(1);
});
