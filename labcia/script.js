const coffeeList = document.getElementById('coffeeList');
const searchBox = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchBtn');
const sortOrder = document.getElementById('sortOrder');
const feedbackForm = document.getElementById('feedbackForm');
const formMsg = document.getElementById('formMsg');
const greeting = document.getElementById('greeting');
const locationDiv = document.getElementById('location');
const browserDiv = document.getElementById('browser');

let coffeeData = [];
let filteredData = [];

async function fetchCoffees() {
  try {
    const res = await fetch('https://api.sampleapis.com/coffee/hot');
    const data = await res.json();
    coffeeData = data.slice(0, 8);
    filteredData = [...coffeeData];
    renderCoffees(filteredData);
  } catch (err) {
    coffeeList.innerHTML = '<p class="text-red-600">Failed to load coffee data.</p>';
  }
}

function renderCoffees(data) {
  coffeeList.innerHTML = '';
  if (data.length === 0) {
    coffeeList.innerHTML = '<p class="col-span-full text-center text-amber-700">No coffees found.</p>';
    return;
  }
  data.forEach(coffee => {
    coffeeList.innerHTML += `
      <div class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition">
        <img src="${coffee.image}" alt="${coffee.title}" class="w-32 h-32 object-cover rounded mb-2">
        <h3 class="text-lg font-bold text-amber-800 mb-1">${coffee.title}</h3>
        <p class="text-sm text-gray-700 mb-2">${coffee.description}</p>
        <p class="text-xs text-amber-700 mb-1"><span class="font-semibold">Ingredients:</span> ${coffee.ingredients.join(', ')}</p>
      </div>
    `;
  });
}

function handleSearch() {
  const term = searchBox.value.trim().toLowerCase();
  filteredData = coffeeData.filter(coffee => coffee.title.toLowerCase().includes(term));
  handleSort();
}

function handleSort() {
  const order = sortOrder.value;
  filteredData.sort((a, b) => {
    if (order === 'asc') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });
  renderCoffees(filteredData);
}

searchBtn.addEventListener('click', handleSearch);
searchBox.addEventListener('keyup', e => { if (e.key === 'Enter') handleSearch(); });
sortOrder.addEventListener('change', handleSort);

feedbackForm.addEventListener('submit', function(e) {
  e.preventDefault();
  formMsg.textContent = '';
  const name = feedbackForm.name.value.trim();
  const email = feedbackForm.email.value.trim();
  const favorite = feedbackForm.favorite.value.trim();

  if (!name || !email || !favorite) {
    formMsg.textContent = 'All fields are required!';
    formMsg.className = 'text-red-600 mt-2';
    return;
  }
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    formMsg.textContent = 'Please enter a valid email address!';
    formMsg.className = 'text-red-600 mt-2';
    return;
  }

  localStorage.setItem('coffeehubUser', JSON.stringify({ name, favorite }));
  formMsg.textContent = 'Thank you for your feedback!';
  formMsg.className = 'text-green-600 mt-2';
  showGreeting();
});

function showGreeting() {
  const user = JSON.parse(localStorage.getItem('coffeehubUser'));
  if (user && user.name && user.favorite) {
    greeting.textContent = `Hello, ${user.name}! You Love ${user.favorite}.`;
  } else {
    greeting.textContent = '';
  }
}

function getLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        locationDiv.textContent = `Your Location: Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)}`;
      },
      err => {
        locationDiv.textContent = 'Location access denied.';
      }
    );
  } else {
    locationDiv.textContent = 'Geolocation not supported.';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  fetchCoffees();
  showGreeting();
  getLocation();
  showBrowserInfo();
});