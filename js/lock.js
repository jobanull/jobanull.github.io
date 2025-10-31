
    // Nonaktifkan klik kanan dan shortcut
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = e => {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key.toLowerCase() === "u") // ✅ ini yang benar
    ) {
        e.preventDefault();
        alert("🚫 Fitur developer dinonaktifkan!");
    }
    };
