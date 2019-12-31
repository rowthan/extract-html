if (window.self === window.top) {
  var show = false;
  var iframe = null;
  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      iframe = document.createElement('iframe');
      iframe.id = 'iframe';
      iframe.className = "extract_html";
      iframe.style.setProperty('height', '100%', 'important');
      iframe.style.setProperty('width', '100%', 'important');
      iframe.style.setProperty('position', 'fixed', 'important');
      iframe.style.setProperty('top', '0', 'important');
      iframe.style.setProperty('right', '0', 'important');
      iframe.style.setProperty('z-index', '9999999999999', 'important');
      iframe.style.setProperty('transform', 'translateX(100%)', 'important');
      iframe.style.setProperty('transition', 'all .4s', 'important');
      iframe.style.setProperty('background', 'rgba(255, 255, 255, 1)', 'important');
      // iframe.style.setProperty('box-shadow', '0 0 15px 2px rgba(0,0,0,0.12)', 'important');
      iframe.frameBorder = "none";
      // iframe.src = chrome.extension.getURL("iframe/index.html");

      document.body.appendChild(iframe);

      chrome.runtime.onMessage.addListener((request, sender) => {
        if (request.type === 'toggle') {
          toggleIframe();
        }
      });
    }
  };
  var toggleIframe = function (html,css) {
    if(!iframe) return;
    show = !show;
    iframe.style.setProperty('transform', show ? 'translateX(0)' : 'translateX(100%)', 'important');
    if(!show){
      return;
    }
    var doc = iframe.contentWindow.document;
    var style = '<style type="text/css">'+css+'</style>';
    var script = '<script class="you-should-delete-this-element-before-use" src="'+chrome.extension.getURL("iframe/iframe_tool.js")+'"></script>';


    // var htmlCode = '<pre style="width: 45%;white-space: initial;margin-right: 24px;">'+html.replace(/</g,'&#60;')+'</pre>';
    // var cssCode = '<pre style="width: 45%;white-space: initial;">'+css.replace(/</g,'&#60;')+'</pre>';
    // var buttons = '<p><button onclick="toggleIframe()">关闭</button></p>';
    // var code = '<section class="you-should-delete-this-element-before-use" style="display: flex;padding:24px;background:#ffffff;border-radius: 8px;max-width: 1200px;margin: 20px auto;">'+htmlCode+cssCode+'</section>';

    var codepen = '<div \n' +
      '  class="codepen" \n' +
      '  data-prefill \n' +
      '  data-height="400" \n' +
      '  data-theme-id="1"\n' +
      '  data-default-tab="html,css,result" \n' +
      '>\n' +
      '<pre data-lang="html">'+html.replace(/</g,'&lt').replace(/>/g,'&gt')+'</pre>\n' +
      '<pre data-lang="css">'+css.replace(/</g,'&lt').replace(/>/g,'&gt')+'</pre>\n' +
      '</div>\n' +
      '<script async src="https://static.codepen.io/assets/embed/ei.js"></script>'

    doc.open();
    doc.write(codepen);
    doc.close();
  }
}
