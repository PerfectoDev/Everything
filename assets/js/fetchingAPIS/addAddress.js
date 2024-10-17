/* Get Region */
const Api = 'https://everyapi.webxy.net/Accounts/get-all-region';
const Container = document.getElementById('region');

fetch(Api)
    .then(response => response.json())
    .then(regions => {
        let regionOptions = ''; 

        regions.forEach(region => {
            regionOptions += `<option value='${region.id}'>${region.name}</option>`; 
        });

        Container.innerHTML = regionOptions; 
    })
    .catch(error => console.error('Error fetching regions:', error));

/* Add User Address */
document.getElementById('Submit').onclick = function(event) {
    event.preventDefault(); 

    const UserId = localStorage.getItem('User_id');
    const Token = localStorage.getItem('token');
    const country = document.getElementsByName('country')[0].value;
    const region = document.getElementsByName('state')[0].value;
    const addressDetails = document.getElementsByName('addressDetails')[0].value;
    const signMarks = document.getElementsByName('signMarks')[0].value;
    const zipcode = document.getElementsByName('zipcode')[0].value;

    const ApiLink = `https://everyapi.webxy.net/Accounts/Add-User-Address?UserId=${UserId}&addrees=${encodeURIComponent(addressDetails + '/' + signMarks)}&maplong=null&maplat=null&isdefault=true&RegionId=${region}`;

    fetch(ApiLink, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
        }
    })
    .then(response => {
        return response.text(); 
    })
    .then(text => {
        console.log('Response text:', text);
        if (text.includes("done")) { 
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
                title: "تم إضافة العنوان بنجاح"
            });
            
            setTimeout(() => {
                window.location.href = 'MyAddress.html'
            }, 3000);
        } else {
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
                title: "فشل إضافة العنوان"
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
}
