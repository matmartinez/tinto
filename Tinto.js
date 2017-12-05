(function(document, window){  
  // Blend modes.
  var kBlendModeDestinationIn = "destination-in";
  var kBlendModeSourceOver = "source-over";
  
  // Constructor.
  // Takes a single image that should be ready to draw.
  // Note: Use the Tinto.fromURL factory function if you want to load images from the Interwebs.
  var Tinto = function(sourceImage){
    this.sourceImage = sourceImage;
    
    if (!this.isImageLoaded()) {
        console.warn("Tinto: The source image is not loaded yet, so it may not be displayed.");
    }
  }
  
  // Factory method will create a Tinto instance from an async request.
  Tinto.fromURL = function(url, handler){
    
    function TintoImageRequest(src, completionHandler){
      var image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = function(){
        completionHandler(image);
      };
      image.onerror = function(){
        completionHandler(undefined);
      };
      
      image.src = src;
      
      this.image = image;
    }
    
    TintoImageRequest.prototype.abort = function(){
      this.image.onload = null;
      this.image.onerror = null;
    };
    
    var operation = new TintoImageRequest(url, function(img){
      var tinto = undefined;
      if (img) {
        tinto = new Tinto(img);
      }
      
      if (handler) {
        handler(tinto);
      }
    });
    
    return operation;
  };
  
  // Returns true if the source image is loaded.
  Tinto.prototype.isImageLoaded = function(){
    var source = this.sourceImage;
    if (source) {
      return source.complete && typeof source.naturalWidth != 'undefined' && source.naturalWidth != 0;
    }
    return false;
  };
  
  // Creates image data with the specified options.
  Tinto.prototype.imageDataWithOptions = function(options){
    if (!this.isImageLoaded()){
      console.warn("Tinto: Cannot create result image. Source image is not available.");
      return null;
    }
    
    var sourceImage = this.sourceImage;
    var color = options.tintColor;
    var blendingMode = options.blendingMode ? options.blendingMode : kBlendModeDestinationIn;
    
    var buffer = this.getBuffer();
    var context = buffer.getContext("2d");
    var width = buffer.width;
    var height = buffer.height;
    
    // If we can't create a context, return the source image's src attribute.
    if (!buffer || !context) {
      return sourceImage.src;
    }
    
    // Clear the context.
    context.clearRect(0, 0, width, height);
    
    // Set the fill color.
    context.globalCompositeOperation = kBlendModeSourceOver;
    context.fillStyle = color;
    
    // Fill the context.
    context.fillRect(0, 0, width, height);
    
    // Draw image the specified blending mode.
    context.globalCompositeOperation = blendingMode;
    context.drawImage(sourceImage, 0, 0);
    
    // Finish operation if previous blending mode was not kBlendModeDestinationIn.
    if (blendingMode !== kBlendModeDestinationIn) {
      context.globalCompositeOperation = kBlendModeDestinationIn;
      context.drawImage(sourceImage, 0, 0);
    }
    
    // Return data in png format.
    var imageData = buffer.toDataURL("image/png");
    
    return imageData;
  }
  
  // Creates image data using the desired tint color.
  Tinto.prototype.imageDataWithTintColor = function(color){
    return this.imageDataWithOptions({ tintColor : color });
  };
  
  // Creates image object using the tint color.
  Tinto.prototype.imageWithTintColor = function(color){
    var image = new Image();
    image.src = this.imageDataWithOptions({ tintColor : color });
    return image;
  };
  
  // Used to obtain the canvas to perform drawing.
  Tinto.prototype.getBuffer = function(){
    var src = this.sourceImage;
    if (typeof src === 'undefined') {
      return null;
    }
    
    var buffer = this._buffer;
    if (!buffer) {
       buffer = document.createElement("canvas");
       
       if (typeof src.naturalWidth != 'undefined' && typeof src.naturalHeight != 'undefined') {
         buffer.width = src.naturalWidth;
         buffer.height = src.naturalHeight;
       } else {
         buffer.width = src.width;
         buffer.height = src.height;
       }
       
       this._buffer = buffer;
    }
    
    return buffer;
  };
  
  window.Tinto = Tinto;
  
})(document, window, undefined);
