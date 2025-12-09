# KoiKana Technical Guide 🌸

> **Version**: 1.0.0  
> **Framework**: React 18 + Vite  
> **Status**: Active Development

---

## 1. Executive Summary

**KoiKana** is an immersive, aesthetic Japanese learning application designed to teach Hiragana, Katakana, and basic Kanji through interactive gamification. Unlike traditional flashcard apps, KoiKana focuses on "emotional learning"—creating a calming, visually stunning environment (the "Zen Garden") that reduces study anxiety.

This document serves as a comprehensive technical manual for developers and contributors, explaining the architectural decisions, component hierarchy, and feature implementations that power the application.

---

## 2. Technology Stack

We selected a modern, lightweight, and performance-oriented stack to ensure a fluid user experience even on mobile devices.

| Technology | Purpose | Justification |
| :--- | :--- | :--- |
| **React 18** | UI Library | Component-based architecture allows for reusable UI elements (Cards, Modals) and efficient state management. |
| **Vite** | Build Tool | Extremely fast hot-reloading (HMR) and optimized production builds compared to Create React App. |
| **Tailwind CSS** | Styling | Utility-first CSS enables rapid UI development and easy implementation of responsive design and dark mode. |
| **Lucide React** | Iconography | Lightweight, consistent, and customizable SVG icons that fit the clean aesthetic. |
| **Canvas API** | Graphics | Used for the `WritingCanvas` and `ZenGarden` to handle high-performance drawing and particle effects without external heavy libraries. |
| **LocalStorage** | Persistence | A simple, client-side database solution for saving user progress (XP, Streak, Unlocks) without requiring a backend server. |

---

## 3. Project Architecture

The codebase is organized to promote separation of concerns and scalability.

```
src/
├── components/      # Reusable UI building blocks and Page views
│   ├── LandingPage.jsx   # Entry point, dashboard, and visual hook
│   ├── QuizPage.jsx      # Core game loop engine (Multiple modes)
│   ├── ShopPage.jsx      # Feature: Theme unlocking and preview
│   └── ...
├── context/         # Global State Management
│   └── ThemeContext.jsx  # Manages visual themes (colors, aesthetics)
├── hooks/           # Custom Logic Hooks
│   ├── useProgress.js    # Gamification & Persistence logic
│   └── useAudio.js       # Centralized audio manager
├── data/            # Static Data Assets
│   └── kanaData.js       # The "Database" of characters and mnemonics
└── assets/          # Images and Media
```

---

## 4. Key Feature Implementation

### 4.1. The Gamification Engine (`useProgress.js`)
This custom hook acts as the application's "brain". It centralizes all logic related to user progression.
- **SRS (Spaced Repetition System)**: Implements a Leitner-style algorithm. It tracks `nextReviewDate` for each character. Correct answers push the date further (1 day -> 3 days -> 7 days), ensuring efficient memory retention.
- **XP & Streak**: Calculates daily engagement. It checks `lastLoginDate` against current date to increment or reset streaks.

### 4.2. Interactive Writing Canvas (`WritingCanvas.jsx`)
A core feature allowing users to draw characters.
- **How it works**: Uses the HTML5 Canvas API. We maintain two canvases:
    1.  **User Canvas**: Where the user draws.
    2.  **Target Canvas**: An invisible canvas where the correct character is rendered.
- **Validation**: When the user clicks "Check", we compare pixel data between the two canvases. We calculate **Coverage** (how much of the target did you paint?) and **Precision** (did you stay inside the lines?).
- **Responsiveness**: Uses `ResizeObserver` to dynamically resize the canvas matrix on mobile vs desktop, ensuring the drawing resolution remains crisp.

### 4.3. Dynamic Theme System (`ThemeContext.jsx` & `ShopPage.jsx`)
KoiKana is customizable.
- **Context API**: `ThemeContext` provides the `currentTheme` object to the entire app tree.
- **Theming Strategy**: Themes are objects defining color tokens (e.g., `blob1`, `primary`, `bg`). Changing a theme instantly re-renders components with new styles.
- **Preview System**: The Shop includes a "Live Preview" panel. It calls `setPreviewThemeId` on hover, which momentarily swaps the styling of a dummy UI component to demonstrate the theme before purchase.

### 4.4. Quiz Engine (`QuizPage.jsx`)
A polymorphic component that handles multiple game modes:
1.  **Multiple Choice**: Standard 1-of-4 selection.
2.  **Writing Challenge**: Renders `WritingCanvas`.
3.  **Memory Match**: Renders `MemoryGame`, a grid-based card flipping game.
4.  **SRS Review**: A special mode that only fetches items from `useProgress` that are "due".

---

## 5. Design Philosophy: "Digital Zen"

The UI is built on three pillars:
1.  **Soft Geometrics**: We use rounded corners (`rounded-3xl`, `rounded-full`) and circular blobs to evoke organic softness, avoiding sharp, aggressive angles.
2.  **Glassmorphism**: High usage of `backdrop-blur-md` and semi-transparent white backgrounds (`bg-white/40`) to create depth and a modern, airy feel.
3.  **Micro-Interactions**: Every button press triggers a "pop" sound and a slight scale animation (`active:scale-95`). Hovers trigger glows. These small details make the app feel "alive".

---

## 6. How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Build for Production**:
    ```bash
    npm run build
    ```

---

*Documentation auto-generated by Antigravity AI.*
