function readCookie(name) {
    try {
        const content = `; ${document.cookie}`;
        const cookies = content.split(`; ${name}=`);
        if (cookies.length === 2){
            return cookies.pop().split(';').shift();
        }
    }
    catch {
        return null;
    }
  }


if (readCookie("roleid") == 3) {
    location.assign('http://localhost:5173/Home');
} else if (readCookie("roleid") == 2) {
    location.assign('http://localhost:5173/Faculty');
}

login_btn = document.getElementById("submit");

login_btn.onclick = function() {
    user = document.getElementById("user").value;
    pass = document.getElementById("pass").value;
  
    let userid = "";
    let roleid = "";
    let fetched_data = null;

    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://localhost:3000/getUser?id=' + user,
        success: function(data){
            data = data.replace(/&quot;/g, '"');
            fetched_data = data.replace(/\n/g, '');
        }
    });

    try {
        fetched_data = JSON.parse(fetched_data);
        userid = fetched_data.userid;
        roleid = fetched_data.roleid;

        cookiestring = "userid=" + userid;
        document.cookie = cookiestring;

        cookiestring = "roleid=" + roleid;
        document.cookie = cookiestring;

        console.log(document.cookie);


        if (parseInt(roleid) == 3) {
            location.assign('http://localhost:5173/Home');
        }
        else {
            location.assign('http://localhost:5173/Faculty');
        }
    }
    catch {
        user_field = document.getElementById("pass");
        user_field.style.color = "red";

    }

}