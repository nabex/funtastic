var changeMotionBool = new Boolean(false);
changeMotionBool = true; //true: 送信者 / false:受信者

var whoAmI = "0";
var menuValue=-1;


/******************************************************************/
/********         送信者・受信者 切り替え制御処理            ***********/
/******************************************************************/
function modeChange(){
  changeMotionBool = !changeMotionBool;

  if(changeMotionBool == true){
    senderMode();
  }
  else if(changeMotionBool == false){
    receiverMode();
  }
}



/******************************************************************/
/********              送信者モード処理                    ***********/
/******************************************************************/
function senderMode(){
  connect();
  if(localStorage.rangeSetting==0)
  whoAmI = "11";
  else
  whoAmI = "1";

  //alert(whoAmI);
  $("#modeStatus").html("<label>Send</label><i class='fa fa-fw fa-cyan fa-angle-double-up'></i>");
  $('input[name="modeChangeBtn"]').prop("checked",true);
  changeMotionBool = true;
  socket.off('data request');
  socket.on('data request', function(id){
    if(menuValue==1){
      //alert("Request GET: "+ id[0]);

      var contentID = id[0] - 0;
      var socketID = id[1];

      switch (contentID) {
        //  contentID:0 連絡先 受信処理
        case 0:
        sendContact(socketID);
        break;
        //  contentID:1 スケジュール 受信処理
        case 1:
        sendSchedule(socketID);
        break;
        //  contentID:2 画像 受信処理
        case 2:
        sendPhotoData(socketID);
        break;
      }
    }
  });
}


/******************************************************************/
/********              受信者モード処理                   ***********/
/******************************************************************/
function receiverMode(){
  connect();
  whoAmI = 0;
  $("#modeStatus").html("<label>Receive</label><i class='fa fa-fw fa-cyan fa-angle-double-down'></i>");
  $('input[name="modeChangeBtn"]').prop("checked",false);

  changeMotionBool = false;
  waitRequest();//受信スタンバイ処理
  socket.off('send real data from server');
  socket.on('send real data from server', function(data){
    audioPlay(4);
    //data[0] is contentID, data[1] is real Data
    switch (data[0] - 0) {
      //  contentID:0 連絡先 受信処理
      case 0:
      receiveContact(data[1]);
      break;
      //  contentID:1 スケジュール 受信処理
      case 1:
      receiveSchedule(data[1]);
      break;
      //  contentID:2 画像 受信処理
      case 2:
      receivePhotoData(data[1]);
      break;
    }
  });
}


/******************************************************************/
/********               受信スタンバイ処理                 ***********/
/******************************************************************/

//画像の受信準備
function waitRequest(){
  if(whoAmI == 0){
    socket.on('wait request', function(id){
      //alert('wait req' + id);
      switch (id - 0) {
        //  motionID:0 連絡先 受信スタンバイ処理
        case 0:
        break;
        //  motionID:1 スケジュール 受信スタンバイ処理
        case 1:
        break;
        //  motionID:2 画像 受信スタンバイ処理
        case 2:
        $('.card-image').addClass('loadingWidth');
        $('#camera_pic').attr('src', 'img/load.gif');
        break;
      }
    });
  }
}
