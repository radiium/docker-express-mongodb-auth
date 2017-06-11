jQuery(document).ready(function() {
    $("#fileinput").val("");
    
    // upload user image
    uploadUserImage = function() {
        var file = $('#fileinput').prop('files')[0];
        var formdata = new FormData();
        formdata.append('file', file);

        if (file) {
            $.ajax({
                url: '/profile/userimage',
                type: 'POST',
                contentType: false,
                processData: false,
                dataType: 'json',
                data: formdata,
                success: function (data) {
                    console.log(data)
                    if (data.status === 'success') {
                        location.reload();
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        } else {
            $.alert({
                title: 'Alert!',
                content: 'No image to upload!',
                useBootstrap: false,
                boxWidth: '40%',
            });
        }
        $("#fileinput").val("");
    };

    deleteUserImage = function() {
        $.ajax({
            url: '/profile/userimage',
            type: 'DELETE',
            success: function (data) {
                console.log(data)
                if (data.status === 'success') {
                    location.reload();
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
        $("#fileinput").val("");
    };

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

        if (password !== '') {
            var data = checkUpdateParams();
            if (data.newUsername || data.newUsermail || data.newPassword) {

                console.log(data.newUsername);
                console.log(data.newUsermail);
                console.log(data.newPassword);

                // Get current user/pass 
                data.username = username;
                data.password = password;

                $.ajax({
                    method: "PUT",
                    url: "/profile",
                    data: data,
                    success: function(data) {
                        if (data.status === 'succes') {
                            $( '#notif-update' ).addClass('notif-success');
                            $( '#notif-update' ).text(data.msg);
                            $( '#notif-update' ).show();
                        } else if (data.status === 'error') {
                            $( '#notif-update' ).addClass('notif-error');
                            $( '#notif-update' ).text(data.msg);
                            $( '#notif-update' ).show();
                        }
                    },
                    error: function(err) {
                        $( '#notif-update' ).addClass('notif-error');
                        $( '#notif-update' ).text('Something went wrong, retry later! err: ' + err);
                        $( '#notif-pass' ).show();
                    }
                });
            }
        } else {
            $.alert({
                title: 'Alert!',
                content: 'You must type your password!',
                useBootstrap: false,
                boxWidth: '40%',
            });
        }
        
    };

    isEmpty = function(string1, string2) {
        if (!string1 || string1 === null || string1 === undefined || string1 === '') { return true }
        if (!string2 || string2 === null || string2 === undefined || string2 === '') { return true }
        return false;
    }

    isEqual = function(string1, string2) {
        if (string1 === string2) { return true; }
        return false;
    }

    checkUpdateParams = function() {
        var data = {};

        // Check if user name
        var newUsername  = $('#newUsername').val();
         if (!isEmpty(newUsername, "coucou")) {
            data.newUsername = newUsername;
         }

        // Check new mail
        var newUsermail  = $('#newUsermail').val();
        var newUsermail2 = $('#newUsermail2').val();

        if (!isEmpty(newUsermail, newUsermail2)) {
            if (!isEqual(newUsermail, newUsermail2)) {
                $( '#notif-mail' ).text('New mail not match!');
                $( '#notif-mail' ).show();
            } else {
                $( '#notif-mail' ).text('');
                $( '#notif-mail' ).hide();
                data.newUsermail = newUsermail;
            }
        }

        // Check new password
        var newPassword  = $('#newPassword').val();
        var newPassword2 = $('#newPassword2').val();

        if (!isEmpty(newPassword, newPassword2)) {
            if (!isEqualOrNull(newPassword, newPassword2)) {
                $( '#notif-pass' ).text('New password not match!');
                $( '#notif-pass' ).show();
            } else {
                $( '#notif-pass' ).text('');
                $( '#notif-pass' ).hide();
                data.newPassword = newPassword;
            }
        }

        return data;
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

    $("#fileinput").change(function(){
        var filename = $('#fileinput').prop('files')[0]['name'];
        if (filename) {
            $('#filelabel').text(filename);
        } else {
            $('#filelabel').text('No file selected');
        }
    });
});
