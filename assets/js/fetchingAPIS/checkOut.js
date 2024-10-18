const userId = localStorage.getItem('User_id');
const token = localStorage.getItem('token');
const pageNumber = 1;
const pageSize = 10;
const userName = localStorage.getItem('username');
const email = localStorage.getItem('Email');
let count = 0;
let TotalPriceWithShipping = 0;

if (userId && token) {
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
        document.getElementById('check-out-cart').innerHTML = '';

        data.forEach(item => {
            const productData = {
                name: item.productName_Ar,
                quantity: item.quantity,
                price: item.unitPrice,
                totalPrice: item.totalPrice,
                productId: item.productId
            };

            count += productData.quantity;
            TotalPriceWithShipping += productData.totalPrice;

            const productRow = document.createElement('tr');
            productRow.innerHTML = `
                <td class="product-name">${productData.name}
                    <i class="fas fa-times"></i>
                    <span class="product-quantity">${productData.quantity}</span>
                </td>
                <td class="product-total">${productData.totalPrice}</td>
            `;
            document.getElementById('check-out-cart').appendChild(productRow);
        });

        const totalRow = document.createElement('b');
        totalRow.innerHTML = `${TotalPriceWithShipping}$`;

        const totalPriceDiv = document.getElementById('totalPriceDiv');
        if (totalPriceDiv) {
            totalPriceDiv.appendChild(totalRow);
        } else {
            console.error("عنصر totalPriceDiv غير موجود في HTML");
        }

        document.getElementById('OraderTotal').innerHTML = `${TotalPriceWithShipping}$`;
        document.getElementById('CartCount').innerHTML = count;
    })
    .catch(error => {
        console.error('Error:', error);
    });
} else {
    console.error("User ID أو token غير موجود.");
}

// جلب العناوين
if (userId) {
    const url = `https://everyapi.webxy.net/Accounts/get-all-address/${userId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => {
        if (response.status === 404) {
            throw new Error("لم يتم العثور على العنوان.");
        }
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP error! status: ${response.status} - ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        const defaultAddress = data.find(address => address.isdefault === true);

        if (defaultAddress) {
            const addressInput = document.querySelector('input[name="street-address-1"]');
            if (addressInput) {
                addressInput.value = defaultAddress.addrees || "العنوان غير متوفر";
            }
        } else {
            console.log("لا يوجد عنوان افتراضي.");
        }
    })
    .catch(error => {
        console.error("Error fetching addresses:", error);
    });
}

// post
if (userName) {
    document.querySelector('input[name="firstname"]').value = userName;
}

if (email) {
    document.querySelector('input[name="email"]').value = email;
}

// جلب المنتجات من API
async function fetchProductData() {
    const productUrl = `https://everyapi.webxy.net/Product/GetFeaterd`;

    try {
        const response = await fetch(productUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products = await response.json();
        let totalProductCount = 0;

        products.forEach(product => {
            product.productFeatureDto.forEach(feature => {
                totalProductCount += feature.count;
            });
        });

        console.log("إجمالي عدد المنتجات:", totalProductCount);
        return totalProductCount;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return 0;
    }
}

let addressId = null;

// address
async function fetchDefaultAddress() {
    if (userId) {
        const url = `https://everyapi.webxy.net/Accounts/get-all-address/${userId}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const defaultAddress = data.find(address => address.isdefault === true);

            if (defaultAddress) {
                addressId = defaultAddress.id;
            } else {
                alert("لا يوجد عنوان افتراضي. يرجى إضافة عنوان جديد.");
            }
        } catch (error) {
            console.error("خطأ في جلب العناوين:", error);
        }
    }
}

// wallet
async function fetchWalletAmount() {
    const walletUrl = `https://everyapi.webxy.net/Wallet/get-wallet-by-userId/${userId}`;

    try {
        const response = await fetch(walletUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const walletData = await response.json();
        return walletData.amount;
    } catch (error) {
        console.error('Error fetching wallet amount:', error);
        return 0;
    }
}

// order
async function placeOrder() {
    await fetchDefaultAddress();

    if (addressId) {
        const walletAmount = await fetchWalletAmount();
        const totalProductCount = await fetchProductData();

        // جلب الكمية المتاحة لكل منتج
        const basketUrl = `https://everyapi.webxy.net/Orders/Get-Basket-By-UserId?userId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
        const basketResponse = await fetch(basketUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        const basketData = await basketResponse.json();
        let isOutOfStock = false;

        // التحقق من أن الكمية المطلوبة لكل منتج أقل من الكمية المتاحة
        basketData.forEach(item => {
            item.productFeatureDto.forEach(feature => {
                if (item.quantity > feature.count) {
                    isOutOfStock = true;
                    console.error(`الكمية المطلوبة للمنتج ${item.productName_Ar} تتجاوز المخزون المتاح.`);
                }
            });
        });

        if (isOutOfStock) {
            alert("بعض المنتجات ليست متوفرة بالكمية المطلوبة. يرجى تقليل الكمية أو الاتصال بالإدارة.");
            return;
        }

        const checkOutData = {
            userId: userId,
            orderPaymentMethod: 123,
            addressId: addressId,
            isFreeShipping: true,
            walletAmountNumber: walletAmount,
            totalProductCount: totalProductCount  // إضافة إجمالي عدد المنتجات
        };

        const checkoutPostUrl = "https://everyapi.webxy.net/Orders/CheckOut";

        try {
            const response = await fetch(checkoutPostUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(checkOutData)
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorDetails)}`);
            }

            const data = await response.json();
            alert("تمت معالجة الطلب بنجاح.");
        } catch (error) {
            alert(`خطأ: ${error.message}`);
        }
    } else {
        alert("لم يتم العثور على عنوان الشحن. يرجى التحقق من العنوان.");
    }
}

// ربط زر الطلب بوظيفة placeOrder
document.getElementById('placeOrderButton').addEventListener('click', async () => {
    console.log('الزر تم الضغط عليه');
    try {
        await placeOrder();
    } catch (error) {
        console.error('خطأ في تنفيذ الطلب:', error);
    }
});
