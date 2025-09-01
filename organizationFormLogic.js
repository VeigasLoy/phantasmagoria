/* ========================================
JavaScript (organizationFormLogic.js)
========================================
This file contains all the form-specific logic for the Organization Editor.
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
            searchInput.value = name;
        }
        const pill = document.createElement('span');
        pill.className = 'item-pill flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-sm font-medium px-2.5 py-1 rounded-full';
        pill.dataset.itemName = name;
        pill.innerHTML = `${name} <button type="button" class="remove-item-btn text-yellow-400 hover:text-white">&times;</button>`;
        
        pill.querySelector('.remove-item-btn').addEventListener('click', (e) => {
            e.target.parentElement.remove();
             if (isSingleSelect) searchInput.value = '';
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

export function initOrganizationForm(state, editors, toolbarOptions) {
    const world = state.worlds.find(w => w.id === state.selectedWorldId);

    // --- Initialize Comboboxes for Organization ---
    initCombobox({
        state,
        searchInputId: 'leader-search',
        dropdownId: 'leader-dropdown',
        selectedContainerId: 'selected-leader-container',
        items: world.characters || [],
        itemName: 'Character',
        isSingleSelect: true,
        createNewView: 'characters'
    });
     initCombobox({
        state,
        searchInputId: 'key-members-search',
        dropdownId: 'key-members-dropdown',
        selectedContainerId: 'selected-members-container',
        items: world.characters || [],
        itemName: 'Character',
        isSingleSelect: false,
        createNewView: 'characters'
    });
     initCombobox({
        state,
        searchInputId: 'headquarters-search',
        dropdownId: 'headquarters-dropdown',
        selectedContainerId: 'selected-headquarters-container',
        items: world.locations || [],
        itemName: 'Location',
        isSingleSelect: true,
        createNewView: 'locations'
    });
     initCombobox({
        state,
        searchInputId: 'allies-search',
        dropdownId: 'allies-dropdown',
        selectedContainerId: 'selected-allies-container',
        items: world.organizations || [],
        itemName: 'Organization',
        isSingleSelect: false,
        createNewView: 'organizations'
    });
     initCombobox({
        state,
        searchInputId: 'rivals-search',
        dropdownId: 'rivals-dropdown',
        selectedContainerId: 'selected-rivals-container',
        items: world.organizations || [],
        itemName: 'Organization',
        isSingleSelect: false,
        createNewView: 'organizations'
    });


    // --- Quill Editors ---
    editors.publicAgenda = new Quill('#editor-public-agenda', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.secretGoals = new Quill('#editor-secret-goals', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.history = new Quill('#editor-history', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.membershipRequirements = new Quill('#editor-membership-reqs', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    
    // --- Dynamic Ranks List ---
    const ranksContainer = document.getElementById('ranks-container');
    const addRankBtn = document.getElementById('add-rank-btn');

    const addRankItem = (rank = {}) => {
        const rankItem = document.createElement('div');
        rankItem.className = 'rank-item flex items-center gap-2 mb-2';
        rankItem.innerHTML = `
            <input type="text" class="rank-title-input w-1/3 bg-gray-900/50 border border-yellow-400/30 rounded p-2" placeholder="Title" value="${rank.title || ''}">
            <input type="text" class="rank-desc-input w-2/3 bg-gray-900/50 border border-yellow-400/30 rounded p-2" placeholder="Description" value="${rank.description || ''}">
            <button class="remove-rank-btn text-red-500 hover:text-red-400 font-bold">&times;</button>
        `;
        rankItem.querySelector('.remove-rank-btn').addEventListener('click', () => rankItem.remove());
        ranksContainer.appendChild(rankItem);
    };

    // Add existing ranks if editing
    const orgData = world.organizations?.find(o => o.id === state.editingItemId);
    if (orgData && orgData.ranks) {
        orgData.ranks.forEach(addRankItem);
    }

    // FIX: Add a check to ensure the button exists before adding an event listener
    if (addRankBtn) {
        addRankBtn.addEventListener('click', () => addRankItem());
    }

    // --- Save Button ---
    document.getElementById('save-organization-btn').addEventListener('click', () => handleSaveItem('organization', state, editors));
}

