# HR Cost Calculator - Hospitality Industry

A comprehensive web-based HR cost calculator designed specifically for hospitality businesses, based on Indonesian labor market data and regulations.

## Features

### 📊 **Interactive Visualizations**
- Department cost breakdown (pie chart)
- Monthly vs annual cost comparison (bar chart)
- Staff distribution by department (donut chart)
- Cost per employee analysis (horizontal bar chart)

### 💰 **Comprehensive Cost Calculation**
- Base salary calculations
- BPJS contributions (all components)
- THR (13th month salary)
- Overtime buffer
- Real-time IDR to EUR conversion

### 🏨 **Hospitality-Focused**
- Pre-configured with 19 common hospitality roles
- Organized by departments (Kitchen, Dining, Reception, etc.)
- Salary bands based on Indonesian market data
- Guest capacity and per-guest cost analysis

### 🔧 **Fully Customizable**
- Edit all staff roles and salaries
- Adjust BPJS contribution rates
- Modify exchange rates and facility parameters
- Quick preset buttons for different facility sizes
- Add/remove roles as needed

### 📈 **Professional Output**
- Export results to CSV
- Print-friendly layouts
- Department-wise summaries
- Cost per guest calculations

## Quick Start

### Method 1: GitHub Pages (Recommended)
1. Create a new repository on GitHub
2. Upload these three files:
   - `index.html`
   - `style.css`  
   - `app.js`
3. Go to Settings → Pages
4. Select "Deploy from a branch" → main branch
5. Your calculator will be live at: `https://yourusername.github.io/repository-name`

### Method 2: Direct Use
1. Download all three files to a folder
2. Double-click `index.html` to open in your browser
3. All functionality will work locally

### Method 3: Web Hosting
Upload all three files to any web hosting service (Netlify, Vercel, etc.)

## File Structure
```
hr-cost-calculator/
├── index.html          # Main application page
├── style.css           # Styling and responsive design
├── app.js             # All functionality and calculations
└── README.md          # This documentation
```

## Usage Guide

### 1. **Grand Totals Overview**
- View total staff count and costs at the top
- See monthly and annual totals in both IDR and EUR
- Monitor cost per guest metrics

### 2. **Interactive Charts**
- All charts update automatically when you change parameters
- Hover over chart elements for detailed information
- Visual representation of cost distribution and efficiency

### 3. **Department Summary**
- Organized breakdown by department
- Staff count and costs per department
- Average cost per employee analysis

### 4. **Staff Roles Management**
- Edit role names, departments, and staff counts
- Adjust salaries for each position
- Add new roles or remove existing ones
- All calculations update in real-time

### 5. **Configuration Settings**
- **Exchange Rate**: Adjust IDR to EUR conversion
- **Facility Size**: Set number of guests for per-guest calculations
- **BPJS Rates**: Customize all Indonesian social security contributions
- **THR & Overtime**: Adjust additional cost factors
- **Quick Presets**: Buttons for 30, 60, or 100-guest facilities

### 6. **Export & Reset**
- Export all data to CSV format
- Reset to original default values
- Data persists during browser session

## Default Data

The calculator comes pre-loaded with:
- **39 staff positions** across 6 departments
- **Indonesian salary benchmarks** for Sumba/NTT region
- **Legal BPJS rates** (10.89% total employer contribution)
- **1 month THR** and 1.5% overtime buffer
- **Exchange rate**: 1 EUR = 19,000 IDR

## Technical Details

### Dependencies
- **Chart.js**: For interactive visualizations (loaded via CDN)
- **Modern browser**: Chrome, Firefox, Safari, Edge (ES6+ support)

### Calculations
- **Monthly Cost** = Base Salary × (1 + Total BPJS Rate) × Staff Count
- **Annual Cost** = (Monthly Cost × 12 + THR) × (1 + Overtime Buffer)
- **THR Amount** = Base Salary × THR Months × Staff Count
- **BPJS Total** = Kesehatan (4%) + JHT (3.7%) + JP (2%) + JKM (0.3%) + JKK (0.89%)

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (responsive design)

## Customization

### Adding New Departments
Edit the `departments` array in `app.js`:
```javascript
departments: [
  "Kitchen & Restaurant",
  "Your New Department",
  // ... other departments
]
```

### Changing Department Colors
Modify the `departmentColors` object in `app.js`:
```javascript
departmentColors: {
  "Kitchen & Restaurant": "#FF6B6B",
  "Your New Department": "#YOUR_COLOR",
  // ... other departments
}
```

### Default Roles
Add or modify roles in the `defaultData.roles` array in `app.js`.

## Legal Compliance

This calculator includes all mandatory Indonesian employment costs:
- ✅ BPJS Kesehatan (Health Insurance)
- ✅ BPJS Ketenagakerjaan (Employment Insurance)
  - JHT (Old Age Savings)
  - JP (Pension)
  - JKM (Death Insurance)
  - JKK (Work Accident Insurance)
- ✅ THR (Religious Holiday Allowance)
- ✅ Overtime regulations buffer

**Note**: Always verify current rates and regulations with local authorities as laws may change.

## Support

For questions or customizations, the calculator is fully self-contained with no external dependencies except Chart.js for visualizations.

## License

Open source - feel free to modify and distribute as needed.

---

**Created for Indonesian hospitality industry HR planning and budgeting.**