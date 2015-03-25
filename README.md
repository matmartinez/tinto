![Tinto](Tinto.png)

# Tinto
Apply tint color to web images, on the fly.

# Usage
First, create a Tinto object using an image **template**. Usually this is a DOM element in your interface. Then finally *(yes, there isn't much else to it)*, use this object to generate tinted images as you need them.

In the following example an `<img>` is tinted. The image element itself can be used as a template:

```js
var target = document.getElementById('img-ui-element');
var tintoObject = new Tinto(target);
target.src = tintoObject.imageDataWithTintColor('#FF404C');
```

A template image can also be an **URL**. This is particullary useful when dealing with server images in a data model, for example. The image is tinted from a completion callback passed with the URL.

```js
var imageURL = 'http://example.foo/image.png';
var tintoObject = new Tinto(imageURL, function(){
	var imageData = tintoObject.imageDataWithTintColor('#FF404C');
	// ...use imageData accordingly on your interface.
});
```
# Reference
Most of your common needs should be poined in the previous examples. Tinto offers some additional options as well.

##  Constructor
- **Tinto(template, requestFinishedHandler?)**.
Creates a new Tinto object instance with the given `template`, which is typically an `<img>` element. If an image's URL is given as `template`, the `requestFinishedHandler` function will be executed when the image download is finished.

## Methods
- **.isImageLoaded()**.
Returns `true` if the template image is loaded an can be drawn. If not, returns `false`.

- **.imageDataWithTintColor(color)**.
Returns a `String` with the data of the tinted image. Examples of the `color` parameter are `"#f2f2f2"`, `"rgba(255, 255, 255, 1)"`, and `"red"`.

- **.imageDataWithOptions(options)**.
Returns a `String` with the data of the tinted image. The `options` dictionary should contain a color value with the `"tintColor"` key. Optionally, you can provide a special blending mode with the `"blendingMode"` key.

- **.imageWithTintColor(color)**.
Returns a `Image` object corresponding to the tinted image.

# How it works
Tinto simply uses the *destination in* blend mode from `<canvas>` to tint the solid portions of your template images. 

If you're trying to achieve a different effect, it's possible to apply a different blending mode before drawing. This can be done specifying the `blendingMode` option in `.imageDataWithOptions()`.



