// Import users array from countriesArray.js
import users from "./countriesArray.js";

// Import serviceCategories and subCategoriesArray from categoryArray.js
import {
    serviceCategories,
    subCategoriesArray,
} from "./categoryArrayForFrontend.js";

// Get references to select elements
const serviceSelect = document.getElementById("service");
const categorySelect = document.getElementById("category");
const subCategorySelect = document.getElementById("subcategory");
const textArea = document.getElementById("description");

let service;
textArea.value = textAreaDescription;

function createOptions() {
    // Populate category select options based on selected service
    const categories = serviceCategories[service];
    categorySelect.innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option");
        option.text = categories[i];
        option.value = categories[i];
        if (categories[i] == "Select the Category:") {
            option.classList.add("bg-dark-subtle");
        }
        categorySelect.add(option);
    }
}

window.addEventListener("load", function () {
    service = serviceSelect.value;

    createOptions();
});

// Event listener for service select change
serviceSelect.addEventListener("change", function () {
    service = this.value;

    // If Service is not Indian Navy, disable subcategory select element
    if (service != "IN") {
        subCategorySelect.innerHTML = "";
        subCategorySelect.disabled = true;
    } else {
        subCategorySelect.disabled = false;
    }

    createOptions();
});

// Event listener for category select change
categorySelect.addEventListener("change", function () {
    if (service == "IN") {
        const categoryValue = this.value;
        const subCategories = subCategoriesArray[categoryValue];
        subCategorySelect.innerHTML = "";
        for (let i = 0; i < subCategories.length; i++) {
            const option = document.createElement("option");
            option.text = subCategories[i];
            option.value = subCategories[i];
            if (subCategories[i] == "Select the Sub Category:") {
                option.classList.add("bg-dark-subtle");
            }
            subCategorySelect.add(option);
        }
    } else {
        subCategorySelect.innerHTML = "";
    }
});

// Get reference to user dropdown
const userDropDown = document.getElementById("userDropDown");

// Populate user dropdown list
users.forEach((user) => {
    // Create <li> element
    const li = document.createElement("li");
    li.classList.add("px-3");

    // Create <input> element
    const input = document.createElement("input");
    input.classList.add("form-check-input", "me-2");
    input.type = "checkbox";
    input.value = user[0] + ", " + user[1].toLowerCase();
    input.id = user[0].toLowerCase();
    input.name = "users[]";

    // Create <label> element
    const label = document.createElement("label");
    label.classList.add("form-check-label");
    label.htmlFor = user[0].toLowerCase();
    label.textContent = user[0];

    // Append input and label elements to <li> element
    li.appendChild(input);
    li.appendChild(label);

    // Append <li> element to the parent element
    userDropDown.appendChild(li);
});

// Get reference to search input
const dropDownSearch = document.getElementById("searchInput");

// Event listener for input in search bar
dropDownSearch.addEventListener("input", filterUsers);

// Function to filter users based on input in search bar
function filterUsers() {
    const filter = dropDownSearch.value.toLowerCase();
    const dropdown = document.getElementById("userDropDown");
    const items = dropdown.getElementsByTagName("li");

    for (let i = 0; i < items.length; i++) {
        const label = items[i].getElementsByTagName("label")[0];
        const textValue = label.textContent || label.innerText;
        if (textValue.toLowerCase().indexOf(filter) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}

// Loop through each option in the select element
window.addEventListener("load", () => {
    for (let i = 0; i < categorySelect.options.length; i++) {
        // Check if the value of the current option matches the 'category variable
        if (categorySelect.options[i].value === category) {
            // If it matches, set the 'selected' attribute for this option
            categorySelect.options[i].setAttribute("selected", "selected");
        }
    }

    // Split the string by comma followed by space
    const parts = countries.split(/,\s*/);

    // Group the parts into pairs
    const pairs = [];
    for (let i = 0; i < parts.length; i += 2) {
        pairs.push(parts.slice(i, i + 2).join(", "));
    }

    // Get reference to checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Check if checkbox value is in the pairs array
    checkboxes.forEach((checkbox) => {
        if (pairs.includes(checkbox.value)) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
});
