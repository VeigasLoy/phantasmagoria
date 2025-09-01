/* ========================================
JavaScript (raceFormLogic.js)
========================================
This file contains all the form-specific logic for the Race Editor.
*/
import { handleSaveItem } from './editorData.js';

export function initRaceForm(state, editors, toolbarOptions) {
    // --- Quill Editors for Race ---
    editors.description = new Quill('#editor-description', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.abilities = new Quill('#editor-abilities', { theme: 'snow', modules: { toolbar: toolbarOptions } });
    editors.habitat = new Quill('#editor-habitat', { theme: 'snow', modules: { toolbar: toolbarOptions } });

    // --- Save Button ---
    const saveButton = document.getElementById('save-race-btn');
    if (saveButton) {
        saveButton.addEventListener('click', () => handleSaveItem('race', state, editors));
    }
}

