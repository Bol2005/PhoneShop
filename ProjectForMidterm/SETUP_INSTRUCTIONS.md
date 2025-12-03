# Google Maps Integration Setup

## Features Implemented
✅ **Interactive Google Maps** with pickup/destination location selection  
✅ **Location Autocomplete** for easy address search  
✅ **Click on Map** to set pickup or destination  
✅ **Automatic Distance Calculation** using Google Directions API  
✅ **Real-time Price Calculation** based on distance and service type  
✅ **Route Visualization** showing the driving route on the map  
✅ **Blue & Red Markers** for pickup and destination respectively  

## How It Works

### Setting Locations
1. **Search Method**: Start typing in the "Pickup Location" or "Destination" field - autocomplete suggestions will appear
2. **Click on Map**: Click directly on the map to select the location (it will automatically set to the last focused input field)
3. **Enter Addresses**: Manually type in known addresses

### Distance & Price Calculation
- Once both **Pickup** and **Destination** are set, distance is automatically calculated
- Distance is shown in the "Estimated Distance (km)" field
- Price is automatically calculated based on:
  - Distance (in km)
  - Service type (Moto: $2.50/km, Taxi: $4.00/km)

## Setting Up Google API Key

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click the project dropdown at the top
4. Click "NEW PROJECT"
5. Enter a project name (e.g., "Moto Booking App")
6. Click "CREATE"

### Step 2: Enable Required APIs
1. In the Cloud Console, search for "Maps JavaScript API"
2. Click on it and select "ENABLE"
3. Search for "Places API"
4. Click on it and select "ENABLE"
5. Search for "Directions API"
6. Click on it and select "ENABLE"

### Step 3: Create an API Key
1. Go to "Credentials" in the left sidebar
2. Click "CREATE CREDENTIALS"
3. Select "API Key"
4. Copy the generated API key

### Step 4: Restrict Your API Key (Recommended)
1. In Credentials, click on your newly created API key
2. Under "Key restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain (e.g., `localhost`, your website domain)
3. Under "API restrictions":
   - Select "Restrict key"
   - Check: Maps JavaScript API, Places API, Directions API
4. Click "SAVE"

### Step 5: Add API Key to Your Code
Replace `YOUR_GOOGLE_API_KEY` in `index.html` line 7:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places"></script>
```

Replace `YOUR_API_KEY_HERE` with your actual API key.

## Default Map Location
Currently set to San Francisco (37.7749, -122.4194). To change:
- Edit `script.js` line 38
- Change `defaultCenter = { lat: 37.7749, lng: -122.4194 };`
- Use your desired latitude and longitude

## Pricing Configuration
Edit rates in `script.js` (lines 2-5):
```javascript
const RATES = {
  moto: 2.5,   // $2.50 per km
  taxi: 4.0,   // $4.00 per km
};
```

## File Structure
```
ProjectForMidterm/
├── index.html          (HTML structure + Google Maps API)
├── style.css           (Styling for map, form, and suggestions)
├── script.js           (Google Maps integration + calculations)
└── SETUP_INSTRUCTIONS.md
```

## Troubleshooting

### Map not showing
- Check that your API key is correctly inserted in `index.html`
- Verify all required APIs are enabled in Google Cloud Console
- Check browser console (F12) for error messages

### Autocomplete not working
- Ensure Places API is enabled
- Check that your API key has access to Places API

### Distance/Price not calculating
- Both pickup and destination must be set
- Ensure Directions API is enabled
- Check that addresses are valid

### "Invalid API Key" error
- Replace `YOUR_GOOGLE_API_KEY` with your actual key
- Ensure the API key has the correct API restrictions

## Support
For more info on Google Maps APIs:
- [Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Directions API Docs](https://developers.google.com/maps/documentation/directions)
