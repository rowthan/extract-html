appendStyle('.extract-html-active{outline:1px solid red;border:1px solid pink;}');

function initStyleLink(styleSheets=[],index=0,callback) {
  const documentStyleSheets = document.styleSheets;
  const currentStyleSheet = documentStyleSheets[index];
  if(index>=documentStyleSheets.length){
    if(callback && typeof callback==='function'){
      callback(styleSheets)
    }
    return
  }
  const href = currentStyleSheet.href;
  // const hasInject = document.querySelector('style[data-href="'+href+'"]');
  if(href) {
    console.log('inject',href);
    // 保证注入的顺序
    loadStyle(href,currentStyleSheet.ownerNode,function (sheet) {
      styleSheets.push(sheet);
      initStyleLink(styleSheets,++index,callback);
    })
  } else {
    styleSheets.push(currentStyleSheet);
    initStyleLink(styleSheets,++index,callback);
  }
}

function loadStyle(href,ownerNode,callback) {
  if(!href) return [];
  const xhr = new XMLHttpRequest();
  xhr.open("GET", href);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      // appendStyle(xhr.responseText,ownerNode,href);
      // ownerNode.parentNode.removeChild(ownerNode);
      const cssContent = xhr.responseText;
      var styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(cssContent);
      typeof callback === 'function' && callback(styleSheet)
    }
  };
  try{
    xhr.send();
  }catch (e) {
    typeof callback === 'function' && callback()
  }
}


function appendStyle(content,ownerNode,href='href') {
  const style = document.createElement("style");
  style.dataset.href=href;
  style.type = "text/css";
  style.appendChild(document.createTextNode(content));
  const head = document.getElementsByTagName("head")[0];
  ownerNode = ownerNode || head.children[0];
  head.insertBefore(style,ownerNode);
}

var lastTarget = document.body;
document.addEventListener('mousedown',function (e) {
  if(!canExtract) return;
  lastTarget = e.target;
  var pop = document.querySelector('#pico-content');
  if(pop && pop.contains(lastTarget)) return;
  var others = document.querySelector('.extract-html-active');
  if(others) {
    others.classList.remove('extract-html-active');
  }
  lastTarget.classList.add('extract-html-active')
});


const proto = Element.prototype;
const slice = Function.call.bind(Array.prototype.slice);
const matches = proto.matchesSelector ||
  proto.mozMatchesSelector || proto.webkitMatchesSelector ||
  proto.msMatchesSelector || proto.oMatchesSelector;

let x = document.documentElement;
HTMLElement.prototype.matchesSelector = x.webkitMatchesSelector ||
  x.mozMatchesSelector || x.oMatchesSelector || x.msMatchesSelector;

const elementMatchCSSRule = function(element, cssRule,ignorePseudo=true) {
  const selectorText = cssRule.selectorText||'';
  const selector = ignorePseudo?selectorText.replace(/::?(hover|active|focus|visited|before|after)/g,''):selectorText;
  let matched = false;
  if(selector) {
    try{
      matched = element.matchesSelector ? element.matchesSelector(selector) : false;
    }catch(e){
      console.log(e,selector,element,typeof element)
    }
  }
  return matched;
};
const indentAsCSS = function(str) {
  return str.replace(/([{;}])/g, "$1\n ").replace(/(\n[ ]+})/g, "\n}");
};

// TODO 去除父元素
const getAppliedCSS = function(elm,cssRules,ignoreSelector=[]) {
  var elementRules = [];
  var leftCssRules = [];
  var cnt = 0;
  cssRules.forEach((cssRule)=>{
    cnt ++;
   if(elementMatchCSSRule(elm, cssRule) && !ignoreSelector.includes(cssRule.selectorText)) {
     elementRules.push(cssRule)
   } else {
     leftCssRules.push(cssRule);
   }
  });
  return {
    elementRules: elementRules,
    leftCssRules: leftCssRules,
    cnt: cnt,
  };
};

const propertyInCSSRule = function(prop, cssRule) {
  return prop in cssRule.style && cssRule.style[prop] !== '';
};

const getStyle = function(elm,cssRules, lookInHTML = false) {
  var {elementRules:rules, leftCssRules,cnt} = getAppliedCSS(elm,cssRules,['.extract-html-active']);
  console.log(cnt);
  var str = '';
  for (var i = 0; i < rules.length; i++) {
    var r = rules[i];
    // TODO 替换selector
    // const className = elm.classList?elm.classList.join('.'):'.class-'+i;
    // const selectors = r.selector.split(',');
    // const lastSelector = selectors[selectors.length-1];
    // const longSelector = lastSelector.trim().split(' ');
    // const finalSelector = longSelector[longSelector.length-1];
    // const css = r.text.replace(r.selector,finalSelector);
    str += '\n' + r.cssText;
  }

  // TODO 没有选择器
  if (lookInHTML && elm.getAttribute('style')){
    str += '\n/* Inline styling */\n' + elm.getAttribute('style');
  }

  return {
    css: str,
    leftCssRules,
  };
};

var canExtract = true;
function extractDom() {
  var others = document.querySelector('.extract-html-active');
  if(others) {
    others.classList.remove('extract-html-active');
  }
  initStyleLink([],0,function (styleSheets) {
    const cssRules = styleSheets.reduce(function(rules, styleSheet) {
      const rule = styleSheet.href?[]:slice(styleSheet.cssRules);
      return rules.concat(rule);
    }, []);
    const result = extractHTML(lastTarget,cssRules);

    var codepen = '<div \n' +
      '  class="codepen" \n' +
      '  data-prefill \n' +
      '  data-height="400" \n' +
      '  data-theme-id="1"\n' +
      '  data-default-tab="html,result" \n' +
      '>\n' +
      '<pre data-lang="html">'+lastTarget.outerHTML.replace(/</g,'&lt').replace(/>/g,'&gt')+'</pre>\n' +
      '<pre data-lang="css">'+result+'</pre>\n' +
      '</div>\n';

    var formatHtml = function () {
      alert('yes')
    }

    var data = {
      html               : lastTarget.outerHTML,
      css                : result,
      // js                 : JS
    };

    var JSONstring =
      JSON.stringify(data)
      // Quotes will screw up the JSON
        .replace(/"/g, "&​quot;") // careful copy and pasting, I had to use a zero-width space here to get markdown to post this.
        .replace(/'/g, "&apos;");

    var form =
      '<form action="https://codepen.io/pen/define" method="POST" target="_blank">' +
      '<input type="hidden" name="data" value=\'' +
      JSONstring +
      '\'>' +
      '<input type="image" src="http://s.cdpn.io/3/cp-arrow-right.svg" width="40" height="40" value="无法查看？新页面打开" class="codepen-mover-button">' +
      '</form>';
    var buttons = '<div><button onclick="formatHtml">优化HTML</button>'+form+'</div>';


    var content = '<section>'+codepen+buttons+'</section>';

    toggleIframe(lastTarget.outerHTML,result);
    return;
    picoModal({
      content: content,
      width: 1200,
      // overlayStyles: {
      //   backgroundColor: "#169",
      //   opacity: 0.75
      // }
    }).afterShow(function () {
      canExtract = false;
      var penscript = document.querySelector('script[src="https://static.codepen.io/assets/embed/ei.js"][data-href="html"]');

      if(penscript && window.__CPEmbed){
        window.__CPEmbed();
      } else {
        var script = document.createElement('script');
        script.dataset.href = 'html';
        script.src = 'https://static.codepen.io/assets/embed/ei.js';
        document.body.appendChild(script);
      }
      // toggleIframe(lastTarget.outerHTML,result)
    }).afterClose(function (modal) { modal.destroy(); canExtract = true})
    .show();
  });
}

// 目标DOM节点，整站的CSS rules
function extractHTML(target,cssRules) {
  let toNextRules = cssRules;
  return getCss(target,'');

  function getCss(target,css) {
    const styleResult = getStyle(target, toNextRules);
    css = css + styleResult.css;
    toNextRules = [].concat(styleResult.leftCssRules);
    for(let i=0; i<target.children.length; i++) {
      css = css + getCss(target.children[i],'');
    }
    return css;
  }
}
