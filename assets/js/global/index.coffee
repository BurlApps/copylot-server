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

  $(".privacy-link").click ->
    mixpanel.track "Web.Legal.Privacy"

  $(".tos-link").click ->
    mixpanel.track "Web.Legal.TOS"
