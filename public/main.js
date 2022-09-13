//const { test } = require("../orthog");

  $(document).ready(function(){
        
    $( "#sendnews" ).submit(function( event ) {
      event.preventDefault();
      this.submit();
    });
    $('#commentbox').change(function(){
      console.log($(this).is(':checked'));
      if ($(this).is(':checked')){
        $('#combox').show(100);
      } else {
        $('#combox').hide(100);
      }
    });    
    $('#commentbo').change(function(){
      console.log($(this).is(':checked'));
      if ($(this).is(':checked')){
        $('#combox').hide(100);
      } 
    });   
    
     
    $( "#sign" ).click(function() {
      if ($( "#sign" ).attr('name')=='login') {
        event.preventDefault();
        $( "#mpopup" ).show();
      }
       else logout()
    })
    $( "#close" ).click(function() {
      event.preventDefault();
      $( "#mpopup" ).hide();
    })
    $( ".delbtnc" ).click(function() {
      event.preventDefault();
    })
    

    $( "#new_head" ).val()
    $( "#mp_date" ).val()
    $( "#new_auth" ).val()
    $( "#main_pic_name" ).val()
    $( "#all_pic_name" ).val()
    
    $( "#btnl" ).click(function() {
      //M.toast({html: 'Пожалуйста, заполните содержание', classes: '#ef5350 red lighten-1 rounded'});
      event.preventDefault();
      if ($( "#pass" ).val()!=''){
       // $( "#btnl" ).submit();
        let tosend = $( "#pass" ).val();
        $.get( "/auth", {pass: tosend} )
        .done(function( data ) {
          console.log( "Data Loaded: " + data );
            if (data=='ok'){
            M.toast({html: 'Авторизация - успешно!', classes: '#26a69a teal lighten-1 rounded'});
            reload(true);
          } else {
            M.toast({html: 'Неверный пароль! Повторите попытку!', classes: '#ef5350 red lighten-1 rounded'});
            $( "#pass" ).val('');
          }
        });
        //console.log( "Handler for .click() called." );
      } else {
        M.toast({html: 'Пожалуйста, введите пароль!', classes: '#ef5350 red lighten-1 rounded'});
      }    
    });
    
   
    
    function logout(){
      M.toast({html: 'Выход из аккаунта', classes: '#ef5350 red lighten-1 rounded'});
      $.get( "/logout");
      reload(true);
    }

    function reload(p){
      if (p) setTimeout(reload, 50);
      else location.reload();
    }

    
  });
