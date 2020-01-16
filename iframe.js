var closeImg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjEgKDc4MTM2KSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5QYXRoPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IuehruiupCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuWPkemCruS7ti3mnIDmlrAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDQyLjAwMDAwMCwgLTEyMS4wMDAwMDApIiBmaWxsPSIjMzMzMzMzIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEwNDksMTI2LjUxMjg4NyBMMTA1NC4yMDQ5LDEyMS4zMDc5OTEgQzEwNTQuNjE1NTUsMTIwLjg5NzMzNiAxMDU1LjI4MTM1LDEyMC44OTczMzYgMTA1NS42OTIwMSwxMjEuMzA3OTkxIEMxMDU2LjEwMjY2LDEyMS43MTg2NDYgMTA1Ni4xMDI2NiwxMjIuMzg0NDQ5IDEwNTUuNjkyMDEsMTIyLjc5NTEwNCBMMTA1MC40ODcxMSwxMjggTDEwNTUuNjkyMDEsMTMzLjIwNDg5NiBDMTA1Ni4xMDI2NiwxMzMuNjE1NTUxIDEwNTYuMTAyNjYsMTM0LjI4MTM1NCAxMDU1LjY5MjAxLDEzNC42OTIwMDkgQzEwNTUuMjgxMzUsMTM1LjEwMjY2NCAxMDU0LjYxNTU1LDEzNS4xMDI2NjQgMTA1NC4yMDQ5LDEzNC42OTIwMDkgTDEwNDksMTI5LjQ4NzExMyBMMTA0My43OTUxLDEzNC42OTIwMDkgQzEwNDMuMzg0NDUsMTM1LjEwMjY2NCAxMDQyLjcxODY1LDEzNS4xMDI2NjQgMTA0Mi4zMDc5OSwxMzQuNjkyMDA5IEMxMDQxLjg5NzM0LDEzNC4yODEzNTQgMTA0MS44OTczNCwxMzMuNjE1NTUxIDEwNDIuMzA3OTksMTMzLjIwNDg5NiBMMTA0Ny41MTI4OSwxMjggTDEwNDIuMzA3OTksMTIyLjc5NTEwNCBDMTA0MS44OTczNCwxMjIuMzg0NDQ5IDEwNDEuODk3MzQsMTIxLjcxODY0NiAxMDQyLjMwNzk5LDEyMS4zMDc5OTEgQzEwNDIuNzE4NjUsMTIwLjg5NzMzNiAxMDQzLjM4NDQ1LDEyMC44OTczMzYgMTA0My43OTUxLDEyMS4zMDc5OTEgTDEwNDksMTI2LjUxMjg4NyBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+'
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
      iframe.style.setProperty('background', 'rgba(0, 0, 0, 0.5)', 'important');
      // iframe.style.setProperty('box-shadow', '0 0 15px 2px rgba(0,0,0,0.12)', 'important');
      iframe.frameBorder = "none";
      // iframe.src = chrome.extension.getURL("iframe/index.html");

      document.body.appendChild(iframe);

      chrome.runtime.onMessage.addListener((request, sender) => {
        if (request.type === 'toggle') {
          toggleIframe();
        }
      });

      window.addEventListener("message", function (event) {
        if(event.data.type==='close'){
          toggleIframe();
        }
      }, false);
    }
  };
  var toggleIframe = function (html,css) {
    if(!iframe) return;
    show = !show;
    iframe.style.setProperty('transform', show ? 'translateX(0)' : 'translateX(100%)', 'important');
    if(!show || !html){
      return;
    }
    var doc = iframe.contentWindow.document;
    var style = '<style type="text/css">'+css+'</style>';
    var script = '<script class="you-should-delete-this-element-before-use" src="'+chrome.extension.getURL("iframe/iframe_tool.js")+'"></script>';


    // var htmlCode = '<pre style="width: 45%;white-space: initial;margin-right: 24px;">'+html.replace(/</g,'&#60;')+'</pre>';
    // var cssCode = '<pre style="width: 45%;white-space: initial;">'+css.replace(/</g,'&#60;')+'</pre>';
    // var buttons = '<p><button onclick="toggleIframe()">关闭</button></p>';
    // var code = '<section class="you-should-delete-this-element-before-use" style="display: flex;padding:24px;background:#ffffff;border-radius: 8px;max-width: 1200px;margin: 20px auto;">'+htmlCode+cssCode+'</section>';


    var JSONstring =
      JSON.stringify({html:html,css:css})
      // Quotes will screw up the JSON
      //   .replace(/"/g, "&​quot;") // careful copy and pasting, I had to use a zero-width space here to get markdown to post this.
        .replace(/'/g, "&apos;");

    var codeForm =
      '<form action="https://codepen.io/pen/define" method="POST" target="_blank">' +
      '<input type="hidden" name="data" value=\'' +
      JSONstring +
      '\'>' +
      '<input type="image" src="http://s.cdpn.io/3/cp-arrow-right.svg" width="40" height="40" value="无法查看？新页面打开" class="codepen-mover-button">' +
      '</form>';

    var codepen = '<div style="text-align: center" \n' +
      '  class="codepen" \n' +
      '  data-prefill \n' +
      '  data-height="400" \n' +
      '  data-theme-id="1"\n' +
      '  data-default-tab="html,result" \n' +
      '>\n' +
      '<pre data-lang="html">'+html.replace(/</g,'&lt').replace(/>/g,'&gt')+'</pre>\n' +
      '<pre data-lang="css">'+css+'</pre>\n' +
      '</div>\n' +
      '<script async src="https://static.codepen.io/assets/embed/ei.js"></script>';

    var iframScript = '<script>function closeSelf() {\n' +
      'window.top.postMessage({type:\'close\'},\'*\');\n' +
      '    };document.getElementById("close").onclick=closeSelf</script>'

    var buttons = '<section style="text-align: center"><a href="javascript:;" id="close" " style="display: inline-block;width: 15px;height: 15px;padding: 5px;background: #f3f3f3;border-radius: 15px;" ><img src="'+closeImg+'" alt="关闭" class=""></a></section>';

    var iframeBody = codepen+buttons+iframScript;

    doc.open();
    doc.write(iframeBody);
    doc.close();
  }
}
