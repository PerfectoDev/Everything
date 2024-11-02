document.addEventListener('DOMContentLoaded', () => {
    const wishlistBody = document.getElementById('wishlist-body');
    const token = localStorage.getItem('token');  

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
                return;
            }

            wishlistItems.forEach(item => {
                console.log(item)
                const row = `
                    <tr id="wishlistProduct">
                        <td  class="product-thumbnail">
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
                            <ins class="new-price">${item.newPrice}</ins>
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
        } catch (error) {
            console.error('حدث خطأ أثناء جلب قائمة الأمنيات:', error);
            wishlistBody.innerHTML = '<tr><td colspan="5">حدث خطأ أثناء جلب قائمة الأمنيات.</td></tr>';
        }
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
        console.log(data);
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
                title: "تمت إزالة المنتج من المفضلة بنجاح!"
              });
              setTimeout(()=>{
                const wishlistProduct = document.getElementById("wishlistProduct");
                if (wishlistProduct){
                    wishlistProduct.style.display = "none";
                }
              },2000);
        } else {
            alert("حدث خطأ أثناء إزالة المنتج من المفضلة.");
        }
    })
    .catch(error => {
        console.error("خطأ في الطلب:", error);
        alert("حدث خطأ في الاتصال بالخادم.");
    });
}
