/* ========================================
JavaScript (raceComponents.js)
========================================
This file contains all the UI components for the Race Editor.
*/

export const RaceFormComponent = (race = {}) => {
    const isNew = !race.id;
    return `<div class="fantasy-card rounded-lg p-6">
        <h3 class="text-3xl mb-6">${isNew ? 'Create New Race' : `Edit ${race.name}`}</h3>
        <div class="space-y-4">
            <div><label for="race-name" class="block text-yellow-500 mb-1">Name</label><input type="text" id="race-name" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${race.name || ''}"></div>
            <div><label for="race-type" class="block text-yellow-500 mb-1">Type (e.g., Beast, Humanoid, Elemental)</label><input type="text" id="race-type" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${race.type || ''}"></div>
            <div><label class="block text-yellow-500 mb-1">Description</label><div id="editor-description" class="bg-gray-900/50 text-white">${race.description || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Abilities</label><div id="editor-abilities" class="bg-gray-900/50 text-white">${race.abilities || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Habitat</label><div id="editor-habitat" class="bg-gray-900/50 text-white">${race.habitat || ''}</div></div>
        </div>
        <div class="flex justify-end gap-4 mt-6">
            <button id="cancel-btn" class="fantasy-btn bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg">Cancel</button>
            <button id="save-race-btn" class="fantasy-btn py-2 px-4 rounded-lg">Save Race</button>
        </div>
    </div>`;
};

export const RaceCardComponent = (race) => `<div class="fantasy-card rounded-lg p-4 text-center flex flex-col"><div class="text-5xl mb-4 text-yellow-400/50"><i class="fas fa-dna"></i></div><div class="flex-grow"><a href="#" data-item-id="${race.id}" class="view-item-btn text-xl text-yellow-500 hover:underline">${race.name}</a><p class="text-sm italic text-gray-400">${race.type || 'N/A'}</p></div><div class="flex justify-center gap-2 mt-4"><button data-item-id="${race.id}" class="edit-item-btn fantasy-btn py-1 px-3 rounded-lg text-sm">Edit</button><button data-item-id="${race.id}" class="delete-item-btn fantasy-btn bg-red-800 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm">Delete</button></div></div>`;

export const RaceDetailComponent = (race) => {
    if (!race) return '<p>Race not found.</p>';
    return `<div class="fantasy-card rounded-lg p-6">
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-4xl text-yellow-400">${race.name}</h3>
            <button id="back-to-list-btn" class="fantasy-btn py-2 px-4 rounded-lg">Back to List</button>
        </div>
        <div class="space-y-4">
            <p><strong>Type:</strong> ${race.type || 'N/A'}</p>
            <div><strong>Description:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${race.description || 'N/A'}</div></div>
            <div><strong>Abilities:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${race.abilities || 'N/A'}</div></div>
            <div><strong>Habitat:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${race.habitat || 'N/A'}</div></div>
            <div class="flex gap-4 pt-4">
                <button data-item-id="${race.id}" class="edit-item-btn fantasy-btn py-2 px-4 rounded-lg">Edit Race</button>
                <button data-item-id="${race.id}" class="delete-item-btn fantasy-btn bg-red-800 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Delete Race</button>
            </div>
        </div>
    </div>`;
};

