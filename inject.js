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

    var subreddit = null;
    if (entry.getElementsByClassName('subreddit').length) {
        subreddit = entry.getElementsByClassName('subreddit')[0].innerHTML;
    } else {
        var match = window.location.pathname.match(/\/r\/(.+?)\//);
        if (match.length == 2) {
            subreddit = match[1];
        }
    }

    var voteStatusEl = entry.getElementsByClassName('midcol')[0];
    var voteStatus = null;
    if (voteStatusEl.className.match(/dislikes/)) {
        voteStatus = 'dislikes';
    } else if (voteStatusEl.className.match(/unvoted/)) {
        voteStatus = 'unvoted';
    } else {
        voteStatus = 'likes';
    }

    var saveStatusEl = entry.getElementsByClassName('state-button')[0];
    var saveStatus = false;
    if (saveStatusEl && (saveStatusEl.innerHTML == 'saved' || saveStatusEl.innerHTML.match(/>unsave</))) {
        saveStatus = true;
    }

    return {
        title: l.innerHTML,
        href: l.getAttribute('href'),
        name: entry.getAttribute('data-fullname'),
        ups: entry.getAttribute('data-ups'),
        downs: entry.getAttribute('data-downs'),
        subreddit: subreddit,
        reddit: document.domain,
        score: entry.getElementsByClassName('score')[1].innerHTML,
        comments: comments,
        commentsHref: commentsEl.getAttribute('href'),
        voteStatus: voteStatus,
        saveStatus: saveStatus
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
        } else if (e.name === 'close') {
            var element = document.getElementsByTagName('rebar')[0];
            element.parentNode.removeChild(element);
            document.getElementsByTagName('html')[0].style.marginTop = 0;
        } else if (e.name === 'setHeight') {
            document.getElementsByTagName('rebar')[0].style.height = e.message;
        }
    }, false);
    safari.self.tab.dispatchMessage('getLink', null);
}

function displayBar(link) {
    if (document.getElementsByTagName('rebar').length > 0) return;

    var rebar = document.createElement('rebar');
    document.getElementsByTagName('body')[0].appendChild(rebar);

    document.getElementsByTagName('html')[0].style.marginTop = '30px';
  
    safari.self.tab.dispatchMessage('setLink', link);

    rebar.innerHTML = '<iframe src="' + safari.extension.baseURI + 'template.html" style="display:-webkit-box; -webkit-box-flex:1; border:0; background-color:transparent;" allowtransparency="true"></iframe>';
                      
    window.addEventListener('focus', function(e) {
        safari.self.tab.dispatchMessage('gainFocus', null);
    }, false);

    window.addEventListener('blur', function(e) {
        safari.self.tab.dispatchMessage('loseFocus', null);
    }, false);
 
}

if (window === window.top) {
    // don't load in iframes, etc
    if (document.domain.match(/.+\.reddit\.com$/)) {
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
