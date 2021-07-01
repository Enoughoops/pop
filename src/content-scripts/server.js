/**
 * 内容脚本同时也是一个 Server 端，用来执行扩展程序发送过来的命令
 */

import {createServer} from 'connect.io';
import Widget from "../public/widget";
import client from "./client";
import draggable from "./st/draggable";
import bindStorage from "./st/storage";
import bindGA from "./st/ga";
import hideOnEsc from "./st/hide-on-esc";
// import st from './st';

const server = createServer();

/* istanbul ignore next */
/**
 * 将自己的 location 对象报告给后台
 * @param data
 * @param {Function} resolve
 */
export function onGetLocation( data , resolve ) {
  if ( self === top ) {
    resolve( JSON.parse( JSON.stringify( location ) ) );
  }
}

/**
 * 接收到翻译命令时，翻译网页上的拖蓝
 */
export function onTranslate(data) {
  console.log("=======Entering server onTanslate===========");
  // let st = new Widget( { client } );
  // draggable( st );
  // bindStorage( st );
  // bindGA( st );
  // hideOnEsc( st );
  //
  // st.$appendTo( 'body' );
  // st.frameSrc = data;

  // st.query.text = getSelection().toString();
  // st.safeTranslate();
}

/* istanbul ignore if */
if ( process.env.NODE_ENV !== 'testing' ) {
  server.on( 'connect' , ( client )=> {
    client.on( 'get location' , onGetLocation );
    client.on( 'translate' , onTranslate );
  } );
}

export default server;
