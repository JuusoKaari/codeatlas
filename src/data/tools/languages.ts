import { Node } from '../types';

export const languages: Node[] = [
    {
        id: 'python',
        name: 'Python',
        category: 'lang',
        sub_category: 'Interpreted Language',
        description: 'A versatile programming language known for its readability and extensive library ecosystem.',
        website: 'https://www.python.org',
        license: 'PSF License',
        created_by: 'Guido van Rossum',
        first_release_date: '1991-02-20',
        programming_language: 'C',
        dependencies: [],
        alternatives: ['ruby', 'perl', 'javascript'],
        popularity_score: 95,
        links: ['django', 'flask', 'tensorflow', 'pytorch', 'opencv']
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        category: 'lang',
        sub_category: 'Typed Superset',
        description: 'A typed superset of JavaScript that compiles to plain JavaScript.',
        website: 'https://www.typescriptlang.org',
        license: 'Apache-2.0',
        created_by: 'Microsoft',
        first_release_date: '2012-10-01',
        programming_language: 'TypeScript',
        dependencies: ['javascript'],
        alternatives: ['flow', 'javascript'],
        popularity_score: 88,
        links: ['javascript', 'angular', 'react']
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        category: 'lang',
        sub_category: 'Scripting Language',
        description: 'A high-level, interpreted programming language that is one of the core technologies of the World Wide Web.',
        website: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        license: 'ECMA-262',
        created_by: 'Brendan Eich',
        first_release_date: '1995-12-04',
        programming_language: 'C++',
        dependencies: [],
        alternatives: ['typescript', 'coffeescript', 'dart'],
        popularity_score: 96,
        links: ['nodejs', 'react', 'typescript']
    }
]; 