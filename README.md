# 🎯 Math Board v2.0

A modern, feature-rich digital whiteboard designed specifically for mathematical education and drawing. Built with the latest web technologies and enhanced with 2025 standards.

![Math Board Preview](./math-board-ui.png)

## ✨ Features

### 🎨 Drawing Tools
- **Free Drawing**: Natural pen/pencil drawing experience
- **Geometric Shapes**: Lines, rectangles, and circles with real-time preview
- **Color Palette**: 8 carefully selected colors including eraser (white)
- **Brush Size Control**: Adjustable brush thickness (1-20px)
- **Grid Overlay**: Toggle-able grid for precise drawings

### 📱 Modern Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic theme switching based on system preference
- **Accessibility**: Full keyboard navigation and screen reader support
- **Touch Optimized**: Enhanced touch gestures for mobile devices

### 🔧 Advanced Features
- **Undo/Redo**: Full history management with 50-step memory
- **Auto-Save**: Export drawings as PNG files with timestamps
- **Keyboard Shortcuts**: Speed up your workflow
- **Real-time Preview**: See shapes before committing them
- **Performance Optimized**: Smooth drawing even on lower-end devices

### 🎓 Math-Specific Tools
- **Grid System**: Perfect for graphing and geometric constructions
- **Precise Shapes**: Ideal for mathematical diagrams
- **Clean Interface**: Distraction-free environment for learning

## 🚀 Quick Start

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/septicwolf818/math-board.git
   cd math-board
   ```

2. Start a local server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using Node.js
   npx serve .
   
   # Or using PHP
   php -S localhost:8000
   ```

3. Open your browser and navigate to `http://localhost:8000`

### Direct Usage
Simply open `index.html` in any modern web browser. No build process required!

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `D` | Switch to Draw mode |
| `L` | Switch to Line mode |
| `R` | Switch to Rectangle mode |
| `C` | Switch to Circle mode |
| `G` | Toggle Grid |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+S` | Save drawing |
| `Ctrl+C` | Clear canvas |

## 🎨 Drawing Modes

### Free Draw Mode
- Click and drag to draw freely
- Perfect for handwritten notes and sketches
- Adjustable brush size and color

### Shape Modes
1. **Line Tool**: Click two points to draw a straight line
2. **Rectangle Tool**: Click two corners to create a rectangle
3. **Circle Tool**: Click center and edge to create a circle

All shapes support real-time preview before committing.

## 🛠️ Technical Details

### Built With
- **p5.js v2.0.5**: Latest version for optimal performance
- **Modern JavaScript (ES6+)**: Classes, arrow functions, modules
- **CSS Grid & Flexbox**: Responsive layout system
- **CSS Custom Properties**: Dynamic theming support
- **Web Standards**: Semantic HTML5, ARIA accessibility

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Features
- **Graphics Layers**: Separate drawing and preview layers prevent artifacts
- **Memory Management**: Limited undo history prevents memory leaks
- **Touch Optimization**: Proper touch event handling for mobile
- **Responsive Canvas**: Automatic resizing on window changes

## 🔧 Architecture

The application follows modern web development practices:

```
📁 Project Structure
├── index.html          # Main HTML with semantic structure
├── sketch.js           # Main application logic (ES6 classes)
├── p5.js              # Graphics library (latest version)
├── p5.min.js          # Minified version for production
└── addons/
    ├── p5.sound.js    # Audio capabilities (future use)
    └── p5.sound.min.js
```

### Key Classes
- **MathBoard**: Main application class handling all functionality
- **Graphics Layers**: Separate layers for drawing and previews
- **Event Handling**: Modern event listeners with proper touch support

## 🎯 Use Cases

### Education
- **Mathematics**: Graph plotting, geometric constructions
- **Physics**: Diagram drawing, problem solving
- **General Teaching**: Interactive presentations

### Professional
- **Brainstorming**: Quick idea sketching
- **Presentations**: Live drawing during meetings
- **Design**: Rough mockups and wireframes

### Personal
- **Note Taking**: Digital handwritten notes
- **Art**: Creative drawing and sketching
- **Planning**: Visual project planning

## 🔒 Privacy & Security

- **No Data Collection**: Everything stays on your device
- **Local Storage**: No cloud dependencies
- **Offline Capable**: Works without internet connection
- **No Tracking**: Completely private usage

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ES6+ standards
- Maintain accessibility features
- Test on multiple devices
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rafał Widło**
- GitHub: [@septicwolf818](https://github.com/septicwolf818)
- Email: [Your Email]

## 🔄 Version History

### v2.0.0 (2025)
- Complete rewrite with modern technologies
- Enhanced user interface and accessibility
- Mobile-first responsive design
- Advanced drawing features and tools
- Performance optimizations

### v1.0.0 (2020)
- Initial release
- Basic drawing functionality
- Simple color selection

## 🚧 Roadmap

Future enhancements planned:
- [ ] Text tool for annotations
- [ ] Mathematical equation editor
- [ ] Cloud sync capabilities
- [ ] Collaborative drawing
- [ ] More geometric shapes
- [ ] Layer management
- [ ] Custom brush patterns

## 💡 Inspiration

This project was created to provide educators and students with a powerful, accessible digital whiteboard that doesn't compromise on performance or usability. Built with modern web standards to ensure longevity and compatibility.

---

**Made with ❤️ for education and creativity**
