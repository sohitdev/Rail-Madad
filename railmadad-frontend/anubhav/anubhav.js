const stars = document.querySelectorAll('.star-rating .star');
  let selectedRating = 0;

  stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => highlight(index));
    star.addEventListener('mouseout', () => highlight(selectedRating - 1));
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      highlight(index);
      stars.forEach((s, i) => {
        s.setAttribute('aria-checked', i === index);
      });
    });
  });

  function highlight(index) {
    stars.forEach((star, i) => {
      star.classList.toggle('hovered', i <= index);
    });
  }


  //submit-feedback
  document.querySelector('.form-grid').addEventListener('submit', async function (e) {
  e.preventDefault(); 

  
  const mobile       = document.getElementById('mobile').value.trim();
  const otp          = document.getElementById('otp').value.trim();
  const pnr          = document.getElementById('pnr').value.trim();
  const feedbackText = document.getElementById('feedback-text').value.trim();
  const rating       = selectedRating || document.querySelectorAll('.star.hovered').length;

 
  if (!mobile || !otp || !feedbackText) {
    alert('Please fill all mandatory fields.');
    return;
  }

 
  try {
    const res = await fetch('http://localhost:3000/submit-feedback', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ mobile, otp, pnr, rating, feedbackText })
    });

    const result = await res.json();
    alert(result.message || 'Feedback submitted!');
    if (result.success) {
      this.reset();           // clear the form
      highlight(-1);          // reset stars visual
      selectedRating = 0;     // reset rating state
    }
  } catch (err) {
    console.error('❌ Feedback submit error:', err);
    alert('Something went wrong. Please try again later.');
  }
});



let generatedOTP = "";

// Handle "Get OTP"
document.querySelector('#mobile').nextElementSibling.addEventListener("click", function (e) {
  e.preventDefault();

  const mobile = document.getElementById("mobile").value.trim();
  if (!/^\d{10}$/.test(mobile)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  // Generate 6-digit OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  alert("Your OTP is: " + generatedOTP); // For testing/demo only
});

// Handle OTP Submit button (verifies OTP only, doesn't submit full feedback)
document.querySelector('.otp-actions .mini-btn[type="submit"]').addEventListener("click", function (e) {
  e.preventDefault();

  const enteredOTP = document.getElementById("otp").value.trim();
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