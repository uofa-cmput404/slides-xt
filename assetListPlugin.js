import { readFileSync, renameSync, writeFileSync } from 'node:fs';

const ASSET_LIST_REPLACED = "[]||ASSET_LIST";
const ASSET_LIST_VERSION_REPLACED = "''&&ASSET_LIST_VERSION";

const needsPatch = (bundled, replaced) => {
    return (
        ('code' in bundled && bundled.code.includes(replaced))
        || ('source' in bundled && bundled.source.includes(replaced))
    );
}

const getVersion = async (assets) => {
    assets.sort();
    const joined = assets.join('\0');
    return btoa(
        String.fromCodePoint(...new Uint8Array(
            await crypto.subtle.digest("SHA-256", (
                new TextEncoder().encode(joined)
            ))
        ))
    ).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

const assetListPlugin = (options) => {
    const virtualModuleId = 'virtual:asset-list';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;
    let server
    let config

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
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        configureServer(_server) {
            server = _server
        },
        transform(code, id) {
            console.log(id);
            if (server) {
                if (code.includes(ASSET_LIST_REPLACED)) {
                    console.log(id);
                    const assets = JSON.stringify(getModulesServer());
                    code = code.replace(ASSET_LIST_REPLACED, assets);
                } else {
                    return null;
                }
            } else {
                return null;
            }
            return code;
        },
        async writeBundle(options, bundle, isWrite) {
            const allFileNames = [];
            const needToRewrite = [];
            for (const [fileName, bundled] of Object.entries(bundle)) {
                const realFileName = bundled.fileName;
                allFileNames.push(realFileName);
                if (fileName !== realFileName) {
                    console.log(fileName, realFileName);
                }
                if (
                    needsPatch(bundled, ASSET_LIST_REPLACED) 
                    || needsPatch(bundled, ASSET_LIST_VERSION_REPLACED)
                ) {
                    console.log("needs patch ", realFileName);
                    needToRewrite.push(realFileName);
                }
            }
            const assetList = JSON.stringify(allFileNames);
            const assetListVersion = JSON.stringify(await getVersion(allFileNames));
            for (const toRewrite of needToRewrite) {
                const toRewritePath = config.build.outDir + '/' + toRewrite;
                const toRewritePathTemp = toRewritePath + '.temp';
                const code = readFileSync(toRewritePath).toString('utf8');
                if (! code.includes(ASSET_LIST_REPLACED)) {
                    throw new Error(`${toRewrite} is missing ${ASSET_LIST_REPLACED}`);
                }
                const patched = code
                    .replaceAll(ASSET_LIST_REPLACED, assetList)
                    .replaceAll(ASSET_LIST_VERSION_REPLACED, assetListVersion);
                writeFileSync(toRewritePathTemp, patched, {flush: true});
                renameSync(toRewritePathTemp, toRewritePath);
            }
            console.log(config.build);
        },
        augmentChunkHash(chunkInfo) {
            for (const [moduleId, module] of Object.entries(chunkInfo.modules)) {
                console.log("CHUNK: ", chunkInfo.name, moduleId);
                if (module.code.includes(ASSET_LIST_VERSION_REPLACED)) {
                    console.log("patch me!");
                }
                if (chunkInfo.name.startsWith("sw")) {
                    console.log(module.code);
                }
        }
            if (chunkInfo.name.startsWith("sw")) {
                console.log(chunkInfo);
            }
        }
    }
}

export default assetListPlugin;