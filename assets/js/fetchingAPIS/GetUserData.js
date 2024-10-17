user_id = localStorage.getItem('User_id');
ApiUrl = `https://everyapi.webxy.net/Accounts/get-user-profile?userId=${user_id}`;
Token = localStorage.getItem('token');
UserDet = document.getElementById('UserDetails');
mainDetails = document.getElementById('mainDetails');

fetch(ApiUrl , {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Token
    }
})
.then(Response => {
    if (!Response.ok) { 
        alert('Error');
    }
    return Response.json();
})
.then(userData => {
    const UserDetails = `
        <div class="row">
            <div class="col-sm-3">
                <p class="mb-0">Full Name</p>
            </div>
            <div class="col-sm-9">
                <input class="text-muted mb-0" value='${userData.fullName}' id='fullName'>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <p class="mb-0">Full Name</p>
            </div>
            <div class="col-sm-9">
                <input class="text-muted mb-0" value='${userData.fullName_Ar}' id='FullName_Ar'>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <p class="mb-0">birthDate</p>
            </div>
            <div class="col-sm-9">
                <input class="text-muted mb-0" value='${userData.birthDate}' id='birthDate'>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <p class="mb-0">gender</p>
            </div>
            <div class="col-sm-9">
                <input class="text-muted mb-0" value='${userData.gender}' id='gender'>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <p class="mb-0">shippingPrice</p>
            </div>
            <div class="col-sm-9">
                <input class="text-muted mb-0" value='${userData.shippingPrice}' id='shippingPrice'>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <p class="mb-0">regionName</p>
            </div>
            <div class="col-sm-9">
                <input class="text-muted mb-0" value='${userData.regionName}' id='regionName'>
            </div>
        </div>
        <hr>
        <button type="button" id='Save' class="btn btn-primary">حفظ</button>
    `;

    UserDet.innerHTML = UserDetails;

    UserMainDet = `
        <img src="https://everyui.webxy.net/${userData.picture}" alt="${userData.fullName}"
        class="rounded-circle img-fluid" style="width: 150px;">
        <h5 class="my-3" style="margin-top: 30px;">${userData.fullName}</h5>
        <label for='picture' type="button" class="btn btn-warning">تعديل صورة الملف الشخصي</label>
        <input type='file' id='picture' style='display:none' accept=".jpg, .jpeg, .png">
    `;
    mainDetails.innerHTML = UserMainDet;

    async function UpdateUser() { 
        const FullName = document.getElementById('fullName').value;
        const FullName_Ar = document.getElementById('FullName_Ar').value;
        const birthDate = document.getElementById('birthDate').value;
        const gender = document.getElementById('gender').value;
        const filepicture = document.getElementById('picture').files[0];
    
        if (!filepicture) {
            console.error('Please select a file.');
            return;
        }
    
        const picture = await filepicture.arrayBuffer();
        const Url = `https://everyapi.webxy.net/Accounts/update-user-profile?UserId=${user_id}&FullName=${FullName}&FullName_Ar=${FullName_Ar}&BirthDate=${birthDate}&Gender=${gender}`;
        console.log('Sending data:', {
            FullName,
            FullName_Ar,
            birthDate,
            gender,
            Picture: Array.from(new Uint8Array(picture)),
            user_id
        });
        
        try {
            const response = await fetch(Url, { 
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + Token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    Picture: Array.from(new Uint8Array(picture)), 
                })
            });
    
            const responseText = await response.text();   
            console.log('Response Text:', responseText); 
            location.reload()
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
    
            const data = JSON.parse(responseText); 
            console.log('Success:', data);
    
        } catch (error) {
            console.error('Error:', error);
        }
    }
    document.getElementById('Save').addEventListener('click', UpdateUser);
    
});
