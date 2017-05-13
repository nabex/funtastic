$(function () {
  document.addEventListener("deviceready", onDeviceReady, false);

    var watchID = null;

    // device APIs are available
    //
    function onDeviceReady() {
        // Throw an error if no update is received every 30 seconds
        var options = { timeout: 30000 };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    }

    // onSuccess Geolocation
    //
    function onSuccess(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      var geoData = latitude + ',' + longitude;

      localStorage.setItem('geoData', geoData);
      //alert(geoData);
    }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            Materialize.toast('code: '    + error.code    + '\n' +
                              'message: ' + error.message + '\n', 2000,'red');
        }
});
