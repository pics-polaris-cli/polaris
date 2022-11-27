import * as fs from 'fs';
import axios from 'axios';

const POLARIS_REPO = 'polaris-slo-cloud/polaris';
const PACKAGE_JSON_FILE = 'package.json';
const POLARIS_JSON_FILE = 'polaris.json';
const PROJECT_JSON_FILE = 'project.json';
const NRWL_ORG = '@nrwl';

interface ProjectJson {
    targets: {
        [key: string]: {
            executor: string;
            options: {
                projectName: string;
            };
        };
    };
}

export async function getNxVersion(version: string): Promise<string> {
    const response = await axios.get(`https://raw.githubusercontent.com/${POLARIS_REPO}/${version}/ts/package.json`);
    const packageJson = await response.data;
    return packageJson.devDependencies.nx;
}

export async function getLatestReleaseVersion(): Promise<string> {
    const response = await axios.get(`https://api.github.com/repos/${POLARIS_REPO}/releases/latest`);
    const latestReleaseTag = await response.data.tag_name;
    return latestReleaseTag;
}

export function readFromPackageJson(): string[] {
    const packageJson: { devDependencies: [] } = JSON.parse(fs.readFileSync(PACKAGE_JSON_FILE, 'utf-8'));
    return Object.keys(packageJson.devDependencies).filter(pkg => pkg.startsWith(NRWL_ORG));
}

export function getProjectsFromPolarisJson(): string[] {
    const polarisJson: { projects: [] } = JSON.parse(fs.readFileSync(POLARIS_JSON_FILE, 'utf-8'));
    return Object.keys(polarisJson.projects);
}

export function updateDockerCommand(project: string): void {
    const projectJson: ProjectJson = JSON.parse(fs.readFileSync(`apps/${project}/${PROJECT_JSON_FILE}`, 'utf-8'));
    projectJson.targets['docker-build'] = {
        executor: '@polaris-sloc/polaris-nx:docker-build',
        options: {
            projectName: project,
        },
    };
    fs.writeFileSync(`apps/${project}/${PROJECT_JSON_FILE}`, JSON.stringify(projectJson, null, 4), 'utf-8');
}
