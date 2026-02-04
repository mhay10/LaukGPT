// Simple drawing script for admin drawing UI
document.addEventListener('DOMContentLoaded', () => {
  function initDrawingForm(form) {
    const canvas = form.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const colorInput = form.querySelector('.brush-color');
    const sizeInput = form.querySelector('.brush-size');
    const clearBtn = form.querySelector('.clear-canvas');
    const saveBtn = form.querySelector('.save-image');
    const undoBtn = form.querySelector('.undo-canvas');
    const redoBtn = form.querySelector('.redo-canvas');
    const hiddenInput = form.querySelector('input[name="image_data"]');
    const toolButtons = form.querySelectorAll('.tool-btn');

    // Undo/Redo history (store data URLs). Limit to avoid memory bloat.
    const HISTORY_LIMIT = 50;
    let undoStack = [];
    let redoStack = [];

    function updateHistoryButtons() {
      if (undoBtn) undoBtn.disabled = undoStack.length === 0;
      if (redoBtn) redoBtn.disabled = redoStack.length === 0;
    }

    function saveState() {
      try {
        const current = canvas.toDataURL();
        if (!current) return;
        if (undoStack.length && undoStack[undoStack.length - 1] === current) return;
        undoStack.push(current);
        if (undoStack.length > HISTORY_LIMIT) undoStack.shift();
        // New action invalidates redo history
        redoStack = [];
        updateHistoryButtons();
      } catch (err) {
        console.warn('saveState failed', err);
      }
    }

    function restoreFromDataUrl(dataUrl) {
      if (!dataUrl) return;
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width / lastDpi, canvas.height / lastDpi);
        ctx.drawImage(img, 0, 0, canvas.width / lastDpi, canvas.height / lastDpi);
      };
      img.src = dataUrl;
    }

    function doUndo() {
      if (!undoStack.length) return;
      try {
        const current = canvas.toDataURL();
        const last = undoStack.pop();
        redoStack.push(current);
        restoreFromDataUrl(last);
        updateHistoryButtons();
      } catch (err) { console.warn('undo failed', err); }
    }

    function doRedo() {
      if (!redoStack.length) return;
      try {
        const current = canvas.toDataURL();
        const next = redoStack.pop();
        undoStack.push(current);
        restoreFromDataUrl(next);
        updateHistoryButtons();
      } catch (err) { console.warn('redo failed', err); }
    }

    if (undoBtn) undoBtn.addEventListener('click', doUndo);
    if (redoBtn) redoBtn.addEventListener('click', doRedo);

    // Keyboard shortcuts when this form is focused: Ctrl/Cmd+Z and Ctrl/Cmd+Y (or Shift+Ctrl+Z)
    form.addEventListener('keydown', (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (e.shiftKey) {
          doRedo();
        } else {
          doUndo();
        }
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        doRedo();
      }
    });

    // Setup drawing state
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'brush'; // 'brush' | 'bucket' | 'eraser'

    // Tool selection handler
    toolButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        toolButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool || 'brush';
        if (currentTool === 'bucket') {
          canvas.style.cursor = 'cell';
        } else if (currentTool === 'eraser') {
          canvas.style.cursor = 'crosshair';
        } else {
          canvas.style.cursor = 'crosshair';
        }
      });
    });

    // Convert hex (#rrggbb) to [r,g,b,a]
    function hexToRgba(hex) {
      const h = hex.replace('#','');
      const bigint = parseInt(h, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b, 255];
    }

    // Simple stack-based flood fill using image data (coordinates in CSS pixels)
    function bucketFillAt(xCss, yCss) {
      // Save a state so bucket fill can be undone
      saveState();
      const w = canvas.width;
      const h = canvas.height;
      const x = Math.floor(xCss * lastDpi);
      const y = Math.floor(yCss * lastDpi);
      try {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const target = hexToRgba(colorInput.value);
        const startIdx = (y * w + x) * 4;
        const startR = data[startIdx];
        const startG = data[startIdx + 1];
        const startB = data[startIdx + 2];
        const startA = data[startIdx + 3];

        // If clicked color already same as target, do nothing
        if (startR === target[0] && startG === target[1] && startB === target[2] && startA === 255) {
          return;
        }

        const stack = [[x, y]];
        while (stack.length) {
          const [cx, cy] = stack.pop();
          if (cx < 0 || cx >= w || cy < 0 || cy >= h) continue;
          const idx = (cy * w + cx) * 4;
          if (data[idx] === startR && data[idx + 1] === startG && data[idx + 2] === startB && data[idx + 3] === startA) {
            data[idx] = target[0];
            data[idx + 1] = target[1];
            data[idx + 2] = target[2];
            data[idx + 3] = 255;
            stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
          }
        }
        ctx.putImageData(imageData, 0, 0);
      } catch (err) {
        console.error('Bucket fill failed', err);
      }
    }

    // Resize canvas for high DPI displays and preserve content; ensure a white background
    const WEBP_QUALITY = 0.6; // 0.0 (max compression) -> 1.0 (best quality). Adjust as needed.
    let lastDpi = window.devicePixelRatio || 1;

    function fixDpi() {
      const dpi = window.devicePixelRatio || 1;
      lastDpi = dpi;
      const styleHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
      const styleWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);

      // Save current drawing as an image
      const oldData = canvas.toDataURL();

      // Set the canvas resolution for the device
      canvas.setAttribute('width', styleWidth * dpi);
      canvas.setAttribute('height', styleHeight * dpi);

      // Reset any transforms then scale for DPI
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpi, dpi);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Fill white background first (in CSS pixels)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width / dpi, canvas.height / dpi);

      // Restore previous drawing (if any)
      if (oldData && oldData.indexOf('data:') === 0) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width / dpi, canvas.height / dpi);
          // capture restored drawing into history
          saveState();
        };
        img.src = oldData;
      } else {
        // nothing to restore — capture the blank canvas state
        saveState();
      }
    }

    fixDpi();
    window.addEventListener('resize', fixDpi);

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      if (e.touches && e.touches.length) {
        return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
      }
      return [e.clientX - rect.left, e.clientY - rect.top];
    }

    function start(e) {
      const [x, y] = getPos(e);
      if (currentTool === 'bucket') {
        bucketFillAt(x, y);
        return;
      }
      // Save state BEFORE a stroke so the stroke can be undone
      saveState();
      drawing = true;
      lastX = x; lastY = y;
    }

    function draw(e) {
      if (!drawing) return;
      e.preventDefault();
      const [x, y] = getPos(e);
      if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
      } else {
        ctx.strokeStyle = colorInput.value || '#000';
      }
      ctx.lineWidth = sizeInput.value || 4;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x; lastY = y;
    }

    function stop(e) {
      drawing = false;
    }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stop);

    // Don't stop on mouseout so users can re-enter and resume drawing.
    // Instead, resume drawing when re-entering while the primary button is pressed,
    // and listen for global mouseup to stop if release happens outside the canvas.
    canvas.addEventListener('mouseenter', (e) => {
      try {
        if (e.buttons && (e.buttons & 1)) {
          const [x, y] = getPos(e);
          lastX = x; lastY = y;
          drawing = true;
        }
      } catch (err) { /* ignore */ }
    });

    window.addEventListener('mouseup', stop);

    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stop);
    // Touch may be cancelled (e.g., system gestures); ensure drawing stops
    canvas.addEventListener('touchcancel', stop);

    clearBtn.addEventListener('click', () => {
      // Save previous state so the Clear action can be undone
      saveState();
      // Paint a white background to replace transparency
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width / lastDpi, canvas.height / lastDpi);
    });

    saveBtn.addEventListener('click', () => {
      // Export as WEBP with compression and submit via HTMX form
      let dataUrl;
      try {
        dataUrl = canvas.toDataURL('image/webp', WEBP_QUALITY);
      } catch (e) {
        // Fallback if WEBP not supported
        dataUrl = canvas.toDataURL('image/png');
      }

      hiddenInput.value = dataUrl;

      // Create a temporary submit button so HTMX picks up the submit event
      const tempBtn = document.createElement('button');
      tempBtn.type = 'submit';
      tempBtn.style.display = 'none';
      form.appendChild(tempBtn);
      tempBtn.click();

      setTimeout(() => {
        tempBtn.remove();
      }, 1000);
    });
  }

  // Initialize all current and future drawing forms
  document.querySelectorAll('.answer-image-form').forEach(initDrawingForm);

  // If HTMX swaps new content in, initialize newly inserted forms
  document.body.addEventListener('htmx:afterSwap', (evt) => {
    const swapped = evt.detail?.target;
    if (!swapped) return;
    swapped.querySelectorAll('.answer-image-form').forEach(initDrawingForm);
  });
});