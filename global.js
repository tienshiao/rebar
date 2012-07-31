var link = null;

function init() {
    safari.application.addEventListener('message', handleMessage, false);
    safari.extension.secureSettings.addEventListener('change', settingsChanged, false);
}

function handleMessage(m) {
    if (m.name === 'setLink') {
        link = m.message;
    } else if (m.name === 'getLink') { 
        if (m.target.page) m.target.page.dispatchMessage('returnLink', link);
        link = null;
    } else if (m.name === 'checkSettings') {
        if (safari.extension.secureSettings.username && safari.extension.secureSettings.username.length &&
            safari.extension.secureSettings.password && safari.extension.secureSettings.password.length) {
            m.target.page.dispatchMessage('returnSettings', true); 
        } else {
            m.target.page.dispatchMessage('returnSettings', false); 
        }
    } else if (m.name === 'vote') {
        vote(m, m.message.link, m.message.vote); 
    } else {
        m.target.page.dispatchMessage(m.name, m.message);
    }
}

function settingsChanged(e) {
    if (e.key == 'username' || e.key == 'password') {
        safari.extension.secureSettings.modhash = null;
    }
}

function vote(message, link, vote) {
    redditPost('http://www.reddit.com/api/vote', { id: link.name, dir: vote },
        function(data) {
            // success
            message.target.page.dispatchMessage('voteCallback', vote); 
        },
        function(data) {
            // failure
            message.target.page.dispatchMessage('voteCallback', undefined); 
        }
    );
}

function redditPost(url, data, success, failure) {
    checkModHash(function() {
        data.uh = safari.extension.secureSettings.modhash;
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function(data) {
                if ('jquery' in data) {
                    failure();
                } else {
                    success();
                }
            },
            error: failure
        });
    }, failure);
}

function checkModHash(success, failure) {
    if (safari.extension.secureSettings.modhash) {
        success();
    } else {
        var username = safari.extension.secureSettings.username;
        var password = safari.extension.secureSettings.password;
        $.post('http://www.reddit.com/api/login/' + username, {
            user: username,
            passwd: password,
            api_type: 'json'
        }, function(data) {
            if (data.json.errors.length == 0 ) {
                safari.extension.secureSettings.modhash = data.json.data.modhash;
                success();
            } else {
                safari.extension.secureSettings.modhash = null;
                failure();
            }
        });
    }
}

init();
