/* ========================================
JavaScript (locationComponents.js)
========================================
This file contains all the UI components for the Location Editor.
*/

export const LocationFormComponent = (location = {}, world) => {
    const isNew = !location.id;
    const parentLocationOptions = (world.locations || [])
        .filter(loc => loc.id !== location.id) // Prevent a location from being its own parent
        .map(loc => `<option value="${loc.id}" ${location.parentLocation === loc.id ? 'selected' : ''}>${loc.name}</option>`)
        .join('');

    const existingCharPills = (location.keyCharacters || []).map(charName => `
        <span class="char-pill flex items-center gap-2 bg-blue-400/20 text-blue-300 text-sm font-medium px-2.5 py-1 rounded-full" data-char-name="${charName}">
            ${charName} <button type="button" class="remove-char-btn text-blue-400 hover:text-white">&times;</button>
        </span>
    `).join('');
    
    const existingOrgPills = (location.controllingOrgs || []).map(orgName => `
        <span class="org-pill flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-sm font-medium px-2.5 py-1 rounded-full" data-org-name="${orgName}">
            ${orgName} <button type="button" class="remove-org-btn text-yellow-400 hover:text-white">&times;</button>
        </span>
    `).join('');

    return `<div class="fantasy-card rounded-lg p-6">
        <h3 class="text-3xl mb-6">${isNew ? 'Create New Location' : `Edit ${location.name}`}</h3>
        <div class="space-y-4">
            <div><label class="block text-yellow-500 mb-1">Location Image</label><div id="loc-image-drop-zone" class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-yellow-400/30 border-dashed rounded-md cursor-pointer hover:border-yellow-400"><div class="space-y-1 text-center"><img id="loc-image-preview" src="${location.imageUrl || ''}" class="${location.imageUrl ? 'h-24 mx-auto mb-4 rounded' : 'hidden'}" alt="Image Preview"/><svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg><div class="flex text-sm text-gray-600"><label for="loc-image-upload" class="relative cursor-pointer bg-gray-900/50 rounded-md font-medium text-yellow-500 hover:text-yellow-400 focus-within:outline-none px-1"><span>Upload a file</span><input id="loc-image-upload" name="loc-image-upload" type="file" class="sr-only" accept="image/*"></label><p class="pl-1 text-gray-400">or drag and drop</p></div><p class="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p></div></div><input type="hidden" id="loc-image-url" value="${location.imageUrl || ''}"></div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label for="loc-name" class="block text-yellow-500 mb-1">Name</label><input type="text" id="loc-name" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${location.name || ''}"></div>
                <div><label for="loc-type" class="block text-yellow-500 mb-1">Type (e.g., City, Forest, Ruin)</label><input type="text" id="loc-type" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${location.type || ''}"></div>
                <div><label for="loc-gov" class="block text-yellow-500 mb-1">Government Type</label><input type="text" id="loc-gov" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${location.government || ''}"></div>
                <div><label for="loc-pop" class="block text-yellow-500 mb-1">Population</label><input type="text" id="loc-pop" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${location.population || ''}"></div>
            </div>

            <div>
                <label for="loc-parent" class="block text-yellow-500 mb-1">Parent Location</label>
                <select id="loc-parent" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2">
                    <option value="">None</option>
                    ${parentLocationOptions}
                </select>
            </div>

            <div><label class="block text-yellow-500 mb-1">Demographics</label><div id="editor-demographics" class="bg-gray-900/50 text-white">${location.demographics || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Economy & Resources</label><div id="editor-economy" class="bg-gray-900/50 text-white">${location.economy || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Culture & Society</label><div id="editor-culture" class="bg-gray-900/50 text-white">${location.culture || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Description</label><div id="editor-description" class="bg-gray-900/50 text-white">${location.description || ''}</div></div>

            <div>
                <label class="block text-yellow-500 mb-1">Key Characters</label>
                <div id="char-combobox-container" class="relative">
                    <input type="text" id="loc-char-search" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" placeholder="Search for a character...">
                    <div id="char-dropdown" class="absolute z-10 w-full mt-1 bg-[#121222] border border-yellow-400/30 rounded-md shadow-lg hidden"></div>
                </div>
                <div id="selected-chars-container" class="flex flex-wrap gap-2 mt-2">${existingCharPills}</div>
            </div>

            <div>
                <label class="block text-yellow-500 mb-1">Controlling Organizations</label>
                <div id="org-combobox-container" class="relative">
                    <input type="text" id="loc-org-search" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" placeholder="Search for an organization...">
                    <div id="loc-org-dropdown" class="absolute z-10 w-full mt-1 bg-[#121222] border border-yellow-400/30 rounded-md shadow-lg hidden"></div>
                </div>
                <div id="selected-loc-orgs-container" class="flex flex-wrap gap-2 mt-2">${existingOrgPills}</div>
            </div>
        </div>
        <div class="flex justify-end gap-4 mt-6">
            <button id="cancel-btn" class="fantasy-btn bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg">Cancel</button>
            <button id="save-location-btn" class="fantasy-btn py-2 px-4 rounded-lg">Save Location</button>
        </div>
    </div>`;
};

export const LocationCardComponent = (location) => `<div class="fantasy-card rounded-lg p-4 text-center flex flex-col"><img src="${location.imageUrl || 'https://placehold.co/150x150/1a1a2e/d4af37?text=?'}" alt="${location.name}" class="w-full h-40 rounded-md object-cover mb-4 cursor-pointer view-item-btn" data-item-id="${location.id}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/1a1a2e/d4af37?text=Error';"><div class="flex-grow"><a href="#" data-item-id="${location.id}" class="view-item-btn text-xl text-yellow-500 hover:underline">${location.name}</a><p class="text-sm italic text-gray-400">${location.type || 'N/A'}</p></div><div class="flex justify-center gap-2 mt-4"><button data-item-id="${location.id}" class="edit-item-btn fantasy-btn py-1 px-3 rounded-lg text-sm">Edit</button><button data-item-id="${location.id}" class="delete-item-btn fantasy-btn bg-red-800 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm">Delete</button></div></div>`;

export const LocationDetailComponent = (location, world) => {
    if (!location) return '<p>Location not found.</p>';
    const parentLocation = world.locations.find(l => l.id === location.parentLocation);
    const keyCharsList = (location.keyCharacters || []).join(', ');
    const controllingOrgsList = (location.controllingOrgs || []).join(', ');

    return `<div class="fantasy-card rounded-lg p-6">
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-4xl text-yellow-400">${location.name}</h3>
            <button id="back-to-list-btn" class="fantasy-btn py-2 px-4 rounded-lg">Back to List</button>
        </div>
        <div class="flex flex-col md:flex-row gap-6">
            <img src="${location.imageUrl || 'https://placehold.co/200x300/1a1a2e/d4af37?text=?'}" alt="${location.name}" class="w-full md:w-1/3 rounded-lg object-cover self-start">
            <div class="md:w-2/3 space-y-4">
                <p><strong>Type:</strong> ${location.type || 'N/A'}</p>
                <p><strong>Parent Location:</strong> ${parentLocation ? parentLocation.name : 'N/A'}</p>
                <p><strong>Government:</strong> ${location.government || 'N/A'}</p>
                <p><strong>Population:</strong> ${location.population || 'N/A'}</p>
                <p><strong>Key Characters:</strong> ${keyCharsList || 'N/A'}</p>
                <p><strong>Controlling Organizations:</strong> ${controllingOrgsList || 'N/A'}</p>
                
                <div><strong>Demographics:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${location.demographics || 'N/A'}</div></div>
                <div><strong>Economy & Resources:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${location.economy || 'N/A'}</div></div>
                <div><strong>Culture & Society:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${location.culture || 'N/A'}</div></div>
                <div><strong>Description:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${location.description || 'N/A'}</div></div>

                <div class="flex gap-4 pt-4">
                    <button data-item-id="${location.id}" class="edit-item-btn fantasy-btn py-2 px-4 rounded-lg">Edit Location</button>
                    <button data-item-id="${location.id}" class="delete-item-btn fantasy-btn bg-red-800 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Delete Location</button>
                </div>
            </div>
        </div>
    </div>`;
};
