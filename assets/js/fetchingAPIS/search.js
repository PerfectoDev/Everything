document.addEventListener("DOMContentLoaded", function () {
    fetch("https://everyapi.webxy.net/Filter/GetSearchControal")
        .then((response) => response.json())
        .then((data) => {
            const categorySelect = document.getElementById("category");
            data.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id;
                option.text = category.nameAr;
                categorySelect.appendChild(option);
            });
        })
        .catch((error) => console.error("Error fetching categories:", error));

    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("search");
    const categorySelect = document.getElementById("category");

    function performSearch() {
        const searchTerm = searchInput.value.trim();
        const selectedCategory = categorySelect.value;

        if (searchTerm !== "") {
            let searchUrl = `../../demo-rtl-shop.html?search=${encodeURIComponent(searchTerm)}`;
            if (selectedCategory) {
                searchUrl += `&CategoryId=${selectedCategory}`;
            }
            window.location.href = searchUrl;
        }
    }

    searchButton.addEventListener("click", function (e) {
        e.preventDefault();
        performSearch();
    });

    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            performSearch();
        }
    });
});