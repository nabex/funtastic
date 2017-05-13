$(function() {
  var h = $(window).height();

  $('#wrap').css('display','none');
  $('#loader-bg ,#loader').height(h).css('display','block');
});

$(window).load(function () { //全ての読み込みが完了したら実行
  $('#loader-bg').delay(2400).fadeOut(800);
  $('#loader').delay(2100).fadeOut(300);
  $('#wrap').css('display', 'block');

  setTimeout('animated()',2400);
  setTimeout(function(){
    $('#fab').addClass('animated bounce');
  }, 2500);
});

function animated(){
  $('.card').addClass('animated zoomInUp');
  $('#cameraBtn').addClass('animated zoomInUp');
}

//10秒たったら強制的にロード画面を非表示
$(function(){
  setTimeout('stopload()',10000);
});

function stopload(){
  $('#wrap').css('display','block');
  $('#loader-bg').delay(900).fadeOut(800);
  $('#loader').delay(600).fadeOut(300);
}
