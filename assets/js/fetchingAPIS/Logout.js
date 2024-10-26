/* Logout */
async function logout() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch('https://everyapi.webxy.net/Accounts/logout', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
            body: ''
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error Response:', errorText);
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "خطأ في تسجيل الخروج"
            });
            return;
        }

        const resultText = await response.text();  
        console.log('Logout Response:', resultText);
        
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "تم تسجيل الخروج بنجاح"
        });
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('User_id', 'Null');
        localStorage.setItem('token' , 'null')
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('logoutButton').onclick = logout;
const sessionDuration = 3 * 60 * 60 * 1000; 
setTimeout(() => {
    logout()
}, sessionDuration);

