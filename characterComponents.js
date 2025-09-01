/* ========================================
JavaScript (characterComponents.js)
========================================
This file contains all the UI components for the Character Editor.
*/

export const CharacterFormComponent = (character = {}, world) => {
    const isNew = !character.id;
    
    const customFieldsHtml = (character.additionalDetails || []).map((field, index) => `
        <div class="custom-textbox-group space-y-2 border-t border-yellow-400/20 pt-4">
            <div class="flex justify-between items-center">
                <label class="block text-yellow-500 mb-1">Custom Label</label>
                <button class="delete-custom-field-btn text-red-500 hover:text-red-400 text-sm font-semibold">Remove</button>
            </div>
            <input type="text" class="custom-label-input w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${field.label || ''}">
            <div id="editor-custom-${index}" class="custom-editor bg-gray-900/50 text-white">${field.content || ''}</div>
        </div>
    `).join('');
    
    const existingOrgPills = (character.affiliatedOrgs || []).map(orgName => `
        <span class="item-pill flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-sm font-medium px-2.5 py-1 rounded-full" data-item-name="${orgName}">
            ${orgName} <button type="button" class="remove-item-btn text-yellow-400 hover:text-white">&times;</button>
        </span>
    `).join('');

    const alignments = ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"];
    const alignmentOptions = alignments.map(align => `<option value="${align}" ${character.alignment === align ? 'selected' : ''}>${align}</option>`).join('');

    return `<div class="fantasy-card rounded-lg p-6">
        <h3 class="text-3xl mb-6">${isNew ? 'Create New Character' : `Edit ${character.name}`}</h3>
        <div class="space-y-4">
            <div><label for="char-name" class="block text-yellow-500 mb-1">Name</label><input type="text" id="char-name" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${character.name || ''}"></div>
            <div>
                <label class="block text-yellow-500 mb-1">Character Image</label>
                <div id="image-drop-zone" class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-yellow-400/30 border-dashed rounded-md cursor-pointer hover:border-yellow-400">
                    <div class="space-y-1 text-center">
                        <img id="image-preview" src="${character.imageUrl || ''}" class="${character.imageUrl ? 'h-24 mx-auto mb-4 rounded' : 'hidden'}" alt="Image Preview"/>
                        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        <div class="flex text-sm text-gray-600">
                            <label for="char-image-upload" class="relative cursor-pointer bg-gray-900/50 rounded-md font-medium text-yellow-500 hover:text-yellow-400 focus-within:outline-none px-1">
                                <span>Upload a file</span>
                                <input id="char-image-upload" name="char-image-upload" type="file" class="sr-only" accept="image/*">
                            </label>
                            <p class="pl-1 text-gray-400">or drag and drop</p>
                        </div>
                        <p class="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
                    </div>
                </div>
                <input type="hidden" id="char-image-url" value="${character.imageUrl || ''}">
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label for="char-species" class="block text-yellow-500 mb-1">Species</label><input type="text" id="char-species" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${character.species || ''}"></div>
                <div><label for="char-role" class="block text-yellow-500 mb-1">Role (e.g. Protagonist)</label><input type="text" id="char-role" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${character.role || ''}"></div>
                <div>
                    <label for="char-alignment" class="block text-yellow-500 mb-1">Alignment</label>
                    <select id="char-alignment" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2">
                        <option value="">None</option>
                        ${alignmentOptions}
                    </select>
                </div>
                <div>
                    <label class="block text-yellow-500 mb-1">Affiliated Organizations</label>
                    <div class="relative">
                        <input type="text" id="char-affiliated-org-search" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" placeholder="Search for an organization...">
                        <div id="org-dropdown" class="absolute z-10 w-full mt-1 bg-[#121222] border border-yellow-400/30 rounded-md shadow-lg hidden"></div>
                    </div>
                    <div id="selected-orgs-container" class="flex flex-wrap gap-2 mt-2">${existingOrgPills}</div>
                </div>
            </div>
            
            <div><label class="block text-yellow-500 mb-1">Relationships</label><div id="editor-relationships" class="bg-gray-900/50 text-white">${character.relationships || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Backstory</label><div id="editor-backstory" class="bg-gray-900/50 text-white">${character.backstory || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Possessions</label><div id="editor-possessions" class="bg-gray-900/50 text-white">${character.possessions || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Abilities</label><div id="editor-abilities" class="bg-gray-900/50 text-white">${character.abilities || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Trivia</label><div id="editor-trivia" class="bg-gray-900/50 text-white">${character.trivia || ''}</div></div>
            
            <div id="custom-fields-container">${customFieldsHtml}</div>
            <div class="mt-4"><button id="add-textbox-btn" class="fantasy-btn bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm"><i class="fas fa-plus mr-2"></i>Add Textbox</button></div>
        </div>
        <div class="flex justify-end gap-4 mt-6">
            <button id="cancel-btn" class="fantasy-btn bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg">Cancel</button>
            <button id="save-character-btn" class="fantasy-btn py-2 px-4 rounded-lg">Save Character</button>
        </div>
    </div>`;
};

export const CharacterCardComponent = (character) => `<div class="fantasy-card rounded-lg p-4 text-center flex flex-col"><img src="${character.imageUrl || 'https://placehold.co/150x150/1a1a2e/d4af37?text=?'}" alt="${character.name}" class="w-full h-40 rounded-md object-cover mb-4 cursor-pointer view-item-btn" data-item-id="${character.id}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/1a1a2e/d4af37?text=Error';"><div class="flex-grow"><a href="#" data-item-id="${character.id}" class="view-item-btn text-xl text-yellow-500 hover:underline">${character.name}</a><p class="text-sm italic text-gray-400">${character.role || 'N/A'}</p></div><div class="flex justify-center gap-2 mt-4"><button data-item-id="${character.id}" class="edit-item-btn fantasy-btn py-1 px-3 rounded-lg text-sm">Edit</button><button data-item-id="${character.id}" class="delete-item-btn fantasy-btn bg-red-800 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm">Delete</button></div></div>`;

export const CharacterDetailComponent = (character) => { 
    if (!character) return '<p>Character not found.</p>'; 
    const customFieldsHtml = (character.additionalDetails || []).map(field => `<div><strong>${field.label}:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${field.content}</div></div>`).join(''); 
    const orgsList = (character.affiliatedOrgs || []).join(', '); 
    return `<div class="fantasy-card rounded-lg p-6">
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-4xl text-yellow-400">${character.name}</h3>
            <button id="back-to-list-btn" class="fantasy-btn py-2 px-4 rounded-lg">Back to List</button>
        </div>
        <div class="flex flex-col md:flex-row gap-6">
            <img src="${character.imageUrl || 'https://placehold.co/200x300/1a1a2e/d4af37?text=?'}" alt="${character.name}" class="w-full md:w-1/3 rounded-lg object-cover self-start">
            <div class="md:w-2/3 space-y-4">
                <p><strong>Role:</strong> ${character.role || 'N/A'}</p>
                <p><strong>Species:</strong> ${character.species || 'N/A'}</p>
                <p><strong>Alignment:</strong> ${character.alignment || 'N/A'}</p>
                <p><strong>Affiliated Organizations:</strong> ${orgsList || 'N/A'}</p>
                <div><strong>Relationships:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${character.relationships || 'N/A'}</div></div>
                <div><strong>Backstory:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${character.backstory || 'N/A'}</div></div>
                <div><strong>Possessions:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${character.possessions || 'N/A'}</div></div>
                <div><strong>Abilities:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${character.abilities || 'N/A'}</div></div>
                <div><strong>Trivia:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${character.trivia || 'N/A'}</div></div>
                ${customFieldsHtml}
                <div class="flex gap-4 pt-4">
                    <button data-item-id="${character.id}" class="edit-item-btn fantasy-btn py-2 px-4 rounded-lg">Edit Character</button>
                    <button data-item-id="${character.id}" class="delete-item-btn fantasy-btn bg-red-800 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Delete Character</button>
                </div>
            </div>
        </div>
    </div>`; 
};

