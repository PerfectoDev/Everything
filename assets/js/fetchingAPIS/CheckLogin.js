function CheckLogin() { 
    let login = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');

    if (login === 'false' || !token) {
        updateLoginStatus(false);  
        let myaccount = document.getElementById('myAccount');
        
        if (myaccount) {
            let CartCount = document.getElementById('CartCount');
            myaccount.removeAttribute('href');
            myaccount.style.display = 'none';
            if (CartCount) CartCount.style.display = 'none';
        }
    } else { 
        let loginButton = document.getElementById('loginbuttons');
        if (loginButton) {
            loginButton.style.display = 'none';
            loginButton.removeAttribute('href');
        }
    }
}

function CheckLoginPages() { 
    let login = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');

    if (login === 'false' || !token) { 
        updateLoginStatus(false);  
        window.location.href = '../../login.html';
    }
}

CheckLogin();
