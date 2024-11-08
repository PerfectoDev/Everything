function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

document.getElementById('OtpCheck').onclick = async function() {  
    let otpOne = document.getElementById('otp1').value;
    let otpTwo = document.getElementById('otp2').value;
    let otpThree = document.getElementById('otp3').value;
    let otpFour = document.getElementById('otp4').value;
    let OtpCode = otpOne + otpTwo + otpThree + otpFour;

    async function sendRequest() {
        const userId = getParameterByName('id'); 
        console.log('User_id' , userId)
        const requestBody = {
            userId: userId,
            otp: OtpCode
        };
        console.log(userId)
        try {
            const response = await fetch('https://everyapi.webxy.net/Accounts/CheckOTP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*'
                },
                body: JSON.stringify(requestBody) 
            });

            const textResponse = await response.text(); 
            console.log('Response Text:', textResponse); 

            if (!response.ok) {
                alert('خطأ في الطلب: ' + textResponse);
                return;
            }else{
                Swal.fire({
                    title: "تم بنجاح",
                    text: "تم تفعيل الحساب بنجاح جاري تحويلك الي صفحه تسجيل الدخول",
                    icon: "success",
                });
                setTimeout(function () {
                    window.location.href = 'login.html';
                }, 2000);
               
            }

            const result = JSON.parse(textResponse); 
        } catch (error) {
            console.error('Error:', error);
        }
    }
    sendRequest(); 
    



};
