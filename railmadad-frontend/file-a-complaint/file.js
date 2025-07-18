 document.querySelector('#complaintForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const inputs = document.querySelectorAll('#complaintForm input, #complaintForm textarea');
  formData.set("mobile_number", inputs[0].value);
  formData.set("otp", inputs[1].value);
  formData.set("pnr_number", inputs[2].value);
  formData.set("recent_station", inputs[3].value);
  formData.set("incident_date", inputs[4].value);
  formData.set("file", inputs[5].files[0]);
  formData.set("description", inputs[6].value);

  const res = await fetch('http://localhost:3000/submit-complaint', {
    method: 'POST',
    body: formData
  });

  const result = await res.json();
  alert(result.message);
});

let generatedOTP = "";

  // Handle Get OTP
  document.querySelector(".mini-btn").addEventListener("click", function (e) {
    e.preventDefault();

    const mobileInput = document.querySelector("input[placeholder='Enter your number ']");
    const mobile = mobileInput.value.trim();

    if (!/^\d{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Generate 6-digit OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    alert("Your OTP is: " + generatedOTP);  // Show OTP to user
  });

  // Handle Submit OTP
  document.querySelector(".otp-actions .mini-btn").addEventListener("click", function (e) {
    e.preventDefault();

    const enteredOTP = document.querySelector("input[placeholder='Enter OTP']").value.trim();

    if (enteredOTP === generatedOTP && generatedOTP !== "") {
      alert("✅ OTP verified successfully!");
    } else {
      alert("❌ OTP verification failed!");
    }
  });

  // OPTIONAL: Handle "Resend OTP"
document.querySelector(".resend").addEventListener("click", function (e) {
  e.preventDefault();

  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  alert("🔁 New OTP is: " + generatedOTP); // Again, for testing only
});