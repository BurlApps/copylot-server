$ ->
  $(".contact-link").click (e)->
    e.preventDefault()
    Intercom 'show'

  $(".docs-link").click ->
    mixpanel.track "Web.Docs.Home"

  $(".docs-discuss-link").click ->
    mixpanel.track "Web.Docs.Discuss"

  $(".docs-help-link").click ->
    mixpanel.track "Web.Docs.Help"
