/*
function displayBar() {
    if (document.getElementsByTagName('rebar').length > 0) return;

    var rebar = document.createElement('rebar');
    document.getElementsByTagName('body')[0].appendChild(rebar);

    document.getElementsByTagName('html')[0].style.marginTop = '30px';
  
    rebar.innerHTML = '<iframe src="' + safari.extension.baseURI + 'template.html" style="display:-webkit-box; -webkit-box-flex:1; border:0; background-color:transparent;" allowtransparency="true"></iframe>';
                      
    window.addEventListener('focus', function(e) {
        safari.self.tab.dispatchMessage('gainFocus', null);
    }, false);

    window.addEventListener('blur', function(e) {
        safari.self.tab.dispatchMessage('loseFocus', null);
    }, false);
 
}
*/

if (window === window.top) {
      if (link) {
        displayBar(link);
    }
}
