function AddToCart() {
    let product_id = document.getElementById('product_id').value;
    let Quantity = document.getElementById('Quantity').value;
    console.log(Quantity)
    let userId = localStorage.getItem('User_id');
    let productid = localStorage.getItem('ProductId')
    let productCount = localStorage.getItem('ProductCount')
       
        if(productid === 'False' ) { 
        console.log('المنتج غير موجود')

        return
        
    }
    let featuresId = productid; 
    
    let ProductData = {
        'userId': userId,
        'product_id': product_id,
        'quantity': Quantity,
        'featuresId': featuresId,
        
    };
    localStorage.setItem('AdDtoCart', JSON.stringify(ProductData));
    if(productCount < Quantity) { 
        console.log('العدد الموجود في المنتج غير كافي')
        return

    }
    AddToBasket();
}

async function AddToBasket() {
    const ApiLink = 'https://everyapi.webxy.net/Orders/Add-to-Basket';
    const productDataString = localStorage.getItem('AdDtoCart');

    if (!productDataString) {
        console.error('No product data found in localStorage.');
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

    const userId = ProductData.userId;
    const productId = ProductData.product_id;
    const quantity = ProductData.quantity;
    const featuresId = ProductData.featuresId;


    const token = localStorage.getItem('token');    

    try {
        const response = await fetch(ApiLink, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                userId: userId,
                productId: productId,
                quantity: quantity,
                featuresId: featuresId,
            })
        });

        const responseText = await response.text();

        if (!response.ok) {
            Swal.fire({
                title: "Error",
                text: 'يجب تسجيل الدخول اولا',
                icon: "error"
            });
            setTimeout(() => {
                location.href='login.html';
            }, 1500);
        } else { 
           
        }

        const data = JSON.parse(responseText);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
