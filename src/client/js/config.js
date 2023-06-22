/*
 * pwix:layout/src/client/js/config.js
 */

import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';

import detectIt from 'detect-it';

/*
 * From https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
 *
 *  document.body.clientHeight  // Inner height of the HTML document body, including padding 
 *                              // but not the horizontal scrollbar height, border, or margin
 *
 *  screen.height               // Device screen height (i.e. all physically visible stuff)
 *  screen.availHeight          // Device screen height minus the operating system taskbar (if present)
 *  window.innerHeight          // The current document's viewport height, minus taskbars, etc.
 *  window.outerHeight          // Height the current window visibly takes up on screen 
 *                              // (including taskbars, menus, etc.)
 * 
 *  document.body.clientWidth   // Full width of the HTML page as coded, minus the vertical scroll bar
 *  screen.width                // Device screen width (i.e. all physically visible stuff)
 *  screen.availWidth           // Device screen width, minus the operating system taskbar (if present)
 *  window.innerWidth           // The browser viewport width (including vertical scroll bar, includes padding but not border or margin)
 *  window.outerWidth           // The outer window width (including vertical scroll bar,
                                // toolbars, etc., includes padding and border but not margin)
 */

import _ from 'lodash';

_runningUI = new ReactiveDict();

// a private function which acts as a getter/setter
//  returns the (get/set) value
const _runningDict = function( name, value ){
    if( value !== undefined ){
        _runningUI.set( name, value );
        return value;
    }
    return _runningUI.get( name );
};

_.merge( uiLayout, {
    // the result of the detectIt module
    //  https://www.npmjs.com/package/detect-it
    detectIt: detectIt,

    resizeListener(){
        //console.log( 'pwix:layout resizing' );
        uiLayout.resize( new Date());
        //uiLayout.height( window.innerHeight );
        //uiLayout.width( window.innerWidth );
        //uiLayout.height( window.screen.availHeight );
        //uiLayout.width( window.screen.availWidth );
        uiLayout.height( document.documentElement.clientHeight );
        uiLayout.width( document.documentElement.clientWidth );
        uiLayout.landscape( uiLayout.width() > uiLayout.height());
    },

    // reactive getters / setters
    cordova( cordova ){ return _runningDict( 'cordova', cordova ); },
    height( height ){ return _runningDict( 'height', height ); },
    landscape( landscape ){ return _runningDict( 'landscape', landscape ); },
    mobile( mobile ){ return _runningDict( 'mobile', mobile ); },
    resize( stamp ){ return _runningDict( 'resize', stamp ); },
    touchable( touchable ){ return _runningDict( 'touchable', touchable ); },
    width( width ){ return _runningDict( 'width', width ); },

    // functions
    isXS(){ return uiLayout.width() <= UI_XS_WIDTH },
    isSM(){ return uiLayout.width() <= UI_SM_WIDTH },
    isMD(){ return uiLayout.width() <= UI_MD_WIDTH },
    isST(){ return uiLayout.width() <= UI_ST_WIDTH },
    isLG(){ return uiLayout.width() <= UI_LG_WIDTH },
    isXL(){ return uiLayout.width() > UI_LG_WIDTH },

    view(){
        const w = uiLayout.width();
        //console.log( 'w='+w );
        //console.log( window );
        if( w >= UI_LG_WIDTH ){
            return UI_VIEW_XL;
        }
        if( w >= UI_ST_WIDTH ){
            return UI_VIEW_LG;
        }
        if( w >= UI_MD_WIDTH ){
            return UI_VIEW_ST;
        }
        if( w >= UI_SM_WIDTH ){
            return UI_VIEW_MD;
        }
        if( w >= UI_XS_WIDTH ){
            return UI_VIEW_SM;
        }
        return UI_VIEW_XS;
    }
});

uiLayout.resizeListener();
uiLayout.cordova( Meteor.isCordova );
uiLayout.touchable( detectIt.primaryInput !== 'mouse' );  // 'touch'

Tracker.autorun(() => {
    const min = uiLayout.landscape() ? uiLayout.height() : uiLayout.width();
    uiLayout.mobile( uiLayout.cordova() || min <= UI_SM_WIDTH );
});
