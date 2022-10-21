/*
     Задание:
     Сделайте так, чтобы изменения, сделанные для массива users, сохранялись и были доступны
     даже после закрытия и повторного открытия браузера.
 */
let users = [
    {
        balance: '1250',
        age: 24,
        name: {
            first: 'Golden',
            last: 'Clements'
        },
        company: 'EWAVES',
        email: 'golden.clements@ewaves.io'
    },
    {
        balance: '3637',
        age: 23,
        name: {
            first: 'Francis',
            last: 'Hebert'
        },
        company: 'XPLOR',
        email: 'francis.hebert@xplor.biz'
    },
    {
        balance: '1106',
        age: 31,
        name: {
            first: 'Hale',
            last: 'Cross'
        },
        company: 'EARTHPURE',
        email: 'hale.cross@earthpure.us'
    },
    {
        balance: '2502',
        age: 25,
        name: {
            first: 'Delores',
            last: 'Sykes'
        },
        company: 'ASSITIA',
        email: 'delores.sykes@assitia.com'
    },
    {
        balance: '3651',
        age: 21,
        name: {
            first: 'Ryan',
            last: 'Bolton'
        },
        company: 'MOLTONIC',
        email: 'ryan.bolton@moltonic.biz'
    },
    {
        balance: '1345',
        age: 21,
        name: {
            first: 'Carey',
            last: 'Schwartz'
        },
        company: 'UXMOX',
        email: 'carey.schwartz@uxmox.info'
    },
    {
        balance: '3261',
        age: 30,
        name: {
            first: 'Trevino',
            last: 'Mullins'
        },
        company: 'TERRASYS',
        email: 'trevino.mullins@terrasys.org'
    },
    {
        balance: '1659',
        age: 20,
        name: {
            first: 'Gilliam',
            last: 'Mendez'
        },
        company: 'ZENTHALL',
        email: 'gilliam.mendez@zenthall.tv'
    },
    {
        balance: '2340',
        age: 32,
        name: {
            first: 'Brewer',
            last: 'Vargas'
        },
        company: 'QIMONK',
        email: 'brewer.vargas@qimonk.co.uk'
    },
    {
        balance: '1736',
        age: 24,
        name: {
            first: 'Newman',
            last: 'Wynn'
        },
        company: 'VISALIA',
        email: 'newman.wynn@visalia.name'
    }
];
let usersWork; // с этим массивом будем работать, оригинальный не будет затронут

if (localStorage.getItem("afterUsers") != null) { // проверяю есть ли в сторедже значение с последними изменениями в списке юзеров
    usersWork = JSON.parse(localStorage.getItem("afterUsers")); // если есть, то работаем с этим массивом
} else {
    localStorage.setItem("beforeUsers", JSON.stringify(users)); // если нет, то переносим оригинальный массив в сторедж
    usersWork = JSON.parse(localStorage.getItem("beforeUsers")); // потом достаем (копируем) его в переменную с которой будем работать
}

class ListService {
    selectedData;
    data;
    listElement;

    constructor(data, listElement, displayFn) {
        this.data = data;
        this.listElement = listElement;
        this.displayFunc = displayFn;
        this.reFillList();
    }

    reFillList(){ // функция для обновления списка li
        this.listElement.innerHTML = "";
        for (let index = 0; index < this.data.length; index++) {
            const currentData = this.data[index];

            let li = document.createElement("li");
            li.textContent = this.displayFunc(currentData);
            currentData.id = index;
            li.dataset.id = index;

            this.listElement.append(li);
        }
    }

    select(id) {
        this.selectedData = this.data.filter(x => x.id == id)[0];
        console.log(this.data)
        console.log(this.selectedData)
        this.deselectAll();

        const index = this.data.indexOf(this.selectedData);
        this.listElement.children[index].classList.add("selected");
    }

    deselectAll() {
        for (let i = 0; i < this.listElement.children.length; i++) {
            const child = this.listElement.children[i];
            child.classList.remove("selected");
        }
    }


    deleteSelectedItem() {
        const index = this.data.indexOf(this.selectedData);
        if (index != -1) {
            this.listElement.children[index].remove();
            this.data.splice(index, 1);
            localStorage.setItem("afterUsers", JSON.stringify(usersWork)); // отправляю в сторедж последние изменения после удаления
        }
    }
}

class UserFormService {
    currentUser;
    form;

    constructor(form) {
        this.form = form;
    }

    fillForm(user) {
        this.currentUser = user;

        this.form.firstName.value = user.name.first;
        this.form.lastName.value = user.name.last;
        this.form.companyName.value = user.company;
        this.form.balance.value = user.balance;
        this.form.email.value = user.email;
        this.form.age.value = user.age;
    }

    saveForm() {
        this.currentUser.name.first = this.form.firstName.value;
        this.currentUser.name.last = this.form.lastName.value;
        this.currentUser.company = this.form.companyName.value;
        this.currentUser.balance = this.form.balance.value;
        this.currentUser.email = this.form.email.value;
        this.currentUser.age = this.form.age.value;
        localStorage.setItem("afterUsers", JSON.stringify(usersWork)); // отправляю в сторедж последние изменения
    }


    resetForm() {
        this.form.reset();
    }
}

/*function listUpdate(data, listElement, displayFn) { // функция, которая копирует конструктор класса ListService, нужна для обновления списка юзеров после изменений
    let listOfUsers = data;
    let output = listElement;
    output.innerHTML = "";

    for (let index = 0; index < listOfUsers.length; index++) {
        const currentData = listOfUsers[index];

        let li = document.createElement("li");
        li.textContent = displayFn(currentData);
        currentData.id = index;
        li.dataset.id = index;

        output.append(li);
    }
}*/

let userList = document.querySelector("#userList");
let saveButton = document.querySelector("#saveButton");
let deleteButton = document.querySelector("#deleteButton");

let listService = new ListService(usersWork, userList, x => x.name.first + " " + x.name.last); // сюда первым аргументом уже передаю массив, с которым будем работать
// он может содержать или начальные значения массива юзеров или те, которые были в сторедже, всё это зависит от того делали ли раньше изменения или нет
let formService = new UserFormService(document.forms[0]);

userList.addEventListener("click", function (e) {
    if (e.target.tagName != "LI") return;
    const userNumber = e.target.dataset.id;
    listService.select(userNumber);
    formService.fillForm(listService.selectedData);
});


document.forms[0].addEventListener("submit", function (e) {
    e.preventDefault();
    formService.saveForm();
    listService.reFillList(); // вызываю обновление списка li
});


deleteButton.addEventListener("click", function () {
    listService.deleteSelectedItem();
    formService.resetForm();
});