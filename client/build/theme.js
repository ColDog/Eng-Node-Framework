function flash(message) {
  document.getElementById('flash').innerHTML = message
  document.getElementById('flash').style.display = 'block'
  setTimeout(function(){
    document.getElementById('flash').style.display = 'none'
  }, 5000)

}

(function() {
  var open_dialogues = document.querySelectorAll('*[data-dialogue]')
  for (var d=0; d < open_dialogues.length; d++){
    open_dialogues[d].addEventListener('click', function(evt){
      console.log('dataset', evt.target.dataset.dialogue)
      document.getElementById(evt.target.dataset.dialogue).classList.toggle('open')
    })
  }

  var dialogues = document.querySelectorAll('.dialogue')
  for (var f=0; f < dialogues.length; f++){
    dialogues[f].addEventListener('click', function(evt){
      evt.target.classList.toggle('open')
    })
  }


  var expanders = document.querySelectorAll('*[data-expand]')
  console.log('expanders', expanders)
  for (var e = 0; e < expanders.length; e++){
    expanders[e].addEventListener('click', function(evt){
      document.getElementById(evt.target.dataset.expand).classList.toggle('expanded')
    })
  }

  var modal_triggers = document.getElementsByClassName('launch-modal')
  console.log(modal_triggers)
  for (var m = 0; m < modal_triggers.length; m++){
    modal_triggers[m].addEventListener('click', function(evt){
      var modal = document.querySelector(evt.target.dataset.target)
      modal.style.visibility = (modal.style.visibility == "visible") ? "hidden" : "visible";
    })
  }

  if (document.getElementById('open-sidebar-left')) {
    document.getElementById('open-sidebar-left').addEventListener('click', function(evt){
      document.getElementById('sidebar-left').classList.toggle('open')
      document.getElementById('page-wrap').classList.toggle('left-open')
    })
  }

  if (document.getElementById('open-sidebar-right')) {
    document.getElementById('open-sidebar-right').addEventListener('click', function(evt){
      document.getElementById('sidebar-right').classList.toggle('open')
      document.getElementById('page-wrap').classList.toggle('right-open')
    })
  }

  if (document.getElementById('open-help')) {
    document.getElementById('open-help').addEventListener('click', function(evt){
      document.getElementById('help').classList.toggle('open')
    })
  }

  var tabs = document.querySelectorAll('.tabs li')
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function(e) {
      var target_tab = e.target
      var target_pane = document.querySelector(e.target.dataset.target)
      var all_tabs = e.target.parentElement.querySelectorAll('.tabs li')

      console.log()

      for (var i1 = 0; i1 < all_tabs.length; i1++) {
        all_tabs[i1].classList.remove('selected')
        document.querySelector( all_tabs[i1].dataset.target ).classList.remove('selected')
      }

      target_pane.classList.add('selected')
      target_tab.classList.add('selected')

      var event = new CustomEvent("tab-changed");
      document.dispatchEvent(event);
    });
  }
})();
