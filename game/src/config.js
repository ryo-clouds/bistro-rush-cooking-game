// Kitchen layout, station definitions, food items, and game balance rules.
export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 640;
export const STEP = 1 / 60;
export const SHIFT_DURATION = 150; // 2.5 minutes per full kitchen rush shift

export const ITEM = Object.freeze({
  NONE: 'none',
  PLATE: 'plate',
  BUN: 'bun',
  PATTY_RAW: 'patty_raw',
  PATTY_COOKED: 'patty_cooked',
  PATTY_BURNT: 'patty_burnt',
  TOMATO: 'tomato',
  TOMATO_CHOPPED: 'tomato_chopped',
  LETTUCE: 'lettuce',
  LETTUCE_CHOPPED: 'lettuce_chopped',
  CHEESE: 'cheese',
  ONION: 'onion',
  ONION_CHOPPED: 'onion_chopped',
  PASTA_RAW: 'pasta_raw',
  PASTA_COOKED: 'pasta_cooked',
  PASTA_BURNT: 'pasta_burnt',
  MUSHROOM: 'mushroom',
  MUSHROOM_CHOPPED: 'mushroom_chopped',
});

export const RECIPES = Object.freeze([
  {
    id: 'bistro_burger',
    name: 'Bistro Classic Burger',
    payout: 25,
    patience: 42,
    required: [ITEM.BUN, ITEM.PATTY_COOKED, ITEM.LETTUCE_CHOPPED, ITEM.TOMATO_CHOPPED],
    description: 'Fresh toasted bun, flame-grilled beef patty, crispy lettuce & vine tomato.',
  },
  {
    id: 'deluxe_cheeseburger',
    name: 'Gourmet Cheeseburger',
    payout: 30,
    patience: 45,
    required: [ITEM.BUN, ITEM.PATTY_COOKED, ITEM.CHEESE, ITEM.ONION_CHOPPED],
    description: 'Savory grilled patty with melted aged cheddar and sweet caramelized onion.',
  },
  {
    id: 'tuscan_pasta',
    name: 'Tuscan Pasta Primavera',
    payout: 35,
    patience: 50,
    required: [ITEM.PASTA_COOKED, ITEM.TOMATO_CHOPPED, ITEM.MUSHROOM_CHOPPED],
    description: 'Al dente pasta tossed with crushed vine tomatoes and sauteed mushrooms.',
  },
  {
    id: 'garden_salad',
    name: 'Bistro Garden Salad',
    payout: 20,
    patience: 35,
    required: [ITEM.LETTUCE_CHOPPED, ITEM.TOMATO_CHOPPED, ITEM.ONION_CHOPPED, ITEM.CHEESE],
    description: 'Crisp hand-chopped romaine, juicy tomatoes, sweet onions & shaved cheese.',
  },
]);

export const STATION_KIND = Object.freeze({
  DISPENSER: 'dispenser',
  CUTTING_BOARD: 'cutting_board',
  STOVE: 'stove',
  ASSEMBLY: 'assembly',
  SERVICE_BELL: 'service_bell',
  TRASH: 'trash',
  PLATE_STACK: 'plate_stack',
});

export const TIMINGS = Object.freeze({
  CHOP_TIME: 1.6,      // Seconds of active chopping
  COOK_TIME: 4.2,      // Seconds on heat until perfectly cooked
  BURN_TIME: 8.5,      // Seconds before food burns
  ORDER_INTERVAL_MIN: 7.0,
  ORDER_INTERVAL_MAX: 13.0,
  MAX_ACTIVE_ORDERS: 5,
});

export const PLAYER_SPEED = 230; // pixels per second
export const INTERACT_RADIUS = 62; // interaction distance in pixels

export const PALETTE = Object.freeze({
  FLOOR_DARK: '#2c221b',
  FLOOR_LIGHT: '#3a2d24',
  FLOOR_TILE: '#45352b',
  COUNTER_TOP: '#d9e2ec',
  COUNTER_FRONT: '#627d98',
  COUNTER_RIM: '#bcccdc',
  WOOD_BOARD: '#b7791f',
  STOVE_TOP: '#1f2937',
  STOVE_BURNER: '#ef4444',
  CHEF_HAT: '#ffffff',
  CHEF_APRON: '#f8fafc',
  CHEF_SKIN: '#f6ad55',
  CHEF_PANTS: '#1e293b',
  ACCENT_GOLD: '#f59e0b',
  ACCENT_GREEN: '#10b981',
  ACCENT_RED: '#ef4444',
  ACCENT_BLUE: '#3b82f6',
});
