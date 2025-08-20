# GSAP Animation Project

A modern Next.js project showcasing the power of GSAP (GreenSock Animation Platform) with TypeScript, Tailwind CSS, and scroll-triggered animations.

🌐 **Live Demo**: https://smithinator100.github.io/particles/

## Features

- 🚀 **Smooth Animations**: 60fps animations using GSAP
- 📜 **Scroll Triggers**: Animations triggered by scroll position
- 🌟 **Parallax Effects**: Beautiful depth and movement
- 🎨 **Modern UI**: Built with Tailwind CSS and beautiful gradients
- ⚡ **TypeScript**: Full type safety and better developer experience
- 📱 **Responsive**: Mobile-first design approach

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [GSAP](https://greensock.com/gsap/) - Animation library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main demo page with GSAP animations
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── animated-text.tsx # Reusable animated text component
│   └── morphing-shape.tsx # SVG morphing animation component
```

## Key GSAP Features Demonstrated

### 1. Basic Animations
- Fade in/out effects
- Scale and rotation animations
- Position transitions

### 2. Timeline Animations
- Sequenced animations
- Staggered effects
- Looping animations

### 3. Scroll Triggers
- Animations triggered by scroll position
- Parallax scrolling effects
- Progressive animations

### 4. Interactive Animations
- Hover effects
- Mouse-driven animations
- State-based transitions

## Components

### AnimatedText
Animates text characters individually with customizable timing and effects.

```tsx
import { AnimatedText } from '@/components/animated-text'

<AnimatedText 
  text="Hello World" 
  className="text-4xl font-bold"
  triggerOnScroll={true}
  stagger={0.1}
/>
```

### MorphingShape
Creates SVG path morphing animations for dynamic shapes.

```tsx
import { MorphingShape } from '@/components/morphing-shape'

<MorphingShape 
  autoPlay={true}
  duration={2}
  className="w-24 h-24"
/>
```

## GSAP Plugins Used

- **ScrollTrigger**: For scroll-based animations
- **MorphSVG**: For SVG path morphing (premium plugin)

## Performance Tips

- Use `will-change: transform` for animated elements
- Prefer transform and opacity for smooth animations
- Use GSAP's `force3D: true` for hardware acceleration
- Optimize scroll triggers with proper start/end values

## Learning Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger Demos](https://codepen.io/collection/AKkZQo)
- [GSAP Learning Center](https://greensock.com/learning/)

## License

MIT License - feel free to use this project as a starting point for your own GSAP animations!
