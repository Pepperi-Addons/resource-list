const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
// file_name should be lowercase and if it more then one word put '_' between them,
const filename = 'views_and_editors'; // block_file_name
const dataViewerConfiguration = 'data_configuration_block'
const dataViewer = 'data_viewer_block'
let settingsFilename = 'data_viewer_configuration_settings';

const webpackDataViewerConfig = withModuleFederationPlugin({
    name: `${dataViewer}`,
    filename: `${dataViewer}.js`,
    exposes: {
        './BlockModule': './src/app/block/index.ts',
        './BlockEditorModule': './src/app/block-editor/index.ts',
    },
    shared: {
        ...shareAll({ strictVersion: true, requiredVersion: 'auto' }),
    }
});

const webpackDataViewerConfigurationConfig = withModuleFederationPlugin({
    name: `${dataViewerConfiguration}`,
    filename: `${dataViewerConfiguration}.js`,
    exposes: {
        './DataConfigurationBlockModule': './src/app/data-configuration-block/index.ts',
        './DataConfigurationBlockEditorModule': './src/app/data-configuration-block-editor/index.ts',
    },
    shared: {
        ...shareAll({ strictVersion: true, requiredVersion: 'auto' }),
    }
});

const webpackSettingsConfig = withModuleFederationPlugin({
    name: settingsFilename,
    filename: `${settingsFilename}.js`,
    exposes: {
        './SettingsModule': './src/app/settings/index'
    },
    shared: {
        ...shareAll({ strictVersion: true, requiredVersion: 'auto' }),
    }
});

module.exports = {
    ...webpackDataViewerConfig,
    output: {
        ...webpackDataViewerConfig.output,
        uniqueName: filename,
    },
    plugins: [
        ...webpackDataViewerConfig.plugins,
        ...webpackDataViewerConfigurationConfig.plugins,
        ...webpackSettingsConfig.plugins,
    ]
};