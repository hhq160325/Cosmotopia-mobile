# Cosmotopia

A modern React Native authentication app built with Expo, featuring Vietnamese language support and cosmic-themed UI design.

## 🌟 About Cosmotopia

Cosmotopia is a beautifully designed authentication application that provides a seamless user experience with a cosmic theme. The app features a complete authentication flow with modern UI components and secure API integration.

## ✨ Features

- 🔐 **Complete Authentication Flow** - Login, Register, OTP Verification, Password Reset
- 🎨 **Cosmic-Themed UI** - Modern purple theme with space-inspired design
- 🌐 **Vietnamese Language Support** - Full localization for Vietnamese users
- 📱 **Responsive Design** - Works perfectly on all screen sizes
- 🔒 **Secure Form Validation** - Real-time validation with user-friendly error messages
- 🚀 **TypeScript Support** - Full type safety throughout the application
- 📦 **Modular Architecture** - Clean, maintainable component structure
- 🔗 **Real API Integration** - Connected to backend authentication services
- 💾 **Secure Token Storage** - JWT token management with AsyncStorage
- ⚡ **Fast Performance** - Optimized for speed and smooth user experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository:**
\`\`\`bash
git clone <your-repo-url>
cd cosmotopia
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Start the development server:**
\`\`\`bash
npx expo start
\`\`\`

4. **Run on your preferred platform:**
   - Press \`i\` for iOS Simulator
   - Press \`a\` for Android Emulator
   - Scan QR code with Expo Go app on your device

## 🔗 API Integration

Cosmotopia integrates with the following backend endpoints:

- **Login**: \`POST /api/User/Login\`
- **Register with OTP**: \`POST /api/User/registerwithotp\`
- **Verify OTP**: \`POST /api/User/verifyotp\`
- **Forgot Password**: \`POST /api/User/forgotpassword\`
- **Reset Password**: \`POST /api/User/newPass\`
- **Change Password**: \`POST /api/User/ChangePassword\`

## 📁 Project Structure

\`\`\`
cosmotopia/
├── index.js                # App entry point
├── App.tsx                 # Root component with navigation
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── babel.config.js        # Babel configuration
├── metro.config.js        # Metro bundler configuration
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── CustomButton.tsx
│   │   ├── CustomInput.tsx
│   │   └── SocialButton.tsx
│   ├── screens/          # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── VerifyOtpScreen.tsx
│   │   ├── ResetPasswordScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── services/         # API services
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   └── storageService.ts
│   ├── config/           # Configuration files
│   │   └── api.ts
│   ├── constants/        # App constants
│   │   ├── Colors.ts
│   │   └── Dimensions.ts
│   ├── styles/           # Global styles
│   │   └── GlobalStyles.ts
│   ├── types/            # TypeScript type definitions
│   │   └── navigation.ts
│   └── utils/            # Utility functions
│       └── validation.ts
└── assets/               # Static assets
    ├── icon.png
    ├── splash.png
    └── adaptive-icon.png
\`\`\`

## 🎨 Customization

### Colors
Edit \`src/constants/Colors.ts\` to customize the cosmic color scheme:

\`\`\`typescript
export const Colors = {
  primary: "#8B5CF6",        // Cosmic purple
  splashBar1: "#FF6B6B",     // Nebula red
  splashBar2: "#4ECDC4",     // Cosmic teal
  // ... more cosmic colors
}
\`\`\`

### API Configuration
Update \`src/config/api.ts\` to change API endpoints:

\`\`\`typescript
export const API_CONFIG = {
  BASE_URL: "https://your-api-domain.com/api",
  // ... endpoints
}
\`\`\`

### Branding
- Replace logo and app name in \`SplashScreen.tsx\`
- Update app name in \`app.json\`
- Customize bundle identifiers for iOS and Android

## 🏗️ Building for Production

### Android
\`\`\`bash
npx expo build:android
\`\`\`

### iOS
\`\`\`bash
npx expo build:ios
\`\`\`

### Web
\`\`\`bash
npx expo build:web
\`\`\`

## 🛠️ Development

### Running Tests
\`\`\`bash
npm test
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

### Type Checking
\`\`\`bash
npm run type-check
\`\`\`

## 🔧 Troubleshooting

### Common Issues

1. **"main" has not been registered error**
   - Ensure \`index.js\` exists and properly exports the app
   - Check that \`package.json\` has the correct \`main\` field

2. **Metro bundler issues**
   - Clear cache: \`npx expo start --clear\`
   - Reset Metro: \`npx expo start --reset-cache\`

3. **API connection issues**
   - Verify API endpoints in \`src/config/api.ts\`
   - Check network connectivity
   - Ensure backend server is running

4. **Navigation errors**
   - Verify all screen components are properly imported
   - Check navigation prop types match the stack definition

## 🤝 Contributing

We welcome contributions to Cosmotopia! Please follow these steps:

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI inspired by modern space and cosmic themes
- Vietnamese localization for accessibility
- TypeScript for type safety and better development experience

---

**Cosmotopia** - Khám phá vũ trụ số của bạn! 🚀✨
