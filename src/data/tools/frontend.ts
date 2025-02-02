import { Node } from '../types';

export const frontendTools: Node[] = [
    {
        id: 'react',
        name: 'React',
        category: 'frontend',
        sub_category: 'UI Library',
        description: 'A JavaScript library for building user interfaces.',
        website: 'https://reactjs.org',
        license: 'MIT',
        created_by: 'Facebook',
        first_release_date: '2013-05-29',
        programming_language: 'JavaScript',
        dependencies: ['nodejs'],
        alternatives: ['vue', 'angular', 'svelte'],
        popularity_score: 96,
        links: ['javascript', 'typescript', 'mui']
    },
    {
        id: 'vue',
        name: 'Vue.js',
        category: 'frontend',
        sub_category: 'UI Framework',
        description: 'Progressive JavaScript framework for building user interfaces.',
        website: 'https://vuejs.org',
        license: 'MIT',
        created_by: 'Evan You',
        first_release_date: '2014-02-01',
        programming_language: 'JavaScript',
        dependencies: ['nodejs'],
        alternatives: ['react', 'angular', 'svelte'],
        popularity_score: 88,
        links: ['javascript', 'typescript', 'vuetify']
    },
    {
        id: 'angular',
        name: 'Angular',
        category: 'frontend',
        sub_category: 'UI Framework',
        description: 'Platform for building mobile and desktop web applications.',
        website: 'https://angular.io',
        license: 'MIT',
        created_by: 'Google',
        first_release_date: '2016-09-14',
        programming_language: 'TypeScript',
        dependencies: ['typescript', 'nodejs'],
        alternatives: ['react', 'vue', 'svelte'],
        popularity_score: 85,
        links: ['typescript', 'rxjs', 'material']
    },
    {
        id: 'svelte',
        name: 'Svelte',
        category: 'frontend',
        sub_category: 'UI Framework',
        description: 'Radical new approach to building user interfaces that compiles your code to tiny, framework-less vanilla JS.',
        website: 'https://svelte.dev',
        license: 'MIT',
        created_by: 'Rich Harris',
        first_release_date: '2016-11-26',
        programming_language: 'JavaScript',
        dependencies: ['nodejs'],
        alternatives: ['react', 'vue', 'angular'],
        popularity_score: 82,
        links: ['javascript', 'typescript', 'sveltekit']
    }
]; 