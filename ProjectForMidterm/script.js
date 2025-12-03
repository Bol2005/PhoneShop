// Price rates per km
const RATES = {
  moto: 2.5,
  taxi: 4.0,
};

// Google Maps variables
let map;
let pickupMarker;
let destinationMarker;
let directionsService;
let directionsDisplay;

// DOM Elements
const bookingForm = document.getElementById("bookingForm");
const modal = document.getElementById("confirmationModal");
const closeBtn = document.querySelector(".close");
const closeModalBtn = document.querySelector(".btn-close-modal");
const serviceRadios = document.querySelectorAll('input[name="service"]');
const distanceInput = document.getElementById("distance");
const priceAmount = document.getElementById("priceAmount");
const pickupInput = document.getElementById("pickup");
const destinationInput = document.getElementById("destination");
const mapContainer = document.getElementById("map");

// Initialize map when page loads
document.addEventListener("DOMContentLoaded", initializeMap);

function initializeMap() {
  // Set default center (San Francisco - adjust to your preference)
  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

  // Create map
  map = new google.maps.Map(mapContainer, {
    zoom: 14,
    center: defaultCenter,
    mapTypeControl: true,
    fullscreenControl: true,
  });

  // Initialize services
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({
    map: map,
    polylineOptions: {
      strokeColor: "#1e40af",
      strokeWeight: 3,
    },
  });

  // Setup autocomplete for pickup and destination
  setupAutocomplete(pickupInput, "pickup");
  setupAutocomplete(destinationInput, "destination");

  // Map click listeners for manual location selection
  map.addListener("click", (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // Use whichever input field was last focused, or default to pickup
    const focusedInput = document.activeElement;
    if (focusedInput === destinationInput) {
      setLocationFromClick(lat, lng, "destination");
    } else {
      setLocationFromClick(lat, lng, "pickup");
    }
  });

  // Event listeners
  bookingForm.addEventListener("submit", handleBookingSubmit);
  closeBtn.addEventListener("click", closeModal);
  closeModalBtn.addEventListener("click", closeModal);
  serviceRadios.forEach((radio) => radio.addEventListener("change", updatePrice));
  serviceRadios.forEach((radio) => {
    radio.addEventListener("change", updateServiceSelector);
  });

  // Calculate distance when either location changes
  pickupInput.addEventListener("change", () => {
    if (pickupInput.value && destinationInput.value) {
      calculateDistance();
    }
  });

  destinationInput.addEventListener("change", () => {
    if (pickupInput.value && destinationInput.value) {
      calculateDistance();
    }
  });
}

function setupAutocomplete(inputElement, locationType) {
  const options = {
    types: ["geocode"],
  };

  const autocomplete = new google.maps.places.Autocomplete(
    inputElement,
    options
  );

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address;

    if (locationType === "pickup") {
      pickupInput.value = address;
      if (pickupMarker) {
        pickupMarker.setMap(null);
      }
      pickupMarker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: "Pickup Location",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });
    } else if (locationType === "destination") {
      destinationInput.value = address;
      if (destinationMarker) {
        destinationMarker.setMap(null);
      }
      destinationMarker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: "Destination",
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });
    }

    // Center map on the new marker
    map.panTo({ lat, lng });

    // Calculate distance if both locations are set
    if (pickupInput.value && destinationInput.value) {
      calculateDistance();
    }
  });
}

function setLocationFromClick(lat, lng, locationType) {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === "OK" && results[0]) {
      const address = results[0].formatted_address;

      if (locationType === "pickup") {
        pickupInput.value = address;
        if (pickupMarker) {
          pickupMarker.setMap(null);
        }
        pickupMarker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: "Pickup Location",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });
      } else if (locationType === "destination") {
        destinationInput.value = address;
        if (destinationMarker) {
          destinationMarker.setMap(null);
        }
        destinationMarker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: "Destination",
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        });
      }

      // Calculate distance if both locations are set
      if (pickupInput.value && destinationInput.value) {
        calculateDistance();
      }
    }
  });
}

function calculateDistance() {
  if (!pickupInput.value || !destinationInput.value) {
    return;
  }

  directionsService.route(
    {
      origin: pickupInput.value,
      destination: destinationInput.value,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);

        // Get distance from the route
        const route = result.routes[0];
        let totalDistance = 0;

        route.legs.forEach((leg) => {
          totalDistance += leg.distance.value; // in meters
        });

        // Convert to kilometers
        const distanceKm = (totalDistance / 1000).toFixed(2);
        distanceInput.value = distanceKm;

        // Update price
        updatePrice();

        // Fit map to route
        const bounds = new google.maps.LatLngBounds();
        route.legs.forEach((leg) => {
          bounds.extend(leg.start_location);
          bounds.extend(leg.end_location);
        });
        map.fitBounds(bounds, 100);
      } else {
        console.error("Directions request failed:", status);
        alert(
          "Unable to calculate route. Please check the addresses and try again."
        );
      }
    }
  );
}

// Update service selector styling
function updateServiceSelector() {
  const serviceBoxes = document.querySelectorAll(".service-box");
  serviceBoxes.forEach((box) => {
    box.classList.remove("moto-active");
  });

  const checkedRadio = document.querySelector('input[name="service"]:checked');
  if (checkedRadio.value === "moto") {
    checkedRadio.nextElementSibling.classList.add("moto-active");
  }

  updatePrice();
}

// Calculate and update price
function updatePrice() {
  const distance = Number.parseFloat(distanceInput.value) || 0;
  const service = document.querySelector('input[name="service"]:checked').value;
  const rate = RATES[service];
  const price = (distance * rate).toFixed(2);
  priceAmount.textContent = `$${price}`;
}

// Form validation
function validateForm(formData) {
  const errors = {};

  // Validate Full Name
  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = "Name must be at least 2 characters";
  }

  // Validate Pickup Location
  if (!formData.pickup.trim()) {
    errors.pickup = "Pickup location is required";
  }

  // Validate Destination
  if (!formData.destination.trim()) {
    errors.destination = "Destination is required";
  }

  // Validate Distance
  if (!formData.distance || formData.distance <= 0) {
    errors.distance = "Please select both pickup and destination locations";
  }

  // Validate Phone Number
  const phoneRegex = /^[\d\s\-+()]{10,}$/;
  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!phoneRegex.test(formData.phone.trim())) {
    errors.phone = "Please enter a valid phone number";
  }

  return errors;
}

// Display validation errors
function displayErrors(errors) {
  // Clear previous errors
  document.querySelectorAll(".error-message").forEach((el) => {
    el.textContent = "";
  });
  document.querySelectorAll("input").forEach((el) => {
    el.classList.remove("error");
  });

  // Display new errors
  Object.keys(errors).forEach((field) => {
    const errorElement = document.getElementById(`${field}Error`);
    const inputElement = document.getElementById(field);
    if (errorElement) {
      errorElement.textContent = errors[field];
    }
    if (inputElement) {
      inputElement.classList.add("error");
    }
  });
}

// Handle booking submission
function handleBookingSubmit(e) {
  e.preventDefault();

  // Collect form data
  const formData = {
    fullName: document.getElementById("fullName").value,
    pickup: pickupInput.value,
    destination: destinationInput.value,
    distance: Number.parseFloat(distanceInput.value),
    phone: document.getElementById("phone").value,
    service: document.querySelector('input[name="service"]:checked').value,
  };

  // Validate form
  const errors = validateForm(formData);

  if (Object.keys(errors).length > 0) {
    displayErrors(errors);
    return;
  }

  // Calculate price
  const price = (formData.distance * RATES[formData.service]).toFixed(2);

  // Populate and show confirmation modal
  showConfirmation(formData, price);
}

// Show confirmation modal
function showConfirmation(formData, price) {
  const serviceLabel = formData.service === "moto" ? "Moto PassApp" : "Taxi";

  document.getElementById("confirmService").textContent = serviceLabel;
  document.getElementById("confirmName").textContent = formData.fullName;
  document.getElementById("confirmPickup").textContent = formData.pickup;
  document.getElementById("confirmDestination").textContent =
    formData.destination;
  document.getElementById("confirmDistance").textContent = formData.distance;
  document.getElementById("confirmPhone").textContent = formData.phone;
  document.getElementById("confirmPrice").textContent = `$${price}`;

  modal.style.display = "block";

  // Reset form after successful booking
  setTimeout(() => {
    bookingForm.reset();
    distanceInput.value = "";
    updatePrice();
    displayErrors({});

    // Clear markers
    if (pickupMarker) pickupMarker.setMap(null);
    if (destinationMarker) destinationMarker.setMap(null);
    directionsDisplay.setDirections({ routes: [] });

    pickupMarker = null;
    destinationMarker = null;
  }, 500);
}

// Close modal
function closeModal() {
  modal.style.display = "none";
}

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Initialize price on page load
updatePrice();
