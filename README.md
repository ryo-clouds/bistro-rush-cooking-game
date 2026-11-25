# 🍳 Bistro Rush: Master Chef

[![make.fun](https://img.shields.io/badge/make.fun-bounty-purple)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js: 22](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)

**Bistro Rush: Master Chef** is a high-performance, responsive desktop browser cooking simulation game built from scratch with pure HTML5 Canvas and vanilla ES modules. It features dynamic customer order tickets, interactive kitchen prep stations, sizzling stove physics with visual cooking timers, plating assembly, and procedural sound effects synthesized via the Web Audio API with zero external network dependencies.

---

## 🎮 Gameplay & Features

1. **Dynamic Customer Order Board:**
   - Incoming orders display recipe name, required ingredient icons with visual cues, cash payout, and customer patience countdown dials.
   - Successful consecutive orders trigger the **Combo Rush Multiplier** (up to 4x score).

2. **Full Kitchen Workstations:**
   - **Ingredient Dispensers:** Crates stocked with Brioche Buns, Prime Beef, Vine Tomatoes, Romaine Lettuce, Aged Cheddar, Sweet Onions, Durum Pasta, and Forest Mushrooms.
   - **Prep & Cutting Boards:** Responsive chopping mechanics with wood knife animations and progress meters.
   - **Stoves & Sizzle Stations:** High-heat cast-iron pans and boiling saucepots with active cooking countdowns, sizzle particles, and burn warnings.
   - **Assembly Island:** Central marble counter for stacking and plating complex recipes.
   - **Service Bell Counter:** Deliver completed gourmet plates to ring the brass service bell and claim tips.
   - **Disposal Station:** Kitchen trash bin to discard unwanted or overcooked items.

3. **Gourmet Recipes:**
   - **Bistro Classic Burger:** Brioche Bun + Grilled Patty + Shredded Lettuce + Sliced Tomato ($25)
   - **Gourmet Cheeseburger:** Brioche Bun + Grilled Patty + Aged Cheddar + Diced Onion ($30)
   - **Tuscan Pasta Primavera:** Al Dente Pasta + Sliced Tomato + Sauteed Mushroom ($35)
   - **Bistro Garden Salad:** Shredded Lettuce + Sliced Tomato + Diced Onion + Aged Cheddar ($20)

4. **100% Self-Contained:**
   - Procedural Web Audio API sound synthesizer (wooden chop, pan sizzle, service bell chime, coin pickup).
   - Zero network requests, zero CDN dependencies, and completely offline playable.

---

## 🕹️ Controls

- **[WASD]** or **[Arrow Keys]**: Move Chef around the kitchen
- **[Space]** / **[E]** / **[Pointer Click]**: Interact, Pick up, Drop, Chop, Cook, or Serve
- **[P]** / **[Esc]**: Pause / Resume Service

---

## 🚀 Running Locally

```bash
# Serve the game locally with standard Node.js
node serve.ts --port 8080

# Open http://localhost:8080 in your desktop browser
```

---

## 📸 Deterministic Screenshot Views

The game includes pre-configured deterministic scene staging parameters for automated rendering:
- `?shot=kitchen&seed=1` — Kitchen Overview & Active Order Board
- `?shot=prep&seed=1` — Fresh Ingredients on Counter & Active Chopping Station
- `?shot=assembly&seed=1` — Mid-Assembly Gourmet Plate & Sizzling Stove Timer
- `?shot=service&seed=1` — Plated Meal Ready to Serve at Service Bell Counter

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
