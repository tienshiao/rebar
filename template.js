var link = null;

function safariVersion(){
  var ua= navigator.userAgent, tem,
  M= ua.match(/(safari(?=\/))\/?\s*(\d+)/i) || [];
  M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
  return M[1];
}

function initBar() {
    safari.self.addEventListener('message', function(e) {
        if (e.name === 'returnCurrentLink') {
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
            $('.active').removeClass('active');
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
        } else if (e.name === 'saveCallback') {
            $('.active').removeClass('active');
            if (typeof(e.message) === 'boolean') {
                link.saveStatus = e.message;
                updateSave();
            }
        }
    }, false);
    safari.self.tab.dispatchMessage('getCurrentLink', null);

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

function updateSave() {
    if (link.saveStatus) {
        $('#save').addClass('clicked');
    } else {
        $('#save').removeClass('clicked');
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
    $('#subreddit').attr('href', 'http://' + link.reddit + link.subreddit)
                   .html(link.subreddit);
    $('#comments').attr('href', link.commentsHref);
    $('#comment-count').html(link.comments);
    updateSave();

    var whatVersion = safariVersion();
    if (whatVersion >= 8) {
      $('body').addClass('yosemite');
    }

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

        $('#upvote').addClass('active');
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

        $('#downvote').addClass('active');
        if (link.voteStatus === 'dislikes') {
            // remove old upvote
            safari.self.tab.dispatchMessage('vote', { link: link, vote: 0 } );
        } else {
            // downvote
            safari.self.tab.dispatchMessage('vote', { link: link, vote: -1 } );
        }
    });

    $('#save').click(function() {
        if ($('#save').hasClass('disabled')) {
            return;
        }

        $('#save').addClass('active');
        if (link.saveStatus) {
            // currently saved, unsave
            safari.self.tab.dispatchMessage('save', { link: link, save: false } );
        } else {
            // not saved, save
            safari.self.tab.dispatchMessage('save', { link: link, save: true } );
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
