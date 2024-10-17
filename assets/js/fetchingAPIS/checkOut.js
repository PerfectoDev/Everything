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
        console.log("Response Status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data received from API:", data);
        document.getElementById('check-out-cart').innerHTML = '';

        data.forEach(item => {
            const productData = {
                name: item.productName_Ar,
                quantity: item.quantity,
                price: item.unitPrice,
                totalPrice: item.totalPrice,
                productId: item.productId
            };
            console.log("Product data:", productData);

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
        if (!data || data.length === 0) {
            throw new Error("لم يتم العثور على أي عنوان للمستخدم.");
        }

        const defaultAddress = data.find(address => address.isdefault === true);

        if (defaultAddress) {
            console.log("Default Address:", defaultAddress.addrees);

            const addressInput = document.querySelector('input[name="street-address-1"]');
            if (addressInput) {
                addressInput.value = defaultAddress.addrees || "العنوان غير متوفر";
            } else {
                console.error("عنصر الإدخال غير موجود.");
            }
        } else {
            console.log("لا يوجد عنوان افتراضي.");
        }
    })
    .catch(error => {
        console.error("Error fetching addresses:", error);
    });
} else {
    console.error("User ID غير موجود.");
}

// post
if (userName) {
    document.querySelector('input[name="firstname"]').value = userName;
} else {
    console.error("User name غير موجود.");
    alert("يرجى إدخال اسم المستخدم.");
}

if (email) {
    document.querySelector('input[name="email"]').value = email;
} else {
    console.error("Email غير موجود.");
    alert("يرجى إدخال البريد الإلكتروني.");
}

let addressId = null;

// address
async function fetchDefaultAddress() {
    if (userId) {
        const url = `https://everyapi.webxy.net/Accounts/get-all-address/${userId}`;

        try {
            console.log("جاري جلب العنوان الافتراضي...");
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
            console.log("بيانات العناوين:", data);

            const defaultAddress = data.find(address => address.isdefault === true);

            if (defaultAddress) {
                addressId = defaultAddress.id;
                console.log("معرف العنوان الافتراضي:", addressId);
            } else {
                console.log("لا يوجد عنوان افتراضي.");
                alert("لا يوجد عنوان افتراضي. يرجى إضافة عنوان جديد.");
            }
        } catch (error) {
            console.error("خطأ في جلب العناوين:", error);
            alert("حدث خطأ أثناء جلب العناوين. يرجى المحاولة لاحقًا.");
        }
    } else {
        console.error("User ID غير موجود.");
        alert("User ID غير موجود. يرجى تسجيل الدخول.");
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
    console.log("جاري وضع الطلب...");
    await fetchDefaultAddress();

    if (addressId) {
        const walletAmount = await fetchWalletAmount();   

        const checkOutData = {
            userId: userId,
            orderPaymentMethod: 123,
            addressId: addressId,
            isFreeShipping: true,
            walletAmountNumber: walletAmount   
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
            console.log("البيانات المستلمة من API:", data);
            alert("تمت معالجة الطلب بنجاح.");

        } catch (error) {
            console.log('خطأ:', error);
            alert(`عذرا هذه الكميه غير متوفره لهذا المنتج`);
        }
    } else {
        console.error("Address ID لم يتم العثور عليه.");
        alert("لم يتم العثور على عنوان الشحن. يرجى التحقق من العنوان.");
    }
}

document.getElementById('placeOrderButton').addEventListener('click', async () => {
    const firstName = document.querySelector('input[name="firstname"]').value;
    const emailInput = document.querySelector('input[name="email"]').value;

    if (!firstName || !emailInput) {
        alert("يرجى ملء جميع الحقول المطلوبة.");
    } else {
        await placeOrder();
    }
});
