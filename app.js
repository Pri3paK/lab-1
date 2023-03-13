const http = require("http");
const fs = require("fs");

// данные, с которыми работает клиент
const users = [
    { id:1, firstname:"Влад",lastname:"Білоконь", phone:'+380935664585',email:'ryyyyy@gmail.com',birthday:'2005-04-11',placeofliving:"Одеса"}, 
    { id:2, firstname:"Федір",lastname:"Вовк", phone:'+380938564585',email:'tgetyyy@gmail.com',birthday:'2004-11-11',placeofliving:"Вінниця"},
    { id:3, firstname:"Максим",lastname:"Березюк", phone:'+380958564585',email:'egtgef@gmail.com',birthday:'2005-05-03',placeofliving:'Київ'}
]
// обрабатываем полученные от клиента данные
function getReqData(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }
            const data = JSON.parse(Buffer.concat(buffers).toString());
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}
 
http.createServer(async (request, response) => {
     // получение всех пользователей
     if (request.url === "/api/users" && request.method === "GET") {
        response.end(JSON.stringify(users));
    }
    // получение одного пользователя по id
     else if (request.url.match(/\/api\/users\/([0-9]+)/) && request.method === "GET") {
        // получаем id из адреса url
        const id = request.url.split("/")[3];
        // получаем пользователя по id
        const user = users.find((u) => u.id === parseInt(id));
        // если пользователь найден, отправляем его
        if(user) 
            response.end(JSON.stringify(user));
        // если не найден, отправляем статусный код и сообщение об ошибке
        else{
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Пользователь не найден" }));
        }
    }
    // удаление пользователя по id 
    else if (request.url.match(/\/api\/users\/([0-9]+)/) && request.method === "DELETE") {
        // получаем id из адреса url
        const id = request.url.split("/")[3];
        // получаем индекс пользователя по id
        const userIndex = users.findIndex((u) => u.id === parseInt(id));
       // если пользователь найден, удаляем его из массива и отправляем клиенту
        if(userIndex > -1) {
            const user = users.splice(userIndex, 1)[0];
            response.end(JSON.stringify(user));
        }
        // если не найден, отправляем статусный код и сообщение об ошибке
        else{
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Пользователь не найден" }));
        }
    }
   // добавление пользователя
    else if (request.url === "/api/users" && request.method === "POST") {
        try{
            // получаем данные пользователя
            const userData = await getReqData(request);
            // создаем нового пользователя
            const user = {firstname: userData.firstname, lastname: userData.lastname, phone: userData.phone, email: userData.email, birthday:userData.birthday,placeofliving:userData.placeofliving };
            // находим максимальный id
            const id = Math.max.apply(Math,users.map(function(u){return u.id;}))
            // увеличиваем его на единицу
            user.id = id + 1;
            // добавляем пользователя в массив
            users.push(user);
            response.end(JSON.stringify(user));
        }
        catch(error){
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Некорректный запрос" }));
        }
    }
    // изменение пользователя
    else if (request.url === "/api/users" && request.method === "PUT") {
        try{
            const userData = await getReqData(request);
            // получаем пользователя по id
            const user = users.find((u) => u.id == parseInt(userData.id));
            // если пользователь найден, изменяем его данные и отправляем обратно клиенту
            if(user) {
                user.firstname = userData.firstname;
                user.lastname = userData.lastname;
                user.phone = userData.phone;
                user.email = userData.email;
                user.birthday = userData.birthday;
                user.placeofliving = userData.placeofliving;
                response.end(JSON.stringify(user));
            }
            // если не найден, отправляем статусный код и сообщение об ошибке
            else{
                response.writeHead(404, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ message: "Пользователь не найден" }));
            }
        }
        catch(error){
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Некорректный запрос" }));
        }
    }
    else if (request.url === "/" || request.url === "/ilab_1.html") {
        fs.readFile("lab_1.html", (error, data) => response.end(data));
    }else if (request.url === "/" || request.url === "/lab_1.css") {
        fs.readFile("lab_1.css", (error, data) => response.end(data));
    }else if (request.url === "/" || request.url === "/lab_1.js") {
        fs.readFile("lab_1.js", (error, data) => response.end(data));
    }
    else{
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Ресурс не найден" }));
    }
}).listen(3000, ()=>console.log("Сервер запущен по адресу http://localhost:3000"));
