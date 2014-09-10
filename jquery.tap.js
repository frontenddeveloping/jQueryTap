jQuery(function(){

    var HAS_TOUCH = 'ontouchstart' in document.documentElement,
        END_EVENT_NAME = HAS_TOUCH ? 'touchend' : 'click',
        JQUERY_SPECIAL_EVENT_NAME = 'tap',
        wasMoved = false;

    if (HAS_TOUCH) {
        jQuery(document.body)
            .on('touchmove', function () {
                wasMoved = true;
            }).on('touchstart', function () {
                wasMoved = false;
            });
    }

    jQuery.event.special[JQUERY_SPECIAL_EVENT_NAME] = {

        delegateType: END_EVENT_NAME,

        bindType: END_EVENT_NAME,

        handle: function (event) {
            var type = event.type,
                result;

            if (!wasMoved) {

                event.type = JQUERY_SPECIAL_EVENT_NAME;

                result = event.handleObj.handler.call(this,event);

                event.type = type;

                return result

            }

        }

    };

}());
