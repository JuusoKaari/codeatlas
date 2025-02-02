import { Node } from '../types';
import { languages } from './languages';
import { frontendTools } from './frontend';
import { backendTools } from './backend';
import { databaseTools } from './database';
import { devopsTools } from './devops';
import { multimediaTools } from './multimedia';
import { mlTools } from './ml';
import { cssTools } from './css';
import { buildTools } from './build';

// Import other categories as they are created
// import { backendTools } from './backend';
// import { databaseTools } from './database';
// etc...

export const nodes: Node[] = [
    ...languages,
    ...frontendTools,
    ...backendTools,
    ...databaseTools,
    ...devopsTools,
    ...multimediaTools,
    ...mlTools,
    ...cssTools,
    ...buildTools
    // Add other categories as they are created
    // ...backendTools,
    // ...databaseTools,
    // etc...
]; 