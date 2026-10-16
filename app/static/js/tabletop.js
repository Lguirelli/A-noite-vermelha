const table = document.querySelector('#table');
const events = document.querySelector('#events');
if (table?.dataset.campaign && table?.dataset.user) {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${proto}://${location.host}/ws/campaign/${table.dataset.campaign}/user/${table.dataset.user}`);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const box = document.createElement('div');
    box.className = 'event';
    if (data.type === 'secret.revealed') {
      box.innerHTML = `<strong>${escapeHtml(data.title)}</strong><p>${escapeHtml(data.body)}</p>`;
    } else {
      box.textContent = JSON.stringify(data);
    }
    events.prepend(box);
  };
}
function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
}
