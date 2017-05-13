shareSetting=11;

function setUserInfo(){
  $(function(){
    var users={
      "Name":$("#userChangeName").val(),
      //"Id":$("#userId").val(),
      "Phone":$("#userChangePhone").val(),
      "Mail":$("#userChangeMail").val(),
      //"Pass1":$("#userPass1").val(),
      //"Pass2":$("#userPass2").val()
    };
    localStorage.contact=JSON.stringify(users);
    localStorage.setItem("userId", users["Id"]);
    Materialize.toast("Saved user information",2000);
    PageControll(0);
  });
}


function showUserInfo(){
  $(function(){
    if(!(localStorage.contact===void 0)){
      var users=JSON.parse(localStorage.contact);
      $("#userChangeName").val(users["Name"]);
      //$("#userId").val(users["Id"]);
      $("#userChangePhone").val(users["Phone"]);
      $("#userChangeMail").val(users["Mail"]);
      //$("#userPass1").val(users["Pass1"]);
      //$("#userPass2").val(users["Pass2"]);
    }
  });
}

function showUserMenu(){
  $(function(){
    if(!(localStorage.contact===void 0)){
      var users=JSON.parse(localStorage.contact);
      $("#userNameM").html(users["Name"]);
      $("#userPhoneM").html(users["Phone"]);
      $("#userMailM").html(users["Mail"]);
    }
  });
}

function loadRangeSetting(){
  $(function(){
    $('#rangeContents').on('click',setContentsRange);
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
    if(!(localStorage.setting=== void 0)){
      shareSetting=localStorage.setting;
      if((shareSetting&01)==01){
        $('input[name="shareRange1"]').prop("checked",true);
      }
      if((shareSetting&10)==10){
        $('input[name="shareRange2"]').prop("checked",true);
      }
    }
  });
}

function searchUser(){
  $(function(){
    navigator.contacts.pickContact(function(contact){
      //alert('The following contact has been selected:' + JSON.stringify(contact));
      $(".userName").val(contact.displayName);
      if(contact.phoneNumbers!=null){
        var phone = contact.phoneNumbers[0].value.replace(/-/g,"");
        //Materialize.toast(phone,2000);
        $(".userPhone").val(phone);
      }else{
        $(".userPhone").val("");
      }
      if(contact.emails!=null){
        $(".userMail").val(contact.emails[0].value);
      }else{
        $(".userMail").val("");
      }
      //alert('The following contact has been selected:' + JSON.stringify(contact));
    },function(err){
      Materialize.toast('Error: ' + err,2000,'red');
    });
  });
}

function setContentsRange(e){
  var contentsR = e.target.getAttribute('data-nono');
  localStorage.rangeSetting=contentsR;
  if(whoAmI!="0"){
    if(contentsR==0)
    whoAmI = "11";
    else
    whoAmI = "1";
  }

}

function setPhoneShare(){
  shareSetting ^=01;
  localStorage.setting=shareSetting;
}

function setMailShare(){
  shareSetting ^=10;
  localStorage.setting=shareSetting;
}
