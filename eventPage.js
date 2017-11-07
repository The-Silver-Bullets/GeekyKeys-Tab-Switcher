
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostPrefix: 'www.google' , schemes: ['https']},
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

var url = null;

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];
	
    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    url = tab.url;
	//alert(url);

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/*document.addEventListener("DOMContentLoaded",()=> {
  getCurrentTabUrl((url) => {
	 alert(url);
  });
},true);*/

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {

    // do your 
	getCurrentTabUrl((url) => {
	 // alert(url);
  });

  }
})



chrome.commands.onCommand.addListener(function(command) {

  // alert(opt);
  if(url.startsWith("https://www.google.") && url.includes("/search")) {
    if (command == 'open_image') {
      var n = url.includes("&tbm");
      var str;
      if(n==true){
        str = url.replace(/(&tbm=)(isch|vid|nws)/,"");
        str = str.concat("&tbm=isch");
      }
      else{
        str = url.concat("&tbm=isch");
      }
      chrome.tabs.create({url:str});
    }
    else if(command == 'open_videos'){
      var n = url.includes("&tbm");
      var str;
      if(n==true){
        str = url.replace(/(&tbm=)(isch|vid|nws)/,"");
        str = str.concat("&tbm=vid");
      }
      else{
        str = url.concat("&tbm=vid");
      }
      chrome.tabs.create({url:str});
    }
    else if(command == 'open_news'){
      var n = url.includes("&tbm");
      var str;
      if(n==true){
        str = url.replace(/(&tbm=)(isch|vid|nws)/,"");
        str = str.concat("&tbm=nws");
      }
      else{
        str = url.concat("&tbm=nws");
      }
      chrome.tabs.create({url:str});
    }
    else if(command == 'open_all'){
      var str = url.replace(/(&tbm=)(isch|vid|nws)/,"");
      chrome.tabs.create({url:str});
    }
  }  
   
});
	  