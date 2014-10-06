responsiveImages.js
================

A responsive image vanilla JS library.

This library enables you to load the best image for the indicated screen size.

Users on mobile devices may require a different image to users on a desktop. No one wants to download a desktop image on a mobile. responsiveImages.js solves this by only downloading the image that is relevant to the user.

#Usage

To use responsiveImages.js - include it before the closing body tag of the page.

The plugin will execute automatically on all images on the page.

To use you need to add a data attribute to any images you want to make responsive.

###Example

```html
<img alt="ImageAlt" data-src="[<480://imageXSmall.jpg,<640://imageSmall.jpg,<960://imageMedium.jpg,<1024://image:arge.jpg,>1024://imageXLarge.jpg]"/>
```

The plugin works by looping over the attribute and then detects the screen width. When the screen width is less than 480px the first image is loaded. When between 480px and 640px the second image is loaded. The final image in the array is >1024 so this will load for all screen sizes over 1024px etc.

The plugin will fire on window resize and there is a throttler in place to aid with performance.

Enjoy!

## License

The code and the documentation are released under the [MIT License](LICENSE).
