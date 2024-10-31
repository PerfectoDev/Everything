/*setting--------------*/

    fetch("https://everyapi.webxy.net/PageSetting/GetSetting")
        .then(response => response.json()) 
        .then((data) => {
        const domainImage = "https://everyui.webxy.net/";
        phoneNumber=data.phoneNumber;
        title=data.titleAr;       
        description=data.descriptionAr;
        logo=data.logo;
        faceBook=data.faceBook;  
        twitter=data.twitter;
        instgram=data.instagram;
        youtube=data.youtube;
        pint=data.pint;
        message=data.messageAR;
        contactUs=data.contactUs;




document.getElementById("welcome-msg").textContent=message;
document.querySelectorAll(".phone-number").forEach((element)=>{
    element.textContent=phoneNumber;
})
document.querySelectorAll(".logo").forEach((element)=>{
    element.src=logo;
})
document.querySelectorAll(".social-facebook").forEach((element)=>{
    element.href=faceBook;
})
document.querySelectorAll(".social-twitter").forEach((element)=>{
    element.href=twitter;
})
document.querySelectorAll(".social-youtube").forEach((element)=>{
    element.href=youtube;
})
document.querySelectorAll(".social-pinterest").forEach((element)=>{
    element.href=pint;
})

    })
    .catch((error) => {
        console.error('Error fetching settings:', error);
    });