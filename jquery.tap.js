(function(undefined){

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
        MS_TOUCH_DELTA = 10,
        uaLower = navigator.userAgent.toLowerCase(),
        IS_ANDROID_2 = uaLower.indexOf('android 2') > 0,
        IS_IOS_OPERA_MINI_NO_COMPRESS = uaLower.indexOf('opios/') > 0,
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
        timer,
        msStartCoords,
        msMoveCoords,
        // Make preventing function for shorter usage
        preventDefault = function (event) {
            event.preventDefault();
        };

    function isMobile () {
        return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Symbian|Opera\sM(obi|ini)|Blazer|Dolfin|Dolphin|UCBrowser/.test(navigator.userAgent);
    }

    // Some notebooks has touch and click, use click for it
    // You can use outside $.useTapEvent flag for notify plugin use detecting touch events or not
    if (jQuery.useTapEvent !== undefined) {
        IS_TOUCH_DEVICE = jQuery.useTapEvent;
    } else {
        IS_TOUCH_DEVICE = isMobile();
    }

    if (IS_TOUCH_DEVICE) {

        // iOS, Android, Android 2 has broken setTimeout
        HAS_TOUCH_EVENTS = 'ontouchstart' in document.documentElement && !IS_ANDROID_2 && !IS_IOS_OPERA_MINI_NO_COMPRESS;
        // IE 11
        HAS_POINTER_EVENTS = window.navigator.pointerEnabled;
        // IE 10
        HAS_MS_POINTER_EVENTS = window.navigator.msPointerEnabled;
        // has any "touch" events
        HAS_TOUCH = HAS_TOUCH_EVENTS || HAS_POINTER_EVENTS || HAS_MS_POINTER_EVENTS;

        if (HAS_POINTER_EVENTS) {
            START_EVENT_NAME = 'pointerdown';
            MOVE_EVENT_NAME = 'pointermove';
            END_EVENT_NAME = 'pointerup';
        } else if (HAS_MS_POINTER_EVENTS) {
            START_EVENT_NAME = 'MSPointerDown';
            MOVE_EVENT_NAME = 'MSPointerMove';
            END_EVENT_NAME = 'MSPointerUp';
        } else if (HAS_TOUCH_EVENTS) {
            START_EVENT_NAME = 'touchstart';
            MOVE_EVENT_NAME = 'touchmove';
            END_EVENT_NAME = 'touchend';
        } else {
            // fallback to click
            END_EVENT_NAME = CLICK_EVENT_NAME;
        }

    } else {
        // fallback to click
        END_EVENT_NAME = CLICK_EVENT_NAME;
    }

    // Cache jQuery body object
    $BODY = jQuery(document.body);

    if (HAS_TOUCH) {
        $BODY.on(MOVE_EVENT_NAME, function (e) {
            var origEvent = e.originalEvent,
                // https://connect.microsoft.com/IE/feedback/details/810635/ie-11-clientx-and-clienty-not-working
                // We just want to know is page position changed
                x = origEvent.clientX || document.body.scrollLeft + document.documentElement.scrollLeft,
                y = origEvent.clientY || document.body.scrollTop + document.documentElement.scrollTop;

            if (msStartCoords) {
                // Pointer move event can fire without coords changing
                // http://www.w3.org/TR/2014/WD-pointerevents-20141113/#the-pointermove-event
                msMoveCoords = [x.toFixed(0), y.toFixed(0)];
                wasMoved = (
                    Math.abs(msMoveCoords[0] - msStartCoords[0]) > MS_TOUCH_DELTA &&
                    Math.abs(msMoveCoords[1] - msStartCoords[1]) > MS_TOUCH_DELTA
                );
            } else {
                wasMoved = true;
            }
        }).on(START_EVENT_NAME, function (e) {
            var origEvent = e.originalEvent,
                // https://connect.microsoft.com/IE/feedback/details/810635/ie-11-clientx-and-clienty-not-working
                // We just want to know is page position changed
                x = origEvent.clientX || document.body.scrollLeft + document.documentElement.scrollLeft,
                y = origEvent.clientY || document.body.scrollTop + document.documentElement.scrollTop;

            if (HAS_POINTER_EVENTS || HAS_MS_POINTER_EVENTS) {
                msStartCoords = [x.toFixed(0), y.toFixed(0)];
            }
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
                eventNamespace = handleObj.namespace,
                skipEventName = eventNamespace && eventNamespace.indexOf('no') === 0 && eventNamespace.slice(2),
                targetNode,
                result;

            if (!wasMoved) {

                // set event type as event name
                event.type = JQUERY_SPECIAL_EVENT_NAME;
                // call handler
                result = handleObj.handler.call(this, event);
                // set back origin event type
                event.type = type;

                targetNode = event.target;

                if (HAS_TOUCH && skipEventName) {

                    $BODY.add(targetNode).on(skipEventName, preventDefault);

                    if (timer) {
                        clearTimeout(timer);
                    }

                    timer = setTimeout(function () {
                        $BODY.add(targetNode).off(skipEventName, preventDefault);
                        targetNode = skipEventName = null;
                    }, 500);

                }

                // prevent memory leaks
                data = handleObj = null;

                return result;

            }

        }

    };

}());
