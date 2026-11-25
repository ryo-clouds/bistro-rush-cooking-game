// Keyboard and pointer interaction listeners.
export const ACTION_CONFIRM = 1 << 0;
export const ACTION_INTERACT = 1 << 1;
export const ACTION_PAUSE = 1 << 2;

export function createInput(canvas) {
  const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  let actionFlags = 0;

  function onKeyDown(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.up = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keys.down = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        keys.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keys.right = true;
        break;
      case 'Space':
      case 'KeyE':
      case 'Enter':
        actionFlags |= (ACTION_CONFIRM | ACTION_INTERACT);
        break;
      case 'KeyP':
      case 'Escape':
        actionFlags |= ACTION_PAUSE;
        break;
    }
  }

  function onKeyUp(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.up = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keys.down = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        keys.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keys.right = false;
        break;
    }
  }

  function onPointerDown() {
    actionFlags |= (ACTION_CONFIRM | ACTION_INTERACT);
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('pointerdown', onPointerDown);

  return {
    state() {
      return keys;
    },
    takeActions() {
      const current = actionFlags;
      actionFlags = 0;
      return current;
    },
  };
}
