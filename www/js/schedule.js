var scheduleJson={};  //保存するスケジュールを格納するためのJSON
var scheIndex=-1;     //スケジュールのリストの要素番号を管理する変数

/******************************************************************/
/********              スケジュール 初期化系処理        ***********/
/******************************************************************/

$(function(){
  if(!(localStorage.schedule===void 0)){
    scheduleJson=JSON.parse(localStorage.schedule);
  }

});
var scheduleFanc = {

  //初期化
  initialize: function() {
    //スケジュール一覧画面の更新
    $("#scheduleCreate").hide();
    //ローカルストレージに保存されているスケジュール用のJSONを格納する
    if(!(localStorage.schedule===void 0)){
      scheduleJson=JSON.parse(localStorage.schedule);
      this.readySchedule();
    }
    this.bindEvents();
  },

  //ソートとローカル保存処理
  //追加削除後，ソートするのでscheduleJsonに変更を加えてこの関数を呼び出し
  readySchedule: function(){
    //スケジュールをソートした結果を格納
    scheduleJson = sortObject(scheduleJson, resultTimestamp);

    //ソート状態のJSONをローカルストレージに保存する
    localStorage.schedule=JSON.stringify(scheduleJson);

    //保存されたスケジュールからリストを作成する
    $("#scheduleLists").html("");
    for(var i in scheduleJson){
      scheduleAuto(i,scheduleJson[i].date,scheduleJson[i].note);
    }
    scheduleShow();

    //スケジュール一覧のアニメーション
    Materialize.showStaggeredList('#scheduleLists');
  },

  //イベントの管理
  bindEvents: function() {
    $(function(){
      $("#scheduleLists").on("click","li",scheduleIndex);
      $("#scheduleLists li").on("click","span,p",scheduleIndexChild);
      $("#scheduleLists").on("click",".badge", deleteSchedule);
    });
  },
};


/******************************************************************/
/********              スケジュール 削除処理            ***********/
/******************************************************************/

function deleteSchedule(e){
  //JSONで扱う処理 インデックスの変更とJSONからの削除
  scheIndex=$(this).parent().val();
  delete scheduleJson[scheIndex];

  //スケジュールのインデックスを一つ前にする
  if(scheIndex>0){
    scheIndex--;
  }

  sessionStorage.scheduleIndex='0';
  e.stopPropagation();
  scheduleFanc.readySchedule();
}

//スケジュール自動削除 削除したかしてないかの判別をする値を返す
function autoScheduleDelete(){
  var rea="0";
  //過ぎたスケジュールを削除する
  for(var key in scheduleJson){
    if(getTimestamp(scheduleJson[key].date)<$.now()){
      Materialize.toast("Deleted:"+scheduleJson[key].note+" at "+scheduleJson[key].date,2000);
      delete scheduleJson[key];
      rea="1";
    }
  }
  return rea;
}

/******************************************************************/
/********              スケジュール 追加処理            ***********/
/******************************************************************/

function addSchedule(){
  //入力されたスケジュールを情報を取得
  var datetime = $("#scheDatetime").val();
  //日付日時の入力が正しくない場合はゼロ値を保存(すぐに自動で削除される)
  if(datetime==""){
    datetime="0000-00-00T00:00"
  }
  var note = $("#scheNote").val();

  //JSONのkeyをスケジュールリストの要素数にする
  for(var i=0;i<=Object.keys(scheduleJson).length;i++){
    if(!(i in scheduleJson)){
      scheIndex=i;
      break;
    }
  }

  scheduleToJson(datetime,note);

  //ページを再読み込み
  for(var i in scheduleJson){
    if((datetime==scheduleJson[i].date)&&(note==scheduleJson[i].note)){
      //追加された場合はホーム画面の表示は直近になる
      sessionStorage.scheduleIndex=i;
      break;
    }
  }
};

//スケジュールをJSONに変換して保存する関数
function scheduleToJson(date,note){
  scheduleJson[scheIndex]={
    "date":date,
    "note":note
  };
  localStorage.schedule=JSON.stringify(scheduleJson);
  //削除コマンド デバッグ用
  //localStorage.removeItem("schedule");
};

/******************************************************************/
/********              スケジュール時間の計算系処理     ***********/
/******************************************************************/

//日付のタイムスタンプ取得関数を定義
function getTimestamp(dateStr){
  //正規表現で文字列中の数値を取得
  var dateMatch = dateStr.match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);

  //日付オブジェクトに変換
  var dateObj = new Date(
    +dateMatch[1],     //年
    +dateMatch[2] - 1, //月
    +dateMatch[3],     //日
    +dateMatch[4],     //時
    +dateMatch[5],     //分
    +0                 //秒
  );
  //日付に対応する数値を取得し、出力
  return dateObj.getTime();
}

//タイムスタンプからの計算結果
function resultTimestamp(a,b){
  var at = getTimestamp(a.date); //日付文字列を取得し、それをタイムスタンプに変換
  var bt = getTimestamp(b.date); //上に同じ
  return at - bt; //降順にソートする場合、変数aとbの位置を逆にする
}

//日付時間計算 inputの初期値・最小値に利用
function calcDate(){
  var date=new Date();
  var year=date.getFullYear();
  var month=date.getMonth()+1;
  var day=date.getDate();
  var hour=date.getHours();
  var minute=date.getMinutes()+1;
  var dates=year+"-"+('0'+month).slice(-2)+"-"+('0'+day).slice(-2)+"T"+('0'+hour).slice(-2)+":"+('0'+minute).slice(-2)+":00";
  $("#scheDatetime").val(dates);
  //タイムゾーン関係で-9時間が必要
  hour-=9;
  if(hour<0){
    hour=23-hour;
    day--;
  }
  var minute=date.getMinutes()+1;
  var dates=year+"-"+('0'+month).slice(-2)+"-"+('0'+day).slice(-2)+"T"+('0'+hour).slice(-2)+":"+('0'+minute).slice(-2)+":00";
  $("#scheDatetime").attr('min',dates);
}

//ソートする実際の関数
function sortObject(obj,callback){
  var new_obj ={};
  var sort_arr=[];

  for(var key in obj){
    sort_arr[sort_arr.length]={
      "date":obj[key].date,
      "note":obj[key].note
    };
  }
  sort_arr.sort(function(a,b){
    return callback(a,b);
  });
  for(var i=0;i<sort_arr.length;i++){
    new_obj[i]=sort_arr[i];
  }
  return new_obj;
}


/******************************************************************/
/********              スケジュール 画面処理            ***********/
/******************************************************************/

//スケジュールをリスト化する関数
function scheduleAuto(index,datetime,note){
  var listItem = document.createElement('li');
  var dateSpan = "<span class='cyan-text listTitle'>"+datetime.replace(/T/g," ")+"</span>";
  var noteSpan = "<p class='text-col listAbout'>"+note+"</p>";
  var deleteSpan = "<a class='secondary-content badge'><i class='fa fa-cyan fa-close list-close'></i></a>";

  var html = "<a>"+ dateSpan+noteSpan+deleteSpan+"</a>";
  listItem.innerHTML = html;

  $(listItem).val(index);
  $(listItem).addClass("collection-item avatar list-li");
  $("#scheduleLists").append(listItem);
}

function scheduleShow(){
  if($("#scheduleLists li").length==0){
    $("#scheduleNone").css('display','');
    $("#scheduleLists").css('display','none');
  }else{
    $("#scheduleNone").css('display','none');
    $("#scheduleLists").css('display','');
  }
}

function scheduleCreate(){
  $(function(){
    menuValue=2;
    $("#scheduleCreate").show();
    $("#scheduleList").hide();
    $(".brand-logo").html("new Schedule");
  });
}

function scheduleList(){
  $(function(){
    menuValue=0;
    $("#scheduleCreate").hide();
    $("#scheduleList").show();
    $(".brand-logo").html("Schedule");
  });
}


/******************************************************************/
/********              スケジュール 選択処理            ***********/
/******************************************************************/
//文字のタッチイベントに対応
function scheduleIndexChild(e){
  sessionStorage.scheduleIndex=$(this).parent().val();
}
//リスト自体のタッチイベントに対応
function scheduleIndex(e){
  sessionStorage.scheduleIndex=$(this).val();
  Materialize.toast("Changed schedule",2000);
  PageControll(0);
  senderMode();
}
