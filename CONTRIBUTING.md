# Contributing to clock-source

Thank you for your interest in contributing to clock-source! This document provides guidelines for contributing to the project.

## Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning and changelog generation.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Examples

```bash
# New feature
git commit -m "feat: add pause/resume functionality to timing clock"

# Bug fix
git commit -m "fix: resolve memory leak in interval cleanup"

# Documentation
git commit -m "docs: update README with new API examples"

# Breaking change
git commit -m "feat!: change timing clock API to use milliseconds

BREAKING CHANGE: timing clock now uses milliseconds instead of seconds for all time values"
```

### Breaking Changes

To indicate a breaking change, add `!` after the type and include `BREAKING CHANGE:` in the footer:

```bash
git commit -m "feat!: change API to use milliseconds

BREAKING CHANGE: All timing values now use milliseconds instead of seconds"
```

## Development Workflow

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the commit message convention
3. **Add tests** for new functionality
4. **Run tests** to ensure everything passes
5. **Create a pull request** with a clear description

## Automatic Versioning

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automatic versioning:

- **Patch releases** (1.0.0 → 1.0.1): Bug fixes
- **Minor releases** (1.0.0 → 1.1.0): New features
- **Major releases** (1.0.0 → 2.0.0): Breaking changes

Version numbers are automatically determined based on your commit messages, so following the conventional commit format is crucial.

## Testing

Before submitting a pull request, ensure all tests pass:

```bash
pnpm test
pnpm run type-check
pnpm run build
```

## Questions?

If you have any questions about contributing, please open an issue or start a discussion.
