/* ========================================
JavaScript (campaignWiki.js)
========================================
This file contains all the components and logic for the public-facing
Campaign Wiki view. It's designed to display the data created in the World Editor.
*/

// --- WIKI LOGIC ---

function updateActiveLink() {
    // This function is only active when the wiki view is visible
    const navLinks = document.querySelectorAll('#sub-view-nav .nav-link, #mobile-menu .nav-link');
    const sections = document.querySelectorAll(`#campaign-view section`);
    let currentSection = '';
    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) link.classList.add('active');
    });
}

// --- WIKI COMPONENTS ---

const WikiCharacterCard = (character) => `
    <div class="fantasy-card rounded-lg p-4 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/20">
        <img src="${character.imageUrl || 'https://placehold.co/150x150/1a1a2e/d4af37?text=?'}" alt="${character.name}" class="w-full h-48 rounded-md object-cover mb-4" onerror="this.onerror=null;this.src='https://placehold.co/150x150/1a1a2e/d4af37?text=Error';">
        <h3 class="text-2xl text-yellow-500">${character.name}</h3>
    </div>
`;

const WikiLocationCard = (location) => `
    <div class="fantasy-card rounded-lg p-6">
        <h3 class="text-3xl mb-2">${location.name}</h3>
        <p class="text-yellow-500 mb-4">${location.type || 'N/A'}</p>
        <div class="rich-text-content text-gray-300">${location.description || 'No description available.'}</div>
    </div>
`;

const WikiOrganizationCard = (organization) => `
    <div class="fantasy-card rounded-lg p-6">
        <h3 class="text-3xl mb-2">${organization.name}</h3>
        <p class="text-yellow-500 mb-4">${organization.type || 'N/A'}</p>
        <div class="rich-text-content text-gray-300">${organization.goals || 'No goals defined.'}</div>
    </div>
`;


// --- EXPORTED FUNCTIONS ---

export function renderCampaignWiki(world) {
    if (!world) return `<main class="container mx-auto p-8 pt-16"><h2 class="text-3xl text-center text-red-500">Error: World not found.</h2></main>`;
    
    // Ensure arrays exist to prevent errors
    const characters = world.characters || [];
    const locations = world.locations || [];
    const organizations = world.organizations || [];

    return `
    <main id="campaign-view" class="container mx-auto p-8 pt-16">
        <section id="overview" class="min-h-screen">
            <h2 class="text-5xl text-center mb-4 text-yellow-400">${world.name}</h2>
            <p class="text-xl text-center italic text-gray-400 mb-12">"${world.tagline}"</p>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="fantasy-card p-6 rounded-lg"><h3 class="text-2xl mb-3 text-yellow-500"><i class="fas fa-globe-europe mr-2"></i> Core Concept</h3><p class="text-gray-300">${world.overview.concept}</p></div>
                <div class="fantasy-card p-6 rounded-lg"><h3 class="text-2xl mb-3 text-yellow-500"><i class="fas fa-book-open mr-2"></i> Brief History</h3><p class="text-gray-300">${world.overview.history}</p></div>
                <div class="fantasy-card p-6 rounded-lg"><h3 class="text-2xl mb-3 text-yellow-500"><i class="fas fa-mountain mr-2"></i> Geography</h3><p class="text-gray-300">${world.overview.geography}</p></div>
            </div>
        </section>
        <div class="section-divider"></div>
        
        <section id="characters" class="min-h-screen pt-16">
            <h2 class="text-5xl text-center mb-12 text-yellow-400">Key Characters</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                ${characters.length > 0 ? characters.map(WikiCharacterCard).join('') : '<p class="text-center col-span-full">No characters to display.</p>'}
            </div>
        </section>
        <div class="section-divider"></div>

        <section id="locations" class="min-h-screen pt-16">
            <h2 class="text-5xl text-center mb-12 text-yellow-400">Locations</h2>
            <div class="grid md:grid-cols-2 gap-8">
                ${locations.length > 0 ? locations.map(WikiLocationCard).join('') : '<p class="text-center col-span-full">No locations to display.</p>'}
            </div>
        </section>
        <div class="section-divider"></div>

        <section id="organizations" class="min-h-screen pt-16">
            <h2 class="text-5xl text-center mb-12 text-yellow-400">Organizations</h2>
            <div class="grid md:grid-cols-2 gap-8">
                ${organizations.length > 0 ? organizations.map(WikiOrganizationCard).join('') : '<p class="text-center col-span-full">No organizations to display.</p>'}
            </div>
        </section>
    </main>
    `;
}

export function attachWikiEventListeners() {
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
}

export function removeWikiEventListeners() {
    window.removeEventListener('scroll', updateActiveLink);
}
