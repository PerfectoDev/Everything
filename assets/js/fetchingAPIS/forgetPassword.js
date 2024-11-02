document.getElementById('resetPasswordButton').addEventListener('click', function(event) {
    event.preventDefault();  
    
    const phoneNumber = document.getElementById('phoneNumber').value; 
    const email = document.getElementById('email').value; 
    const password = document.getElementById('password').value; 
    const confirmPassword = document.getElementById('confirmPassword').value; 
    const otp = document.getElementById('otp').value;  


    if (!phoneNumber || !email || !password || !otp || !confirmPassword) {
        Swal.fire({
            title: "تم بنجاح",
            text: 'يرجى ملء جميع الحقول المطلوبة.',
            icon: "success"
        });
        return;
    }


    if (password !== confirmPassword) {
        Swal.fire({
            title: "خطا",
            text: 'كلمات المرور غير متطابقة.',
            icon: "warning"
        });
        return;
    }

    const requestData = {
        phoneNumber: phoneNumber,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        otp: otp
    };

    fetch('https://everyapi.webxy.net/Accounts/forget-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        return response.text().then(text => {
            if (!response.ok) {
                console.error('Error response:', text); 
                Swal.fire({
                    title: "خطا",
                    text: 'برجاء التاكد من البيانات المدخله .',
                    icon: "error"
                });
            }
        });
    })
});
