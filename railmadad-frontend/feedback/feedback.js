const API_BASE = 'http://localhost:3000';

const form = document.getElementById('feedbackForm');
const mobileInput = document.getElementById('mobile');
const otpInput = document.getElementById('otp');
const pnrInput = document.getElementById('pnr');
const feedbackInput = document.getElementById('feedback-text');

const getOtpBtn = document.getElementById('feedbackGetOtpBtn');
const verifyOtpBtn = document.getElementById('feedbackVerifyOtpBtn');
const resendOtpBtn = document.getElementById('feedbackResendOtpBtn');

const stars = document.querySelectorAll('.star-rating .star');
let selectedRating = 0;
let generatedOTP = '';
let otpVerified = false;

function isValidMobile(value) {
  return /^\d{10}$/.test(String(value || '').trim());
}

function isValidOtp(value) {
  return /^\d{6}$/.test(String(value || '').trim());
}

function isValidPnr(value) {
  return !value || /^\d{10}$/.test(String(value || '').trim());
}

function highlight(index) {
  stars.forEach((star, i) => {
    star.classList.toggle('hovered', i <= index);
  });
}

stars.forEach((star, index) => {
  star.addEventListener('mouseover', () => highlight(index));
  star.addEventListener('mouseout', () => highlight(selectedRating - 1));
  star.addEventListener('click', () => {
    selectedRating = index + 1;
    highlight(index);
    stars.forEach((s, i) => {
      s.setAttribute('aria-checked', String(i === index));
    });
  });
});

function resetOtpVerification() {
  otpVerified = false;
}

mobileInput.addEventListener('input', resetOtpVerification);
otpInput.addEventListener('input', resetOtpVerification);

getOtpBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (!isValidMobile(mobileInput.value)) {
    alert('Please enter a valid 10-digit mobile number.');
    return;
  }

  generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
  otpVerified = false;
  alert(`Your OTP is: ${generatedOTP}`);
});

verifyOtpBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (!generatedOTP) {
    alert('Please generate OTP first.');
    return;
  }

  if (otpInput.value.trim() === generatedOTP) {
    otpVerified = true;
    alert('OTP verified successfully.');
  } else {
    otpVerified = false;
    alert('OTP verification failed.');
  }
});

resendOtpBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (!isValidMobile(mobileInput.value)) {
    alert('Please enter a valid 10-digit mobile number first.');
    return;
  }

  generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
  otpVerified = false;
  alert(`New OTP is: ${generatedOTP}`);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const mobile = mobileInput.value.trim();
  const otp = otpInput.value.trim();
  const pnr = pnrInput.value.trim();
  const feedbackText = feedbackInput.value.trim();

  if (!isValidMobile(mobile)) {
    alert('Mobile number must be 10 digits.');
    return;
  }

  if (!isValidOtp(otp)) {
    alert('OTP must be 6 digits.');
    return;
  }

  if (!isValidPnr(pnr)) {
    alert('PNR must be exactly 10 digits.');
    return;
  }

  if (!feedbackText) {
    alert('Please enter feedback text.');
    return;
  }

  if (!selectedRating) {
    alert('Please select a star rating before submitting.');
    return;
  }

  if (!otpVerified) {
    alert('Please verify OTP before submitting feedback.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/submit-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp, pnr, rating: selectedRating, feedbackText })
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      alert(result.message || 'Failed to submit feedback.');
      return;
    }

    alert(result.message || 'Feedback submitted!');
    form.reset();
    highlight(-1);
    selectedRating = 0;
    generatedOTP = '';
    otpVerified = false;
  } catch (error) {
    console.error('Feedback submit error:', error);
    alert('Something went wrong. Please try again later.');
  }
});

form.addEventListener('reset', () => {
  highlight(-1);
  selectedRating = 0;
  generatedOTP = '';
  otpVerified = false;
});
