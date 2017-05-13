//パーツ読み込み
function PageControll(val){
  if(val==3) $('#fab').addClass('fab');
  else $('#fab').removeClass('fab');

  if(val != 5) makeMotionBool = false;

  $(function() {
    switch(val){
      case 0:
      $("#view").innerHTML = "<div id='home'></div>";
      $("#view").load("home.html",function(){
        homeInitilize();
        setPhotoDATA();
        animated();
        $('.fixed-action-btn').closeFAB();
      });
      removeAnimationClass();
      $(".brand-logo").html("home");
      menuValue=1;
      changeBackButton();
      break;
      case 1:
      $("#view").innerHTML = "<div id='page1'></div>";
      $("#view").load("page1.html",function(){
        bluetoothFanc.initialize();
        $('.fixed-action-btn').closeFAB();
      });
      removeAnimationClass();
      $(".brand-logo").html("Select Sensing Device");
      menuValue=0;
      changeBackButton();
      break;
      case 2:
      $("#view").innerHTML = "<div id='page2'></div>";
      $("#view").load("page2.html");
      removeAnimationClass();
      $('.fixed-action-btn').closeFAB();
      $(".brand-logo").html("Motion Debug");
      menuValue=0;
      changeBackButton();
      break;
      case 3:
      $("#view").innerHTML = "<div id='schedulePage'></div>";
      $("#view").load("scheduleList.html",function(){
        scheduleFanc.initialize();
        $('.fixed-action-btn').closeFAB();
      });
      $(".brand-logo").html("Schedule");
      menuValue=0;
      changeBackButton();
      break;
      case 4:
      $("#view").innerHTML = "<div id='page5'></div>";
      $("#view").load("page5.html",function(){
        showUserInfo();
        $('.fixed-action-btn').closeFAB();
      });
      removeAnimationClass();
      $(".brand-logo").html("User Information");
      menuValue=0;
      changeBackButton();
      break;
      case 5:
      $("#view").innerHTML = "<div id='makeMotion'></div>";
      $("#view").load("makeMotion.html",function(){
        showMotion();
        $('.fixed-action-btn').closeFAB();
      });
      makeMotionBool = true;
      removeAnimationClass();
      $(".brand-logo").html("Maiking Motion");
      menuValue=0;
      changeBackButton();
      break;
      case 6:
      $("#view").innerHTML = "<div id='publicSet'></div>";
      $("#view").load("publicSetting.html",function(){
        $('.fixed-action-btn').closeFAB();
        loadRangeSetting();
      });
      removeAnimationClass();
      $(".brand-logo").html("Public Range Setting");
      menuValue=0;
      changeBackButton();
      break;
      case 7:
      $("#view").innerHTML = "<div id='createAccount'></div>";
      $("#view").load("createAccount.html",function(){
        $('.fixed-action-btn').closeFAB();
      });
      removeAnimationClass();
      $(".brand-logo").html("Create an Account");
      break;
      case 8:
      $("#view").innerHTML = "<div id='friendList'></div>";
      $("#view").load("FriendList.html",function(){
        $('.fixed-action-btn').closeFAB();
        loadRangeSetting();
        friend.initialize();
      });
      removeAnimationClass();
      $(".brand-logo").html("Friend List");
      menuValue=0;
      changeBackButton();
      break;
    }
    /*
    $("nav ul li").click(function () {
    var index = $("nav ul li").index(this);
    index += 2;
    var order = "nth-child("+index+")";

    $("nav ul li:"+order).css("background-color", "#00bcd4"); //選択された項目の背景色をcyanに変更
    $("nav ul li:not(:"+order+")").css("background-color", "#eceff1"); //選択外項目の色をサイドバー背景色にする

    $("nav ul li:"+order+" a").css("color", "#fff");//選択された項目のtxt色を白に変更
    $("nav ul li:not(:"+order+") a").css("color", "#616161");//選択された項目のtxt色を黒に変更
  });
  */


});
}

function fabCon(){
  $('.fixed-action-btn').openFAB();
}


/*
$(function(){
$("#setting").hover(
function(){
$('.dropdown-button').dropdown('open');
},
function(){
$('.dropdown-button').dropdown('close');
}
);
});
*/



//ページ遷移アニメーションのコントロール
function removeAnimationClass(){

  //var type = "animated fadeIn";
  var type = "animated flipInY";

  $("nav ul li").click(function(){
    $("#view").addClass(type);
  });

  $(document).ready(function(){
    $("#view").removeClass(type);
  });

  $(".fixed-action-btn ul li").click(function(){
    $("#view").addClass(type);
  });
}

function changeBackButton(){
  if(menuValue==0){
    $("#menubar").hide();
    $("#menubar-back").show();
  }else if(menuValue==1){
    $("#menubar-back").hide();
    $("#menubar").show();
  }
}
