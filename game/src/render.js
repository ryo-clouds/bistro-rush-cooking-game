// Visual presentation engine: kitchen counters, delicious food icons, order tickets, chef sprite, and particles.
import { CANVAS_HEIGHT, CANVAS_WIDTH, ITEM, PALETTE, STATION_KIND } from './config.js';
import { getItemDisplayName } from './recipes.js';

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function drawFloor() {
    // Checkerboard kitchen flooring
    const tileSize = 64;
    for (let x = 0; x < CANVAS_WIDTH; x += tileSize) {
      for (let y = 0; y < CANVAS_HEIGHT; y += tileSize) {
        ctx.fillStyle = ((x / tileSize + y / tileSize) % 2 === 0) ? PALETTE.FLOOR_DARK : PALETTE.FLOOR_LIGHT;
        ctx.fillRect(x, y, tileSize, tileSize);
        ctx.strokeStyle = PALETTE.FLOOR_TILE;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }
  }

  function drawFoodIcon(kind, x, y, size = 26) {
    ctx.save();
    ctx.translate(x, y);

    switch (kind) {
      case ITEM.PLATE: {
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case ITEM.BUN: {
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.7, 0, Math.PI, true);
        ctx.fill();
        ctx.fillStyle = '#fef3c7';
        // Sesame seeds
        ctx.fillRect(-6, -8, 2, 3);
        ctx.fillRect(2, -10, 2, 3);
        ctx.fillRect(8, -6, 2, 3);
        break;
      }
      case ITEM.PATTY_RAW: {
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.7, size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case ITEM.PATTY_COOKED: {
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.7, size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        // Grill marks
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, -5); ctx.lineTo(-2, 5);
        ctx.moveTo(-2, -5); ctx.lineTo(6, 5);
        ctx.moveTo(6, -5); ctx.lineTo(14, 5);
        ctx.stroke();
        break;
      }
      case ITEM.PATTY_BURNT: {
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.7, size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case ITEM.TOMATO: {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(0, 2, size * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#16a34a'; // Green stem
        ctx.beginPath();
        ctx.arc(0, -size * 0.65 + 2, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case ITEM.TOMATO_CHOPPED: {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(-5, 0, size * 0.45, 0, Math.PI * 2);
        ctx.arc(6, 2, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b91c1c';
        ctx.stroke();
        break;
      }
      case ITEM.LETTUCE: {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }
      case ITEM.LETTUCE_CHOPPED: {
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(-10, -4, 20, 4);
        ctx.fillRect(-8, 2, 16, 4);
        ctx.fillRect(-12, -10, 14, 4);
        break;
      }
      case ITEM.CHEESE: {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(-size * 0.6, -size * 0.4);
        ctx.lineTo(size * 0.6, -size * 0.4);
        ctx.lineTo(size * 0.4, size * 0.5);
        ctx.lineTo(-size * 0.6, size * 0.5);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case ITEM.ONION: {
        ctx.fillStyle = '#e9d5ff';
        ctx.beginPath();
        ctx.arc(0, 2, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#a855f7';
        ctx.stroke();
        break;
      }
      case ITEM.ONION_CHOPPED: {
        ctx.fillStyle = '#f3e8ff';
        ctx.fillRect(-8, -4, 8, 8);
        ctx.fillRect(2, -2, 7, 7);
        ctx.strokeStyle = '#c084fc';
        ctx.strokeRect(-8, -4, 8, 8);
        ctx.strokeRect(2, -2, 7, 7);
        break;
      }
      case ITEM.PASTA_RAW: {
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-10, -8); ctx.lineTo(-10, 8);
        ctx.moveTo(-3, -8); ctx.lineTo(-3, 8);
        ctx.moveTo(4, -8); ctx.lineTo(4, 8);
        ctx.stroke();
        break;
      }
      case ITEM.PASTA_COOKED: {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-2, -2, size * 0.35, 0, Math.PI);
        ctx.arc(2, 2, size * 0.35, Math.PI, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case ITEM.MUSHROOM: {
        ctx.fillStyle = '#d6d3d1';
        ctx.beginPath();
        ctx.arc(0, -2, size * 0.6, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#f5f5f4';
        ctx.fillRect(-3, -2, 6, 10);
        break;
      }
      case ITEM.MUSHROOM_CHOPPED: {
        ctx.fillStyle = '#a8a29e';
        ctx.fillRect(-8, -4, 7, 6);
        ctx.fillRect(2, 0, 7, 6);
        break;
      }
    }
    ctx.restore();
  }

  function drawPlateContents(plate, x, y) {
    drawFoodIcon(ITEM.PLATE, x, y, 28);
    if (!plate.ingredients || plate.ingredients.length === 0) return;

    // Stack ingredients attractively on the plate
    plate.ingredients.forEach((item, index) => {
      const offsetY = -4 - index * 6;
      drawFoodIcon(item, x, y + offsetY, 22);
    });
  }

  function drawStation(s, isTarget) {
    ctx.save();
    ctx.translate(s.x, s.y);

    // Counter shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(-s.width / 2 + 4, -s.height / 2 + 8, s.width, s.height);

    // Main counter top
    ctx.fillStyle = (s.kind === STATION_KIND.CUTTING_BOARD) ? '#a16207'
      : (s.kind === STATION_KIND.STOVE) ? '#1e293b'
      : (s.kind === STATION_KIND.SERVICE_BELL) ? '#0f766e'
      : (s.kind === STATION_KIND.TRASH) ? '#475569'
      : PALETTE.COUNTER_TOP;
    ctx.fillRect(-s.width / 2, -s.height / 2, s.width, s.height);

    // Counter front bevel & border
    ctx.strokeStyle = isTarget ? '#fbbf24' : PALETTE.COUNTER_RIM;
    ctx.lineWidth = isTarget ? 3 : 2;
    ctx.strokeRect(-s.width / 2, -s.height / 2, s.width, s.height);

    // Station specific decorations
    if (s.kind === STATION_KIND.CUTTING_BOARD) {
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-s.width / 2 + 8, -s.height / 2 + 8, s.width - 16, s.height - 16);
      // Knife graphic
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-18, -2, 28, 4);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(10, -3, 8, 6);
    } else if (s.kind === STATION_KIND.STOVE) {
      // Burner coil
      ctx.strokeStyle = (s.status === 'working' || s.status === 'ready') ? '#f97316' : '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();
      // Frying pan handle
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-4, -28, 8, 14);
    } else if (s.kind === STATION_KIND.SERVICE_BELL) {
      // Golden service bell
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 2, 14, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-12, 2, 24, 4);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-2, -15, 4, 4);
    } else if (s.kind === STATION_KIND.DISPENSER) {
      // Crate label
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-s.width / 2 + 4, -s.height / 2 + 4, s.width - 8, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(s.name.split(' ')[0], 0, -s.height / 2 + 15);
      // Food preview icon inside crate
      if (s.payload) drawFoodIcon(s.payload, 0, 10, 20);
    }

    // Draw station content
    if (s.content) {
      if (typeof s.content === 'string') {
        drawFoodIcon(s.content, 0, 0, 26);
      } else if (s.content.kind === ITEM.PLATE) {
        drawPlateContents(s.content, 0, 0);
      }
    }

    // Progress Bar (Chopping or Cooking)
    if (s.progress > 0 && s.progress <= 1.0 && (s.kind === STATION_KIND.CUTTING_BOARD || s.kind === STATION_KIND.STOVE)) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(-26, -s.height / 2 - 12, 52, 8);
      ctx.fillStyle = (s.kind === STATION_KIND.STOVE) ? '#f97316' : '#22c55e';
      ctx.fillRect(-24, -s.height / 2 - 10, 48 * Math.min(s.progress, 1.0), 4);
    } else if (s.progress > 1.0 && s.kind === STATION_KIND.STOVE) {
      // Burning danger bar!
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(-26, -s.height / 2 - 12, 52, 8);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-24, -s.height / 2 - 10, 48 * Math.min(s.progress - 1.0, 1.0), 4);
    }

    ctx.restore();
  }

  function drawChef(player) {
    ctx.save();
    ctx.translate(player.x, player.y);

    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, player.radius - 2, player.radius * 0.8, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking leg bob
    const bob = player.isWalking ? Math.sin(player.walkCycle) * 3 : 0;

    // Body / Chef Jacket
    ctx.fillStyle = PALETTE.CHEF_APRON;
    ctx.beginPath();
    ctx.arc(0, bob, player.radius * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Red neckerchief
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-8, bob - 12);
    ctx.lineTo(8, bob - 12);
    ctx.lineTo(0, bob - 4);
    ctx.closePath();
    ctx.fill();

    // Chef Hat (Toque)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, bob - 20, 16, 0, Math.PI, true);
    ctx.fill();
    ctx.fillRect(-14, bob - 20, 28, 8);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(-14, bob - 20, 28, 8);

    // Hands / Item held
    if (player.held) {
      const handY = (player.facing === 'up') ? bob - 22 : bob + 16;
      if (typeof player.held === 'string') {
        drawFoodIcon(player.held, 0, handY, 22);
      } else if (player.held.kind === ITEM.PLATE) {
        drawPlateContents(player.held, 0, handY);
      }
    }

    ctx.restore();
  }

  function drawOrderBoard(orders, score, combo, timeLeft) {
    // Top order rail header
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 92);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 88, CANVAS_WIDTH, 6);

    // Score & Timer HUD
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 20px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(`💰 $${score}`, 20, 36);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px system-ui';
    ctx.fillText(`⏱️ ${Math.max(0, Math.floor(timeLeft))}s`, 20, 68);

    // Combo streak badge
    if (combo > 1) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(130, 22, 70, 26);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${combo}x RUSH!`, 165, 39);
    }

    // Active Customer Order Tickets
    const ticketStartX = 230;
    const ticketWidth = 145;
    for (let i = 0; i < orders.length; i += 1) {
      const ord = orders[i];
      const tx = ticketStartX + i * (ticketWidth + 12);
      const ty = 8;
      const ratio = Math.max(0, ord.timeLeft / ord.totalTime);

      // Paper ticket background
      ctx.fillStyle = '#fefce8';
      ctx.fillRect(tx, ty, ticketWidth, 74);
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.strokeRect(tx, ty, ticketWidth, 74);

      // Recipe Title
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(ord.recipe.name, tx + 6, ty + 14);

      // Dish reward
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 11px system-ui';
      ctx.fillText(`+$${ord.recipe.payout}`, tx + ticketWidth - 36, ty + 14);

      // Required ingredient miniature icons
      ord.recipe.required.forEach((reqItem, rIdx) => {
        drawFoodIcon(reqItem, tx + 14 + rIdx * 24, ty + 38, 16);
      });

      // Customer Patience Timer Bar (Green -> Amber -> Pulsing Red)
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(tx + 6, ty + 60, ticketWidth - 12, 6);
      ctx.fillStyle = ratio > 0.5 ? '#22c55e' : (ratio > 0.25 ? '#f59e0b' : '#ef4444');
      ctx.fillRect(tx + 6, ty + 60, (ticketWidth - 12) * ratio, 6);
    }
  }

  function drawParticles(particles) {
    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawFloatingTexts(floatingTexts) {
    for (let i = 0; i < floatingTexts.length; i += 1) {
      const ft = floatingTexts[i];
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    }
  }

  function drawTitleScreen(bestScore) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 46px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('🍳 BISTRO RUSH: MASTER CHEF', CANVAS_WIDTH / 2, 220);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '19px system-ui';
    ctx.fillText('The Gourmet Kitchen Simulation & Speed Plating Challenge', CANVAS_WIDTH / 2, 265);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '15px system-ui';
    ctx.fillText('Controls: [WASD / Arrows] Move Chef  |  [Space / E / Click] Chop, Cook & Plate', CANVAS_WIDTH / 2, 330);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px system-ui';
    ctx.fillText('▶ PRESS SPACE OR CLICK TO START SERVICE', CANVAS_WIDTH / 2, 410);

    if (bestScore > 0) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px system-ui';
      ctx.fillText(`🏆 All-Time Restaurant Record: $${bestScore}`, CANVAS_WIDTH / 2, 470);
    }
  }

  return {
    draw(state, screen, bestScore = 0) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawFloor();

      // Draw all kitchen stations
      for (let i = 0; i < state.stations.length; i += 1) {
        const s = state.stations[i];
        const isTarget = (state.player.interactTarget && state.player.interactTarget.id === s.id);
        drawStation(s, isTarget);
      }

      // Draw chef character
      drawChef(state.player);

      // Draw sizzle and steam particles
      drawParticles(state.particles);

      // Draw top order board, timers and HUD
      drawOrderBoard(state.orderManager.activeOrders, state.orderManager.score, state.orderManager.combo, state.timeLeft);

      // Draw floating score animations
      drawFloatingTexts(state.orderManager.floatingTexts);

      // Overlay screens
      if (screen === 'title') {
        drawTitleScreen(bestScore);
      }
    },
  };
}
