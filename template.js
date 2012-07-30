function initBar() {
    safari.self.addEventListener('message', function(e) {
        if (e.name === 'returnLink') {
            if (e.message) {
                $(document).ready(function() {
                    displayBar(e.message);
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

function updateVote(link) {
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

function displayBar(link) {
    $('#logo').attr('href', 'http://' + link.reddit + '/');

    updateVote(link);

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

    $('#upvote').click(function() {
        if (link.voteStatus === 'likes') {
            // remove old upvote
            link.voteStatus = 'unvoted';
            updateVote(link);
        } else {
            // upvote
            link.voteStatus = 'likes';
            updateVote(link);
        } 
    });

    $('#downvote').click(function() {
        if (link.voteStatus === 'dislikes') {
            // remove old upvote
            link.voteStatus = 'unvoted';
            updateVote(link);
        } else {
            // upvote
            link.voteStatus = 'dislikes';
            updateVote(link);
        } 
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
