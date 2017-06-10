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
        $('#profilstate').text('Profile');

        $( '#consultProfilBtn' ).hide();
        //$( '#editProfilBtn' ).show();
        //$( '#deleteProfilBtn' ).show();

        $( '#profil-box' ).show();
        $( '#profil-box-edit' ).hide();
        $( '#profil-box-del' ).hide();
    });

    $( '#editProfilBtn' ).click(function() {
        $('#profilstate').text('Edit profile');

        $( '#consultProfilBtn' ).show();
        //$( '#editProfilBtn' ).hide();
        //$( '#deleteProfilBtn' ).show();
        
        $( '#profil-box' ).hide();
        $( '#profil-box-edit' ).show();
        $( '#profil-box-del' ).hide();
    });

    $( '#deleteProfilBtn' ).click(function() {
        $('#profilstate').text('Delete profile');

        $( '#consultProfilBtn' ).show();
        //$( '#editProfilBtn' ).show();
        //$( '#deleteProfilBtn' ).hide();

        $( '#profil-box' ).hide();
        $( '#profil-box-edit' ).hide();
        $( '#profil-box-del' ).show();
    });

    // Open close modal

    // Infos popup
    var isOpen = false;
    function modal(title, content) {

        $('#modal-title').text(title);
        $('#modal-content').text(content);

        if (!isOpen) {
            $('#infos').css('top', '50px');
            $( "#content" ).addClass( "blur" );
            isOpen = true;
        } else {
            $('#infos').css('top', '-400px');
            $( "#content" ).removeClass( "blur" );
            isOpen = false;
        }
    }

    $( '#modal-accept' ).click(function() {
        mo

    });
    $( '#modal-decline' ).click(function() {

    });
});
