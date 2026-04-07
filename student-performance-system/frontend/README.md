# Student Performance Frontend

A modern React-based web application for the Student Performance AI System. Features a comprehensive dashboard for student performance prediction, user management, and administrative controls with role-based access.

## 🎨 Features

- **AI Performance Prediction** - Real-time student score prediction using machine learning
- **User Authentication** - JWT-based login and registration system
- **Role-Based Access Control** - Different permissions for users, students, faculty, and admins
- **Student Management** - CRUD operations for student records
- **Prediction History** - Track and review past predictions
- **Interactive Dashboard** - Comprehensive analytics and insights
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - Live prediction results and data synchronization

## 🛠️ Technology Stack

- **Framework**: React 18.2.0
- **Routing**: React Router DOM 7.14.0
- **HTTP Client**: Axios 1.14.0
- **Build Tool**: Create React App (React Scripts 5.0.1)
- **Styling**: CSS Modules (built-in)
- **State Management**: React Context API
- **Testing**: Jest + React Testing Library
- **Deployment**: Docker + Nginx

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML template
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components (Alert, Spinner, etc.)
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components (AppLayout, etc.)
│   │   ├── routes/         # Route protection components
│   │   ├── AdminPanel.js   # Admin dashboard
│   │   ├── Dashboard.js    # Main dashboard
│   │   ├── FacultyPanel.js # Faculty interface
│   │   ├── Login.js        # Login form
│   │   ├── Predictor.js    # AI prediction interface
│   │   ├── Register.js     # Registration form
│   │   └── StudentPanel.js # Student interface
│   ├── context/            # React Context providers
│   │   └── AuthContext.js  # Authentication context
│   ├── pages/              # Page components
│   │   ├── AuthPage.js     # Authentication page
│   │   ├── PredictionHistoryPage.js # History page
│   │   ├── StudentFormPage.js      # Student form page
│   │   └── StudentsPage.js         # Students list page
│   ├── services/           # API service layer
│   │   ├── apiClient.js    # Axios configuration
│   │   ├── authService.js  # Authentication API
│   │   ├── performanceService.js   # Performance data API
│   │   ├── predictionService.js    # Prediction API
│   │   └── studentService.js       # Student management API
│   ├── utils/              # Utility functions
│   │   ├── roles.js        # Role management utilities
│   │   └── studentFields.js # Form configurations
│   ├── App.js              # Main application component
│   ├── App.css             # Global styles
│   ├── index.js            # Application entry point
│   └── index.css           # Base styles
├── Dockerfile              # Docker container config
├── nginx.conf              # Nginx configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Backend API running (see backend README)

### Local Development Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create `.env.local` file in the frontend directory:
   ```env
   # API Configuration
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_AI_URL=http://localhost:8000

   # Optional: Enable development features
   REACT_APP_DEBUG=true
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# Serve locally (for testing production build)
npx serve -s build
```

## 🐳 Docker Setup

### Build and Run

```bash
# Build the image
docker build -t student-performance-frontend .

# Run the container
docker run -p 3000:3000 student-performance-frontend
```

### Docker Compose (Full Stack)

For the complete application:

```bash
# From project root
docker compose up --build frontend
```

## 🎯 Application Features

### User Roles & Permissions

- **User**: Basic access to prediction features
- **Student**: Access to personal performance data
- **Faculty**: Teaching staff with student management permissions
- **Admin**: Full system access including user management

### Core Functionality

#### 1. Authentication System
- User registration and login
- JWT token management
- Automatic session restoration
- Secure logout functionality

#### 2. AI Prediction Interface
- Real-time score prediction
- Interactive form with validation
- Weighted scoring calculation
- Prediction history tracking
- Pass/fail classification

#### 3. Student Management (Admin/Faculty)
- View all students
- Add new students
- Edit student information
- CSV data import
- Student performance analytics

#### 4. Dashboard & Analytics
- Performance statistics
- Prediction trends
- User activity metrics
- Role-based content display

#### 5. Prediction History
- View past predictions
- Filter and search functionality
- Export capabilities
- Performance insights

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Eject from Create React App (irreversible)
npm run eject
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000` |
| `REACT_APP_AI_URL` | AI Service URL | `http://localhost:8000` |
| `REACT_APP_DEBUG` | Enable debug features | `false` |

### Code Organization

#### Components
- **Common Components**: Reusable UI elements (Alert, Spinner, StatCard)
- **Form Components**: Specialized form inputs and validation
- **Layout Components**: Page structure and navigation
- **Route Components**: Authentication and role-based routing

#### Services
- **API Client**: Centralized HTTP configuration with interceptors
- **Auth Service**: Authentication and user management
- **Prediction Service**: AI prediction API integration
- **Student Service**: Student data management
- **Performance Service**: Academic performance data

#### Context
- **AuthContext**: Global authentication state management
- **Token Persistence**: Local storage integration
- **Auto-login**: Session restoration on app reload

### Adding New Features

1. **New Component:**
   ```jsx
   // src/components/NewFeature.js
   import React from 'react';

   const NewFeature = () => {
     return (
       <div className="new-feature">
         <h2>New Feature</h2>
         {/* Component logic */}
       </div>
     );
   };

   export default NewFeature;
   ```

2. **New API Service:**
   ```javascript
   // src/services/newService.js
   import apiClient from './apiClient';

   const newService = {
     getData: () => apiClient.get('/new-endpoint'),
     createData: (data) => apiClient.post('/new-endpoint', data),
   };

   export default newService;
   ```

3. **New Route:**
   ```jsx
   // Add to App.js
   import NewFeature from './components/NewFeature';

   // Add route in Routes
   <Route path="/new-feature" element={<NewFeature />} />
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- MyComponent.test.js
```

### Test Structure

```
src/
├── components/
│   ├── __tests__/
│   │   ├── MyComponent.test.js
│   │   └── MyComponent.test.js.snap
├── services/
│   ├── __tests__/
│   │   └── apiClient.test.js
└── utils/
    ├── __tests__/
        └── helpers.test.js
```

### Writing Tests

```javascript
// Example component test
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});

test('handles user interaction', () => {
  render(<MyComponent />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Updated Text')).toBeInTheDocument();
});
```

## 🚀 Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Build will be created in 'build' directory
# Ready for deployment to any static hosting service
```

### Environment Configuration for Production

```env
# Production environment variables
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_AI_URL=https://ai.yourdomain.com
REACT_APP_DEBUG=false
```

### Nginx Configuration

The included `nginx.conf` provides:
- SPA routing support (handles React Router)
- Gzip compression
- Static asset caching
- Security headers

### Docker Production Deployment

```dockerfile
# Multi-stage build for smaller image
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: Role-based access control
- **Input Validation**: Form validation and sanitization
- **XSS Protection**: React's built-in XSS prevention
- **CORS Configuration**: Proper cross-origin resource sharing
- **Secure Headers**: Security headers via Nginx

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with multi-column layouts
- **Tablet**: Adapted layouts with touch-friendly controls
- **Mobile**: Single-column layouts with collapsible navigation

## 🎨 Styling

- **CSS Modules**: Scoped styling to prevent conflicts
- **Responsive Grid**: Flexbox and CSS Grid layouts
- **Custom Properties**: CSS variables for consistent theming
- **Accessibility**: ARIA labels and keyboard navigation support

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Failed:**
   ```
   Error: Network Error
   ```
   **Solution:** Check if backend is running and `REACT_APP_API_URL` is correct

2. **Authentication Issues:**
   ```
   Error: Invalid token
   ```
   **Solution:** Clear localStorage and re-login

3. **Build Errors:**
   ```
   Module not found: Can't resolve './component'
   ```
   **Solution:** Check import paths and file extensions

4. **CORS Errors:**
   ```
   Access to XMLHttpRequest blocked by CORS policy
   ```
   **Solution:** Verify backend CORS configuration

### Development Tips

- Use React Developer Tools browser extension
- Enable React.StrictMode for development warnings
- Use `console.log` sparingly; prefer React DevTools
- Test on multiple browsers and devices

## 📊 Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Analyze bundle size with `npm run build`
- **Caching**: Service worker for offline functionality

## 🤝 Contributing

1. Follow React best practices and Airbnb style guide
2. Use functional components with hooks
3. Implement proper error boundaries
4. Add TypeScript types for better development experience
5. Write comprehensive tests for new features
6. Update this README for new features

### Code Style

```javascript
// ✅ Good: Descriptive naming and structure
const handleUserLogin = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    setUser(response.user);
    navigate('/dashboard');
  } catch (error) {
    setError('Login failed');
  }
};

// ❌ Bad: Unclear naming and nested logic
const handleClick = async (e) => {
  e.preventDefault();
  try {
    const r = await api.post('/login', data);
    if (r.ok) {
      localStorage.setItem('u', JSON.stringify(r.data));
      window.location = '/dashboard';
    }
  } catch (err) {
    alert('Error!');
  }
};
```

## 📄 License

See project root LICENSE file for details.

## 📞 Support

For issues and questions:
1. Check existing GitHub issues
2. Review API documentation in backend README
3. Test with provided examples
4. Create detailed bug reports with:
   - Browser and OS information
   - Steps to reproduce
   - Console error messages
   - Network request details