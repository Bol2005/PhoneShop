// Price rates per km
const RATES = {
  moto: 2.5,
  taxi: 4.0,
};



// Declare google variable
let google;

let pickupMap, destinationMap;
let pickupMarker, destinationMarker;
let pickupLocation = null,
  destinationLocation = null;
let pickupAutocomplete, destinationAutocomplete;
let pickupInput, destinationInput;

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  const modal = document.getElementById("confirmationModal");
  const finalModal = document.getElementById("finalConfirmationModal");
  const closeBtn = document.querySelector(".close");
  const closeModalBtn = document.querySelector(".btn-close-modal");
  const cancelBtn = document.querySelector(".btn-cancel-modal");
  const confirmBookingBtn = document.querySelector(".btn-confirm-booking");
  const serviceRadios = document.querySelectorAll('input[name="service"]');
  const distanceInput = document.getElementById("distance");
  const priceAmount = document.getElementById("priceAmount");
  const toggleDistanceBtn = document.getElementById("toggleDistanceMode");
  pickupInput = document.getElementById("pickupInput");
  destinationInput = document.getElementById("destinationInput");

  let isManualMode = false;

  toggleDistanceBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isManualMode = !isManualMode;
    distanceInput.disabled = !isManualMode;
    distanceInput.value = "";
    updatePrice();

    if (isManualMode) {
      toggleDistanceBtn.textContent = "Auto";
      toggleDistanceBtn.classList.add("active");
      distanceInput.placeholder = "Enter distance manually";
      distanceInput.focus();
    } else {
      toggleDistanceBtn.textContent = "Manual";
      toggleDistanceBtn.classList.remove("active");
      distanceInput.placeholder = "Auto-calculated from map";
      calculateDistance();
    }
  });

  window.isManualDistanceMode = isManualMode;

  bookingForm.addEventListener("submit", handleBookingSubmit);
  closeBtn.addEventListener("click", closeModal);
  closeModalBtn.addEventListener("click", closeFinalModal);
  cancelBtn.addEventListener("click", closeModal);
  confirmBookingBtn.addEventListener("click", confirmFinalBooking);
  serviceRadios.forEach((radio) => radio.addEventListener("change", updatePrice));
  distanceInput.addEventListener("input", updatePrice);

  serviceRadios.forEach((radio) => radio.addEventListener("change", updateServiceSelector));

  updatePrice();

  window.addEventListener("load", initMap); // <-- Updated here
});

// 🔁 REPLACED initializeMaps WITH THIS
function initMap() {
  // Default location (Phnom Penh)
  const defaultLocation = { lat: 11.5564, lng: 104.9282 };

  // Initialize Pickup Map
  pickupMap = new google.maps.Map(document.getElementById('pickupMap'), {
    center: defaultLocation,
    zoom: 13,
    mapTypeControl: false,
  });

  pickupMarker = new google.maps.Marker({
    position: defaultLocation,
    map: pickupMap,
    draggable: true,
  });

  google.maps.event.addListener(pickupMarker, 'dragend', function (event) {
    document.getElementById('pickupLat').value = event.latLng.lat();
    document.getElementById('pickupLng').value = event.latLng.lng();
  });

  // Initialize Destination Map
  destinationMap = new google.maps.Map(document.getElementById('destinationMap'), {
    center: defaultLocation,
    zoom: 13,
    mapTypeControl: false,
  });

  destinationMarker = new google.maps.Marker({
    position: defaultLocation,
    map: destinationMap,
    draggable: true,
  });

  google.maps.event.addListener(destinationMarker, 'dragend', function (event) {
    document.getElementById('destinationLat').value = event.latLng.lat();
    document.getElementById('destinationLng').value = event.latLng.lng();
  });

  // Autocomplete
  pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput);
  pickupAutocomplete.addListener("place_changed", function () {
    let place = pickupAutocomplete.getPlace();
    if (!place.geometry) return;
    pickupMap.setCenter(place.geometry.location);
    pickupMarker.setPosition(place.geometry.location);
  });

  destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
  destinationAutocomplete.addListener("place_changed", function () {
    let place = destinationAutocomplete.getPlace();
    if (!place.geometry) return;
    destinationMap.setCenter(place.geometry.location);
    destinationMarker.setPosition(place.geometry.location);
  });
}

// Distance + other functions (unchanged)
function calculateDistance() { /* ...same... */ }
function getDistanceFromLatLng(lat1, lng1, lat2, lng2) { /* ...same... */ }
function toRad(degrees) { /* ...same... */ }
function updatePrice() { /* ...same... */ }
function updateServiceSelector() { /* ...same... */ }
function validateForm(formData) { /* ...same... */ }
function displayErrors(errors) { /* ...same... */ }
function handleBookingSubmit(e) { /* ...same... */ }
function showConfirmation(formData, price) { /* ...same... */ }
function confirmFinalBooking() { /* ...same... */ }
function closeModal() { /* ...same... */ }
function closeFinalModal() { /* ...same... */ }

window.addEventListener("click", (e) => {
  if (e.target === document.getElementById("confirmationModal")) closeModal();
  if (e.target === document.getElementById("finalConfirmationModal")) closeFinalModal();
});
