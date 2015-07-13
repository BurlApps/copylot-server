$ ->
  enablePosting = true

  try
    $("form:not(.ignore)").on "submit", (e)->
      e.preventDefault()
      e.stopPropagation()

      if enablePosting
        form = $ this
        button = form.find(".button").val "Sending..."
        enablePosting = false

        $.post form.attr("action"), form.serialize(), (response)->
          button.toggleClass "error", !response.success
          button.toggleClass "active", response.success

          if response.success
            button.val response.message or "Awesome :)"

            if response.user?
              mixpanel.alias response.user
              mixpanel.people.set
                "ID": response.user
                "$name": response.name
                "$email": response.email

            if response.next?
              setTimeout((()->
                window.location.href = response.next
              ), response.delay or 300)

          else
            enablePosting = true
            button.val response.message or "Something Went Wrong :("
            form.find("input[type=password]").val ""

  catch error
    Raven.captureException error
