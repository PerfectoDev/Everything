document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('CategoryId');
    const domainImage = 'https://everyui.webxy.net/';
    const searchQuery = urlParams.get('search');
    const productsPerPage = 12;   
    let currentPage = 1;
    let totalProducts = 0;
    let sortOrder = 'default';

    document.getElementById('sortOrder').addEventListener('change', (e) => {
        sortOrder = e.target.value;
        fetchAndDisplayProducts();  
    });

    const fetchAndDisplayProducts = (minPrice = null, maxPrice = null, sizeName = null, review = null, brandId = null, color = null, page = 1) => {
        currentPage = page;
        let ApiFilter = `https://everyapi.webxy.net/Filter/filter-products?CategoryId=${categoryId}&page=${page}&limit=${productsPerPage}`;

        if (minPrice !== null) {
            ApiFilter += `&MinPrice=${minPrice}`;
        }
        if (maxPrice !== null) {
            ApiFilter += `&MaxPrice=${maxPrice}`;
        }
        if (review !== null) {
            ApiFilter += `&review=${review}`;
        }
        if (sizeName !== null) {
            ApiFilter += `&sizeName=${sizeName}`;
        }
        if (brandId !== null) {
            ApiFilter += `&BrandId=${brandId}`;
        }
        if (searchQuery) {
            ApiFilter += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (color !== null) {
            ApiFilter += `&color=${encodeURIComponent(color)}`; 
        }

        console.log('API URL:', ApiFilter);

        fetch(ApiFilter)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(data => {
                console.log('Raw data from API:', data);
                const productContainer = document.querySelector('.product-wrapper');
                productContainer.innerHTML = '';   

                totalProducts = data.totalCount || data.length;

                data = sortProducts(data, sortOrder);


                if (searchQuery) {
                    data = data.filter(product => {
                        return product.productName_Ar.includes(searchQuery) || product.productName.includes(searchQuery);
                    });
                }
                if (sizeName) {
                    data = data.filter(product => {
                        return product.productFeatureDto.some(feature => 
                            feature.sizes.some(size => size.name.toLowerCase() === sizeName.toLowerCase())
                        );
                    });
                }
                if (review) {
                    data = data.filter(product => {
                        const productReview = product.review || 0;
                        return productReview == review;
                    });
                }
                if (color && typeof color === "string") {
                    data = data.filter(product => {
                        return product.productFeatureDto.some(feature => 
                            typeof feature.color === "string" && feature.color.toLowerCase() === color.toLowerCase()
                        );
                    });
                }
            
                const startIndex = (currentPage - 1) * productsPerPage;
                const endIndex = currentPage * productsPerPage;

                const currentPageProducts = data.slice(startIndex, endIndex);

                if (currentPageProducts.length > 0) {
                    currentPageProducts.forEach(product => {
                        const productId = product.id;
                        const productHtml = `
                            <div class="product-wrap">
                                <div class="product text-center" data-id="${productId}">
                                    <figure class="product-media">
                                        <a href="../../ar-product-details.html?id=${productId}">
                                            <img src="${domainImage}${product.productImage}" alt="${product.name}" width="300" height="338" />
                                        </a>
                                        <div class="product-action-horizontal">
                                            <a href="#" onclick="window.location.href='../../ar-product-details.html?id=${productId}'" class="btn-product-icon btn-cart w-icon-cart" title="Add to cart"></a>
                                            <a class="btn-product-icon btn-wishlist w-icon-heart" onclick='addToWishlist(${product.id})' data-id="${productId}" title="Wishlist"></a>
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
                                            <div class="product-price">${product.price} ريال سعودي</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        productContainer.innerHTML += productHtml;
                    });

                    updatePagination(currentPage);          
                } else {
                    productContainer.innerHTML = '<p>لا توجد منتجات متاحة لهذه الفئة.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching filtered products:', error);
                const productContainer = document.querySelector('.product-wrapper');
                productContainer.innerHTML = '<p>لا يوجد منتجات لهذه الفئه</p>';
            });
        }; 
        
        
        function sortProducts(products, order) {
            if (order === 'price-low') {
                return products.sort((a, b) => a.price - b.price);
            } else if (order === 'price-high') {
                return products.sort((a, b) => b.price - a.price);
            } else if (order === 'rating') {
                return products.sort((a, b) => (b.review || 0) - (a.review || 0));
            } else {
                return products;  
            }
        }    

    const fetchColors = () => {
        const colorApiUrl = 'https://everyapi.webxy.net/api/Lookup/get-all-colors';
        fetch(colorApiUrl)
            .then(response => response.json())
            .then(colors => {
                const colorFilter = document.getElementById('ColorFilter');
                colorFilter.innerHTML = ''; 

                colors.forEach(colorCode => {
                    const colorItem = document.createElement('li');
                    colorItem.innerHTML = `
                        <label>
                            <input type="checkbox" class="color-checkbox" data-color="${colorCode}" />
                            <span class="color-circle" style="background-color: ${colorCode};"></span>
                        </label>
                    `;
                    colorFilter.appendChild(colorItem);


                    colorItem.querySelector('input').addEventListener('change', function () {
                        const selectedColors = Array.from(document.querySelectorAll('.color-checkbox:checked')).map(input => input.getAttribute('data-color'));
                        fetchAndDisplayProducts(null, null, null, null, null, selectedColors.join(','), 1);
                    });
                });
            })
            .catch(error => console.error('Error fetching colors:', error));
    };
    

    const updatePagination = (currentPage) => {
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        const paginationContainer = document.querySelector('.pagination');
    
        paginationContainer.innerHTML = '';  

        if (totalPages > 1) {
            const prevButton = document.createElement('li');
            prevButton.className = 'prev';
            prevButton.innerHTML = `<a href="#" class="${currentPage === 1 ? 'disabled' : ''}">السابق</a>`;
            prevButton.addEventListener('click', function (e) {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    fetchAndDisplayProducts(null, null, null, null, null, null, currentPage);
                }
            });
            paginationContainer.appendChild(prevButton);
    
            for (let i = 1; i <= totalPages; i++) {
                const pageItem = document.createElement('li');
                pageItem.innerHTML = `<a href="#" class="${i === currentPage ? 'active' : ''}">${i}</a>`;
                pageItem.querySelector('a').addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    fetchAndDisplayProducts(null, null, null, null, null, null, currentPage);
                });
                paginationContainer.appendChild(pageItem);
            }
    
            const nextButton = document.createElement('li');
            nextButton.className = 'next';
            nextButton.innerHTML = `<a href="#" class="${currentPage >= totalPages ? 'disabled' : ''}">التالي</a>`;
            nextButton.addEventListener('click', function (e) {
                e.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    fetchAndDisplayProducts(null, null, null, null, null, null, currentPage);
                }
            });
            paginationContainer.appendChild(nextButton);
        } else {
            const singlePageButton = document.createElement('li');
            singlePageButton.className = 'single-page';
            singlePageButton.innerHTML = `<a href="#" class="active">1</a>`;
            paginationContainer.appendChild(singlePageButton);
        }
    };
    

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

    const fetchSizes = () => {
        const sizeApiUrl = 'https://everyapi.webxy.net/api/Lookup/get-all-sizes';
        fetch(sizeApiUrl)
            .then(response => response.json())
            .then(sizes => {
                const sizeFilter = document.getElementById('SizeFilter');
                sizeFilter.innerHTML = '';

                sizes.forEach(size => {
                    const sizeItem = document.createElement('li');
                    sizeItem.innerHTML = `<a href="#" data-size="${size.name.trim()}">${size.name.trim()}</a>`;
                    sizeFilter.appendChild(sizeItem);

                    sizeItem.querySelector('a').addEventListener('click', function (e) {
                        e.preventDefault();
                        const selectedSize = this.getAttribute('data-size');
                        fetchAndDisplayProducts(null, null, selectedSize, null, null, null, 1); 
                    });
                });
            })
            .catch(error => console.error('Error fetching sizes:', error));
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
                            fetchAndDisplayProducts(null, null, null, null, selectedBrandId, 1);  
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
                    const priceRangeText = this.textContent.trim();
                    
                    let minPrice = null;
                    let maxPrice = null;
            
                    if (priceRangeText.includes('+')) {
                        const singlePrice = parseFloat(priceRangeText.split('+')[0].replace('ريال سعودى', '').trim());
                        minPrice = singlePrice;  
                        maxPrice = 999999999999999;  
                    } else {

                        const priceRange = priceRangeText.split('-');
                        minPrice = parseFloat(priceRange[0].replace('ريال سعودى', '').trim());
                        maxPrice = priceRange[1] ? parseFloat(priceRange[1].replace('ريال سعودى', '').trim()) : null;
                    }
            

                    console.log(`Fetching products with minPrice: ${minPrice}, maxPrice: ${maxPrice}`);
                    
                    fetchAndDisplayProducts(minPrice, maxPrice, null, null, null, 1); 
                });
            });
            

        const priceRangeForm = document.querySelector('.price-range');

        priceRangeForm.addEventListener('submit', function (e) {
            e.preventDefault(); 

            const minPriceInput = document.querySelector('.min_price').value;
            const maxPriceInput = document.querySelector('.max_price').value;

            const minPrice = minPriceInput ? parseFloat(minPriceInput) : null;
            const maxPrice = maxPriceInput ? parseFloat(maxPriceInput) : null;

            fetchAndDisplayProducts(minPrice, maxPrice, null, null, null, 1);
        });

    
    const reviewFilterLinks = document.querySelectorAll('#ReviewFilter li a');
    reviewFilterLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedReview = parseInt(this.textContent.trim());
            fetchAndDisplayProducts(null, null, null, selectedReview, null, 1);
        });
    });
    const resetFiltersButton = document.getElementById('reset-filters');
    resetFiltersButton.addEventListener('click', function (e) {
        e.preventDefault();
        currentPage = 1;  
        fetchAndDisplayProducts();  
    });

    fetchSizes();
    fetchColors();
    fetchCategories();
    fetchBrands();
    fetchAndDisplayProducts(); 
});
