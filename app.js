const STORAGE_KEYS = {
  patients: "hms_patients",
  doctors: "hms_doctors",
  appointments: "hms_appointments",
  billing: "hms_billing",
  inventory: "hms_inventory"
};

let patients = JSON.parse(localStorage.getItem(STORAGE_KEYS.patients)) || [];
let doctors = JSON.parse(localStorage.getItem(STORAGE_KEYS.doctors)) || [];
let appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.appointments)) || [];
let billing = JSON.parse(localStorage.getItem(STORAGE_KEYS.billing)) || [];
let inventory = JSON.parse(localStorage.getItem(STORAGE_KEYS.inventory)) || [];

const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");
const pageTitle = document.getElementById("pageTitle");
const globalSearch = document.getElementById("globalSearch");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.dataset.section;
    sections.forEach(section => section.classList.remove("active"));
    document.getElementById(target).classList.add("active");

    pageTitle.textContent = btn.textContent;
    globalSearch.value = "";
    renderAll();
  });
});

function saveData() {
  localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
  localStorage.setItem(STORAGE_KEYS.doctors, JSON.stringify(doctors));
  localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  localStorage.setItem(STORAGE_KEYS.billing, JSON.stringify(billing));
  localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(inventory));
}

function generateId(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

window.onclick = function (e) {
  document.querySelectorAll(".modal").forEach(modal => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });
};

function openPatientModal(editId = null) {
  document.getElementById("patientModal").classList.add("show");
  document.getElementById("patientForm").reset();
  document.getElementById("patientId").value = "";

  if (editId) {
    const patient = patients.find(p => p.id === editId);
    document.getElementById("patientModalTitle").textContent = "Edit Patient";
    document.getElementById("patientId").value = patient.id;
    document.getElementById("patientName").value = patient.name;
    document.getElementById("patientAge").value = patient.age;
    document.getElementById("patientGender").value = patient.gender;
    document.getElementById("patientContact").value = patient.contact;
    document.getElementById("patientCondition").value = patient.condition;
  } else {
    document.getElementById("patientModalTitle").textContent = "Add Patient";
  }
}

function openDoctorModal(editId = null) {
  document.getElementById("doctorModal").classList.add("show");
  document.getElementById("doctorForm").reset();
  document.getElementById("doctorId").value = "";

  if (editId) {
    const doctor = doctors.find(d => d.id === editId);
    document.getElementById("doctorModalTitle").textContent = "Edit Doctor";
    document.getElementById("doctorId").value = doctor.id;
    document.getElementById("doctorName").value = doctor.name;
    document.getElementById("doctorSpecialization").value = doctor.specialization;
    document.getElementById("doctorSchedule").value = doctor.schedule;
    document.getElementById("doctorContact").value = doctor.contact;
  } else {
    document.getElementById("doctorModalTitle").textContent = "Add Doctor";
  }
}

function openAppointmentModal(editId = null) {
  document.getElementById("appointmentModal").classList.add("show");
  document.getElementById("appointmentForm").reset();
  document.getElementById("appointmentId").value = "";

  populatePatientOptions("appointmentPatient");
  populateDoctorOptions("appointmentDoctor");

  if (editId) {
    const appointment = appointments.find(a => a.id === editId);
    document.getElementById("appointmentModalTitle").textContent = "Edit Appointment";
    document.getElementById("appointmentId").value = appointment.id;
    document.getElementById("appointmentPatient").value = appointment.patientId;
    document.getElementById("appointmentDoctor").value = appointment.doctorId;
    document.getElementById("appointmentDate").value = appointment.date;
    document.getElementById("appointmentTime").value = appointment.time;
    document.getElementById("appointmentStatus").value = appointment.status;
  } else {
    document.getElementById("appointmentModalTitle").textContent = "Add Appointment";
  }
}

function openBillingModal(editId = null) {
  document.getElementById("billingModal").classList.add("show");
  document.getElementById("billingForm").reset();
  document.getElementById("billId").value = "";

  populatePatientOptions("billPatient");

  if (editId) {
    const bill = billing.find(b => b.id === editId);
    document.getElementById("billingModalTitle").textContent = "Edit Bill";
    document.getElementById("billId").value = bill.id;
    document.getElementById("billPatient").value = bill.patientId;
    document.getElementById("billService").value = bill.service;
    document.getElementById("billAmount").value = bill.amount;
    document.getElementById("billDate").value = bill.date;
    document.getElementById("billStatus").value = bill.status;
  } else {
    document.getElementById("billingModalTitle").textContent = "Add Bill";
  }
}

function openInventoryModal(editId = null) {
  document.getElementById("inventoryModal").classList.add("show");
  document.getElementById("inventoryForm").reset();
  document.getElementById("medicineId").value = "";

  if (editId) {
    const medicine = inventory.find(m => m.id === editId);
    document.getElementById("inventoryModalTitle").textContent = "Edit Medicine";
    document.getElementById("medicineId").value = medicine.id;
    document.getElementById("medicineName").value = medicine.name;
    document.getElementById("medicineCategory").value = medicine.category;
    document.getElementById("medicineStock").value = medicine.stock;
    document.getElementById("medicinePrice").value = medicine.price;
    document.getElementById("medicineExpiry").value = medicine.expiry;
  } else {
    document.getElementById("inventoryModalTitle").textContent = "Add Medicine";
  }
}

function populatePatientOptions(selectId) {
  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="">Select Patient</option>`;
  patients.forEach(patient => {
    select.innerHTML += `<option value="${patient.id}">${patient.name}</option>`;
  });
}

function populateDoctorOptions(selectId) {
  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="">Select Doctor</option>`;
  doctors.forEach(doctor => {
    select.innerHTML += `<option value="${doctor.id}">${doctor.name}</option>`;
  });
}

document.getElementById("patientForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("patientId").value;
  const patientData = {
    id: id || generateId("P"),
    name: document.getElementById("patientName").value,
    age: document.getElementById("patientAge").value,
    gender: document.getElementById("patientGender").value,
    contact: document.getElementById("patientContact").value,
    condition: document.getElementById("patientCondition").value
  };

  if (id) {
    patients = patients.map(p => p.id === id ? patientData : p);
  } else {
    patients.push(patientData);
  }

  saveData();
  closeModal("patientModal");
  renderAll();
});

document.getElementById("doctorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("doctorId").value;
  const doctorData = {
    id: id || generateId("D"),
    name: document.getElementById("doctorName").value,
    specialization: document.getElementById("doctorSpecialization").value,
    schedule: document.getElementById("doctorSchedule").value,
    contact: document.getElementById("doctorContact").value
  };

  if (id) {
    doctors = doctors.map(d => d.id === id ? doctorData : d);
  } else {
    doctors.push(doctorData);
  }

  saveData();
  closeModal("doctorModal");
  renderAll();
});

document.getElementById("appointmentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("appointmentId").value;
  const appointmentData = {
    id: id || generateId("A"),
    patientId: document.getElementById("appointmentPatient").value,
    doctorId: document.getElementById("appointmentDoctor").value,
    date: document.getElementById("appointmentDate").value,
    time: document.getElementById("appointmentTime").value,
    status: document.getElementById("appointmentStatus").value
  };

  if (id) {
    appointments = appointments.map(a => a.id === id ? appointmentData : a);
  } else {
    appointments.push(appointmentData);
  }

  saveData();
  closeModal("appointmentModal");
  renderAll();
});

document.getElementById("billingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("billId").value;
  const billData = {
    id: id || generateId("B"),
    patientId: document.getElementById("billPatient").value,
    service: document.getElementById("billService").value,
    amount: Number(document.getElementById("billAmount").value),
    date: document.getElementById("billDate").value,
    status: document.getElementById("billStatus").value
  };

  if (id) {
    billing = billing.map(b => b.id === id ? billData : b);
  } else {
    billing.push(billData);
  }

  saveData();
  closeModal("billingModal");
  renderAll();
});

document.getElementById("inventoryForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("medicineId").value;
  const medicineData = {
    id: id || generateId("M"),
    name: document.getElementById("medicineName").value,
    category: document.getElementById("medicineCategory").value,
    stock: Number(document.getElementById("medicineStock").value),
    price: Number(document.getElementById("medicinePrice").value),
    expiry: document.getElementById("medicineExpiry").value
  };

  if (id) {
    inventory = inventory.map(m => m.id === id ? medicineData : m);
  } else {
    inventory.push(medicineData);
  }

  saveData();
  closeModal("inventoryModal");
  renderAll();
});

function getPatientName(id) {
  const patient = patients.find(p => p.id === id);
  return patient ? patient.name : "Unknown";
}

function getDoctorName(id) {
  const doctor = doctors.find(d => d.id === id);
  return doctor ? doctor.name : "Unknown";
}

function deleteItem(type, id) {
  if (!confirm("Are you sure you want to delete this record?")) return;

  if (type === "patient") patients = patients.filter(item => item.id !== id);
  if (type === "doctor") doctors = doctors.filter(item => item.id !== id);
  if (type === "appointment") appointments = appointments.filter(item => item.id !== id);
  if (type === "bill") billing = billing.filter(item => item.id !== id);
  if (type === "medicine") inventory = inventory.filter(item => item.id !== id);

  saveData();
  renderAll();
}

function renderPatients(filter = "") {
  const table = document.getElementById("patientsTable");
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(filter) ||
    p.condition.toLowerCase().includes(filter) ||
    p.contact.toLowerCase().includes(filter)
  );

  if (!filtered.length) {
    table.innerHTML = `<tr><td colspan="7" class="empty-state">No patients found.</td></tr>`;
    return;
  }

  table.innerHTML = filtered.map(patient => `
    <tr>
      <td>${patient.id}</td>
      <td>${patient.name}</td>
      <td>${patient.age}</td>
      <td>${patient.gender}</td>
      <td>${patient.contact}</td>
      <td>${patient.condition}</td>
      <td>
        <button class="action-btn edit-btn" onclick="openPatientModal('${patient.id}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteItem('patient','${patient.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

function renderDoctors(filter = "") {
  const table = document.getElementById("doctorsTable");
  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(filter) ||
    d.specialization.toLowerCase().includes(filter) ||
    d.contact.toLowerCase().includes(filter)
  );

  if (!filtered.length) {
    table.innerHTML = `<tr><td colspan="6" class="empty-state">No doctors found.</td></tr>`;
    return;
  }

  table.innerHTML = filtered.map(doctor => `
    <tr>
      <td>${doctor.id}</td>
      <td>${doctor.name}</td>
      <td>${doctor.specialization}</td>
      <td>${doctor.schedule}</td>
      <td>${doctor.contact}</td>
      <td>
        <button class="action-btn edit-btn" onclick="openDoctorModal('${doctor.id}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteItem('doctor','${doctor.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

function renderAppointments(filter = "") {
  const table = document.getElementById("appointmentsTable");
  const filtered = appointments.filter(a =>
    getPatientName(a.patientId).toLowerCase().includes(filter) ||
    getDoctorName(a.doctorId).toLowerCase().includes(filter) ||
    a.status.toLowerCase().includes(filter) ||
    a.date.toLowerCase().includes(filter)
  );

  if (!filtered.length) {
    table.innerHTML = `<tr><td colspan="7" class="empty-state">No appointments found.</td></tr>`;
    return;
  }

  table.innerHTML = filtered.map(app => `
    <tr>
      <td>${app.id}</td>
      <td>${getPatientName(app.patientId)}</td>
      <td>${getDoctorName(app.doctorId)}</td>
      <td>${app.date}</td>
      <td>${app.time}</td>
      <td><span class="status ${app.status.toLowerCase()}">${app.status}</span></td>
      <td>
        <button class="action-btn edit-btn" onclick="openAppointmentModal('${app.id}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteItem('appointment','${app.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

function renderBilling(filter = "") {
  const table = document.getElementById("billingTable");
  const filtered = billing.filter(b =>
    getPatientName(b.patientId).toLowerCase().includes(filter) ||
    b.service.toLowerCase().includes(filter) ||
    b.status.toLowerCase().includes(filter) ||
    b.date.toLowerCase().includes(filter)
  );

  if (!filtered.length) {
    table.innerHTML = `<tr><td colspan="7" class="empty-state">No billing records found.</td></tr>`;
    return;
  }

  table.innerHTML = filtered.map(bill => `
    <tr>
      <td>${bill.id}</td>
      <td>${getPatientName(bill.patientId)}</td>
      <td>${bill.service}</td>
      <td>₱${bill.amount.toLocaleString()}</td>
      <td><span class="status ${bill.status.toLowerCase()}">${bill.status}</span></td>
      <td>${bill.date}</td>
      <td>
        <button class="action-btn edit-btn" onclick="openBillingModal('${bill.id}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteItem('bill','${bill.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

function renderInventory(filter = "") {
  const table = document.getElementById("inventoryTable");
  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(filter) ||
    i.category.toLowerCase().includes(filter) ||
    i.expiry.toLowerCase().includes(filter)
  );

  if (!filtered.length) {
    table.innerHTML = `<tr><td colspan="7" class="empty-state">No medicines found.</td></tr>`;
    return;
  }

  table.innerHTML = filtered.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td class="${item.stock <= 10 ? 'low-stock' : ''}">${item.stock}</td>
      <td>₱${item.price.toLocaleString()}</td>
      <td>${item.expiry}</td>
      <td>
        <button class="action-btn edit-btn" onclick="openInventoryModal('${item.id}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteItem('medicine','${item.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

function renderDashboard() {
  document.getElementById("totalPatients").textContent = patients.length;
  document.getElementById("totalDoctors").textContent = doctors.length;
  document.getElementById("totalAppointments").textContent = appointments.length;
  document.getElementById("totalRevenue").textContent =
    "₱" + billing.reduce((sum, item) => sum + Number(item.amount), 0).toLocaleString();

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
    .slice(0, 5);

  const recentBox = document.getElementById("recentAppointments");
  if (!recentAppointments.length) {
    recentBox.innerHTML = `<div class="empty-state">No recent appointments yet.</div>`;
  } else {
    recentBox.innerHTML = recentAppointments.map(app => `
      <div class="list-item">
        <strong>${getPatientName(app.patientId)} with ${getDoctorName(app.doctorId)}</strong>
        <span>${app.date} • ${app.time} • ${app.status}</span>
      </div>
    `).join("");
  }

  const lowStock = inventory.filter(item => item.stock <= 10);
  const stockBox = document.getElementById("lowStockList");
  if (!lowStock.length) {
    stockBox.innerHTML = `<div class="empty-state">No low stock medicines.</div>`;
  } else {
    stockBox.innerHTML = lowStock.map(item => `
      <div class="list-item">
        <strong>${item.name}</strong>
        <span>Only ${item.stock} left • Expiry: ${item.expiry}</span>
      </div>
    `).join("");
  }
}

function renderAll(filter = "") {
  renderDashboard();
  renderPatients(filter);
  renderDoctors(filter);
  renderAppointments(filter);
  renderBilling(filter);
  renderInventory(filter);
}

globalSearch.addEventListener("input", function () {
  renderAll(this.value.toLowerCase());
});

document.getElementById("seedDataBtn").addEventListener("click", () => {
  if (!confirm("Load sample data? This will replace current data.")) return;

  patients = [
    { id: "P1001", name: "Ariana Cruz", age: 21, gender: "Female", contact: "09171234567", condition: "Fever" },
    { id: "P1002", name: "Bea Santos", age: 19, gender: "Female", contact: "09179876543", condition: "Asthma" },
    { id: "P1003", name: "Liam Reyes", age: 27, gender: "Male", contact: "09174561234", condition: "Migraine" }
  ];

  doctors = [
    { id: "D1001", name: "Dr. Sofia Lim", specialization: "Pediatrics", schedule: "Mon-Fri 9AM-3PM", contact: "09981234567" },
    { id: "D1002", name: "Dr. Chloe Ramirez", specialization: "Cardiology", schedule: "Tue-Sat 10AM-4PM", contact: "09987654321" },
    { id: "D1003", name: "Dr. Ethan Flores", specialization: "General Medicine", schedule: "Mon-Sat 8AM-2PM", contact: "09982345678" }
  ];

  appointments = [
    { id: "A1001", patientId: "P1001", doctorId: "D1003", date: "2026-04-01", time: "09:00", status: "Scheduled" },
    { id: "A1002", patientId: "P1002", doctorId: "D1002", date: "2026-04-02", time: "11:00", status: "Completed" },
    { id: "A1003", patientId: "P1003", doctorId: "D1001", date: "2026-04-03", time: "13:30", status: "Scheduled" }
  ];

  billing = [
    { id: "B1001", patientId: "P1001", service: "Consultation", amount: 800, date: "2026-04-01", status: "Paid" },
    { id: "B1002", patientId: "P1002", service: "ECG", amount: 2500, date: "2026-04-02", status: "Pending" },
    { id: "B1003", patientId: "P1003", service: "Laboratory Test", amount: 1500, date: "2026-04-03", status: "Paid" }
  ];

  inventory = [
    { id: "M1001", name: "Paracetamol", category: "Tablet", stock: 50, price: 10, expiry: "2027-01-20" },
    { id: "M1002", name: "Amoxicillin", category: "Capsule", stock: 8, price: 18, expiry: "2026-11-15" },
    { id: "M1003", name: "Salbutamol", category: "Inhaler", stock: 6, price: 350, expiry: "2026-08-10" }
  ];

  saveData();
  renderAll();
});

renderAll();