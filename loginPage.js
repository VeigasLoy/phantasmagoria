/* ========================================
JavaScript (loginPage.js)
========================================
This file contains the component for the login screen.
*/

const LoginComponent = () => `
<main class="min-h-screen flex items-center justify-center">
    <div class="fantasy-card p-10 rounded-lg text-center w-full max-w-md">
        <h1 class="text-4xl text-white tracking-wider mb-4"><i class="fas fa-scroll text-yellow-400"></i> Phantasmagoria</h1>
        <p class="text-gray-400 mb-8">Your personal worldbuilding hub.</p>
        
        <div id="auth-error" class="text-red-400 mb-4 h-6"></div>

        <form id="email-signin-form" class="space-y-4 text-left">
            <div>
                <label for="email-input" class="block text-yellow-500 mb-1">Email</label>
                <input type="email" id="email-input" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" required>
            </div>
            <div>
                <label for="password-input" class="block text-yellow-500 mb-1">Password</label>
                <input type="password" id="password-input" class="w-full bg-gray-900/50 border border-yellow-400/30 rounded p-2" required>
            </div>
            <div class="flex gap-4 pt-2">
                <button type="button" id="email-signin-btn" class="flex-1 fantasy-btn py-2 px-4 rounded-lg">Sign In</button>
                <button type="button" id="email-signup-btn" class="flex-1 fantasy-btn bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg">Sign Up</button>
            </div>
        </form>

        <div class="my-6 flex items-center">
            <div class="flex-grow border-t border-yellow-400/20"></div>
            <span class="flex-shrink mx-4 text-gray-400">or</span>
            <div class="flex-grow border-t border-yellow-400/20"></div>
        </div>

        <button id="google-signin-btn" class="w-full fantasy-btn py-3 px-6 rounded-lg text-lg inline-flex items-center justify-center">
            <i class="fab fa-google mr-3"></i>Continue with Google
        </button>
    </div>
</main>`;

export function renderLoginPage() {
    return LoginComponent();
}
