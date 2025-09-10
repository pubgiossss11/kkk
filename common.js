
/* common frontend functions: auth, theme, nav helpers */
const BOT_TOKEN = "8286513067:AAFnqX5GmZCt1StrcUOeQwiMpZyS5XnvBqA";
const CHAT_ID = "1666813070";

function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

// Theme
function getTheme(){ return localStorage.getItem('theme') || 'dark'; }
function applyTheme(){ if(getTheme()==='light') document.body.classList.add('light'); else document.body.classList.remove('light'); }
function toggleTheme(){ localStorage.setItem('theme', getTheme()==='light' ? 'dark' : 'light'); applyTheme(); }

// Auth localStorage-based (simple)
function currentUser(){ try{ return JSON.parse(localStorage.getItem('user')); }catch(e){return null;} }
function setCurrentUser(u){ localStorage.setItem('user', JSON.stringify(u)); updateAuthUI(); }
function logout(){ localStorage.removeItem('user'); updateAuthUI(); window.location.href='login.html'; }

function updateAuthUI(){
  const u = currentUser();
  const status = document.getElementById('statusArea');
  const btnLogin = document.getElementById('btnLogin');
  const btnLogout = document.getElementById('btnLogout');
  if(u){ if(status) status.textContent = 'Xin chào, ' + (u.display || u.username); if(btnLogin) btnLogin.classList.add('hidden'); if(btnLogout) btnLogout.classList.remove('hidden'); }
  else{ if(status) status.textContent = 'Bạn chưa đăng nhập'; if(btnLogin) btnLogin.classList.remove('hidden'); if(btnLogout) btnLogout.classList.add('hidden'); }
}

// Simple users storage (localStorage). register saves user object {username,password,display}
// For demo only. Passwords stored plain in localStorage — acceptable for demo but not for production.
function findUser(username){ const arr = JSON.parse(localStorage.getItem('users')||'[]'); return arr.find(u=>u.username===username); }
function saveUser(user){ const arr = JSON.parse(localStorage.getItem('users')||'[]'); arr.push(user); localStorage.setItem('users', JSON.stringify(arr)); }

// Orders storage
function saveOrder(order){
  const arr = JSON.parse(localStorage.getItem('orders')||'[]');
  arr.unshift(order); localStorage.setItem('orders', JSON.stringify(arr));
}

function sendTelegram(order){
  const text = `🛒 Đơn hàng mới\nShop: Tập Hoá 2k\nTên: ${order.name}\nSĐT: ${order.phone}\nEmail: ${order.email || 'N/A'}\nSản phẩm: ${order.items.map(i=>i.title+' x'+i.qty).join(', ')}\nTổng: ${order.total} VNĐ`;
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: CHAT_ID, text })
  }).then(r=>r.json()).then(d=>console.log('telegram',d)).catch(e=>console.error('tg err',e));
}

// small helper to format price
function fmt(n){ return Number(n).toLocaleString('vi-VN') + '₫'; }
window.addEventListener('DOMContentLoaded', ()=>{ applyTheme(); updateAuthUI(); });
