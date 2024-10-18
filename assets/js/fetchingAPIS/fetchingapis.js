/*setting--------------*/
let phoneNumber, title, description, logo, faceBook, twitter, instgram, youtube, pint, message, contactUs;

    fetch("https://everyapi.webxy.net/PageSetting/GetSetting")
        .then(response => response.json()) 
        .then((data) => {
        const domainImage = "https://everyui.webxy.net/";
        phoneNumber=data.phoneNumber;
        title=data.titleAr;       
        description=data.descriptionAr;
        logo=data.logo;
        faceBook=data.faceBook;  
        twitter=data.twitter;
        instgram=data.instagram;
        youtube=data.youtube;
        pint=data.pint;
        message=data.messageAR;
        contactUs=data.contactUs;

        console.log("Data fetched successfully:", data);



document.getElementById("welcome-msg").textContent=message;
document.querySelectorAll(".phone-number").forEach((element)=>{
    element.textContent=phoneNumber;
})
document.querySelectorAll(".logo").forEach((element)=>{
    element.src=logo;
})
document.querySelectorAll(".social-facebook").forEach((element)=>{
    element.href=faceBook;
})
document.querySelectorAll(".social-twitter").forEach((element)=>{
    element.href=twitter;
})
document.querySelectorAll(".social-youtube").forEach((element)=>{
    element.href=youtube;
})
document.querySelectorAll(".social-pinterest").forEach((element)=>{
    element.href=pint;
})

    })
    .catch((error) => {
        console.error('Error fetching settings:', error);
    });
if (!localStorage.getItem("isLoggedIn")) {
    localStorage.setItem("isLoggedIn", "false");
}

if (!localStorage.getItem("User_id")) {
    localStorage.setItem("User_id", "false");
}

window.onload = function () {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const emailOrPhone = document.getElementById("emailOrPhone").value;
            const password = document.getElementById("password").value;

            if (!emailOrPhone || !password) {
                alert("يرجى إدخال البريد الإلكتروني/رقم الهاتف وكلمة المرور.");
                return;
            }

            localStorage.removeItem("token");

            try {
                const response = await fetch(
                    "https://everyapi.webxy.net/Accounts/Loginbyemailorphone",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            accept: "*/*",
                        },
                        body: JSON.stringify({
                            emailOrPhone: emailOrPhone,
                            password: password,
                        }),
                    }
                );

                console.log("Response Status:", response.status);
                if (response.ok) {
                    const result = await response.json();
                    console.log(result.isActive);
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("User_id", result.userId);
                    alert("تم تسجيل الدخول بنجاح!");
                    window.location.href = "../../index.html";
                    if (result.isActive == "true") {
                        window.location.href = "../../index.html";
                    } else {
                        let email = result.userId;
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.onmouseenter = Swal.stopTimer;
                                toast.onmouseleave = Swal.resumeTimer;
                            },
                        });
                        Toast.fire({
                            icon: "error",
                            title: "برجاء تفعيل الحساب لتسجيل الدخول",
                        });

                        setTimeout(() => {
                            window.location.href = `OtpChecker.html?id=${email}`
                        }, 3000);
                    }
                } else if (response.status === 401) {
                    alert("Error");
                    /*  window.location.href = '../../index.html'; */
                } else {
                    const errorText = await response.text();
                    alert(
                        "بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.\n" + errorText
                    );
                }
            } catch (error) {
                console.error("Error:", error);
                alert("حدث خطأ أثناء الاتصال بالخادم.");
            }
        });
    }
};

/*ADD TO BASKET--------------*/

document.addEventListener("DOMContentLoaded", function () {
    const cartCountElement = document.querySelector(".cart-quantity");

    document.querySelectorAll(".addToCart").forEach((button) => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            alert("تم إضافة المنتج إلى السلة");
            console.log("تم إضافة المنتج إلى السلة");
        });
    });
});

/*Menu--------------*/

fetch("https://everyapi.webxy.net/Category/GettMenu")
    .then((response) => response.json())
    .then((data) => {
        const mainMenu = document.getElementById("main-menu");

        data.forEach((category) => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="demo-rtl-shop.html"><i class="${category.iconUrl}" id="main-level"></i> ${category.nameAr}</a>`;

            if (category.secondLevels && category.secondLevels.length > 0) {
                const subMenu = document.createElement("ul");

                category.secondLevels.forEach((second) => {
                    const secondLi = document.createElement("li");
                    secondLi.innerHTML = `<h4 class="menu-title">${second.name}</h4><hr class="divider">`;

                    if (second.threeLevels && second.threeLevels.length > 0) {
                        const thirdLevelUl = document.createElement("ul");

                        second.threeLevels.forEach((three) => {
                            const thirdLi = document.createElement("li");
                            thirdLi.innerText = three.name;
                            thirdLevelUl.appendChild(thirdLi);
                        });

                        secondLi.appendChild(thirdLevelUl);
                    }

                    subMenu.appendChild(secondLi);
                });

                li.appendChild(subMenu);
            }

            mainMenu.appendChild(li);
        });
    })
    .catch((error) => console.error("Error fetching categories:", error));

/*search--------------*/
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

/*slider--------------*/
document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://everyapi.webxy.net/Slider/GetList";
    const domainImage = "https://everyui.webxy.net/";
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            updateSlider(data);
        })
        .catch((error) => {
            console.error("Error fetching slider data:", error);
        });
});

function updateSlider(sliderData) {
    const sliderContainer = document.querySelector(".swiper-wrapper");
    sliderContainer.innerHTML = "";

    sliderData.forEach((slide) => {
        const slideElement = `
        <div class="swiper-slide banner banner-fixed intro-slide"
                style="background-image: url(${domainImage}${slide.backgroundimg}); background-color: #ebeef2;">
                <div class="container">
                    <figure class="slide-image skrollable slide-animate">
                        <img src="${domainImage}${slide.imgPath}" alt="Banner" width="474" height="397">
                    </figure>
                    <div class="banner-content y-50 text-right">
                        <h5 class="banner-subtitle font-weight-normal text-default ls-50 lh-1 mb-2 slide-animate">
                            <span class="p-relative d-inline-block">${slide.titleAr}</span>
                        </h5>
                        <h3 class="banner-title font-weight-bolder ls-25 lh-1 slide-animate">
                            ${slide.titleAr}
                        </h3>
                        <p class="font-weight-normal text-default slide-animate">
                            خصومات تصل الى <span class="font-weight-bolder text-secondary">30% OFF</span>
                        </p>
                        <a href="demo-rtl-shop.html"
                            class="btn btn-dark btn-outline btn-rounded btn-icon-left slide-animate">
                            تسوق الان<i class="w-icon-long-arrow-left"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        sliderContainer.insertAdjacentHTML("beforeend", slideElement);
    });

    const swiper = new Swiper(".swiper-container-slider", {
        slidesPerView: 10,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}

/*adds--------------*/

fetch("https://everyapi.webxy.net/api/Adds/get-all-adds")
        .then(response => response.json())
        .then(data => {
            const adsContainer = document.getElementById('ads-container');
            const domainImage = 'https://everyui.webxy.net/';

            const filteredAds = data.filter(ad => ad.publish && (ad.pagePlace === 0 || ad.pagePlace === 2));

            for (let i = 0; i < filteredAds.length; i += 2) {
                const ad1 = filteredAds[i];
                const ad2 = filteredAds[i + 1];

                const bannerHTML = `
                    <div class="swiper-slide ads-slide">
                        <div class="row ads-row">
                            <div class="col-md-6 mb-4 ads-col">
                                <div class="banner banner-fixed overlay-light br-xs ads-banner">
                                    <figure>
                                        <img src="${domainImage}${ad1.imageUrl}" alt="Category Banner" width="610" height="160" style="background-color: #ecedec;" />
                                    </figure>
                                    <div class="banner-content y-50 mt-0 ads-content">
                                        <h3 class="banner-title text-uppercase ads-title">${ad1.titleAr ? ad1.titleAr : ad1.title}</h3>
                                    </div>
                                </div>
                            </div>
                            ${ad2 ? `
                            <div class="col-md-6 mb-4 ads-col">
                                <div class="banner banner-fixed overlay-light br-xs ads-banner">
                                    <figure>
                                        <img src="${domainImage}${ad2.imageUrl}" alt="Category Banner" width="610" height="160" style="background-color: #636363;" />
                                    </figure>
                                    <div class="banner-content y-50 mt-0 ads-content">
                                        <h3 class="banner-title text-uppercase ads-title">${ad2.titleAr ? ad2.titleAr : ad2.title}</h3>
                                    </div>
                                </div>
                            </div>` : ''}
                        </div>
                    </div>
                `;

                adsContainer.innerHTML += bannerHTML;
            }

            new Swiper('.mySwiper', {
                slidesPerView: 1,
                spaceBetween: 10,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                loop: true
            });
        })
        .catch(error => {
            console.error("Error fetching ads:", error);
        });
/*عرض مميز  -----------*/
document.addEventListener("DOMContentLoaded", function () {
    const apiSpacilDayUrl = "https://everyapi.webxy.net/Product/GetSpacilDay";
    const productContainer = document.getElementById("SpacialDay");
    const domainImage = "https://everyui.webxy.net/";

    fetch(apiSpacilDayUrl)
        .then((response) => response.json())
        .then((data) => {
            productContainer.innerHTML = "";
            if (data.length > 0) {
                let swiperWrapper = `
                            <div class="single-product h-100 br-sm">
                            <h4 class="title-sm title-underline font-weight-bolder ls-normal">
                            عرض اليوم المميز
                            </h4>
                            <div class="swiper">
                                <div class="swiper-container swiper-theme nav-top swiper-nav-lg" data-swiper-options="{
                                    'spaceBetween': 20,
                                    'slidesPerView': 1
                                    }">
                                    <div class="swiper-wrapper row cols-1 gutter-no">
                `;

                data.forEach((product) => {

                    const productId=product.productId;

                    const productImage =
                        product.productAttributs.length > 0 && product.productAttributs[0].productAttributImages.length > 0 ? domainImage + product.productAttributs[0].productAttributImages[0].imagePath : "placeholder.jpg";                        product.productAttributs.length > 0 &&product.productAttributs[0].productAttributImages.length > 0? domainImage + product.productAttributs[0].productAttributImages[0].imagePath: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg";


                    const productSlide = `
                                                     <div data-id='${product.productId}' class="swiper-slide productD">
                                                     <input value='${product.productId}' id='product_id' style='display:none'>
                                            <div class="product product-single row">
                                                <div class="col-md-6">
                                                    <div
                                                        class="product-gallery product-gallery-sticky product-gallery-vertical">
                                                        <div
                                                            class="swiper-container product-single-swiper swiper-theme nav-inner">
                                                            <div class="swiper-wrapper row cols-1 gutter-no">
                                                              ${product.productFeatureDto.map(feature => `
                                                             <div class="swiper-slide">
                                                                    <figure class="product-image">
                                                                        <img src="${domainImage + feature.featureImage}" alt="${product.productName}"
                                                                            data-zoom-image="${domainImage + feature.featureImage}"
                                                                            alt="Product Image" width="800"
                                                                            height="900">
                                                                    </figure>
                                                                    </div>
                                                        `).join('')}
                                                              
                                                               
                                                            </div>
                                                            <button class="swiper-button-next"></button>
                                                            <button class="swiper-button-prev"></button>
                                                            <div class="product-label-group">
                                                        <label class="product-label label-discount">${product.discount} خصم</label>
                                                            </div>
                                                        </div>
                                                        <div class="product-thumbs-wrap swiper-container"
                                                            data-swiper-options="{
                                                            'breakpoints': {
                                                                '992': {
                                                                    'direction': 'vertical',
                                                                    'slidesPerView': 'auto'
                                                                }
                                                            }
                                                        }">
                                                        <div class="product-thumbs swiper-wrapper row cols-lg-1 cols-4 gutter-sm">
                                                        ${product.productFeatureDto.map(feature => `
                                                            <div class="product-thumb swiper-slide">
                                                                <img src="${domainImage + feature.featureImage}" alt="Product thumb" width="60" height="68" onclick="changeMainImage('${domainImage + feature.featureImage}')" />
                                                            </div>
                                                        `).join('')}
                                                    </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="product-details scrollable">
                                                        <h2 class="product-title mb-1"><a href="ar-product-details.html?id=${productId}">${product.productName_Ar}</a></h2>

                                                        <hr class="product-divider">

                                                       <div class="product-price"><ins class="new-price ls-50">
                                                            ${product.price}       
                                                        </ins></div>
                                                        <div class="ratings-container">
                                                            <div class="ratings-full">
                                                                 <span class="ratings" style="width: ${product.review *10}%;"></span>
                                                                <span class="tooltiptext tooltip-top"></span>
                                                            </div>
                                                            <a href="#" class="rating-reviews">(1 تعليق)</a>
                                                        </div>

                                                        <div
                                                            class="product-form product-variation-form product-size-swatch mb-3">
                                                            <label class="mb-1">المقاسات</label>
                                                            <div
                                                              class="flex-wrap d-flex align-items-center product-variations SizeBox" id='SizeBox'>

                                                            </div>
                                                            <a href="#" class="product-variation-clean">Clean All</a>
                                                        </div>

                                                        <div class="product-variation-price">
                                                            <span></span>
                                                        </div>

                                                        <div class="product-form pt-4">
                                                            <div class="product-qty-form mb-2 mr-2">
                                                                <div class="input-group">
                                                                    <input id='Quantity' class="quantity form-control" type="number"
                                                                        min="1" max="10000000">
                                                                    <button class="quantity-plus w-icon-plus"></button>
                                                                    <button
                                                                        class="quantity-minus w-icon-minus"></button>
                                                                </div>
                                                            </div>
                                                            <button onclick='AddToCart()' class="btn btn-primary btn-cart">
                                                                <i class="w-icon-cart"></i>
                                                                <span>اضف للسلة</span>
                                                            </button>
                                                        </div>

                                                        <div class="social-links-wrapper">
                                                            <div class="social-links">
                                                                <div class="social-icons social-no-color border-thin">
                                                                    <a href="${faceBook}"
                                                                        class="social-icon social-facebook w-icon-facebook"></a>
                                                                    <a href="${twitter}"
                                                                        class="social-icon social-twitter w-icon-twitter"></a>
                                                                    <a href="${pint}"
                                                                        class="social-icon social-pinterest fab fa-pinterest-p"></a>
                                                                    <a href="#"
                                                                        class="social-icon social-whatsapp fab fa-whatsapp"></a>
                                                                    <a href="#"
                                                                        class="social-icon social-youtube fab fa-linkedin-in"></a>
                                                                </div>
                                                            </div>
                                                            <span class="divider d-xs-show"></span>
                                                            <div class="product-link-wrapper d-flex">
                                                                <a href="#"
                                                                    class="btn-product-icon btn-wishlist w-icon-heart"></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                       `;

                    swiperWrapper += productSlide;
                });

                swiperWrapper += `
                            </div>
                            <button class="swiper-button-prev"></button>
                            <button class="swiper-button-next"></button>
                        </div>
                    </div>
                `;

                productContainer.innerHTML = swiperWrapper;

                data.forEach((product) => {
                    const sizeDiv = document.querySelector(".SizeBox");
                    if (sizeDiv) {
                        product.productFeatureDto.forEach((productFeature) => {
                            const Size = document.createElement("a");
                            Size.href = "#";
                            Size.classList.add("size");
                            Size.textContent = productFeature.sizeName;
                            sizeDiv.appendChild(Size);
                        });
                    }
                });
            } else {
                productContainer.innerHTML =
                    "<p>لا توجد منتجات متاحة في الوقت الحالي.</p>";
            }
        })
        .catch((error) => {
            console.error("Error fetching product data:", error);
        });
});
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
                        <div class="swiper-slide product-col">
                        <div class="product product-border">
                            <figure class="product-media">
                                <img onclick=window.location.href='ar-product-details.html?id=${product.id}' src="${domainImage}${product.image}" alt="${product.nameAr}" width="300" height="338">
                            </figure>
                            <div class="product-details">
                                <h4 onclick=window.location.href='ar-product-details.html?id=${product.id}' class="product-name">${product.nameAr}</h4>
                                <div class="product-price">
                                    <span class="new-price">جنيه ${product.price}</span>
                                    ${product.oldPrice? `<span class="old-price">جنيه ${product.oldPrice}</span>`: ""}
                                </div>
                            </div>
                        </div>
                    </div>
                        `;
                    productContainer.innerHTML += productCard;
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

/* اكثر الفئات مبيعا */
document.addEventListener("DOMContentLoaded", function () {
    const ApiCategory = "https://everyapi.webxy.net/Category/GettMenu";
    const domainImage = "https://everyui.webxy.net/";
    const categoryContainer = document.querySelector("#categories");

    fetch(ApiCategory)
        .then((response) => response.json())
        .then((data) => {
            categoryContainer.innerHTML = "";
            if (data.length > 0) {
                data.forEach((cateogr) => {
                    const category = `
                        <div class="swiper-slide category category-classic category-absolute overlay-zoom br-xs">
                            <a href="../../demo-rtl-shop.html?CategoryId=${cateogr.id}" class="category-media">
                                <img style='width : 100% !important ; border-radius: 30px; height:100% !important;' src="${domainImage}${cateogr.imageUrl}" alt="${cateogr.nameAr}"
                                    width="130" height="130">
                            </a>
                            <div class="category-content">
                                <h4 class="category-name">${cateogr.nameAr}</h4>
                                <a href="../../demo-rtl-shop.html?CategoryId=${cateogr.id}" class="btn btn-primary btn-link btn-underline">تسوق الان</a>
                            </div>
                        </div>
                    `;
                    categoryContainer.innerHTML += category;
                });
            } else {
                categoryContainer.innerHTML =
                    "<p>لا توجد فئات متاحة في الوقت الحالي.</p>";
            }
        })
        .catch((error) => {
            console.error("Error fetching product data:", error);
            categoryContainer.innerHTML = "<p>حدث خطا اثناء جلب البيانات</p>";
        });
});

/**الاقسام ذات شهره --------- */
/* السلع الجديدة */
const productWrapper = document.querySelector("#tab1products");
const domainImage = "https://everyui.webxy.net/";

fetch("https://everyapi.webxy.net/Product/GetNewProduct")
    .then((response) => response.json())
    .then((products) => {
        productWrapper.innerHTML = "";

        products.forEach((product) => {
            const productHTML = `
            
        <div data-id='${product.id}' class="product-wrap product productD ProductBox" style='cursor:pointer'>
          <div class="product text-center">
            <figure class="product-media">
              
                <img onclick=window.location.href='ar-product-details.html?id${product.id}' src="${domainImage}${product.image}" alt="${product.nameAr}" width="300" height="338" />
              
              <div class="product-action-vertical">
                <a onclick=window.location.href='ar-product-details.html?id${product.id}' href="#" class="btn-product-icon btn-cart w-icon-cart" ></a>
                <a href="#" class="btn-product-icon btn-wishlist w-icon-heart" title="Add to wishlist"></a>
                <a href="../../demo-rtl-shop.html" href="#" class="btn-product-icon btn-quickview w-icon-search" title="Quickview"></a>
              </div>
            </figure>
            <div class="product-details">
              <h4 class="product-name"><a href="ar-product-details.html?id${product.id}">${product.nameAr}</a></h4>
              <div class="ratings-container">
                <div class="ratings-full">
                  <span class="ratings" style="width: ${product.review ? product.review * 20 : 0}%;"></span>
                  <span class="tooltiptext tooltip-top"></span>
                </div>
                <a href="ar-product-details.html?id${product.id}" class="rating-reviews">(${product.review || 0} التعليقات)</a>
              </div>
              <div class="product-price">
                <ins class="new-price">${product.price}</ins> ر.س
              </div>
            </div>
          </div>
        </div>
      `;

            productWrapper.innerHTML += productHTML;
        });
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
    });
    /* الأكثر مبيعا */
const tab2 = document.querySelector("#tab2products");

fetch("https://everyapi.webxy.net/Product/GetMostPopular")
    .then((response) => response.json())
    .then((products) => {
        tab2.innerHTML = "";

        products.forEach((product) => {
            const productHTML = `
            
        <div data-id='${product.id}' class="product-wrap product productD ProductBox" style='cursor:pointer'>
          <div class="product text-center">
            <figure class="product-media">
              
                <img onclick=window.location.href='ar-product-details.html?id${product.id}' src="${domainImage}${product.image}" alt="${product.nameAr}" width="300" height="338" />
              
              <div class="product-action-vertical">
                <a onclick=window.location.href='ar-product-details.html?id${product.id}' href="#" class="btn-product-icon btn-cart w-icon-cart" ></a>
                <a href="#" class="btn-product-icon btn-wishlist w-icon-heart" title="Add to wishlist"></a>
                <a href="../../demo-rtl-shop.html" href="#" class="btn-product-icon btn-quickview w-icon-search" title="Quickview"></a>
              </div>
            </figure>
            <div class="product-details">
              <h4 class="product-name"><a href="ar-product-details.html?id${product.id}">${product.nameAr}</a></h4>
              <div class="ratings-container">
                <div class="ratings-full">
                  <span class="ratings" style="width: ${product.review ? product.review * 20 : 0}%;"></span>
                  <span class="tooltiptext tooltip-top"></span>
                </div>
                <a href="ar-product-details.html?id${product.id}" class="rating-reviews">(${product.review || 0} التعليقات)</a>
              </div>
              <div class="product-price">
                <ins class="new-price">${product.price}</ins> ر.س
              </div>
            </div>
          </div>
        </div>
      `;

      tab2.innerHTML += productHTML;
        });
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
    });
    /* الأكثر شعبية */
const tab3 = document.querySelector("#tab3products");

fetch("https://everyapi.webxy.net/Product/GetBestSeller")
    .then((response) => response.json())
    .then((products) => {
        tab3.innerHTML = "";

        products.forEach((product) => {
            const productHTML = `
            
        <div data-id='${product.id}' class="product-wrap product productD ProductBox" style='cursor:pointer'>
          <div class="product text-center">
            <figure class="product-media">
              
                <img onclick=window.location.href='ar-product-details.html?id${product.id}' src="${domainImage}${product.image}" alt="${product.nameAr}" width="300" height="338" />
              
              <div class="product-action-vertical">
                <a onclick=window.location.href='ar-product-details.html?id${product.id}' href="#" class="btn-product-icon btn-cart w-icon-cart" ></a>
                <a href="#" class="btn-product-icon btn-wishlist w-icon-heart" title="Add to wishlist"></a>
                <a href="../../demo-rtl-shop.html" href="#" class="btn-product-icon btn-quickview w-icon-search" title="Quickview"></a>
              </div>
            </figure>
            <div class="product-details">
              <h4 class="product-name"><a href="ar-product-details.html?id${product.id}">${product.nameAr}</a></h4>
              <div class="ratings-container">
                <div class="ratings-full">
                  <span class="ratings" style="width: ${product.review ? product.review * 20 : 0}%;"></span>
                  <span class="tooltiptext tooltip-top"></span>
                </div>
                <a href="ar-product-details.html?id${product.id}" class="rating-reviews">(${product.review || 0} التعليقات)</a>
              </div>
              <div class="product-price">
                <ins class="new-price">${product.price}</ins> ر.س
              </div>
            </div>
          </div>
        </div>
      `;

      tab3.innerHTML += productHTML;
        });
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
    });
    /* متميز */
const tab4 = document.querySelector("#tab4products");

fetch("https://everyapi.webxy.net/Product/GetBestSeller")
    .then((response) => response.json())
    .then((products) => {
        tab4.innerHTML = "";

        products.forEach((product) => {
            const productHTML = `
            
        <div data-id='${product.id}' class="product-wrap product productD ProductBox" style='cursor:pointer'>
          <div class="product text-center">
            <figure class="product-media">
              
                <img onclick=window.location.href='ar-product-details.html?id${product.id}' src="${domainImage}${product.image}" alt="${product.nameAr}" width="300" height="338" />
              
              <div class="product-action-vertical">
                <a onclick=window.location.href='ar-product-details.html?id${product.id}' href="#" class="btn-product-icon btn-cart w-icon-cart" ></a>
                <a href="#" class="btn-product-icon btn-wishlist w-icon-heart" title="Add to wishlist"></a>
                <a href="../../demo-rtl-shop.html" href="#" class="btn-product-icon btn-quickview w-icon-search" title="Quickview"></a>
              </div>
            </figure>
            <div class="product-details">
              <h4 class="product-name"><a href="ar-product-details.html?id${product.id}">${product.nameAr}</a></h4>
              <div class="ratings-container">
                <div class="ratings-full">
                  <span class="ratings" style="width: ${product.review ? product.review * 20 : 0}%;"></span>
                  <span class="tooltiptext tooltip-top"></span>
                </div>
                <a href="ar-product-details.html?id${product.id}" class="rating-reviews">(${product.review || 0} التعليقات)</a>
              </div>
              <div class="product-price">
                <ins class="new-price">${product.price}</ins> ر.س
              </div>
            </div>
          </div>
        </div>
      `;

      tab4.innerHTML += productHTML;
        });
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
    });

//brands

/* Product Details */
document.addEventListener("DOMContentLoaded", function () {
    let products = document.querySelectorAll(".productD");

    if (products.length === 0) {
        console.log("لا توجد منتجات!");
    } else {
        products.forEach((product) => {
            product.addEventListener("click", function () {
                let product_id = this.getAttribute("data-id");
                window.location.href = `../../ar-product-details.html?id=${product_id}`;
            });
        });
    }
});

//registerUser
document
    .getElementById("registrationForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append(
            "ConfirmPassword",
            document.getElementById("conf-password").value.trim()
        );
        formData.append("Email", document.getElementById("Email").value.trim());
        formData.append(
            "PhoneNumber",
            document.getElementById("mobileNumber").value.trim()
        );
        formData.append(
            "Password",
            document.getElementById("new-password").value.trim()
        );

        try {
            const response = await fetch(
                "https://everyapi.webxy.net/Accounts/Register",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("تفاصيل الخطأ:", errorText);
                alert("فشل التسجيل. تأكد من البيانات المدخلة.");
                return;
            }

            const result = await response.json();
            console.log("الرد الكامل:", result);
            const id = result.userId;
            console.log("User ID:", id);

            if (result.userId) {
                const username = document.getElementById("firstname").value.trim();  
                const Email = document.getElementById("Email").value.trim();  
                localStorage.setItem("Email", Email);  

                const email = result.Email;
                console.log(email);

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                });
                Toast.fire({
                    icon: "success",
                    title: "تم تسجيل الحساب بنجاح جاري تحويلك لصفحه تأكيد الحساب",
                });

                setTimeout(function () {
                    window.location.href = `OtpChecker.html?id=${id}`;
                }, 3000);
            } else {
                console.log("فشل التسجيل: لم يتم استلام معرف المستخدم.");
            }
        } catch (error) {
            console.error("حدث خطأ:", error);
        }
    });

