// =========================================
// 1. FIREBASE INITIALIZATION & STATE VARIABLES
// =========================================
const firebaseConfig = {
    apiKey: "AIzaSyCm6WmxBGoL9WpJm0nls0J7QagdDAITf78",
    authDomain: "dk-bike-world.firebaseapp.com",
    databaseURL: "https://dk-bike-world-default-rtdb.firebaseio.com",
    projectId: "dk-bike-world",
    storageBucket: "dk-bike-world.firebasestorage.app",
    messagingSenderId: "554629973355",
    appId: "1:554629973355:web:8956bf68d52cf1bf7bf82e",
    measurementId: "G-E85TTZTV09"
};

let currentBikeFullData = null;
let compareList = [];
let currentImages = [];
let currentIndex = 0;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let allBikes = [];

// =========================================
// 2. SMART IMPORTER / BULK DATA PROCESSING
// =========================================

function clearBulkArea() {
    const area = document.getElementById("bulkDataInput");
    if (area) {
        area.value = "";
        console.log("Bulk input area cleared.");
    }
}

// Process pasted specs text and auto-fill respective input fields
function processBulkData() {
    const rawText = document.getElementById("bulkDataInput").value;
    if (!rawText.trim()) {
        alert("Please paste the data first! 🏍️");
        return;
    }

    // Mapping of specification labels to corresponding HTML input element IDs
    const mappings = {
        "Displacement": "spec_displacement",
        "Max Power": "spec_maxPower",
        "Max Torque": "spec_maxTorque",
        "Top Speed": "spec_topSpeed",
        "Mileage": "spec_mileage",
        "Transmission": "spec_transmission",
        "Transmission Type": "spec_transmissionType",
        "Gear Shifting Pattern": "spec_gearPattern",
        "Clutch": "spec_clutch",
        "Riding Range": "spec_ridingRange",
        "Riding Modes": "spec_ridingModes",
        "Cylinders": "spec_cylinders",
        "Valves Per Cylinder": "spec_valvesPerCylinder",
        "Cooling System": "spec_cooling",
        "Bore × Stroke": "spec_boreStroke",
        "Compression Ratio": "spec_compressionRatio",
        "Spark Plugs": "spec_sparkPlugs",
        "Battery": "spec_battery",
        "Emission Standard": "spec_emission",
        "Fuel Type": "spec_fuelType",
        // BRAKES 
        "Braking System": "spec_brakingSystem",
        "Front Brake Type": "spec_frontBrakeType",
        "Front Brake Size": "spec_frontBrakeSize",
        "Rear Brake Type": "spec_rearBrakeType",
        "Rear Brake Size": "spec_rearBrakeSize",
        "Caliper-Front": "spec_caliperFront",
        "Caliper-Rear": "spec_caliperRear",
        "Wheel Type": "spec_wheelType",
        "Front Wheel Size": "spec_frontWheelSize",
        "Rear Wheel Size": "spec_rearWheelSize",
        "Tyre Type": "spec_tyreType",
        "Tyre Size": "spec_tyreSize",
        "Tyre Pressure (Solo)": "spec_tyrePressureSolo",
        "Tyre Pressure (Dual)": "spec_tyrePressureDual",
        // SUSPENSION 
        "Front Suspension": "spec_frontSuspension",
        "Rear Suspension": "spec_rearSuspension",
        "Chassis Type": "spec_chassisType",
        "Front Suspension Preload Adjuster": "spec_frontSuspensionPreload",
        "Rear Suspension Preload Adjuster": "spec_rearSuspensionPreload",
        "Kerb Weight": "spec_kerbWeight",
        "Seat Height": "spec_seatHeight",
        "Seat Length": "spec_seatLength",
        "Reserve Fuel Capacity": "spec_reserveFuelCapacity",
        "Ground Clearance": "spec_groundClearance",
        "Fuel Tank Capacity": "spec_fuelTankCapacity",
        "Overall Dimensions": "spec_overallDimensions",
        "Wheelbase": "spec_wheelbase",
        // WARRANTY
        "Warranty (Years)": "spec_standardWarrantyYears",
        "Warranty (Km)": "spec_standardWarrantyKm",
        "1st Service": "spec_firstService",
        "2nd Service": "spec_secondService",
        "3rd Service": "spec_thirdService",
        // INSTRUMENT CLUSTER
        "Instrument Console": "spec_instrumentConsole",
        "Touch Screen Display": "spec_touchScreenDisplay",
        "Display Size": "spec_displaySize",
        "Digital Display Type": "spec_digitalDisplayType",
        "Brightness Control": "spec_brightnessControl",
        "Mobile Phone Connectivity": "spec_mobileConnectivity",
        "GPS & Navigation": "spec_gpsNavigation",
        "Average Fuel Consumption": "spec_avgFuelConsumption",
        "Real Time Mileage Indicator": "spec_realTimeMileage",
        "Speedometer": "spec_speedometer",
        "Odometer": "spec_odometer",
        "Fuel Gauge": "spec_fuelGauge",
        "Distance to Empty": "spec_distanceToEmpty",
        "Voice Assist": "spec_voiceAssist",
        "Tripmeter": "spec_tripmeter",
        "Tachometer": "spec_tachometer",
        "Stand Alarm": "spec_standAlarm",
        "Gear Indicator": "spec_gearIndicator",
        "Gear Shift Light": "spec_gearShiftLight",
        "Low Battery Indicator": "spec_lowBatteryIndicator",
        "Low Fuel Indicator": "spec_lowFuelIndicator",
        "Low Oil Indicator": "spec_lowOilIndicator",
        "Service Reminder Indicator": "spec_serviceReminder",
        "Hazard Warning Indicator": "spec_hazardWarning",
        "High Beam Indicator": "spec_highBeamIndicator",
        "Engine Temperature Indicator": "spec_engineTempIndicator",
        "Malfunction Indicator": "spec_malfunctionIndicator",
        "Average Speed": "spec_averageSpeed",
        "OTA Updates": "spec_otaUpdates",
        "Call/SMS Alerts": "spec_callSmsAlerts",
        "Clock": "spec_clock",
        // SAFETY & CONVENIENCE
        "USB Charging Port": "spec_usbChargingPort",
        "Keyless Lock/Unlock": "spec_keylessLock",
        "Saree Guard": "spec_sareeGuard",
        "Quickshifter": "spec_quickshifter",
        "Traction Control": "spec_tractionControl",
        "Cruise Control": "spec_cruiseControl",
        "Start Type": "spec_startType",
        "Automatic Start Stop": "spec_autoStartStop",
        "Silent Start": "spec_silentStart",
        "Side Stand Engine/Motor Cut-off": "spec_sideStandCutoff",
        "Silencer Cover": "spec_silencerCover",
        "Kill Switch": "spec_killSwitch",
        // TRACKING & SECURITY
        "Vehicle Location Tracking": "spec_vehicleLocationTracking",
        "Geo Fencing": "spec_geoFencing",
        // LIGHTS
        "Headlight Type": "spec_headlightType",
        "Projector Headlamp": "spec_projectorHeadlamp",
        "Dual Lights": "spec_dualLights",
        "DRLs (Daytime Running Lights)": "spec_drl",
        "Brake/Tail Light": "spec_brakeTailLight",
        "Hazard Warning Lights": "spec_hazardLights",
        "Pass Light": "spec_passLight",
        "Turn Signal": "spec_turnSignal",
        // SEAT & STORAGE
        "Under Seat Storage": "spec_underSeatStorage",
        "Pillion Seat": "spec_pillionSeat",
        "Pillion Backrest": "spec_pillionBackrest",
        "Pillion Footrest": "spec_pillionFootrest",
        "Pillion Grab Rail": "spec_pillionGrabRail"
    };

    const lines = rawText.split('\n');
    let found = 0;

    lines.forEach(line => {
        for (const [key, id] of Object.entries(mappings)) {
            // Check if the pasted text line contains the key
            if (line.toLowerCase().includes(key.toLowerCase() + ":")) {
                let val = line.split(':')[1];
                if (val) {
                    const input = document.getElementById(id);
                    if (input) {
                        input.value = val.trim();
                        found++;
                    }
                }
            }
        }
    });

    if (found > 0) {
        alert(`Success! ${found} details filled automatically! ✅`);
    } else {
        alert("DATA NOT MATCHING");
    }
}

// =========================================
// 3. CLOUD DATA MANAGEMENT (FETCH & RENDER)
// =========================================
function renderBikes() {
    const bikeGrid = document.getElementById("bikeGrid");
    if (!bikeGrid) return;

    // Listen to Firebase Live database changes
    db.ref('bikes').on('value', (snapshot) => {
        const bikesData = snapshot.val();
        bikeGrid.innerHTML = "";

        if (!bikesData) {
            bikeGrid.innerHTML = "<p style='grid-column:1/-1; text-align:center; padding:50px; color:#fff; font-weight:bold;'>No bikes found! 🏍️ <br> Please add them via Admin page.</p>";
            allBikes = [];
            return;
        }

        allBikes = [];
        Object.keys(bikesData).forEach((id) => {
            const bike = bikesData[id];
            bike.id = id;
            allBikes.push(bike);

            let displayImg = 'pulred.jpg';
            if (bike.image) {
                let firstRawImg = bike.image.split(',')[0].trim();
                displayImg = firstRawImg.includes('|') ? firstRawImg.split('|')[1].trim() : firstRawImg;
            }
            const mileageValue = bike.specs?.mileage ? parseFloat(bike.specs.mileage) : 0;

            const bikeHTML = `
                <div class="bike"
                    data-brand="${bike.brand || ''}"
                    data-price="${bike.price || 0}"
                    data-type="${bike.type || ''}"
                    data-mileage="${mileageValue}"
                    onclick="openModal('${id}')">
                    <div class="bike-image"> <img src="${displayImg}" style="width:100%; height:100%; object-fit:contain;"> </div>
                    <h3>${bike.name || 'Unknown Bike'}</h3>
                    <p>💰 Price: ₹ ${Number(bike.price || 0).toLocaleString('en-IN')}</p>
                    <p>⚙️ Engine: ${bike.specs?.displacement || "N/A"}</p>
                    <p>🔥 Mileage: ${bike.specs?.mileage || "N/A"}</p>
                    <button onclick="addToCompare(event,'${id}')"
                    style="margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background: #086ed4;color:white;
                    font-weight:bold;cursor:pointer;position:relative;z-index:10;">➕ Add To Compare</button>
                </div>
            `;
            bikeGrid.innerHTML += bikeHTML;
        });

        // Update total bike count in header (left of search bar)
        let countBadge = document.getElementById('totalBikeCount');
        if (countBadge) {
            countBadge.textContent = `${allBikes.length} Bikes`;
        }
    });
}

// =========================================
// 4. BIKE DETAILS MODAL RENDERING
// =========================================
function openModal(id) {
    console.log("Opening bike id:", id);
    db.ref('bikes/' + id).once('value').then((snapshot) => {
        const bike = snapshot.val();
        if (!bike) {
            console.error("Bike data not found in Firebase!");
            return;
        }
        currentBikeFullData = bike;

        // Populate variants dropdown
        const dropdown = document.getElementById("variantDropdown");
        if (dropdown) {
            dropdown.innerHTML = '<option value="base">Standard Variant</option>';
            if (bike.variants) {
                Object.keys(bike.variants).forEach(key => {
                    dropdown.innerHTML += `<option value="${key}">${bike.variants[key].name}</option>`;
                });
            }
        }

        // Render base variant details by default
        renderBikeDetails(bike);
        const modal = document.getElementById("bikeModal");
        if (modal) {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        }

        // Hide TCO & EMI area on new bike open
        const tcoArea = document.getElementById("tcoArea");
        const emiArea = document.getElementById("emiArea");
        if (tcoArea) tcoArea.style.display = "none";
        if (emiArea) emiArea.style.display = "none";
    }).catch(err => { console.error("Error fetching modal data:", err); });
}

function renderBikeDetails(data) {
    const s = data.specs || {};
    // Convert comma-separated string to image array
    if (data.image) {
        currentImages = data.image.split(',').map(img => img.trim());
    } else {
        currentImages = ['pulred.jpg'];
    }
    currentIndex = 0;

    document.getElementById("modalTitle").textContent = data.name;
    updateSliderImage();

    // Helper for rendering spec pills gracefully (ignores empty or null)
    const renderSpec = (label, value) => {
        if (!value || value === "-" || value.trim() === "" || value === "0") return "";
        return `<div class="premium-spec-pill">
                    <span class="premium-spec-label">${label}</span>
                    <strong class="premium-spec-value">${value}</strong>
                </div>`;
    };

    // Helper for rendering sections
    const renderSection = (title, specsArray, icon) => {
        const specsHtml = specsArray.map(spec => renderSpec(spec.label, spec.value)).join("");
        if (!specsHtml) return ""; // Hide section if no specs available
        return `
            <div class="premium-spec-section">
                <h3 class="premium-section-title"><span class="section-icon">${icon}</span> ${title}</h3>
                <div class="premium-spec-grid">
                    ${specsHtml}
                </div>
            </div>
        `;
    };

    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    const formattedPrice = data.price ? formatter.format(data.price) : "TBD";

    document.getElementById("modalBody").innerHTML = `
        <div class="premium-bike-detail">
            <div class="premium-price-minimal" style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1e3c72; font-size: 32px; font-weight: 800; margin-bottom: 5px;">${formattedPrice}</h2>
                <p style="color: #64748b; font-size: 13px; font-style: italic;">*Ex-showroom price may vary</p>
            </div>
            
            <div class="premium-specs-container">
                ${renderSection("POWER & PERFORMANCE", [
        { label: "Displacement", value: s.displacement },
        { label: "Max Power", value: s.maxPower },
        { label: "Max Torque", value: s.maxTorque },
        { label: "Top Speed", value: s.topSpeed },
        { label: "Mileage", value: s.mileage },
        { label: "Transmission", value: s.transmission },
        { label: "Transmission Type", value: s.transmissionType },
        { label: "Gear Pattern", value: s.gearPattern },
        { label: "Clutch", value: s.clutch },
        { label: "Riding Range", value: s.ridingRange },
        { label: "Riding Modes", value: s.ridingModes },
        { label: "Cylinders", value: s.cylinders },
        { label: "Valves Per Cylinder", value: s.valvesPerCylinder },
        { label: "Cooling System", value: s.cooling },
        { label: "Bore × Stroke", value: s.boreStroke },
        { label: "Compression Ratio", value: s.compressionRatio },
        { label: "Spark Plugs", value: s.sparkPlugs },
        { label: "Battery", value: s.battery },
        { label: "Emission", value: s.emission },
        { label: "Fuel Type", value: s.fuelType }
    ], "⚡")}

                ${renderSection("BRAKES & WHEELS", [
        { label: "Braking System", value: s.brakingSystem },
        { label: "Front Brake", value: s.frontBrakeType },
        { label: "Front Brake Size", value: s.frontBrakeSize },
        { label: "Rear Brake", value: s.rearBrakeType },
        { label: "Rear Brake Size", value: s.rearBrakeSize },
        { label: "Caliper (Front)", value: s.caliperFront },
        { label: "Caliper (Rear)", value: s.caliperRear },
        { label: "Wheel Type", value: s.wheelType },
        { label: "Front Wheel Size", value: s.frontWheelSize },
        { label: "Rear Wheel Size", value: s.rearWheelSize },
        { label: "Tyre Type", value: s.tyreType },
        { label: "Tyre Size", value: s.tyreSize },
        { label: "Tyre Pressure (Solo)", value: s.tyrePressureSolo },
        { label: "Tyre Pressure (Dual)", value: s.tyrePressureDual }
    ], "🛑")}

                ${renderSection("DIMENSIONS & CHASSIS", [
        { label: "Front Suspension", value: s.frontSuspension },
        { label: "Rear Suspension", value: s.rearSuspension },
        { label: "Front Suspension Preload", value: s.frontSuspensionPreload },
        { label: "Rear Suspension Preload", value: s.rearSuspensionPreload },
        { label: "Chassis Type", value: s.chassisType },
        { label: "Kerb Weight", value: s.kerbWeight },
        { label: "Seat Height", value: s.seatHeight },
        { label: "Seat Length", value: s.seatLength },
        { label: "Ground Clearance", value: s.groundClearance },
        { label: "Fuel Tank Capacity", value: s.fuelTankCapacity },
        { label: "Reserve Fuel Capacity", value: s.reserveFuelCapacity },
        { label: "Wheelbase", value: s.wheelbase },
        { label: "Overall Dimensions", value: s.overallDimensions }
    ], "📐")}

                ${renderSection("WARRANTY & SERVICE", [
        { label: "Standard Warranty", value: s.standardWarrantyYears ? s.standardWarrantyYears + ' Years' : s.standardWarrantyYears },
        { label: "Warranty (Km)", value: s.standardWarrantyKm ? s.standardWarrantyKm + ' km' : s.standardWarrantyKm },
        { label: "1st Service", value: s.firstService },
        { label: "2nd Service", value: s.secondService },
        { label: "3rd Service", value: s.thirdService }
    ], "🛡️")}

                ${renderSection("INSTRUMENT CLUSTER", [
        { label: "Instrument Console", value: s.instrumentConsole },
        { label: "Touch Screen Display", value: s.touchScreenDisplay },
        { label: "Display Size", value: s.displaySize },
        { label: "Digital Display Type", value: s.digitalDisplayType },
        { label: "Brightness Control", value: s.brightnessControl },
        { label: "Mobile Connectivity", value: s.mobileConnectivity },
        { label: "GPS & Navigation", value: s.gpsNavigation },
        { label: "Avg Fuel Consumption", value: s.avgFuelConsumption },
        { label: "Real-Time Mileage", value: s.realTimeMileage },
        { label: "Speedometer", value: s.speedometer },
        { label: "Odometer", value: s.odometer },
        { label: "Fuel Gauge", value: s.fuelGauge },
        { label: "Distance to Empty", value: s.distanceToEmpty },
        { label: "Voice Assist", value: s.voiceAssist },
        { label: "Tripmeter", value: s.tripmeter },
        { label: "Tachometer", value: s.tachometer },
        { label: "Stand Alarm", value: s.standAlarm },
        { label: "Gear Indicator", value: s.gearIndicator },
        { label: "Gear Shift Light", value: s.gearShiftLight },
        { label: "Low Battery Indicator", value: s.lowBatteryIndicator },
        { label: "Low Fuel Indicator", value: s.lowFuelIndicator },
        { label: "Low Oil Indicator", value: s.lowOilIndicator },
        { label: "Service Reminder", value: s.serviceReminder },
        { label: "Hazard Warning", value: s.hazardWarning },
        { label: "High Beam Indicator", value: s.highBeamIndicator },
        { label: "Engine Temp Indicator", value: s.engineTempIndicator },
        { label: "Malfunction Indicator", value: s.malfunctionIndicator },
        { label: "Average Speed", value: s.averageSpeed },
        { label: "OTA Updates", value: s.otaUpdates },
        { label: "Call / SMS Alerts", value: s.callSmsAlerts },
        { label: "Clock", value: s.clock }
    ], "📟")}

                ${renderSection("SAFETY & CONVENIENCE", [
        { label: "USB Charging Port", value: s.usbChargingPort },
        { label: "Keyless Lock/Unlock", value: s.keylessLock },
        { label: "Saree Guard", value: s.sareeGuard },
        { label: "Quickshifter", value: s.quickshifter },
        { label: "Traction Control", value: s.tractionControl },
        { label: "Cruise Control", value: s.cruiseControl },
        { label: "Start Type", value: s.startType },
        { label: "Auto Start/Stop", value: s.autoStartStop },
        { label: "Silent Start", value: s.silentStart },
        { label: "Side Stand Cut-off", value: s.sideStandCutoff },
        { label: "Silencer Cover", value: s.silencerCover },
        { label: "Kill Switch", value: s.killSwitch }
    ], "🔒")}

                ${renderSection("MOBILE APP MONITORING", [
        { label: "Vehicle Location Tracking", value: s.vehicleLocationTracking },
        { label: "Geo Fencing", value: s.geoFencing }
    ], "📱")}

                ${renderSection("LIGHTS", [
        { label: "Headlight Type", value: s.headlightType },
        { label: "Projector Headlamp", value: s.projectorHeadlamp },
        { label: "Dual Lights", value: s.dualLights },
        { label: "DRLs", value: s.drl },
        { label: "Brake / Tail Light", value: s.brakeTailLight },
        { label: "Hazard Warning Lights", value: s.hazardLights },
        { label: "Pass Light", value: s.passLight },
        { label: "Turn Signal", value: s.turnSignal }
    ], "💡")}

                ${renderSection("SEAT & STORAGE", [
        { label: "Under Seat Storage", value: s.underSeatStorage },
        { label: "Pillion Seat", value: s.pillionSeat },
        { label: "Pillion Backrest", value: s.pillionBackrest },
        { label: "Pillion Footrest", value: s.pillionFootrest },
        { label: "Pillion Grab Rail", value: s.pillionGrabRail }
    ], "💺")}
            </div>

            <div class="download-container" style="text-align: center; padding: 30px 10px 10px;">
                <button onClick="downloadPDF()" class="pdf-link modern-btn-download">
                    <span style="display:flex; align-items:center; gap:8px;">📄 DOWNLOAD BROCHURE</span>
                </button> 
            </div>
        </div>
    `;
}

// Render selected variant spec instantly
function switchVariant() {
    const dropdown = document.getElementById("variantDropdown");
    const selectedKey = dropdown.value;

    if (selectedKey === "base") {
        renderBikeDetails(currentBikeFullData);
    } else {
        const variantData = currentBikeFullData.variants[selectedKey];
        // If variant has no custom image, fallback to base image
        const mergedData = {
            ...variantData,
            image: variantData.image || currentBikeFullData.image
        };
        renderBikeDetails(mergedData);
    }
}

// =========================================
// 5. SIDEBAR, FILTERS & MENU LOGIC
// =========================================
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

function closeMenu() {
    document.getElementById("sidebar").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
}

function closeModal() {
    const modal = document.getElementById("bikeModal");
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "auto";
    if (typeof stopRevving === 'function') stopRevving();
}

let selectedBrand = "BRANDS";

// =========================================
// BRAND INTRODUCTION DATA
// =========================================
const brandInfo = {
    "BAJAJ": {
        logo: "https://listcarbrands.com/wp-content/uploads/2017/11/Bajaj-logo.jpg",
        intro: "Bajaj Auto is one of India's most iconic two-wheeler manufacturers, founded in 1945 and headquartered in Pune, Maharashtra. Known for their sporty and performance-oriented Pulsar series, Bajaj has redefined the Indian biking experience over decades. The brand offers a wide lineup ranging from commuter bikes to powerful naked street fighters. With cutting-edge technology like liquid-cooled engines, ride-by-wire, and advanced ABS systems, Bajaj continues to push boundaries. Today, Bajaj is also a major global exporter and a trusted partner of KTM and Triumph motorcycles."
    },
    "HONDA": {
        logo: "https://imgd.aeplcdn.com/0X0/bw/makes/honda20200511152343.jpg?q=80",
        intro: "Honda Motorcycle & Scooter India (HMSI) is the country's largest two-wheeler maker and a subsidiary of the global Honda Motor Co., founded in Japan in 1948. Honda is renowned for its refined engineering, fuel efficiency, and long-lasting reliability across all its models. Their lineup includes everyday commuters like the Shine and Unicorn to performance icons like the CB300R and CB500F. Honda pioneered fuel injection technology in India at an accessible price point, setting benchmarks across segments. The brand is globally trusted by millions for quality, comfort, and consistent after-sales service."
    },
    "YAMAHA": {
        logo: "https://imgd.aeplcdn.com/0X0/bw/makes/yamaha20200508193220.jpg?q=80",
        intro: "Yamaha Motor India is a subsidiary of Yamaha Motor Co. Ltd., Japan, operating in India since 1985. The brand carries a strong racing DNA, derived from its dominance in MotoGP and World Superbike championships across decades. Yamaha's lineup in India spans sporty commuters like the FZ series and MT lineup, to premium offerings like the R15 and MT-15. Known for stylish design, smooth engine performance, and advanced features like Bluetooth connectivity and quick-shifters, Yamaha is a favourite among young riders. Blending performance with aesthetics, Yamaha is synonymous with 'Kando' — the joy of riding."
    },
    "TVS": {
        logo: "https://static.vecteezy.com/system/resources/previews/020/336/393/original/tvs-logo-tvs-icon-transparent-png-free-vector.jpg",
        intro: "TVS Motor Company, headquartered in Chennai, is one of India's largest and most respected two-wheeler brands with a legacy dating back to 1978. The brand is known for its innovation, motorsport involvement, and diverse product range spanning commuters, sport bikes, and electric scooters. TVS's Apache series has been a benchmark in the 150cc–310cc performance segment, offering race-inspired technology at accessible prices. The brand is also a strong force in the electric space with the TVS iQube EV leading the charge. As a trusted technology partner of BMW Motorrad, TVS continues to shape the future of mobility in India."
    },
    "HERO": {
        logo: "https://imgd.aeplcdn.com/0X0/bw/makes/hero20200508192826.jpg?q=80",
        intro: "Hero MotoCorp is the world's largest manufacturer of motorcycles and scooters by volume, based in New Delhi, India. With roots tracing back to the Hero Honda joint venture in 1984, the brand established itself as India's most trusted commuter bike maker. Today, Hero offers a wide range of motorcycles from the budget-friendly HF Deluxe to sporty options like the Xtreme 160R and the adventure-ready Xpulse 200. Hero MotoCorp sells over 6 million two-wheelers annually and has an unmatched service network across rural and urban India. The brand continues to invest in electric and sustainable mobility through its Vida EV brand."
    },
    "ROYAL ENFIELD": {
        logo: "https://imgd.aeplcdn.com/0X0/bw/makes/royal-enfield20200508193112.jpg?q=80",
        intro: "Royal Enfield is one of the oldest motorcycle brands in the world, with origins in Redditch, England in 1901. Today operated by Eicher Motors in Chennai, Royal Enfield is the dominant force in India's middleweight (250cc–750cc) motorcycle segment. Known for its unmistakable thump, classic styling, and touring capability, models like the Classic 350, Bullet, and Himalayan have garnered a passionate global community. Royal Enfield has expanded its lineup with the potent 650 Twins (Interceptor and Continental GT) which have won critical acclaim worldwide. Riding a Royal Enfield is not just transportation — it's a lifestyle and a journey into motorcycle culture."
    },
    "KTM": {
        logo: "https://www.carlogos.org/car-logos/ktm-logo.png",
        intro: "KTM, short for Kronreif & Trunkenpolz Mattighofen, is an Austrian motorcycle manufacturer globally renowned for its 'Ready to Race' philosophy. In India, KTM bikes are manufactured by Bajaj Auto and have disrupted the premium performance bike segment since their launch in 2012. The Duke and RC series offer razor-sharp handling, aggressive styling, and powerful engines that are track-ready. KTM's advanced technology includes ride-by-wire, multiple riding modes, cornering ABS, and quickshifters even at their entry-level offerings. Loved by young performance enthusiasts, KTM has transformed what Indian riders expect from a premium motorcycle."
    },
    "TRIUMPH": {
        logo: "https://www.carlogos.org/car-logos/triumph-logo.png",
        intro: "Triumph Motorcycles is a legendary British brand founded in 1902, with a heritage that spans over 120 years of iconic motorcycle manufacturing. In India, Triumph partners with Bajaj Auto to manufacture their mid-range lineup — the Speed 400 and Scrambler 400X — making premium British motorcycles accessible to Indian riders. Triumph is celebrated for its powerful triples, timeless Bonneville classics, and hardcore adventure bikes like the Tiger 1200. Every Triumph model carries the essence of British craftsmanship, character-rich engines, and a design philosophy that blends heritage with modernity. Owning a Triumph is an entry into one of motorcycling's most storied traditions."
    },
    "SUZUKI": {
        logo: "https://imgd.aeplcdn.com/0X0/bw/makes/suzuki20200508193118.jpg?q=80",
        intro: "Suzuki Motorcycle India is a subsidiary of Suzuki Motor Corporation, Japan, a brand with a rich racing heritage in MotoGP and World Superbike championships. Known for silky-smooth engines and refined performance, Suzuki offers a range from the popular Gixxer series to the mighty Hayabusa in the Indian market. The Gixxer SF and Gixxer 250 have established strong footholds in the affordable sport bike segment with class-leading refinement and fuel efficiency. Suzuki's engineering philosophy prioritises balanced performance, everyday usability, and durability. The brand continues to be a respected choice for riders who value sophistication and engineering precision."
    },
    "KAWASAKI": {
        logo: "https://imgd.aeplcdn.com/0X0/n/cw/ec/17/brands/logos/kawasaki1656405887432.jpg?v=1656405887528&q=80",
        intro: "Kawasaki is a Japanese multinational brand synonymous with high-performance superbikes, with a history dating back to 1896. In India, Kawasaki distributes bikes through its JV with Bajaj Auto and independently via its premium lineup including the Z and Ninja series. The flagship Kawasaki Ninja H2R — the world's most powerful production motorcycle — represents the brand's engineering pinnacle. Kawasaki's green machines, from the Ninja 300 to the ZX-10R, cover every tier of performance riding in India. Known for aggressive styling, turbocharged technology, and race-proven frames, Kawasaki is the choice for riders who demand ultimate performance."
    },
    "HARLEY DAVIDSON": {
        logo: "https://www.carlogos.org/car-logos/harley-davidson-logo.png",
        intro: "Harley-Davidson is America's most iconic motorcycle brand, founded in Milwaukee, Wisconsin in 1903. For over a century, Harley has symbolised freedom, rebellion, and the open road — a cultural phenomenon as much as a motorcycle brand. In India, Harley-Davidson relaunched operations through a partnership with Hero MotoCorp, offering the accessible X440 and continuing to import its classic big-twin touring and cruiser lineup. The thundering V-twin engine note, chrome-laden cruiser styling, and strong community of H.O.G. (Harley Owners Group) members make Harley ownership a lifestyle statement. A Harley-Davidson is not just a motorcycle — it's an American legend on two wheels."
    },
    "BMW": {
        logo: "https://imgd.aeplcdn.com/0X0/bw/makes/bmw20200508192553.jpg?q=80",
        intro: "BMW Motorrad is the motorcycling arm of the renowned BMW Group, offering premium motorcycles crafted in Germany since 1923. Known for the iconic boxer engine and the groundbreaking telelever/duolever front suspension system, BMW Motorrad redefines what premium engineering means in the two-wheeler space. In India, BMW Motorrad offers a range from the accessible G 310 R/GS (co-developed with TVS) to the adventure-touring flagship R 1250 GS. BMW bikes are loaded with premium tech: adaptive cruise control, dynamic ESA, full-colour TFT displays, and cornering ABS are standard across most models. A BMW Motorrad represents the pinnacle of safety, comfort, and long-distance touring capability."
    },
    "DUCATI": {
        logo: "https://www.carlogos.org/car-logos/ducati-logo.png",
        intro: "Ducati is an Italian motorcycle manufacturer based in Bologna, with a legacy of building some of the world's most desirable and race-bred superbikes since 1926. The brand is famous for its L-twin Desmodromic valve engines, trellis frames, and an uncompromising focus on performance and aesthetics. Ducati's lineup in India ranges from the Scrambler series to the track-conquering Panigale V4 and the multitasking Multistrada adventure tourers. Ducati motorcycles are loaded with MotoGP-derived technology including cornering ABS, DTC, launch control, and wheelie control. Riding a Ducati is an emotional experience — a fusion of Italian passion, motorsport heritage, and breathtaking engineering."
    },
    "OLA ELECTRIC": {
        logo: "https://1000logos.net/wp-content/uploads/2023/06/Ola-Electric-Logo.png",
        intro: "Ola Electric is India's fastest-growing electric two-wheeler brand, founded in 2017 as a subsidiary of ANI Technologies (Ola Cabs). Operating out of its massive Futurefactory in Tamil Nadu — the world's largest electric scooter plant — Ola Electric is on a mission to accelerate India's EV revolution. The Ola S1 series features powerful motors, large battery packs, and an industry-first MoveOS software platform with OTA updates, navigation, and voice commands. Ola Electric has rapidly captured a significant share of the Indian electric scooter market through aggressive pricing and feature-rich products. With upcoming electric motorcycles in its pipeline, Ola Electric is reshaping the future of Indian mobility."
    },
    "ATHER ENERGY": {
        logo: "https://1000logos.net/wp-content/uploads/2023/12/Ather-Energy-Logo.jpg",
        intro: "Ather Energy is a Bengaluru-based electric vehicle startup founded in 2013 by IIT Madras alumni, and is often credited as the pioneer of the modern smart electric scooter in India. The Ather 450 series redefined expectations for electric scooters — featuring a responsive touchscreen dashboard, OTA software updates, fast charging (Ather Grid), and performance that rivals petrol scooters. Hero MotoCorp is a major investor in Ather, giving the brand significant manufacturing and distribution firepower. Ather continues to innovate with products like the Ather Rizta family scooter and the upcoming Ather 450 Apex performance variant. Known for quality build, thoughtful design, and a strong charging network, Ather is a benchmark for Indian EV engineering."
    },
    "YAMAHA INDIA": {
        logo: "https://imgd.aeplcdn.com/0X0/bw/makes/yamaha20200508193220.jpg?q=80",
        intro: "Yamaha Motor India is a subsidiary of Yamaha Motor Co. Ltd., Japan, operating in India since 1985. The brand carries a strong racing DNA, derived from its dominance in MotoGP and World Superbike championships across decades. Yamaha's lineup in India spans sporty commuters like the FZ series and MT lineup, to premium offerings like the R15 and MT-15. Known for stylish design, smooth engine performance, and advanced features like Bluetooth connectivity and quick-shifters, Yamaha is a favourite among young riders. Blending performance with aesthetics, Yamaha is synonymous with 'Kando' — the joy of riding."
    },
    "REVOLT MOTORS": {
        logo: "https://logo.clearbit.com/revoltmotors.com",
        intro: "Revolt Motors is India's first AI-enabled electric motorcycle brand, founded in 2019 and headquartered in Gurugram, Haryana. The RV400 and RV300 are Revolt's flagship offerings, featuring swappable batteries, multiple ride modes, and a unique artificial engine sound system for a more engaging ride experience. Revolt operates on a subscription-based ownership model, making electric motorcycles financially accessible to a wider audience. The brand's connected app provides real-time diagnostics, location tracking, and performance monitoring. Revolt is backed by Rattan India Enterprises and aims to make electric mobility aspirational and fun for Indian youth."
    },
    "TORK MOTORS": {
        logo: "https://logo.clearbit.com/torkmotors.com",
        intro: "Tork Motors is a Pune-based electric motorcycle startup founded in 2010, focused exclusively on building performance-oriented electric two-wheelers for the Indian market. Their flagship model, the Kratos R, is engineered to deliver strong acceleration, long range, and an engaging riding experience rooted in performance EV technology. Tork develops their own battery pack, motor, and vehicle control unit in-house, giving them a strong technology advantage. The brand focuses on a premium, sporty aesthetic paired with connected features accessible via the Tork app. With a passionate engineering team and growing dealer network, Tork represents India's ambition to compete globally in the EV motorcycle space."
    },
    "ULTRAVIOLETTE": {
        logo: "https://logo.clearbit.com/ultraviolette.com",
        intro: "Ultraviolette Automotive is a Bengaluru-based electric vehicle startup founded in 2017 that has created India's most powerful and advanced production electric motorcycle — the F77 Mach 2. With performance credentials of 0–60 kmph in under 3 seconds and a claimed range of over 300 km, the F77 competes with global high-performance electric motorcycles. Ultraviolette has developed proprietary battery technology, fast charging systems, and a sophisticated software platform from the ground up. The brand has attracted strategic investment from TVS Motor Company, lending it significant credibility and resources. Ultraviolette represents the cutting edge of Indian EV engineering and a bold vision for the future of electric performance motorcycles."
    },
    "SIMPLE ENERGY": {
        logo: "https://logo.clearbit.com/simpleenergy.in",
        intro: "Simple Energy is a Bengaluru-based electric vehicle startup founded in 2019, best known for creating the Simple One — one of India's highest-range electric scooters at launch. The Simple One made headlines with its claimed range of over 200 km on a single charge and a bold, futuristic design that stood out in the crowded EV market. Simple Energy builds its scooters with a focus on performance, long range, and connected features accessible through a dedicated app. The brand raised significant venture capital funding and has been ramping up production at its manufacturing facility in Karnataka. Simple Energy is aimed at the premium electric scooter buyer who wants maximum range and a head-turning design."
    },
    "HOP ELECTRIC": {
        logo: "https://logo.clearbit.com/hopelectric.in",
        intro: "HOP Electric Mobility is a Jaipur-based electric two-wheeler brand founded in 2020, with a focus on delivering practical electric vehicles for Indian conditions. HOP's lineup includes the Leo and Oxo electric scooters, offering a balance of everyday range, affordability, and connected features. The brand operates its own manufacturing facility and has built a growing dealership network across India. HOP targets the mass market EV segment, aiming to offer reliable and feature-rich electric scooters at competitive price points. As a homegrown startup committed to the 'Make in India' mission, HOP Electric is a significant new entrant working to democratise electric mobility across the country."
    },
    "OKAYA": {
        logo: "https://logo.clearbit.com/okayaev.com",
        intro: "Okaya EV is the electric vehicle arm of Okaya Power Group, a well-established Indian conglomerate with expertise in batteries, power supplies, and energy solutions since 1988. Leveraging their deep battery technology know-how, Okaya entered the EV scooter market with a range of affordable and dependable electric two-wheelers. Their lineup focuses on practical urban commuting, offering sufficient range and reliability backed by the parent company's extensive service and support infrastructure. Okaya EV benefits from strong in-house battery manufacturing capability, reducing dependence on external suppliers and enabling competitive pricing. The brand targets pragmatic buyers seeking a trusted Indian brand in the rapidly growing electric scooter market."
    },
    "KEEWAY": {
        logo: "https://logo.clearbit.com/keeway.com",
        intro: "Keeway is a Chinese motorcycle brand that is a subsidiary of the Qianjiang Group, which also owns Benelli — a storied Italian motorcycle brand with over 100 years of history. In India, Keeway operates through a partnership and offers entry-level to mid-range motorcycles and scooters inspired by classic and retro styling. Their SR125 and other models cater to riders who want European-influenced design at accessible prices. Keeway benefits from Benelli's design resources and Qianjiang's manufacturing scale to deliver reasonably equipped motorcycles. The brand is carving out a niche among riders who want distinctive styling and a different ownership experience in the Indian two-wheeler market."
    },
    "CF MOTO": {
        logo: "https://logo.clearbit.com/cfmoto.com",
        intro: "CF Moto is a Chinese motorcycle manufacturer founded in 1989, headquartered in Hangzhou, and is one of China's premier premium motorcycle brands with a significant global presence. In India, CF Moto bikes are distributed by AMW Motorcycles and target the performance and adventure segment with models like the 300NK, 650GT, and the 650 ADV. CF Moto has a strategic technology partnership with KTM, which has significantly elevated its engine quality and component sourcing. Their motorcycles offer strong value, delivering features like upside-down forks, TFT displays, and riding modes typically found at much higher price points. CF Moto is a strong option for riders seeking premium performance without the premium European price tag."
    },
    "BGAUSE": {
        logo: "https://logo.clearbit.com/bgauss.com",
        intro: "BGauss is an Indian electric scooter brand launched in 2020 under the RR Global banner, a group with over 60 years of expertise in electrical components and infrastructure. The brand entered the EV market with a clear focus on quality manufacturing, safety, and aftersales support, backed by strong industry credentials. BGauss's lineup includes the D15 and B8 electric scooters, offering a range of riding modes, digital instrumentation, and competitive real-world range. The brand differentiates itself with robust build quality and a strong warranty program, inspired by the parent group's commitment to electrical excellence. BGauss targets the value-conscious premium EV buyer who prioritises long-term reliability and brand trust over flashy features."
    }
};

function applyFilters() {
    const searchVal = (document.querySelector(".search-input")?.value || "").toLowerCase();
    const brandVal = (document.getElementById("brandFilterInput")?.value || "").toLowerCase();
    const priceVal = document.getElementById("priceFilterInput")?.value || "";
    const typeVal = (document.getElementById("typeFilter")?.value || "").toLowerCase();
    const mileageVal = document.getElementById("mileageFilterInput")?.value || "";

    let minPrice = 0, maxPrice = Infinity;
    if (priceVal.includes("-")) [minPrice, maxPrice] = priceVal.split("-").map(Number);

    let minMileage = 0, maxMileage = Infinity;
    if (mileageVal.includes("-")) [minMileage, maxMileage] = mileageVal.split("-").map(Number);

    document.querySelectorAll(".bike").forEach(bike => {
        const name = bike.querySelector("h3").textContent.toLowerCase();
        const bikeBrand = (bike.dataset.brand || "").toLowerCase();
        const bikePrice = Number(bike.dataset.price || 0);
        const bikeType = (bike.dataset.type || "").toLowerCase();

        // Extract raw numerical values from dataset for advanced filtering
        let rawMileage = bike.dataset.mileage || "0";
        let bikeMileage = parseFloat(rawMileage.match(/\d+/)) || 0;

        const matchSearch = name.includes(searchVal);
        const matchSidebarBrand = selectedBrand === "BRANDS" || bikeBrand === selectedBrand.toLowerCase();
        const matchBrandInput = bikeBrand.includes(brandVal);
        const matchPrice = bikePrice >= minPrice && bikePrice <= maxPrice;
        const matchType = typeVal === "" || bikeType === typeVal;
        const matchMileage = bikeMileage >= minMileage && bikeMileage <= maxMileage;

        bike.style.display = (matchSearch && matchSidebarBrand && matchBrandInput && matchPrice && matchType && matchMileage) ? "block" : "none";
    });
}

function filterByBrand(brand) {
    selectedBrand = brand;

    // Visual feedback for selected brand
    document.querySelectorAll(".brand-card").forEach(c => {
        const onclickAttr = c.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${brand}'`)) {
            c.classList.add("active-brand");
        } else {
            c.classList.remove("active-brand");
        }
    });

    // Show brand introduction banner
    showBrandIntro(brand);

    applyFilters();

    // Scroll down to the brand intro / bike grid
    const bikeGrid = document.getElementById("bikeGrid");
    const intro = document.getElementById("brandIntroBanner");
    const scrollTarget = intro || bikeGrid;
    if (scrollTarget) {
        const yOffset = -20;
        const y = scrollTarget.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

function showBrandIntro(brand) {
    // Get or create the intro banner element
    let banner = document.getElementById("brandIntroBanner");
    const bikeGrid = document.getElementById("bikeGrid");
    if (!bikeGrid) return;

    if (!banner) {
        banner = document.createElement("div");
        banner.id = "brandIntroBanner";
        bikeGrid.parentNode.insertBefore(banner, bikeGrid);
    }

    const info = brandInfo[brand];
    if (!info) {
        banner.style.display = "none";
        return;
    }

    // Count bikes for this brand
    const bikeCount = allBikes.filter(b => b.brand && b.brand.toUpperCase() === brand.toUpperCase()).length;

    banner.innerHTML = `
        <div style="
            display: flex;
            align-items: flex-start;
            gap: 20px;
            background: linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
            border: 1px solid rgba(255, 215, 0, 0.25);
            border-radius: 20px;
            padding: 24px 28px;
            margin-bottom: 25px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            animation: heroFadeIn 0.5s ease forwards;
        ">
            <img src="${info.logo}" alt="${brand} Logo"
                style="width:80px; height:80px; object-fit:contain; background:white;
                       border-radius:12px; padding:8px; flex-shrink:0;
                       box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <div style="flex:1;">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px; flex-wrap:wrap;">
                    <h2 style="color:#ffd700; font-size:20px; font-weight:800;
                               letter-spacing:1px; text-transform:uppercase; margin:0;">${brand}</h2>
                    <span style="background:rgba(255,215,0,0.15); color:#ffd700; border:1px solid rgba(255,215,0,0.4);
                                 font-size:12px; font-weight:700; padding:3px 12px; border-radius:20px; white-space:nowrap;">
                        🏍️ ${bikeCount} Bike${bikeCount !== 1 ? 's' : ''} Available
                    </span>
                </div>
                <p style="color:#cbd5e1; font-size:14px; line-height:1.8; margin:0;">${info.intro}</p>
            </div>
        </div>
    `;
    banner.style.display = "block";
}

function hideBrandIntro() {
    const banner = document.getElementById("brandIntroBanner");
    if (banner) banner.style.display = "none";
}

// =========================================
// HERO VIDEO MUTE TOGGLE
// =========================================
function toggleHeroMute() {
    const video = document.getElementById('heroVideo');
    const btn = document.getElementById('muteBtn');
    if (!video) return;
    video.muted = !video.muted;
    btn.textContent = video.muted ? '🔇' : '🔊';
}

function toggleClearSearch() {
    const searchInput = document.querySelector(".search-input");
    const clearBtn = document.getElementById("clearSearchBtn");
    if (searchInput && clearBtn) {
        clearBtn.style.display = searchInput.value.length > 0 ? "block" : "none";
    }
}

function clearSearch() {
    const searchInput = document.querySelector(".search-input");
    if (searchInput) {
        searchInput.value = "";
        toggleClearSearch();
        applyFilters();
    }
}

// Filter Event Listeners Setup
document.addEventListener("DOMContentLoaded", () => {
    const filters = [".search-input", "#brandFilterInput", "#priceFilterInput", "#mileageFilterInput"];
    filters.forEach(id => document.querySelector(id)?.addEventListener("input", applyFilters));

    const searchInput = document.querySelector(".search-input");
    if (searchInput) {
        searchInput.addEventListener("input", toggleClearSearch);
    }

    document.getElementById("typeFilter")?.addEventListener("change", applyFilters);
    renderBikes();
});

function setActiveMenu(item) {
    document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
    item.classList.add("active");
    if (item.textContent.includes("Home")) resetToHome();
    closeMenu();
}

function resetToHome() {
    selectedBrand = "BRANDS";
    const inputs = [".search-input", "#brandFilterInput", "#priceFilterInput", "#mileageFilterInput", "#typeFilter"];
    inputs.forEach(id => { if (document.querySelector(id)) document.querySelector(id).value = ""; });

    if (typeof toggleClearSearch === 'function') toggleClearSearch();

    if (document.getElementById("brandFilter")) document.getElementById("brandFilter").style.display = "none";
    if (document.getElementById("modernBrandFilter")) document.getElementById("modernBrandFilter").style.display = "none";
    if (document.querySelector(".main-layout")) document.querySelector(".main-layout").style.gridTemplateColumns = "1fr";

    document.querySelectorAll(".brand-card").forEach(c => c.classList.remove("active-brand"));
    hideBrandIntro();
    applyFilters();

    // Scroll to top easily
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openBikes(item) {
    document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
    item.classList.add("active");

    const mbf = document.getElementById("modernBrandFilter");
    if (mbf) {
        mbf.style.display = "block";
        // Let the user actually see the brands appearing by scrolling to it!
        setTimeout(() => {
            const yOffset = -50;
            const y = mbf.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 300); // slight delay to allow display computation
    }

    if (document.querySelector(".main-layout")) document.querySelector(".main-layout").style.gridTemplateColumns = "1fr";
    closeMenu();
}

function showMoreBrands() {
    const m = document.getElementById("moreBrands");
    if (m) {
        const isHidden = m.style.display === "none" || m.style.display === "";
        m.style.display = isHidden ? "block" : "none";
        if (document.getElementById("showMoreBtn")) {
            document.getElementById("showMoreBtn").textContent = isHidden ? "SHOW LESS🔺" : "SHOW ALL";
        }
    }
}

function toggleMoreBrandsGrid() {
    const m = document.getElementById("moreBrandsGrid");
    const btn = document.getElementById("showMoreBrandsGridBtn");
    const mainGrid = document.getElementById("brandGridContainer");
    if (m && btn && mainGrid) {
        const isHidden = m.style.display === "none" || m.style.display === "";
        m.style.display = isHidden ? "grid" : "none";
        btn.textContent = isHidden ? "View Less Brands" : "View More Brands";

        if (isHidden) {
            mainGrid.style.borderBottomLeftRadius = "0";
            mainGrid.style.borderBottomRightRadius = "0";
            mainGrid.style.borderBottom = "none";
        } else {
            mainGrid.style.borderBottomLeftRadius = "16px";
            mainGrid.style.borderBottomRightRadius = "16px";
            mainGrid.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        }
    }
}

// =========================================
// 6. PDF EXPORT LOGIC (SINGLE & COMPARE)
// =========================================

// Shared helper: Convert Image URL to Base64 format
async function getBase64FromUrl(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.warn("First fetch failed, trying canvas fallback:", e);
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth || 100;
                    canvas.height = img.naturalHeight || 100;
                    canvas.getContext("2d").drawImage(img, 0, 0);
                    resolve(canvas.toDataURL("image/jpeg", 0.8));
                } catch (err) {
                    resolve(null);
                }
            };
            img.onerror = () => resolve(null);
            img.src = url;
        });
    }
}

// Generate single bike specifications report from modal
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById("captureArea");
    const modal = document.getElementById("bikeModal");

    // Temporarily conceal controls for clean snapshot
    const downloadBtn = document.querySelector(".download-container");
    const closeBtn = document.querySelector(".close-btn");
    if (downloadBtn) downloadBtn.style.display = "none";
    if (closeBtn) closeBtn.style.display = "none";

    try {
        // Convert active image display to Base64 for rendering inside canvas
        const bikeImg = document.getElementById("modalMainImg");
        let originalSrc = "";
        if (bikeImg && bikeImg.src && !bikeImg.src.startsWith("data:image")) {
            originalSrc = bikeImg.src;
            const base64 = await getBase64FromUrl(bikeImg.src);
            if (base64) {
                bikeImg.src = base64;
            } else {
                // To avoid tainted canvas, use a transparent pixel if it fails
                bikeImg.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
            }
        }

        // Allow partial delay for DOM modifications
        await new Promise((r) => setTimeout(r, 500));

        // Restore capturing area to native heights to bypass hidden scroll bounds
        element.scrollTo(0, 0);
        modal.scrollTo(0, 0);

        const originalMaxHeight = element.style.maxHeight;
        const originalOverflow = element.style.overflowY;

        element.style.maxHeight = "none";
        element.style.overflowY = "visible";

        await new Promise((r) => setTimeout(r, 100));

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            windowHeight: element.scrollHeight,
            windowWidth: element.scrollWidth,
            scrollY: 0,
            x: 0,
            y: 0
        });

        // Restore original scroll rules
        element.style.maxHeight = originalMaxHeight;
        element.style.overflowY = originalOverflow;

        generateMultiPagePDF(canvas, document.getElementById("modalTitle")?.textContent || "Bike_Report");

    } catch (error) {
        alert("PDF Rendering Error: " + error.message);
    } finally {
        // Re-display user controls
        if (downloadBtn) downloadBtn.style.display = "block";
        if (closeBtn) closeBtn.style.display = "block";
    }
}

// Generate comparison table report logic
async function downloadComparisonPDF() {
    const { jsPDF } = window.jspdf;
    const tableArea = document.getElementById("compareTableArea");
    const printArea = document.getElementById("comparePrintArea");

    if (!tableArea || tableArea.innerHTML === "") {
        alert("No comparison data available to export!");
        return;
    }

    try {
        // Temporarily prepare images for canvas
        const imgs = printArea.querySelectorAll("img");
        for (let img of imgs) {
            if (img.src && !img.src.startsWith("data:image")) {
                const base64 = await getBase64FromUrl(img.src);
                if (base64) img.src = base64;
            }
        }

        // 🚀 SMART CAPTURE: Expanded Table Logic
        // We find the wrapper we created in buildCompareTable (overflow-x: auto)
        const scrollWrapper = tableArea.querySelector("div");
        const originalOverflow = scrollWrapper ? scrollWrapper.style.overflowX : "";
        const originalWidth = scrollWrapper ? scrollWrapper.style.width : "";

        if (scrollWrapper) {
            // 🚀 Force expanded width for capture to ensure NO CLIPPING
            scrollWrapper.style.overflowX = "visible";
            scrollWrapper.style.width = scrollWrapper.scrollWidth + "px"; // Force it to show full width
            scrollWrapper.style.display = "block";
        }

        await new Promise((r) => setTimeout(r, 1000));

        const canvas = await html2canvas(printArea, {
            scale: 3, // Increased scale for sharp text in portrait
            useCORS: true,
            backgroundColor: "#ffffff",
            width: printArea.scrollWidth,
            height: printArea.scrollHeight,
            windowWidth: printArea.scrollWidth,
            windowHeight: printArea.scrollHeight,
            scrollY: 0,
            x: 0,
            y: 0
        });

        // Restore original scroll state
        if (scrollWrapper) {
            scrollWrapper.style.overflowX = originalOverflow;
            scrollWrapper.style.width = originalWidth;
            scrollWrapper.style.display = "grid"; // Restore original grid display
        }

        // 🚀 BACK TO PORTRAIT as requested, with auto-scale
        generateMultiPagePDF(canvas, "MotoHub_Comparison_Report");

    } catch (error) {
        console.error("PDF Export Logic Error:", error);
        alert("Comparison PDF Error: " + error.message);
    }
}

// Common paginated PDF Generator Utility
function generateMultiPagePDF(canvas, fileName, orientation = 'p') {
    const { jsPDF } = window.jspdf;
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF(orientation, "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Scale image to fit the width of the PDF page
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Output initial page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Construct sequential pages dynamically
    while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName.trim()}.pdf`);
}

// =========================================
// 7. KEYBOARD SHORTCUTS (ESC GLOBAL LOGIC)
// =========================================
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.keyCode === 27) {
        const modal = document.getElementById("bikeModal");
        const sidebar = document.getElementById("sidebar");

        if (modal && (modal.style.display === "flex" || getComputedStyle(modal).display === "flex")) {
            closeModal();
            return;
        }

        const inputs = [".search-input", "#brandFilterInput", "#priceFilterInput", "#mileageFilterInput"];
        let inputFocused = false;
        inputs.forEach(id => {
            const el = document.querySelector(id);
            if (document.activeElement === el) {
                el.value = "";
                el.blur();
                inputFocused = true;
            }
        });

        if (inputFocused) {
            applyFilters();
            return;
        }

        if (sidebar && sidebar.classList.contains("active")) {
            closeMenu();
            return;
        }

        resetToHome();
    }
});

// =========================================
// 8. COMPARE CONTEXT (QUEUE & MODAL RENDER)
// =========================================
function addToCompare(event, id) {
    event.stopPropagation();

    if (compareList.includes(id)) {
        alert("This bike is already in the comparison list.");
        return;
    }

    if (compareList.length >= 3) {
        alert("You can only compare up to 3 bikes simultaneously.");
        return;
    }

    compareList.push(id);
    updateCompareIcon();
}

function updateCompareIcon() {
    const icon = document.getElementById("compareIcon");
    const countLabel = document.getElementById("compareCount");

    if (compareList.length > 0) {
        if (icon) icon.style.display = "block";
        if (countLabel) countLabel.innerText = compareList.length;
    } else {
        if (icon) icon.style.display = "none";
    }
}


// 🚀 ALL SPECS + TCO COMPARISON LOGIC 
let compareSlots = [null, null, null, null];
let activeSlotIndex = 0;

function openCompareFromMenu(item) {
    document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
    if (item) item.classList.add("active");

    compareSlots = [null, null, null, null];
    for (let i = 0; i < compareList.length && i < 4; i++) {
        compareSlots[i] = compareList[i];
    }

    renderCompareSlots();

    document.getElementById("compareSelectorView").style.display = "block";
    document.getElementById("compareResultView").style.display = "none";
    document.getElementById("compareModal").style.display = "flex";
    document.body.style.overflow = "hidden";

    closeMenu();
}

function openCompareModal() {
    if (compareList.length < 2) {
        alert("ADD MINIMUM 2 BIKES!");
        return;
    }

    document.getElementById("compareSelectorView").style.display = "none";
    document.getElementById("compareResultView").style.display = "block";
    document.getElementById("compareModal").style.display = "flex";
    document.body.style.overflow = "hidden";

    buildCompareTable(compareList);
}

function renderCompareSlots() {
    for (let i = 0; i < 4; i++) {
        const slotEl = document.getElementById("slot-" + i);
        if (!slotEl) continue;
        const bikeId = compareSlots[i];
        if (bikeId && allBikes.length > 0) {
            const bike = allBikes.find(b => b.id === bikeId);
            if (bike) {
                let imgUrl = 'pulred.jpg';
                if (bike.image) {
                    let firstImg = bike.image.split(',')[0].trim();
                    imgUrl = firstImg.includes('|') ? firstImg.split('|')[1].trim() : firstImg;
                }
                slotEl.innerHTML = `
                  <div class="selected-bike-slot">
                    <button class="remove-bike-btn" onclick="event.stopPropagation(); removeBikeFromSlot(${i})">&times;</button>
                    <img src="${imgUrl}" alt="${bike.name}">
                    <span>${bike.name}</span>
                  </div>
                `;
            }
        } else {
            slotEl.innerHTML = `
              <div class="slot-content">
                <span class="bike-silhouette">🏍️</span>
                <span class="add-text">⊕ Add Bike</span>
              </div>
            `;
        }
    }
}

function removeBikeFromSlot(index) {
    compareSlots[index] = null;
    renderCompareSlots();
}

function openBikeSearchForSlot(index) {
    activeSlotIndex = index;
    const modal = document.getElementById("bikeSelectorModal");
    if (modal) {
        modal.style.display = "flex";
        document.getElementById("slotSearchInput").value = "";
        filterSlotBikes();
    }
}

function closeBikeSelector() {
    const modal = document.getElementById("bikeSelectorModal");
    if (modal) modal.style.display = "none";
}

function filterSlotBikes() {
    const query = document.getElementById("slotSearchInput").value.toLowerCase();
    const list = document.getElementById("slotBikeList");
    if (!list) return;

    list.innerHTML = "";

    const available = allBikes.filter(b => !compareSlots.includes(b.id) || compareSlots[activeSlotIndex] === b.id);

    available.forEach(bike => {
        if (bike.name.toLowerCase().includes(query) || (bike.brand && bike.brand.toLowerCase().includes(query))) {
            let imgUrl = 'pulred.jpg';
            if (bike.image) {
                let firstImg = bike.image.split(',')[0].trim();
                imgUrl = firstImg.includes('|') ? firstImg.split('|')[1].trim() : firstImg;
            }
            list.innerHTML += `
               <div class="selector-bike-item" onclick="selectBikeForSlot('${bike.id}')">
                   <img src="${imgUrl}" style="width:60px; height:40px; object-fit:contain; background:white; border-radius:4px; padding:2px;">
                   <div>
                       <div style="font-weight:bold; font-size:14px; color:#fff;">${bike.name}</div>
                       <div style="font-size:12px; color:#a0aab2;">${bike.brand} • ₹${Number(bike.price || 0).toLocaleString('en-IN')}</div>
                   </div>
               </div>
            `;
        }
    });
}

function selectBikeForSlot(bikeId) {
    compareSlots[activeSlotIndex] = bikeId;
    closeBikeSelector();
    renderCompareSlots();
}

function backToSelector() {
    document.getElementById("compareResultView").style.display = "none";
    document.getElementById("compareSelectorView").style.display = "block";
}

function executeComparison() {
    const validBikes = compareSlots.filter(id => id !== null);
    if (validBikes.length < 2) {
        alert("ADD MINIMUM 2 BIKES!");
        return;
    }

    document.getElementById("compareSelectorView").style.display = "none";
    document.getElementById("compareResultView").style.display = "block";

    buildCompareTable(validBikes);
}

function buildCompareTable(bikeIds) {
    const tableArea = document.getElementById("compareTableArea");
    const promises = bikeIds.map(id => db.ref('bikes/' + id).once('value'));

    Promise.all(promises).then(snapshots => {
        const bikes = snapshots.map(s => s.val());
        const getSpec = (bike, key) => (bike.specs && bike.specs[key] && bike.specs[key] !== "-" && bike.specs[key] !== "0") ? bike.specs[key] : "Not Available";

        // Define all categories and their respective keys
        const sections = [
            { 
                name: "⚡ POWER & PERFORMANCE", 
                rows: [
                    { label: "Displacement", key: "displacement" },
                    { label: "Max Power", key: "maxPower" },
                    { label: "Max Torque", key: "maxTorque" },
                    { label: "Top Speed", key: "topSpeed" },
                    { label: "Mileage", key: "mileage" },
                    { label: "Fuel Type", key: "fuelType" },
                    { label: "Transmission", key: "transmission" },
                    { label: "Transmission Type", key: "transmissionType" },
                    { label: "Gear Pattern", key: "gearPattern" },
                    { label: "Clutch", key: "clutch" },
                    { label: "Riding Range", key: "ridingRange" },
                    { label: "Riding Modes", key: "ridingModes" },
                    { label: "Cylinders", key: "cylinders" },
                    { label: "Cooling System", key: "cooling" },
                    { label: "Bore x Stroke", key: "boreStroke" },
                    { label: "Compression Ratio", key: "compressionRatio" },
                    { label: "Spark Plugs", key: "sparkPlugs" },
                    { label: "Battery", key: "battery" },
                    { label: "Emission Standard", key: "emission" }
                ]
            },
            { 
                name: "🛑 BRAKES & WHEELS", 
                rows: [
                    { label: "Braking System", key: "brakingSystem" },
                    { label: "Front Brake Type", key: "frontBrakeType" },
                    { label: "Front Brake Size", key: "frontBrakeSize" },
                    { label: "Rear Brake Type", key: "rearBrakeType" },
                    { label: "Rear Brake Size", key: "rearBrakeSize" },
                    { label: "Caliper (Front)", key: "caliperFront" },
                    { label: "Caliper (Rear)", key: "caliperRear" },
                    { label: "Wheel Type", key: "wheelType" },
                    { label: "Front Wheel Size", key: "frontWheelSize" },
                    { label: "Rear Wheel Size", key: "rearWheelSize" },
                    { label: "Tyre Type", key: "tyreType" },
                    { label: "Tyre Size", key: "tyreSize" },
                    { label: "Tyre Pressure (Solo)", key: "tyrePressureSolo" },
                    { label: "Tyre Pressure (Dual)", key: "tyrePressureDual" }
                ]
            },
            { 
                name: "📐 DIMENSIONS & CHASSIS", 
                rows: [
                    { label: "Front Suspension", key: "frontSuspension" },
                    { label: "Rear Suspension", key: "rearSuspension" },
                    { label: "Chassis Type", key: "chassisType" },
                    { label: "Kerb Weight", key: "kerbWeight" },
                    { label: "Seat Height", key: "seatHeight" },
                    { label: "Seat Length", key: "seatLength" },
                    { label: "Ground Clearance", key: "groundClearance" },
                    { label: "Fuel Tank Capacity", key: "fuelTankCapacity" },
                    { label: "Reserve Fuel Capacity", key: "reserveFuelCapacity" },
                    { label: "Wheelbase", key: "wheelbase" },
                    { label: "Overall Dimensions", key: "overallDimensions" }
                ]
            },
            { 
                name: "📟 INSTRUMENT CLUSTER", 
                rows: [
                    { label: "Console", key: "instrumentConsole" },
                    { label: "Touch Screen", key: "touchScreenDisplay" },
                    { label: "Display Size", key: "displaySize" },
                    { label: "Mobile Connectivity", key: "mobileConnectivity" },
                    { label: "GPS & Navigation", key: "gpsNavigation" },
                    { label: "Avg Fuel Eco", key: "avgFuelConsumption" },
                    { label: "Real Time Mileage", key: "realTimeMileage" },
                    { label: "Speedometer", key: "speedometer" },
                    { label: "Odometer", key: "odometer" },
                    { label: "Fuel Gauge", key: "fuelGauge" },
                    { label: "Distance to Empty", key: "distanceToEmpty" },
                    { label: "Tripmeter", key: "tripmeter" },
                    { label: "Tachometer", key: "tachometer" },
                    { label: "Gear Indicator", key: "gearIndicator" },
                    { label: "Service Reminder", key: "serviceReminder" },
                    { label: "Call / SMS Alerts", key: "callSmsAlerts" },
                    { label: "Clock", key: "clock" }
                ]
            },
            { 
                name: "🔒 SAFETY & CONVENIENCE", 
                rows: [
                    { label: "USB Charging", key: "usbChargingPort" },
                    { label: "Keyless System", key: "keylessLock" },
                    { label: "Traction Control", key: "tractionControl" },
                    { label: "Cruise Control", key: "cruiseControl" },
                    { label: "Quickshifter", key: "quickshifter" },
                    { label: "Start Type", key: "startType" },
                    { label: "Auto Start/Stop", key: "autoStartStop" },
                    { label: "Side Stand Cut-off", key: "sideStandCutoff" },
                    { label: "Kill Switch", key: "killSwitch" }
                ]
            },
            { 
                name: "💡 LIGHTING", 
                rows: [
                    { label: "Headlight", key: "headlightType" },
                    { label: "Projector Headlamp", key: "projectorHeadlamp" },
                    { label: "Drls", key: "drl" },
                    { label: "Tail Light", key: "brakeTailLight" },
                    { label: "Hazard Lights", key: "hazardLights" },
                    { label: "Turn Signals", key: "turnSignal" }
                ]
            },
            { 
                name: "💺 COMFORT", 
                rows: [
                    { label: "Under Seat Storage", key: "underSeatStorage" },
                    { label: "Pillion Seat", key: "pillionSeat" },
                    { label: "Pillion Backrest", key: "pillionBackrest" },
                    { label: "Pillion Footrest", key: "pillionFootrest" },
                    { label: "Pillion Grab Rail", key: "pillionGrabRail" }
                ]
            }
        ];

        let tableRowsHtml = "";

        // First Basic Info Rows (Photo & Price)
        tableRowsHtml += `
            <tr>
                <td style="padding:15px; font-weight:bold; background:#fafafa; border:1px solid #ddd; width:220px;">Bike Photo</td>
                ${bikes.map(b => {
                    let imgUrl = 'pulred.jpg';
                    if (b.image) {
                        let firstImg = b.image.split(',')[0].trim();
                        imgUrl = firstImg.includes('|') ? firstImg.split('|')[1].trim() : firstImg;
                    }
                    return `<td style="text-align:center; border:1px solid #ddd; padding:15px;"><img src="${imgUrl}" style="width:140px; height:90px; object-fit:contain;"></td>`;
                }).join('')}
            </tr>
            <tr>
                <td style="padding:15px; font-weight:bold; background:#fafafa; border:1px solid #ddd;">Showroom Price</td>
                ${bikes.map(b => `<td style="text-align:center; border:1px solid #ddd; font-weight:800; font-size:18px; color:#1e3c72; padding:15px;">₹${Number(b.price || 0).toLocaleString('en-IN')}</td>`).join('')}
            </tr>
        `;

        // Dynamic Section Rendering
        sections.forEach(section => {
            // Category Header Row
            tableRowsHtml += `<tr><td colspan="${bikes.length + 1}" style="background:#1e3c72; color:white; padding:12px; font-weight:bold; text-align:center; border:1px solid #1e3c72; letter-spacing:1px; font-size:14px;">${section.name}</td></tr>`;
            
            // Specification Rows
            section.rows.forEach(row => {
                tableRowsHtml += `
                    <tr>
                        <td style="padding:12px; font-weight:bold; background:#fafafa; border:1px solid #ddd; font-size:13px; color:#64748b;">${row.label}</td>
                        ${bikes.map(b => {
                            const val = getSpec(b, row.key);
                            const isNA = val === "Not Available";
                            return `<td style="text-align:center; border:1px solid #ddd; padding:12px; font-weight:600; font-size:13px; color: ${isNA ? '#a0aab2' : '#333'};">${val}</td>`;
                        }).join('')}
                    </tr>
                `;
            });
        });

        tableArea.innerHTML = `
            <div style="overflow-x: auto; border-radius:12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);"> 
                <table style="width:100%; border-collapse:collapse; min-width:900px; background: white; font-family:'Outfit', sans-serif;">
                    <thead>
                        <tr style="background: linear-gradient(135deg, #1e3c72, #2a5298); color: white;">
                            <th style="padding:20px; border:1px solid rgba(255,255,255,0.1); text-align:left; font-size:16px;">Technical Comparison</th>
                            ${bikes.map(b => `<th style="padding:20px; border:1px solid rgba(255,255,255,0.1); text-align:center; font-size:16px; font-weight:800;">${b.name || 'N/A'}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody style="font-size:13px; color: #333;">
                        ${tableRowsHtml}
                    </tbody>
                </table>
            </div>`;
    }).catch(err => {
        console.error("Comparison Table Build Logic Error:", err);
    });
}

function clearComparison() {
    compareSlots = [null, null, null, null];
    compareList = [];
    updateCompareIcon();
    renderCompareSlots();
    closeCompareModal();
}

function closeCompareModal() {
    document.getElementById("compareModal").style.display = "none";
    document.body.style.overflow = "auto";
}

// Note: renderBikes() is already called inside the DOMContentLoaded listener above (line ~794)

// =========================================
// 9. IMAGE VIEWER ENGINE (FULLSCREEN / GALLREY)
// =========================================
function openImageViewer(src) {
    const viewer = document.getElementById("imageViewer");
    const fullImg = document.getElementById("fullImage");

    if (viewer && fullImg) {
        isFiltered = false;
        fullImg.src = src;
        viewer.classList.add("active");
        renderProfessionalViewer();
    }
}

function closeImageViewer() {
    const viewer = document.getElementById("imageViewer");
    if (viewer) {
        viewer.classList.remove("active");
    }

    // Reset color swatch container visibility
    const colorContainer = document.getElementById("viewerColorContainer");
    if (colorContainer) {
        colorContainer.style.display = "none";
    }
}

// Helper to extract color from an image string
function getColorFromName(imgStr) {
    if (!imgStr) return "default";
    let img = imgStr.trim();
    if (img.includes('|')) return img.split('|')[0].toLowerCase().trim();
    if (!img.startsWith('http') && !img.startsWith('data:')) {
        let filename = img.split('/').pop().split('\\').pop();
        if (filename.includes('_')) return filename.split('_')[0].toLowerCase().trim();
    }
    return "default";
}

// Global Image Navigation Routing (Dual Mode Mechanism)
function changeImage(step) {
    if (currentImages.length <= 1) return;

    const viewer = document.getElementById("imageViewer");
    const isFullScreen = viewer && viewer.classList.contains("active");

    if (isFullScreen && isFiltered) {
        // Mode A: Color Filtered Navigation (Color Specific Range)
        let currentColor = getColorFromName(currentImages[currentIndex]);
        let filteredIndices = [];
        currentImages.forEach((img, index) => {
            if (getColorFromName(img) === currentColor) filteredIndices.push(index);
        });

        let currentPos = filteredIndices.indexOf(currentIndex);
        let nextPos = currentPos + step;

        if (nextPos >= filteredIndices.length) nextPos = 0;
        if (nextPos < 0) nextPos = filteredIndices.length - 1;

        currentIndex = filteredIndices[nextPos];
    } else {
        // Mode B: Normal Navigation Array
        let nextIndex = currentIndex + step;
        if (nextIndex >= currentImages.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = currentImages.length - 1;
        currentIndex = nextIndex;
    }
    updateSliderImage();
}

function updateSliderImage() {
    const modalImg = document.getElementById('modalMainImg');
    const fullImg = document.getElementById('fullImage');
    const viewer = document.getElementById("imageViewer");

    if (currentImages && currentImages.length > 0) {
        let rawSrc = currentImages[currentIndex];

        // 🚀 Separator Logic: "|" irundha link-a mattum pirichu edukkuRA LOGIC
        let finalSrc = rawSrc.includes('|') ? rawSrc.split('|')[1].trim() : rawSrc.trim();

        if (modalImg) modalImg.src = finalSrc;
        if (fullImg) fullImg.src = finalSrc;
    }

    // Modal view specific button logic bounding
    const mPrev = document.querySelector('.modal-image-container .prev');
    const mNext = document.querySelector('.modal-image-container .next');

    if (mPrev) mPrev.style.display = (currentIndex === 0) ? "none" : "flex";
    if (mNext) mNext.style.display = (currentIndex === currentImages.length - 1) ? "none" : "flex";

    // Full screen viewer active-aa irundha swatches-a update pannum
    if (viewer && viewer.classList.contains("active")) {
        renderProfessionalViewer();
    }
}
// Touch Event Global Listener Engine
let touchstartX = 0;
let touchendX = 0;

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const modal = document.getElementById("bikeModal");
    const viewer = document.getElementById("imageViewer");

    // Fixed: viewer uses CSS class 'active' to show (not inline style)
    const modalOpen = modal && modal.style.display === "flex";
    const viewerOpen = viewer && viewer.classList.contains("active");

    if (modalOpen || viewerOpen) {
        // Left Swipe Logic
        if (touchendX < touchstartX - 50) {
            changeImage(1);
        }
        // Right Swipe Logic
        if (touchendX > touchstartX + 50) {
            changeImage(-1);
        }
    }
}

let isFiltered = false;

//🚀 FIXED RENDER VIEWER FOR LINKS WITH UNDERSCORES
function renderProfessionalViewer() {
    const container = document.getElementById("viewerColorContainer");
    if (!container) return;
    container.innerHTML = "";

    const uniqueColors = [];
    const colorSeen = new Set();

    currentImages.forEach((img, index) => {
        let colorName = getColorFromName(img);

        if (!colorSeen.has(colorName)) {
            colorSeen.add(colorName);
            uniqueColors.push({ name: colorName, firstIndex: index });
        }
    });

    uniqueColors.forEach((colorObj) => {
        let swatch = document.createElement("div");
        let currentImgColor = getColorFromName(currentImages[currentIndex]);

        swatch.className = `color-swatch ${isFiltered && colorObj.name === currentImgColor ? 'active' : ''}`;

        if (colorObj.name.includes("-")) {
            let colors = colorObj.name.split("-");
            swatch.style.background = `linear-gradient(to right, ${colors[0]} 50%, ${colors[1]} 50%)`;
        } else {
            swatch.style.backgroundColor = colorObj.name === "default" ? "#ddd" : colorObj.name;
        }

        swatch.onclick = (e) => {
            e.stopPropagation();
            isFiltered = true;
            currentIndex = colorObj.firstIndex;
            updateSliderImage();
        };
        container.appendChild(swatch);
    });

    let indicator = document.getElementById("viewerIndicator");
    if (indicator) {
        indicator.innerText = `${currentIndex + 1}/${currentImages.length} images`;
    }
}

// Toggle Visibility Interface Handler 
function toggleColorBar() {
    const container = document.getElementById("viewerColorContainer");
    if (container) {
        const isHidden = container.style.display === "none";
        container.style.display = isHidden ? "flex" : "none";
        renderProfessionalViewer();
    }
}

// Universal Graphic Initializer Sequence
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.transform = "scale(1.5)";
            splash.style.opacity = "0";
            setTimeout(() => splash.remove(), 800);
        }
    }, 2000);
});

// Image Save & Export Routine
async function downloadCurrentFullImage() {
    const fullImg = document.getElementById('fullImage');
    if (!fullImg || !fullImg.src) return;

    try {
        const response = await fetch(fullImg.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        const bikeName = document.getElementById("modalTitle")?.innerText || "Bike";
        a.download = `${bikeName.replace(/\s+/g, '_')}_Image.jpg`;

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error("Download exception execution context:", error);
        alert("Failed to download image. Try again.");
    }
}

// ==========================================
// 14. INNOVATIVE FEATURES (TCO, SOUND)
// ==========================================



// --- TCO (Total Cost of Ownership) Calculator ---
function toggleTCO() {
    const area = document.getElementById('tcoArea');
    if (!area) return;

    if (area.style.display === 'none' || area.style.display === '') {
        area.style.display = 'block';
        calculateTCO();
    } else {
        area.style.display = 'none';
    }
}

function calculateTCO() {
    const content = document.getElementById('tcoContent');
    if (!currentBikeFullData) return;

    // 🚀 Slider-la irundhu usage distance-a edukkurom mapla
    const usageSlider = document.getElementById('usageDistanceSlider');
    const totalDistance = usageSlider ? parseInt(usageSlider.value) : 50000;

    let price = Number(currentBikeFullData.price) || 0;
    let isElectric = currentBikeFullData.type && currentBikeFullData.type.toLowerCase() === 'electric';
    let fuelCost = 0;

    if (isElectric) {
        // Electric bike-ku distance-ku etha maadhiri energy cost mapla
        // Calculation: (Distance / Range) * Unit Price (approx ₹7 per charge)
        fuelCost = (totalDistance / 100) * 15; // Rough estimate ₹15 per 100km
    } else {
        // Petrol estimation mapla
        let mileageRaw = currentBikeFullData.specs && currentBikeFullData.specs.mileage ? currentBikeFullData.specs.mileage : "40";
        let mileage = parseFloat(mileageRaw.replace(/[^0-9.]/g, '') || "40");
        let petrolPrice = 105; // Current Salem petrol price approx mapla
        let totalFuelNeeded = totalDistance / mileage;
        fuelCost = totalFuelNeeded * petrolPrice;
    }

    // Maintenance estimation (ICE bikes-ku konjam adhigam mapla)
    let maintenanceCost = (price * (isElectric ? 0.08 : 0.15));
    let totalTCO = price + fuelCost + maintenanceCost;

    content.innerHTML = `
        <div style="margin-bottom: 20px; background: #f1f5f9; padding: 15px; border-radius: 12px;">
            <label style="display:block; font-weight:bold; margin-bottom:10px; color:#1e3c72;">5-Year Usage: <span id="usageVal" style="color:#ef4444;">${totalDistance.toLocaleString()} km</span></label>
            <input type="range" id="usageDistanceSlider" min="10000" max="100000" step="5000" value="${totalDistance}" 
                   style="width:100%; cursor:pointer;" oninput="calculateTCO()">
        </div>

        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>Initial Showroom Price:</span> <strong>₹${price.toLocaleString('en-IN')}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>Est. Energy/Fuel Cost:</span> <strong style="color:#d97706;">₹${Math.round(fuelCost).toLocaleString('en-IN')}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #cbd5e1; padding-bottom:12px;">
            <span>Est. Maintenance & Insurance:</span> <strong style="color:#3b82f6;">₹${Math.round(maintenanceCost).toLocaleString('en-IN')}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; font-size:18px;">
            <span style="color:#b91c1c; font-weight:800;">Total Ownership Cost:</span> <strong style="color:#b91c1c;">₹${Math.round(totalTCO).toLocaleString('en-IN')}</strong>
        </div>
    `;
}
// --- Synthesized / Custom Exhaust Revving Sound ---
let currentAudio = null;
let currentRevBtn = null;
let synthAudioTimeout = null;

function stopRevving() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    if (currentRevBtn) {
        currentRevBtn.classList.remove('shake-active');
        currentRevBtn = null;
    }
    if (synthAudioTimeout) {
        clearTimeout(synthAudioTimeout);
        synthAudioTimeout = null;
    }
}

function revEngine(event) {
    if (!currentBikeFullData) return;

    let btn = event ? event.target.closest('button') : null;

    // If already playing, stop it and return (toggle off)
    if (currentAudio || (currentRevBtn && currentRevBtn.classList.contains('shake-active'))) {
        stopRevving();
        return;
    }

    if (btn) {
        currentRevBtn = btn;
        btn.classList.add('shake-active');
    }

    // 1. Prioritize Custom Sound URL if provided
    if (currentBikeFullData.sound && currentBikeFullData.sound.trim() !== "") {
        currentAudio = new Audio(currentBikeFullData.sound.trim());
        currentAudio.volume = 0.8;

        currentAudio.onended = () => {
            stopRevving();
        };

        let playPromise = currentAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Custom audio playback failed. URL might be invalid or blocked.", error);
                stopRevving();
                playSyntheticSoundFallback();
            });
        }
    } else {
        // 2. Play Synthesized Sound as Fallback
        playSyntheticSoundFallback();
    }
}

function playSyntheticSoundFallback() {
    playSyntheticSound();
    // Synthetic sound plays for about ~1.2s max. 
    synthAudioTimeout = setTimeout(() => {
        stopRevving();
    }, 1200);
}

function playSyntheticSound() {
    let isElectric = currentBikeFullData.type && currentBikeFullData.type.toLowerCase() === 'electric';

    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (isElectric) {
            // High-pitched Whine = Electric Motor Sound
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';

            // Pitch sweeps up from 400Hz to 2000Hz over 0.8 seconds
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.8);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 1.2);

            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.2);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 1.2);
        } else {
            // Gritty Low Pitch Rumble = ICE Exhaust Sound
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            osc.type = 'sawtooth';

            // Rumble sweeps up
            osc.frequency.setValueAtTime(60, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(160, audioCtx.currentTime + 0.4);
            osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 1.0);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(300, audioCtx.currentTime);
            filter.frequency.linearRampToValueAtTime(3000, audioCtx.currentTime + 0.4);
            filter.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 1.0);

            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 1.0);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.1);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 1.1);
        }
    } catch (e) {
        console.warn("Audio Context not supported or allowed", e);
    }
}

// =========================================
// SIDEBAR NEW FEATURES
// =========================================
function filterByElectric(item) {
    document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
    item.classList.add("active");

    // Set type filter to 'Electric' and apply
    const typeFilter = document.getElementById("typeFilter");
    if (typeFilter) {
        typeFilter.value = "Electric";
        applyFilters();
    }

    // Scroll down to grid
    const bikeGrid = document.getElementById("bikeGrid");
    if (bikeGrid) {
        const yOffset = -20;
        const y = bikeGrid.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
    closeMenu();
}



function toggleDarkMode(checkbox) {
    if (checkbox.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Auto-load theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (darkModeToggle) darkModeToggle.checked = true;
    }
});

// --- EMI Calculator Logic ---
function toggleEMI() {
    const area = document.getElementById('emiArea');
    const tcoArea = document.getElementById('tcoArea');
    if (!area) return;

    if (area.style.display === 'none' || area.style.display === '') {
        if (tcoArea) tcoArea.style.display = 'none'; // Close TCO if opening EMI
        area.style.display = 'block';
        calculateEMI();
    } else {
        area.style.display = 'none';
    }
}

function calculateEMI() {
    if (!currentBikeFullData) return;

    const price = Number(currentBikeFullData.price) || 0;
    const downPayment = Number(document.getElementById('emiDownPayment').value) || 0;
    const annualRate = Number(document.getElementById('emiInterestRate').value) || 10.5;
    const tenureMonths = Number(document.getElementById('emiTenure').value) || 36;

    const principal = price - downPayment;
    
    if (principal <= 0) {
        document.getElementById('emiAmountDisplay').innerText = "₹ 0";
        return;
    }

    const monthlyRate = annualRate / 12 / 100;
    
    // EMI Formula: [P x R x (1+R)^N] / [(1+R)^N-1]
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    document.getElementById('emiAmountDisplay').innerText = "₹ " + Math.round(emi).toLocaleString('en-IN');
}
