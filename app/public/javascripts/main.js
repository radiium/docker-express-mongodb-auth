jQuery(document).ready(function() {
    $("#fileinput").val("");

    // Display/Hideprofil
    $( '#consultProfilBtn' ).click(function() {
        $( '#consultProfilBtn' ).addClass('active');
        $( '#editProfilBtn' ).removeClass('active');
        $( '#deleteProfilBtn' ).removeClass('active');
        $( '#profil-box' ).show();
        $( '#profil-box-edit' ).hide();
        $( '#profil-box-del' ).hide();
    });

    $( '#editProfilBtn' ).click(function() {
        $( '#consultProfilBtn' ).removeClass('active');
        $( '#editProfilBtn' ).addClass('active');
        $( '#deleteProfilBtn' ).removeClass('active');
        $( '#profil-box' ).hide();
        $( '#profil-box-edit' ).show();
        $( '#profil-box-del' ).hide();
    });

    $( '#deleteProfilBtn' ).click(function() {
        $( '#consultProfilBtn' ).removeClass('active');
        $( '#editProfilBtn' ).removeClass('active');
        $( '#deleteProfilBtn' ).addClass('active');
        $( '#profil-box' ).hide();
        $( '#profil-box-edit' ).hide();
        $( '#profil-box-del' ).show();
    });


    //-------------------------------------------------------------------------
    // Drop down navbar

    // drop down add
    $( '#dropdown-add-btn' ).click(function(event) {
        event.stopPropagation();
        $( '#dropdown-profile-content' ).hide();
        $( '#dropdown-add-content' ).toggle()
    })
 
    // drop down profile
    $( '#dropdown-profile-btn' ).click(function(event) {
        event.stopPropagation();
        $( '#dropdown-add-content' ).hide();
        $( '#dropdown-profile-content' ).toggle()
    })

    $(document).on("click", function () {
        $( '#dropdown-profile-content' ).hide();
        $( '#dropdown-add-content' ).hide();
    });
});
