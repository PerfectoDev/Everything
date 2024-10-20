const userId = localStorage.getItem('User_id');
const token = localStorage.getItem('token');
const defaultUserName = localStorage.getItem('username');  
const defaultEmail = localStorage.getItem('Email'); 

async function fetchAddressId() {
    const url = `https://everyapi.webxy.net/Accounts/get-all-address/${userId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const addresses = await response.json();
    const defaultAddress = addresses.find(address => address.isdefault === true);
    return defaultAddress ? defaultAddress.id : null;  
}

async function fetchWalletAmount() {
    const walletUrl = `https://everyapi.webxy.net/Wallet/get-wallet-by-userId/${userId}`;
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
}

async function placeOrder() {
    if (!userId) {
        alert("يرجى تسجيل الدخول للمتابعة.");
        return;
    }

    const addressId = await fetchAddressId();  
    const walletAmount = await fetchWalletAmount();

    const checkOutData = {
        userId: userId,
        orderPaymentMethod: 1,
        addressId: addressId || 0,  
        isFreeShipping: true,
        walletAmountNumber: walletAmount || 0,  
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
        } else {
            alert("تمت معالجة الطلب بنجاح.");
        }
    } catch (error) {
        alert(`خطأ: ${error.message}`);
    }
}

document.getElementById('placeOrderButton').addEventListener('click', () => {
    placeOrder();
});

// جلب معلومات السلة
if (userId && token) {
    const pageNumber = 1;
    const pageSize = 10;
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
                name: item.productName_Ar || "اسم المنتج غير متوفر",
                quantity: item.quantity,
                price: item.unitPrice || 0,
                totalPrice: item.totalPrice || 0,
                productId: item.productId,
                featuresId: item.featuresId  
            };

            const productRow = document.createElement('tr');
            productRow.innerHTML = `
                <td class="product-name">${productData.name}
                    <i class="fas fa-times"></i>
                    <span class="product-quantity">${productData.quantity}</span>
                </td>
                <td class="product-total">${productData.totalPrice}$</td>
            `;
            document.getElementById('check-out-cart').appendChild(productRow);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
} else {
    console.error("User ID أو token غير موجود.");
}
 
document.querySelector('input[name="firstname"]').value = defaultUserName;
document.querySelector('input[name="email"]').value = defaultEmail;
