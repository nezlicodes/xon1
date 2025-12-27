export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()

 
    // Check if the route is public or a product page
    if ( !user.value) {
        return navigateTo('/')
    }
})