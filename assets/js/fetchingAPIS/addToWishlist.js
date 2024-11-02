function addToWishlist(productId) {
  var  useriD = localStorage.getItem('User_id')
  var  tokeN = localStorage.getItem('token')
    fetch('https://everyapi.webxy.net/UserOpertion/ProductWishList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokeN}`
        },
        body: JSON.stringify({ useriD, productId })
    })
    .then(response => response.text())
    .then(data => {
      
       
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
                title: "تمت إضافة المنتج إلى المفضلة بنجاح!"
              });
          
     })
}


function initializeWishlistButtons(useriD, tokeN, productId) {

    if (!useriD || !tokeN || !productId) {
        console.error("User ID، token، أو productId غير متوفر.");
        return;
    }


    const wishlistButtons = document.querySelectorAll(".btn-wishlist");
    wishlistButtons.forEach(button => {
        button.addEventListener("click", () => addToWishlist(productId, useriD, tokeN));
    });
}


document.addEventListener("DOMContentLoaded", () => {

    const userId = window.userId;
    const token = window.token;
    const productId = window.productId;
    
    initializeWishlistButtons(userId, token, productId);
});











