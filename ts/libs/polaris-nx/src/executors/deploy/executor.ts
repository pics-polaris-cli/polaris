import { Executor, ExecutorContext } from '@nrwl/devkit';

import { PolarisCliError } from '../../util';
import { DeployExecutorSchema } from './schema';

/**
 * Deploys a Polaris project or an SLO Mapping to an orchestrator.
 */
const executeDeploy: Executor<DeployExecutorSchema> = (options: DeployExecutorSchema, context: ExecutorContext) => {
    if (!context.projectName) {
        throw new PolarisCliError('This executor must be run on a project. No projectName found in context.', context);
    }

    // todo add logic here

    // this was executed before
    // Allows specifying the destination context, but if user does not specify the destination, its string value is 'undefined'
    // `kubectl apply --context='{args.destination}' -f ./${options.projectRoot}/manifests/kubernetes`,
    // const command = `kubectl apply -f ./${options.projectRoot}/manifests/kubernetes`;

    return Promise.resolve({
        success: true,
    });
};

export default executeDeploy;
