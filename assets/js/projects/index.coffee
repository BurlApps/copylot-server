$ ()->

  # Toggle Profile Toggle
  $("body > .header .profile").click ()->
    $(".profile .dropdown").toggle()

  # Toggle Projects Dropdown
  $(".modal .sidebar > .header").click ()->
    $(".modal .sidebar .dropdown").toggle()
