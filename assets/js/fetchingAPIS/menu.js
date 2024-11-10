/*Menu--------------*/

fetch("https://everyapi.webxy.net/Category/GettMenu")
    .then((response) => response.json())
    .then((data) => {
        const mainMenu = document.getElementById("main-menu");
        data.forEach((category) => {
            const li = document.createElement("li");

            li.innerHTML = `<a href="demo-rtl-shop.html?CategoryId=${category.id}"><i class="${category.iconUrl}" id="main-level"></i> ${category.nameAr}</a>`;

            if (category.secondLevels && category.secondLevels.length > 0) {
                const subMenu = document.createElement("ul");

                category.secondLevels.forEach((second) => {
                    const secondLi = document.createElement("li");
                    secondLi.innerHTML = `<h4 class="menu-title">${second.nameAr}</h4><hr class="divider">`;

                    if (second.threeLevels && second.threeLevels.length > 0) {
                        const thirdLevelUl = document.createElement("ul");

                        second.threeLevels.forEach((three) => {
                            const thirdLi = document.createElement("li");
                            thirdLi.innerText = three.nameAr;
                            thirdLevelUl.appendChild(thirdLi);
                        });

                        secondLi.appendChild(thirdLevelUl);
                    }

                    subMenu.appendChild(secondLi);
                });

                li.appendChild(subMenu);
            }

            mainMenu.appendChild(li);
        });
    })
    .catch((error) => console.error("Error fetching categories:", error));