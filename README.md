jQueryTap
=========

This is a jQuery plugin which creates a click alternative tap event for touch enabled browsers.
If touch is disabled tap event just become a click event.

Works fine for: Android 2+ stock browser, Android Chrome, Android Firefox, Android Opera, Opera Mini, iOS Safari, IE Mobile 10+

This event is needed to prevent 300ms delay between touchend event and click events.

This plugin works everywhere where jQuery 1.7+ works. This plugin created using jQuery Special Events API and works like any other event in jQuery:

```
$('some_selector').on('tap', function () {/*your code here*/});
$('some_selector').off('tap');
$('some_selector').one('tap', function () {/*your code here*/});
```
You can use all enabled event methods: on/off, bind/unbind, delegate/undelegate.

Note! This plugin don't prevent click:

```
$('any_link').on('tap', function() {
  //let's open link in new window and use window.parent in it
  window.open(this.href);
}).on('click', function () {
  //this will fire and the page will load link
});
```

If you want to prevent click, use noclick namespace:

```
$('any_link').on('tap.noclick', function() {
  //let's open link in new window and use window.parent in it
  window.open(this.href);
}).on('click', function () {
  //this will never fire
});
```

Also tap event do not fire for desktop browsers, because Microsoft, Lenovo notebooks and other have touch/pointer events. See source code for understanding how it works.

Example page for device testing: http://jsbin.com/behaqa/

QR code of example page:

![QR code off example page](http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=http%3A%2F%2Fjsbin.com%2Fbehaqa%2F&qzone=1&margin=0&size=200x200&ecc=L)

One more example for tests: http://jsbin.com/zuzeje/

![QR code off example page](http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=http%3A%2F%2Fjsbin.com%2Fzuzeje%2F&qzone=1&margin=0&size=200x200&ecc=L)
