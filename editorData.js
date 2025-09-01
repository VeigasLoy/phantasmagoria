/* ========================================
JavaScript (editorData.js)
========================================
This file contains all the data manipulation logic for the World Editor.
*/
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db } from './firebase.js';

// Helper function to get the plural form for a data type
function getFieldName(itemType) {
    if (itemType.endsWith('s')) return itemType;
    if (itemType === 'family') return 'families';
    // A simple pluralization for the known types
    const pluralMap = {
        character: 'characters',
        location: 'locations',
        organization: 'organizations',
    };
    return pluralMap[itemType] || itemType + 's';
}


// Helper function to safely get content from a Quill editor
function getEditorContent(editors, editorName) {
    return (editors && editors[editorName] && editors[editorName].root) ? editors[editorName].root.innerHTML : '';
}

// --- DATA MANIPULATION FUNCTIONS ---

export async function handleSaveItem(itemType, state, editors) {
    const { user, selectedWorldId, editingItemId, worlds } = state;
    if (!db || !user || !selectedWorldId) return;

    const saveButtonId = `save-${itemType}-btn`;
    const saveButton = document.getElementById(saveButtonId);
    if (saveButton) {
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'phantasmagoria-57bde';
    const worldDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'worlds', selectedWorldId);
    const world = worlds.find(w => w.id === selectedWorldId);
    
    const fieldName = getFieldName(itemType);
    const currentArray = world[fieldName] ? [...world[fieldName]] : [];
    let dataToSave = {};

    try {
        // Build the dataToSave object based on the specific itemType
        if (itemType === 'character') {
            const additionalDetails = Array.from(document.querySelectorAll('.custom-textbox-group')).map((group) => {
                const label = group.querySelector('.custom-label-input')?.value || '';
                const editorId = group.querySelector('.custom-editor')?.id || '';
                const content = editorId ? getEditorContent(editors, editorId) : '';
                return { label, content };
            });

            dataToSave = {
                name: document.getElementById('char-name')?.value || '',
                imageUrl: document.getElementById('char-image-url')?.value || '',
                role: document.getElementById('char-role')?.value || '',
                alignment: document.getElementById('char-alignment')?.value || '',
                species: document.getElementById('char-species')?.value || '', // Reverted to simple text input
                affiliatedOrgs: Array.from(document.querySelectorAll('#selected-orgs-container .item-pill')).map(pill => pill.dataset.itemName),
                relationships: getEditorContent(editors, 'relationships'),
                backstory: getEditorContent(editors, 'backstory'),
                possessions: getEditorContent(editors, 'possessions'),
                abilities: getEditorContent(editors, 'abilities'),
                trivia: getEditorContent(editors, 'trivia'),
                additionalDetails: additionalDetails,
            };
        } else if (itemType === 'location') {
             dataToSave = {
                name: document.getElementById('loc-name')?.value || '',
                imageUrl: document.getElementById('loc-image-url')?.value || '',
                type: document.getElementById('loc-type')?.value || '',
                government: document.getElementById('loc-gov')?.value || '',
                population: document.getElementById('loc-pop')?.value || '',
                parentLocation: document.querySelector('#selected-parent-loc-container .item-pill')?.dataset.itemName || '',
                keyCharacters: Array.from(document.querySelectorAll('#selected-key-chars-container .item-pill')).map(pill => pill.dataset.itemName),
                controllingOrgs: Array.from(document.querySelectorAll('#selected-control-orgs-container .item-pill')).map(pill => pill.dataset.itemName),
                demographics: getEditorContent(editors, 'demographics'),
                economy: getEditorContent(editors, 'economy'),
                culture: getEditorContent(editors, 'culture'),
            };
        } else if (itemType === 'organization') {
            dataToSave = {
                name: document.getElementById('org-name')?.value || '',
                imageUrl: document.getElementById('org-image-url')?.value || '',
                type: document.getElementById('org-type')?.value || '',
                memberDemographics: document.getElementById('org-member-demographics')?.value || '',
                leader: document.querySelector('#selected-leader-container .item-pill')?.dataset.itemName || '',
                keyMembers: Array.from(document.querySelectorAll('#selected-members-container .item-pill')).map(pill => pill.dataset.itemName),
                headquarters: document.querySelector('#selected-headquarters-container .item-pill')?.dataset.itemName || '',
                allies: Array.from(document.querySelectorAll('#selected-allies-container .item-pill')).map(pill => pill.dataset.itemName),
                rivals: Array.from(document.querySelectorAll('#selected-rivals-container .item-pill')).map(pill => pill.dataset.itemName),
                ranks: Array.from(document.querySelectorAll('.rank-item')).map(item => ({
                    title: item.querySelector('.rank-title-input')?.value || '',
                    description: item.querySelector('.rank-desc-input')?.value || ''
                })),
                publicAgenda: getEditorContent(editors, 'publicAgenda'),
                secretGoals: getEditorContent(editors, 'secretGoals'),
                history: getEditorContent(editors, 'history'),
                membershipRequirements: getEditorContent(editors, 'membershipRequirements'),
            };
        }

        // Add ID and update array
        if (editingItemId === 'new') {
            dataToSave.id = Date.now().toString();
            currentArray.push(dataToSave);
        } else {
            const itemIndex = currentArray.findIndex(item => item.id === editingItemId);
            if (itemIndex > -1) {
                dataToSave.id = editingItemId;
                currentArray[itemIndex] = { ...currentArray[itemIndex], ...dataToSave };
            } else {
                 dataToSave.id = Date.now().toString();
                 currentArray.push(dataToSave);
            }
        }
        
        await updateDoc(worldDocRef, { [fieldName]: currentArray });
        window.dispatchEvent(new CustomEvent('stateChange', { detail: { triggerFetch: true } }));

    } catch (e) {
        console.error(`Error saving item:`, e);
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = 'Save ' + itemType.charAt(0).toUpperCase() + itemType.slice(1);
        }
    }
}


export async function handleDeleteItem(itemType, itemId, state) {
    const { user, selectedWorldId, worlds } = state;
    if (!db || !user || !selectedWorldId) return;
    
    const world = worlds.find(w => w.id === selectedWorldId);
    if (!world) return;
    
    const fieldName = getFieldName(itemType);
    const currentArray = world[fieldName] ? [...world[fieldName]] : [];
    
    const newArray = currentArray.filter(item => item.id !== itemId);

    try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'phantasmagoria-57bde';
        const worldDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'worlds', selectedWorldId);
        await updateDoc(worldDocRef, { [fieldName]: newArray });
    } catch (e) {
        console.error("Error deleting item:", e);
    }
    
    window.dispatchEvent(new CustomEvent('stateChange', { detail: { triggerFetch: true } }));
}

