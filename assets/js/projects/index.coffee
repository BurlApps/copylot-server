class Projects

  constructor: ->

    # Instance Variables
    @container = $(".container")
    @header = @container.find("> .header")
    @modal = @container.find(".modal")
    @sidebar = @modal.find(".sidebar")
    @content = @modal.find(".content")
    @beenFocused = false
    @beenChanged = false

    # Initialize Events
    if $.Redactor?
      @redactorPlugin()
      @createRedactor()

    @bindEvents()

  redactorPlugin: ->
    self = @

    $.Redactor.prototype.dragDrop = ->
      insert: (block)->
        node = @utils.isCurrentOrParent('variable')
        className = if block.hasClass("global") then "global" else "block"
        element = "<variable spellcheck='false' class='#{className}'" +
                  "data-source='#{block.data("source")}'>#{block.text()}</variable>"

        if !self.beenFocused and !@focus.isFocused()
          @focus.setEnd()

        if node
          @caret.setAfter node

        @insert.html element, false
        @caret.setAfter @utils.isCurrentOrParent('variable')

      init: ->
        redactor = @
        cursor = null

        self.container.find(".variables variable").click ->
          redactor.dragDrop.insert $(@)

        @$box.droppable
          accept: "variable"
          drop: (ev, ui)=>
            redactor.dragDrop.insert ui.draggable

        self.container.find(".variables variable").draggable
          helper:'clone'
          revert: "invalid"
          containment: self.content
          start: (event, ui)=>
            $("div#pseudodroppable").css
              position:"absolute"
              top: @$editor.position().top
              left: @$editor.position().left
              width: @$editor.width()
              height: @$editor.height()
            .show()

          stop: (event, ui)->
            $("div#pseudodroppable").droppable('destroy').hide()

  createRedactor: ->
    self     = @
    buttons  = ['bold', 'italic', 'underline', 'deleted', 'alignment']
    plugins  = ['bufferbuttons', 'dragDrop']
    tags     = ['strong', 'em', 'del', 'u', 'span', 'variable', 'div', 'variable', 'br']

    if not config.production
      buttons.unshift 'html'

    @redactor = @content.find(".payload").redactor
      buttons: buttons
      plugins: plugins
      placeholder: 'Give your block some life...'
      pastePlainText: false
      cleanOnPaste: false
      cleanSpaces: false
      paragraphize: false
      linebreaks: true
      replaceDivs: false
      allowedTags: tags
      removeComments: true
      removeEmpty: tags.slice 0, -1
      removeWithoutAttr: [ 'span' ]
      tabAsSpaces: false
      preSpaces: false
      minHeight: 418
      keyupCallback: (e)->
        self.beenChanged = true
        self.keypressCallback.bind(this)(e)
      keydownCallback: @keypressCallback
      clickCallback: (e)->
        if e.toElement.localName == "variable"
          this.caret.setAfter e.toElement

      focusCallback: => @beenFocused = true

  keypressCallback: (e)->
    if e.keyCode != 91
      node = @utils.isCurrentOrParent('variable')

      if node
        e.preventDefault()

        if e.keyCode == 8
          return node.remove()
        else if e.keyCode == 37
          return @caret.setBefore node
        else
          return @caret.setAfter node

  bindEvents: ->
    self = @

    # Detect Back Button
    @content.find(".back-button").click ->
      link = $(@).data("href")

      console.log(self.beenChanged)

      if self.beenChanged
        swal {
          title: "Are you sure?"
          text: "You have changes that have not been saved."
          html: true
          type: "warning"
          showCancelButton: true
          confirmButtonColor: "#D23939"
          confirmButtonText: "I'm 100% sure"
          cancelButtonText: "No, cancel plz!"
          closeOnConfirm: false
          closeOnCancel: true
        }, (isConfirm) ->
          if isConfirm
            setTimeout ->
              location.href = link
            , 500

      else
        location.href = link


    # Toggle Profile Toggle
    @header.find(".profile").click ->
      $(@).find(".dropdown").toggle()


    # Toggle Projects Dropdown
    @sidebar.find("> .header").click =>
      @sidebar.find(".dropdown").toggle()


    # Table Rows Clickable Links
    @content.find(".data-table tbody tr").click ->
      window.location.href = $(@).attr("href")


    # Capture Search Event
    @content.find(".block-title").keydown (e)=>
      if e.keyCode == 9
        @redactor.redactor("focus.setEnd")


    # Capture Search Event
    @content.find(".search").on "keypress keyup", ->
      searchTerm = $(@).val().trim().toLowerCase()

      if searchTerm.length > 0
        self.content.find("tbody tr").each ->
          title = $(@).find("td").eq(1).text().trim().toLowerCase()
          value = $(@).find("td").eq(2).text().trim().toLowerCase()
          date = $(@).find("td").eq(3).text().trim().toLowerCase()

          show = (title.indexOf(searchTerm) > -1 or
                  value.indexOf(searchTerm) > -1 or
                  date.indexOf(searchTerm) > -1)

          $(@).toggle show
      else
        self.content.find("tbody tr").show()


    # Capture Update Event
    @content.find(".information form").on "submit", (e)->
      e.preventDefault()
      e.stopPropagation()

      form = $ @
      button = form.find(".button")

      button.addClass("updating").val "updating"

      $.post form.attr("action"), form.serialize(), (response)->
        if response.success
          swal
            title: "Updated!"
            type: "success"
            confirmButtonColor: "#38A0DC"
          , ->
            setTimeout ->
              location.reload()
            , 500

        else
          button.removeClass("updating").val("Update Information")

          swal
            title: "Oops..."
            text: response.message or "Something went wrong :("
            type: "error"
            confirmButtonColor: "#D23939"


    # Capture Invite Event
    @content.find(".team form").on "submit", (e)->
      e.preventDefault()
      e.stopPropagation()

      form = $ @
      button = form.find(".button")
      button.addClass("inviting").val "inviting"

      $.post "#{config.path}/team/invite", form.serialize(), (response)->
        if response.success
          swal
            title: "Invited!"
            type: "success"
            confirmButtonColor: "#38A0DC"
          , ->
            setTimeout ->
              location.reload()
            , 500

        else
          button.removeClass("inviting").val "invite"

          swal
            title: "Oops..."
            text: response.message or "Something went wrong :("
            type: "error"
            confirmButtonColor: "#D23939"

    # Capture Deploy Event
    @content.find(".deploy-button:not(.disabled)").click ->
      button = $(@)
      button.addClass("deploying").text "deploying"

      $.post "#{config.path}/deploy", {
        _csrf: config.csrf
      }, (response)->
        if response.success
          swal
            title: "Deployed!"
            type: "success"
            confirmButtonColor: "#38A0DC"
          , ->
            setTimeout ->
              location.reload()
            , 500

        else
          button.removeClass("deploying").text "deploy changes"

          swal
            title: "Oops..."
            text: response.message or "Something went wrong :("
            type: "error"
            confirmButtonColor: "#D23939"

    # Capture Project Delete Event
    @content.find(".delete-project").click ->
      swal {
        title: "Are you sure?"
        text: "<strong>DO NOT DELETE this project if it is being used<br>in your app!</strong> " +
              "This is permanent and doing so may<br>break your app."
        html: true
        type: "warning"
        showCancelButton: true
        confirmButtonColor: "#D23939"
        confirmButtonText: "I'm 100% sure"
        cancelButtonText: "No, cancel plz!"
        closeOnConfirm: false
        closeOnCancel: true
      }, (isConfirm) ->
        if isConfirm
          $.post "#{config.path}/delete",
            _csrf: config.csrf
          , (response)->
            swal {
              title: "Deleted."
              type: "success"
              confirmButtonColor: "#38A0DC"
            }, ->
              setTimeout ->
                location.href = response.next
              , 500


    # Capture Block Delete Event
    @content.find(".delete-button").click ->
      swal {
        title: "Are you sure?"
        text: "<strong>DO NOT DELETE this block if it is being used in<br>your app!</strong> " +
              "This is permanent and doing so may<br>break your app."
        html: true
        type: "warning"
        showCancelButton: true
        confirmButtonColor: "#D23939"
        confirmButtonText: "I'm 100% sure"
        cancelButtonText: "No, cancel plz!"
        closeOnConfirm: false
        closeOnCancel: true
      }, (isConfirm) ->
        if isConfirm
          $.post "#{config.path}/delete",
            _csrf: config.csrf
          , (response)->
            swal {
              title: "Deleted."
              type: "success"
              confirmButtonColor: "#38A0DC"
            }, ->
              setTimeout ->
                location.href = response.next
              , 500

    # Capture Save Event
    @content.find(".block-form").on "submit", (e)->
      e.preventDefault()
      e.stopPropagation()

      form = $ @
      button = form.find(".save-button")
      verb = form.find(".save-button").val().toLowerCase()

      if verb == "save"
        button.addClass("saving").val "saving"
      else
        button.addClass("saving").val "creating"

      $.post form.attr("action"),
        _csrf: config.csrf
        title: form.find(".block-title").val()
        html: form.find("textarea").val()
      , (response)->
        button.removeClass("saving").val(verb)

        if response.success
          if verb == "create"
            swal
              title: "Created!"
              type: "success"
              confirmButtonColor: "#38A0DC"

            button.val "save"
          else
            button.addClass("saved").val "saved"

            setTimeout ->
               button.removeClass("saved").val "save"
            , 3000

          self.beenChanged = false
          form.find(".block-title").prop('readonly', true)
          form.find(".delete-button").show()
          form.attr("action", response.url)
          history.replaceState(null, null, response.url)
          config.path = response.url

        else
          swal
            title: "Oops..."
            text: response.message or "Something went wrong :("
            type: "error"
            confirmButtonColor: "#D23939"

$ ->
  try
    new Projects()

  catch error
    console.error error
    Raven.captureException error
