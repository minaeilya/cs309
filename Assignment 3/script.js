// ==========================================
// JAVASCRIPT LOGIC WITH LOCALSTORAGE
// ==========================================

// Load initial data from localStorage if available, otherwise use initialData from data.js
let currentData = JSON.parse(localStorage.getItem('assignmentUsers')) || [...initialData];
let currentSort = { key: null, direction: 'asc' }; // 'asc' or 'desc'

// Initialize App on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tableBody')) {
        renderTable(currentData);
    }
    if (document.getElementById('registrationForm')) {
        setupLiveValidation();
    }
});

// Save current data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('assignmentUsers', JSON.stringify(currentData));
}

// ==========================================
// 1. THEME LOGIC
// ==========================================
function toggleDarkMode() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        icon.className = "fa-solid fa-moon";
    } else {
        html.classList.add('dark');
        icon.className = "fa-solid fa-sun text-yellow-400";
    }
}

function togglePasswordVisibility(fieldId, iconId) {
    const field = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);
    if (!field || !icon) return;
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fa-regular fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fa-regular fa-eye';
    }
}

// ==========================================
// 2. FORM VALIDATION LOGIC
// ==========================================
const form = document.getElementById('registrationForm');
const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    age: document.getElementById('age')
};

const errors = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    password: document.getElementById('passwordError'),
    confirmPassword: document.getElementById('confirmPasswordError'),
    age: document.getElementById('ageError')
};

function setupLiveValidation() {
    if (!form) return;
    Object.keys(fields).forEach(key => {
        if (fields[key]) {
            fields[key].addEventListener('input', () => {
                validateSingleField(key);
            });
        }
    });
}

function validateSingleField(fieldKey) {
    if (!fields[fieldKey]) return true;
    let isValid = true;
    let message = "";

    const val = fields[fieldKey].value.trim();

    switch (fieldKey) {
        case 'name':
            if (!val) {
                message = "Full Name is required.";
                isValid = false;
            } else if (val.length < 3) {
                message = "Name must be at least 3 characters long.";
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!val) {
                message = "Email address is required.";
                isValid = false;
            } else if (!emailRegex.test(val)) {
                message = "Please enter a valid email address (e.g. name@domain.com).";
                isValid = false;
            }
            break;

        case 'password':
            if (!val) {
                message = "Password is required.";
                isValid = false;
            } else if (val.length < 8) {
                message = "Password must be at least 8 characters.";
                isValid = false;
            }
            if (fields.confirmPassword && fields.confirmPassword.value) {
                validateSingleField('confirmPassword');
            }
            break;

        case 'confirmPassword':
            if (!val) {
                message = "Please confirm your password.";
                isValid = false;
            } else if (fields.password && val !== fields.password.value) {
                message = "Passwords do not match.";
                isValid = false;
            }
            break;

        case 'age':
            const ageNum = Number(val);
            if (!val) {
                message = "Age is required.";
                isValid = false;
            } else if (isNaN(ageNum) || ageNum < 12 || ageNum > 100) {
                message = "Age must be a valid number between 12 and 100.";
                isValid = false;
            }
            break;
    }

    showFieldError(fieldKey, message, !isValid);
    return isValid;
}

function showFieldError(fieldKey, message, hasError) {
    const input = fields[fieldKey];
    const errorElement = errors[fieldKey];
    if (!input || !errorElement) return;

    if (hasError) {
        errorElement.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
        errorElement.classList.remove('hidden');
        input.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        input.classList.remove('border-slate-300', 'dark:border-slate-600', 'border-green-500');
    } else {
        errorElement.classList.add('hidden');
        errorElement.textContent = "";
        input.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        input.classList.add('border-slate-300', 'dark:border-slate-600');
    }
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;

        Object.keys(fields).forEach(key => {
            const valid = validateSingleField(key);
            if (!valid) isFormValid = false;
        });

        const statusBox = document.getElementById('formStatusBox');
        const statusIcon = document.getElementById('statusIcon');
        const statusTitle = document.getElementById('statusTitle');
        const statusMessage = document.getElementById('statusMessage');

        if (!statusBox) return;

        statusBox.classList.remove('hidden', 'bg-red-50', 'bg-green-50', 'dark:bg-red-950/40', 'dark:bg-green-950/40', 'border-red-200', 'border-green-200', 'text-red-800', 'text-green-800', 'dark:text-red-300', 'dark:text-green-300');

        if (!isFormValid) {
            statusBox.classList.add('bg-red-50', 'dark:bg-red-950/40', 'border-red-200', 'dark:border-red-800', 'text-red-800', 'dark:text-red-300');
            statusIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-red-600"></i>`;
            statusTitle.textContent = "Form Submission Failed!";
            statusMessage.textContent = "Please fix the errors highlighted in red above before submitting.";
        } else {
            const newUser = {
                id: currentData.length + 1,
                name: fields.name.value.trim(),
                age: parseInt(fields.age.value.trim()),
                city: "Cairo (New)",
                role: "Member",
                status: "Active"
            };

            // Add to data array and save to localStorage
            currentData.unshift(newUser);
            saveToLocalStorage();

            statusBox.classList.add('bg-green-50', 'dark:bg-green-950/40', 'border-green-200', 'dark:border-green-800', 'text-green-800', 'dark:text-green-300');
            statusIcon.innerHTML = `<i class="fa-solid fa-circle-check text-green-600"></i>`;
            statusTitle.textContent = "Registration Successful!";
            statusMessage.textContent = `User "${newUser.name}" was added successfully! Go to Data Table to view it.`;

            form.reset();
            Object.keys(fields).forEach(key => {
                if (fields[key]) fields[key].classList.remove('border-green-500');
            });
        }
    });
}

function resetForm() {
    if (!form) return;
    form.reset();
    Object.keys(fields).forEach(key => {
        showFieldError(key, "", false);
    });
    const statusBox = document.getElementById('formStatusBox');
    if (statusBox) statusBox.classList.add('hidden');
}

// ==========================================
// 3. DYNAMIC TABLE LOGIC
// ==========================================
function renderTable(dataArray) {
    const tbody = document.getElementById('tableBody');
    const noResults = document.getElementById('noResults');
    const totalCount = document.getElementById('totalCount');

    if (!tbody) return;

    tbody.innerHTML = "";
    if (totalCount) totalCount.textContent = dataArray.length;

    if (dataArray.length === 0) {
        if (noResults) noResults.classList.remove('hidden');
        return;
    } else {
        if (noResults) noResults.classList.add('hidden');
    }

    dataArray.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-100 dark:border-slate-700/50";

        const badgeClass = item.status === 'Active' 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';

        tr.innerHTML = `
            <td class="py-3 px-4 text-xs font-medium text-slate-400">${index + 1}</td>
            <td class="py-3 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    ${item.name.charAt(0)}
                </div>
                ${escapeHtml(item.name)}
            </td>
            <td class="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">${item.age}</td>
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400">${escapeHtml(item.city)}</td>
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs">${escapeHtml(item.role)}</td>
            <td class="py-3 px-4 text-center">
                <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}">
                    ${item.status}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const clearBtn = document.getElementById('clearSearchBtn');

    if (clearBtn) {
        if (query.length > 0) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }

    const filtered = currentData.filter(item => {
        return item.name.toLowerCase().includes(query) ||
               item.city.toLowerCase().includes(query) ||
               item.role.toLowerCase().includes(query) ||
               item.age.toString().includes(query);
    });

    renderTable(filtered);
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = "";
    renderTable(currentData);
}

function sortTable(key) {
    const nameBtn = document.getElementById('sortNameBtn');
    const ageBtn = document.getElementById('sortAgeBtn');
    const nameIcon = document.getElementById('sortNameIcon');
    const ageIcon = document.getElementById('sortAgeIcon');

    if (currentSort.key === key) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.key = key;
        currentSort.direction = 'asc';
    }

    if (key === 'name' && nameBtn && ageBtn && nameIcon && ageIcon) {
        nameBtn.classList.add('border-blue-500', 'text-blue-600', 'bg-blue-50', 'dark:bg-blue-900/30');
        ageBtn.classList.remove('border-blue-500', 'text-blue-600', 'bg-blue-50', 'dark:bg-blue-900/30');
        nameIcon.className = currentSort.direction === 'asc' ? 'fa-solid fa-sort-up text-blue-600' : 'fa-solid fa-sort-down text-blue-600';
        ageIcon.className = 'fa-solid fa-sort text-slate-400';
    } else if (key === 'age' && nameBtn && ageBtn && nameIcon && ageIcon) {
        ageBtn.classList.add('border-blue-500', 'text-blue-600', 'bg-blue-50', 'dark:bg-blue-900/30');
        nameBtn.classList.remove('border-blue-500', 'text-blue-600', 'bg-blue-50', 'dark:bg-blue-900/30');
        ageIcon.className = currentSort.direction === 'asc' ? 'fa-solid fa-sort-up text-blue-600' : 'fa-solid fa-sort-down text-blue-600';
        nameIcon.className = 'fa-solid fa-sort text-slate-400';
    }

    currentData.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    renderTable(currentData);
}

function resetDataView() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const nameBtn = document.getElementById('sortNameBtn');
    const ageBtn = document.getElementById('sortAgeBtn');
    const nameIcon = document.getElementById('sortNameIcon');
    const ageIcon = document.getElementById('sortAgeIcon');

    if (searchInput) searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
    currentSort = { key: null, direction: 'asc' };

    if (nameBtn) nameBtn.className = "flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition";
    if (ageBtn) ageBtn.className = "flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition";
    if (nameIcon) nameIcon.className = "fa-solid fa-sort text-slate-400";
    if (ageIcon) ageIcon.className = "fa-solid fa-sort text-slate-400";

    renderTable(currentData);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}