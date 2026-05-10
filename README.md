# ♟️ Browser-Based Two-Player Chess Game

A fully functional, browser-based two-player chess game built with pure HTML, CSS, and JavaScript — no frameworks, no backend, no dependencies.


---

## Live Demo

Deployed on GitHub Pages: `https://falgunkishore.github.io/2-Player-Chess/`

---

## Features

- **Landing page** — Players enter their names and choose colors before the game starts
- **Full chess rules** — Valid move enforcement for all 6 piece types (pawn, rook, knight, bishop, queen, king)
- **Check detection** — King flashes red with a pulsing animation and a "⚠️ CHECK!" warning appears
- **Checkmate & Stalemate** — Game-over modal displays the result automatically
- **Valid move hints** — Green dots show all legal moves when a piece is selected
- **Two interaction modes** — Click-to-move and drag-and-drop
- **Captured pieces** — Displayed as icons below each player's name
- **Move history** — Full log of every move in the sidebar
- **Responsive layout** — Board and UI adapt to different screen sizes
- **Smooth transitions** — Fade animations between the landing page and game

---

## Project Structure

```
├── index.html        # Landing page (player setup)
├── chess.html        # Game page
├── script.js         # All chess logic (board, rules, check/checkmate, UI)
├── landing.js        # Landing page logic (name input, color selection, redirect)
├── style.css         # All styles (landing + game + animations)
└── pieces/           # SVG chess piece images
    ├── wp.svg        # White pawn
    ├── wr.svg        # White rook
    ├── wn.svg        # White knight
    ├── wb.svg        # White bishop
    ├── wq.svg        # White queen
    ├── wk.svg        # White king
    ├── bp.svg        # Black pawn
    ├── br.svg        # Black rook
    ├── bn.svg        # Black knight
    ├── bb.svg        # Black bishop
    ├── bq.svg        # Black queen
    └── bk.svg        # Black king
```

---

## How to Run Locally

No build step or server required. Just open the file:

1. Clone or download the repository
2. Open `index.html` in any modern browser
3. Enter player names, choose colors, and click **Start Game**

---

## How to Deploy on GitHub Pages

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set source to the `main` branch, root folder (`/`)
4. Save — your site will be live at `https://<username>.github.io/<repo-name>/`

---

## Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure, board layout, modals |
| CSS3 | Styling, Flexbox/Grid layout, animations |
| JavaScript (ES6) | Game logic, DOM manipulation, event handling |

---

## Known Limitations

- **Castling** is not implemented
- **En passant** is not implemented  
- **Pawn promotion** auto-promotes to queen (no selection dialog)
- No game timer

---

## Future Scope

- Multiple visual themes (minimal, child-friendly, warrior/hero)
- Castling and en passant
- Pawn promotion piece selection
- Move timer / chess clock
- Game export (PGN format)
