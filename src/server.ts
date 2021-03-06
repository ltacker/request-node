#!/usr/bin/env node
import { LogTypes } from '@requestnetwork/types';
import { argv } from 'yargs';
import * as config from './config';
import Logger from './logger';
import RequestNode from './requestNode';

// Load environment variables from .env file (without overriding variables already set)
require('dotenv').config();

// Initialize the node logger
const { logLevel, logMode } = config.getLogConfig();
const logger = new Logger(logLevel, logMode);

const startNode = async (): Promise<void> => {
  const serverMessage = `Using config:
  Log Level: ${LogTypes.LogLevel[config.getLogConfig().logLevel]}
  Log Mode: ${config.getLogConfig().logMode}
  Initialization storage path: ${config.getInitializationStorageFilePath()}
`;

  logger.info(serverMessage);

  // Instantiates the Request Node, listens for connections and initializes it
  const requestNode = new RequestNode(logger);

  const port = config.getServerPort();
  requestNode.listen(port, () => {
    logger.info(`Listening on port ${port}`);
    return 0;
  });

  await requestNode.initialize();
};

// If -h option is used, commands are printed
// Otherwise the node is started
if (argv.h) {
  // tslint:disable:no-console
  console.log(config.getHelpMessage());
} else {
  startNode().catch(error => {
    logger.error(error);
    process.exit(1);
  });
}
