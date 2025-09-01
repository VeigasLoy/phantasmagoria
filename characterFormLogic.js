/* ========================================
JavaScript (characterFormLogic.js)
========================================
This file contains all the form-specific logic for the Character Editor.
*/
import { handleSaveItem } from './editorData.js';

// Helper function to initialize comboboxes
function initCombobox(config) {
    const { state, searchInputId, dropdownId, selectedContainerId, items, itemName, isSingleSelect, createNewView } = config;

    const searchInput = document.getElementById(searchInputId);
    const dropdown = document.getElementById(dropdownId);
    const selectedContainer = document.getElementById(selectedContainerId);

    if (!searchInput) return;

    const addItemPill = (name) => {
        if (isSingleSelect) {
            selectedContainer.innerHTML = ''; // Clear existing pill for single-select
        }
        const pill = document.createElement('span');
        pill.className = 'item-pill flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-sm font-medium px-2.5 py-1 rounded-full';
        pill.dataset.itemName = name;
        pill.innerHTML = `${name} <button type="button" class="remove-item-btn text-yellow-400 hover:text-white">&times;</button>`;
        
        pill.querySelector('.remove-item-btn').addEventListener('click', (e) => {
            e.target.parentElement.remove();
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
                    searchInput.value = '';
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
        // Check if the click is outside the combobox container
        const comboboxContainer = searchInput.closest('.relative');
        if (comboboxContainer && !comboboxContainer.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}


export function initCharacterForm(state, editors, toolbarOptions) {
    const world = state.worlds.find(w => w.id === state.selectedWorldId);

    // --- Initialize Combobox for Organizations (Multi-select) ---
    initCombobox({
        state,
        searchInputId: 'char-affiliated-org-search',
        dropdownId: 'org-dropdown',
        selectedContainerId: 'selected-orgs-container',
        items: world.organizations || [],
        itemName: 'Organization',
        isSingleSelect: false,
        createNewView: 'organizations'
    });

    // --- Quill Editors for Character ---
    editors.relationships = new Quill('#editor-relationships', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.backstory = new Quill('#editor-backstory', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.possessions = new Quill('#editor-possessions', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.abilities = new Quill('#editor-abilities', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.trivia = new Quill('#editor-trivia', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    
    document.querySelectorAll('.custom-editor').forEach((el) => {
        editors[el.id] = new Quill(el, { theme: 'snow', modules: { toolbar: toolbarOptions } });
    });

    // --- Event Listener for Add Textbox ---
    const addTextboxBtn = document.getElementById('add-textbox-btn');
    if (addTextboxBtn) {
        addTextboxBtn.addEventListener('click', () => {
            const container = document.getElementById('custom-fields-container');
            const index = container.children.length;
            const newField = document.createElement('div');
            newField.className = 'custom-textbox-group space-y-2 border-t border-yellow-400/20 pt-4';
            const editorId = `editor-custom-${index}`;
            newField.innerHTML = `<div class="flex justify-between items-center"><label class="block text-yellow-500 mb-1">Custom Label</label><button class="delete-custom-field-btn text-red-500 hover:text-red-400 text-sm font-semibold">Remove</button></div><input type="text" class="custom-label-input w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value=""><div id="${editorId}" class="custom-editor bg-gray-900/50 text-white"></div>`;
            container.appendChild(newField);
            editors[editorId] = new Quill(`#${editorId}`, { theme: 'snow', modules: { toolbar: toolbarOptions } });
            newField.querySelector('.delete-custom-field-btn').addEventListener('click', (e) => {
                e.currentTarget.closest('.custom-textbox-group').remove();
            });
        });
    }


    document.querySelectorAll('.delete-custom-field-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.currentTarget.closest('.custom-textbox-group').remove();
        });
    });

    // --- Save Button ---
    const saveButton = document.getElementById('save-character-btn');
    if (saveButton) {
        saveButton.addEventListener('click', () => handleSaveItem('character', state, editors));
    }
}

