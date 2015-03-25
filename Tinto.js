(function(document, window){  
  // Constant for the destination in blend mode.
  var kBlendModeDestinationIn = "destination-in";
  
  // Constructor.
  var Tinto = function(source, requestFinishedHandler){
    // If using a string, create a request.
    if (typeof source == 'string') {
      this.setSourceImageWithURL(source, requestFinishedHandler);
    }
    // Use the element directly.
    else {
      this.sourceImage = source;
    }
  }
  
  // Sets the source image from an URL.
  Tinto.prototype.setSourceImageWithURL = function(URL, handler){
    var task = new Image();
    var self = this;
    
    var taskHandler = function(){
      self.sourceImage = task;
      
      if (handler) {
        handler();
      }
    };
    
    task.onload = taskHandler;
    task.onerror = taskHandler;
    task.onabort = taskHandler;
    
    task.src = URL;
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
       buffer.width = src.width;
       buffer.height = src.height;
       
       this._buffer = buffer;
    }
    
    return buffer;
  };
  
  window.Tinto = Tinto;
  
})(document, window, undefined);
