const userId = localStorage.getItem('User_id');
const token = localStorage.getItem('token');
const defaultUserName = localStorage.getItem('username');
const defaultEmail = localStorage.getItem('Email');
let totalPrice = 0;

async function fetchAddresses() {
    const url = `https://everyapi.webxy.net/Accounts/get-all-address/${userId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return;
        }

        const addresses = await response.json();
        const addressDropdown = document.getElementById('addressDropdown');
        addressDropdown.innerHTML = '<option value="">اختر عنوانًا</option>';

        addresses.forEach(address => {
            const option = document.createElement('option');
            option.value = address.id;
            option.textContent = address.addrees; 
            if (address.isdefault) {
                option.selected = true;
            }
            addressDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching addresses:', error);
    }
}

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

async function placeOrder() {
    if (!userId) {
        Swal.fire({
            title: "Error",
            text: 'يجب تسجيل الدخول أولا',
            icon: "error"
        });
        setTimeout(() => {
            location.href = 'login.html';
        }, 1500);
        return;
    }

    const addressId = document.getElementById('addressDropdown').value;  
    const walletAmount = await fetchWalletAmount();

    const checkOutData = {
        userId: userId,
        orderPaymentMethod: 1,
        addressId: addressId || 0,
        isFreeShipping: true,
        walletAmountNumber: Math.min(walletAmount, totalPrice),
    };

    console.log(checkOutData);

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
            Swal.fire({
                title: "Success",
                text: 'تمت معالجة الطلب بنجاح.',
                icon: "success",
            });
            setTimeout(() => {
                location.href = 'index.html';
            }, 2000);
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: 'يرجي التاكد من الكميه ',
            icon: "error"
        });
}}

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
        console.log("Basket Data:", data);  
        document.getElementById('check-out-cart').innerHTML = '';
        let totalPrice = 0;

        data.forEach(item => {
            const productData = {
                name: item.productName_Ar || "اسم المنتج غير متوفر",
                quantity: item.quantity,
                price: item.unitPrice || 0,
                totalPrice: item.totalPrice || 0,
                productId: item.productId,
                featuresId: item.featuresId  
            };
            totalPrice += productData.totalPrice;

            const productRow = document.createElement('tr');
            productRow.innerHTML = `
                <td class="product-name">${productData.name}
                    <i class="fas fa-times"></i>
                    <span class="product-quantity">${productData.quantity}</span>
                </td>
                <td class="product-total">${productData.totalPrice} ريال سعودي</td>
            `;
            document.getElementById('check-out-cart').appendChild(productRow);
        });
        document.getElementById('totalPriceDiv').textContent = `${totalPrice} ريال سعودي `;

    })
    .catch(error => {
        console.error('Error:', error);
    });
} else {
    console.error("User ID أو token غير موجود.");
}
fetchAddresses();

document.querySelector('input[name="firstname"]').value = defaultUserName;
document.querySelector('input[name="email"]').value = defaultEmail;
