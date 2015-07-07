$ ()->

  # Toggle Profile Toggle
  $(".container > .header .profile").click ()->
    $(".profile .dropdown").toggle()

  # Toggle Projects Dropdown
  $(".container > .modal .sidebar > .header").click ()->
    $(".modal .sidebar .dropdown").toggle()
