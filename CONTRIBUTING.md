# Contributing to Save Shield

Thank you for your interest in contributing to **Save Shield**!

## 🚀 Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/save-shield.git
   cd save-shield
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing & Verification

Before submitting a Pull Request, ensure all checks pass:

```bash
# 1. Type Check
npx tsc -b

# 2. Unit Tests
npm test

# 3. Production Build Verification
npm run build
```

## 📜 Pull Request Guidelines

- Keep pull requests focused on a single feature or bug fix.
- Ensure all automated GitHub CI checks pass.
- Maintain dark-theme styling consistent with Tailwind tokens (`bg-surface-950`, `bg-surface-900`, `shield-600`, `emergency-600`).
