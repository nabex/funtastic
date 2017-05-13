function homeInitilize(){
  $(function(){
    //ホーム画面でのスケジュール自動削除　スケジュール画面にも適用できる
    setInterval(function(){
      if(autoScheduleDelete()=="1"){
        //削除状態のJSONをローカルストレージに保存する
        localStorage.schedule=JSON.stringify(scheduleJson);
        sessionStorage.scheduleIndex='0';
        scheduleFanc.readySchedule();
        homeScheIni();
      }
    },60*1000);
    homeScheIni();

    $("#file_01").change(function(){
      $("#mask_file_01").val($("#file_01").val());
      $("#fileName").html($("#mask_file_01").val());
    });
    $("#mask_file_01").click(function(){
      $("#file_01").click();
    });

  });
}


//画像をlocalに保存する
function savePhoto(){
  var data = localStorage.getItem('imageData');
  saveBase64PhotoData(data);
}



function homeScheIni(){
  $(function(){

    var date="--/-- --:--";
    var note="You don't have schedule"
    if(!(localStorage.schedule===void 0)){
      var json=JSON.parse(localStorage.schedule);
      var index='0';
      if(!(sessionStorage.scheduleIndex===void 0)){
        index=sessionStorage.scheduleIndex;
      }
      if((Object.keys(json)!="")&&!(json[index]===void 0)){
        var date=json[index].date;
        var dateMatch = date.match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
        //日付オブジェクトに変換
        var dateObj = new Date(
          +dateMatch[1],     //年
          +dateMatch[2],     //月
          +dateMatch[3],     //日
          +dateMatch[4],     //時
          +dateMatch[5],     //分
          +0                 //秒
        );
        date=(dateMatch[2])+"/"+dateMatch[3]+" "+dateMatch[4]+":"+dateMatch[5];
        note=json[index].note;
      }
    }
    $("#recentScheduleDate").html(date);
    $("#recentScheduleNote").html(note);
  });
}

var audio=[];
function audioInitialize(){
  for(var i=0;i<10;i++){
    audio[i]=new Audio();
  }
  audio[0].src="audio/handshaking.mp3";
  audio[1].src="audio/fistbump.mp3";
  audio[2].src="audio/hifive.mp3";
  audio[3].src="audio/change.mp3";
  audio[4].src="audio/ta_ta_kira08.mp3"; //受信音
  audio[5].src="audio/cncl07.mp3"; //モーション作成音
  audio[6].src="audio/ppap/PineApplePen.mp3";
  audio[7].src="audio/ppap/PPAP.mp3";
  audio[8].src="audio/ppap/ApplePen.mp3";
  audio[9].src="audio/ppap/Nmmm.mp3";
}

function audioPlay(num){
  audio[num].play();
}

var ppapBool = new Boolean(false);
ppapBool = false; //true: 送信者 / false:受信者
function ppap(){
  ppapBool = !ppapBool;

  if(ppapBool == false){
    Materialize.toast('nomal audio', 2000);
  }else{
    Materialize.toast('ppap audio', 2000);
  }
}
