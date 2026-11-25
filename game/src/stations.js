// Kitchen station definitions, collision bounds, and workstation mechanics.
import { ITEM, STATION_KIND, TIMINGS } from './config.js';
import { canChop, canCook, getBurntVariant, getChoppedVariant, getCookedVariant, isPlatable } from './recipes.js';
import { playBurnWarning, playChopSound, playPickupSound, playPlateDrop, playSizzleSound } from './audio.js';

export function createStation(id, name, kind, x, y, width = 74, height = 74, payload = null) {
  return {
    id,
    name,
    kind,
    x,
    y,
    width,
    height,
    payload,          // e.g. dispenser item type
    content: null,    // Single item or plate object: { kind: ITEM.PLATE, ingredients: [] }
    progress: 0,      // Progress timer (0 to 1)
    status: 'idle',   // idle, working, ready, burnt
    smokeTimer: 0,
  };
}

export function createKitchenStations() {
  const stations = [];

  // 1. North Wall: Fresh Ingredient Dispensers
  stations.push(createStation('disp_bun', 'Bakery Buns', STATION_KIND.DISPENSER, 130, 110, 70, 70, ITEM.BUN));
  stations.push(createStation('disp_patty', 'Prime Beef', STATION_KIND.DISPENSER, 230, 110, 70, 70, ITEM.PATTY_RAW));
  stations.push(createStation('disp_tomato', 'Vine Tomatoes', STATION_KIND.DISPENSER, 330, 110, 70, 70, ITEM.TOMATO));
  stations.push(createStation('disp_lettuce', 'Crisp Romaine', STATION_KIND.DISPENSER, 430, 110, 70, 70, ITEM.LETTUCE));
  stations.push(createStation('disp_cheese', 'Aged Cheddar', STATION_KIND.DISPENSER, 530, 110, 70, 70, ITEM.CHEESE));
  stations.push(createStation('disp_onion', 'Sweet Onion', STATION_KIND.DISPENSER, 630, 110, 70, 70, ITEM.ONION));
  stations.push(createStation('disp_pasta', 'Durum Pasta', STATION_KIND.DISPENSER, 730, 110, 70, 70, ITEM.PASTA_RAW));
  stations.push(createStation('disp_mushroom', 'Forest Mushroom', STATION_KIND.DISPENSER, 830, 110, 70, 70, ITEM.MUSHROOM));

  // 2. West Wall: Prep & Chopping
  stations.push(createStation('cut_1', 'Wood Cutting Board 1', STATION_KIND.CUTTING_BOARD, 70, 230, 70, 80));
  stations.push(createStation('cut_2', 'Wood Cutting Board 2', STATION_KIND.CUTTING_BOARD, 70, 340, 70, 80));
  stations.push(createStation('plate_stack', 'Clean Plates', STATION_KIND.PLATE_STACK, 70, 460, 70, 80, ITEM.PLATE));

  // 3. East Wall: Hot Stovetops & Disposal
  stations.push(createStation('stove_1', 'Sizzling Grill Pan', STATION_KIND.STOVE, 954, 230, 70, 80));
  stations.push(createStation('stove_2', 'Boiling Saucepan', STATION_KIND.STOVE, 954, 340, 70, 80));
  stations.push(createStation('trash', 'Waste Disposal', STATION_KIND.TRASH, 954, 460, 70, 80));

  // 4. Center Prep & Assembly Island
  stations.push(createStation('prep_1', 'Prep Station A', STATION_KIND.ASSEMBLY, 390, 350, 80, 80));
  stations.push(createStation('prep_2', 'Prep Station B', STATION_KIND.ASSEMBLY, 512, 350, 80, 80));
  stations.push(createStation('prep_3', 'Prep Station C', STATION_KIND.ASSEMBLY, 634, 350, 80, 80));

  // 5. South Wall: Delivery & Service Window
  stations.push(createStation('counter_1', 'Plating Counter', STATION_KIND.ASSEMBLY, 380, 560, 80, 70));
  stations.push(createStation('service', 'Service Bell Counter', STATION_KIND.SERVICE_BELL, 512, 560, 90, 70));
  stations.push(createStation('counter_2', 'Side Counter', STATION_KIND.ASSEMBLY, 644, 560, 80, 70));

  return stations;
}

export function updateStations(stations, dt, particles) {
  for (let i = 0; i < stations.length; i += 1) {
    const s = stations[i];

    // Automatic cooking progress for active stoves
    if (s.kind === STATION_KIND.STOVE && s.content) {
      if (typeof s.content === 'string' && canCook(s.content)) {
        s.progress += dt / TIMINGS.COOK_TIME;
        s.smokeTimer += dt;
        if (s.smokeTimer > 0.15) {
          s.smokeTimer = 0;
          particles.push({
            x: s.x + (Math.random() * 20 - 10),
            y: s.y - 10,
            vx: (Math.random() - 0.5) * 12,
            vy: -35 - Math.random() * 20,
            size: 4 + Math.random() * 4,
            life: 0.8,
            maxLife: 0.8,
            color: 'rgba(255,255,255,0.7)',
          });
        }
        if (s.progress >= 1.0) {
          s.content = getCookedVariant(s.content);
          s.status = 'ready';
          playSizzleSound();
          s.progress = 1.0;
        }
      } else if (s.status === 'ready' && typeof s.content === 'string') {
        // Danger burning timer
        s.progress += dt / (TIMINGS.BURN_TIME - TIMINGS.COOK_TIME);
        if (Math.random() < 0.08) playBurnWarning();
        if (s.progress >= 2.0) {
          s.content = getBurntVariant(s.content);
          s.status = 'burnt';
          s.progress = 0;
        }
      }
    }
  }
}

export function interactWithStation(station, player) {
  if (!station) return false;

  // 1. DISPENSERS: Grab an ingredient
  if (station.kind === STATION_KIND.DISPENSER) {
    if (player.held === null) {
      player.held = station.payload;
      playPickupSound();
      return true;
    }
    return false;
  }

  // 2. PLATE STACK: Pick up clean plate
  if (station.kind === STATION_KIND.PLATE_STACK) {
    if (player.held === null) {
      player.held = { kind: ITEM.PLATE, ingredients: [] };
      playPlateDrop();
      return true;
    }
    return false;
  }

  // 3. TRASH CAN: Dump current item
  if (station.kind === STATION_KIND.TRASH) {
    if (player.held !== null) {
      player.held = null;
      playPickupSound();
      return true;
    }
    return false;
  }

  // 4. CUTTING BOARD: Chop ingredients
  if (station.kind === STATION_KIND.CUTTING_BOARD) {
    // If empty and player holds choppable item, place it
    if (station.content === null && player.held && typeof player.held === 'string' && canChop(player.held)) {
      station.content = player.held;
      player.held = null;
      station.progress = 0;
      station.status = 'idle';
      playPickupSound();
      return true;
    }
    // If station has choppable item, chef chops it
    if (station.content && typeof station.content === 'string' && canChop(station.content) && station.status !== 'ready') {
      station.progress += 0.38; // Chop action chunk
      playChopSound();
      if (station.progress >= 1.0) {
        station.content = getChoppedVariant(station.content);
        station.status = 'ready';
        station.progress = 1.0;
      }
      return true;
    }
    // If ready or holding plate, take or plate it
    if (station.content !== null) {
      if (player.held === null) {
        player.held = station.content;
        station.content = null;
        station.status = 'idle';
        station.progress = 0;
        playPickupSound();
        return true;
      }
      if (player.held && player.held.kind === ITEM.PLATE && isPlatable(station.content)) {
        player.held.ingredients.push(station.content);
        station.content = null;
        station.status = 'idle';
        station.progress = 0;
        playPickupSound();
        return true;
      }
    }
    return false;
  }

  // 5. STOVETOP: Cook patties or pasta
  if (station.kind === STATION_KIND.STOVE) {
    // Place raw cookable item
    if (station.content === null && player.held && typeof player.held === 'string' && canCook(player.held)) {
      station.content = player.held;
      player.held = null;
      station.progress = 0;
      station.status = 'working';
      playSizzleSound();
      return true;
    }
    // Retrieve cooked or burnt item
    if (station.content !== null) {
      if (player.held === null) {
        player.held = station.content;
        station.content = null;
        station.status = 'idle';
        station.progress = 0;
        playPickupSound();
        return true;
      }
      if (player.held && player.held.kind === ITEM.PLATE && isPlatable(station.content)) {
        player.held.ingredients.push(station.content);
        station.content = null;
        station.status = 'idle';
        station.progress = 0;
        playPickupSound();
        return true;
      }
    }
    return false;
  }

  // 6. ASSEMBLY & COUNTERS: Hold items, stack burgers & plates
  if (station.kind === STATION_KIND.ASSEMBLY) {
    // Both empty: nothing
    if (station.content === null && player.held === null) return false;

    // Place held item onto empty counter
    if (station.content === null && player.held !== null) {
      station.content = player.held;
      player.held = null;
      playPickupSound();
      return true;
    }

    // Pick up item from counter
    if (station.content !== null && player.held === null) {
      player.held = station.content;
      station.content = null;
      playPickupSound();
      return true;
    }

    // Plate assembly: Player holds plate, counter has platable item
    if (player.held && player.held.kind === ITEM.PLATE && typeof station.content === 'string' && isPlatable(station.content)) {
      player.held.ingredients.push(station.content);
      station.content = null;
      playPickupSound();
      return true;
    }

    // Counter has plate, player holds platable item
    if (station.content && station.content.kind === ITEM.PLATE && typeof player.held === 'string' && isPlatable(player.held)) {
      station.content.ingredients.push(player.held);
      player.held = null;
      playPickupSound();
      return true;
    }

    return false;
  }

  return false;
}
