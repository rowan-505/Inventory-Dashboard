import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import Summary from "../components/Summary";
import Axios from "axios";

export default function Home() {
    const [products, setProducts] = useState([]);

    const API_URL = "https://dummyjson.com/products";
    useEffect(() => {
        Axios.get(API_URL)
            .then((res) => {
                setProducts(res.data.products);
                console.log(res.data.products);
            })
            .catch((err) => {
                console.error("Error fetching products", err);
            });
    }, []);

    console.log("Home products:", products);
    return (
        <div
            className="min-h-screen bg-slate-100 p-2 text-slate-800
            dark:bg-slate-900 dark:text-slate-100"
        >
            <Navbar />
            <Summary products={products} />
            <ProductList
                products={products}
                setProducts={setProducts}
                API_URL={API_URL}
            />
        </div>
    );
}
