document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('CategoryId');
    const domainImage = 'https://everyui.webxy.net/';
    const searchQuery = urlParams.get('search');

    const fetchAndDisplayProducts = (minPrice = null, maxPrice = null, sizeName = null, review = null, brandId = null) => {
        let ApiFilter = `https://everyapi.webxy.net/Filter/filter-products?CategoryId=${categoryId}`;
    
        if (minPrice !== null) {
            ApiFilter += `&MinPrice=${minPrice}`;
        }
        if (maxPrice !== null) {
            ApiFilter += `&MaxPrice=${maxPrice}`;
        }
        if (sizeName !== null) {
            ApiFilter += `&sizeName=${sizeName}`;
        }
        if (review !== null) {
            ApiFilter += `&review=${review}`;
        }
        if (brandId !== null) {
            ApiFilter += `&BrandId=${brandId}`;  
        }
        if (searchQuery) {
            ApiFilter += `&search=${encodeURIComponent(searchQuery)}`;
        }
        
        console.log('API URL:', ApiFilter);  
    
        fetch(ApiFilter)
            .then(response => response.json())
            .then(data => {
                const productContainer = document.querySelector('.product-wrapper');
                productContainer.innerHTML = '';


                if (searchQuery) {
                    data = data.filter(product => {
                        return product.productName_Ar.includes(searchQuery) || product.productName.includes(searchQuery);
                    });
                }
    
                if (data.length > 0) {
                    data.forEach(product => {
                        const productId = product.id;
                        const productHtml = `
                            <div class="product-wrap">
                                <div class="product text-center" data-id="${productId}">
                                    <figure class="product-media">
                                        <a href="../../ar-product-details.html?id=${productId}">
                                            <img src="${domainImage}${product.productImage}" alt="${product.name}" width="300" height="338" />
                                        </a>
                                        <div class="product-action-horizontal">
                                            <a href="#" onclick=window.location.href='../../ar-product-details.html?id=${productId}' class="btn-product-icon btn-cart w-icon-cart" title="Add to cart"></a>
                                            <a href="#" class="btn-product-icon btn-wishlist w-icon-heart" title="Wishlist"></a>
                                        </div>
                                    </figure>
                                    <div class="product-details">
                                        <div class="product-cat">
                                            <a>${product.categoryName}</a>
                                        </div>
                                        <h3 class="product-name">
                                            <a href="../../ar-product-details.html?id=${productId}">${product.productName_Ar}</a>
                                        </h3>
                                        <div class="ratings-container">
                                            <div class="ratings-full">
                                                <span class="ratings" style="width: ${(product.review ? product.review * 20 : 0)}%"></span>
                                            </div>
                                            <a class="rating-reviews">(تعليقات)</a>
                                        </div>
                                        <div class="product-pa-wrapper">
                                            <div class="product-price">${product.price}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        productContainer.innerHTML += productHtml;
                    });
                } else {
                    productContainer.innerHTML = '<p>لا توجد منتجات متاحة لهذه الفئة.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching filtered products:', error);
                const productContainer = document.querySelector('.product-wrapper');
                productContainer.innerHTML = '<p>حدث خطأ أثناء جلب المنتجات.</p>';
            });
    };

    // جلب الفئات والماركات والأسعار والأحجام
    const fetchCategories = () => {
        fetch('https://everyapi.webxy.net/Filter/GetSearchControal')
            .then(response => response.json())
            .then(data => {
                const categoryFilter = document.getElementById('CategoryFilter');
                categoryFilter.innerHTML = '';

                if (data && data.length > 0) {
                    data.forEach(category => {
                        const categoryItem = document.createElement('li');
                        categoryItem.innerHTML = `<a href="?CategoryId=${category.id}">${category.nameAr}</a>`;
                        categoryFilter.appendChild(categoryItem);
                    });
                } else {
                    categoryFilter.innerHTML = '<p>لا توجد فئات متاحة.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                const categoryFilter = document.getElementById('CategoryFilter');
                categoryFilter.innerHTML = '<p>حدث خطأ أثناء جلب الفئات.</p>';
            });
    };

    const fetchBrands = () => {
        fetch('https://everyapi.webxy.net/Filter/GetBrandList')
            .then(response => response.json())
            .then(data => {
                const brandFilter = document.getElementById('BrandFilter');
                brandFilter.innerHTML = '';

                if (data && data.length > 0) {
                    data.forEach(brand => {
                        const brandHtml = `<li><a href="#" data-brand-id="${brand.id}">${brand.name || 'اسم الماركة غير متوفر'}</a></li>`;
                        brandFilter.innerHTML += brandHtml;
                    });

                    const brandLinks = brandFilter.querySelectorAll('a[data-brand-id]');
                    brandLinks.forEach(link => {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();
                            const selectedBrandId = this.getAttribute('data-brand-id');
                            fetchAndDisplayProducts(null, null, null, null, selectedBrandId);  
                        });
                    });
                } else {
                    brandFilter.innerHTML = '<p>لا توجد ماركات متاحة.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching brands:', error);
                const brandFilter = document.getElementById('BrandFilter');
                brandFilter.innerHTML = '<p>حدث خطأ أثناء جلب الماركات.</p>';
            });
    };


    const filterLinks = document.querySelectorAll('.filter-items li a');
    filterLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const priceRange = this.textContent.trim().split('-');

            const minPrice = parseFloat(priceRange[0].replace('ريال سعودى', '').trim());
            const maxPrice = priceRange[1] ? parseFloat(priceRange[1].replace('ريال سعودى', '').trim()) : null;

            fetchAndDisplayProducts(minPrice, maxPrice);
        });
    });


    const sizeFilterLinks = document.querySelectorAll('#SizeFilter li a');
    sizeFilterLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            sizeFilterLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            const selectedSize = this.getAttribute('data-size');
            fetchAndDisplayProducts(null, null, selectedSize);
        });
    });


    const reviewFilterLinks = document.querySelectorAll('.filter-review li a');
    reviewFilterLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedReview = this.getAttribute('data-review');
            fetchAndDisplayProducts(null, null, null, selectedReview); 
        });
    });


    const resetFiltersButton = document.querySelector('.filter-clean');
    resetFiltersButton.addEventListener('click', function (e) {
        e.preventDefault();
        fetchAndDisplayProducts();
    });


    fetchCategories();
    fetchBrands();


    fetchAndDisplayProducts();
});
