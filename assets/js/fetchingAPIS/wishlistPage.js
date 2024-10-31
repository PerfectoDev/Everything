document.addEventListener('DOMContentLoaded', () => {
    const wishlistBody = document.getElementById('wishlist-body');
    const token = localStorage.getItem('token');  


    const fetchWishlist = async () => {
        try {
            const response = await axios.get('https://everyapi.webxy.net/UserOpertion/ProductWishList', {
                headers: {
                    Authorization: `Bearer ${token}`  
                }
            });
            const wishlistItems = response.data;  


            if (wishlistItems.length === 0) {
                wishlistBody.innerHTML = '<tr><td colspan="5">لا توجد منتجات في سلة المفضلة.</td></tr>';
                return;
            }

            wishlistItems.forEach(item => {
                const row = `
                    <tr>
                        <td class="product-thumbnail">
                            <div class="p-relative">
                                <a href="product-default.html">
                                    <figure>
                                        <img src="${item.image}" alt="${item.name}" width="300" height="338">
                                    </figure>
                                </a>
                                <button type="submit" class="btn btn-close"><i class="fas fa-times"></i></button>
                            </div>
                        </td>
                        <td class="product-name">
                            <a href="product-default.html">${item.name}</a>
                        </td>
                        <td class="product-price">
                            <ins class="new-price">${item.price}</ins>
                        </td>
                        <td class="product-stock-status">
                            <span class="${item.inStock ? 'wishlist-in-stock' : 'wishlist-out-of-stock'}">
                                ${item.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </td>
                        <td class="wishlist-action">
                            <div class="d-lg-flex">
                                <a href="#" class="btn btn-dark btn-rounded btn-sm ml-lg-2 btn-cart">اضافة الى السلة</a>
                            </div>
                        </td>
                    </tr>
                `;
                wishlistBody.insertAdjacentHTML('beforeend', row);
            });
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            wishlistBody.innerHTML = '<tr><td colspan="5">حدث خطأ أثناء جلب قائمة الأمنيات.</td></tr>';
        }
    };

    fetchWishlist(); 
});
