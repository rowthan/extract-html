

function extractDom() {
  chrome.tabs.executeScript({ code: "extractDom();" });
}
chrome.contextMenus.create({"title": '抓取HTML', "contexts":["all", "page", "frame"] ,
  "onclick": extractDom});

