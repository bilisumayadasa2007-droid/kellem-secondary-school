// Real accounts powered by Netlify Identity.
import {
  login, signup, logout, getUser, handleAuthCallback, requestPasswordRecovery,
  updateUser, onAuthChange, AuthError, MissingIdentityError
} from 'https://esm.sh/@netlify/identity@2.0.0';

const form = document.getElementById('auth-form');
const alertBox = document.getElementById('auth-alert');
const submitBtn = document.getElementById('auth-submit');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const signedInPanel = document.getElementById('account-signed-in');
const tabs = document.querySelector('.account-tabs');
let mode = 'signin'; // signin | signup | reset

function showAlert(text, type = 'error') {
  alertBox.textContent = text;
  alertBox.className = `account-alert ${type}`;
  alertBox.hidden = !text;
}

function setMode(next) {
  mode = next;
  showAlert('');
  document.querySelectorAll('.account-tab').forEach(t => t.classList.toggle('active', t.dataset.authTab === next));
  document.querySelectorAll('[data-signup-only]').forEach(el => { el.hidden = next !== 'signup'; });
  document.querySelectorAll('[data-signin-only]').forEach(el => { el.hidden = next !== 'signin'; });
  form.querySelector('[data-auth-email]').hidden = next === 'reset';
  tabs.hidden = next === 'reset';
  document.getElementById('auth-name').required = next === 'signup';
  passwordInput.autocomplete = next === 'signin' ? 'current-password' : 'new-password';
  passwordInput.placeholder = next === 'reset' ? 'New password (6+ characters)' : 'Password (6+ characters)';
  submitBtn.textContent = { signin: 'Sign in', signup: 'Create my account', reset: 'Save new password' }[next];
  const sw = document.getElementById('auth-switch');
  sw.hidden = next === 'reset';
  sw.innerHTML = next === 'signin'
    ? 'New to Kellem Portal? <button type="button" class="link-btn" data-auth-tab="signup">Create account</button>'
    : 'Already have an account? <button type="button" class="link-btn" data-auth-tab="signin">Sign in</button>';
}

function friendlyError(error) {
  if (error instanceof MissingIdentityError) return 'Accounts are not available right now. Please try again later.';
  if (error instanceof AuthError) {
    const msg = (error.message || '').toLowerCase();
    if (error.status === 401 || msg.includes('invalid')) return 'Incorrect email or password.';
    if (msg.includes('not confirmed')) return 'Please confirm your email first — check your inbox.';
    if (msg.includes('already') || msg.includes('registered')) return 'An account with this email already exists. Please sign in.';
    if (error.status === 403) return 'New sign-ups are currently closed.';
    if (error.status === 422) return 'Please check your email and use a password with at least 6 characters.';
    return error.message || 'Something went wrong. Please try again.';
  }
  return 'Network error. Please check your connection and try again.';
}

// Keep the school's student list in sync when a student signs in for the first time.
function addToStudentList(user) {
  const meta = user.userMetadata || {};
  if (meta.role !== 'student' || typeof getStudents !== 'function') return;
  const name = (meta.full_name || user.name || '').trim();
  if (!name) return;
  const list = getStudents();
  if (list.some(s => s.name.toLowerCase() === name.toLowerCase())) return;
  list.push({ name, className: meta.class_name || 'Student', points: 0 });
  saveStudents(list);
  renderStudents();
}

function renderUser(user) {
  form.hidden = !!user;
  tabs.hidden = !!user || mode === 'reset';
  signedInPanel.hidden = !user;
  document.querySelectorAll('.nav-auth').forEach(a => { a.textContent = user ? '👤 My Account' : '🔐 Log In / Sign Up'; });
  if (!user) return;
  const meta = user.userMetadata || {};
  const name = meta.full_name || user.name || user.email;
  const role = meta.role === 'teacher' ? 'Teacher' : 'Student';
  document.getElementById('account-avatar').textContent = (name || 'K').trim().charAt(0).toUpperCase();
  document.getElementById('account-welcome').textContent = `Welcome, ${name}!`;
  let details = `${role} • ${user.email}`;
  if (meta.class_name) details += ` • ${meta.class_name}`;
  if (role === 'Student' && typeof getStudents === 'function') {
    const me = getStudents().find(s => s.name.toLowerCase() === String(name).toLowerCase());
    if (me) details += ` • ⭐ ${Number(me.points) || 0} points`;
  }
  document.getElementById('account-details').textContent = details;
  addToStudentList(user);
}

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-auth-tab]');
  if (tab) setMode(tab.dataset.authTab);
});

document.getElementById('toggle-password').addEventListener('click', e => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  e.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  e.currentTarget.classList.toggle('on', show);
});

document.getElementById('forgot-btn').addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if (!email) { showAlert('Enter your email address above, then tap “Forgot password?” again.'); emailInput.focus(); return; }
  try {
    await requestPasswordRecovery(email);
    showAlert('If an account exists for this email, a password reset link is on its way.', 'success');
  } catch (error) { showAlert(friendlyError(error)); }
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (mode !== 'reset' && !email) return showAlert('Please enter your email address.');
  if (password.length < 6) return showAlert('Password must be at least 6 characters.');

  submitBtn.disabled = true;
  const label = submitBtn.textContent;
  submitBtn.textContent = 'Please wait…';
  try {
    if (mode === 'signin') {
      renderUser(await login(email, password));
    } else if (mode === 'signup') {
      const fullName = document.getElementById('auth-name').value.trim();
      if (!fullName) throw new Error('name');
      const role = form.querySelector('input[name="role"]:checked').value;
      const className = document.getElementById('auth-class').value.trim();
      const user = await signup(email, password, { full_name: fullName, role, class_name: className });
      if (user.confirmedAt) {
        renderUser(user);
      } else {
        setMode('signin');
        emailInput.value = email;
        showAlert('Account created! Check your email and click the confirmation link, then sign in.', 'success');
      }
    } else {
      const user = await updateUser({ password });
      setMode('signin');
      renderUser(user);
    }
    passwordInput.value = '';
  } catch (error) {
    showAlert(error.message === 'name' ? 'Please enter your full name.' : friendlyError(error));
  } finally {
    submitBtn.disabled = false;
    if (submitBtn.textContent === 'Please wait…') submitBtn.textContent = label;
  }
});

document.getElementById('signout-btn').addEventListener('click', async () => {
  try { await logout(); } catch (_) { /* session already cleared */ }
  renderUser(null);
});

onAuthChange((event, user) => { if (mode !== 'reset') renderUser(user); });

// Handle links from confirmation and password-reset emails, then restore any existing session.
(async () => {
  try {
    const result = await handleAuthCallback();
    if (result?.type === 'recovery') {
      setMode('reset');
      renderUser(null);
      form.hidden = false;
      showAlert('Choose a new password for your account.', 'success');
      document.getElementById('student-login').scrollIntoView();
      return;
    }
    if (result?.type === 'confirmation') {
      document.getElementById('student-login').scrollIntoView();
    }
  } catch (error) {
    showAlert(friendlyError(error));
  }
  renderUser(await getUser());
})();
