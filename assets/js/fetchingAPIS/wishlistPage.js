async function checkwishlist() {
    try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (isLoggedIn !== "true") {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "يرجي تسجيل الدخول اولا!"
            });
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        } else {
            window.location.href = 'wishlist.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const wishlistBody = document.getElementById('wishlist-body');
    const paginationContainer = document.getElementById('pagination');
    const token = localStorage.getItem('token');
    const itemsPerPage = 5;
    let currentPage = 1;

    const fetchWishlist = async () => {
        try {
            const response = await fetch('https://everyapi.webxy.net/UserOpertion/ProductWishList', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const wishlistItems = await response.json();

            if (wishlistItems.length === 0) {
                wishlistBody.innerHTML = '<tr><td colspan="5">لا توجد منتجات في سلة المفضلة.</td></tr>';
                paginationContainer.innerHTML = '';
                return;
            }

            const wishlistProductIds = wishlistItems.map(item => item.productId);
            localStorage.setItem('wishlistProducts', JSON.stringify(wishlistProductIds));

            displayProducts(wishlistItems);
            setupPagination(wishlistItems);
        } catch (error) {
            console.error('حدث خطأ أثناء جلب قائمة الأمنيات:', error);
            wishlistBody.innerHTML = '<tr><td colspan="5">حدث خطأ أثناء جلب قائمة الأمنيات.</td></tr>';
        }
    };

    const displayProducts = (wishlistItems) => {
        wishlistBody.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = wishlistItems.slice(start, end);

        paginatedItems.forEach(item => {
            const row = `
                <tr id="wishlistProduct-${item.productId}">
                    <td class="product-thumbnail">
                        <div class="p-relative">
                            <a href="../../ar-product-details.html?id=${item.productId}">
                                <figure>
                                    <img src="https://everyui.webxy.net/${item.productImage}" alt="${item.productName}" width="300" height="338">
                                </figure>
                            </a>
                            <button type="submit" onclick="removeFromWishlist(${item.productId})" class="btn btn-close"><i class="fas fa-times"></i></button>
                        </div>
                    </td>
                    <td class="product-name">
                        <a href="../../ar-product-details.html?id=${item.productId}">${item.productName}</a>
                    </td>
                    <td class="product-price">
                        <ins class="new-price">${item.newPrice} ريال سعودي</ins>
                    </td>
                    <td class="product-stock-status">
                        <span class="${item.shippingEnabled ? 'wishlist-in-stock' : 'wishlist-out-of-stock'}">
                            ${item.shippingEnabled ? 'متوفر' : 'غير متوفر'}
                        </span>
                    </td>
                    <td class="wishlist-action">
                        <div class="d-lg-flex">
                            <a href="../../ar-product-details.html?id=${item.productId}" class="btn btn-dark btn-rounded btn-sm ml-lg-2 btn-cart">تصفح المنتج</a>
                        </div>
                    </td>
                </tr>
            `;
            wishlistBody.insertAdjacentHTML('beforeend', row);
        });
    };

    const setupPagination = (wishlistItems) => {
        const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
        paginationContainer.innerHTML = '';
        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination');

        if (currentPage > 1) {
            const prevButton = document.createElement('li');
            prevButton.innerHTML = `<a href="#" class="prev">السابق</a>`;
            prevButton.onclick = () => {
                currentPage--;
                displayProducts(wishlistItems);
                setupPagination(wishlistItems);
            };
            paginationList.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            const pageButton = document.createElement('a');
            pageButton.textContent = i;
            pageButton.className = i === currentPage ? 'active' : '';
            pageButton.onclick = () => {
                currentPage = i;
                displayProducts(wishlistItems);
                setupPagination(wishlistItems);
            };
            pageItem.appendChild(pageButton);
            paginationList.appendChild(pageItem);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('li');
            nextButton.innerHTML = `<a href="#" class="next">التالي</a>`;
            nextButton.onclick = () => {
                currentPage++;
                displayProducts(wishlistItems);
                setupPagination(wishlistItems);
            };
            paginationList.appendChild(nextButton);
        }

        paginationContainer.appendChild(paginationList);
    };

    fetchWishlist();
});

const tokeN = localStorage.getItem('token');

function removeFromWishlist(productId) {
    fetch(`https://everyapi.webxy.net/UserOpertion/remove-product-from-wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokeN}`,
            'Accept': '*/*'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        let wishlist = JSON.parse(localStorage.getItem('wishlistProducts') || '[]');
        wishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem('wishlistProducts', JSON.stringify(wishlist));
        if (data === "Remove Successfully") {

            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "تمت إزالة المنتج من المفضلة"
              });

            // قم بتحديث قائمة المفضلة
            document.getElementById(`wishlistProduct-${productId}`).remove();
        } else {
            console.error('حدث خطأ:', data);
        }
    })
    .catch(error => {
        console.error('حدث خطأ أثناء الاتصال:', error);
    });
}
