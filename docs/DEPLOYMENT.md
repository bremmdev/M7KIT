## Deployment and Release Process

This repository uses a GitHub Actions workflow to deploy and release new versions of the React UI library.
The workflow is defined in .github/workflows/main.yml.

### Overview of the Pipeline

On each push to main, the workflow performs the following steps:

1. Version Check
	- Reads the package version from package.json.
	- Compares it to the latest version published on npm.
	- If the version already exists on npm, publishing is skipped.
	- If the version does not exist, the package is built and published.

2. Package Build and Publish (Conditional)
	- Runs only if the version is not already published.
	- Installs dependencies using npm ci.
	- Builds the library.
	- Publishes the package to npm using OIDC-based authentication.

3. Storybook Deployment
	- Deployment to Vercel is kicked-off and handled by Vercel by pushing the code to the repo (github.com/bremmdev/m7kit)

## npm Publishing Details

- npm publishing uses GitHub Actions OIDC authentication.
- No npm token is stored in repository secrets.
- The package is published only if package.json.version is greater than the currently published npm version.

Note: The workflow checks only the latest npm version. It assumes versions are always incremented monotonically.

## Release Expectations

- To release a new version:
	1. Bump the version in package.json.
	2. Merge or push the change to main.
- No manual release steps are required.