$.ajax({
    async: false,
    type: 'GET',
    url: 'http://localhost:3000/getStudents',
    success: function(data){
        result=data;
    }
});

try {
    if (typeof user !== 'undefined') {
        throw new Error("Safe quit");
    } else {
        let user;
    }
    for(var key in result){
        console.log(result[key]);
        console.log(key);
        user = document.createElement("a");
        user.classList.add("students");
        cookiestring = "userid=" + key;
        document.cookie = cookiestring;
        user.setAttribute('href', 'http://localhost:5173/Home');
        user.innerHTML = result[key];
        let page = document.getElementsByTagName("body")[0];
        var br = document.createElement("br");
        page.appendChild(br);
        page.appendChild(user);
    }
    
} catch (error) {
}

