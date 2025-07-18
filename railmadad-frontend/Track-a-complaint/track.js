function setStatus(button) {
    const allButtons = document.querySelectorAll('.status-boxes .status-pill');
    allButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  }

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