login_btn = document.getElementById("submit");

login_btn.onclick = function() {
    user = document.getElementById("user").value;
    pass = document.getElementById("pass").value;
    
    console.log(user)
    console.log(pass)
  
    userid = "";

    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://localhost:3000/getUser?id=' + user,
        success: function(data){
            console.log(parseInt(data));
            userid = parseInt(data);
        }
    });

    cookiestring = "userid=" + userid;

    document.cookie = cookiestring;

    console.log(document.cookie);


    //location.assign('http://localhost:5173/Home');

}