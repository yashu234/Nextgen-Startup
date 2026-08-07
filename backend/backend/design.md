# Design & Theming (Context for Backend)

*Note: As the backend team (Member 2), you do not build the UI. However, understanding the frontend design system ensures the data structures you return map correctly to the expected user experience.*

## Visual Identity
- **Theme**: Modern, sleek, dark-mode prioritized (vibrant colors, glassmorphism).
- **Typography**: Clean, modern sans-serif fonts (e.g., Inter or Roboto).
- **Icons**: Lucide React.
- **Charting**: Recharts (expects well-structured array data for financials).

## Data Structure Implications for Design
When returning generated data (e.g., Branding Guidelines), the backend must return exact strings or HEX codes that the frontend expects. 

For example, a branding payload from the backend should look like:
```json
{
  "branding": {
    "name": "EcoTech",
    "tagline": "Sustaining the future.",
    "colors": {
      "primary": "#10B981",
      "secondary": "#3B82F6",
      "accent": "#F59E0B"
    }
  }
}
```
If the backend alters this structure, the frontend UI components will break. Always adhere to the established JSON contracts.
