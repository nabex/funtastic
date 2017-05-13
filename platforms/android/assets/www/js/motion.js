var makeMotionBool = false;
var createMotionArray="";
var motionJSON={};

(function () {

  var geoData=function(){
    return localStorage.getItem('geoData');
  };
  //var whoAmI = 0;

  var SensorValueLoad = true;

  var handshakeCnt = 0;
  var gooTouchCnt = 0;
  var highTouchCnt = 0;
  var rotationalphaCnt = 0;
  var changeCnt=0;

  var changeBool=false;
  var handshakeBool = false;
  var gooTouchBool = false;
  var gooTouchRotaBool = false;
  var highTouchBool = false;

  var upCnt = 0;
  var downCnt = 0

  var motionUDLR=['Up','Down','Left','Right','RightUp','RightDown','LeftDown','LeftUp'];
  var gyro=0;

  var now = {
    time : function(){
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var h = now.getHours();
      var m = now.getMinutes();
      var s = now.getSeconds();
      var time = year + ',' +  month + ',' + date + ',' + h + ',' + m + ',' + s;
      return time;
    }
  }


  $(function () {
    //選択されているデバイスによって読み込む関数を変更
    window.addEventListener("devicemotion", devicemotionHandler);
    window.addEventListener("deviceorientation", deviceorientationHandler);
  });



  /******************************************************************/
  /********         加速度　制御処理                         ***********/
  /******************************************************************/
  function devicemotionHandler(event) {
    if(localStorage.name != ""){
      deviceNum();
    }else{


      if(SensorValueLoad == true){
        // 加速度
        var x = Math.round(event.acceleration.x * 10) / 10;
        var y = Math.round(event.acceleration.y * 10) / 10;
        var z = Math.round(event.acceleration.z * 10) / 10;

        //傾き
        var xg = Math.round(event.accelerationIncludingGravity.x * 10) / 10; //左右
        var yg = Math.round(event.accelerationIncludingGravity.y * 10) / 10; //上下
        var zg = Math.round(event.accelerationIncludingGravity.z * 10) / 10; //前後

        //回転速度
        var rotationalpha = Math.round(event.rotationRate.alpha * 10) / 10;
        var rotationbeta = Math.round(event.rotationRate.beta * 10) / 10;
        var rotationgamma = Math.round(event.rotationRate.gamma * 10) / 10;
      }
      /*
      document.getElementById("agx").innerHTML = "agX: " + xg;
      document.getElementById("agy").innerHTML = "agY: " + yg;
      document.getElementById("agz").innerHTML = "agZ: " + zg;
      */
      /*
      document.getElementById('accelerationX').innerHTML = x;
      document.getElementById('accelerationY').innerHTML = y;
      document.getElementById('accelerationZ').innerHTML = z;

      document.getElementById('rotationalpha').innerHTML = rotationalpha;
      document.getElementById('rotationbeta').innerHTML = rotationbeta;
      document.getElementById('rotationgamma').innerHTML = rotationgamma;


      document.getElementById('handshakeCnt').innerHTML = handshakeCnt;
      document.getElementById('gooTouchCnt').innerHTML = gooTouchCnt;
      document.getElementById('highTouchCnt').innerHTML = highTouchCnt;
      document.getElementById('rotationalphaCnt').innerHTML = rotationalphaCnt;
      */
      //x軸方向 加速度カウンター処理
      var l = 20; //握手用
      if(x > l || x < -l){
        if(handshakeBool == true){
          handshakeCnt++;
        }
      }

      //グータッチ用
      if(x < -10 && gooTouchBool == true) gooTouchCnt++;
      if(rotationalpha > 8) rotationalphaCnt++;
      if(rotationalphaCnt > 1) gooTouchRotaBool = true;

      if(rotationalphaCnt > 0){
        setTimeout(function(){
          rotationalphaCnt = 0;
          gooTouchCnt = 0;
        }, 2000);
      }


      //Z軸方向 加速度カウンター処理
      if(z < -10 && highTouchBool == true){
        highTouchCnt++;
      }

      //チェンジモーション用
      var cl=7;
      if(changeBool==true){
        if (rotationbeta <= -cl && changeCnt==0) changeCnt++;
        if(rotationbeta >=cl && changeCnt==1) changeCnt++;
      }


      //握手ー加速度・ジャイロによる判定
      if(handshakeCnt > 3){
        var userId = localStorage.getItem("userId");
        socket.emit("send motion data", userId + ',' + whoAmI + ',' + 0 + ',' + now.time() + ',' + geoData());

        if(ppapBool == false) audioPlay(0);
        else audioPlay(6);

        handshakeCnt = 0;
        handshakeBool = false;
        SensorValueLoad = false;
        SensorValueLoadControl();
        //alert('握手');
        Materialize.toast('Handshake', 2000);
      }

      //グータッチー加速度・ジャイロによる判定
      if(gooTouchCnt >= 1 && gooTouchBool == true && gooTouchRotaBool == true){
        var userId = localStorage.getItem("userId");
        socket.emit("send motion data", userId + ',' + whoAmI + ',' + 1 + ',' + now.time() + ',' + geoData());

        if(ppapBool == false) audioPlay(1);
        else audioPlay(7);

        gooTouchCnt = 0;
        rotationalphaCnt = 0;
        gooTouchBool = false;
        gooTouchRotaBool = false;
        SensorValueLoad = false;
        SensorValueLoadControl();
        //alert("グータッチ");
        Materialize.toast('Fistbump', 2000);
      }

      //ハイタッチー加速度・ジャイロによる判定
      if(highTouchCnt >= 1 && highTouchBool == true){
        var userId = localStorage.getItem("userId");
        socket.emit("send motion data", userId + ',' + whoAmI + ',' + 2 + ',' + now.time() + ',' + geoData());

        if(ppapBool == false) audioPlay(2);
        else audioPlay(8);

        highTouchCnt = 0;
        highTouchBool = false;
        SensorValueLoad = false;
        SensorValueLoadControl();
        //alert("ハイタッチ");
        Materialize.toast('Hi-Five', 2000);
      }


      //チェンジー加速度・ジャイロによる判定
      if(changeCnt > 1){

        if(ppapBool == false) audioPlay(3);
        else audioPlay(9);

        changeCnt = 0;
        changeBool = false;
        SensorValueLoad = false;
        SensorValueLoadControl();
        //alert("Mode Change");
        Materialize.toast('Mode Change', 2000);
        modeChange(); //モード切り替え処理 modeChange.js
      }

      /******************************************************************/
      /********         motion作成  判別  処理                  ***********/
      /******************************************************************/
      function createMotion(val){
        gyro=0;
        if(highTouchBool) gyro="0";
        else if(changeBool) gyro="1";
        else if(gooTouchBool) gyro="2";
        else  gyro="0";

        if(vector(x,y)){
          if (x > val) { // 右
            motionNum(6);
          }
          else if (x < -val) { // 左
            motionNum(5);
          }
          else if (y > val-8) { // 上
            motionNum(3);
          }
          else if (y < -val) { // 下
            motionNum(4);
          }
          else return;
        }
        //alert(createMotionArray);
      }

      if(makeMotionBool == true){
        createMotion(14);
      }
    }// !.deviceNum();
  }



  /******************************************************************/
  /********         ジャイロ 制御処理                        ***********/
  /******************************************************************/
  function deviceorientationHandler(event) {

    if(localStorage.name == ""){


      if(SensorValueLoad == true){
        //傾き
        var beta = Math.round(event.beta * 10) / 10; //-180 から 180 の範囲の値による度数で表されます。
        var gamma = Math.round(event.gamma * 10) / 10; //-90 から 90 の範囲の値による度数で表されます。
        var alpha = Math.round(event.alpha * 10) / 10; //0 から 360 の範囲による度数で表されます。
      }

      /*
      document.getElementById('beta').innerHTML = beta;
      document.getElementById('gamma').innerHTML = gamma;
      document.getElementById('alpha').innerHTML = alpha;
      */

      //握手処理-ジャイロ関係
      if((gamma >= -90) && (gamma <= -70)){
        handshakeBool = true;
      }else{
        handshakeBool = false;
      }

      //グータッチ処理ージャイロ関係
      if((beta > 160) && (beta < 180) || (beta >= -180) && (beta < -160)){　//端末が裏になっていることの判別
        gooTouchBool = true;
      }else{
        gooTouchBool = false;
      }


      //ハイタッチ！処理ージャイロ関係
      if((beta >= 55) && (beta <= 130)){
        if((gamma >= -30) && (gamma <= 0) || (gamma >= 0) && (gamma <= 30)){
          highTouchBool = true;
        }
      }else{
        highTouchBool = false;
      }


      //チェンジモーション処理ージャイロ関係
      if(beta >= -10 && beta < 40){

        //if(beta >= 60 && beta < 80){
        changeBool=true;
      }else{
        changeBool=false;
      }
    }

  }

  //モーション判別後 2s後にセンサー値を再度取得する
  function SensorValueLoadControl(){

    if(SensorValueLoad == false){
      setTimeout(function(){
        SensorValueLoad = true;
      }, 250);
    }

  }
  function motionNum(num){
    audioPlay(5);
    createMotionArray+=gyro+num;
    num = parseInt(num, 16);
    Materialize.toast(gyro+num+' '+motionUDLR[num-3],2000);
    SensorValueLoad = false;
    SensorValueLoadControl();
  }
  //加速度からベクトル計算をして斜めの加速度を検出する
  function vector(x, y){
    var rad=0;
    var sca=0;
    rad=Math.atan2(y,x);
    rad=rad*180 / 3.1415;
    sca=Math.sqrt(x*x+y*y);
    if(sca>10){
      if(rad>=30&&rad<=60){
        motionNum(7);
        return 0;
      }else if(rad>=120&&rad<=150){
        motionNum('a');
        return 0;
      }else if(rad>=-150&&rad<=-120){
        motionNum(9);
        return 0;
      }else if(rad>=-60&&rad<=-30){
        motionNum(8);
        return 0;
      }
    }
    return 1;
  }

  /******************************************************************/
  /********              専用デバイス処理                    ***********/
  /******************************************************************/
  function deviceNum(){
    // 加速度
    var x = dNum[0];
    var y = dNum[1];
    var z = dNum[2];

    //傾き
    var xg = dNum[3]; //左右
    var yg = dNum[4]; //上下
    var zg = dNum[5]; //前後

    //回転速度
    var a = Math.round(dNum[6] * 10 )  / 100;
    var b = Math.round(dNum[7] * 10 )  / 100;
    var g = Math.round(dNum[8] * 10 ) / 100;


    /******************************************************************/
    /********                  debug用                      ***********/
    /******************************************************************/
    /*
    document.getElementById("x").innerHTML = "X: " + x;
    document.getElementById("y").innerHTML = "Y: " + y;
    document.getElementById("z").innerHTML = "Z: " + z;

    document.getElementById("xg").innerHTML = "Xg: " + xg
    document.getElementById("yg").innerHTML = "Yg: " + yg;
    document.getElementById("zg").innerHTML = "Zg: " + zg;

    document.getElementById("ra").innerHTML = "Ra: " + a;
    document.getElementById("rb").innerHTML = "Rb: " + b;
    document.getElementById("rg").innerHTML = "Rg: " + g;
    */

    /******************************************************************/
    /********           モーション判別機能 呼出                 ***********/
    /******************************************************************/
    handshake();
    gooTouch();
    highTouch();
    changeMotion();


    /******************************************************************/
    /********     3種ベースモーション判別(専用デバイスから)       ***********/
    /******************************************************************/
    //モーション 0 握手 判別処理
    function handshake(){
      if(x > 1) downCnt++;
      if(x < -1) upCnt++;

      //if((downCnt > 1 && upCnt > 1) && (yg > -140 && yg < 5) && (xg > -100 && xg < -75)){
      if(downCnt > 1 && upCnt > 1){
        socket.emit("send motion data", 1000 + ',' + whoAmI + ',' + 0 + ',' + now.time() + ',' + geoData());
        audioPlay(0);
        //alert('Handshake');
        Materialize.toast('Handshake', 2000);
        downCnt = 0;
        upCnt = 0;
      }
    }

    //モーション 1 グータッチ 判別処理
    function gooTouch(){
      if(y > 1.5){
        downCnt = 0;
        upCnt = 0;
        socket.emit("send motion data", 1000 + ',' + whoAmI + ',' + 1 + ',' + now.time() + ',' + geoData());
        audioPlay(1);
        //alert('gooTouch');
        Materialize.toast('Fistbump', 2000);
      }
    }

    //モーション 2 ハイタッチ 判別処理
    function highTouch(){
      if(z < -1.2 && zg > 20){
        downCnt = 0;
        upCnt = 0;
        socket.emit("send motion data", 1000 + ',' + whoAmI + ',' + 2 + ',' + now.time() + ',' + geoData());
        audioPlay(2);
        //alert('highTouch');
        Materialize.toast('Hi-Five', 2000);
      }
    }

    //モーション 0000 チェンジモーション 判別処理
    /*
    function changeMotion(){
    if(Math.abs(g) > 20 && Math.abs(xg) < 20){
    audioPlay(3);
    modeChange(); //モード切り替え処理 modeChange.js
    alert("Mode Change");
  }
}
*/



}

})();


//作成モーションを保存する

function saveMotion(){
  var motionName=$("#createMotionName").val();
  if(!(localStorage.createMotion=== void 0)){
    motionJSON=JSON.parse(localStorage.createMotion);
  }
  motionJSON[motionName]={
    "motion":createMotionArray
  };

  localStorage.createMotion=JSON.stringify(motionJSON);
  Materialize.toast(localStorage.createMotion,2000);
  Materialize.toast("Successful Create New Motion",2000,'info');
  PageControll(0);
  createMotionArray="";

}

function showMotion(){
  if(!(localStorage.createMotion=== void 0)){
    motionJSON=JSON.parse(localStorage.createMotion);
  }
  for(var i in motionJSON){
    var item=document.createElement('li');
    var nameSpan = "<span class='cyan-text scheTitle'>"+i+"</span>";
    var numberSpan = "<p class='text-col scheAbout'>"+motionJSON[i].motion+"</p>";
    var deleteSpan = "<a class='secondary-content badge'><i class='fa fa-cyan fa-close list-close'></i></a>";

    var html = "<a>"+ nameSpan+numberSpan+deleteSpan+"</a>";
    item.innerHTML = html;

    $(item).addClass("collection-item avatar");
    $("#createMotionList").append(item);
  }
}
