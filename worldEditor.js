/* ========================================
JavaScript (worldEditor.js)
========================================
This is the main entry point for the World Editor. It imports components
and logic, and handles the main rendering and event listener setup.
*/
import { renderEditorSidebar, renderEditorContent } from './editorComponents.js';
import { attachGeneralEventListeners, attachFormEventListeners } from './editorLogic.js';

// --- EXPORTED FUNCTIONS ---

export function renderWorldEditor(world, state) {
    if (!world) return `<main class="container mx-auto p-8 pt-16"><h2 class="text-3xl text-center text-red-500">Error: World not found.</h2></main>`;
    
    // The main layout is assembled here
    return `
    <main id="editor-view" class="container mx-auto p-4 md:p-8 pt-16">
        <div class="flex flex-col md:flex-row gap-8">
            ${renderEditorSidebar(world, state)}
            ${renderEditorContent(world, state)}
        </div>
    </main>
    `;
}

export function attachEditorEventListeners(state) {
    // Attach event listeners for navigation and list views
    attachGeneralEventListeners(state);
    
    // Attach event listeners specifically for any forms that are currently rendered
    if (state.editingItemId) {
        attachFormEventListeners(state);
    }
}
