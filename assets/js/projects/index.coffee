class Projects

  constructor: ->

    # Instance Variables
    @container = $(".container")
    @header = @container.find("> .header")
    @modal = @container.find(".modal")
    @sidebar = @modal.find(".sidebar")
    @content = @modal.find(".content")
    @beenFocused = false

    # Initialize Events
    @redactorPlugin()
    @createRedactor()
    @bindEvents()

  redactorPlugin: ->
    self = @

    $.Redactor.prototype.dragDrop = ->
      init: ->
        @$box.droppable
          accept: "variable"
          drop: (ev, ui)=>
            draggable = ui.draggable
            className = if draggable.hasClass("super") then "super" else "block"
            element = "<variable spellcheck='false' class='#{className}'>#{draggable.text()}</variable>"

            if !self.beenFocused and !@focus.isFocused()
              @focus.setEnd()

            @insert.html element, false

            for node in @selection.getNodes()
              if node.localName == "variable"
                return @caret.setAfter node

        self.container.find(".variables variable").draggable
          helper:'clone'
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
      keyupCallback: @keypressCallback
      keydownCallback: @keypressCallback
      clickCallback: (e)->
        if e.toElement.localName == "variable"
          this.caret.setAfter e.toElement

      focusCallback: =>
        @beenFocused = true

  keypressCallback: (e)->
    if e.keyCode != 91
      nodes = @selection.getNodes()

      for node in nodes
        if node.localName == "variable"
          if nodes.length == 1
            e.preventDefault()

          if e.keyCode == 8
            return node.remove()
          else if e.keyCode == 37
            return @caret.setBefore node
          else
            return @caret.setAfter node

  bindEvents: ->
    self = @

    # Toggle Profile Toggle
    @header.find(".profile").click ->
      $(@).find(".dropdown").toggle()


    # Toggle Projects Dropdown
    @sidebar.find(".header").click =>
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


    # Capture Delete Event
    @content.find(".delete-button").click ->
      swal {
        title: "Are you sure?"
        text: "You will not be able to recover @ block!"
        type: "warning"
        showCancelButton: true
        confirmButtonColor: "#D23939"
        confirmButtonText: "Yes, delete it!"
        cancelButtonText: "No, cancel plx!"
        closeOnConfirm: false
        closeOnCancel: true
      }, (isConfirm) ->
        if isConfirm
          $.post "#{config.path}/delete",
            _csrf: config.csrf
          , (response)->
            swal {
              title: "Deleted!"
              text: "Your block has been deleted."
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
      data = form.serialize()

      $.post form.attr("action"), form.serialize(), (response)->
        if response.success
          verb = form.find(".save-button").val()

          swal
            title: "#{verb}d!"
            text: "Your block has been #{verb.toLowerCase()}d."
            type: "success"
            confirmButtonColor: "#38A0DC"

          form.find(".save-button").val "Save"
          form.find(".delete-button").show()
          form.attr("action", response.url)
          history.replaceState(null, null, response.url);

        else
          swal
            title: "Oops..."
            text: "Sadly, something went wrong :("
            type: "error"
            confirmButtonColor: "#D23939"

$ -> new Projects()
