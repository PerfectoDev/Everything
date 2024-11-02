function addToWishlist(productId) {
  var userId = localStorage.getItem('User_id');
  var token = localStorage.getItem('token');
  var isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === "true") {
    fetch('https://everyapi.webxy.net/UserOpertion/ProductWishList', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, productId })
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
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
          icon: "error",
          title: "فشل العملية",
          text: "حدث خطأ أثناء إضافة المنتج."
      });
    });
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: "يجب تسجيل الدخول أولاً!"
    });
  }
}

function initializeWishlistButtons() {
  const productId = window.productId;

  const wishlistButtons = document.querySelectorAll(".btn-wishlist");
  wishlistButtons.forEach(button => {
      button.addEventListener("click", () => addToWishlist(productId));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeWishlistButtons();
});
