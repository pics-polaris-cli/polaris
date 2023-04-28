import { ChangeType, Tree, applyChangesToString, joinPathFragments } from '@nx/devkit';
import { findNodes } from '@nx/js';
import * as ts from 'typescript';
import { POLARIS_INIT_FN_FILE_NAME } from './naming';
import { NormalizedLibraryClassGeneratorSchema } from './schema';

/**
 * Represents a TypeScript file loaded in memory.
 */
interface TypeScriptFile {
    sourceFile: ts.SourceFile;
    sourceStr: string;
}

/**
 * Export the contents of the new file and, optionally the init-polaris-lib.ts file, from the library.
 */
export function addExports(host: Tree, options: NormalizedLibraryClassGeneratorSchema, includeInitPolarisLib: boolean): void {
    const indexFile = joinPathFragments(options.projectSrcRoot, 'index.ts');

    if (includeInitPolarisLib) {
        const initFnFile = './' + joinPathFragments('lib', POLARIS_INIT_FN_FILE_NAME);
        addExportToIndex(host, indexFile, initFnFile);
    }

    const srcFile = './' + joinPathFragments(options.destDir, options.fileName);
    addExportToIndex(host, indexFile, srcFile);
}

/**
 * Adds an `export * from 'fileToBeExportedRelPath';` to the specified index.ts file.
 *
 * @param host The file system tree.
 * @param indexFilePath The path of the `index.ts` file.
 * @param fileToBeExportedRelPath The path of the file, whose contents should be exported. This path must
 * be relative to the `index.ts` file.
 */
export function addExportToIndex(host: Tree, indexFilePath: string, fileToBeExportedRelPath: string): void {
    const indexFile = readTsFile(host, indexFilePath);
    if (!indexFile) {
        return;
    }

    const insertPos = findPositionAfterLastExport(indexFile.sourceFile);
    const changes = applyChangesToString(
        indexFile.sourceStr,
        [
            {
                type: ChangeType.Insert,
                text: `export * from '${fileToBeExportedRelPath}';`,
                index: insertPos,
            },
        ],
      );
      host.write(indexFilePath, changes);
}

function readTsFile(host: Tree, path: string): TypeScriptFile {
    if (!host.exists(path)) {
        return undefined;
    }
    const buffer = host.read(path);
    if (buffer) {
        const srcStr = buffer.toString('utf-8');
        return {
            sourceStr: srcStr,
            sourceFile: ts.createSourceFile(path, srcStr, ts.ScriptTarget.Latest, true),
        };
    }
    return undefined;
}

function findPositionAfterLastExport(sourceFile: ts.SourceFile): number {
    const exports = findNodes(sourceFile, ts.SyntaxKind.ExportDeclaration);
    let lastToken: ts.Node;

    if (exports.length > 0) {
        lastToken = exports[exports.length - 1];
    } else {
        lastToken = sourceFile.getLastToken();
    }

    return lastToken.getEnd();
}
