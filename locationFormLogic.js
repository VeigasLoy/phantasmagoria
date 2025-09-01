/* ========================================
JavaScript (locationFormLogic.js)
========================================
This file contains all the form-specific logic for the Location Editor.
*/
import { handleSaveItem } from './editorData.js';

// Helper function to initialize comboboxes (copied from characterFormLogic.js)
function initCombobox(config) {
    const { state, searchInputId, dropdownId, selectedContainerId, items, itemName, isSingleSelect, createNewView } = config;

    const searchInput = document.getElementById(searchInputId);
    const dropdown = document.getElementById(dropdownId);
    const selectedContainer = document.getElementById(selectedContainerId);

    if (!searchInput) return;

    const addItemPill = (name) => {
        if (isSingleSelect) {
            selectedContainer.innerHTML = ''; // Clear existing pill
            searchInput.value = name; // Put name in search bar for single select
        }
        const pill = document.createElement('span');
        pill.className = 'item-pill flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-sm font-medium px-2.5 py-1 rounded-full';
        pill.dataset.itemName = name;
        pill.innerHTML = `${name} <button type="button" class="remove-item-btn text-yellow-400 hover:text-white">&times;</button>`;
        
        pill.querySelector('.remove-item-btn').addEventListener('click', (e) => {
            e.target.parentElement.remove();
            if (isSingleSelect) searchInput.value = ''; // Clear search bar on remove
        });
        selectedContainer.appendChild(pill);
    };

    const updateDropdown = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedItems = Array.from(selectedContainer.children).map(pill => pill.dataset.itemName);
        const filteredItems = items.filter(item => 
            !selectedItems.includes(item.name) && item.name.toLowerCase().includes(searchTerm)
        );

        dropdown.innerHTML = '';
        if (filteredItems.length > 0) {
            filteredItems.forEach(item => {
                const option = document.createElement('div');
                option.className = 'p-2 cursor-pointer hover:bg-yellow-400/20';
                option.textContent = item.name;
                option.addEventListener('click', () => {
                    addItemPill(item.name);
                    if (!isSingleSelect) searchInput.value = '';
                    updateDropdown();
                    searchInput.focus();
                });
                dropdown.appendChild(option);
            });
        }
        
        const newOption = document.createElement('div');
        newOption.className = 'p-2 cursor-pointer hover:bg-yellow-400/20 text-yellow-400 font-bold';
        newOption.textContent = `Create New ${itemName}...`;
        newOption.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('stateChange', { detail: { editorSubView: createNewView, editingItemId: 'new' } }));
        });
        dropdown.appendChild(newOption);
        dropdown.classList.remove('hidden');
    };

    document.querySelectorAll(`#${selectedContainerId} .remove-item-btn`).forEach(btn => {
        btn.addEventListener('click', (e) => e.target.parentElement.remove());
    });
    
    searchInput.addEventListener('input', updateDropdown);
    searchInput.addEventListener('focus', updateDropdown);
    document.addEventListener('click', (e) => {
        if (!searchInput.parentElement.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

export function initLocationForm(state, editors, toolbarOptions) {
    const world = state.worlds.find(w => w.id === state.selectedWorldId);

    // --- Initialize Comboboxes for Location ---
    initCombobox({
        state,
        searchInputId: 'parent-location-search',
        dropdownId: 'parent-location-dropdown',
        selectedContainerId: 'selected-parent-location-container',
        items: world.locations || [],
        itemName: 'Location',
        isSingleSelect: true,
        createNewView: 'locations'
    });

    initCombobox({
        state,
        searchInputId: 'key-characters-search',
        dropdownId: 'key-characters-dropdown',
        selectedContainerId: 'selected-chars-container',
        items: world.characters || [],
        itemName: 'Character',
        isSingleSelect: false,
        createNewView: 'characters'
    });

    initCombobox({
        state,
        searchInputId: 'controlling-org-search',
        dropdownId: 'controlling-org-dropdown',
        selectedContainerId: 'selected-controlling-org-container',
        items: world.organizations || [],
        itemName: 'Organization',
        isSingleSelect: true,
        createNewView: 'organizations'
    });

    // --- Quill Editors for Location ---
    editors.demographics = new Quill('#editor-demographics', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.economy = new Quill('#editor-economy', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.culture = new Quill('#editor-culture', { theme: 'snow', modules: { toolbar: toolbarOptions } });

    // --- Save Button ---
    document.getElementById('save-location-btn').addEventListener('click', () => handleSaveItem('location', state, editors));
}

