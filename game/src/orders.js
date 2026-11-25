// Order board queue, customer patience countdowns, scoring, and combo streak multipliers.
import { RECIPES, TIMINGS } from './config.js';
import { matchRecipe } from './recipes.js';
import { playServiceBell, playSuccessChime } from './audio.js';

let nextOrderId = 1;

export function createOrder(recipe) {
  return {
    id: nextOrderId++,
    recipe,
    timeLeft: recipe.patience,
    totalTime: recipe.patience,
  };
}

export function createOrderManager() {
  return {
    activeOrders: [],
    spawnTimer: 1.5,
    score: 0,
    combo: 1,
    ordersServed: 0,
    ordersExpired: 0,
    floatingTexts: [],
  };
}

export function updateOrders(orderManager, dt) {
  // 1. Tick order countdowns
  for (let i = orderManager.activeOrders.length - 1; i >= 0; i -= 1) {
    const order = orderManager.activeOrders[i];
    order.timeLeft -= dt;
    if (order.timeLeft <= 0) {
      orderManager.activeOrders.splice(i, 1);
      orderManager.combo = 1;
      orderManager.ordersExpired += 1;
      orderManager.floatingTexts.push({
        text: 'Expired! -5',
        x: 200 + i * 160,
        y: 80,
        vy: -25,
        life: 1.2,
        maxLife: 1.2,
        color: '#ef4444',
      });
    }
  }

  // 2. Spawn new customer orders
  orderManager.spawnTimer -= dt;
  if (orderManager.spawnTimer <= 0 && orderManager.activeOrders.length < TIMINGS.MAX_ACTIVE_ORDERS) {
    const randomRecipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    orderManager.activeOrders.push(createOrder(randomRecipe));
    orderManager.spawnTimer = TIMINGS.ORDER_INTERVAL_MIN + Math.random() * (TIMINGS.ORDER_INTERVAL_MAX - TIMINGS.ORDER_INTERVAL_MIN);
  }

  // 3. Update floating feedback texts
  for (let i = orderManager.floatingTexts.length - 1; i >= 0; i -= 1) {
    const ft = orderManager.floatingTexts[i];
    ft.y += ft.vy * dt;
    ft.life -= dt;
    if (ft.life <= 0) {
      orderManager.floatingTexts.splice(i, 1);
    }
  }
}

export function submitDish(orderManager, plate, stationX, stationY) {
  if (!plate || !Array.isArray(plate.ingredients)) return false;
  const matched = matchRecipe(plate.ingredients);
  if (!matched) return false;

  // Find oldest matching active order
  for (let i = 0; i < orderManager.activeOrders.length; i += 1) {
    const order = orderManager.activeOrders[i];
    if (order.recipe.id === matched.id) {
      // Success! Calculate score & tip
      const speedRatio = order.timeLeft / order.totalTime;
      const speedBonus = Math.floor(speedRatio * 15);
      const points = (matched.payout + speedBonus) * orderManager.combo;

      orderManager.score += points;
      orderManager.ordersServed += 1;
      orderManager.combo = Math.min(orderManager.combo + 1, 4);

      orderManager.activeOrders.splice(i, 1);
      playServiceBell();
      playSuccessChime();

      orderManager.floatingTexts.push({
        text: `+${points} (${orderManager.combo}x Combo!)`,
        x: stationX,
        y: stationY - 30,
        vy: -35,
        life: 1.5,
        maxLife: 1.5,
        color: '#fbbf24',
      });

      return true;
    }
  }

  return false;
}
