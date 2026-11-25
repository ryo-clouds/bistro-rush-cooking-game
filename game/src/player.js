// Chef player character mechanics, collision detection, and station targeting.
import { CANVAS_HEIGHT, CANVAS_WIDTH, INTERACT_RADIUS, PLAYER_SPEED } from './config.js';

export function createPlayer(startX = 512, startY = 460) {
  return {
    x: startX,
    y: startY,
    radius: 24,
    speed: PLAYER_SPEED,
    facing: 'up', // 'up', 'down', 'left', 'right'
    held: null,   // null, string item, or plate object
    walkCycle: 0,
    isWalking: false,
    interactTarget: null,
  };
}

// Kitchen solid obstacles (counters and walls)
const OBSTACLES = [
  // North Counter
  { x: 90, y: 70, w: 844, h: 70 },
  // West Counter
  { x: 30, y: 190, w: 80, h: 320 },
  // East Counter
  { x: 914, y: 190, w: 80, h: 320 },
  // Center Prep Island
  { x: 340, y: 310, w: 344, h: 80 },
  // South Counter
  { x: 330, y: 520, w: 364, h: 70 },
];

function circlesCollideWithBox(cx, cy, r, box) {
  const closestX = Math.max(box.x, Math.min(cx, box.x + box.w));
  const closestY = Math.max(box.y, Math.min(cy, box.y + box.h));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return (dx * dx + dy * dy) < (r * r);
}

export function updatePlayer(player, input, dt, stations) {
  let dx = 0;
  let dy = 0;

  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;

  if (dx !== 0 && dy !== 0) {
    const inv = 1 / Math.SQRT2;
    dx *= inv;
    dy *= inv;
  }

  player.isWalking = (dx !== 0 || dy !== 0);
  if (player.isWalking) {
    player.walkCycle += dt * 10;
    if (Math.abs(dx) > Math.abs(dy)) {
      player.facing = dx > 0 ? 'right' : 'left';
    } else {
      player.facing = dy > 0 ? 'down' : 'up';
    }

    let nextX = player.x + dx * player.speed * dt;
    let nextY = player.y + dy * player.speed * dt;

    // Room boundaries
    nextX = Math.max(80 + player.radius, Math.min(CANVAS_WIDTH - 80 - player.radius, nextX));
    nextY = Math.max(140 + player.radius, Math.min(CANVAS_HEIGHT - 60 - player.radius, nextY));

    // Collision check against obstacles
    let hitX = false;
    let hitY = false;
    for (let i = 0; i < OBSTACLES.length; i += 1) {
      if (circlesCollideWithBox(nextX, player.y, player.radius, OBSTACLES[i])) hitX = true;
      if (circlesCollideWithBox(player.x, nextY, player.radius, OBSTACLES[i])) hitY = true;
    }

    if (!hitX) player.x = nextX;
    if (!hitY) player.y = nextY;
  }

  // Find closest reachable kitchen station
  let closest = null;
  let minDist = INTERACT_RADIUS;

  for (let i = 0; i < stations.length; i += 1) {
    const s = stations[i];
    const dist = Math.hypot(player.x - s.x, player.y - s.y);
    if (dist < minDist) {
      minDist = dist;
      closest = s;
    }
  }

  player.interactTarget = closest;
}
