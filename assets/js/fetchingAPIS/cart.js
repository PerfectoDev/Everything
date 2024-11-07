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
    const dataTable = document.getElementById('data_table');

    if (!dataTable) {
        console.error("Element 'data_table' not found.");
        return;
    }

    dataTable.innerHTML = '';   

    if (data.length === 0) {
        dataTable.innerHTML = '<tr><td colspan="7">لا توجد منتجات في السلة</td></tr>';
        return;
    }

    let grandTotal = 0;
    let shipping = 50;

    console.log("Fetched data:", data);  

    data.forEach(item => {
        console.log("Processing item:", item);  

        const productData = {
            name: item.productName_Ar,
            quantity: item.quantity,
            price: item.unitPrice,
            totalPrice: item.totalPrice,
            img: 'https://everyui.webxy.net/' + item.productImage,
            productId: item.productId,
            featureId: item.featureId,
            color: item.colorCode || 'غير متوفر',  
            size: item.sizeName || 'غير متوفر',  
        };


        console.log(`Product: ${productData.name}, Color: ${productData.color}, Size: ${productData.size}`);

        const productDiv = document.createElement('tr');
        productDiv.innerHTML = `
            <td class="product-thumbnail">
                <div class="p-relative">
                    <a href="../../ar-product-details.html?id=${productData.productId}">
                        <figure>
                            <img src="${productData.img}" alt="product" width="300" height="338">
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
            <td class="product-size">${productData.size}</td> <!-- عرض الحجم -->
            <td class="product-price"><span class="amount">${productData.price} ريال سعودي</span></td>
            <td class="product-quantity">
                <div class="input-group">
                    <input class="quantityForm${productData.productId} form-control" type="number" value='${productData.quantity}' min='1' max="100000">
                    <button onclick="document.querySelector('.quantityForm${productData.productId}').value = parseInt(document.querySelector('.quantityForm${productData.productId}').value) + 1" class="quantity-plus w-icon-plus"></button>
                    <button onclick="if(document.querySelector('.quantityForm${productData.productId}').value != 0){document.querySelector('.quantityForm${productData.productId}').value = parseInt(document.querySelector('.quantityForm${productData.productId}').value) - 1}" class="quantity-minus w-icon-minus"></button>
                </div>
            </td>
            <td class="product-subtotal">
                <span class="amount">${productData.totalPrice} ريال سعودي</span>
            </td>
        `;

        dataTable.appendChild(productDiv);
        grandTotal += parseFloat(productData.totalPrice) || 0;
    });
    
    document.getElementById('GrandTotal').innerHTML = grandTotal + " ريال سعودي ";
    const TotalPriceWithShipping = grandTotal + shipping;
    document.querySelector('.shipping-destination').innerHTML = shipping + " ريال سعودي ";
    document.getElementById('OraderTotal').innerHTML = TotalPriceWithShipping + " ريال سعودي ";
})
.catch(error => {
    console.error('Error:', error);
});

function DeleteProductFromCart(id) { 
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
