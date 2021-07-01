/**
 * @files 根据设置显示或隐藏划词翻译在网页上的右键菜单
 */

import chromeCall from 'chrome-call';
import {send} from 'connect.io';
import {getCurrentTabId} from '../public/util';
import watcher from '../public/storage-watcher';
import {onTranslate} from '../content-scripts/index'

const callContextMenus = chromeCall.scope( chrome.contextMenus );

export let created = false;

// export async function onContextMenusClicked(info) {
//   send( {
//     id : await getCurrentTabId() ,
//     name : 'translate',
//     data : info.linkUrl
//   } );
// }

export function onChromeLocalStorageChanged( items ) {
  if ( items.showMenu ) {
    createMenus();
  } else {
    removeAll();
  }
}

/* istanbul ignore if */
if ( process.env.NODE_ENV !== 'testing' ) {
  watcher( 'showMenu' , onChromeLocalStorageChanged );
  // chrome.contextMenus.onClicked.addListener( onContextMenusClicked );
}

/**
 * 创建菜单
 * @return {Promise}
 */
function createMenus() {
  if ( !created ) {
    created = true;
    return callContextMenus( 'create' , {
      id : 'menu-translate' ,
      title : '翻译“%s”' ,
      contexts : [ 'all'] ,
      documentUrlPatterns : [ 'http://*/*' , 'https://*/*' , 'file:///*' , 'about:blank' ], // 不要让菜单出现在 chrome-* 页面下
      onclick:  async function(params){
        console.log("Select ::::::::"+params.linkUrl);
        // onTranslate(params.linkUrl)
        {
          send( {
            id :  await getCurrentTabId() ,
            name : 'translate',
            data : params.linkUrl
          } );
        }
      },
    } );
  }
}

/**
 * 删除所有菜单
 * @return {Promise}
 */
function removeAll() {
  created = false;
  return callContextMenus( 'removeAll' );
}
