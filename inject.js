function scrapeLink(l) {
    var entry = l;

    // move up to correct div
    while (!(entry.tagName == 'DIV' && entry.className.match(new RegExp('(\\s|^)thing(\\s|$)')))) {
        entry = entry.parentNode;
    }

    var comments = 0;
    var commentsEl = entry.getElementsByClassName('comments')[0]
    var matches = commentsEl.innerHTML.match(/(\d+) comment/);
    if (matches) {
        comments = matches[1];
    }

    return {
        title: l.innerHTML,
        href: l.getAttribute('href'),
        name: entry.getAttribute('data-fullname'),
        ups: entry.getAttribute('data-ups'),
        downs: entry.getAttribute('data-downs'),
        subreddit: entry.getElementsByClassName('subreddit')[0].innerHTML,
        score: entry.getElementsByClassName('score')[1].innerHTML,
        comments: comments,
        commentsHref: commentsEl.getAttribute('href')
    };
}

function initClickTracker() {
    document.body.addEventListener('mousedown', function(e) {
        var el = e.target || false;
        while (el && el.tagName != 'A') {
            el = el.parentNode;
        }
        if (el && el.tagName == 'A' && el.className.match(new RegExp('(\\s|^)title(\\s|$)'))) {
            safari.self.tab.dispatchMessage('setLink', scrapeLink(el));
        }
    }, true);
}

function initBar() {
    safari.self.addEventListener('message', function(e) {
        if (e.name === 'returnLink') {
            if (e.message) {
                var link = e.message;
                if (link.href != window.location) {
                    return;
                }

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
    var rebar = document.createElement('rebar');
    document.getElementsByTagName('body')[0].appendChild(rebar);

    document.getElementsByTagName('html')[0].style.marginTop = '30px';

    rebar.innerHTML =
        '<a id="logo" href="http://www.reddit.com/" title="Return to reddit"></a>' +
        '<span id="score">' + link.score + '</span>' +
        '<a id="title" href="' + link.commentsHref + '">' + link.title + '</a>' +
        '<span id="right">' + 
            '<a id="subreddit" href="http://www.reddit.com' + link.subreddit + '">' + link.subreddit + '</a>' +
            '<a id="upvote" class="button">&#x25B2; Upvote</a>' +
            '<a id="downvote" class="button">&#x25BC; Downvote</a>' +
            '<a id="comments" class="button" title="View comments" href="' + link.comments.Href + '">&#x275D; ' + link.comments + '</a>' +
            '<a id="save" class="button" title="Save">&#x272D;</a>' +
            '<a id="close" class="close">&#x2715;</a>' +
        '</span>';
                        
}

//if (window === window.top && document.getElementsByTagName('body').length) {
if (window === window.top) {
    // don't load in iframes, etc
    if (document.domain == 'www.reddit.com') {
        if (document.readyState == 'complete') {
            initClickTracker();
        } else {
            window.addEventListener('load', function() {
                initClickTracker();
            });
        }
    } else {
        initBar();
    }
}
