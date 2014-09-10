jQueryTap
=========

This is a jQuery plugin which creates a click alternative tap event for touch enabled browsers.
If touch is disabled tap event just become a click event.

This event is needed to prevent 300ms delay between touchend event and click events.

This plugin works everywhere where jQuery 1.7+ works. This plugin created using jQuery Special Events API and works like any other event in jQuery:

```
$('some_selector').on('tap', function () {/*your code here*/});
$('some_selector').off('tap', function () {/*your code here*/});
$('some_selector').one('tap', function () {/*your code here*/});

```
You can use all enabled event methods: on/off, bind/unbind, delegate/undelegate.

Example page for device testing: http://jsbin.com/behaqa/1/

![QR code off example page](http://api.qrserver.com/v1/create-qr-code/?color=000000&amp;bgcolor=FFFFFF&amp;data=http%3A%2F%2Fjsbin.com%2Fbehaqa%2F1%2F&amp;qzone=1&amp;margin=0&amp;size=400x400&amp;ecc=L)
