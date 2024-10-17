function CheckLogin() { 
    let login = localStorage.getItem('isLoggedIn');
    if (login === 'false') {
        let myaccount = document.getElementById('myAccount');
        
        if (myaccount) {
            CartCount = document.getElementById('CartCount')
            myaccount.removeAttribute('href');
            myaccount.style.display = 'none';
            CartCount.style.display = 'none'
        }
    }else { 
        loginButton = document.getElementById('loginbuttons')
        loginButton.style.display = 'none'
        loginButton.removeItem('href')
    }
}
function CheckLoginPages() { 
    let login = localStorage.getItem('isLoggedIn');
    if (login === 'false') { 
        window.location.href = '../../login.html'
    }
}
CheckLogin();
