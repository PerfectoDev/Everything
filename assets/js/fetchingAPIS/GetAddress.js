let UserId = localStorage.getItem('User_id');

fetch(`https://everyapi.webxy.net/Accounts/get-all-address/${UserId}`)
.then(response => response.json())
.then(Adress => {
    let addressTr = '';
    let table = document.getElementById('table'); 
    Adress.forEach(Address => {
        let AdreesSplit = Address.addrees.split('/', 2);
        let Adrees = AdreesSplit[0];
        let mark = AdreesSplit[1];
        let addressId = Address.id; 

        addressTr += `
          <tr>
            <th scope="row">${Adrees}</th>
            <td>${mark}</td>
            <td>
              <button data-id="${addressId}" class="Delete bg-danger" style="border: none; outline: none; border-radius: 3px; width: 120px;">حذف العنوان</button>
              <button class="bg-warning" style="border: none; outline: none; border-radius: 3px; width: 130px;">تعديل العنوان</button>
            </td>
          </tr>
        `;
    });

    table.innerHTML = addressTr;

    document.querySelectorAll('.Delete').forEach(button => {
        button.addEventListener('click', function() {
            let addressId = this.getAttribute('data-id');
            deleteAddress(addressId);
        });
    });
})
.catch(error => {
    console.error('Error:', error); 
});


function deleteAddress(addressId) {
    fetch(`https://everyapi.webxy.net/Accounts/Delete-User-Address/${addressId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errText => {
                throw new Error(errText || 'خطأ غير معروف');
            });
        }
        return response.text(); // استخدام text بدلاً من json
    })
    .then(text => {
        // تحقق مما إذا كانت النص يحتوي على "done"
        if (text.includes("done")) { 
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "تم حذف العنوان بنجاح"
            });

            // إزالة العنصر من الجدول
            document.querySelector(`button[data-id="${addressId}"]`).closest('tr').remove();

        } else {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "فشل حذف العنوان"
            });
        }
    })
    .catch(error => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "error",
            title: error.message 
        });
    });
}