import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="flex items-center justify-between px-5 py-10 dark:bg-slate-800 rounded-xl">
            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 ">
                Store Dashboard
            </h1>
            <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition
"
                onClick={toggleTheme}
            >
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </button>
        </div>
    );
}
