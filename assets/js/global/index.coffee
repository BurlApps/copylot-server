$ ->
  $(".contactLink").click (e)->
    e.preventDefault()
    Intercom 'show'
