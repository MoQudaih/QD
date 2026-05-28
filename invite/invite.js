import { auth, db } from '../firebase.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const loadingEl = document.getElementById('invite-loading');
const emptyEl = document.getElementById('invite-empty');
const pageEl = document.getElementById('invite-page');
const langToggleEl = document.getElementById('invite-lang-toggle');
const audioToggleEl = document.getElementById('invite-audio-toggle');
const audioCtaEl = document.getElementById('invite-audio-cta');
const audioPlayerEl = document.getElementById('invite-audio-player');
const rsvpFormEl = document.getElementById('invite-rsvp-form');
const rsvpSectionEl = document.getElementById('invite-rsvp-section');
const rsvpFeedbackEl = document.getElementById('invite-rsvp-feedback');
const audioSectionEl = document.getElementById('invite-audio-section');

const labels = {
  en: {
    invite: 'We invite you to celebrate',
    countdownLabel: 'Countdown',
    countdownHeading: 'Counting down to the big day',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    location: 'Location',
    openLocation: 'Open Location',
    rsvp: 'RSVP',
    rsvpHeading: 'Confirm your attendance',
    name: 'Name',
    phone: 'Phone',
    attending: 'Attending',
    attendingYes: 'Attending',
    attendingNo: 'Not Attending',
    guests: 'Number of guests',
    message: 'Message',
    send: 'Send RSVP',
    share: 'Share on WhatsApp',
    playMusic: 'Tap to play music',
    pauseMusic: 'Pause music',
    missing: 'Invitation not found',
    inactive: 'This invitation is not currently active.',
    invalid: 'This invitation link is missing or invalid.',
    rsvpSuccess: 'Thank you. Your RSVP has been received.',
    rsvpError: 'Could not submit RSVP right now. Please try again.',
    countdownPassed: 'This celebration date has already passed.'
  },
  ar: {
    invite: 'ندعوكم للاحتفال',
    countdownLabel: 'العد التنازلي',
    countdownHeading: 'نعد اللحظات حتى الموعد',
    days: 'أيام',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثواني',
    location: 'الموقع',
    openLocation: 'افتح الموقع',
    rsvp: 'تأكيد الحضور',
    rsvpHeading: 'أكدوا حضوركم',
    name: 'الاسم',
    phone: 'الهاتف',
    attending: 'الحضور',
    attendingYes: 'سأحضر',
    attendingNo: 'لن أحضر',
    guests: 'عدد الضيوف',
    message: 'رسالة',
    send: 'إرسال تأكيد الحضور',
    share: 'مشاركة عبر واتساب',
    playMusic: 'اضغط لتشغيل الموسيقى',
    pauseMusic: 'إيقاف الموسيقى',
    missing: 'لم يتم العثور على الدعوة',
    inactive: 'هذه الدعوة غير مفعلة حالياً.',
    invalid: 'رابط الدعوة غير صالح أو مفقود.',
    rsvpSuccess: 'شكراً لكم، تم استلام تأكيد الحضور.',
    rsvpError: 'تعذر إرسال التأكيد حالياً، يرجى المحاولة مرة أخرى.',
    countdownPassed: 'لقد مضى موعد هذا الاحتفال بالفعل.'
  }
};

const themeColorMap = {
  'royal-gold': '#d9b45f',
  'minimal-white': '#b98f56',
  'modern-black': '#7dd3fc',
  'arabic-luxury': '#d6b461',
  'floral-elegant': '#f4a6b8'
};

const state = {
  invitation: null,
  language: 'en',
  countdownTimer: null,
  isAudioPlaying: false
};

const withTimeout = (promise, ms = 12000) => Promise.race([
  promise,
  new Promise((_, reject) => {
    window.setTimeout(() => reject(new Error('Invitation request timed out.')), ms);
  })
]);

const stopLoading = () => {
  loadingEl.hidden = true;
};

const ensureResolvedState = () => {
  stopLoading();
  if (!pageEl.hidden || !emptyEl.hidden) return;
  showEmpty('The invitation could not be rendered.', 'Invitation unavailable');
};

const getRequestContext = () => {
  const params = new URLSearchParams(window.location.search);
  const preview = params.get('preview') === '1';
  const invitationId = String(params.get('invitationId') || params.get('id') || '').trim();
  const fromQuery = String(params.get('slug') || '').trim().toLowerCase();
  if (fromQuery) {
    return { slug: fromQuery, preview, invitationId };
  }

  const cleanPath = window.location.pathname.replace(/\/+$/, '');
  const parts = cleanPath.split('/').filter(Boolean).map((part) => decodeURIComponent(part.trim().toLowerCase()));
  const idx = parts.indexOf('invite');
  const slug = idx >= 0 && parts[idx + 1] && parts[idx + 1] !== 'index.html'
    ? parts[idx + 1]
    : '';

  return { slug, preview, invitationId };
};

const esc = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatEventDate = (dateValue, lang) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-AE' : 'en-GB', { dateStyle: 'full' }).format(date);
};

const buildEventDateTime = (invitation) => {
  if (!invitation?.eventDate) return null;
  const raw = invitation.eventTime ? `${invitation.eventDate}T${invitation.eventTime}` : `${invitation.eventDate}T18:00`;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getShareMessage = (invitation, lang) => {
  const names = invitation.coupleDisplayName || `${invitation.brideName || ''} & ${invitation.groomName || ''}`.trim();
  const link = window.location.href;
  if (lang === 'ar') {
    return `ندعوكم لحضور زفاف ${names}. رابط الدعوة: ${link}`;
  }
  return `You are invited to celebrate ${names}. View invitation: ${link}`;
};

const setTheme = (theme) => {
  document.body.dataset.theme = theme || 'royal-gold';
  const themeColor = themeColorMap[theme] || '#d9b45f';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
};

const showEmpty = (message, title) => {
  stopLoading();
  pageEl.hidden = true;
  emptyEl.hidden = false;
  emptyEl.innerHTML = `
    <div class="invite-empty-card">
      <div class="invite-empty-badge">Wedding Invitation</div>
      <h1>${esc(title)}</h1>
      <p>${esc(message)}</p>
    </div>
  `;
};

const waitForAuthReady = (timeoutMs = 8000) => new Promise((resolve) => {
  let settled = false;
  const finish = (user) => {
    if (settled) return;
    settled = true;
    resolve(user || null);
  };

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();
    finish(user);
  }, () => {
    unsubscribe();
    finish(null);
  });

  window.setTimeout(() => {
    try { unsubscribe(); } catch {}
    finish(auth.currentUser || null);
  }, timeoutMs);
});

const classifyInviteError = (error, { preview = false } = {}) => {
  const code = String(error?.code || '').toLowerCase();
  const message = String(error?.message || '').toLowerCase();
  if (code.includes('permission') || message.includes('permission')) {
    return preview
      ? { title: 'Preview unavailable', message: 'This preview requires an authenticated admin session.' }
      : { title: labels.en.missing, message: 'This invitation is unavailable for public viewing.' };
  }
  if (message.includes('timed out')) {
    return { title: 'Connection timed out', message: 'The invitation took too long to load. Please refresh and try again.' };
  }
  return { title: 'Invitation unavailable', message: 'A loading error occurred while fetching this invitation.' };
};

const applyLanguage = () => {
  const invitation = state.invitation;
  if (!invitation) return;

  const lang = state.language;
  const copy = labels[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
  document.body.dir = dir;
  document.title = `${invitation.coupleDisplayName || `${invitation.brideName || ''} & ${invitation.groomName || ''}`.trim()} | Wedding Invitation`;

  document.getElementById('invite-kicker').textContent = copy.invite;
  document.getElementById('invite-countdown-label').textContent = copy.countdownLabel;
  document.getElementById('invite-countdown-heading').textContent = copy.countdownHeading;
  document.getElementById('label-days').textContent = copy.days;
  document.getElementById('label-hours').textContent = copy.hours;
  document.getElementById('label-minutes').textContent = copy.minutes;
  document.getElementById('label-seconds').textContent = copy.seconds;
  document.getElementById('invite-location-label').textContent = copy.location;
  document.getElementById('invite-location-btn').textContent = copy.openLocation;
  document.getElementById('invite-location-link').textContent = copy.openLocation;
  document.getElementById('invite-rsvp-label').textContent = copy.rsvp;
  document.getElementById('invite-rsvp-heading').textContent = copy.rsvpHeading;
  document.getElementById('label-rsvp-name').textContent = copy.name;
  document.getElementById('label-rsvp-phone').textContent = copy.phone;
  document.getElementById('label-rsvp-attending').textContent = copy.attending;
  document.getElementById('option-attending-yes').textContent = copy.attendingYes;
  document.getElementById('option-attending-no').textContent = copy.attendingNo;
  document.getElementById('label-rsvp-guests').textContent = copy.guests;
  document.getElementById('label-rsvp-message').textContent = copy.message;
  document.getElementById('invite-rsvp-submit').textContent = copy.send;
  document.getElementById('invite-whatsapp-btn').textContent = copy.share;
  langToggleEl.textContent = lang === 'ar' ? 'EN' : 'AR';
  const musicLabel = state.isAudioPlaying ? copy.pauseMusic : copy.playMusic;
  audioToggleEl.textContent = musicLabel;
  audioCtaEl.textContent = musicLabel;

  document.getElementById('invite-couple').textContent = invitation.coupleDisplayName || (lang === 'ar'
    ? `${invitation.brideName || ''} و ${invitation.groomName || ''}`.trim()
    : `${invitation.brideName || ''} & ${invitation.groomName || ''}`.trim());
  document.getElementById('invite-title').textContent = invitation.eventTitle || 'Wedding Invitation';
  document.getElementById('invite-date').textContent = formatEventDate(invitation.eventDate, lang);
  document.getElementById('invite-time').textContent = invitation.eventTime || '';
};

const updateCountdown = () => {
  const target = buildEventDateTime(state.invitation);
  const noteEl = document.getElementById('invite-countdown-note');
  if (!target) {
    noteEl.textContent = '';
    return;
  }

  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    document.getElementById('count-days').textContent = '00';
    document.getElementById('count-hours').textContent = '00';
    document.getElementById('count-minutes').textContent = '00';
    document.getElementById('count-seconds').textContent = '00';
    noteEl.textContent = labels[state.language].countdownPassed;
    return;
  }

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  document.getElementById('count-days').textContent = String(days).padStart(2, '0');
  document.getElementById('count-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('count-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('count-seconds').textContent = String(remainingSeconds).padStart(2, '0');
  noteEl.textContent = '';
};

const bindAudio = () => {
  const musicUrl = state.invitation?.musicUrl;
  if (!musicUrl) {
    audioSectionEl.hidden = true;
    audioToggleEl.hidden = true;
    return;
  }

  audioSectionEl.hidden = false;
  audioToggleEl.hidden = false;
  audioPlayerEl.src = musicUrl;

  const toggle = async () => {
    try {
      if (state.isAudioPlaying) {
        audioPlayerEl.pause();
        state.isAudioPlaying = false;
      } else {
        await audioPlayerEl.play();
        state.isAudioPlaying = true;
      }
      applyLanguage();
    } catch (error) {
      console.warn('[invite-audio] playback failed:', error?.message || error);
    }
  };

  audioToggleEl.onclick = toggle;
  audioCtaEl.onclick = toggle;
  audioPlayerEl.onpause = () => {
    state.isAudioPlaying = false;
    applyLanguage();
  };
  audioPlayerEl.onplay = () => {
    state.isAudioPlaying = true;
    applyLanguage();
  };
};

const bindRsvp = () => {
  if (!state.invitation?.rsvpEnabled) {
    rsvpSectionEl.hidden = true;
    return;
  }
  rsvpSectionEl.hidden = false;

  rsvpFormEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(rsvpFormEl);
    const name = String(formData.get('name') || '').trim();
    if (!name) {
      rsvpFeedbackEl.textContent = labels[state.language].rsvpError;
      return;
    }

    const payload = {
      name,
      phone: String(formData.get('phone') || '').trim(),
      attending: formData.get('attending') === 'no' ? 'no' : 'yes',
      guests: Math.max(1, Number(formData.get('guests') || 1)),
      message: String(formData.get('message') || '').trim(),
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'weddingInvitations', state.invitation.id, 'rsvps'), payload);
      await updateDoc(doc(db, 'weddingInvitations', state.invitation.id), {
        rsvpCount: Number(state.invitation.rsvpCount || 0) + 1
      });
      state.invitation.rsvpCount = Number(state.invitation.rsvpCount || 0) + 1;
      rsvpFormEl.reset();
      rsvpFeedbackEl.textContent = labels[state.language].rsvpSuccess;
    } catch (error) {
      console.error('[invite-rsvp] failed:', error);
      rsvpFeedbackEl.textContent = labels[state.language].rsvpError;
    }
  }, { once: true });
};

const incrementViews = async () => {
  try {
    await updateDoc(doc(db, 'weddingInvitations', state.invitation.id), {
      views: Number(state.invitation.views || 0) + 1
    });
  } catch (error) {
    console.warn('[invite-view] increment skipped:', error?.message || error);
  }
};

const renderInvitation = () => {
  const invitation = state.invitation;
  if (!invitation) return;

  setTheme(invitation.theme);
  loadingEl.hidden = true;
  emptyEl.hidden = true;
  pageEl.hidden = false;

  const heroMediaEl = document.getElementById('invite-hero-media');
  heroMediaEl.style.backgroundImage = invitation.coverImageUrl
    ? `${getComputedStyle(heroMediaEl).backgroundImage}, url("${invitation.coverImageUrl}")`
    : getComputedStyle(heroMediaEl).backgroundImage;

  document.getElementById('invite-venue-name').textContent = invitation.venueName || '';
  document.getElementById('invite-venue-address').textContent = invitation.venueAddress || '';
  document.getElementById('invite-location-btn').href = invitation.mapUrl || '#';
  document.getElementById('invite-location-link').href = invitation.mapUrl || '#';
  document.getElementById('invite-whatsapp-btn').onclick = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(getShareMessage(invitation, state.language))}`, '_blank', 'noopener,noreferrer');
  };

  applyLanguage();
  updateCountdown();
  clearInterval(state.countdownTimer);
  state.countdownTimer = window.setInterval(updateCountdown, 1000);
  bindAudio();
  bindRsvp();
  incrementViews();
};

const loadInvitation = async () => {
  const { slug, preview, invitationId } = getRequestContext();
  console.log('[invite] extracted slug:', slug);
  console.log('[invite] preview mode:', preview, 'invitationId:', invitationId || '(none)');
  try {
    let invitation = null;

    if (preview && invitationId) {
      const adminUser = await waitForAuthReady();
      console.log('[invite] preview auth user:', adminUser?.email || '(none)');
      const docSnap = await withTimeout(getDoc(doc(db, 'weddingInvitations', invitationId)));
      console.log('[invite] preview document exists:', docSnap.exists());
      if (docSnap.exists()) {
        invitation = { id: docSnap.id, ...docSnap.data() };
      }
    } else {
      if (!slug) {
        showEmpty(labels.en.invalid, labels.en.missing);
        return;
      }
      const invitationsRef = collection(db, 'weddingInvitations');
      const slugQuery = query(
        invitationsRef,
        where('slug', '==', slug),
        where('active', '==', true),
        limit(1)
      );
      const snapshot = await withTimeout(getDocs(slugQuery));
      console.log('[invite] firestore query result count:', snapshot.size);
      const docSnap = snapshot.docs[0];
      if (docSnap) {
        invitation = { id: docSnap.id, ...docSnap.data() };
      }
    }

    if (!invitation) {
      showEmpty(labels.en.invalid, labels.en.missing);
      return;
    }
    console.log('[invite] loaded invitation data:', invitation);

    if (!preview && (invitation.active === false || invitation.status === 'disabled')) {
      showEmpty(labels.en.inactive, labels.en.missing);
      return;
    }

    state.invitation = invitation;
    state.language = invitation.languageDefault === 'ar' ? 'ar' : 'en';
    renderInvitation();
  } catch (error) {
    console.error('[invite] load failed:', error);
    const view = classifyInviteError(error, { preview });
    console.error('[invite] classified load error:', view);
    showEmpty(view.message, view.title);
  } finally {
    ensureResolvedState();
  }
};

window.addEventListener('error', (event) => {
  console.error('[invite] runtime error:', event.error || event.message || event);
  if (!loadingEl.hidden) {
    showEmpty('A runtime error occurred while rendering the invitation.', 'Invitation unavailable');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[invite] unhandled promise rejection:', event.reason || event);
  if (!loadingEl.hidden) {
    showEmpty('A loading error occurred while rendering the invitation.', 'Invitation unavailable');
  }
});

langToggleEl.addEventListener('click', () => {
  state.language = state.language === 'ar' ? 'en' : 'ar';
  applyLanguage();
  updateCountdown();
});

loadInvitation();
