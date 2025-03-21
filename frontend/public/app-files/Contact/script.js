document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Get form values
    const fromName = document.getElementById("name").value;
    const fromEmail = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // EmailJS service details
    const serviceID = "service_xndiskl";
    const templateID = "template_s1w7rhg";
    const publicKey = "MB-kK6pXHR_v2LmVE";

    // Validate input fields
    if (!fromName || !fromEmail || !message) {
      alert("Please fill in all fields.");
      return;
    }

    // Send email using EmailJS
    emailjs
      .send(
        serviceID,
        templateID,
        {
          from_name: fromName,
          from_email: fromEmail,
          message: message,
        },
        publicKey
      )
      .then((response) => {
        alert("Message sent successfully!");
        document.getElementById("contactForm").reset(); // Clear form after success
      })
      .catch((error) => {
        alert("Failed to send message. Please try again.");
        console.error("EmailJS Error:", error);
      });
  });
