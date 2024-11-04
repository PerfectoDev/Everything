/* myAccount */
async function checkMyaccount() {
    try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');


        if (isLoggedIn != "true") {

            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "يرجي تسجيل الدخول اولا!"
            });
            setTimeout(()=>{
                window.location.href = 'login.html';
            },2000);
            return;
    }else{
        window.location.href='my-account.html'
    }
    }catch (error) {
        console.error('Error:', error);
     
    }
}

async function checkWallet() {
    try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');


        if (isLoggedIn != "true") {

            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "يرجي تسجيل الدخول اولا!"
            });
            setTimeout(()=>{
                window.location.href = 'login.html';
            },2000);
            return;
    }else{
        window.location.href='AddToWallet.html'
    }
    }catch (error) {
        console.error('Error:', error);
     
    }
}

async function checkAddress() {
    try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');


        if (isLoggedIn != "true") {

            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "يرجي تسجيل الدخول اولا!"
            });
            setTimeout(()=>{
                window.location.href = 'login.html';
            },2000);
            return;
    }else{
        window.location.href='MyAddress.html'
    }
    }catch (error) {
        console.error('Error:', error);
     
    }
}

async function checkMyaccountDet() {
    try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');


        if (isLoggedIn != "true") {

            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "يرجي تسجيل الدخول اولا!"
            });
            setTimeout(()=>{
                window.location.href = 'login.html';
            },2000);
            return;
    }else{
        window.location.href='my-account.html'
    }
    }catch (error) {
        console.error('Error:', error);
     
    }
}
