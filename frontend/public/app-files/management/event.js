function saveEvent() {
  // Get form values
  let eventName = document.getElementById("eventName").value;
  let location = document.getElementById("location").value;
  let eventImage = document.getElementById("eventImage").files[0]; // ✅ Corrected

  // Create FormData object
  let formData = new FormData();
  formData.append("eventName", eventName);
  formData.append("location", location);

  if (eventImage) {
    formData.append("eventImage", eventImage); // ✅ Sending file correctly
  }

  // Dummy API URL (Replace with actual backend URL)
  const apiUrl = "http://localhost:8080/single";

  fetch(apiUrl, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      alert("Event saved successfully!");
    });
}

async function fetchImages() {
  try {
    let response = await fetch("http://localhost:8080/images"); // Fetch image list
    let images = await response.json();

    let imageContainer = document
      .getElementById("imageContainer")
      .querySelector(".row");
    imageContainer.innerHTML = ""; // Clear previous content

    images.forEach((image) => {
      let imgDiv = document.createElement("div");
      imgDiv.classList.add("col-md-4", "mb-3"); // Bootstrap grid

      let card = document.createElement("div");
      card.classList.add("card");

      let imgElement = document.createElement("img");
      imgElement.src = image.url; // ✅ Fetch image from /uploads/
      imgElement.alt = image.filename;
      imgElement.classList.add("card-img-top");
      imgElement.style.height = "200px"; // Fixed height
      imgElement.style.objectFit = "cover"; // Ensure it fits well

      let cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      let eventDetails = document.createElement("p");
      eventDetails.classList.add("card-text");
      eventDetails.innerText = `📅 Event: ${image.eventName} 📍 Location: ${image.location}`;

      cardBody.appendChild(eventDetails);
      card.appendChild(imgElement);
      card.appendChild(cardBody);
      imgDiv.appendChild(card);
      imageContainer.appendChild(imgDiv);
    });
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

// Load images on page load
document.addEventListener("DOMContentLoaded", fetchImages);
