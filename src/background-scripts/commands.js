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
//     webRequest.onBeforeRequest.addListener(details =>{
//         console.log('onBeforeRequest', details);
//         const url = details.url;
//         chrome.cookies.getAll({url}, cookies => {
//             console.log(cookies);
//             cookies.map((cookie) => {
//                 if (cookie.secure === false) {
//                     cookie.secure = true;
//                 }
//                 if (cookie.sameSite !== 'None') {
//                     cookie.sameSite = 'no_restriction';
//                 }
//                 return cookie;
//             });
//             console.log(cookies);
//             cookies.forEach((each) => {
//                 delete each.hostOnly;
//                 delete each.session;
//                 chrome.cookies.remove({url, name: each.name}, details => {});
//                 chrome.cookies.set({url, ... each});
//                 if (each.name === 'lastvisit') {
//                     each.name = 'guestJs';
//                     chrome.cookies.set({url, ... each});
//                 }
//             });
//             chrome.cookies.getAll({url}, cookies => {
//                 console.log('New Cookies:'+cookies);
//             })
//         });
//     }, {urls:['<all_urls>']},['blocking','extraHeaders','requestBody']);

webRequest.onBeforeSendHeaders.addListener(details =>{
        let newHeaderList = details.requestHeaders.map(
            (e) => {
                let newFetchDest = {};
                let newFetchSite = {};
                if (e.name === 'Sec-Fetch-Dest') {
                    newFetchDest.name = 'Sec-Fetch-Dest';
                    newFetchDest.value = 'document';
                    return newFetchDest;
                } else if (e.name === 'Sec-Fetch-Site') {
                    newFetchSite.name = 'Sec-Fetch-Site';
                    newFetchSite.value = 'none'
                    return newFetchSite;
                } else {
                    return e;
                }
            }
        );
        return {
            requestHeaders: newHeaderList
        }
    }, {urls:['<all_urls>']},['blocking','extraHeaders','requestHeaders']);


   webRequest.onHeadersReceived.addListener(
       function(details) {
           console.log("origin header length:" + details.responseHeaders.length);
           let newHeaderList = details.responseHeaders.filter(e => e.name !== 'x-frame-options' && e.name !== 'content-security-policy' && e.name !== 'X-Frame-Options' && e.name !== 'Content-Security-Policy');
           let samesiteList = newHeaderList.map(
               (e) => {
                   let newSetCookie = {};
                   if (e.name === 'set-cookie' || e.name === 'Set-Cookie') {
                       if (e.name === 'set-cookie') {
                           newSetCookie.name = 'set-cookie';
                       } else {
                           newSetCookie.name = 'Set-Cookie';
                       }
                       newSetCookie.value = e.value.concat('; SameSite=None; Secure');
                       return newSetCookie;
                   } else {
                       return  e;
                   }
               }
           );
         const newHeader = {...samesiteList,};
         // newHeader.delete('Content-Security-Policy');
         // newHeader.delete('X-Frame-Options');
           console.log(newHeader);
         return { responseHeaders : samesiteList };
       },
       // filters
       {
           urls: ["<all_urls>"],
       },
       // extraInfoSpec
       ["blocking","responseHeaders", "extraHeaders"]
   );
