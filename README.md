# Interactive Portfolio

A unique, interactive portfolio website built with React and Unity that showcases professional experience through an engaging 2D game experience alongside a traditional portfolio format.

## 🎮 Features

### Interactive Game Experience
- **Unity 2D Game Integration**: Explore the portfolio through an interactive game (desktop only)
- **Quest-Based Navigation**: Complete objectives to discover different sections of the portfolio
- **Game Controls**: WASD/Arrow keys for movement, F key for interaction, Shift for sprint
- **Responsive Design**: Automatically adapts to screen size (game available on desktop, traditional portfolio on mobile)

### Traditional Portfolio Sections
- **About**: Personal introduction and background
- **Education**: Academic qualifications and achievements
- **Experience**: Professional work history
- **Skills**: Technical competencies and tools
- **Projects**: Showcase of development work
- **Contact**: Professional contact information

### Technical Features
- **Smooth Scrolling Navigation**: Seamless transitions between sections
- **Mobile-Responsive Design**: Optimized for all screen sizes
- **Unity WebGL Integration**: Embedded game experience with fallback options
- **Progressive Enhancement**: Graceful degradation when Unity content fails to load

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Game Engine**: Unity (WebGL build)
- **Styling**: CSS3 with custom responsive design
- **Build Tool**: React Scripts
- **Testing**: Jest, React Testing Library

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Interactive-Portfolio.git
cd Interactive-Portfolio
```

2. Navigate to the React app:
```bash
cd portfolio-react
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
Interactive-Portfolio/
├── portfolio-react/
│   ├── public/
│   │   ├── unity-build/          # Unity WebGL build files
│   │   ├── unity-template/       # Unity UI templates
│   │   └── assets/               # Images and media
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Header.tsx        # Navigation header
│   │   │   ├── UnityGame.tsx     # Unity game integration
│   │   │   ├── About.tsx         # About section
│   │   │   ├── Education.tsx     # Education section
│   │   │   ├── Experience.tsx    # Experience section
│   │   │   ├── Skills.tsx        # Skills section
│   │   │   ├── Projects.tsx      # Projects section
│   │   │   └── Contact.tsx       # Contact section
│   │   ├── App.tsx               # Main app component
│   │   └── index.tsx             # Entry point
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🎯 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🎮 Game Experience

The interactive game experience is designed for desktop users and includes:

### Game Controls
- **Movement**: WASD keys or Arrow keys
- **Interaction**: F key to interact with objects and NPCs
- **Sprint**: Hold Shift while moving for faster movement

### Game Objectives
- Take the train to the Hall of Portfolio
- Visit the Education Wing to learn about academic background
- Explore the Project Gallery to see featured work
- Check the Skills Laboratory for technical demonstrations
- Collect achievement badges in each section
- Find hidden Easter eggs throughout the portfolio
- Complete the portfolio tour for a special reward

## 📱 Responsive Design

The portfolio automatically adapts to different screen sizes:
- **Desktop (≥1024px)**: Full interactive game experience + traditional portfolio
- **Mobile/Tablet (<1024px)**: Traditional portfolio sections only

## 🔧 Unity Integration

The Unity game is integrated using WebGL builds with:
- Custom loader implementation
- Progress tracking during game loading
- Error handling and fallback UI
- Timeout protection (15-second loading limit)

## 🎨 Customization

To customize the portfolio:

1. **Personal Information**: Update the content in each component file
2. **Styling**: Modify the corresponding CSS files for each component
3. **Unity Game**: Replace the Unity build files in `public/unity-build/`
4. **Assets**: Add your images and media to the `public/` directory

## 🌐 Deployment

For production deployment:

1. Build the project:
```bash
npm run build
```

2. Deploy the `build/` directory to your preferred hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Jai Li**

## 🙏 Acknowledgments

- Unity Technologies for the game engine
- React team for the excellent framework
- Create React App for the development setup
- All the open-source contributors who made this project possible

---

*Built with ❤️ using React & Unity*
