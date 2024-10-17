document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('User_id');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        console.error('User ID or token is missing.');
        return;
    }

    fetch(`https://everyapi.webxy.net/Wallet/get-wallet-by-userId/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Error response:', text);
                throw new Error(`Network response was not ok: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data && data.balance !== undefined) {
            document.getElementById('wallet-amount').innerText = `${data.balance}$`;
        } else {
            console.error('Invalid response data:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching wallet amount:', error);
    });

    document.getElementById('submitButton').addEventListener('click', function(event) {
        event.preventDefault();

        const amount = parseFloat(document.getElementById('AddToWallet').value);


        if (isNaN(amount) || amount < 0) {
            alert('يرجى التحقق من البيانات المدخلة.');
            return;
        }

        const requestData = {
            userId: userId,
            amount: amount
        };

        fetch('https://everyapi.webxy.net/Wallet/add-to-wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Error adding to wallet: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('response data:', data);
            if (data.success) {
                alert('تمت إضافة المبلغ إلى المحفظة بنجاح.');

                return fetch(`https://everyapi.webxy.net/Wallet/get-wallet-by-userId/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } else {
                alert('فشل في إضافة المبلغ: ' + data.message);
            }
        })
        .then(response => {
            if (response && response.ok) {
                return response.json();
            }
        })
        .then(data => {
            if (data && data.balance !== undefined) {
                document.getElementById('wallet-amount').innerText = `${data.balance}$`;
            } else {
                console.error('Invalid response data:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
