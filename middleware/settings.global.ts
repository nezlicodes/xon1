// middleware/settings.global.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
        const { settings, fetchSettings } = useSettings()
        const config = useRuntimeConfig();
        const user = config.public.user;
        if (!user) {
            // set default values
            document.documentElement.style.setProperty('--primary-color', '31, 41, 55'); // slate-800
            document.documentElement.style.setProperty('--secondary-color', '255, 255, 255'); // white
            document.documentElement.style.setProperty('--primary-contrast-color', '255,255,255'); // black
            document.documentElement.style.setProperty('--secondary-contrast-color', '0, 0, 0'); // black
            document.documentElement.style.setProperty('--body-bg', '255, 255, 255'); // white
            document.documentElement.style.setProperty('--text-color', '31, 41, 55'); // slate-800
            return;
        }
        if (!settings.value) {
            await fetchSettings()
        }
        if (settings.value) {

            // Helper function to parse RGB values
            const parseRGB = (colorValue, defaultValue) => {
                if (!colorValue) return defaultValue;

                // For values that are already in RGB format like "rgb(31,41,55)"
                const rgbMatch = /rgb\((\d+),(\d+),(\d+)\)/.exec(colorValue);
                if (rgbMatch) {
                    return `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
                }

                // For values that are in hex format like "#1f2937"
                if (colorValue.startsWith('#')) {
                    const r = parseInt(colorValue.slice(1, 3), 16);
                    const g = parseInt(colorValue.slice(3, 5), 16);
                    const b = parseInt(colorValue.slice(5, 7), 16);
                    return `${r}, ${g}, ${b}`;
                }

                // If already in "r, g, b" format
                if (colorValue.includes(',')) {
                    return colorValue;
                }

                return defaultValue;
            }

            // Set default values in RGB format
            const defaultWhite = '255, 255, 255';
            const defaultBlack = '0, 0, 0';
            const defaultPrimaryColor = '31, 41, 55'; // Tailwind's slate-800
            const defaultTextColor = '31, 41, 55'; // Tailwind's slate-800
            document.documentElement.style.setProperty('--primary-color',
                parseRGB(settings.value.primary_color, defaultPrimaryColor));

            document.documentElement.style.setProperty('--secondary-color',
                parseRGB(settings.value.secondary_color, defaultWhite));

            document.documentElement.style.setProperty('--primary-contrast-color',
                parseRGB(settings.value.primary_contrast_color, defaultBlack));

            document.documentElement.style.setProperty('--secondary-contrast-color',
                parseRGB(settings.value.secondary_contrast_color, defaultBlack));

            document.documentElement.style.setProperty('--body-bg',
                parseRGB(settings.value.body_bg, defaultWhite));

            document.documentElement.style.setProperty('--text-color',
                parseRGB(settings.value.text_color, defaultTextColor));
        }
    }
})