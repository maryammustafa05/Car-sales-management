let cars = [];
let editIndex = -1;

function addCar() {
    const name = document.getElementById('carName').value.trim();
    const company = document.getElementById('carCompany').value.trim();
    const price = document.getElementById('carPrice').value.trim();
    const year = document.getElementById('carYear').value.trim();
    const status = document.getElementById('carStatus').value;
    const imageFile = document.getElementById('carImage').files[0];

    if (!name || !company || !price || !year) {
        alert('Please fill all fields');
        return;
    }

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveCarWithImage(name, company, price, year, status, e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveCarWithImage(name, company, price, year, status, null);
    }
}
function updateDashboard() {
    const totalCars = cars.length;
    const availableCars = cars.filter(car => car.status === 'Available').length;
    const soldCars = cars.filter(car => car.status === 'Sold').length;
    
    localStorage.setItem('totalCars', totalCars);
    localStorage.setItem('availableCars', availableCars);
    localStorage.setItem('soldCars', soldCars);
}

function saveCarWithImage(name, company, price, year, status, image) {
    if (editIndex === -1) {
        cars.push({ name, company, price, year, status, image });
    } else {
        const oldImage = cars[editIndex].image;
        cars[editIndex] = { 
            name, company, price, year, status, 
            image: image || oldImage 
        };
        editIndex = -1;
        document.getElementById('addCarBtn').innerText = 'Add Car';
    }

    saveCars();
    updateDashboard();
    renderCards();
    clearForm();
}

function renderCards() {
    const carGrid = document.getElementById('carGrid');
    carGrid.innerHTML = '';

    if (cars.length === 0) {
        carGrid.innerHTML = '<p style="color:#888; text-align:center; padding:40px; grid-column: span 2;">No cars added yet.</p>';
        return;
    }

    cars.forEach((car, index) => {
        const statusClass = car.status === 'Available' ? 'status-available' : 'status-sold';
        const imgSrc = car.image ? car.image : 'img/feature1.jpeg';

        carGrid.innerHTML += `
            <div class="car-card">
                <img src="${imgSrc}" alt="${car.name}">
                <div class="car-card-body">
                    <h5>${car.name}</h5>
                    <div class="car-card-info">
                        <span>Company: <b>${car.company}</b></span>
                        <span>Price: <b>$${Number(car.price).toLocaleString()}</b></span>
                        <span>Year: <b>${car.year}</b></span>
                    </div>
                    <div class="car-card-footer">
                        <span class="${statusClass}">${car.status}</span>
                        <div class="car-card-actions">
                            <button class="btn-edit" onclick="editCar(${index})">Edit</button>
                            <button class="btn-delete" onclick="deleteCar(${index})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function editCar(index) {
    const car = cars[index];
    document.getElementById('carName').value = car.name;
    document.getElementById('carCompany').value = car.company;
    document.getElementById('carPrice').value = car.price;
    document.getElementById('carYear').value = car.year;
    document.getElementById('carStatus').value = car.status;
    editIndex = index;
    document.getElementById('addCarBtn').innerText = 'Update Car';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteCar(index) {
    if (confirm('Are you sure you want to delete this car?')) {
        cars.splice(index, 1);
        saveCars();
        updateDashboard();
        renderCards();
    }
}

function saveCars() {
    localStorage.setItem('cars', JSON.stringify(cars));
}

function loadCars() {
    const saved = localStorage.getItem('cars');
    if (saved) {
        cars = JSON.parse(saved);
        const carGrid = document.getElementById('carGrid');
        if (carGrid) {
            renderCards();
        }
    }
}

function clearForm() {
    document.getElementById('carName').value = '';
    document.getElementById('carCompany').value = '';
    document.getElementById('carPrice').value = '';
    document.getElementById('carYear').value = '';
    document.getElementById('carStatus').value = 'Available';
    document.getElementById('carImage').value = '';
}

loadCars();
function loadDashboard() {
    const totalEl = document.getElementById('totalCars');
    const availableEl = document.getElementById('availableCars');
    const soldEl = document.getElementById('soldCars');

    if (!totalEl) return;

    const saved = localStorage.getItem('cars');
    const allCars = saved ? JSON.parse(saved) : [];

    totalEl.innerText = allCars.length;
    availableEl.innerText = allCars.filter(car => car.status === 'Available').length;
    soldEl.innerText = allCars.filter(car => car.status === 'Sold').length;
}
loadDashboard();
function loadSoldCars() {
    const soldGrid = document.getElementById('soldGrid');
    if (!soldGrid) return;

    const saved = localStorage.getItem('cars');
    const allCars = saved ? JSON.parse(saved) : [];
    const soldCars = allCars.filter(car => car.status === 'Sold');

    if (soldCars.length === 0) {
        soldGrid.innerHTML = '<p style="color:#888; text-align:center; padding:40px; grid-column: span 4;">No sold cars yet.</p>';
        return;
    }

    soldCars.forEach((car, index) => {
        const imgSrc = car.image ? car.image : 'img/feature1.jpeg';
        soldGrid.innerHTML += `
            <div class="car-card">
                <img src="${imgSrc}" alt="${car.name}">
                <div class="car-card-body">
                    <h5>${car.name}</h5>
                    <div class="car-card-info">
                        <span>Company: <b>${car.company}</b></span>
                        <span>Price: <b>$${Number(car.price).toLocaleString()}</b></span>
                        <span>Year: <b>${car.year}</b></span>
                    </div>
                    <div class="car-card-footer">
                        <span class="status-sold">Sold</span>
                    </div>
                </div>
            </div>
        `;
    });
}

loadSoldCars();