var link = null;

function initBar() {
    safari.self.addEventListener('message', function(e) {
        if (e.name === 'returnLink') {
            if (e.message) {
                link = e.message;

                $(document).ready(function() {
                    displayBar();
                });
            }
        } else if (e.name === 'gainFocus') {
            $('body').removeClass('inactive');
            safari.self.tab.dispatchMessage('checkSettings');
        } else if (e.name === 'loseFocus') { 
            $('body').addClass('inactive');
        } else if (e.name === 'returnSettings') {
            updateButtons(e.message);
        } else if (e.name === 'voteCallback') {
            if (typeof(e.message) === 'number') {
                if (e.message == -1) {
                    link.voteStatus = 'dislikes';
                } else if (e.message == 1) {
                    link.voteStatus = 'likes';
                } else  {
                    link.voteStatus = 'unvoted';
                }
                updateVote();
            }
        }
    }, false);
    safari.self.tab.dispatchMessage('getLink', null);

}


function updateVote() {
    var score = $('#score');
    if (link.voteStatus === 'dislikes') {
        score.removeClass('upvoted').addClass('downvoted');
        $('#upvote').removeClass('clicked');
        $('#downvote').addClass('clicked');
        if (link.score.match(/^\d+$/)) {
            score.html(parseInt(link.score) - 1);
        }
    } else if (link.voteStatus == 'likes') {
        score.addClass('upvoted').removeClass('downvoted');
        $('#upvote').addClass('clicked');
        $('#downvote').removeClass('clicked');
        if (link.score.match(/^\d+$/)) {
            score.html(parseInt(link.score) + 1);
        }
    } else {
        // unvoted
        score.removeClass('upvoted').removeClass('downvoted');
        $('#upvote').removeClass('clicked');
        $('#downvote').removeClass('clicked');
        score.html(link.score);
    }
}

function updateButtons(settingsOK) {
    if (settingsOK) {
        $('#upvote').removeClass('disabled').removeAttr('title');
        $('#downvote').removeClass('disabled').removeAttr('title');
        $('#save').removeClass('disabled').attr('title', 'Save');;
    } else {
        $('#upvote').addClass('disabled').attr('title', 'Log in (in extension settings) to upvote!');
        $('#downvote').addClass('disabled').attr('title', 'Log in (in extension settings) to downvote!');
        $('#save').addClass('disabled').attr('title', 'Log in (in extension settings) to save!');
    }
}

function displayBar() {
    $('#logo').attr('href', 'http://' + link.reddit + '/');
    updateVote();

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

    safari.self.tab.dispatchMessage('checkSettings');

    $('#close').click(function() {
        safari.self.tab.dispatchMessage('close', null);
    });

    $('#upvote').click(function() {
        if ($('#upvote').hasClass('disabled')) {
            return;
        }

        if (link.voteStatus === 'likes') {
            // remove old upvote
            safari.self.tab.dispatchMessage('vote', { link: link, vote: 0 } ); 
        } else {
            // upvote
            safari.self.tab.dispatchMessage('vote', { link: link, vote: +1 } ); 
        } 
    });

    $('#downvote').click(function() {
        if ($('#downvote').hasClass('disabled')) {
            return;
        }

        if (link.voteStatus === 'dislikes') {
            // remove old upvote
            safari.self.tab.dispatchMessage('vote', { link: link, vote: 0 } ); 
        } else {
            // downvote
            safari.self.tab.dispatchMessage('vote', { link: link, vote: -1 } ); 
        } 
    });

    $(window).focus(function() {
        safari.self.tab.dispatchMessage('gainFocus', null);
    });

    $(window).blur(function() {
        safari.self.tab.dispatchMessage('loseFocus', null);
    });

}

initBar();
