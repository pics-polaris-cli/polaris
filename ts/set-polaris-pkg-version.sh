#!/bin/bash

# set -x
set -o errexit

if [ "$1" == "" ] || [ "$1" == "--help" ]; then
    echo "This script updates the versions of the @polairs-sloc packages in all package.json files and the packages.ts file used in the CLI."
    echo "Please specify the @polaris-sloc package version that should be set in all package.json files."
    echo "For example: ./set-polaris-pkg-version.sh \"0.2.0\""
    exit 1
fi

newVersion="$1"

# Build the projects.
PACKAGE_DIRS=(
    "."
    "./libs/core"
    "./libs/common-mappings"
    "./libs/kubernetes"
    "./libs/prometheus"
    "./libs/cost-efficiency"
    "./libs/schema-gen"
    "./libs/polaris-nx"
    "./apps/polaris-cli"
)

POLARIS_PKGS=(
    "@polaris-sloc\/core"
    "@polaris-sloc\/common-mappings"
    "@polaris-sloc\/kubernetes"
    "@polaris-sloc\/prometheus"
    "@polaris-sloc\/cost-efficiency"
    "@polaris-sloc\/schema-gen"
    "@polaris-sloc\/polaris-nx"
    "@polaris-sloc\/cli"
)

PACKAGES_TS="./libs/polaris-nx/src/util/packages.ts"

function updateDependenciesInPackageJson() {
    local packageJsonContent=$(cat ./package.json)
    for pkg in ${POLARIS_PKGS[@]}; do
        packageJsonContent=$(echo "$packageJsonContent" | sed -e "s/\"${pkg}\": \".*\"/\"${pkg}\": \"\~${newVersion}\"/" - )
    done
    echo "$packageJsonContent" > ./package.json
}

function updateCliPackageConfig() {
    local packagesTsContent=$(sed -e "s/polaris: '.*',/polaris: '${newVersion}',/" "$PACKAGES_TS")
    echo "$packagesTsContent" > "$PACKAGES_TS"
}

for pkgDir in ${PACKAGE_DIRS[@]}; do
    (
        cd "$pkgDir"
        # Update the version of the current npm package in package.json.
        npm version --allow-same-version "$newVersion"

        # Update the @polaris-sloc dependencies in the current package.json
        updateDependenciesInPackageJson
    )
done

# Update the @polaris-sloc package version used in the files generated by the CLI.
updateCliPackageConfig

echo "All package versions updated successfully."
