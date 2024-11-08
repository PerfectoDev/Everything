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
            document.getElementById('wallet-amount').innerText = `${data.balance} ريال سعودي`;
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

        if (isNaN(amount) || amount <= 0) {
            Swal.fire({
                title: "تحذير",
                text: 'يرجى إدخال مبلغ صحيح وموجب.',
                icon: "warning"
            });
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
            console.log('Response status:', response.status);
            return response.text().then(text => {
                console.log('Response text:', text);  
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}: ${text}`);
                }

                return text;  
            });
        })
        .then(text => {
            console.log('Response data:', text);
            Swal.fire({
                title: "تم بنجاح",
                text: 'تمت إضافة المبلغ إلى المحفظة بنجاح.',
                icon: "success"
            });
            setTimeout(() => location.reload(), 2000); 
        })
        .catch(error => {
            console.error('Error details:', error);
            
            let errorMessage = 'حدث خطأ أثناء إضافة المبلغ: ';
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                errorMessage += 'فشل الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.';
            } else {
                errorMessage += error.message;
            }
        });
    });
});
