/**
 * @files chrome 快捷键的事件监听函数
 */

import {send} from 'connect.io';
import {getCurrentTabId} from '../public/util';
const { webRequest } = chrome;


/* istanbul ignore if */
if ( process.env.NODE_ENV !== 'testing' ) {
  chrome.commands.onCommand.addListener( onCommand );
}

export async function onCommand( command ) {

  const tabId = await getCurrentTabId();

  switch ( command ) {
    case 'translate':
      send( {
        id: tabId ,
        name : 'translate'
      } );
      break;
  }
}

 // webRequest.onHeadersReceived((details, callback) => {
 //  callback({
 //    responseHeaders: {
 //      ...details.responseHeaders,
 //      'Content-Security-Policy': ['default-src \'none\'']
 //    }
 //  });
 // });

// 每次请求前触发，可以拿到 requestBody 数据，同时可以对本次请求作出干预修改
    webRequest.onBeforeRequest.addListener(details =>{
        console.log('onBeforeRequest', details);
    }, {urls:['<all_urls>']},['blocking','extraHeaders','requestBody']);

   webRequest.onHeadersReceived.addListener(
       function(details) {
           console.log("origin header length:" + details.responseHeaders.length);
           let newHeaderList = details.responseHeaders.filter(e => e.name !== 'x-frame-options' && e.name !== 'content-security-policy');
         const newHeader = {...newHeaderList,};
         // newHeader.delete('Content-Security-Policy');
         // newHeader.delete('X-Frame-Options');
           console.log(newHeader);
         return { responseHeaders : newHeaderList };
       },
       // filters
       {
           urls: ["<all_urls>"],
       },
       // extraInfoSpec
       ["blocking","responseHeaders", "extraHeaders"]
   );
