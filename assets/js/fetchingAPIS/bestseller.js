/*الاكثر مبيعا -----------*/
document.addEventListener("DOMContentLoaded", function () {
    const apiBestSellerUrl = "https://everyapi.webxy.net/Product/GetBestSeller";
    const domainImage = "https://everyui.webxy.net/";
    const productContainer = document.getElementById(
        "product-best-seller-container"
    );

    fetch(apiBestSellerUrl)
        .then((response) => response.json())
        .then((data) => {
            productContainer.innerHTML = "";
            if (data.length > 0) {
                data.forEach((product) => {
                    const productCard = `
                        <div class="swiper-slider product-col">
                        <div class="product product-border">
                            <figure class="product-media">
                                <img onclick=window.location.href='ar-product-details.html?id=${product.id}' src="${domainImage}${product.image}" alt="${product.nameAr}" width="300" height="338">
                            </figure>
                            <div class="product-details">
                                <h4 onclick=window.location.href='ar-product-details.html?id=${product.id}' class="product-name">${product.nameAr}</h4>
                                <div class="product-price">
                                    <span class="new-price">ريال سعودي ${product.price}</span>
                                    ${product.oldPrice? `<span class="old-price">ريال سعودي ${product.oldPrice}</span>`: ""}
                                </div>
                            </div>
                        </div>
                    </div>
                        `;
                    productContainer.innerHTML += productCard;
                });
                new Swiper('.custom-swiper-container', {
                    spaceBetween: 20,
                    slidesPerView: 2,
                    breakpoints: {
                        576: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        992: { slidesPerView: 5 },
                        1200: { slidesPerView: 5 }
                    }
                });
                
            } else {
                productContainer.innerHTML =
                    "<p>لا توجد منتجات متاحة في الوقت الحالي.</p>";
            }
        })
        .catch((error) => {
            console.error("Error fetching product data:", error);
            productContainer.innerHTML = "<p>حدث خطا اثناء جلب البيانات</p>";
        });
});