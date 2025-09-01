/* ========================================
JavaScript (editorComponents.js)
========================================
This file contains all the HTML-generating functions (components) 
for the World Editor. It imports the actual component strings from other files.
*/
import { CharacterCardComponent, CharacterFormComponent, CharacterDetailComponent } from './characterComponents.js';
import { LocationCardComponent, LocationFormComponent, LocationDetailComponent } from './locationComponents.js';
import { OrganizationCardComponent, OrganizationFormComponent, OrganizationDetailComponent } from './organizationComponents.js';

export function renderEditorSidebar(world, state) {
    const navItems = [
        { key: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
        { key: 'world', icon: 'fa-globe', label: 'World' },
        { key: 'characters', icon: 'fa-users', label: 'Characters' },
        { key: 'locations', icon: 'fa-map-marker-alt', label: 'Locations' },
        { key: 'maps', icon: 'fa-map-marked-alt', label: 'Maps' },
        { key: 'organizations', icon: 'fa-sitemap', label: 'Organizations' },
        { key: 'families', icon: 'fa-users', label: 'Families' },
    ];
    return `<div class="w-full md:w-64 flex-shrink-0 fantasy-card rounded-lg p-4"><div class="mb-6 text-center"><img src="${world.imageUrl || `https://placehold.co/400x200/1a1a2e/d4af37?text=${world.name}`}" class="rounded-lg w-full h-auto mb-4"><h3 class="text-2xl">${world.name}</h3><p class="text-sm text-gray-400">Live on Database</p></div><nav class="flex flex-col space-y-2">${navItems.map(item => `<a href="#" data-view="${item.key}" class="editor-nav-link flex items-center p-2 rounded-lg hover:bg-yellow-400/10 ${state.editorSubView === item.key ? 'bg-yellow-400/20 text-yellow-400' : ''}"><i class="fas ${item.icon} w-6 text-center mr-3"></i><span>${item.label}</span></a>`).join('')}</nav></div>`;
}

export function renderEditorContent(world, state) {
    let content = '';
    const { editorSubView, editingItemId, viewingItemId } = state;

    const renderSection = (title, items, CardComponent, FormComponent, DetailComponent) => {
        if (editingItemId) {
            const itemToEdit = editingItemId === 'new' ? {} : (items || []).find(i => i.id === editingItemId);
            return FormComponent(itemToEdit, world);
        } else if (viewingItemId) {
            const itemToView = (items || []).find(i => i.id === viewingItemId);
            return DetailComponent(itemToView, world);
        } else {
            const safeItems = items || [];
            return `<div class="fantasy-card rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-3xl">${title}</h3>
                    <button id="create-btn" class="fantasy-btn py-2 px-4 rounded-lg"><i class="fas fa-plus mr-2"></i> Create</button>
                </div>
                <div>
                    ${safeItems.length > 0 ? `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">${safeItems.map(CardComponent).join('')}</div>` : `<p>No ${title.toLowerCase()} created yet.</p>`}
                </div>
            </div>`;
        }
    };

    switch(editorSubView) {
        case 'dashboard':
            content = `<div class="fantasy-card rounded-lg p-6"><h3 class="text-3xl mb-4">Welcome to ${world.name}!</h3><p>Select a category from the sidebar to begin building your world.</p></div>`;
            break;
        case 'characters':
            content = renderSection('Characters', world.characters, CharacterCardComponent, CharacterFormComponent, CharacterDetailComponent);
            break;
        case 'locations':
            content = renderSection('Locations', world.locations, LocationCardComponent, LocationFormComponent, LocationDetailComponent);
            break;
        case 'organizations':
            content = renderSection('Organizations', world.organizations, OrganizationCardComponent, OrganizationFormComponent, OrganizationDetailComponent);
            break;
        default:
            content = `<div class="fantasy-card rounded-lg p-6"><h3 class="text-3xl">Section: ${editorSubView}</h3><p>Content for this section is under construction.</p></div>`;
    }
    return `<div class="flex-grow">${content}</div>`;
};

