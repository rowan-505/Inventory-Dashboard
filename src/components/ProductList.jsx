import { useState, useRef, useEffect } from "react";

import Axios from "axios";

export default function ProductList({
    products,
    setProducts,
    API_URL,
    filter,
}) {
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        sku: "",
        price: "",
        stock: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    const [sort, setSort] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedSearch === "") {
            Axios.get(API_URL)
                .then((res) => setProducts(res.data.products))
                .catch((err) => console.error("Error fetching products", err));
        } else {
            Axios.get(`${API_URL}/search?q=${debouncedSearch}`)
                .then((res) => {
                    setProducts(res.data.products);
                    if (res.data.products.length === 0) {
                        console.log(
                            "No products found for search term:",
                            debouncedSearch
                        );
                    }
                })
                .catch((err) => console.error("Error searching products", err));
        }
    }, [debouncedSearch]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                setShowForm(false);
                setShowSortOptions(false);
                setEditId(null);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowSortOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAddButtonClick = () => {
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCreateProduct = () => {
        Axios.post(`${API_URL}/add`, formData)
            .then((res) => {
                const { id, ...rest } = res.data; // remove API id
                console.log("API response:", res.data);
                console.log("id from API:", id);
                const newProduct = {
                    ...rest,
                    id: crypto.randomUUID(),
                };
                console.log("New productid to add:", newProduct.id);
                setProducts((prevProducts) => [...prevProducts, newProduct]);

                setFormData({
                    title: "",
                    sku: "",
                    price: "",
                    stock: "",
                });

                setShowForm(false);

                console.log("Product created:", newProduct);
            })
            .catch((err) => {
                console.error("Error creating product", err);
            });
    };

    const handleUpdateButtonClick = (id) => {
        setEditId(id);
        const productToEdit = products.find((product) => product.id === id);
        if (productToEdit) {
            setFormData({
                title: productToEdit.title,
                sku: productToEdit.sku,
                price: productToEdit.price,
                stock: productToEdit.stock,
            });
        }
        setShowForm(true);
    };

    const handleUpdateProduct = () => {
        Axios.put(`${API_URL}/${editId}`, formData)
            .then(() => {
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === editId
                            ? { ...product, ...formData }
                            : product
                    )
                );
                setFormData({
                    title: "",
                    sku: "",
                    price: "",
                    stock: "",
                });
                setShowForm(false);
                setEditId(null);
            })
            .catch((err) => {
                console.error("Error updating product", err);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editId ? handleUpdateProduct() : handleCreateProduct();
    };

    const handleDeleteProduct = (id) => {
        console.log("Deleting product with id:", id);
        Axios.delete(`${API_URL}/${id}`)
            .then(() => {
                setProducts((prevProducts) =>
                    prevProducts.filter((product) => product.id !== id)
                );
                // if manually added product with random id, we need to remove it just from UI immediately
            })
            .catch((err) => {
                console.error("Error deleting product", err);
            });
        setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== id)
        );
    };

    let filteredProducts = products;
    if (filter === "lowStock") {
        filteredProducts = products.filter((product) => product.stock < 5);
    }
    switch (sort) {
        case "price":
            filteredProducts = [...filteredProducts].sort(
                (a, b) => a.price - b.price
            );
            break;
        case "stock":
            filteredProducts = [...filteredProducts].sort(
                (a, b) => a.stock - b.stock
            );
            break;
        case "title":
            filteredProducts = [...filteredProducts].sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            break;
    }

    return (
        <>
            {showForm && (
                <div
                    onClick={() => setShowForm(false)}
                    className="fixed inset-0 bg-black/3 backdrop-blur-sm flex items-center justify-center z-50 "
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className=" p-6 rounded-2xl shadow-2xl w-96  backdrop-blur-xl bg-white/30"
                    >
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                            {editId ? "Edit Product" : "Add Product"}
                        </h2>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-3"
                        >
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Product Title"
                                className=" p-2  w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                placeholder="SKU"
                                className=" p-2  w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="Price"
                                className=" p-2  w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="Stock"
                                className=" p-2  w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex justify-end gap-2 mt-3">
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditId(null);
                                    }}
                                    className="bg-slate-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
                                >
                                    {editId ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-around items-center m-6 rounded bg-slate-100 dark:bg-slate-900">
                <div className="text-2xl text-slate-700 dark:text-slate-200 font-bold m-2">
                    {filter === "lowStock"
                        ? "Low Stock Products"
                        : "Total Products"}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-3   rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setShowSortOptions(!showSortOptions)}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                    >
                        Sort ({""}
                        {sort
                            ? sort.charAt(0).toUpperCase() + sort.slice(1)
                            : "Default"}
                        )
                    </button>
                    {showSortOptions && (
                        <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-slate-700 rounded-lg shadow-lg">
                            <button
                                onClick={() => {
                                    setSort("");
                                    setShowSortOptions(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-600"
                            >
                                Default
                            </button>
                            <button
                                onClick={() => {
                                    setSort("price");
                                    setShowSortOptions(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-600"
                            >
                                Price
                            </button>
                            <button
                                onClick={() => {
                                    setSort("stock");
                                    setShowSortOptions(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-600"
                            >
                                Stock
                            </button>
                            <button
                                onClick={() => {
                                    setSort("title");
                                    setShowSortOptions(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-600"
                            >
                                Title
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAddButtonClick}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                >
                    Add Product
                </button>
            </div>
            <table className="w-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden dark:text-white ">
                <thead className="bg-slate-200 dark:bg-slate-700 h-12 text-slate-800 dark:text-slate-100">
                    <tr>
                        <th>Title</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className=" h-15">
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center p-4">
                                No products found
                            </td>
                        </tr>
                    ) : (
                        filteredProducts.map((product) => (
                            <tr
                                key={product.id}
                                className="text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                                <td>{product.title}</td>
                                <td>{product.sku}</td>
                                <td>${product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleUpdateButtonClick(product.id)
                                        }
                                        className="bg-amber-500 text-white px-4 py-2 rounded-lg m-2 hover:bg-amber-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteProduct(product.id)
                                        }
                                        className="bg-red-500 text-white px-2 py-2 rounded-lg hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    );
}
