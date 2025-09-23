# Release Management

This project uses **semantic-release** for automatic versioning, changelog generation, and npm publishing.

## How It Works

### 1. Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) to automatically determine version bumps:

```bash
# Patch release (1.0.0 → 1.0.1)
git commit -m "fix: resolve memory leak in interval cleanup"

# Minor release (1.0.0 → 1.1.0)  
git commit -m "feat: add pause/resume functionality"

# Major release (1.0.0 → 2.0.0)
git commit -m "feat!: change API to use milliseconds

BREAKING CHANGE: All timing values now use milliseconds instead of seconds"
```

### 2. Automatic Process

When you push to the `main` branch:

1. **GitHub Actions** runs the release workflow
2. **semantic-release** analyzes commit messages since last release
3. **Version number** is automatically determined
4. **Changelog** is generated and updated
5. **Git tag** is created (e.g., `v1.1.0`)
6. **npm package** is published automatically
7. **GitHub release** is created with changelog

### 3. What Gets Updated

- `package.json` version field
- `CHANGELOG.md` with release notes
- Git tags (e.g., `v1.1.0`)
- npm package publication
- GitHub release

## Commands

```bash
# Test what would be released (dry run)
pnpm run release:dry-run

# Manual release (if needed)
pnpm run semantic-release
```

## Configuration

- **`.releaserc.json`**: semantic-release configuration
- **`.github/workflows/publish.yml`**: GitHub Actions workflow
- **`CONTRIBUTING.md`**: Commit message guidelines

## Benefits

✅ **No manual versioning** - versions are determined automatically  
✅ **Consistent changelog** - generated from commit messages  
✅ **Automated publishing** - no manual npm publish steps  
✅ **GitHub integration** - releases created automatically  
✅ **Breaking change detection** - major versions for breaking changes  
✅ **Prerelease support** - beta releases on `beta` branch  

## Migration from Manual Releases

**Before:**
```bash
# Manual process
pnpm run release 1.1.0  # Update version, commit, tag, push
# GitHub Action publishes to npm
```

**After:**
```bash
# Automatic process
git commit -m "feat: add new feature"
git push origin main
# Everything happens automatically!
```

## Prereleases

To create a beta release:

```bash
git checkout -b beta
git commit -m "feat: add experimental feature"
git push origin beta
# Creates v1.1.0-beta.1
```

## Secrets Required

Make sure these GitHub secrets are configured:

- `GITHUB_TOKEN` (automatically provided)
- `NPM_TOKEN` (your npm access token)

## Troubleshooting

- **No release created**: Check commit messages follow conventional format
- **Wrong version**: Review commit types (feat = minor, fix = patch, feat! = major)
- **Build fails**: Ensure all tests pass and build succeeds
- **Publish fails**: Check NPM_TOKEN secret is configured correctly
