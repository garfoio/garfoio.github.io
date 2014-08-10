$(function(){
    var liveBackground = new LiveBackground($('#live-background'));

    var elLogo = document.getElementById('logo');
    var logo = new Sentinel({ 
        obj: elLogo, 
        file: 'assets/img/logo.png',
        ppf: 100,
        size: 6,
        completeCallback: function(){
            $("#home h2").fadeIn(500)
        }
    });
});
