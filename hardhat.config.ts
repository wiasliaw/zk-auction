import path from "path";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@solarity/hardhat-zkit";
import "@solarity/chai-zkit";

const config: HardhatUserConfig = {
  solidity: "0.8.24",

  // repository config
  paths: {
    sources: path.resolve(__dirname, 'contracts'),
    tests: path.resolve(__dirname, 'tests'),
    cache: path.resolve(__dirname, '.cache'),
    artifacts: path.resolve(__dirname, 'dist/solc/artifacts'),
  },

  // typechain
  typechain: {
    outDir: "dist/solc/type",
  },

  // zkit
  zkit: {
    setupSettings: {
      ptauDir: ".cache"
    },
    typesSettings: {
      typesArtifactsDir: "dist/zkit/artifacts",
      typesDir: "dist/zkit/type",
    }
  },
};

export default config;
