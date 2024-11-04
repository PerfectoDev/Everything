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

    let count = 0;

    data.forEach(item => {
        const productData = {
            name: item.productName_Ar,
            quantity: item.quantity,
            price: item.unitPrice,
            TotalPrice: item.totalPrice,
            Img: 'https://everyui.webxy.net/' + item.productImage,
            productId: item.productId
        };
        count++;

        const productDiv = document.createElement('div');
        productDiv.className = 'product product-cart';
        productDiv.innerHTML = `
            <div class="product-detail productD" data-id='${productData.productId}'>
                <a href="ar-product-details.html?id=${productData.productId}" class="product-name">
                    ${productData.name}
                </a>
                <div class="price-box">
                    <span class="product-quantity" id="quantity-display-${productData.productId}">${productData.quantity}</span>
                    <span class="product-price" id="price-display-${productData.productId}">${productData.price} ريال سعودي</span>
                </div>
                <div class="product-qty-form mb-2 mr-2">
                    <div class="input-group">
                        <input class="quantity form-control" value='${productData.quantity}' type="number" min="1" id="quantity-input-${productData.productId}">
                        <button class="quantity-plus w-icon-plus" onclick="updateQuantity(${productData.productId}, 1)"></button>
                        <button class="quantity-minus w-icon-minus" onclick="updateQuantity(${productData.productId}, -1)"></button>
                    </div>
                </div>
            </div>
            <figure class="product-media">
                <a href="ar-product-details.html?id=${productData.productId}">
                    <img src="${productData.Img}" alt="product" height="84" width="94" />
                </a>
            </figure>
            <button onclick='DeleteProductFromCart(${productData.productId})' class="btn btn-link btn-close" aria-label="button">
                <i class="fas fa-times"></i>
            </button>
        `;
       
        document.getElementById('cartproduct').appendChild(productDiv);
    });

    document.getElementById('CartCount').innerHTML = count;
    updateTotalCartPrice(); // Initial call to set the total price
})
.catch(error => {
    console.error('Error:', error);
});

function updateQuantity(productId, change) {
    const quantityInput = document.getElementById(`quantity-input-${productId}`);
    let currentQuantity = parseInt(quantityInput.value);
    let newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
        newQuantity = 1; // لا تسمح بالكمية أقل من 1
    }

    quantityInput.value = newQuantity;
    document.getElementById(`quantity-display-${productId}`).textContent = newQuantity;

    // تحديث إجمالي سعر السلة
    updateTotalCartPrice();

    // فقط إذا كانت الكمية جديدة أقل من الكمية القديمة، أعد المنتج إلى السلة
    if (newQuantity < currentQuantity) {
        DeleteBasket(productId, currentQuantity - newQuantity); // أعد الكمية المزالة
    } else {
        // إذا زادت الكمية، قم بتحديث الكمية في السلة بدلاً من حذفها
        UpdateBasket(productId, newQuantity); // نفترض وجود دالة جديدة هنا لتحديث السلة
    }
}

function updateTotalCartPrice() {
    let total = 0;
    document.querySelectorAll('.product-cart').forEach(productDiv => {
        const productId = productDiv.querySelector('.product-detail').dataset.id;
        const unitPrice = parseFloat(document.getElementById(`price-display-${productId}`).textContent);
        const quantity = parseInt(document.getElementById(`quantity-display-${productId}`).textContent);

        if (!isNaN(unitPrice) && !isNaN(quantity)) {
            total += unitPrice * quantity;
        }
    });
    document.getElementById('total-products-price').textContent = total.toFixed(2) + " ريال سعودي";
}

function DeleteBasket(id, quantity) { 
    const data = {
        userId: localStorage.getItem('User_id'),
        productId: id,
        quantity: quantity,
        featuresId: localStorage.getItem('token'), 
    };

    console.log('Data being sent for removal:', data);  

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
        console.log('Remove Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
