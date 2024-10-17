
ClearCart = document.getElementById('ClearCart')
deleteButton = document.getElementById('delete')
UserId = localStorage.getItem('User_id');
TokenId = localStorage.getItem('token')
ClearCart.onclick = function() { 


        const url = `https://everyapi.webxy.net/Orders/remove-all-from-basket/${userId}`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${TokenId}`, 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
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
                title: 'تم افراغ العربة بنجاح'
              });
              setTimeout(() => {
                location.reload();
             }, 3000);
        })
        .catch(error => {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
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
                title: 'هناك مشكلة برجاء المحاولة لاحقا'
              });
            });
    }
    
function DeleteProductFromCart(productid) { 
    const url = `https://everyapi.webxy.net/Orders/remove-product-from-cart-by-id?userId=${UserId}&productId=${productid}`
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${TokenId}`, 
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
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
            title: 'تم الأزالة من العربة بنجاح'
          });
         setTimeout(() => {
            location.reload();
         }, 3000);
        })
    .catch(error => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
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
            title: 'هناك مشكلة برجاء المحاولة لاحقا'
          });
    });
}



