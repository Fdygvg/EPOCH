// Grab DOM elements
const addBtn = document.getElementById("addCountdownBtn");
const formContainer = document.getElementById("countdownFormContainer");
const saveBtn = document.getElementById("saveCountdownBtn");
const cancelBtn = document.getElementById("cancelCountdownBtn");
const countdownNameInput = document.getElementById("countdownName");
const countdownTimeInput = document.getElementById("countdownTime");
const countdownList = document.getElementById("countdownList");

const fullscreenContainer = document.getElementById("fullscreenContainer");
const fullscreenName = document.getElementById("fullscreenName");
const fullscreenTimer = document.getElementById("fullscreenTimer");
const closeFullscreenBtn = document.getElementById("closeFullscreenBtn");

// Store all countdowns
let epochs = [];

// Show/hide form
addBtn.addEventListener("click", () => {
  formContainer.classList.toggle("hidden");
  countdownNameInput.value = "";
  countdownTimeInput.value = "";
  console.log('add button clicked')
});

// Cancel form
cancelBtn.addEventListener("click", () => {
  formContainer.classList.add("hidden");
});

// Save new epoch
saveBtn.addEventListener("click", () => {
  const name = countdownNameInput.value.trim();
  const timeStr = countdownTimeInput.value;

  if (!name || !timeStr) return alert("Please enter a name and time");

  // Convert time input into today's datetime
  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

  const epoch = {
    id: Date.now(),
    name,
    target,
    element: null, // will hold DOM element
    interval: null
  };

  epochs.push(epoch);
  renderEpoch(epoch);
  formContainer.classList.add("hidden");
});

// Render a single epoch
function renderEpoch(epoch) {
  const li = document.createElement("li");
  li.className = "epochItem";

  li.innerHTML = `
    <div class="epochMain">
      <span class="epochName">${epoch.name}</span>
      <div class="buttons">
        <button class="editNameBtn"><i class="fa-solid fa-pen"></i></button>
        <button class="zoomBtn"><i class="fa-solid fa-up-right-and-down-left-from-center"></i></button>
      </div>
    </div>
    <div class="epochTimerRow">
      <span class="epochTimeLeft">00:00:00</span>
      <button class="editTimeBtn"><i class="fa-solid fa-clock"></i></button>
    </div>
  `;

  countdownList.appendChild(li);
  epoch.element = li;

  const nameSpan = li.querySelector(".epochName");
  const timeSpan = li.querySelector(".epochTimeLeft");
  const editNameBtn = li.querySelector(".editNameBtn");
  const editTimeBtn = li.querySelector(".editTimeBtn");
  const zoomBtn = li.querySelector(".zoomBtn");

  // Countdown update function
  function updateCountdown() {
    const now = new Date();
    let diff = epoch.target - now;

    if (diff <= 0) {
      timeSpan.textContent = "00:00:00";
      clearInterval(epoch.interval);
      return;
    }

    const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
    const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

    timeSpan.textContent = `${h}:${m}:${s}`;
  }

  updateCountdown();
  epoch.interval = setInterval(updateCountdown, 1000);

  // Edit name
  editNameBtn.addEventListener("click", () => {
    const newName = prompt("Edit Epoch Name", epoch.name);
    if (newName) {
      epoch.name = newName;
      nameSpan.textContent = newName;
    }
  });

  // Edit time
  editTimeBtn.addEventListener("click", () => {
    const newTime = prompt("Edit Epoch Time (HH:MM, 24h)");
    if (newTime) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const now = new Date();
      epoch.target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    }
  });

  // Zoom / fullscreen
  zoomBtn.addEventListener("click", () => {
    fullscreenName.textContent = epoch.name;
    fullscreenContainer.classList.toggle("hidden");

    function updateFullscreen() {
      const now = new Date();
      let diff = epoch.target - now;

      if (diff <= 0) {
        fullscreenTimer.textContent = "00:00:00";
        clearInterval(fullscreenInterval);
        return;
      }

      const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
      const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

      fullscreenTimer.textContent = `${h}:${m}:${s}`;
    }

    updateFullscreen();
    const fullscreenInterval = setInterval(updateFullscreen, 1000);

    closeFullscreenBtn.onclick = () => {
        console.log("cLOSE bTN Clicked")
      clearInterval(fullscreenInterval);
      fullscreenContainer.classList.add("hidden");
    };
  });
}
