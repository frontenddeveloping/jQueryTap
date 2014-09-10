$(function () {

    var $TEST_AREA = $('.page-test-area'),
        $LOG = $('.log'),
        elementsOnPage = 1;

    if (window.operamini) {
        $LOG.hide();
    }

    // LOG FUNCTIONS
    function log(message) {
        var html;
        if (window.operamini) {
            alert(message);
        } else {
            html = $LOG.html() + message + '<br>';
            $LOG.html(html);
        }
    }
    //END LOG FUNCTIONS

    //HANDLERS FOR TESTS
    function enableTap(e) {
        e.stopPropagation();
        var data = e.data,
            type = data.type;
        $(this).removeClass('tap-disabled');
        log('Delegate by "' + type + '" tap called...');
    }

    function disableTap(e) {
        e.stopPropagation();
        var data = e.data,
            type = data.type,
            disableMethod,
            parent = $(this).parent(),
            eventContainer,
            selector;
        log('Delegate by "' + type + '" tap is off...');
        parent.addClass('tap-disabled');
        switch (type) {

            case 'on':
                disableMethod = 'off';
                eventContainer = parent;
                break;
            case 'on-delegate':
                disableMethod = 'off';
                eventContainer = $TEST_AREA;
                selector = '.tap-' + type;
                break;
            case 'one':
                disableMethod = 'off';
                eventContainer = parent;
                break;
            case 'one-delegate':
                disableMethod = 'off';
                eventContainer = $TEST_AREA;
                selector = '.tap-' + type;
                break;
            case 'delegate':
                disableMethod = 'undelegate';
                eventContainer = $TEST_AREA;
                selector = '.tap-' + type;
                break;
            case 'bind':
                disableMethod = 'unbind';
                eventContainer = parent;
                break;
            default:
                disableMethod = 'off';
                eventContainer = $TEST_AREA;
                break;

        }

        if (disableMethod === 'undelegate') {
            eventContainer[disableMethod](selector, 'tap', enableTap);
        } else {
            eventContainer[disableMethod]('tap', selector, enableTap);
        }

    }
    //END TEST HANDLERS

    //DELEGATE TEST HANDLERS
    $TEST_AREA.on('tap', '.tap-on-delegate', {
        type: 'on-delegate'
    }, enableTap)
        .on('tap', '.tap-on-delegate a', {
            type: 'on-delegate'
        }, disableTap)
        .one('tap', '.tap-one-delegate', {
            type: 'one-delegate'
        }, enableTap)
        .one('tap', '.tap-one-delegate a', {
            type: 'one-delegate'
        }, disableTap)
        .delegate('.tap-delegate', 'tap', {
            type: 'delegate'
        }, enableTap)
        .delegate('.tap-delegate a', 'tap', {
            type: 'delegate'
        }, disableTap);
    //END DELEGATE TEST HANDLERS

    //GENERATE HANDLERS
    function createContent(elementsNumbers, type) {
        var div,
            link,
            i = 0;
        for (i; i < elementsNumbers; i++) {
            div = $('<div/>', {
                text: type
            }).addClass('tap-' + type).addClass('tap');
            link = $('<a/>', {
                href: 'javascript:;',
                text: 'disable handler'
            }).addClass('tap-link');
            div.append(link);
            $TEST_AREA.append(div);
        }
    }

    function createOnDelegateContent(elementsNumbers) {
        createContent(elementsNumbers, 'on-delegate');
    }

    function createOneDelegateContent(elementsNumbers) {
        createContent(elementsNumbers, 'one-delegate');
    }

    function createDelegateContent(elementsNumbers) {
        createContent(elementsNumbers, 'delegate');
    }

    function createOnNonDelegateContent(elementsNumbers) {
        createContent(elementsNumbers, 'on');
        $('.tap-on').on('tap', {
            type: 'on'
        }, enableTap)
            .find('a')
            .on('tap', {
                type: 'on'
            }, disableTap);
    }

    function createOneNonDelegateContent(elementsNumbers) {
        createContent(elementsNumbers, 'one');
        $('.tap-one').one('tap', {
            type: 'one'
        }, enableTap)
            .find('a')
            .one('tap', {
                type: 'one'
            }, disableTap);
    }

    function createBindContent(elementsNumbers) {
        createContent(elementsNumbers, 'bind');
        $('.tap-bind').bind('tap', {
            type: 'bind'
        }, enableTap)
            .find('a')
            .bind('tap', {
                type: 'bind'
            }, disableTap);
    }

    //GENERATE CONTENT
    createOnDelegateContent(elementsOnPage);
    createOnNonDelegateContent(elementsOnPage);
    createOneDelegateContent(elementsOnPage);
    createOneNonDelegateContent(elementsOnPage);
    createDelegateContent(elementsOnPage);
    createBindContent(elementsOnPage);

});
