# Contributing to CodeSync

First off, thank you for considering contributing to CodeSync! It's people like you that make CodeSync such a great tool for the developer community.

## 🌈 Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please be respectful and professional in all interactions.

## 🚀 Getting Started

1. **Fork the Repository:** Create your own copy of the project.
2. **Clone the Repo:** 
   ```bash
   git clone https://github.com/your-username/codesync.git
   ```
3. **Install Dependencies:**
   ```bash
   pnpm install
   ```
4. **Create a Branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 🛠️ Development Workflow

CodeSync uses a monorepo structure managed by **Turborepo**.

- **Running Locally:** Use `pnpm dev` to start all microservices and the frontend.
- **Testing:** Run `pnpm test` to execute the suite of unit and integration tests.
- **Linting:** Ensure your code adheres to our standards by running `pnpm lint`.
- **Type Checking:** Run `pnpm typecheck` to verify TypeScript integrity.

## 📬 Submitting Changes

1. **Commit your changes:** Use descriptive commit messages.
   ```bash
   git commit -m 'feat: add support for Rust execution'
   ```
2. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
3. **Open a Pull Request:** Provide a clear description of the changes and any relevant issue numbers.

## 📐 Architectural Guidelines

- **Real-Time Logic:** All collaborative features should use Y.js CRDTs. Avoid simple WebSocket relays for state that needs consistency.
- **Security:** Any new execution environment must be sandboxed via Docker with `--network none` and strict resource limits.
- **Type Safety:** Ensure all shared types are defined in `packages/shared-types`. No `any` types should be used.

---

Thank you for your contributions!
