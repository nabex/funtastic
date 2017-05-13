/*******　カメラから画像を取得して、Base64形式で取得する *******/
function getCameraBase64(){
  navigator.camera.getPicture(
    function(imageData){
      // cameraSuccess
      //localStorage.setItem('imageData', imageData);
      $('#camera_pic').attr('src', 'data:image/jpeg;charset=utf-8;base64,' + imageData);
      makeSmall();
      senderMode();
    },
    function(message){
      // cameraError
      Materialize.toast(message, 2000,'red');
    },
    {
      //option
      quality : 18,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA, // 0:Photo Library, 1=Camera, 2=Saved Album
      saveToPhotoAlbum: true,
    });
  };


  /******* ギャラリーなどから選択した画像をbase64で取得する *******/
  function getPhotoDATA(){
    navigator.camera.getPicture(
      function(imageData){
        // cameraSuccess
        //localStorage.setItem('imageData', imageData);
        $('#camera_pic').attr('src', 'data:image/jpeg;charset=utf-8;base64,' + imageData);
        makeSmall();
        senderMode();
      },
      function(message){
        // cameraError
        Materialize.toast(message, 2000,'red');
      },
      {
        quality : 18,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      });
    };


    /******* 画面遷移・起動時してもtop画像の情報をキープする処理 *******/
    function setPhotoDATA(){
      var data = localStorage.getItem('imageData');
      if(data == null){
        //初回起動時のtop画像設定
        localStorage.setItem('imageData', 'img/img.jpg');
      }else{
        //初回以外
        $('#camera_pic').attr('src', 'data:image/jpeg;charset=utf-8;base64,' + data);
      }

      //初回起動時のtop画像設定
      if(data == 'img/img.jpg'){
        $('#camera_pic').attr('src', data);
      }
    }


    function makeSmall() {
      // 画像データの縦横サイズを取得する
      var image = new Image();
      image.src = $("#camera_pic").attr("src");
      var width = $("#camera_pic").get(0).naturalWidth;
      var height = $("#camera_pic").get(0).naturalHeight;
      var data=image.src.replace(/data:image[\/]jpeg;charset=utf-8;base64,/g,"");

      //Materialize.toast(width+","+height, 2000);

      // 縮小する。今回は縦横それぞれ1/2
      var canvas = document.createElement("canvas");
      var n = 3;//ここは10
      while(width > 1000 || height >1000){
        width=2*width/n;
        height=2*height/n;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);

        data=canvas.toDataURL("image/jpeg",1.0);
        // データURLにして返す。他にバイナリを返す toBlob() メソッドもあります。
        data=data.replace(/data:image[\/]jpeg;base64,/g,"");
        //alert(data);
      }
      $("#camera_pic").attr("src",'data:image/jpeg;charset=utf-8;base64,'+data);
      localStorage.setItem('imageData',data);
      //alert(width+","+height);
      // JPEG形式のほうが良い圧縮率が得られると思われます。
      // 第2引数は品質レベルで、0.0~1.0の間の数値です。高いほど高品質。
      // return canvas.toDataURL("image/jpeg", 0.5);
    }
