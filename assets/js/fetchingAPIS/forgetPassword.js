document.getElementById('resetPasswordButton').addEventListener('click', function(event) {
    event.preventDefault();  
    const usernameOrEmail = document.getElementById('username').value;

    if (!usernameOrEmail) {
        alert("يرجى إدخال اسم المستخدم أو البريد الإلكتروني.");
        return;
    }


    const requestData = {
        emailOrUsername: usernameOrEmail
    };


    fetch('https://everyapi.webxy.net/Accounts/forget-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'حدث خطأ أثناء محاولة استعادة كلمة المرور');
            });
        }
        return response.json();
    })
    .then(data => {
        alert('تم إرسال التعليمات إلى بريدك الإلكتروني.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
});