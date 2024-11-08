
if (!localStorage.getItem("isLoggedIn")) {
    localStorage.setItem("isLoggedIn", "false");
}

if (!localStorage.getItem("User_id")) {
    localStorage.setItem("User_id", "false");
}



document.addEventListener("DOMContentLoaded", function() {

    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const emailOrPhone = document.getElementById("emailOrPhone").value;
            const password = document.getElementById("password").value;

            if (!emailOrPhone || !password) {

                Swal.fire({
                    title: "تحذير",
                    text: 'يرجى إدخال البريد الإلكتروني/رقم الهاتف وكلمة المرور.',
                    icon: "warning"
                });
                return;
            }

            localStorage.removeItem("token");

            try {
                const response = await fetch(
                    "https://everyapi.webxy.net/Accounts/Loginbyemailorphone",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            accept: "*/*",
                        },
                        body: JSON.stringify({
                            emailOrPhone: emailOrPhone,
                            password: password,
                        }),
                    }
                );

                console.log("Response Status:", response.status);
                if (response.ok) {
                    const result = await response.json();
                    console.log(result.isActive);
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("User_id", result.userId);

                    Swal.fire({
                        title: "تم بنجاح",
                        text: 'تم تسجيل الدخول بنجاح!.',
                        icon: "success"
                    });
                    window.location.href = "../../index.html";
                    if (result.isActive == "true") {
                        window.location.href = "../../index.html";
                                                
                    } else {
                        let email = result.userId;
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.onmouseenter = Swal.stopTimer;
                                toast.onmouseleave = Swal.resumeTimer;
                            },
                        });
                        Toast.fire({
                            icon: "error",
                            title: "برجاء تفعيل الحساب لتسجيل الدخول",
                        });

                        setTimeout(() => {
                            window.location.href = `OtpChecker.html?id=${email}`
                        }, 3000);
                    }
                } else if (response.status === 401) {
                    Swal.fire({
                        title: "خطأ",
                        text: 'حدث خطأ أثناء التسجيل.',
                        icon: "error"
                    });
                    /*  window.location.href = '../../index.html'; */
                } else {
                    
                    Swal.fire({
                        title: "خطأ",
                        text: 'بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.',
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error("Error:", error);

                Swal.fire({
                    title: "خطأ",
                    text: 'حدث خطأ أثناء الاتصال بالخادم.',
                    icon: "error"
                });
            }
        });
    }
});










































//registerUser
document
    .getElementById("registrationForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append(
            "ConfirmPassword",
            document.getElementById("conf-password").value.trim()
        );
        formData.append("Email", document.getElementById("Email").value.trim());
        formData.append(
            "PhoneNumber",
            document.getElementById("mobileNumber").value.trim()
        );
        formData.append(
            "Password",
            document.getElementById("new-password").value.trim()
        );

        try {
            const response = await fetch(
                "https://everyapi.webxy.net/Accounts/Register",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("تفاصيل الخطأ:", errorText);

                Swal.fire({
                    title: "خطأ",
                    text: 'فشل التسجيل. تأكد من البيانات المدخلة.',
                    icon: "error"
                });
                return;
            }

            const result = await response.json();
            console.log("الرد الكامل:", result);
            const id = result.userId;
            console.log("User ID:", id);

            if (result.userId) {
                const username = document.getElementById("firstname").value.trim();  
                const Email = document.getElementById("Email").value.trim();  
                localStorage.setItem("Email", Email);  

                const email = result.Email;
                console.log(email);

                Swal.fire({
                    title: "تم بنجاح",
                    text: "تم تسجيل الحساب بنجاح جاري تحويلك لصفحه تأكيد الحساب",
                    icon: "success",
                });
                setTimeout(function () {
                    window.location.href = `OtpChecker.html?id=${id}`;
                }, 3000);
            } else {
                console.log("فشل التسجيل: لم يتم استلام معرف المستخدم.");
            }
        } catch (error) {
            console.error("حدث خطأ:", error);
        }
    });