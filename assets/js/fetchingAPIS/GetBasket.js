const userId = localStorage.getItem('User_id');
const pageNumber = 1;
const pageSize = 1000;
const token = localStorage.getItem('token');

const url = `https://everyapi.webxy.net/Orders/Get-Basket-By-UserId?userId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
fetch(url, {
    method: 'GET',
    headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,

    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {

    document.getElementById('cartproduct').innerHTML = '';

    let count = 0 ; 
    
    data.forEach(item => {
        const productData = {
            name: item.productName_Ar,  
            quantity: item.quantity,
            price: item.unitPrice,
            TotalPrice: item.totalPrice,
            Img :'https://everyui.webxy.net/'+item.productImage,
            productId : item.productId
        };
        count++
        const productDiv = document.createElement('div');
        productDiv.className = 'product product-cart';
        productDiv.innerHTML = `
                                        <div class="product-detail productD" data-id='${productData.productId}'>
                                            <a href="#" class="product-name">
                                            ${productData.name}
                                            </a>
                                            <div class="price-box">
                                                <span class="product-quantity">${productData.quantity}</span>
                                                <span class="product-price">${productData.TotalPrice}</span>
                                            </div>
                                            <div class="product-qty-form mb-2 mr-2">
                                                <div class="input-group">
                                                    <input class="quantity form-control" value='${productData.quantity}'  type="number">
                                                    <button class="quantity-plus w-icon-plus"></button>
                                                    <button
                                                        class="quantity-minus w-icon-minus"></button>
                                                </div>
                                            </div>
                                        </div>
                                        <figure class="product-media" >
                                            <a href="#">
                                                <img src="${productData.Img}" alt="product" height="84"
                                                    width="94" />
                                            </a>
                                        </figure>
                                        <button onclick='DeleteProductFromCart(${productData.productId})' class="btn btn-link btn-close" aria-label="button">
                                            <i class="fas fa-times" ></i>
                                        </button>
        `;
       
        document.getElementById('cartproduct').appendChild(productDiv);
    });
    
    document.getElementById('CartCount').innerHTML = count
})
.catch(error => {
    console.error('Error:', error);
});







function DeleteBasket(id) { 
    const data = {
        userId: localStorage.getItem('User_id'),
        productId: id,
        quantity: 1,
        featuresId: localStorage.getItem('token'),
      };
      
      fetch('https://everyapi.webxy.net/Orders/Remove-From-Basket', {
        method: 'POST',           
        headers: {
          'Content-Type': 'application/json'  ,
          'Authorization': `Bearer ${token}`,

        },
        body: JSON.stringify(data)  
      })
      .then(response => response.json())  
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      
}