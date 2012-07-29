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
    } else {
        m.target.page.dispatchMessage(m.name, m.message);
    }
}

init();
