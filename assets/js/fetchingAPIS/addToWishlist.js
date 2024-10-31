function addToWishlist(productId, userId, token) {

    fetch('https://everyapi.webxy.net/UserOpertion/ProductWishList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, productId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {

            alert("تمت إضافة المنتج إلى المفضلة بنجاح!");
        } else {
            alert("حدث خطأ أثناء إضافة المنتج إلى المفضلة.");
        }
    })
    .catch(error => {
        console.error("Error adding to wishlist:", error);
        alert("حدث خطأ أثناء التواصل مع الخادم.");
    });
}


function initializeWishlistButtons(userId, token, productId) {

    if (!userId || !token || !productId) {
        console.error("User ID، token، أو productId غير متوفر.");
        return;
    }


    const wishlistButtons = document.querySelectorAll(".btn-wishlist");
    wishlistButtons.forEach(button => {
        button.addEventListener("click", () => addToWishlist(productId, userId, token));
    });
}


document.addEventListener("DOMContentLoaded", () => {

    const userId = window.userId;
    const token = window.token;
    const productId = window.productId;
    
    initializeWishlistButtons(userId, token, productId);
});
