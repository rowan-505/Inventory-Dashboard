import { Package, AlertTriangle, DollarSign } from "lucide-react";

export default function Summary({ products = [] }) {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(
        (product) => product.stock < 5
    ).length;
    const totalValue = products.reduce(
        (sum, product) => sum + product.price * product.stock,
        0
    );
    console.log("Summary products:", products);

    return (
        <div className="bg-slate-200  dark:bg-slate-900 p-4 mb-8 rounded-2xl shadow-md">
            <h1 className="text-slate-700 text-xl font-bold dark:text-slate-200 mb-6  ">
                Inventory Overview
            </h1>

            <div className="grid grid-cols-3 gap-4">
                <div className="flex gap-4  items-center justify-between p-6 text-center bg-blue-200  dark:bg-slate-800 dark:text-slate-200 rounded-2xl shadow hover:shadow-lg transition">
                    <Package className="text-blue-500" />

                    <div>
                        <p className="text-sm">Total Products</p>

                        <h2
                            className="
                        text-2xl font-bold
                        "
                        >
                            {totalProducts}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center justify-between p-6 text-center bg-red-200  dark:bg-slate-800 dark:text-slate-200 rounded-2xl shadow hover:shadow-lg transition">
                    <AlertTriangle className="text-red-500" />
                    <div>
                        <p className="text-sm">Low Stock Products</p>
                        <h2 className="text-2xl font-bold">
                            {lowStockProducts}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center justify-between p-6 text-center bg-green-200 dark:bg-slate-800 dark:text-slate-200 rounded-2xl shadow hover:shadow-lg transition">
                    <DollarSign className="text-green-500" />

                    <div>
                        <p className="text-sm">Total Value</p>

                        <h2
                            className="
                        text-2xl font-bold
                        "
                        >
                            ${totalValue.toFixed(2)}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
