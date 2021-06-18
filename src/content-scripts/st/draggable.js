/**
 * @files 让翻译窗口可拖动
 */

import interact from 'interact.js';
import restrictBox from './restrict';

export default function ( st ) {

  function restrict() {
    restrictBox( st );
  }

  function onMove( event ) {
    const {boxPos} = st;
    boxPos.translateX += event.dx;
    boxPos.translateY += event.dy;
  }


  function onResize( event ) {
    const {boxPos} = st;
    boxPos.translateX += event.dx;
    boxPos.translateY += event.dy;
  }

  /* istanbul ignore next */
  if ( process.env.NODE_ENV === 'testing' ) {
    st.__restrict = restrict;
    st.__onMove = onMove;
  } else {
    st.$on( 'after translate' , ()=> {
      st.$nextTick( restrict );
    } );

    interact( st.$els.stBox )
        .resizable({
          edges: { right: true, bottom: true }
        })
        .on('resizemove', function (event) {
          var frame = st.$els.stFrame;
          var box = event.target;

          // update the element's style
          // frame.style.width  = event.rect.width + 'px';
          frame.style.height = event.rect.height + 'px';
          box.style.width = event.rect.width + 'px';
          box.style.height = event.rect.height+ 72 + 'px';
        });

    interact( st.$els.stDrag )
      .styleCursor( false )
      .draggable( {
        onmove : onMove ,
        onend : restrict
      } );
  }
}
