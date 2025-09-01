/* ========================================
JavaScript (editorLogic.js)
========================================
This file coordinates event listeners and delegates logic to specialized modules.
*/
import { handleDeleteItem, handleSaveItem } from './editorData.js';
import { initCharacterForm } from './characterFormLogic.js';
import { initLocationForm } from './locationFormLogic.js';
import { initOrganizationForm } from './organizationFormLogic.js';
import { initRaceForm } from './raceFormLogic.js';

// --- EVENT HANDLERS ---

function handleAddItem(itemType, state) {
    const event = new CustomEvent('stateChange', { detail: { ...state, editingItemId: 'new', viewingItemId: null } });
    window.dispatchEvent(event);
}

function handleEditItem(itemId, state) {
    const event = new CustomEvent('stateChange', { detail: { ...state, editingItemId: itemId, viewingItemId: null } });
    window.dispatchEvent(event);
}

function handleViewItem(itemId, state) {
    const event = new CustomEvent('stateChange', { detail: { ...state, viewingItemId: itemId, editingItemId: null } });
    window.dispatchEvent(event);
}

function handleCancel(state) {
    const event = new CustomEvent('stateChange', { detail: { ...state, editingItemId: null, viewingItemId: null } });
    window.dispatchEvent(event);
}

function initImageUploader() {
    const imageDropZone = document.getElementById('image-drop-zone');
    // Only run if the uploader exists on the current form
    if (!imageDropZone) return; 

    const imageUploadInput = document.getElementById('image-upload-input');
    const imagePreview = document.getElementById('image-preview');
    const finalImageUrlInput = document.getElementById('image-url');

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                finalImageUrlInput.value = e.target.result;
                imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    };

    imageDropZone.addEventListener('click', () => imageUploadInput.click());
    imageDropZone.addEventListener('dragover', (e) => { e.preventDefault(); imageDropZone.classList.add('border-yellow-400'); });
    imageDropZone.addEventListener('dragleave', () => { imageDropZone.classList.remove('border-yellow-400'); });
    imageDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageDropZone.classList.remove('border-yellow-400');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
    });
    imageUploadInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
    });
}


// --- EXPORTED FUNCTIONS ---

export function attachGeneralEventListeners(state) {
    document.querySelectorAll('.editor-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('stateChange', { detail: { editorSubView: e.currentTarget.dataset.view, editingItemId: null, viewingItemId: null } }));
        });
    });

    const createBtn = document.getElementById('create-btn');
    if (createBtn) createBtn.addEventListener('click', () => handleAddItem(state.editorSubView, state));

    document.querySelectorAll('.edit-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleEditItem(e.currentTarget.dataset.itemId, state));
    });

    document.querySelectorAll('.delete-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.currentTarget.dataset.itemId;
            const itemType = state.editorSubView;
            if (confirm(`Are you sure you want to delete this ${itemType.slice(0, -1)}?`)) {
                handleDeleteItem(itemType, itemId, state);
            }
        });
    });

    document.querySelectorAll('.view-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleViewItem(e.currentTarget.dataset.itemId, state);
        });
    });
    
    document.getElementById('back-to-list-btn')?.addEventListener('click', () => handleCancel(state));
}

export function attachFormEventListeners(state) {
    const editors = {};
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'link'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['clean']
    ];

    const { editorSubView } = state;
    switch (editorSubView) {
        case 'characters':
            initCharacterForm(state, editors, toolbarOptions);
            break;
        case 'locations':
            initLocationForm(state, editors, toolbarOptions);
            break;
        case 'organizations':
            initOrganizationForm(state, editors, toolbarOptions);
            break;
        case 'races': // Corrected from 'race' to 'races'
            initRaceForm(state, editors, toolbarOptions);
            break;
    }
    
    initImageUploader(); // Initialize for any form that might have it

    document.getElementById('cancel-btn')?.addEventListener('click', () => handleCancel(state));
}

