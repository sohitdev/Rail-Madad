const API_BASE = 'http://localhost:3000';

const form = document.getElementById('trackForm');
const mobileInput = document.getElementById('track_mobile');
const otpInput = document.getElementById('track_otp');
const pnrInput = document.getElementById('track_pnr');
const statusBox = document.getElementById('track_status');
const resultBox = document.getElementById('track_result');

const getOtpBtn = document.getElementById('trackGetOtpBtn');
const verifyOtpBtn = document.getElementById('trackVerifyOtpBtn');
const resendOtpBtn = document.getElementById('trackResendOtpBtn');

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

function resetState() {
  otpVerified = false;
}

mobileInput.addEventListener('input', resetState);
otpInput.addEventListener('input', resetState);

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

  if (!otpVerified) {
    alert('Please verify OTP before tracking complaint.');
    return;
  }

  try {
    const params = new URLSearchParams({ mobile_number: mobile });
    if (pnr) {
      params.set('pnr_number', pnr);
    }

    const res = await fetch(`${API_BASE}/track-complaint?${params.toString()}`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      statusBox.textContent = 'Not found';
      resultBox.value = result.message || 'No complaint found for provided details.';
      return;
    }

    const data = result.data;
    statusBox.textContent = data.status || 'Pending';
    resultBox.value = [
      `Complaint ID: ${data.id}`,
      `Department: ${data.department || 'General'}`,
      `Status: ${data.status || 'Pending'}`,
      `Remark: ${data.remark || 'No remark yet'}`,
      `Description: ${data.description || ''}`,
      `Created: ${new Date(data.created_at).toLocaleString()}`
    ].join('\n');
  } catch (error) {
    console.error('Track complaint error:', error);
    statusBox.textContent = 'Error';
    resultBox.value = 'Could not track complaint due to a network/server error.';
  }
});

form.addEventListener('reset', () => {
  generatedOTP = '';
  otpVerified = false;
  statusBox.textContent = 'Not fetched';
  resultBox.value = '';
});
