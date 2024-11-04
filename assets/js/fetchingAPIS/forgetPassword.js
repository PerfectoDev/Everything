document.getElementById('nextStep1').addEventListener('click', function(event) {
    event.preventDefault();
    const phoneOrEmail = document.getElementById('account_phone').value;

    if (!phoneOrEmail) {
        Swal.fire({
            title: "خطأ",
            text: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف.",
            icon: "error"
        });
        return;
    }


    requestData = { phoneNumber: phoneOrEmail, email: phoneOrEmail };

    document.getElementById('phoneEmailSection').style.display = 'none';
    document.getElementById('otpSection').style.display = 'block';
});

document.getElementById('nextStep2').addEventListener('click', function(event) {
    event.preventDefault();
    const otp = document.getElementById('otp').value;

    if (!otp) {
        Swal.fire({
            title: "خطأ",
            text: "يرجى إدخال OTP.",
            icon: "error"
        });
        return;
    }


    requestData.otp = otp;

    document.getElementById('otpSection').style.display = 'none';
    document.getElementById('passwordSection').style.display = 'block';
});

document.getElementById('resetPasswordButton').addEventListener('click', function(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!password || !confirmPassword) {
        Swal.fire({
            title: "خطأ",
            text: "يرجى إدخال كلمات المرور.",
            icon: "error"
        });
        return;
    }

    if (password !== confirmPassword) {
        Swal.fire({
            title: "خطأ",
            text: "كلمات المرور غير متطابقة.",
            icon: "error"
        });
        return;
    }


    requestData.password = password;
    requestData.confirmPassword = confirmPassword;


    console.log("بيانات الإرسال:", requestData);

    fetch('https://everyapi.webxy.net/Accounts/forget-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.text())
    .then(responseText => {
        if (responseText.includes("User not found")) {
            Swal.fire({
                title: "خطأ",
                text: "برجاء التأكد من البيانات المدخلة.",
                icon: "error"
            });
        } else {
            Swal.fire({
                title: "تم بنجاح",
                text: "تم استعادة كلمة المرور بنجاح!",
                icon: "success"
            });
            setTimeout(()=>{
                window.location.href="login.html"
            },1500);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: "خطأ",
            text: "حدث خطأ أثناء معالجة الطلب.",
            icon: "error"
        });
    });
});
