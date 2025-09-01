/* ========================================
JavaScript (app.js)
========================================
This file is the main controller. It initializes Firebase, handles state, 
renders the home page, and delegates to other modules.
*/
import { renderWorldEditor, attachEditorEventListeners } from './worldEditor.js';
import { renderCampaignWiki, attachWikiEventListeners, removeWikiEventListeners } from './campaignWiki.js';
import { renderLoginPage } from './loginPage.js';
import { renderHomePage } from './homePage.js';
import { db, auth, handleGoogleSignIn, handleEmailSignIn, handleEmailSignUp, handleSignOut } from './firebase.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged, getRedirectResult } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- STATE MANAGEMENT ---
let state = {
    currentView: 'loading', // loading, login, home, editor, campaign
    worlds: [],
    selectedWorldId: null,
    editorSubView: 'dashboard',
    user: null,
    db: db,
    auth: auth
};

function setState(newState) {
    state = { ...state, ...newState };
    render();
}

// --- CORE & HOME PAGE COMPONENTS ---

const HeaderComponent = () => {
    const isSubView = state.currentView === 'editor' || state.currentView === 'campaign';
    let navContent = '';

    if (state.user) {
        const subViewNav = `<nav id="sub-view-nav" class="hidden md:flex space-x-8 text-lg">${state.currentView === 'editor' ? '' : `<a href="#overview" class="nav-link active">Overview</a><a href="#factions" class="nav-link">Factions</a><a href="#characters" class="nav-link">Characters</a><a href="#magic" class="nav-link">Magic</a><a href="#bestiary" class="nav-link">Bestiary</a>`}</nav><button id="back-to-worlds" class="fantasy-btn py-2 px-4 rounded-lg"><i class="fas fa-arrow-left mr-2"></i> All Worlds</button>`;
        const homeNav = `<div class="flex items-center gap-4"><span class="text-gray-300">Welcome, ${state.user.displayName || state.user.email}</span><button id="sign-out-btn" class="fantasy-btn bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg">Sign Out</button></div>`;
        navContent = isSubView ? subViewNav : homeNav;
    }

    return `<header class="sticky top-0 z-50 py-4 px-8 fantasy-card"><div class="container mx-auto flex justify-between items-center"><h1 class="text-3xl text-white tracking-wider"><i class="fas fa-scroll text-yellow-400"></i> Phantasmagoria</h1>${navContent}<button id="mobile-menu-button" class="md:hidden text-2xl"><i class="fas fa-bars"></i></button></div><div id="mobile-menu" class="hidden md-hidden mt-4"></div></header>`;
};

const FooterComponent = () => `<footer class="text-center py-8 mt-16 border-t border-yellow-400/20"><p class="text-gray-400">Crafted in the halls of imagination.</p><p class="text-sm text-gray-500">Phantasmagoria &copy; 2024</p></footer>`;
const LoadingComponent = () => `<main class="container mx-auto p-8 pt-16 flex justify-center items-center min-h-screen"><div class="text-center"><i class="fas fa-spinner fa-spin text-5xl text-yellow-400"></i><p class="mt-4 text-xl">Loading...</p></div></main>`;

// --- FIREBASE & DATA LOGIC ---

async function fetchWorldsData() {
    if (!state.db || !state.user) return [];
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'phantasmagoria-57bde';
    const worldsCol = collection(state.db, 'artifacts', appId, 'users', state.user.uid, 'worlds');
    try {
        const worldSnapshot = await getDocs(worldsCol);
        return worldSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error fetching worlds:", e);
        return [];
    }
}

async function handleCreateNewWorld() {
    const name = prompt("Enter the name of your new world:");
    if (!name || name.trim() === "") return;
    const tagline = prompt(`Enter a tagline for ${name}:`, "A world of mystery and adventure.");
    const description = prompt(`Enter a brief description for ${name}:`, "A new world waiting to be explored.");

    const newWorld = {
        name, tagline: tagline || "", description: description || "",
        overview: { concept: "", history: "", geography: "" },
        characters: [], locations: [], maps: [], organizations: [],
        families: [], creatures: [], races: [],
        magic: { name: "", description: "", sources: "", limitations: "" },
        bestiary: []
    };

    try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'phantasmagoria-57bde';
        const worldsCol = collection(state.db, 'artifacts', appId, 'users', state.user.uid, 'worlds');
        await addDoc(worldsCol, newWorld);
        const worldList = await fetchWorldsData();
        setState({ worlds: worldList });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// --- RENDER & EVENT HANDLING ---
const rootElement = document.getElementById('app-root');

function attachEventListeners() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) mobileMenuButton.addEventListener('click', () => document.getElementById('mobile-menu').classList.toggle('hidden'));

    if (state.currentView === 'login') {
        document.getElementById('google-signin-btn')?.addEventListener('click', handleGoogleSignIn);
        document.getElementById('email-signin-btn')?.addEventListener('click', handleEmailSignIn);
        document.getElementById('email-signup-btn')?.addEventListener('click', handleEmailSignUp);
    } else if (state.currentView === 'home') {
        document.querySelectorAll('.edit-world-btn').forEach(btn => btn.addEventListener('click', (e) => setState({ currentView: 'editor', selectedWorldId: e.target.dataset.worldId, editorSubView: 'dashboard' })));
        document.querySelectorAll('.view-wiki-btn').forEach(btn => btn.addEventListener('click', (e) => setState({ currentView: 'campaign', selectedWorldId: e.target.dataset.worldId })));
        document.getElementById('create-world-btn')?.addEventListener('click', handleCreateNewWorld);
        document.getElementById('sign-out-btn')?.addEventListener('click', handleSignOut);
    } else {
        document.getElementById('back-to-worlds')?.addEventListener('click', () => setState({ currentView: 'home' }));
        document.getElementById('sign-out-btn')?.addEventListener('click', handleSignOut);
        
        if (state.currentView === 'editor') attachEditorEventListeners(state);
        if (state.currentView === 'campaign') attachWikiEventListeners();
    }
}

function updateMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;
    mobileMenu.innerHTML = `<a href="#" id="mobile-sign-out" class="block py-2 px-4 text-lg nav-link">Sign Out</a>`;
    document.getElementById('mobile-sign-out')?.addEventListener('click', handleSignOut);
}

function render() {
    const selectedWorld = (state.currentView === 'editor' || state.currentView === 'campaign') 
        ? state.worlds.find(w => w.id === state.selectedWorldId) 
        : null;
    
    let html = '';
    removeWikiEventListeners();

    switch(state.currentView) {
        case 'loading':
            html += LoadingComponent();
            break;
        case 'login':
            html += renderLoginPage();
            break;
        case 'editor':
            html += HeaderComponent();
            html += renderWorldEditor(selectedWorld, state);
            html += FooterComponent();
            break;
        case 'campaign':
            html += HeaderComponent();
            html += renderCampaignWiki(selectedWorld);
            html += FooterComponent();
            break;
        case 'home':
        default:
            html += HeaderComponent();
            html += renderHomePage(state.worlds);
            html += FooterComponent();
            break;
    }
    
    rootElement.innerHTML = html;
    
    attachEventListeners();
    if (state.user) {
        updateMobileMenu();
    }
}

// --- INITIALIZE APP ---
window.addEventListener('load', async () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            setState({ user: user, currentView: 'loading' });
            const worldList = await fetchWorldsData();
            setState({ worlds: worldList, currentView: 'home' });
        } else {
            setState({ user: null, worlds: [], currentView: 'login' });
        }
    });

    getRedirectResult(auth).catch((error) => {
        console.error("Auth Redirect Error:", error);
    });
});

window.addEventListener('stateChange', async (e) => {
    if (e.detail.triggerFetch) {
        const worldList = await fetchWorldsData();
        setState({ worlds: worldList, editingItemId: null, viewingItemId: null });
    } else {
        setState(e.detail);
    }
});
