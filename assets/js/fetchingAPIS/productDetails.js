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
        contactUs=data.contactUs

        console.log("Data fetched successfully:", data);
        }).catch((err) =>{console.log("Error")});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const product_id = urlParams.get('id');

    if (product_id) {
        let singleProduct = document.getElementById('Single_Product');
        let ApiLink = `https://everyapi.webxy.net/Product/ProductDetails/${product_id}`;
        const domainImage = 'https://everyui.webxy.net/';

        fetch(ApiLink)
        .then(response => response.json())
        .then(product => {
            if (singleProduct) {
                singleProduct.innerHTML = '';
                


                let productdetails = `

               <div class="product product-single row">
                                <div class="col-md-6 mb-6">
                                    <div class="product-gallery product-gallery-sticky">
                                        <div class="swiper-container product-single-swiper swiper-theme nav-inner swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events swiper-container-rtl" data-swiper-options="{
                                            'navigation': {
                                                'nextEl': '.swiper-button-next',
                                                'prevEl': '.swiper-button-prev'
                                            }
                                        }">
                                            <div class="swiper-wrapper ImgSlider" id="swiper-wrapper-af2bed3a1648cbdb" aria-live="polite" style="transform: translate3d(0px, 0px, 0px);">
                                               <div class="swiper-slide">
                                                    <figure class="product-image">
                                                        <img src="${domainImage}${product.img}"
                                                            data-zoom-image="${domainImage}${product.img}"
                                                            alt="${product.name}" width="800"
                                                            height="900">
                                                    </figure>
                                                </div>

                                            </div>
                                            <button class="swiper-button-next" tabindex="0" aria-label="Next slide" aria-controls="swiper-wrapper-af2bed3a1648cbdb" aria-disabled="false"></button>
                                            <button class="swiper-button-prev swiper-button-disabled" disabled="" tabindex="-1" aria-label="Previous slide" aria-controls="swiper-wrapper-af2bed3a1648cbdb" aria-disabled="true"></button>
                                            <a href="#" class="product-gallery-btn product-image-full"><i class="w-icon-zoom"></i></a>
                                        <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
                                        <div class="product-thumbs-wrap swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events swiper-container-free-mode swiper-container-rtl swiper-container-thumbs" data-swiper-options="{
                                            'navigation': {
                                                'nextEl': '.swiper-button-next',
                                                'prevEl': '.swiper-button-prev'
                                            }
                                        }">
                                            <div class="product-thumbs swiper-wrapper ImgSwitch" id="swiper-wrapper-5a2e541c4e41052d" aria-live="polite" style="transform: translate3d(0px, 0px, 0px);">
                                                <div class="product-thumb swiper-slide">
                                                    <img src="${domainImage}${product.img}"
                                                        alt="${product.name}" width="800" height="900">
                                                </div>
                                            </div>
                                            <button class="swiper-button-next" tabindex="0" aria-label="Next slide" aria-controls="swiper-wrapper-5a2e541c4e41052d" aria-disabled="false"></button>
                                            <button class="swiper-button-prev swiper-button-disabled" disabled="" tabindex="-1" aria-label="Previous slide" aria-controls="swiper-wrapper-5a2e541c4e41052d" aria-disabled="true"></button>
                                        <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-4 mb-md-6">
                                    <div class="product-details" data-sticky-options="{'minWidth': 767}">
                                        <h2 class="product-title">${product.nameAr}</h2>
                                        <div class="product-bm-wrapper">
                                            <figure class="brand">
                                        <img src="${domainImage}${product.brandImage}" alt="Brand" width="102" height="48" />
                                            </figure>
                                            <div class="product-meta">
                                                <div class="product-categories">
                                          
                                       الفئة: <span class="product-category"><a href="#">${product.categoryNameAr}</a></span>
                                                </div>
                                                <div class="product-sku">
                                                <div class="product-sku"> الرقم التسلسلى: <span>${product.id}</span></div>
                                                <input type='text' id='product_id' value='${product.id}' style='display : none;'>
                                                </div>
                                            </div>
                                        </div>

                                        <hr class="product-divider">

                                <div class="product-price"><ins class="new-price">${product.price}</ins>&ensp;ريال سعودي</div>

                                        <div class="ratings-container">
                                            <div class="ratings-full">
                                    <span class="ratings" style="width: ${product.review + '0'}%;"></span>
                                                <span class="tooltiptext tooltip-top"></span>
                                            </div>
                                        <a href="#product-tab-reviews" class="rating-reviews scroll-to">(تعليقات المشترون المؤكدون)</a>

                                        </div>
                                        <div class="ratings-container">
                                            <div class="ratings-full">
                                                <span class="ratings" style="width: 100%;"></span>
                                                <span class="tooltiptext tooltip-top"></span>
                                            </div>
                                            <a href="#product-tab-reviews" class="rating-reviews scroll-to">
                                                تقيم الموقع للمنتج</a>
                                        </div>

                                        <div class="product-short-desc">
                                            <ul class="list-type-check list-style-none">
                                                 <li>${product.description}</li>
                                            </ul>
                                        </div>

                                        <hr class="product-divider">

                                        <div class="product-form product-variation-form product-color-swatch">
                                            <label>الألوان:</label>
                                            <div class="d-flex align-items-center product-variations" id='ColorSwitch'>

                                            </div>
                                        </div>
                                        <div class="product-form product-variation-form product-size-swatch">
                                            <label class="size-Div mb-1">المقاسات:</label>
                                            <div class="size-Div flex-wrap d-flex align-items-center product-variations" id='size'>
                                                
                                            </div>
                                            <a href="#" class="product-variation-clean" style="display: none;">Clean All</a>
                                        </div>

                                        <div class="product-variation-pricee">
                                            <span></span>
                                        </div>

                                                <div class="product-form">
                                    <div class="product-qty-form">
                                        <div class="input-qty-group">
                                            <input class="quantity form-control" id='Quantity' type="number" value="1" min="1" >
                                        </div>
                                    </div>
                                    <button id='btn' class="btn btn-cart btn-primary">
                                        <i class="w-icon-cart"></i>
                                        <span>اضافة للسلة</span>
                                    </button>
                                </div>

                                        <div class="social-links-wrapper">
                                            <div class="social-links">
                                                <div class="social-icons social-no-color border-thin">
                                                    <a href="${faceBook}" class="social-icon social-facebook w-icon-facebook"></a>
                                                    <a href="${twitter}" class="social-icon social-twitter w-icon-twitter"></a>
                                                    <a href="${pint}" class="social-icon social-pinterest fab fa-pinterest-p"></a>
                                                    <a href="#" class="social-icon social-whatsapp fab fa-whatsapp"></a>
                                                    <a href="#" class="social-icon social-youtube fab fa-linkedin-in"></a>
                                                </div>
                                            </div>
                                            <span class="divider d-xs-show"></span>
                                            <div class="product-link-wrapper d-flex">
                                                <a href="#" class="btn-product-icon btn-wishlist w-icon-heart"><span></span></a>
                                                
                                            </div>
                                        </div>          
                                    </div>
                                </div>
                            </div>

                `;
                singleProduct.innerHTML = productdetails;

                fetch(ApiSimilar=`https://everyapi.webxy.net/Product/GetSimilarProducts?CategoryId=20&productId=${product_id}`)
    .then(response => response.json())
    .then(data => {
        const domainImage = 'https://everyui.webxy.net/';
        const similarProductContainer = document.getElementById('similar-project');
        similarProductContainer.innerHTML = '';

        if (data.length > 0) {
            data.forEach(product => {
                const productData = {
                    productId:product.id,
                    nameAr: product.nameAr,
                    price: product.price,
                    image: product.image,
                    review: product.review
                };
                
                const productHtml = `
                    <div class="swiper-slide product">
                        <figure class="product-media">
                            <a href="../../ar-product-details.html?id=${productData.productId}">
                                <img src="${domainImage}${productData.image}" alt="Product" width="300" height="338" />
                            </a>
                            <div class="product-action-vertical">
                                <a href="#" class="btn-product-icon btn-cart w-icon-cart" title="Add to cart"></a>
                                <a href="#" class="btn-product-icon btn-wishlist w-icon-heart" title="Add to wishlist"></a>
                            </div>
                        </figure>
                        <div class="product-details">
                            <h4 class="product-name"><a href="../../ar-product-details.html?id=${productData.productId}">${productData.nameAr}</a></h4>
                            <div class="ratings-container">
                                <div class="ratings-full">
                                    <span class="ratings" style="width: ${productData.review * 20}%;"></span> <!-- Assuming review is a value between 0 and 5 -->
                                    <span class="tooltiptext tooltip-top"></span>
                                </div>
                                <a href="../../ar-product-details.html?id=${productData.productId}" class="rating-reviews">(${productData.review} تعليقات)</a>
                            </div>
                            <div class="product-pa-wrapper">
                                <div class="product-price">${productData.price} ريال سعودي</div>
                            </div>
                        </div>
                    </div>
                `;

                similarProductContainer.innerHTML += productHtml;  
            });
        } else {
            similarProductContainer.innerHTML = '<p>No similar products found.</p>';  
        }
    })
    .catch(err => console.log("Error fetching similar products:", err));

                           
                    


                
   
    


    let selectedSizes = [];
    let selectedColors = [];
    let productPrice = document.getElementById('product-variation-pricee');
    let btn = document.getElementById('btn');
    const imagesDiv = document.getElementById('product-thumbs');
    
    btn.disabled = false;
    
    const sizeContainer = document.querySelector('.product-form.product-variation-form.product-size-swatch');
    const sizeLabel = document.querySelector('.size-Div.mb-1');
    const sizeDiv = document.getElementById('size');
    sizeContainer.style.display = 'none';
    sizeLabel.style.display = 'none';
    
    const updateButtonState = () => {
    
        if (selectedSizes.length > 0 && selectedColors.length > 0) {
            btn.disabled = false;
            console.log("Button enabled");
            // alert("Button is now enabled"); 
            btn.onclick = () => {
                AddToCart();
                checkForMatchingFeature();
                // alert("Button clicked");
            };
        } else {
            btn.disabled = true;
            btn.onclick = null;
            console.log("Button disabled");
            // alert("Button is now disabled");  
        }
    };
    
    const checkForMatchingFeature = () => {
        let foundMatchingFeature = false;
        let imagesToStore = [];
    
        product.productFeatureDto.forEach(productFeature => {
            if (selectedColors.includes(productFeature.color)) {
                productFeature.sizes.forEach(size => {
                    if (selectedSizes.includes(size.name)) {
                        console.log("Feature ID:", size.featureId);
                        console.log("Quantity:", size.quantity);
    
                        // تحقق من الكمية المخزنة
                        const requestedQuantity = parseInt(document.getElementById('Quantity').value) || 1;
                        if (requestedQuantity > size.quantity) {
                            alert("الكمية المطلوبة غير متوفرة.");
                            return;
                        }
    
                        localStorage.setItem('ProductId', size.featureId);
                        localStorage.setItem('ProductCount', size.quantity);
    
                        imagesToStore = [];
                        for (let key in productFeature) {
                            if (key.startsWith('featureImageToWeb')) {
                                imagesToStore.push(productFeature[key]);
                            }
                        }
                        foundMatchingFeature = true;
                    }
                });
            }
        });
    
        if (foundMatchingFeature) {
            console.log("Found matching feature. Storing images:", imagesToStore);
            displayImages(imagesToStore);
        } else {
            localStorage.setItem('ProductId', 'False');
        }
    };
    
    const updateSizes = (sizes) => {
        sizeDiv.innerHTML = '';
    
        sizes.forEach(size => {
            const sizeElement = document.createElement('a');
            sizeElement.href = '#';
            sizeElement.classList.add('size');
            sizeElement.textContent = size.name;
    
            sizeElement.onclick = (e) => {
                e.preventDefault();
    
                if (selectedSizes.includes(size.name)) {
                    selectedSizes = [];  
                    sizeElement.classList.remove('active');
                } else {
                    selectedSizes = [size.name]; 
                    Array.from(sizeDiv.children).forEach(child => child.classList.remove('active'));
                    sizeElement.classList.add('active');
                }
                updateButtonState(); 
                checkForMatchingFeature();
            };
    
            sizeDiv.appendChild(sizeElement);
        });
    
        sizeContainer.style.display = 'block';
        sizeLabel.style.display = 'block';
        sizeLabel.textContent = 'المقاسات:';
    };
    
    const colorDiv = document.getElementById('ColorSwitch');
    if (colorDiv) {
        product.productFeatureDto.forEach(productFeature => {
            const colorElement = document.createElement('a');
            colorElement.style.backgroundColor = productFeature.color;
            colorElement.classList.add('color');
            colorElement.href = '#';
    
            colorElement.onclick = (e) => {
                e.preventDefault();
    
                if (selectedColors.includes(productFeature.color)) {
                    selectedColors = [];  
                    colorElement.classList.remove('active');
                    sizeDiv.innerHTML = '';  
                    sizeContainer.style.display = 'none'; 
                    sizeLabel.style.display = 'none';
                } else {
                    selectedColors = [productFeature.color]; 
                    Array.from(colorDiv.children).forEach(child => child.classList.remove('active'));
                    colorElement.classList.add('active');
                    updateSizes(productFeature.sizes);  
                }
                updateButtonState();  
                checkForMatchingFeature();
            };
    
            colorDiv.appendChild(colorElement);
        });
    }
    
    const ImgSwitch = document.querySelector('.ImgSwitch');
    
    const displayImages = (images) => {
        if (ImgSwitch) {
            ImgSwitch.innerHTML = '';
            images.forEach(imageUrl => {
                const Img = document.createElement('div');
                Img.classList.add('product-thumb', 'swiper-slide');
                Img.role = 'group';
    
                const productImage = document.createElement('img');
                productImage.src = 'https://everyui.webxy.net/' + imageUrl;
                productImage.alt = 'صورة المنتج';
                productImage.width = 800;
                productImage.height = 900;
    
                Img.appendChild(productImage);
                ImgSwitch.appendChild(Img);
            });
        }
    };
    
    const ImgSlider = document.querySelector('.ImgSlider');
    
    if (ImgSlider) {
        product.productFeatureDto.forEach(productFeature => {
            const Img = document.createElement('div');
            Img.classList.add('product-thumb', 'swiper-slide', 'swiper-slide-next');
            Img.role = 'group';
    
            const figure = document.createElement('figure');
            figure.classList.add('product-image');
            figure.style.position = 'relative';
            figure.style.overflow = 'hidden';
            figure.style.cursor = 'pointer';
    
            const productImage = document.createElement('img');
            productImage.src = 'https://everyui.webxy.net/' + productFeature.featureImage;
            productImage.alt = 'Product Thumb';
            productImage.width = 488;
            productImage.height = 549;
            productImage.setAttribute('data-zoom-image', productImage.src);
    
            const zoomImage = document.createElement('img');
            zoomImage.role = 'presentation';
            zoomImage.alt = 'Product Thumb';
            zoomImage.src = 'https://everyui.webxy.net/' + productFeature.featureImage;
            zoomImage.classList.add('zoomImg');
            zoomImage.style.position = 'absolute';
            zoomImage.style.top = '0';
            zoomImage.style.left = '0';
            zoomImage.style.opacity = '0';
            zoomImage.style.width = '880px';
            zoomImage.style.height = '990px';
            zoomImage.style.border = 'none';
            zoomImage.style.maxWidth = 'none';
            zoomImage.style.maxHeight = 'none';
    
            figure.appendChild(productImage);
            figure.appendChild(zoomImage);
            Img.appendChild(figure);
            ImgSlider.appendChild(Img);
        });
    }
    
    fetchProductImages(product);
    
    

            }


        })
        .catch(error => {
            console.error('حدث خطأ:', error);
        });
    } else {
        console.log("لم يتم العثور على ID المنتج في URL");
    }

    });
