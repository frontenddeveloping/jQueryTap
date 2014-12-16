jQuery(function(){

    /*
        Shot story:
        There is a delay in 300 ms for events:
         - between touchend and click for touchEvents
         - between pointerup and click for pointerEvents
        First is affected for all major browsers, second for IE 10+ only.
        But, Firefox for Android and Chrome For Android remove this delay if you add to viewport tag width=device-width value.
        So tap event is necessary for Windows Phone 8+, iOS, Android Stock Browser 4.4-
    */

    'use strict';

    var
        JQUERY_SPECIAL_EVENT_NAME = 'tap',
        CLICK_EVENT_NAME = 'click',
        wasMoved = false,
        HAS_TOUCH_EVENTS,
        HAS_POINTER_EVENTS,
        HAS_MS_POINTER_EVENTS,
        IS_TOUCH_DEVICE,
        HAS_TOUCH,
        START_EVENT_NAME,
        MOVE_EVENT_NAME,
        END_EVENT_NAME,
        $BODY,
        // Make preventing function for shorter usage
        preventDefault = function (event) {
            event.preventDefault();
        };

    function isMobile () {
        return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Symbian|Opera\sM(obi|ini)|Blazer|Dolfin|Dolphin|UCBrowser/.test(navigator.userAgent)
    }

    // Some notebooks has touch and click, use click for it
    // You can use outside $.useTapEvent flag for notify plugin use detecting touch events or not
    if (jQuery.useTapEvent !== undefined) {
        IS_TOUCH_DEVICE = jQuery.useTapEvent;
    } else {
        IS_TOUCH_DEVICE = isMobile();
    }

    if (!IS_TOUCH_DEVICE) {
        return;
    }

    //iOS, Android
    HAS_TOUCH_EVENTS = 'ontouchstart' in document.documentElement;
    //IE 11
    HAS_POINTER_EVENTS = window.navigator.pointerEnabled;
    //IE 10
    HAS_MS_POINTER_EVENTS = window.navigator.msPointerEnabled;
    //has any "touch" events
    HAS_TOUCH = HAS_TOUCH_EVENTS || HAS_POINTER_EVENTS || HAS_MS_POINTER_EVENTS;
    //fallback to click
    END_EVENT_NAME = CLICK_EVENT_NAME;
    //Cache jQuery body object
    $BODY = jQuery(document.body);

    if (HAS_TOUCH_EVENTS) {
        START_EVENT_NAME = 'touchstart';
        MOVE_EVENT_NAME = 'touchmove';
        END_EVENT_NAME = 'touchend';
    } else if (HAS_POINTER_EVENTS) {
        START_EVENT_NAME = 'pointerdown';
        MOVE_EVENT_NAME = 'pointermove';
        END_EVENT_NAME = 'pointerup';
    } else if (HAS_MS_POINTER_EVENTS) {
        START_EVENT_NAME = 'MSPointerDown';
        MOVE_EVENT_NAME = 'MSPointerMove';
        END_EVENT_NAME = 'MSPointerUp';
    }

    if (HAS_TOUCH) {
        $BODY.on(MOVE_EVENT_NAME, function () {
            wasMoved = true;
        }).on(START_EVENT_NAME, function () {
            wasMoved = false;
        });
    }

    jQuery.event.special[JQUERY_SPECIAL_EVENT_NAME] = {

        delegateType: END_EVENT_NAME,

        bindType: END_EVENT_NAME,

        handle: function (event) {
            var type = event.type,
                data = event.data || {},
                handleObj = event.handleObj,
                noClick = handleObj.namespace === 'noclick',
                result;

            if (!wasMoved) {

                //set event type as event name
                event.type = JQUERY_SPECIAL_EVENT_NAME;
                //call handler
                result = handleObj.handler.call(this, event);
                //set back origin event type
                event.type = type;

                if (HAS_TOUCH && noClick) {
                    $BODY.on(CLICK_EVENT_NAME, preventDefault);
                    setTimeout(function () {
                        $BODY.off(CLICK_EVENT_NAME, preventDefault);
                    }, 500);
                }

                //prevent memory leaks
                data = handleObj = null;

                return result;

            }

        }

    };

});
