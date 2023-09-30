# QR Codes

There is a [Barcode Detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API), however it's not supported on firefox and is only partially supported in all browsers, so can't be relied upon.<br>
[`html5-qrcode`](https://github.com/mebjas/html5-qrcode) seems to be a maintained package, but doesn't seem to allow "pure" QR code reading from a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) or something similar not bound to DOM.<br>
But it does look like it allows to work without a built-in UI, therefore will be used as a base.
