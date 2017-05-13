/*
window.onload = function(){
  $('#fab').draggable(function(){
  });

  window.document.addEventListener("touchmove", function(event){
    event.preventDefault();

    var tapX = event.touches[0].clientX;
    var tapY = event.touches[0].clientY;

    localStorage.setItem('tapX', tapX);
    localStorage.setItem('tapY', tapY);

    $('.fixed-action-btn').css({
      top: tapY - 50,
      left: tapX - 30
    });

    $('.fixed-action-btn ul').css({
      left: tapX -310,
      bottom: -tapY + 600
    });

  }, true);
}
*/
