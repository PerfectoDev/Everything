const userId = localStorage.getItem('User_id');
const pageNumber = 1;
const pageSize = 1000;
const token = localStorage.getItem('token');

const storedColor = localStorage.getItem('selectedColors');
const storedSize = localStorage.getItem('selectedSizes');

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
    document.getElementById('data_table').innerHTML = '';
    
    let count = 0;
    let grandTotal = 0;
    let shipping = 50;

    data.forEach(item => {
        const productData = {
            name: item.productName_Ar,
            quantity: item.quantity,
            price: item.unitPrice,
            TotalPrice: item.totalPrice,
            Img: 'https://everyui.webxy.net/' + item.productImage,
            productId: item.productId,
            featureId: item.featureId,
            productFeatureDto: item.productFeatureDto,
            color: storedColor || '',
            size: storedSize || '',
        };

        const matchingFeatures = productData.productFeatureDto.filter(feature => feature.id === productData.featureId);

        if (matchingFeatures.length > 0) {
            productData.color = matchingFeatures[0].color || productData.color;
            productData.size = matchingFeatures[0].sizeName || productData.size;
        }

        const productDiv = document.createElement('tr');
        productDiv.innerHTML = `
            <td class="product-thumbnail">
                <div class="p-relative">
                    <a href="../../ar-product-details.html?id=${productData.productId}">
                        <figure>
                            <img src="${productData.Img}" alt="product" width="300" height="338">
                        </figure>
                    </a>
                    <button onclick='DeleteProductFromCart(${productData.productId})' class="btn btn-close"><i class="fas fa-times"></i></button>
                </div>
            </td>
            <td class="product-name">
                <a href="../../ar-product-details.html?id=${productData.productId}">${productData.name}</a>
            </td>
            <td class="product-color">
                <a href="../../ar-product-details.html?id=${productData.productId}" style='display:flex;justify-content:center;align-items:center'>
                <div style='width:30px;height:30px;border-radius:50%; background-color:${productData.color}'></div>
                </a>
            </td>
            <td class="product-size">${productData.size}</td>
            <td class="product-price"><span class="amout">${productData.price}</span></td>
            <td class="product-quantity">
                <div class="input-group">
                    <input class="quantityForm${productData.productId} form-control" type="number" value='${productData.quantity}' min='1' max="100000">
                    <button onclick="document.querySelector('.quantityForm${productData.productId}').value = parseInt(document.querySelector('.quantityForm${productData.productId}').value) + 1" class="quantity-plus w-icon-plus"></button>
                    <button onclick="if(document.querySelector('.quantityForm${productData.productId}').value != 0){document.querySelector('.quantityForm${productData.productId}').value = parseInt(document.querySelector('.quantityForm${productData.productId}').value) - 1}" class="quantity-minus w-icon-minus"></button>
                </div>
            </td>
            <td class="product-subtotal">
                <span class="amount">${productData.TotalPrice}</span>
            </td>
        `;

        document.getElementById('data_table').appendChild(productDiv);
        grandTotal += parseFloat(productData.TotalPrice) || 0;
    });
    
    document.getElementById('GrandTotal').innerHTML = grandTotal;
    TotalPriceWithShipping = grandTotal + shipping;
    document.querySelector('.shipping-destination').innerHTML = shipping;
    document.getElementById('OraderTotal').innerHTML = TotalPriceWithShipping;

    document.getElementById('CartCount').innerHTML = count;
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
          'Content-Type': 'application/json',
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
