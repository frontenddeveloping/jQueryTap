jQueryTap
=========

This is a jQuery plugin which creates a click alternative tap event for touch enabled browsers.
If touch is disabled tap event just become a click event.

Works fine for: Android stock browser, Android Chrome, Android Firefox, Android Opera, Opera Mini, iOS Safari, IE Mobile

This event is needed to prevent 300ms delay between touchend event and click events.

This plugin works everywhere where jQuery 1.7+ works. This plugin created using jQuery Special Events API and works like any other event in jQuery:

```
$('some_selector').on('tap', function () {/*your code here*/});
$('some_selector').off('tap');
$('some_selector').one('tap', function () {/*your code here*/});

```
You can use all enabled event methods: on/off, bind/unbind, delegate/undelegate.

Note! This plugin don't prevent click event. If you want to use tap on link and prevent click event use this:

```
$('any_link').on('tap', function() {
  //let's open link in new window and use window.parent in it
  window.open(this.href);
}).on('click', function () {
  return false;//this will prevent the loading link
});
```

if you what to use tap event and prevent click at all(animation case) then user is taping use tapConfig:

```
var TAP_CONFIG = {
    tapConfig : {
        noClick : true,//plugin will disable click
        noClickTime : 1000//time while click is disabled
    }
};
$('some_selector').on('tap', TAP_CONFIG, function () {/*your code here*/});

```

Example page for device testing: http://jsbin.com/behaqa/

QR code off example page:

![QR code off example page](http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=http%3A%2F%2Fjsbin.com%2Fbehaqa%2F&qzone=1&margin=0&size=200x200&ecc=L)

One more example for tests: http://jsbin.com/zuzeje/

![QR code off example page](http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=http%3A%2F%2Fjsbin.com%2Fzuzeje%2F&qzone=1&margin=0&size=200x200&ecc=L)
