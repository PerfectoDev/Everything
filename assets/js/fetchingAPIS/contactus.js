document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();  


    const formData = {
        name: document.querySelector('input[name="name"]').value,
        email: document.querySelector('input[name="email"]').value,
        phoneNumber: document.querySelector('input[name="phone"]').value,
        subject: document.querySelector('input[name="subject"]').value,
        message: document.querySelector('textarea[name="message"]').value
    };


    fetch('https://everyapi.webxy.net/api/ContactUs/post-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())  
    .then(data => {

        if (data.includes("send successfully")) {
            Swal.fire({
                title: "تم بنجاح",
                text: 'تم إرسال الرسالة بنجاح.',
                icon: "success"
            });
            document.getElementById('contactForm').reset();  
        } else {
            Swal.fire({
                title: "خطأ",
                text: 'حدث خطأ أثناء إرسال الرسالة.',
                icon: "error"
            });
        }
    })
    .catch(error => {
        console.error('حدث خطأ:', error);
        Swal.fire({
            title: "خطأ",
            text: 'حدث خطأ أثناء الاتصال بالخادم.',
            icon: "error"
        });

    });
});
