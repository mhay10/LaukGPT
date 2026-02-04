// Toggle placeholder and submit button label for image requests on the user form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form[hx-post="/api/questions"]');
  if (!form) return;

  const textarea = form.querySelector('textarea[name="question"]');
  const checkbox = document.getElementById('isImage');
  const submitBtn = form.querySelector('button[type="submit"]');

  const toggle = () => {
    const isImage = !!checkbox?.checked;
    if (isImage) {
      textarea.placeholder = 'Describe the image (colors, style, mood)...';
      if (submitBtn) submitBtn.textContent = '🖼️ Request Image';
    } else {
      textarea.placeholder = 'Ask me anything... I\'m here to help!';
      if (submitBtn) submitBtn.textContent = '🚀 Submit Question';
    }
  };

  if (checkbox) {
    checkbox.addEventListener('change', toggle);
  }

  // When the form resets (HTMX after-request reset), ensure state updates
  form.addEventListener('reset', () => {
    setTimeout(toggle, 0);
  });

  // Initialize state
  toggle();
});