// Kitchen simulation world state: coordinates stations, player, orders, and interaction physics.
import { SHIFT_DURATION, STATION_KIND } from './config.js';
import { createKitchenStations, interactWithStation, updateStations } from './stations.js';
import { createPlayer, updatePlayer } from './player.js';
import { createOrderManager, submitDish, updateOrders } from './orders.js';

export const EVENT_NONE = 0;
export const EVENT_SERVED = 1 << 0;
export const EVENT_OVER = 1 << 1;

export function createWorld(random) {
  let stations = createKitchenStations();
  let player = createPlayer();
  let orderManager = createOrderManager();
  let particles = [];
  let timeLeft = SHIFT_DURATION;

  function reset() {
    stations = createKitchenStations();
    player = createPlayer();
    orderManager = createOrderManager();
    particles = [];
    timeLeft = SHIFT_DURATION;
  }

  function step(dt, inputState, isInteract) {
    let events = EVENT_NONE;
    timeLeft -= dt;
    if (timeLeft <= 0) {
      events |= EVENT_OVER;
    }

    // 1. Update active stations (cooking / sizzle)
    updateStations(stations, dt, particles);

    // 2. Update player movement
    updatePlayer(player, inputState, dt, stations);

    // 3. Handle player interaction
    if (isInteract && player.interactTarget) {
      const target = player.interactTarget;
      if (target.kind === STATION_KIND.SERVICE_BELL && player.held && player.held.kind) {
        // Delivering meal at the service bell!
        const success = submitDish(orderManager, player.held, target.x, target.y);
        if (success) {
          player.held = null;
          events |= EVENT_SERVED;
        }
      } else {
        interactWithStation(target, player);
      }
    }

    // 4. Update orders and countdowns
    updateOrders(orderManager, dt);

    // 5. Update particle physics
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    return events;
  }

  return {
    get state() {
      return {
        stations,
        player,
        orderManager,
        particles,
        timeLeft,
      };
    },
    step,
    reset,
  };
}
