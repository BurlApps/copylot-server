$ ()->

  # Toggle Profile Toggle
  $(".container > .header .profile").click ->
    $(".profile .dropdown").toggle()

  # Toggle Projects Dropdown
  $(".container > .modal .sidebar > .header").click ->
    $(".modal .sidebar .dropdown").toggle()

  # Table Rows Clickable Links
  $(".container > .modal .data-table tbody tr").click ->
    window.location.href = $(this).attr("href")

  # Convert Payload Into Object
  buttons  = ['bold', 'italic', 'underline', 'deleted', 'alignment']
  plugins  = ['bufferbuttons']
  tags     = ['strong', 'em', 'del', 'u', 'span', 'variable', 'div', 'br',]

  if not config.production
    buttons.unshift 'html'

  window.redactor = $(".payload").redactor
    buttons: buttons
    plugins: plugins
    minHeight: 450
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
    tabAsSpaces: false
    preSpaces: false

  # Capture Search Event
  $(".container > .modal .block-title").keydown (e)->
    if e.keyCode == 9
      redactor.redactor("focus.setEnd")

  # Capture Search Event
  $(".container > .modal .search").on "keypress keyup", ->
    searchTerm = $(this).val().trim().toLowerCase()

    if searchTerm.length > 0
      $(".container > .modal tbody tr").each ->
        title = $(this).find("td").eq(1).text().trim().toLowerCase()
        value = $(this).find("td").eq(2).text().trim().toLowerCase()
        date = $(this).find("td").eq(3).text().trim().toLowerCase()

        show = (title.indexOf(searchTerm) > -1 or
                value.indexOf(searchTerm) > -1 or
                date.indexOf(searchTerm) > -1)

        $(this).toggle show
    else
      $(".container > .modal tbody tr").show()

  # Capture Delete Event
  $(".container > .modal .delete-button").click ->
    swal {
      title: "Are you sure?"
      text: "You will not be able to recover this block!"
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
  enablePosting = true

  $(".container > .modal .block-form").on "submit", (e)->
    e.preventDefault()
    e.stopPropagation()

    if enablePosting
      form = $ this
      enablePosting = false
      data = form.serialize()

      $.post form.attr("action"), form.serialize(), (response)->
        enablePosting = true

        if response.success
          verb = form.find(".save-button").val()

          swal
            title: "#{verb}d!"
            text: "Your block has been #{verb}d."
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
