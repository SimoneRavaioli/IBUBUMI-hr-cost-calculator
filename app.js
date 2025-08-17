// Application Data
const defaultData = {
  roles: [
    {"role": "Head Chef", "department": "Kitchen & Restaurant", "staff": 1, "salary": 9000000},
    {"role": "Sous Chef", "department": "Kitchen & Restaurant", "staff": 1, "salary": 7000000},
    {"role": "Line Cook", "department": "Kitchen & Restaurant", "staff": 4, "salary": 4500000},
    {"role": "Commis (Kitchen)", "department": "Kitchen & Restaurant", "staff": 2, "salary": 3500000},
    {"role": "Steward/Dishwasher", "department": "Kitchen & Restaurant", "staff": 2, "salary": 2200000},
    {"role": "Restaurant/Bar Manager", "department": "Dining Room & Bar", "staff": 1, "salary": 7000000},
    {"role": "Waiter/Waitress", "department": "Dining Room & Bar", "staff": 6, "salary": 3500000},
    {"role": "Bartender", "department": "Dining Room & Bar", "staff": 2, "salary": 4000000},
    {"role": "Runner/Commis di Sala", "department": "Dining Room & Bar", "staff": 2, "salary": 2000000},
    {"role": "Front Office Manager", "department": "Reception", "staff": 1, "salary": 7000000},
    {"role": "Receptionist", "department": "Reception", "staff": 4, "salary": 4000000},
    {"role": "Housekeeping Supervisor", "department": "Housekeeping", "staff": 1, "salary": 4500000},
    {"role": "Room Attendant", "department": "Housekeeping", "staff": 5, "salary": 2300000},
    {"role": "Laundry Attendant", "department": "Housekeeping", "staff": 1, "salary": 2000000},
    {"role": "Maintenance Technician", "department": "Maintenance & Gardening", "staff": 1, "salary": 5000000},
    {"role": "Pool Attendant", "department": "Maintenance & Gardening", "staff": 1, "salary": 3200000},
    {"role": "Gardener", "department": "Maintenance & Gardening", "staff": 2, "salary": 2000000},
    {"role": "General Manager", "department": "Management & Administration", "staff": 1, "salary": 12000000},
    {"role": "Admin/Accounting", "department": "Management & Administration", "staff": 1, "salary": 6000000}
  ],
  settings: {
    exchangeRate: 19000,
    facilityGuests: 60,
    bpjsKesehatan: 4.00,
    bpjsJHT: 3.70,
    bpjsJP: 2.00,
    bpjsJKM: 0.30,
    bpjsJKK: 0.89,
    thrMonths: 1.0,
    overtimeBuffer: 1.5
  },
  departments: [
    "Kitchen & Restaurant",
    "Dining Room & Bar", 
    "Reception",
    "Housekeeping",
    "Maintenance & Gardening",
    "Management & Administration"
  ],
  departmentColors: {
    "Kitchen & Restaurant": "#FF6B6B",
    "Dining Room & Bar": "#4ECDC4", 
    "Reception": "#45B7D1",
    "Housekeeping": "#96CEB4",
    "Maintenance & Gardening": "#FECA57",
    "Management & Administration": "#A29BFE"
  }
};

// Global Application State
let appData = {
  roles: [...defaultData.roles],
  settings: {...defaultData.settings}
};

// Chart instances
let charts = {
  departmentPie: null,
  monthlyAnnual: null,
  staffDistribution: null,
  costPerEmployee: null
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  calculateAndUpdate();
});

function initializeApp() {
  // Load settings into form fields
  Object.keys(appData.settings).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      element.value = appData.settings[key];
    }
  });
  
  renderRolesTable();
  updateTotalBPJS();
}

function setupEventListeners() {
  // Settings change listeners
  Object.keys(appData.settings).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      element.addEventListener('input', () => {
        appData.settings[key] = parseFloat(element.value) || 0;
        updateTotalBPJS();
        calculateAndUpdate();
      });
    }
  });

  // Button listeners
  document.getElementById('addRoleBtn').addEventListener('click', addNewRole);
  document.getElementById('resetBtn').addEventListener('click', resetToDefaults);
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);

  // Preset buttons
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const preset = e.target.dataset.preset;
      applyPreset(preset);
    });
  });
}

function renderRolesTable() {
  const tbody = document.getElementById('rolesTableBody');
  tbody.innerHTML = '';

  appData.roles.forEach((role, index) => {
    const row = createRoleRow(role, index);
    tbody.appendChild(row);
  });
}

function createRoleRow(role, index) {
  const row = document.createElement('tr');
  
  const calculations = calculateRoleCosts(role);
  
  row.innerHTML = `
    <td><input type="text" value="${role.role}" onchange="updateRole(${index}, 'role', this.value)"></td>
    <td>
      <select onchange="updateRole(${index}, 'department', this.value)">
        ${defaultData.departments.map(dept => 
          `<option value="${dept}" ${role.department === dept ? 'selected' : ''}>${dept}</option>`
        ).join('')}
      </select>
    </td>
    <td><input type="number" value="${role.staff}" min="0" onchange="updateRole(${index}, 'staff', parseInt(this.value) || 0)"></td>
    <td><input type="number" value="${role.salary}" min="0" step="100000" onchange="updateRole(${index}, 'salary', parseInt(this.value) || 0)"></td>
    <td>${formatCurrency(calculations.salaryEUR, 'EUR')}</td>
    <td>${formatCurrency(calculations.monthlyCostIDR, 'IDR')}</td>
    <td>${formatCurrency(calculations.monthlyCostEUR, 'EUR')}</td>
    <td>${formatCurrency(calculations.annualCostIDR, 'IDR')}</td>
    <td>${formatCurrency(calculations.annualCostEUR, 'EUR')}</td>
    <td><button class="btn btn-danger btn-sm" onclick="removeRole(${index})">Delete</button></td>
  `;
  
  return row;
}

function updateRole(index, field, value) {
  if (appData.roles[index]) {
    appData.roles[index][field] = value;
    calculateAndUpdate();
  }
}

function removeRole(index) {
  appData.roles.splice(index, 1);
  renderRolesTable();
  calculateAndUpdate();
}

function addNewRole() {
  const newRole = {
    role: "New Role",
    department: defaultData.departments[0],
    staff: 1,
    salary: 3000000
  };
  
  appData.roles.push(newRole);
  renderRolesTable();
  calculateAndUpdate();
}

function resetToDefaults() {
  if (confirm('Are you sure you want to reset all data to defaults?')) {
    appData.roles = [...defaultData.roles];
    appData.settings = {...defaultData.settings};
    
    // Update form fields
    Object.keys(appData.settings).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        element.value = appData.settings[key];
      }
    });
    
    renderRolesTable();
    updateTotalBPJS();
    calculateAndUpdate();
  }
}

function applyPreset(preset) {
  const presets = {
    small: { guests: 30, multiplier: 0.6 },
    medium: { guests: 60, multiplier: 1.0 },
    large: { guests: 100, multiplier: 1.4 }
  };
  
  const presetData = presets[preset];
  if (!presetData) return;
  
  // Update facility size
  document.getElementById('facilityGuests').value = presetData.guests;
  appData.settings.facilityGuests = presetData.guests;
  
  // Scale staff numbers
  appData.roles.forEach(role => {
    role.staff = Math.round(role.staff * presetData.multiplier);
    if (role.staff < 1) role.staff = 1;
  });
  
  renderRolesTable();
  calculateAndUpdate();
}

function calculateRoleCosts(role) {
  const totalBPJSRate = getTotalBPJSRate();
  const salaryEUR = role.salary / appData.settings.exchangeRate;
  const monthlyCostIDR = (role.salary * (1 + totalBPJSRate / 100)) * role.staff;
  const monthlyCostEUR = monthlyCostIDR / appData.settings.exchangeRate;
  
  // Annual calculation: (Monthly * 12 + THR) * (1 + overtime buffer)
  const thrAmount = role.salary * appData.settings.thrMonths * role.staff;
  const annualBase = monthlyCostIDR * 12 + thrAmount;
  const annualCostIDR = annualBase * (1 + appData.settings.overtimeBuffer / 100);
  const annualCostEUR = annualCostIDR / appData.settings.exchangeRate;
  
  return {
    salaryEUR,
    monthlyCostIDR,
    monthlyCostEUR,
    annualCostIDR,
    annualCostEUR
  };
}

function calculateAndUpdate() {
  const totals = calculateTotals();
  updateGrandTotals(totals);
  updateDepartmentSummary(totals.departments);
  updateCharts(totals.departments);
}

function calculateTotals() {
  let totalStaff = 0;
  let totalMonthlyIDR = 0;
  let totalAnnualIDR = 0;
  
  const departments = {};
  
  appData.roles.forEach(role => {
    const costs = calculateRoleCosts(role);
    
    totalStaff += role.staff;
    totalMonthlyIDR += costs.monthlyCostIDR;
    totalAnnualIDR += costs.annualCostIDR;
    
    // Department totals
    if (!departments[role.department]) {
      departments[role.department] = {
        staff: 0,
        monthlyIDR: 0,
        annualIDR: 0,
        color: defaultData.departmentColors[role.department] || '#666'
      };
    }
    
    departments[role.department].staff += role.staff;
    departments[role.department].monthlyIDR += costs.monthlyCostIDR;
    departments[role.department].annualIDR += costs.annualCostIDR;
  });
  
  // Calculate EUR equivalents
  const totalMonthlyEUR = totalMonthlyIDR / appData.settings.exchangeRate;
  const totalAnnualEUR = totalAnnualIDR / appData.settings.exchangeRate;
  
  Object.keys(departments).forEach(dept => {
    departments[dept].monthlyEUR = departments[dept].monthlyIDR / appData.settings.exchangeRate;
    departments[dept].annualEUR = departments[dept].annualIDR / appData.settings.exchangeRate;
    departments[dept].avgCostPerEmployee = departments[dept].monthlyIDR / departments[dept].staff;
  });
  
  return {
    totalStaff,
    totalMonthlyIDR,
    totalMonthlyEUR,
    totalAnnualIDR,
    totalAnnualEUR,
    costPerGuestMonthlyIDR: totalMonthlyIDR / appData.settings.facilityGuests,
    costPerGuestMonthlyEUR: totalMonthlyEUR / appData.settings.facilityGuests,
    costPerGuestAnnualIDR: totalAnnualIDR / appData.settings.facilityGuests,
    costPerGuestAnnualEUR: totalAnnualEUR / appData.settings.facilityGuests,
    departments
  };
}

function updateGrandTotals(totals) {
  document.getElementById('totalStaffCount').textContent = totals.totalStaff;
  document.getElementById('grandTotalMonthlyIDR').textContent = formatCurrency(totals.totalMonthlyIDR, 'IDR');
  document.getElementById('grandTotalMonthlyEUR').textContent = formatCurrency(totals.totalMonthlyEUR, 'EUR');
  document.getElementById('grandTotalAnnualIDR').textContent = formatCurrency(totals.totalAnnualIDR, 'IDR');
  document.getElementById('grandTotalAnnualEUR').textContent = formatCurrency(totals.totalAnnualEUR, 'EUR');
  document.getElementById('costPerGuestMonthlyIDR').textContent = formatCurrency(totals.costPerGuestMonthlyIDR, 'IDR');
  document.getElementById('costPerGuestMonthlyEUR').textContent = formatCurrency(totals.costPerGuestMonthlyEUR, 'EUR');
}

function updateDepartmentSummary(departments) {
  const tbody = document.getElementById('departmentSummaryBody');
  tbody.innerHTML = '';
  
  Object.keys(departments).forEach(deptName => {
    const dept = departments[deptName];
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <span class="department-badge" style="background-color: ${dept.color}">
          ${deptName}
        </span>
      </td>
      <td>${dept.staff}</td>
      <td>${formatCurrency(dept.monthlyIDR, 'IDR')}</td>
      <td>${formatCurrency(dept.monthlyEUR, 'EUR')}</td>
      <td>${formatCurrency(dept.annualIDR, 'IDR')}</td>
      <td>${formatCurrency(dept.annualEUR, 'EUR')}</td>
      <td>${formatCurrency(dept.avgCostPerEmployee, 'IDR')}</td>
    `;
    
    tbody.appendChild(row);
  });
}

function updateCharts(departments) {
  updateDepartmentPieChart(departments);
  updateMonthlyAnnualChart(departments);
  updateStaffDistributionChart(departments);
  updateCostPerEmployeeChart(departments);
}

function updateDepartmentPieChart(departments) {
  const ctx = document.getElementById('departmentPieChart').getContext('2d');
  
  if (charts.departmentPie) {
    charts.departmentPie.destroy();
  }
  
  const labels = Object.keys(departments);
  const data = labels.map(dept => departments[dept].monthlyIDR);
  const colors = labels.map(dept => departments[dept].color);
  
  charts.departmentPie = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = formatCurrency(context.raw, 'IDR');
              const percentage = ((context.raw / data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function updateMonthlyAnnualChart(departments) {
  const ctx = document.getElementById('monthlyAnnualChart').getContext('2d');
  
  if (charts.monthlyAnnual) {
    charts.monthlyAnnual.destroy();
  }
  
  const labels = Object.keys(departments);
  const monthlyData = labels.map(dept => departments[dept].monthlyIDR);
  const annualData = labels.map(dept => departments[dept].annualIDR);
  
  charts.monthlyAnnual = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Monthly Cost (IDR)',
          data: monthlyData,
          backgroundColor: 'rgba(33, 128, 141, 0.7)',
          borderColor: 'rgba(33, 128, 141, 1)',
          borderWidth: 1
        },
        {
          label: 'Annual Cost (IDR)',
          data: annualData,
          backgroundColor: 'rgba(255, 107, 107, 0.7)',
          borderColor: 'rgba(255, 107, 107, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value, 'IDR');
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${formatCurrency(context.raw, 'IDR')}`;
            }
          }
        }
      }
    }
  });
}

function updateStaffDistributionChart(departments) {
  const ctx = document.getElementById('staffDistributionChart').getContext('2d');
  
  if (charts.staffDistribution) {
    charts.staffDistribution.destroy();
  }
  
  const labels = Object.keys(departments);
  const data = labels.map(dept => departments[dept].staff);
  const colors = labels.map(dept => departments[dept].color);
  
  charts.staffDistribution = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const percentage = ((context.raw / data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
              return `${label}: ${value} staff (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function updateCostPerEmployeeChart(departments) {
  const ctx = document.getElementById('costPerEmployeeChart').getContext('2d');
  
  if (charts.costPerEmployee) {
    charts.costPerEmployee.destroy();
  }
  
  const labels = Object.keys(departments);
  const data = labels.map(dept => departments[dept].avgCostPerEmployee);
  const colors = labels.map(dept => departments[dept].color);
  
  charts.costPerEmployee = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Average Cost per Employee (IDR)',
        data: data,
        backgroundColor: colors,
        borderColor: colors.map(color => color + 'CC'),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value, 'IDR');
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${formatCurrency(context.raw, 'IDR')}`;
            }
          }
        }
      }
    }
  });
}

function getTotalBPJSRate() {
  return appData.settings.bpjsKesehatan + 
         appData.settings.bpjsJHT + 
         appData.settings.bpjsJP + 
         appData.settings.bpjsJKM + 
         appData.settings.bpjsJKK;
}

function updateTotalBPJS() {
  const total = getTotalBPJSRate();
  document.getElementById('totalBPJS').textContent = total.toFixed(2) + '%';
}

function formatCurrency(amount, currency) {
  if (currency === 'IDR') {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(amount));
  } else if (currency === 'EUR') {
    return '€ ' + new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
  return amount.toString();
}

function exportToCSV() {
  let csvContent = "Role,Department,Staff Count,Base Salary (IDR),Base Salary (EUR),Monthly Cost (IDR),Monthly Cost (EUR),Annual Cost (IDR),Annual Cost (EUR)\n";
  
  appData.roles.forEach(role => {
    const costs = calculateRoleCosts(role);
    csvContent += `"${role.role}","${role.department}",${role.staff},${role.salary},${costs.salaryEUR.toFixed(2)},${costs.monthlyCostIDR.toFixed(0)},${costs.monthlyCostEUR.toFixed(2)},${costs.annualCostIDR.toFixed(0)},${costs.annualCostEUR.toFixed(2)}\n`;
  });
  
  // Add totals
  const totals = calculateTotals();
  csvContent += "\n";
  csvContent += "TOTALS\n";
  csvContent += `Total Staff,${totals.totalStaff}\n`;
  csvContent += `Total Monthly Cost (IDR),${totals.totalMonthlyIDR.toFixed(0)}\n`;
  csvContent += `Total Monthly Cost (EUR),${totals.totalMonthlyEUR.toFixed(2)}\n`;
  csvContent += `Total Annual Cost (IDR),${totals.totalAnnualIDR.toFixed(0)}\n`;
  csvContent += `Total Annual Cost (EUR),${totals.totalAnnualEUR.toFixed(2)}\n`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "hr_cost_calculator_export.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}