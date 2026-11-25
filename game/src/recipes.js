// Culinary formulas, prep rules, and recipe assembly validation.
import { ITEM, RECIPES } from './config.js';

export function getChoppedVariant(item) {
  switch (item) {
    case ITEM.TOMATO: return ITEM.TOMATO_CHOPPED;
    case ITEM.LETTUCE: return ITEM.LETTUCE_CHOPPED;
    case ITEM.ONION: return ITEM.ONION_CHOPPED;
    case ITEM.MUSHROOM: return ITEM.MUSHROOM_CHOPPED;
    default: return null;
  }
}

export function getCookedVariant(item) {
  switch (item) {
    case ITEM.PATTY_RAW: return ITEM.PATTY_COOKED;
    case ITEM.PASTA_RAW: return ITEM.PASTA_COOKED;
    default: return null;
  }
}

export function getBurntVariant(item) {
  switch (item) {
    case ITEM.PATTY_COOKED: return ITEM.PATTY_BURNT;
    case ITEM.PASTA_COOKED: return ITEM.PASTA_BURNT;
    default: return null;
  }
}

export function canChop(item) {
  return getChoppedVariant(item) !== null;
}

export function canCook(item) {
  return getCookedVariant(item) !== null;
}

export function isPlatable(item) {
  if (item === ITEM.PLATE || item === ITEM.NONE) return false;
  // Raw items that require cooking or chopping cannot be plated directly
  if (item === ITEM.PATTY_RAW || item === ITEM.PASTA_RAW) return false;
  if (item === ITEM.TOMATO || item === ITEM.LETTUCE || item === ITEM.ONION || item === ITEM.MUSHROOM) return false;
  return true;
}

export function matchRecipe(ingredients) {
  if (!Array.isArray(ingredients) || ingredients.length === 0) return null;
  const sortedTarget = [...ingredients].sort();

  for (let i = 0; i < RECIPES.length; i += 1) {
    const recipe = RECIPES[i];
    if (recipe.required.length !== sortedTarget.length) continue;
    const sortedRequired = [...recipe.required].sort();
    const isMatch = sortedRequired.every((req, idx) => req === sortedTarget[idx]);
    if (isMatch) return recipe;
  }
  return null;
}

export function getItemDisplayName(item) {
  switch (item) {
    case ITEM.PLATE: return 'Ceramic Plate';
    case ITEM.BUN: return 'Brioche Bun';
    case ITEM.PATTY_RAW: return 'Raw Beef Patty';
    case ITEM.PATTY_COOKED: return 'Grilled Patty';
    case ITEM.PATTY_BURNT: return 'Burnt Patty';
    case ITEM.TOMATO: return 'Fresh Tomato';
    case ITEM.TOMATO_CHOPPED: return 'Sliced Tomato';
    case ITEM.LETTUCE: return 'Crisp Romaine';
    case ITEM.LETTUCE_CHOPPED: return 'Shredded Lettuce';
    case ITEM.CHEESE: return 'Cheddar Slice';
    case ITEM.ONION: return 'Sweet Onion';
    case ITEM.ONION_CHOPPED: return 'Diced Onion';
    case ITEM.PASTA_RAW: return 'Raw Pasta';
    case ITEM.PASTA_COOKED: return 'Al Dente Pasta';
    case ITEM.PASTA_BURNT: return 'Overcooked Pasta';
    case ITEM.MUSHROOM: return 'Fresh Mushroom';
    case ITEM.MUSHROOM_CHOPPED: return 'Sauteed Mushroom';
    default: return 'Empty';
  }
}
