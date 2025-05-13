// app/_data/Prompt.jsx
export const LOGO_PROMPT = `Professional Logo Design for "{logoTitle}":
    Core Concept:
    - Business/Brand Name: {logoTitle}
    - Core Description: {logoDesc}
    
    Design Specifications:
    - Style: {logoDesign}
    - Color Palette: {logoColor}
    - Specific Design Guidelines: {logoPrompt}
    - Conceptual Approach: {logoIdea}

    Logo Creation Requirements:
    - Create a clean, modern, and distinctive logo
    - Ensure professional and polished appearance
    - Design should be versatile for multiple use cases
    - Use high-contrast, memorable color scheme
    - Avoid complex or cluttered designs
    - Make logo readable and recognizable at different sizes
    - No text overlays or watermarks
    - Output a clean logo without background elements
    - Aim for a timeless and adaptable visual identity`;

export const FALLBACK_LOGO_PROMPT = `Create a professional, versatile logo design:
    - Use a clean, modern design approach
    - Select an appropriate, eye-catching color palette
    - Ensure high-quality, distinctive branding
    - Create a memorable and adaptable visual identity
    - Focus on simplicity and clarity
    - Design should work well at different sizes
    - Avoid complex patterns and tiny details
    - Output a clean logo without background elements`;

// Helper function to create a full prompt from form data
export const createLogoPrompt = (formData) => {
    if (!formData || !formData.title) {
        return FALLBACK_LOGO_PROMPT;
    }
    
    try {
        return LOGO_PROMPT
            .replace('{logoTitle}', formData.title || 'Brand')
            .replace('{logoDesc}', formData.desc || 'Professional logo')
            .replace('{logoColor}', formData.palette || 'Vibrant colors')
            .replace('{logoDesign}', formData.design?.title || 'Modern design')
            .replace('{logoPrompt}', formData.design?.prompt || '')
            .replace('{logoIdea}', formData.idea || 'Professional look');
    } catch (error) {
        console.error('Error creating logo prompt:', error);
        return FALLBACK_LOGO_PROMPT;
    }
};