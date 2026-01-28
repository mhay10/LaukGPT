// Handle Enter to submit and Shift+Enter to insert newline for textareas
document.addEventListener('keydown', function (event) {
  const target = event.target;
  if (!target) return;
  // Only act for textareas inside an answer form or general forms used in the app
  const isAnswerTextarea = target.tagName === 'TEXTAREA' && target.closest('form');
  if (!isAnswerTextarea) return;

  // If Enter without Shift -> submit
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    const form = target.closest('form');
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.click();
    } else {
      // Fallback: dispatch a submit event so HTMX will process it
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  }
});
