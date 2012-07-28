function initBar() {
    safari.self.addEventListener('message', function(e) {
        if (e.name === 'returnLink') {
            if (e.message) {
                var link = e.message;

                if (document.readyState == 'complete') {
                    displayBar(link);
                } else {
                    window.addEventListener('load', function() {
                        displayBar(link);
                    });
                }
            }
        }
    }, false);
    safari.self.tab.dispatchMessage('getLink', null);
}

function displayBar(link) {
    document.getElementById('score').innerHTML = link.score;
    document.getElementById('title').setAttribute('href', link.commentsHref);
    document.getElementById('title').innerHTML = link.title;
    document.getElementById('subreddit').setAttribute('href', 'http://www.reddit.com/r/' + link.subreddit);
    document.getElementById('subreddit').innerHTML = '/r/' + link.subreddit;
    document.getElementById('comment-count').innerHTML = link.comments;

}

initBar();
