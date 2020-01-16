

function extractDom() {
  chrome.tabs.executeScript({ code: "extractDom();" });
}
chrome.contextMenus.create({"title": '抓取HTML', "contexts":["all", "page", "frame"] ,
  "onclick": extractDom});


chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {type:"toggle"});
  })
});

