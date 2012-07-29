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
        } else if (e.name === 'gainFocus') {
            document.getElementsByTagName('body')[0].className = document.getElementsByTagName('body')[0].className.replace(/(?:^|\s)inactive(?!\S)/, '');
        } else if (e.name === 'loseFocus') {
            document.getElementsByTagName('body')[0].className += ' inactive';
        }
    }, false);
    safari.self.tab.dispatchMessage('getLink', null);
}

function displayBar(link) {
    document.getElementById('logo').setAttribute('href', 'http://' + link.reddit + '/');
    document.getElementById('score').innerHTML = link.score;
    document.getElementById('title').setAttribute('href', link.commentsHref);
    document.getElementById('title').innerHTML = link.title;
    document.getElementById('subreddit').setAttribute('href', 'http://www.reddit.com/r/' + link.subreddit);
    document.getElementById('subreddit').innerHTML = '/r/' + link.subreddit;
    document.getElementById('comment-count').innerHTML = link.comments;
    
    var title = document.getElementById('title');
    safari.self.tab.dispatchMessage('setHeight', parseInt(window.getComputedStyle(title,"").getPropertyValue('height')) + 10 + 'px');
    window.addEventListener('resize', function(e) {
        safari.self.tab.dispatchMessage('setHeight', parseInt(window.getComputedStyle(title,"").getPropertyValue('height')) + 10 + 'px');
    }, false);

    document.getElementById('close').addEventListener('click', function(e) {
        safari.self.tab.dispatchMessage('close', null);
    }, false);
}

initBar();
