$.ajax({
    async: false,
    type: 'GET',
    url: 'http://localhost:3000/getStudents',
    success: function(data){
        result=data;
    }
});


let user;
for(var key in result){
    console.log(result[key]);
    console.log(key);
    let user = document.createElement("a");
    user.classList.add("students");
    user.addEventListener("click", function(){
        cookiestring = "studentid=" + getKeyByValue(result, user.innerHTML); 
        document.cookie = cookiestring;
        location.assign('http://localhost:5173/Home');
    });

    user.innerHTML = result[key];
    let page = document.getElementsByTagName("body")[0];
    var br = document.createElement("br");
    page.appendChild(br);
    page.appendChild(user);
}


function getKeyByValue(object, value) {
    for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (object[prop] === value)
                return prop;
        }
    }
}