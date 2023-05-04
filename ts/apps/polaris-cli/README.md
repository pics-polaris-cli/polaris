# Polaris CLI

This is the CLI for the Polaris SLO Framework project.

For more information, please have a look at the [Polaris CLI documentation](https://polaris-slo-cloud.github.io/polaris-slo-framework/features/cli.html).

## Debugging the CLI:

To debug the Polaris CLI, follow these steps:

1. Build the CLI:
    ```sh
    nx build polaris-cli --skip-nx-cache=true --sourceMap=true
    ```

2. Run the polaris-nx E2E tests:
    ```sh
    nx e2e polaris-nx-e2e
    ```

3. Open a JavaScript Debug Terminal in VS Code and navigate to the folder `tmp/nx-e2e/proj`.

4. Set breakpoints in the Polaris CLI code and run the command you want to debug:
    ```sh
    node ../../../dist/apps/polaris-cli/src/main.js <cmd>
    ```
