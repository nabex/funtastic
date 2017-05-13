dNum=[0,0,0,0,0,0,0,0,0];

var bluetoothFanc = {
  //初期化
  initialize: function() {
    if(deviceInfo.getDeviceName()==""){
      tmpBtnTrigger(1);
    }else{
      tmpBtnTrigger(0);
    }
    this.bindEvents();
  },

  //イベントの管理
  bindEvents: function() {
    var TOUCH_START = 'touchstart';
    $('#deviceButton').on(TOUCH_START,this.searchDevice);
    $('#DeviceSelect').on(TOUCH_START,this.connect);
    $('#smartButton').on(TOUCH_START,this.chooseSmart);
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    }
    );
  },

  onDeviceReady: function() {
    //cordovaがOnになった時に行いたい処理を記述

    document.addEventListener('deviceready', function(){
      bluetoothFanc.autoConnect();
    }, false);
  },


  //起動時に自動ペアリングする
  autoConnect: function(){
    var deviceId=deviceInfo.getDeviceId();
    var deviceName=deviceInfo.getDeviceName();
    if(deviceId!=""){
      bluetoothSerial.connect(deviceId,function(){
        Materialize.toast("success:"+deviceName, 2000,'blue');
        bluetoothFanc.receiveData();
      },this.onError);
    }else{
      //alert("本体を設定しています。");
      $(".info2").text('sensor from this device ...OK');

    }
  },


  //デバイスに接続した時の処理
  connect: function(e) {
    //接続したデバイスの情報を取得
    var deviceName = e.target.dataset.deviceName;
    var deviceId = e.target.dataset.deviceId;

    deviceInfo.setDeviceId(deviceId);
    deviceInfo.setDeviceName(deviceName);

    bluetoothSerial.connect(deviceId, function(){
      Materialize.toast("success:"+deviceName, 2000,'blue');
      bluetoothFanc.receiveData();
      tmpBtnTrigger(0);
    }, bluetoothFanc.onError);
  },


  //bluetooth端末との接続を解除する
  disconnect: function(event) {
    deviceInfo.setDeviceId("");
    deviceInfo.setDeviceName("");
    bluetoothSerial.disconnect(
      function(){
        //alert("connecting success");
        Materialize.toast("connecting success", 2000,'blue');
        tmpBtnTrigger(1);
      }, bluetoothFanc.onError);
    },


    //デバイスを検索する
    searchDevice: function(){
      bluetoothSerial.list(updateTag.searchResult, bluetoothFanc.onError);
    },


    //データを受信する
    receiveData: function(){
      bluetoothSerial.subscribe("\n",bluetoothFanc.splitString,bluetoothFanc.onError);
    },


    //受信した文字列を整数に変換する
    splitString: function(data){
      var strings=data.split(",");
      for(var i=0;i<strings.length;i++){
        dNum[i]=Number(strings[i]);    //accX,accY,accZ,gyrX,gryY,gryZ 重力加速度も対応化
      }
    },


    onError: function(reason) {
      Materialize.toast("ERROR: " + reason,2000,'red');
      // エラーが発生したら，本体に自動で切り替え
      bluetoothFanc.chooseSmart();
    },



    //本体を選んだ時の処理
    chooseSmart: function(){
      deviceInfo.setDeviceId("");
      deviceInfo.setDeviceName("");
      tmpBtnTrigger(1);
      bluetoothSerial.disconnect(function(){
        Materialize.toast("setting Smart phone", 2000,'blue');
      },bluetoothFanc.onError);
    }
  };


  //HTML内のタグに関わる操作
  var updateTag={
    //検索したデバイスをドロップダウンに反映
    searchResult: function(devices){
      //listによる実装
      //ドロップダウンを一度初期化し再度追加していく
      DeviceSelect.innerHTML = "";
      devices.forEach(function(device) {
        var listItem = document.createElement('li'),
        html =  device.name;

        listItem.innerHTML = html;
        listItem.dataset.deviceName=device.name;
        listItem.dataset.deviceId = device.id;

        DeviceSelect.appendChild(listItem);
      });
    },

    //デバイス選択画面のタグ表示名を変更
    changeButtonName:function(name){
      //ドロップダウンのDevicesの表示名を変更
      devices.innerHTML=name;
      //専用デバイスボタンの表示名を変更
      deviceButton.innerHTML="<p>device<br>"+name+"</p>";
    },
  };


  //ローカルストレージを用いた操作
  var deviceInfo={
    //bluetoothデバイスのidを保存
    setDeviceId:function(id){
      localStorage.id=id;
    },
    //保存されているbluetoothデバイスのidを取得
    getDeviceId:function(){
      return localStorage.id;
    },
    //bluetoothデバイスの名前を保存
    setDeviceName:function(name){
      localStorage.name=name;
    },
    //保存されているbluetoothデバイスの名前を取得
    getDeviceName:function(){
      return localStorage.name;
    }
  };

//接続しているデバイスによってボタンの色を変更する
  var tmpBtnTrigger = function(num){
    switch (num) {
      case 0://「専用デバイス」選択状態
      $("#deviceButton").addClass("cyan");
      $("#deviceButton").removeClass("disabled");
      $("#smartButton").addClass("disabled");
      break;
      case 1://「本体」選択状態
      $("#smartButton").addClass("cyan");
      $("#smartButton").removeClass("disabled");
      $("#deviceButton").addClass("disabled");
      break;
    }
  };

/*
var bluetoothBasicFanc = {
//初期化
initialize: function() {
//alert("a");
this.bindEvents();
showPages.showMainPage();
},

//イベントの管理
bindEvents: function() {
var TOUCH_START = 'touchstart';
document.addEventListener('deviceready', this.onDeviceReady, false);
deviceButton.addEventListener(TOUCH_START,this.searchDevice,false);
deviceList.addEventListener(TOUCH_START, this.connect, false);
disconnectButton.addEventListener(TOUCH_START, this.disconnect, false);
},

onDeviceReady: function() {
//cordovaがOnになった時に行いたい処理を記述

//this.autoConnect();
},

//起動時に自動ペアリングする
autoConnect: function(){
var deviceId=getDeviceInfo.getDeviceId();
if(deviceId!=""){
bluetoothSerial.connect(deviceId,function(){
alert("success:"+localStorage.name);
//this.receiveData();
},this.onError);
updateTag.changeButtonName();
}
},

//デバイスに接続した時の処理
connect: function(e) {
//接続したデバイスの情報を取得
var deviceName = e.target.dataset.deviceName;
var deviceId = e.target.dataset.deviceId;

updateTag.changeButtonName(deviceName);
//deviceBeanは１スプリント目では使用しない
////setDeviceInfo.setDeviceName(deviceName);
////setDeviceInfo.setDeviceId(deviceId);
bluetoothSerial.connect(deviceId, function(){
alert("success:"+deviceId);}, bluetoothBasicFanc.onError);
},

disconnect: function(event) {
bluetoothSerial.disconnect(
showPages.showMainPage, bluetoothBasicFanc.onError);
},

searchDevice: function(){
showPages.showSelectDevicePage();
//デバイスを検索する
bluetoothSerial.list(updateTag.searchResult, bluetoothBasicFanc.onError);
},

receiveData: function(){
bluetoothSerial.subscribe("\n",bluetoothBasicFanc.splitString,bluetoothBasicFanc.onError);
},

//受信した文字列を整数に変換する
splitString: function(data){
var acc=[];
var gyr=[];
var strings=data.split(",");
for(var i=0;i<strings.length/2;i++){
acc[i]=Number(strings[i]);    //accX,accY,accZ
gyr[i+3]=Number(string[i+3]);  //gyrX,gryY,gryZ
}
},

onError: function(reason) {
alert("ERROR: " + reason);
}
};
*/

/*//デフォルト設定では本体がアクティブ状態。今後の開発で専用デバイスが接続されていたら自動で切り替えできるようにしたい
tmpBtnTrigger(1);

$("#DeviceSelect li").on("click", deviceButton);
$("#smartButton").on("click", smartButton);



function tmpBtnTrigger(num){
  switch (num) {
    case 0://「専用デバイス」選択状態
    $("#deviceButton").addClass("cyan");
    $("#smartButton").addClass("disabled");
    break;
    case 1://「本体」選択状態
    $("#smartButton").addClass("cyan");
    $("#deviceButton").addClass("disabled");
    break;
  }
}


//専用デバイスボタンのトリガー処理
function deviceButton(){
  $("#deviceButton").addClass("cyan");
  $("#deviceButton").removeClass("disabled");
  $("#smartButton").addClass("disabled");
}

//本体ボタンのトリガー処理
function smartButton(){
  $("#smartButton").removeClass("disabled");
  $("#deviceButton").addClass("disabled");
}
*/
