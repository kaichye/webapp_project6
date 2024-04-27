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


if (readCookie("userid") != null) {
    location.assign('http://localhost:5173/Home');
}

login_btn = document.getElementById("submit");

login_btn.onclick = function() {
    user = document.getElementById("user").value;
    pass = document.getElementById("pass").value;
  
    userid = "";

    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://localhost:3000/getUser?id=' + user,
        success: function(data){
            data = data.replace(/&quot;/g, '"');
            data = data.replace(/\n/g, '');
            data = JSON.parse(data);
            userid = data.userid;
            roleid = data.roleid;
        }
    });

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