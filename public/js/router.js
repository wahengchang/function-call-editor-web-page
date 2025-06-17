import FunctionCallEditor from './pages/FunctionCallEditor.js';

const routes = [
    { path: '/', component: FunctionCallEditor },
];

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
});
