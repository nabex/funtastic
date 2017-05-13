function saveBase64PhotoData(data) {
    //var base64Data = localStorage.getItem('imageData');
    cordova.base64ToGallery(
        data,

        {
            prefix: 'img_',
            mediaScanner: true
        },

        function(path) {
            //alert("Saved photo:"+path);
            Materialize.toast('Saved Photo:\n'+path, 2000,'blue');
            var photoname=path.match(".+/(.+?)$")[1];
            $("#photoName").html(photoname);
        },

        function(err) {
            Materialize.toast(err,2000,'red');
        }
    );
}
