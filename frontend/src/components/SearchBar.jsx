import { useState, useRef, useEffect } from "react";

function SearchBar({ data, getLabel, onSelect, onReset, placeholder }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [resetHovered, setResetHovered] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleChange(e) {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            setSuggestions([]);
            setIsOpen(false);
            onReset();
            return;
        }

        const filtered = data.filter((item) =>
            getLabel(item).toLowerCase().startsWith(value.toLowerCase())
        );

        setSuggestions(filtered);
        setIsOpen(true);
    }

    function handleSelect(item) {
        setQuery(getLabel(item));
        setIsOpen(false);
        onSelect(item);
    }

    function handleReset() {
        setQuery("");
        setSuggestions([]);
        setIsOpen(false);
        onReset();
    }

    return (
        <div ref={wrapperRef} style={{ position: "relative", display: "inline-block" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder={placeholder || "Search..."}
                    style={{ width: "300px" }}
                />
                <button
                    type="button"
                    onClick={handleReset}
                    title="Reset search"
                    onMouseEnter={() => setResetHovered(true)}
                    onMouseLeave={() => setResetHovered(false)}
                    style={{
                        padding: "9px 15px",
                        backgroundColor: "#2727279f",
                        boxShadow: resetHovered
                            ? "0 2px 6px rgba(0, 0, 0, 0.35)"
                            : "none",
                        transition: "box-shadow 0.15s ease"
                    }}
                >
                    ✕
                </button>
            </div>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "300px",
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        marginTop: "4px",
                        zIndex: 10,
                        maxHeight: "200px",
                        overflowY: "auto"
                    }}
                >
                    {suggestions.length === 0 ? (
                        <div style={{ padding: "8px" }}>No matches found.</div>
                    ) : (
                        suggestions.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onMouseDown={(e) => e.preventDefault()}
                                style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                    backgroundColor: hoveredIndex === index
                                        ? "#f0f0f0"
                                        : "transparent",
                                    transition: "background-color 0.15s ease"
                                }}
                            >
                                {getLabel(item)}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;