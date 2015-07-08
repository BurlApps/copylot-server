$ ()->

  # Toggle Profile Toggle
  $(".container > .header .profile").click ->
    $(".profile .dropdown").toggle()

  # Toggle Projects Dropdown
  $(".container > .modal .sidebar > .header").click ->
    $(".modal .sidebar .dropdown").toggle()

  # Table Rows Clickable Links
  $(".container > .modal .data-table tr").click ->
    window.location.href = $(this).attr("href")

  # Convert Payload Into Object
  buttons = ['bold', 'italic', 'underline', 'deleted']
  plugins = ['bufferbuttons', 'fontsize', 'fontfamily', 'fontcolor']
  tags    = ['strong', 'em', 'br', 'del', 'u', 'span', 'variable']

  if not config.production
    buttons.unshift 'html'

  window.redactor = $(".payload").redactor
    buttons: buttons
    plugins: plugins
    minHeight: 450
    placeholder: 'Give your block some life...'
    pastePlainText: true
    cleanOnPaste: true
    cleanSpaces: true
    paragraphize: false
    linebreaks: true
    replaceDivs: true
    allowedTags: tags
    removeComments: true
    removeEmpty: tags
    tabAsSpaces: false
    preSpaces: false

  # Capture Delete Event
  $(".container > .modal .delete-button").click ->
    swal {
      title: "Are you sure?",
      text: "You will not be able to recover this block!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel plx!",
      closeOnConfirm: false,
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
          }, ->
            location.href = response.next

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
          form.find(".delete-button").show()
          form.attr("action", response.url)
          history.replaceState(null, null, response.url);

          swal
            title: "Saved!"
            text: "Your block has been saved."
            type: "success"

        else
          swal
            title: "Oops..."
            text: "Sadly, something went wrong :("
            type: "error"
