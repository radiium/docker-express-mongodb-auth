jQuery(document).ready(function() {

    // Delete profil
    deleteProfil = function() {
        var data = {};

        if ($('#currentPasswordDel').val() !== '') {
            data.username = $('#username').val();
            data.password = $('#currentPasswordDel').val();

            $.confirm({
                title: 'Delete user account?',
                content: 'Oh no! Do you really want delete your user account?',
                useBootstrap: false,
                boxWidth: '40%',
                buttons: {
                    confirm: function () {
                        $.ajax({
                            method: "DELETE",
                            url: "/profile",
                            data: data,
                            success: function(data) {
                                console.log(data);
                            },
                            error: function(err) {
                                console.log(err);
                            }
                        })
                    },
                    cancel: function () {}
                }
            });

        } else {
            $.alert({
                title: 'Alert!',
                content: 'You must type your password!',
                useBootstrap: false,
                boxWidth: '40%',
            });
        }
    }

    // Update profil
    updateProfil = function() {

        var username     = $('#username').val();
        var password     = $('#currentPassword').val();

        var newUsername  = $('#newUsername').val();

        var newUsermail  = $('#newUsermail').val();
        var newUsermail2 = $('#newUsermail2').val();
        var isMailOk     = false;

        var newPassword  = $('#newPassword').val();
        var newPassword2 = $('#newPassword2').val();
        var isPassOk     = false;


        if (newUsermail !== '' && newUsermail2 !== '') {
            if (!isEqual(newUsermail, newUsermail2)) {
                $( '#notif-mail' ).text('New mail not match!');
                $( '#notif-mail' ).show();
                isMailOk = false;
            } else {
                $( '#notif-mail' ).text('');
                $( '#notif-mail' ).hide();
                isMailOk = true;
            }
        } else {
            isMailOk = true;
        }

        if (newPassword !== '' && newPassword2 !== '') {
            if (!isEqual(newPassword, newPassword2)) {
                $( '#notif-pass' ).text('New password not match!');
                $( '#notif-pass' ).show();
                isPassOk = false;
            } else {
                $( '#notif-pass' ).text('');
                $( '#notif-pass' ).hide();
                isPassOk = true;
            }
        } else {
            isPassOk = true;
        }

        if (isMailOk && isPassOk) {

            var data = {};
            data.username = username;
            data.password = password;
            data.newUsername = newUsername;
            data.newUsermail = newUsermail;
            data.newPassword = newPassword;

            $.ajax({
                method: "PUT",
                url: "/profile",
                data: data,
                success: function(data) {
                    console.log('data');
                    console.log(data);

                    $( '#notif-update' ).addClass('notif-success');
                    $( '#notif-update' ).text('Profile updated!');
                    $( '#notif-update' ).show();
                },
                error: function(err) {
                    console.log('err');
                    console.log(err);

                    $( '#notif-update' ).addClass('notif-error');
                    $( '#notif-update' ).text('Something went wrong, retry later!');
                    $( '#notif-pass' ).show();
                }
            });
        }
    };

    isEqual = function(string1, string2) {
        if (string1 === string2) { return true; }
        return false;
    }

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
