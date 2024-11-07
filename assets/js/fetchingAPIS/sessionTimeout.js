document.addEventListener("DOMContentLoaded", function() {

    const sessionDuration = 2 * 60 * 60 * 1000;  

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    function logoutAuto() {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("token");
        localStorage.removeItem("loginTime");

        Swal.fire({
            title: "تحذير",
            text: 'انتهت صلاحيه الدخول يرجي اعاده تسجيل الدخول مره اخري',
            icon: "warning",
            confirmButtonText: "حسناً"
        }).then(() => {

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        });
    }

    if (isLoggedIn === "true" && token) {
        if (!loginTime) {
            localStorage.setItem("loginTime", Date.now());
        } else {
            const elapsedTime = Date.now() - parseInt(loginTime, 10);

            if (elapsedTime >= sessionDuration) {
                logoutAuto();
            } else {
                setTimeout(logoutAuto, sessionDuration - elapsedTime);
            }
        }
    }
});
