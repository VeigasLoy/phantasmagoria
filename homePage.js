/* ========================================
JavaScript (homePage.js)
========================================
This file contains all components for the main home page.
*/

const WorldCardComponent = (world) => `
<div class="fantasy-card p-6 rounded-lg flex flex-col">
    <h4 class="text-3xl mb-2 text-yellow-500">${world.name}</h4>
    <p class="italic text-gray-400 mb-4">"${world.tagline}"</p>
    <p class="flex-grow mb-6">${world.description}</p>
    <div class="flex justify-end items-center gap-x-2 mt-auto">
        <button data-world-id="${world.id}" class="edit-world-btn fantasy-btn py-2 px-4 rounded-lg">World Editor</button>
        <button data-world-id="${world.id}" class="view-wiki-btn fantasy-btn p-2 px-3 rounded-lg" title="View Campaign Wiki">
            <i class="fas fa-eye pointer-events-none"></i>
        </button>
    </div>
</div>`;

const CreateWorldCardComponent = () => `
<div id="create-world-btn" class="fantasy-card p-6 rounded-lg flex flex-col items-center justify-center text-center border-2 border-dashed border-yellow-400/50 hover:border-yellow-400 cursor-pointer">
    <i class="fas fa-plus-circle text-5xl text-yellow-400/50 mb-4"></i>
    <h4 class="text-3xl mb-2">Create New World</h4>
    <p class="text-gray-400">Begin a new saga.</p>
</div>`;

const HomePageComponent = (worlds) => `
<main id="home-view" class="container mx-auto p-8 pt-16">
    <section id="hero" class="text-center">
        <h2 class="text-5xl text-yellow-400">The Chronicler's Desk</h2>
        <p class="text-xl italic text-gray-400 mt-4 mb-12">A collection of worlds born from ink and imagination.</p>
    </section>
    <section id="worlds-gallery">
        <h3 class="text-4xl text-center mb-10">Your Worlds</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${worlds.map(WorldCardComponent).join('')}
            ${CreateWorldCardComponent()}
        </div>
    </section>
</main>`;

export function renderHomePage(worlds) {
    return HomePageComponent(worlds);
}
