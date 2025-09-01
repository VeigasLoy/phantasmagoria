/* ========================================
JavaScript (organizationComponents.js)
========================================
This file contains all the UI components for the Organization Editor.
*/

export const OrganizationFormComponent = (org = {}, world) => {
    const isNew = !org.id;
    const headquartersOptions = (world.locations || []).map(loc => `<option value="${loc.id}" ${org.headquarters === loc.id ? 'selected' : ''}>${loc.name}</option>`).join('');
    
    const existingMemberPills = (org.keyMembers || []).map(charName => `
        <span class="char-pill flex items-center gap-2 bg-blue-400/20 text-blue-300 text-sm font-medium px-2.5 py-1 rounded-full" data-char-name="${charName}">
            ${charName} <button type="button" class="remove-char-btn text-blue-400 hover:text-white">&times;</button>
        </span>
    `).join('');

    const existingAlliedPills = (org.alliedOrgs || []).map(orgName => `
        <span class="org-pill flex items-center gap-2 bg-green-400/20 text-green-300 text-sm font-medium px-2.5 py-1 rounded-full" data-org-name="${orgName}">
            ${orgName} <button type="button" class="remove-org-btn text-green-400 hover:text-white">&times;</button>
        </span>
    `).join('');

    const existingRivalPills = (org.rivalOrgs || []).map(orgName => `
        <span class="org-pill flex items-center gap-2 bg-red-400/20 text-red-300 text-sm font-medium px-2.5 py-1 rounded-full" data-org-name="${orgName}">
            ${orgName} <button type="button" class="remove-org-btn text-red-400 hover:text-white">&times;</button>
        </span>
    `).join('');

    return `<div class="fantasy-card rounded-lg p-6">
        <h3 class="text-3xl mb-6">${isNew ? 'Create New Organization' : `Edit ${org.name}`}</h3>
        <div class="space-y-4">
            <div><label class="block text-yellow-500 mb-1">Symbol/Insignia</label><div id="org-image-drop-zone" class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-yellow-400/30 border-dashed rounded-md cursor-pointer hover:border-yellow-400"><div class="space-y-1 text-center"><img id="org-image-preview" src="${org.imageUrl || ''}" class="${org.imageUrl ? 'h-24 mx-auto mb-4 rounded' : 'hidden'}" alt="Image Preview"/><svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg><div class="flex text-sm text-gray-600"><label for="org-image-upload" class="relative cursor-pointer bg-gray-900/50 rounded-md font-medium text-yellow-500 hover:text-yellow-400 focus-within:outline-none px-1"><span>Upload a file</span><input id="org-image-upload" name="org-image-upload" type="file" class="sr-only" accept="image/*"></label><p class="pl-1 text-gray-400">or drag and drop</p></div><p class="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p></div></div><input type="hidden" id="org-image-url" value="${org.imageUrl || ''}"></div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label for="org-name" class="block text-yellow-500 mb-1">Name</label><input type="text" id="org-name" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${org.name || ''}"></div>
                <div><label for="org-type" class="block text-yellow-500 mb-1">Type (e.g., Guild, Kingdom, Cult)</label><input type="text" id="org-type" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${org.type || ''}"></div>
            </div>

            <div><label for="org-demographics" class="block text-yellow-500 mb-1">Member Demographics</label><input type="text" id="org-demographics" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" value="${org.demographics || ''}"></div>

            <div><label for="org-hq" class="block text-yellow-500 mb-1">Headquarters</label><select id="org-hq" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2"><option value="">None</option>${headquartersOptions}</select></div>

            <div><label class="block text-yellow-500 mb-1">Public Agenda</label><div id="editor-public-agenda" class="bg-gray-900/50 text-white">${org.publicAgenda || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Secret Goals</label><div id="editor-secret-goals" class="bg-gray-900/50 text-white">${org.secretGoals || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">History & Founding</label><div id="editor-history" class="bg-gray-900/50 text-white">${org.history || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Ranks & Titles</label><div id="editor-ranks" class="bg-gray-900/50 text-white">${org.ranks || ''}</div></div>
            <div><label class="block text-yellow-500 mb-1">Membership Requirements</label><div id="editor-membership" class="bg-gray-900/50 text-white">${org.membership || ''}</div></div>

            <div>
                <label class="block text-yellow-500 mb-1">Leader & Key Members</label>
                <div id="org-member-combobox" class="relative">
                    <input type="text" id="org-member-search" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" placeholder="Search for a character...">
                    <div id="org-member-dropdown" class="absolute z-10 w-full mt-1 bg-[#121222] border border-yellow-400/30 rounded-md shadow-lg hidden"></div>
                </div>
                <div id="selected-members-container" class="flex flex-wrap gap-2 mt-2">${existingMemberPills}</div>
            </div>

            <div>
                <label class="block text-yellow-500 mb-1">Allied Organizations</label>
                <div id="org-allied-combobox" class="relative">
                    <input type="text" id="org-allied-search" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" placeholder="Search for an organization...">
                    <div id="org-allied-dropdown" class="absolute z-10 w-full mt-1 bg-[#121222] border border-yellow-400/30 rounded-md shadow-lg hidden"></div>
                </div>
                <div id="selected-allies-container" class="flex flex-wrap gap-2 mt-2">${existingAlliedPills}</div>
            </div>

            <div>
                <label class="block text-yellow-500 mb-1">Rival Organizations</label>
                <div id="org-rival-combobox" class="relative">
                    <input type="text" id="org-rival-search" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" placeholder="Search for an organization...">
                    <div id="org-rival-dropdown" class="absolute z-10 w-full mt-1 bg-[#121222] border border-yellow-400/30 rounded-md shadow-lg hidden"></div>
                </div>
                <div id="selected-rivals-container" class="flex flex-wrap gap-2 mt-2">${existingRivalPills}</div>
            </div>
        </div>
        <div class="flex justify-end gap-4 mt-6"><button id="cancel-btn" class="fantasy-btn bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg">Cancel</button><button id="save-organization-btn" class="fantasy-btn py-2 px-4 rounded-lg">Save Organization</button></div>
    </div>`;
};

export const OrganizationCardComponent = (org) => `<div class="fantasy-card rounded-lg p-4 text-center flex flex-col"><img src="${org.imageUrl || 'https://placehold.co/150x150/1a1a2e/d4af37?text=?'}" alt="${org.name} Insignia" class="w-full h-40 rounded-md object-contain mb-4 cursor-pointer view-item-btn" data-item-id="${org.id}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/1a1a2e/d4af37?text=Error';"><div class="flex-grow"><a href="#" data-item-id="${org.id}" class="view-item-btn text-xl text-yellow-500 hover:underline">${org.name}</a><p class="text-sm italic text-gray-400">${org.type || 'N/A'}</p></div><div class="flex justify-center gap-2 mt-4"><button data-item-id="${org.id}" class="edit-item-btn fantasy-btn py-1 px-3 rounded-lg text-sm">Edit</button><button data-item-id="${org.id}" class="delete-item-btn fantasy-btn bg-red-800 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm">Delete</button></div></div>`;

export const OrganizationDetailComponent = (org, world) => {
    if (!org) return '<p>Organization not found.</p>';
    const headquarters = world.locations.find(l => l.id === org.headquarters);
    const keyMembersList = (org.keyMembers || []).join(', ');
    const alliedOrgsList = (org.alliedOrgs || []).join(', ');
    const rivalOrgsList = (org.rivalOrgs || []).join(', ');

    return `<div class="fantasy-card rounded-lg p-6">
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-4xl text-yellow-400">${org.name}</h3>
            <button id="back-to-list-btn" class="fantasy-btn py-2 px-4 rounded-lg">Back to List</button>
        </div>
        <div class="flex flex-col md:flex-row gap-6">
            <img src="${org.imageUrl || 'https://placehold.co/200x300/1a1a2e/d4af37?text=?'}" alt="${org.name} Insignia" class="w-full md:w-1/3 rounded-lg object-contain self-start">
            <div class="md:w-2/3 space-y-4">
                <p><strong>Type:</strong> ${org.type || 'N/A'}</p>
                <p><strong>Headquarters:</strong> ${headquarters ? headquarters.name : 'N/A'}</p>
                <p><strong>Member Demographics:</strong> ${org.demographics || 'N/A'}</p>
                <p><strong>Key Members:</strong> ${keyMembersList || 'N/A'}</p>
                <p><strong>Allies:</strong> ${alliedOrgsList || 'N/A'}</p>
                <p><strong>Rivals:</strong> ${rivalOrgsList || 'N/A'}</p>

                <div><strong>Public Agenda:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${org.publicAgenda || 'N/A'}</div></div>
                <div><strong>Secret Goals:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${org.secretGoals || 'N/A'}</div></div>
                <div><strong>History:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${org.history || 'N/A'}</div></div>
                <div><strong>Ranks:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${org.ranks || 'N/A'}</div></div>
                <div><strong>Membership Requirements:</strong><div class="rich-text-content text-gray-300 whitespace-pre-wrap">${org.membership || 'N/A'}</div></div>

                <div class="flex gap-4 pt-4">
                    <button data-item-id="${org.id}" class="edit-item-btn fantasy-btn py-2 px-4 rounded-lg">Edit Organization</button>
                    <button data-item-id="${org.id}" class="delete-item-btn fantasy-btn bg-red-800 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Delete Organization</button>
                </div>
            </div>
        </div>
    </div>`;
};
