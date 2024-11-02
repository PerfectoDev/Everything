const brandContainer = document.getElementById("BrandContainer");
const BrandApiLink = "https://everyapi.webxy.net/Brands/GetBrandList";

fetch(BrandApiLink)
    .then((response) => response.json())
    .then((brand) => {
        brandContainer.innerHTML = "";
        brand.forEach((brand) => {
            const BrandData = `
                <div class="swiper-slide brand-col">
                    <figure class="brand-wrapper">
                        <img style='width:100%; height:100%;' src="${domainImage}${brand.image}" alt="${brand.nameAr}" width="410" height="186" />
                    </figure>
                </div>
            `;
            brandContainer.innerHTML += BrandData;
        });

        new Swiper('.custom-swiper-container-brands', {
            spaceBetween: 0,
            slidesPerView: 2,
            breakpoints: {
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                992: { slidesPerView: 5 },
                1200: { slidesPerView: 6 }
            }
        });
    });
