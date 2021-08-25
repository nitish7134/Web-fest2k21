function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }
    return true;
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js')
        .then(function () { console.log("Service Worker Registered"); });
}

function createNotification(text, img) {
    var title = ('Abhyuday!Social Fest 2021 🌞');
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function (registration) {
            registration.showNotification(title, {
                body: text,
                icon: img,
                vibrate: [200, 100, 200, 100, 200, 100, 200],
            });
        });
        console.log("Tryed Notifying using SW : " + title + " " + text);

    } else
        if ("Notification" in window) {
            let notification = new Notification(title, { body: text, icon: img });
            console.log("Sending Notification", notification);
        }
}
function askNotificationPermission() {
    function handlePermission(permission) {
        // Whatever the user answers, we make sure Chrome stores the information
        if (!('permission' in Notification)) {
            Notification.permission = permission;
        }
    }

    if (!"Notification" in window) {
        console.log("This browser does not support notifications.");
    } else {
        if (checkNotificationPromise()) {
            Notification.requestPermission()
                .then((permission) => {
                    handlePermission(permission);
                })
        } else {
            Notification.requestPermission(function (permission) {
                handlePermission(permission);
            });
        }
    }
}

function checkDeadlines() {
    var notifJson = {};
    $.ajax({
        url: config.baseUrl + '/notifications',
        type: "GET",
        success: function (response) {
            notifJson = response;
            const now = new Date();
            for (var i = 0; i < notifJson.length; i++) {
                let diff = (new Date(notifJson[i].notifTime)).getTime() - now.getTime();
                if (diff < 900000) {
                    askNotificationPermission();
                    createNotification(notifJson[i].notifTitle, notifJson[i].notifText, 'data:image/png;base64,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');
                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    })

}
askNotificationPermission();
if (getCookie("Welcome") != "Done") {
    createNotification('Thank You for Visiting Us', './assets/favicons/android-icon-144x144.png');
    setCookie("Welcome", "Done",12*3600*1000);
    console.log("Cookie", getCookie("Welcome"));
}
if (isMobileTablet()) {
    if (getCookie("PCWarning") != "Done") {
        createNotification('For Better Experience use PC/Laptop', './assets/favicons/android-icon-144x144.png');
        setCookie("PCWarning", "Done", 3600000);
        console.log("Cookie", getCookie("PCWarning"));
    }
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}