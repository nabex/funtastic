//ログイン処理

var openLoginPage = localStorage.getItem('openLoginPage');

function getLoginPage(bool){
  if(bool != "false"){
    $("#view").load("login.html");
  }else if(bool == "false"){
    PageControll(0);
  }
}


function setAccountInfo(){
  $(function(){
    if($("#userId").val()!=""){
      if(($("#userPass").val()==$("#userPass2").val())&&$("#userPass").val()!=""){
        var users={
          "Name":$("#userName").val(),
          "Id":$("#userId").val(),
          "Phone":$("#userPhone").val(),
          "Mail":$("#userMail").val(),
          "Pass1":$("#userPass").val(),
          "Pass2":$("#userPass2").val()
        };
        localStorage.contact=JSON.stringify(users);
        sendAccountInfo();
      }else{
        Materialize.toast("Password is false.",2000,'red');
      }
    }else{
      Materialize.toast("Enter user id.",2000,'red');
    }
  });
}


function sendAccountInfo(){
  var id = $("#userId").val();
  var pass = $("#userPass").val();
  Materialize.toast(id + "," + pass,2000);

  socket.emit("check sign up", id);

  socket.on("verify sign up", function(data){
    if(data == 1){
      Materialize.toast("success",2000);
      $("#view").load("login.html",function(){
        socket.emit("finalize sign up", [ id , pass ]);
      });
    }else{
      Materialize.toast("failed",2000,'red');
    }
  });
}


function requestLogin(){
  var id = $("#loginId").val();
  var pass = $("#loginPass").val();
  //alert(id + ':' + pass);

  socket.emit("request log in", [ id , pass ]);
  localStorage.setItem("userId", id);

  socket.on('verify log in', function(data){
    if(data == 4649){
      Materialize.toast("success",2000,'blue');
      localStorage.setItem('openLoginPage', false);
      //alert(data);
      PageControll(0);
    }else{
      Materialize.toast("failed",2000,'red');
    }
  });
}


function logout(){
  localStorage.setItem('openLoginPage', true);
  var bool = localStorage.getItem('openLoginPage');
  getLoginPage(bool);
  $('.button-collapse').sideNav('hide');
}
