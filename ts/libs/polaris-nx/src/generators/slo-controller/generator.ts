import * as path from 'path';
import { Generator, Tree, formatFiles, generateFiles, offsetFromRoot, readProjectConfiguration, updateProjectConfiguration } from '@nx/devkit';
import {
    NPM_PACKAGES,
    POLARIS_INIT_LIB_FN_NAME,
    PolarisCliConfig,
    PolarisCliProjectType,
    VERSIONS,
    addDeployTarget,
    addDockerBuildConfig,
    addPolarisDependenciesToPackageJson,
    changeBuildDependencyBundling,
    createAppProject,
    getSloNames,
    normalizeProjectGeneratorOptions,
    runCallbacksSequentially,
} from '../../util';
import { addCommonWorkspaceRootFiles, generateTypeScriptDockerfile } from '../common';
import { SloControllerGeneratorNormalizedSchema, SloControllerGeneratorSchema } from './schema';

/**
 * Generates a new Polaris SLO Controller..
 */
const generateSloController: Generator<SloControllerGeneratorSchema> = async (host: Tree, options: SloControllerGeneratorSchema) => {
    const normalizedOptions = normalizeProjectGeneratorOptions(host, options);

    const nodeAppResult = await createAppProject(
        host,
        {
            projectName: options.name,
            directory: options.directory,
            tags: options.tags,
        },
    );

    const installPkgsFn = addPolarisDependenciesToPackageJson(host, {
        [NPM_PACKAGES.polaris.orchestrators.kubernetes]: VERSIONS.polaris,
        [NPM_PACKAGES.polaris.queryBackends.prometheus]: VERSIONS.polaris,
    });

    const projectConfig = readProjectConfiguration(host, normalizedOptions.projectName);
    changeBuildDependencyBundling(projectConfig);
    addDockerBuildConfig(projectConfig, normalizedOptions);
    addDeployTarget(projectConfig, normalizedOptions);
    updateProjectConfiguration(host, normalizedOptions.projectName, projectConfig);

    addCommonWorkspaceRootFiles(host);
    addSloControllerFiles(host, normalizedOptions);

    const polarisCliConfig = PolarisCliConfig.readFromFile(host);
    polarisCliConfig.getOrCreateControllerProject(normalizedOptions, PolarisCliProjectType.SloController);
    polarisCliConfig.writeToFile();

    await formatFiles(host);

    return runCallbacksSequentially(nodeAppResult, installPkgsFn);
};

export default generateSloController;

function addSloControllerFiles(host: Tree, options: SloControllerGeneratorNormalizedSchema): void {
    const sloNames = getSloNames(options.sloMappingType);

    const templateOptions = {
        ...sloNames,
        sloMappingTypePkg: options.sloMappingTypePkg,
        initPolarisLibFn: POLARIS_INIT_LIB_FN_NAME,
        controllerProjectName: options.projectName,
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        appsDir: options.appsDir,
        template: '',
    };
    generateFiles(host, path.join(__dirname, 'files/slo-controller'), options.projectRoot, templateOptions);
    generateTypeScriptDockerfile(host, options);
}
