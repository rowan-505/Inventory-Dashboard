export default function ProductDetails({ product, onClose }) {
    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black/3 backdrop-blur-sm flex items-center justify-center z-500 ">
            <div
                onClick={(e) => e.stopPropagation()}
                className=" flex flex-col items-center justify-center p-10 rounded-2xl shadow-2xl w-auto  backdrop-blur-xl bg-white/30 "
            >
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-48 h-48 object-cover rounded-lg mb-6"
                />
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    {product.title}
                </h2>

                <p className="text-slate-600 dark:text-slate-300 mb-2">
                    SKU: {product.sku}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">
                    Description: {product.description}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">
                    Price: ${product.price.toFixed(2)}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">
                    Stock: {product.stock}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">
                    Category: {product.category}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">
                    Rating: {product.rating} / 5
                </p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">
                    {product.shippingInformation}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">
                    {product.warrantyInformation}
                </p>

                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
