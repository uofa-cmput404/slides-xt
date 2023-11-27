const REPLACED = "import.meta.asset_list";

const assetListPlugin = (options) => {
    const virtualModuleId = 'virtual:asset-list';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;
    let server

    if (!options || !('file' in options)) {
        throw new Error("Missing file");
    }

    const getModulesServer = () => {
        const keys = Array.from(server.moduleGraph.urlToModuleMap.keys());
        const myselfIndex = keys.indexOf(resolvedVirtualModuleId);
        keys.splice(myselfIndex, 1);
        return keys;
    }

    const getModules = () => {
        if (server) {
            return getModulesServer();
        }
    }

    return {
        name: 'assetList',
        configureServer(_server) {
            server = _server
        },
        transform(code, id) {
            if (server) {
                if (code.includes(REPLACED)) {
                    console.log(id);
                    const assets = JSON.stringify(getModulesServer());
                    code = code.replace(REPLACED, assets);
                } else {
                    return null;
                }
            } else {
                return null;
            }
            return code;
        },
        generateBundle(options, bundle, isWrite) {
            // console.log(options, isWrite);
            console.log(Object.keys(bundle).length);
            for (const [fileName, bundled] of Object.entries(bundle)) {
                console.log(fileName, bundled.facadeModuleId);
            }
        }
    }
}

export default assetListPlugin;