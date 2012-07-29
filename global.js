var link = false;

function init() {
    safari.application.addEventListener('message', handleMessage, false);
}

function handleMessage(m) {
    if (m.name === 'setLink') {
        link = m.message;
    } else if (m.name === 'getLink') { 
        m.target.page.dispatchMessage('returnLink', link);
        link = false;
    } else if (m.name === 'close') {
        m.target.page.dispatchMessage('close', null);
    }
}

init();
