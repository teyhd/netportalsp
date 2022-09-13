$(document).ready(function(){
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, options);
      });

      // Or with jQuery
      $('.modal').modal();
    
      $('.materialboxed').materialbox();
      $( "#mpopup" ).hide();
})