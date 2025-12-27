export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()

    // List of public routes that don't require authentication
    const protectedRoutes = [
        'admin-website',
        'admin-website-settings',
        'admin-website-policies',
        'admin-website-edit',
        'admin-categories',
        'admin-collections',
        'admin-products',
        'admin-products-edit',
        'admin-products-create',
        'admin',
        'admin-FAQ',
        'admin-testimonials',
        "admin-gallery"
    ]

    // Check if the route is public or a product page
    if (protectedRoutes.includes(to.name) && !user.value) {
        return navigateTo('/')
    }

    if(user.value && to.name == 'Login') {
        return navigateTo('/admin')
    }
    if(user.value && to.name == 'Register') {
        return navigateTo('/admin')
    }
})