import { router } from './router.js';
import Navbar from './pages/Navbar.js';
import ProjectInfo from './pages/ProjectInfo.js';

const app = Vue.createApp({
    template: `
        <div class="min-h-screen bg-gray-900">
            <Navbar />
            <ProjectInfo />
            <div class="pt-8">
                <router-view></router-view>
            </div>
        </div>
    `
});

app.use(router);
app.component('Navbar', Navbar);
app.component('ProjectInfo', ProjectInfo);
app.mount('#app');
