function AddToCart() {
    let product_id = document.getElementById('product_id').value;
    let Quantity = document.getElementById('Quantity').value;
    console.log(Quantity)
    let userId = localStorage.getItem('User_id');
    let productid = localStorage.getItem('ProductId')
    let productCount = parseInt(localStorage.getItem('ProductCount'));
    var adcart =  localStorage.getItem('AdDtoCart')
    var ProductId = localStorage.getItem('ProductId')
        if(productid === 'False' ) { 
        console.log('المنتج غير موجود')

        return
        
    }
    let featuresId = productid; 
    let ProductData = {
        'userId': userId,
        'product_id': product_id,
        'quantity': Quantity,
        'featuresId': featuresId
    };
    localStorage.setItem('AdDtoCart', JSON.stringify(ProductData));
    if(productCount < Quantity) { 
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
            title: "العدد الموجود في المنتج غير كافي"
          });
        return;

    }
   
    

    if(ProductId == ""){
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
            title: "من فضلك اختار اللون والحجم للمنتج"
          });

          

}else { 
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
        title: "تم اضافة المنتج بنجاح"
      });
            
      AddToBasket();
      localStorage.setItem('AdDtoCart' , '')
      localStorage.setItem('ProductId' , '')

}


  
}

async function AddToBasket() {
    const ApiLink = 'https://everyapi.webxy.net/Orders/Add-to-Basket';
    const productDataString = localStorage.getItem('AdDtoCart');
    const token = localStorage.getItem('token');

    if (!productDataString) {
        console.error('No product data found in localStorage.');
        return;
    }

    if (!token) {
        updateLoginStatus(false);
        showLoginPrompt();
        return;
    }

    let ProductData;
    try {
        ProductData = JSON.parse(productDataString);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return;
    }

    if (!ProductData.userId || !ProductData.product_id || !ProductData.quantity || !ProductData.featuresId) {
        console.error('Some required fields are missing in ProductData.');
        return;
    }

    try {
        const response = await fetch(ApiLink, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: ProductData.userId,
                productId: ProductData.product_id,
                quantity: ProductData.quantity,
                featuresId: ProductData.featuresId,
            })
        });

        if (response.status === 401) {  
            updateLoginStatus(false);
            showLoginPrompt();
            return;
        }

        if (!response.ok) {
            console.error('There was an issue with the request.');
            return;
        }

        const data = await response.json();

       
       
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function showLoginPrompt() {
    Swal.fire({
        title: "Error",
        text: 'يجب تسجيل الدخول أولا',
        icon: "error"
    });
    setTimeout(() => {
        location.href = 'login.html';
    }, 1500);
}

function updateLoginStatus(status) {
    localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
    if (!status) {
        localStorage.removeItem('token'); 
    }
}


