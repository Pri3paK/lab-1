// Получение всех пользователей
async function getUsers() {
// отправляет запрос и получаем ответ
const response = await fetch("/api/users", {
    method: "GET",
    headers: { "Accept": "application/json" }
});
// если запрос прошел нормально
if (response.ok === true) {
    // получаем данные
    const users = await response.json();
    let rows = document.querySelector("tbody"); 
    users.forEach(user => {
    // добавляем полученные элементы в таблицу
    rows.append(row(user));
        });
    }
}
// Получение одного пользователя
async function getUser(id) {
    const response = await fetch("/api/users/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        const form = document.forms["userForm"];
        form.elements['id'].value = user.id;
        form.elements["first-name"].value = user.firstname;
        form.elements["last-name"].value = user.lastname;
        form.elements["phone"].value = user.phone;
        form.elements["email"].value = user.email;
        form.elements["birthday"].value = user.birthday;
        form.elements["place-of-living"].value = user.placeofliving;
    }
}
// Добавление пользователя
async function createUser(userFirstName, userLastName, userPhone, userEmail, userBirthday,userPlaceOfLiving) {
    
    const response = await fetch("api/users", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
        firstname: userFirstName,
        lastname: userLastName,
        phone: userPhone,
        email: userEmail,
        birthday: userBirthday,
        placeofliving: userPlaceOfLiving
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        document.querySelector("tbody").append(row(user));
    }
}
// Изменение пользователя
async function editUser(userId, userFirstName, userLastName, userPhone, userEmail, userBirthday,userPlaceOfLiving) {
    const response = await fetch("api/users", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
        id: userId,
        firstname: userFirstName,
        lastname: userLastName,
        phone: userPhone,
        email: userEmail,
        birthday: userBirthday,
        placeofliving: userPlaceOfLiving,
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        const form = document.forms["userForm"];
        form.elements["id"].value = 0;
        document.querySelector("tr[data-rowid='" + user.id + "']").replaceWith(row(user));
    }
}
// Удаление пользователя
async function deleteUser(id) {
    const response = await fetch("/api/users/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        document.querySelector("tr[data-rowid='" + user.id + "']").remove();
    }
}

// создание строки для таблицы
function row(user) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", user.id);

    const idTd = document.createElement("td");
    idTd.append(user.id);
    tr.append(idTd);
        
    const firstNameTd = document.createElement("td");
    firstNameTd.append(user.firstname);
    tr.append(firstNameTd);
        
    const lastNameTd = document.createElement("td");
    lastNameTd.append(user.lastname);
    tr.append(lastNameTd);
        
    const phoneTd = document.createElement("td");
    phoneTd.append(user.phone);
    tr.append(phoneTd);
        
    const emailTd = document.createElement("td");
    emailTd.append(user.email);
    tr.append(emailTd);
     
    const birthdayTd = document.createElement("td");
    birthdayTd.append(user.birthday);
    tr.append(birthdayTd);

    const placeoflivingTd = document.createElement("td");
    placeoflivingTd.append(user.placeofliving);
    tr.append(placeoflivingTd);

    const linksTd = document.createElement("td");
       
    const editLink = document.createElement("button");
    editLink.setAttribute("data-id", user.id);
    editLink.append("Змінити");
    editLink.addEventListener("click", e => {
        
        e.preventDefault();
        getUser(user.id);
    });
    linksTd.append(editLink);
        
    const removeLink = document.createElement("button");
    removeLink.setAttribute("data-id", user.id);
    removeLink.append("Видалити");
    removeLink.addEventListener("click", e => {
      
        e.preventDefault();
        deleteUser(user.id);
    });
        
    linksTd.append(removeLink);
    tr.appendChild(linksTd);
        
    return tr;
}
  
// отправка формы
document.forms["userForm"].addEventListener("submit", e => {
    e.preventDefault();

    function add (input){
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }

    function remove (input){
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }
       
    let error = 0;
    // проверка полей имени и фамилии

    function name(parameter){
        remove(parameter)
        if (parameter.value == ''){
            error++
            add(parameter)
        }
    }

    function phoneError () {
        alert("Номер телефона написано не правильно");
    }

    // проверка номера телефона 
    function phone (parameter){
        remove(parameter)
        let par = parameter.value
        let phone = '';
        phone+=par[0]+par[1]+par[2]+par[3]
        if (parameter.value == ''){
            add(parameter)
            error++
        }else if (phone != '+380'){
            add(parameter)
            error++
            phoneError ()
        }else if(par.length < 13){
            add(parameter)
            error++
            phoneError ()
        }
        else if (par[4] != '9' & par[4] != '6' & par[4] != '7' & par[4] != '5'){
            add(parameter)
            error++
            phoneError ()
        }else if (par[4] == 9 &(par[5] !='5' & par[5] !='6'& par[5] !='7' & par[5] !='8' & par[5] !='9' & par[5] !='3')){
            add(parameter)
            error++
            phoneError ()
        }else if(par[4] == 7 & par[5] != '3'){
            add(parameter)
            error++
            phoneError ()
        }else if (par[4]==6 &(par[5] !='6'& par[5] !='7'& par[5] !='3')){
            add(parameter)
            error++
            phoneError ()
        }else if(par[4]==5 & par[5] !='0'){
            add(parameter)
            error++
            phoneError ()
        }
    }
    // провека почти 
    function gmail (parameter){
        remove(parameter)
        const GMAIL = parameter.value;
        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        if(!(EMAIL_REGEXP.test(parameter.value))){
            add(parameter)
            error++
            alert('Електронна пошта введена не правидьно')
        }
    }
        
    name(document.querySelector('.input-last-name'))
    name(document.querySelector('.input-first-name'))
    name(document.querySelector(".input-place-of-living"))
    gmail(document.querySelector('.input-email'))
    phone(document.querySelector('.input-phone'))
        
    if(error > 0){
        alert(`Заповніть обов'язкові поля`)
    }else{
    const form = document.forms["userForm"];
    const id = form.elements["id"].value;
    const firstName = form.elements["first-name"].value;
    const lastName = form.elements["last-name"].value;
    const phone = form.elements["phone"].value;
    const email = form.elements["email"].value;
    const birthday = form.elements["birthday"].value;
    const placeofliving = form.elements["place-of-living"].value;
    if (id == 0){
        createUser(firstName, lastName, phone, email, birthday, placeofliving );
    }else{
        editUser(id, firstName, lastName, phone, email, birthday, placeofliving);
    }
}
});       
// загрузка пользователей
getUsers();  