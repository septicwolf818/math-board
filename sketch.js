// Math Board - Modern Digital Whiteboard

class MathBoard {
  constructor() {
    this.mode = 'draw';
    this.currentColor = '#000000';
    this.brushSize = 3;
    this.isDrawing = false;
    this.showGrid = false;
    this.isEraserMode = false;
    
    // Browser detection for compatibility fixes
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    // History management
    this.history = [];
    this.historyStep = -1;
    
    // Drawing state
    this.lastPoint = { x: -1, y: -1 };
    this.tempShapeStart = { x: -1, y: -1 };
    this.isSelectingSecondPoint = false;
    
    // Canvas references
    this.mainCanvas = null;
    this.drawingLayer = null;
    this.previewLayer = null;
    
    // Store resize handler for cleanup
    this.resizeHandler = null;
    
    // Canvas bounds for precision
    this.canvasBounds = { width: 0, height: 0 };
    
    this.init();
  }

  init() {
    // Create single canvas with proper layering
    new p5((sketch) => {
      let drawingLayer;
      let previewLayer;
      
      sketch.setup = () => {
        
        // Create the main canvas with proper integer dimensions
        const canvasWidth = Math.floor(sketch.windowWidth);
        // Calculate canvas height based on available space minus controls height
        const controlsElement = document.getElementById('controls');
        const controlsHeight = controlsElement ? controlsElement.offsetHeight : 120;
        const canvasHeight = Math.floor(sketch.windowHeight - controlsHeight);
        const canvas = sketch.createCanvas(canvasWidth, canvasHeight);
        canvas.parent('drawing-canvas');
        
        // Browser-specific optimizations
        sketch.pixelDensity(1);
        
        if (this.isChrome) {
          canvas.elt.style.imageRendering = 'auto';
          canvas.elt.style.willChange = 'contents';
        } else {
          canvas.elt.style.imageRendering = 'pixelated';
        }
        
        canvas.elt.style.touchAction = 'none';
        
        // Prevent context menu on right-click
        canvas.elt.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Store canvas bounds
        this.canvasBounds = { 
          width: canvasWidth, 
          height: canvasHeight 
        };
        
        // Create graphics layers
        drawingLayer = sketch.createGraphics(canvasWidth, canvasHeight);
        previewLayer = sketch.createGraphics(canvasWidth, canvasHeight);
        
        // Initialize drawing layer
        this.initializeLayer(drawingLayer);
        
        // Store references
        this.mainCanvas = sketch;
        this.drawingLayer = drawingLayer;
        this.previewLayer = previewLayer;
        
        this.saveState();
      };

      sketch.draw = () => {
        // Clear main canvas
        sketch.background(255);
        
        // Draw the main drawing layer
        sketch.image(drawingLayer, 0, 0);
        
        // Grid overlay
        if (this.showGrid) {
          this.drawGrid(sketch);
        }
        
        // Draw preview layer on top
        if (this.isSelectingSecondPoint && this.mode !== 'draw' && this.mode !== 'eraser') {
          previewLayer.clear();
          this.drawPreviewShape(previewLayer, sketch);
          sketch.image(previewLayer, 0, 0);
        }
      };

      // Handle window resize
      const handleWindowResize = function() {
        const newCanvasWidth = window.innerWidth;
        // Get actual controls height dynamically
        const controlsElement = document.getElementById('controls');
        const controlsHeight = controlsElement ? controlsElement.offsetHeight : 120;
        const newCanvasHeight = window.innerHeight - controlsHeight;
        
        // Update canvas bounds
        this.canvasBounds = { 
          width: newCanvasWidth, 
          height: newCanvasHeight 
        };
        
        // Resize main canvas
        sketch.resizeCanvas(newCanvasWidth, newCanvasHeight);
        
        const mathBoardInstance = this;
        
        // Recreate graphics layers
        const oldDrawing = drawingLayer.get();
        drawingLayer = sketch.createGraphics(newCanvasWidth, newCanvasHeight);
        
        mathBoardInstance.initializeLayer(drawingLayer);
        drawingLayer.image(oldDrawing, 0, 0);
        
        previewLayer = sketch.createGraphics(newCanvasWidth, newCanvasHeight);
        
        mathBoardInstance.drawingLayer = drawingLayer;
        mathBoardInstance.previewLayer = previewLayer;
      }.bind(this);
      
      // Store handler reference
      this.resizeHandler = handleWindowResize;
      
      window.addEventListener('resize', handleWindowResize);

      sketch.mousePressed = function() { 
        return this.handleMousePressed(sketch); 
      }.bind(this);
      sketch.mouseDragged = function() { 
        return this.handleMouseDragged(sketch); 
      }.bind(this);
      sketch.mouseReleased = function() { 
        return this.handleMouseReleased(sketch); 
      }.bind(this);
      sketch.mouseClicked = function() { 
        return this.handleMouseClicked(sketch); 
      }.bind(this);

      sketch.mouseMoved = function() {
        return false;
      }.bind(this);

      // Touch events for mobile
      sketch.touchStarted = function() { 
        this.handleMousePressed(sketch);
        return false;
      }.bind(this);
      sketch.touchMoved = function() {
        this.handleMouseDragged(sketch);
        return false;
      }.bind(this);
      sketch.touchEnded = function() {
        this.handleMouseReleased(sketch);
        return false;
      }.bind(this);
    });

    this.setupEventListeners();
  }

  // Helper method to initialize layers
  initializeLayer(layer) {
    layer.pixelDensity(1);
    layer.background(255, 255, 255, 255);
    layer.stroke(this.currentColor);
    layer.strokeWeight(this.brushSize);
    layer.noFill();
    layer.strokeCap(layer.ROUND);
    layer.strokeJoin(layer.ROUND);
    
    if (layer.canvas) {
      layer.canvas.style.imageRendering = 'auto';
      layer.canvas.style.touchAction = 'none';
    }
  }

    getClampedX(sketch) {
    return Math.max(0, Math.min(sketch.width - 1, sketch.mouseX));
  }

  getClampedY(sketch) {
    return Math.max(0, Math.min(sketch.height - 1, sketch.mouseY));
  }

  clampPoint(x, y) {
    return {
      x: Math.max(0, Math.min(Math.round(x), Math.floor(this.canvasBounds.width) - 1)),
      y: Math.max(0, Math.min(Math.round(y), Math.floor(this.canvasBounds.height) - 1))
    };
  }

  setupEventListeners() {
    // Brush size control
    const brushSizeSlider = document.getElementById('brush-size');
    const sizeDisplay = document.getElementById('size-display');
    
    brushSizeSlider?.addEventListener('input', (e) => {
      this.brushSize = parseInt(e.target.value);
      sizeDisplay.textContent = `${this.brushSize}px`;
      this.updateCanvasSettings();
    });

    // Custom color picker
    const colorPicker = document.getElementById('custom-color-picker');
    
    colorPicker?.addEventListener('change', (e) => {
      this.useCustomColor(e.target);
    });

    colorPicker?.addEventListener('input', (e) => {
      this.useCustomColor(e.target);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              this.redo();
            } else {
              this.undo();
            }
            break;
          case 'y':
            e.preventDefault();
            this.redo();
            break;
          case 's':
            e.preventDefault();
            this.save();
            break;
          case 'c':
            e.preventDefault();
            this.clearCanvas();
            break;
        }
      } else {
        switch (e.key.toLowerCase()) {
          case 'd':
            this.changeMode('draw', 0);
            break;
          case 'e':
            this.changeMode('eraser', 1);
            break;
          case 'l':
            this.changeMode('line', 2);
            break;
          case 'r':
            this.changeMode('rectangle', 3);
            break;
          case 'c':
            this.changeMode('circle', 4);
            break;
          case 'g':
            this.toggleGrid();
            break;
        }
      }
    });
  }

  handleMousePressed(sketch) {
    console.log('mousePressed, button:', sketch.mouseButton, 'isInCanvas:', this.isInCanvas(sketch));
    if (!this.isInCanvas(sketch)) return;

    if (sketch.mouseButton.right) {
      console.log('Right click detected, isSelectingSecondPoint:', this.isSelectingSecondPoint, 'mode:', this.mode);
      if (this.isSelectingSecondPoint && (this.mode === 'line' || this.mode === 'rectangle' || this.mode === 'circle')) {
        this.isSelectingSecondPoint = false;
        this.tempShapeStart = { x: -1, y: -1 };
        this.previewLayer.clear();
        console.log('Shape preview cancelled');
      }
      return;
    }

    if (this.mode === 'draw' || this.mode === 'eraser') {
      this.isDrawing = true;
      
      this.lastPoint = { 
        x: this.getClampedX(sketch), 
        y: this.getClampedY(sketch) 
      };
      
      this.prepareDrawingLayer();
    }
  }

  handleMouseDragged(sketch) {
    if (!this.isInCanvas(sketch)) return;

    if ((this.mode === 'draw' || this.mode === 'eraser') && this.isDrawing) {
      const currentX = this.getClampedX(sketch);
      const currentY = this.getClampedY(sketch);
      
      if (this.lastPoint.x !== -1 && this.lastPoint.y !== -1 && 
          (currentX !== this.lastPoint.x || currentY !== this.lastPoint.y)) {
        
        if (this.isChrome) {
          this.drawingLayer.push();
          this.drawingLayer.line(this.lastPoint.x, this.lastPoint.y, currentX, currentY);
          this.drawingLayer.pop();
        } else {
          this.drawingLayer.line(this.lastPoint.x, this.lastPoint.y, currentX, currentY);
        }
      }
      
      this.lastPoint = { x: currentX, y: currentY };
    }
  }

  handleMouseReleased(sketch) {
    if ((this.mode === 'draw' || this.mode === 'eraser') && this.isDrawing) {
      const currentX = this.getClampedX(sketch);
      const currentY = this.getClampedY(sketch);
      
      // For single clicks (no drag), draw a simple dot
      if (this.lastPoint.x === currentX && this.lastPoint.y === currentY) {
        this.drawingLayer.push();
        this.drawingLayer.noStroke();
        this.drawingLayer.fill(this.mode === 'eraser' ? 255 : this.currentColor);
        
        const radius = Math.max(1, this.brushSize / 2);
        const diameter = radius * 2;
        this.drawingLayer.ellipse(currentX, currentY, diameter, diameter);
        
        this.drawingLayer.pop();
      }
      
      // Reset drawing state
      this.isDrawing = false;
      this.lastPoint = { x: -1, y: -1 };
      this.saveState();
    }
  }

  handleMouseClicked(sketch) {
    if (!this.isInCanvas(sketch)) return;

    // Handle shape tools (line, rectangle, circle)
    if (this.mode === 'line' || this.mode === 'rectangle' || this.mode === 'circle') {
      const clickX = this.getClampedX(sketch);
      const clickY = this.getClampedY(sketch);
      
      if (!this.isSelectingSecondPoint) {
        // First click - start shape selection
        this.isSelectingSecondPoint = true;
        this.tempShapeStart = { x: clickX, y: clickY };
      } else {
        // Second click - complete shape
        this.drawShape(this.drawingLayer, this.tempShapeStart.x, this.tempShapeStart.y, clickX, clickY);
        this.isSelectingSecondPoint = false;
        this.tempShapeStart = { x: -1, y: -1 };
        this.saveState();
      }
    }
    
    return false; // Prevent default browser behavior
  }

  startShape(sketch, x, y) {
    this.tempShapeStart = { x, y };
    this.addToHistory();
  }

  drawPreviewShape(layer, sketch) {
    // Don't draw if we don't have a start point or if layer is not ready
    if (!layer || this.tempShapeStart.x === -1 || this.tempShapeStart.y === -1) {
      return;
    }

    const previewX = this.getClampedX(sketch);
    const previewY = this.getClampedY(sketch);
    
    // Ensure we have valid coordinates
    if (isNaN(previewX) || isNaN(previewY)) {
      return;
    }
    
    layer.clear();
    layer.stroke('rgba(100,100,100,0.7)');
    layer.strokeWeight(this.brushSize);
    layer.noFill();
    layer.strokeCap(layer.ROUND);
    layer.strokeJoin(layer.ROUND);

    switch (this.mode) {
      case 'line':
        layer.push();
        layer.noStroke();
        layer.fill(255, 0, 0, 150);
        layer.ellipse(this.tempShapeStart.x, this.tempShapeStart.y, 6, 6);
        layer.fill(0, 255, 0, 150);
        layer.ellipse(previewX, previewY, 6, 6);
        layer.pop();
        
        layer.line(this.tempShapeStart.x, this.tempShapeStart.y, previewX, previewY);
        break;
        
      case 'rectangle':
        const rectX = Math.min(this.tempShapeStart.x, previewX);
        const rectY = Math.min(this.tempShapeStart.y, previewY);
        const rectWidth = Math.abs(previewX - this.tempShapeStart.x);
        const rectHeight = Math.abs(previewY - this.tempShapeStart.y);
        
        layer.push();
        layer.noStroke();
        layer.fill(255, 0, 0, 150);
        layer.ellipse(this.tempShapeStart.x, this.tempShapeStart.y, 6, 6);
        layer.fill(0, 255, 0, 150);
        layer.ellipse(previewX, previewY, 6, 6);
        layer.pop();
        
        if (rectWidth > 0 && rectHeight > 0) {
          layer.rectMode(layer.CORNER);
          layer.rect(rectX, rectY, rectWidth, rectHeight);
        }
        break;
        
      case 'circle':
        const deltaX = previewX - this.tempShapeStart.x;
        const deltaY = previewY - this.tempShapeStart.y;
        const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        layer.push();
        layer.noStroke();
        layer.fill(255, 0, 0, 150);
        layer.ellipse(this.tempShapeStart.x, this.tempShapeStart.y, 6, 6);
        layer.fill(0, 255, 0, 150);
        layer.ellipse(previewX, previewY, 6, 6);
        layer.pop();
        
        if (radius > 0) {
          layer.ellipse(this.tempShapeStart.x, this.tempShapeStart.y, radius * 2);
        }
        break;
    }
  }

  drawShape(layer, x1, y1, x2, y2) {
    if (!layer) return;
    
    this.prepareDrawingLayer();
    
    switch (this.mode) {
      case 'line':
        layer.line(x1, y1, x2, y2);
        break;
        
      case 'rectangle':
        const rectX = Math.min(x1, x2);
        const rectY = Math.min(y1, y2);
        const rectWidth = Math.abs(x2 - x1);
        const rectHeight = Math.abs(y2 - y1);
        
        if (rectWidth > 0 && rectHeight > 0) {
          layer.push();
          layer.rectMode(layer.CORNER);
          layer.rect(rectX, rectY, rectWidth, rectHeight);
          layer.pop();
        }
        break;
        
      case 'circle':
        // Use natural radius calculation
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (radius > 0) {
          layer.ellipse(x1, y1, radius * 2);
        }
        break;
    }
  }

  // Helper method to prepare drawing layer with current settings
  prepareDrawingLayer() {
    if (!this.drawingLayer) return;
    
    if (this.mode === 'eraser') {
      this.drawingLayer.strokeWeight(this.brushSize * 2);
      this.drawingLayer.blendMode(this.mainCanvas.REMOVE);
      this.drawingLayer.stroke(255);
    } else {
      this.drawingLayer.strokeWeight(this.brushSize);
      this.drawingLayer.blendMode(this.mainCanvas.BLEND);
      this.drawingLayer.stroke(this.currentColor);
    }
    
    this.drawingLayer.noFill();
    this.drawingLayer.strokeCap(this.mainCanvas.ROUND);
    this.drawingLayer.strokeJoin(this.mainCanvas.ROUND);
    
    // Chrome-specific rendering optimizations
    if (this.isChrome && this.drawingLayer.drawingContext) {
      // Enable hardware acceleration for Chrome
      this.drawingLayer.drawingContext.imageSmoothingEnabled = true;
      this.drawingLayer.drawingContext.imageSmoothingQuality = 'high';
    }
  }

  drawGrid(sketch) {
    sketch.push();
    sketch.stroke(200);
    sketch.strokeWeight(0.5);
    
    const gridSize = 20; // Grid size
    
    const canvasWidth = sketch.width;
    const canvasHeight = sketch.height;
    
    for (let x = 0; x < canvasWidth; x += gridSize) {
      sketch.line(x, 0, x, canvasHeight);
    }
    
    for (let y = 0; y < canvasHeight; y += gridSize) {
      sketch.line(0, y, canvasWidth, y);
    }
    
    sketch.pop();
  }

  isInCanvas(sketch) {
    return sketch.mouseX >= 0 && 
           sketch.mouseX < sketch.width && 
           sketch.mouseY >= 0 && 
           sketch.mouseY < sketch.height;
  }

  updateCanvasSettings() {
    if (this.drawingLayer) {
      this.drawingLayer.stroke(this.currentColor);
      this.drawingLayer.strokeWeight(this.brushSize);
      this.drawingLayer.noFill();
      this.drawingLayer.strokeCap(this.drawingLayer.ROUND);
      this.drawingLayer.strokeJoin(this.drawingLayer.ROUND);
    }
  }

  changeMode(newMode, buttonIndex) {
    this.mode = newMode;
    
    // Reset shape selection state when changing modes
    this.isSelectingSecondPoint = false;
    this.tempShapeStart = { x: -1, y: -1 };
    
    // Clear preview layer when changing modes
    if (this.previewLayer) {
      this.previewLayer.clear();
    }
    
    // Update cursor for eraser mode
    const body = document.body;
    if (newMode === 'eraser') {
      body.classList.add('eraser-mode');
    } else {
      body.classList.remove('eraser-mode');
    }
    
    // Update UI - use new CSS class
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tool-btn')[buttonIndex]?.classList.add('active');
  }

  changeColor(colorElement) {
    this.currentColor = colorElement.dataset.color;
    
    // Switch to draw mode when selecting a color (exit eraser mode)
    if (this.mode === 'eraser') {
      this.changeMode('draw', 0);
    }
    
    this.updateCanvasSettings();
    
    // Update UI
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    colorElement.classList.add('active');
  }

  useCustomColor(colorElement) {
    this.currentColor = colorElement.value;
    
    // Switch to draw mode when selecting a color (exit eraser mode)
    if (this.mode === 'eraser') {
      this.changeMode('draw', 0);
    }
    
    this.updateCanvasSettings();
    
    // Update UI
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    colorElement.classList.add('active');
  }

  clearCanvas() {
    if (this.drawingLayer) {
      this.drawingLayer.background(255);
      this.saveState();
    }
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
    const gridBtn = document.getElementById('grid-btn');
    if (gridBtn) {
      gridBtn.style.background = this.showGrid ? 'var(--active-color)' : 'var(--button-bg)';
    }
  }

  saveState() {
    if (!this.drawingLayer) return;
    
    this.historyStep++;
    if (this.historyStep < this.history.length) {
      this.history.length = this.historyStep;
    }
    
    // Save canvas state as image data
    this.history.push(this.drawingLayer.get());
    
    // Limit history to prevent memory issues
    if (this.history.length > 50) {
      this.history.shift();
      this.historyStep--;
    }
  }

  undo() {
    if (this.historyStep > 0) {
      this.historyStep--;
      this.restoreState();
    }
  }

  redo() {
    if (this.historyStep < this.history.length - 1) {
      this.historyStep++;
      this.restoreState();
    }
  }

  restoreState() {
    if (this.historyStep >= 0 && this.historyStep < this.history.length && this.drawingLayer) {
      this.drawingLayer.background(255);
      this.drawingLayer.image(this.history[this.historyStep], 0, 0);
    }
  }

  save() {
    if (this.mainCanvas && this.drawingLayer) {
      // Create a clean save canvas
      this.mainCanvas.background(255);
      this.mainCanvas.image(this.drawingLayer, 0, 0);
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      this.mainCanvas.save(`math-board-${timestamp}.png`);
    } else {
      console.error('Cannot save: canvas not initialized');
    }
  }

  // Cleanup method for removing event listeners
  destroy() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
  }
}

// Initialize the application when DOM is loaded
let mathBoard;

window.addEventListener('load', () => {
  mathBoard = new MathBoard();
  
  // Make it globally accessible for HTML onclick handlers
  window.mathBoard = mathBoard;
});