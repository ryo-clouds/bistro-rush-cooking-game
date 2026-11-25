// Main entrypoint and game loop for Bistro Rush: Master Chef.
import { STEP } from './config.js';
import { createRandom } from './random.js';
import { createWorld, EVENT_OVER, EVENT_SERVED } from './world.js';
import { ACTION_CONFIRM, ACTION_INTERACT, ACTION_PAUSE, createInput } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

const BEST_SCORE_KEY = 'bistro_rush_best_score';
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : 42;

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(createRandom(seed));
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(val) {
  try {
    window.localStorage.setItem(BEST_SCORE_KEY, String(val));
  } catch {
    // Local storage unavailable
  }
}

function runShot(name) {
  const scene = stageShot(name, world);
  let frames = 0;
  function paint() {
    renderer.draw(world.state, scene.screen, scene.best);
    frames += 1;
    if (frames < 3) {
      requestAnimationFrame(paint);
    } else {
      window.__shotReady = true;
    }
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = 'title';
  let bestScore = readBest();
  let accumulator = 0;
  let lastTime = performance.now();

  function announce(msg) {
    if (status) status.textContent = msg;
  }

  function startShift() {
    world.reset();
    accumulator = 0;
    screen = 'play';
    announce('Dinner service started! Cook and plate customer orders.');
  }

  function endShift() {
    screen = 'title';
    if (world.state.orderManager.score > bestScore) {
      bestScore = world.state.orderManager.score;
      saveBest(bestScore);
    }
    announce(`Service ended. Total revenue: $${world.state.orderManager.score}. Best record: $${bestScore}.`);
  }

  function handleInput(actions) {
    if (actions & ACTION_CONFIRM && screen === 'title') {
      startShift();
      return;
    }
    if (actions & ACTION_PAUSE && screen === 'play') {
      screen = 'paused';
      announce('Game paused.');
      return;
    }
    if ((actions & (ACTION_PAUSE | ACTION_CONFIRM)) && screen === 'paused') {
      screen = 'play';
      announce('Resumed.');
      return;
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    accumulator += dt;

    const actions = input.takeActions();
    handleInput(actions);

    if (screen === 'play') {
      const isInteract = (actions & ACTION_INTERACT) !== 0;
      while (accumulator >= STEP) {
        const events = world.step(STEP, input.state(), isInteract);
        if (events & EVENT_OVER) {
          endShift();
          break;
        }
        if (events & EVENT_SERVED) {
          announce(`Order completed! Score: $${world.state.orderManager.score}`);
        }
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }

    renderer.draw(world.state, screen, bestScore);
  }

  announce('Bistro Rush: Master Chef. Press Space or click to start dinner service.');
  requestAnimationFrame(frame);
}

if (shot) {
  runShot(shot);
} else {
  runGame();
}
