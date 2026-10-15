

const typingText = document.getElementById("typing-text");

// 1. The list of roles you want to rotate through
const roles = [
  "Frontend Developer",
  "JavaScript Builder",
  "Problem Solver",
  "Responsive UI Designer"
];

let roleIndex = 0;       
let charIndex = 0;       
let isDeleting = false;  

function typeEffect() {
  if (!typingText) return; // Safety check in case the element isn't found

  const currentRole = roles[roleIndex];

  // If deleting, remove one letter; otherwise, add one letter
  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  // Paint the current slice of text onto the screen
  typingText.textContent = currentRole.substring(0, charIndex);

  // Default typing speed
  let speed = 110;

  // Faster speed when backspacing/deleting
  if (isDeleting) {
    speed = 60;
  }

  // 1. When the full word is finished typing: Pause, then start deleting
  
  if (!isDeleting && charIndex === currentRole.length) {
    speed = 1800; // Pause for 1.8 seconds so people can read it
    isDeleting = true;
  } 
  // 2. When the word is completely erased: Move to the next word in the list
  else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length; // Loops back to 0 when it reaches the end
    speed = 400; // Short pause before starting the new word
  }

  // Call the function again after the set speed (timing loop)
  setTimeout(typeEffect, speed);
}

// Start the typewriter effect
typeEffect();


// ==========================================
// CRASH-PROOF PROJECT FILTER LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-item");

  console.log("Filter Buttons found:", filterBtns.length);
  console.log("Project Cards found:", projectCards.length);

  filterBtns.forEach(button => {
    button.addEventListener("click", function () {
      
      // 1. Highlight the clicked button
      filterBtns.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      // 2. Read what filter was clicked
      const selectedFilter = this.getAttribute("data-filter");
      console.log("Filter clicked:", selectedFilter);

      // 3. Loop through cards safely (never crashes on null)
      projectCards.forEach(card => {
        const categories = card.getAttribute("data-category") || "";

        if (selectedFilter === "all" || categories.includes(selectedFilter)) {
          card.classList.remove("d-none"); // Show
        } else {
          card.classList.add("d-none");    // Hide
        }
      });

    });
  });

});



// ==========================================
// CONTACT SECTION: COOKIES + FETCH API
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  
  const contactForm = document.getElementById("contactForm");
  const senderNameInput = document.getElementById("senderName");
  const senderEmailInput = document.getElementById("senderEmail");
  const cookieGreeting = document.getElementById("cookieGreeting");
  const savedNameSpan = document.getElementById("savedName");
  const submitBtn = document.getElementById("submitBtn");
  const successMsg = document.getElementById("formSuccessMsg");
  const errorMsg = document.getElementById("formErrorMsg");

  // 1. COOKIE HELPER FUNCTIONS
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  }

  // 2. CHECK COOKIE ON PAGE LOAD: Did this person visit before?
  const rememberedName = getCookie("khalid_visitor_name");
  if (rememberedName) {
    // Show the "Welcome back" alert and pre-fill their name!
    savedNameSpan.innerText = decodeURIComponent(rememberedName);
    cookieGreeting.classList.remove("d-none");
    senderNameInput.value = decodeURIComponent(rememberedName);
  }

  // 3. FETCH API: Send Form Data Without Page Refresh
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault(); // Stop standard page reload

      // UI state: Sending...
      submitBtn.innerText = "Sending Message...";
      submitBtn.disabled = true;
      successMsg.classList.add("d-none");
      errorMsg.classList.add("d-none");

      const name = senderNameInput.value.trim();
      const email = senderEmailInput.value.trim();
      const subject = document.getElementById("msgSubject").value.trim();
      const message = document.getElementById("msgBody").value.trim();

      // SAVE COOKIE: Remember their name for 7 days
      setCookie("khalid_visitor_name", encodeURIComponent(name), 7);

      try {
       // 1. Paste your Google Web App URL here:
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzAWyhoVVP4e6vwHrQpNi3t4Qy855QlW5frw5HDtkO7nIEjMILybXXr-PYF2h4T7Axp/exec";

        // 2. Send data directly to your Google Sheet:
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", // Compulsory for Google Apps Script
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            message: message
          })
        });

        // 3. Show Success Alert & reset form
        successMsg.classList.remove("d-none");
        contactForm.reset();

        // 4. Update the cookie greeting live
        savedNameSpan.innerText = name;
        cookieGreeting.classList.remove("d-none");

      } catch (err) {
        console.error("Fetch API error:", err);
        errorMsg.classList.remove("d-none");
      } finally {
        submitBtn.innerText = "Send Message 🚀";
        submitBtn.disabled = false;
      }
    });
    
  }

});

// ==========================================
// FOOTER: DYNAMIC YEAR & BACK TO TOP
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  
  // 1. Automatically sets the current year (Never outdated!)
  const yearSpan = document.getElementById("footerYear");
  if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear();
  }

  // 2. Smooth "Back to Top" Scroll Action
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

});


