import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import update from './use-executor-for-deployment';

describe('use-executor-for-deployment migration', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    });

    it('should run successfully', async () => {
        await update(tree);
        // ... expect changes made
    });
});
