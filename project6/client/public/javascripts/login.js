function readCookie(name) {
    try {
        let content = "; " + document.cookie;
        let cookies = content.split(`; ${name}=`);
        if (cookies.length === 2){
            return cookies.pop().split(';')[0];
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
  
    dat = "{\"user\": \"" + 
          user +
          "\", \"pass\": \"" +
          pass +
          "\"}"; 

    $.ajax({
        async: false,
        type: 'POST',
        url: 'http://localhost:3000/Login',
        data: dat,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function(data){
            console.log(data);

            if(data.success){
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
        }
    });
}