const UserId = localStorage.getItem('User_id');
const Token = localStorage.getItem('token');

fetch(`https://everyapi.webxy.net/Orders/all-orders?userId=${UserId}`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${Token}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('عفوا هناك مشكلة برجاء المحاولة لاحقا او الاتصال بالدعم');
        
    }
    return response.json();
})
.then(orders => {
    console.log(orders);
    
    const table = document.getElementById('order-table');
    let orderRows = '';
    
    orders.forEach(order => {
        orderRows += `
            <tr>
                <th scope="row">${order.id}</th>
                <td>${order.total}</td>
                <td>${order.numberOfItems}</td>
                <td>${order.orderItems[0].price}</td>
                <td>${order.vat}</td>
                <td>${order.total + order.vat}</td>
            </tr>
        `;
    });

    table.innerHTML = orderRows;
})
.catch(error => {
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
        title: "اوبس هناك خطأ ما, تواصل مع الدعم لحل المشكلة في اسرع وقت"
      });});
