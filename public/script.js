let currentTab = 'crusades';
let currentEditingId = null;
let currentData = [];

function getAuthHeader() {
  const pwd = sessionStorage.getItem('rgm_admin_pwd') || '';
  return { 'Authorization': `Basic ${btoa(':' + pwd)}`, 'Content-Type': 'application/json' };
}

async function loginAdmin() {
  const pwdInput = document.getElementById('authPasswordInput');
  const errorEl = document.getElementById('authError');
  const pwd = pwdInput.value.trim();
  
  if (!pwd) return;
  errorEl.style.display = 'none';

  try {
    const res = await fetch('/api/admin/verify', {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Invalid Password');
    
    sessionStorage.setItem('rgm_admin_pwd', pwd);
    document.getElementById('authOverlay').style.display = 'none';
    loadCurrentTab();
  } catch (err) {
    errorEl.textContent = 'Incorrect password. Access denied.';
    errorEl.style.display = 'block';
  }
}

// ... rest of script.js ...
