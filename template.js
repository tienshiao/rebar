function initBar() {
    safari.self.addEventListener('message', function(e) {
        if (e.name === 'returnLink') {
            if (e.message) {
                var link = e.message;

                $(document).ready(function() {
                    displayBar(link);
                });
            }
        } else if (e.name === 'gainFocus') {
            $('body').removeClass('inactive');
        } else if (e.name === 'loseFocus') {
            $('body').addClass('inactive');
        }
    }, false);
    safari.self.tab.dispatchMessage('getLink', null);
}

function displayBar(link) {
    $('#logo').attr('href', 'http://' + link.reddit + '/');
    $('#score').html(link.score);
    $('#title').attr('href', link.commentsHref)
               .html(link.title);
    $('#subreddit').attr('href', 'http://' + link.reddit + '/r/' + link.subreddit)
                   .html('/r/' + link.subreddit);
    $('#comments').attr('href', link.commentsHref);
    $('#comment-count').html(link.comments);
    
    safari.self.tab.dispatchMessage('setHeight', $('.bar').first().outerHeight() + 'px');
    $(window).resize(function() {
        safari.self.tab.dispatchMessage('setHeight', $('.bar').first().outerHeight() + 'px');
    });

    $('#close').click(function() {
        safari.self.tab.dispatchMessage('close', null);
    });

    $(window).focus(function() {
        safari.self.tab.dispatchMessage('gainFocus', null);
    });

    $(window).blur(function() {
        safari.self.tab.dispatchMessage('loseFocus', null);
    });

}

initBar();
