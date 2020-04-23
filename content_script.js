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
  // style.dataset.href=href;
  style.type = "text/css";
  style.appendChild(document.createTextNode(content));
  const head = document.getElementsByTagName("head")[0];
  ownerNode = ownerNode || head.children[0];
  head.insertBefore(style,ownerNode);
}

var lastTarget = document.body;

if(window.self===window.top) {
  appendStyle('.extract-active{outline: 2px dashed red;outline-offset: -1px;}');
  document.addEventListener('dblclick',function (e) {
    if(!canExtract) return;
    const highlight = lastTarget !== e.target;
    lastTarget = e.target;
    var pop = document.querySelector('#pico-content');
    if(pop && pop.contains(lastTarget)) return;
    setActive();
  });
  document.addEventListener('keydown',function (e) {
    const code = e.keyCode;
    const isTop = lastTarget.tagName==='BODY';
    const parent =  isTop ? lastTarget : lastTarget.parentNode;
    const lastTimeTarget = lastTarget;
    switch (code) {
      case 39:
        lastTarget = lastTarget.children[0]||lastTarget;
        break;
      case 37:
        if(isTop) return;
        lastTarget = parent;
        break;
      case 40:
        e.preventDefault();
        if(isTop) return;
        lastTarget = lastTarget.nextElementSibling || parent;
        break;
      case 38:
        e.preventDefault();
        if(isTop) return;
        lastTarget = lastTarget.previousElementSibling || parent;
        break;
      case 13: // 回车
        // e.preventDefault();
        // extractDom();
        return;
    }
    if(lastTarget!==lastTimeTarget){
      setActive();
    }
  });

  function setActive(highlight=true) {
    var lastOne = document.querySelector('.extract-active');
    if(lastOne) {
      lastOne.classList.remove('extract-active');
    }
    if(highlight){
      lastTarget.classList.add('extract-active');
    }
  }
}


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
      matched = element.matchesSelector(selector);
    }catch(e){
      console.log(e,selectorText,element,typeof element)
    }
  }
  console.log(selectorText,matched)
  return matched;
};
const indentAsCSS = function(str) {
  return str.replace(/([{;}])/g, "$1\n ").replace(/(\n[ ]+})/g, "\n}");
};

// TODO 去除父元素
const getAppliedCSS = function(elm,cssRules,ignoreSelector=[]) {
  var elementRules = [];
  var leftCssRules = [];
  cssRules.forEach((cssRule)=>{
   if(elementMatchCSSRule(elm, cssRule) && !ignoreSelector.includes(cssRule.selectorText)) {
     elementRules.push(cssRule)
   } else {
     leftCssRules.push(cssRule);
   }
  });
  return {
    elementRules: elementRules,
    leftCssRules: leftCssRules,
  };
};

const propertyInCSSRule = function(prop, cssRule) {
  return prop in cssRule.style && cssRule.style[prop] !== '';
};

const getStyle = function(elm,cssRules, lookInHTML = false) {
  var {elementRules:rules, leftCssRules} = getAppliedCSS(elm,cssRules,['.extract-html-active']);
  console.log(leftCssRules.length,'left rules');
  var str = '';
  for (var i = 0; i < rules.length; i++) {
    var r = rules[i];
    // elm.setAttribute('style',elm.getAttribute('style')+r.style.cssText);
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
  var others = document.querySelector('.extract-active');
  if(others) {
    others.classList.remove('extract-active');
  }
  lastTarget.classList.remove('extract-active');

  initStyleLink([],0,function (styleSheets) {
    const cssRules = styleSheets.reduce(function(rules, styleSheet) {
      const rule = styleSheet.href?[]:slice(styleSheet.cssRules);
      return rules.concat(rule);
    }, []);

    const cssInline = true;
    const extractElement = lastTarget.cloneNode(true);
    const result = extractHTML(extractElement,cssRules);
    toggleIframe(extractElement.outerHTML,result);
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
