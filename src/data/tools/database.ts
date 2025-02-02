import { Node } from '../types';

export const databaseTools: Node[] = [
    {
        id: 'postgresql',
        name: 'PostgreSQL',
        category: 'database',
        sub_category: 'Relational Database',
        description: 'Advanced open source relational database.',
        website: 'https://www.postgresql.org',
        license: 'PostgreSQL License',
        created_by: 'PostgreSQL Global Development Group',
        first_release_date: '1996-07-08',
        programming_language: 'C',
        dependencies: [],
        alternatives: ['mysql', 'mariadb', 'oracle'],
        popularity_score: 89,
        links: ['django', 'nodejs']
    },
    {
        id: 'mongodb',
        name: 'MongoDB',
        category: 'database',
        sub_category: 'Document Database',
        description: 'Document-oriented NoSQL database program.',
        website: 'https://www.mongodb.com',
        license: 'Server Side Public License',
        created_by: 'MongoDB Inc.',
        first_release_date: '2009-02-11',
        programming_language: 'C++, JavaScript',
        dependencies: [],
        alternatives: ['couchdb', 'firebase', 'dynamodb'],
        popularity_score: 88,
        links: ['nodejs', 'mongoose']
    },
    {
        id: 'redis',
        name: 'Redis',
        category: 'database',
        sub_category: 'Key-Value Store',
        description: 'In-memory data structure store, used as a database, cache, message broker, and queue.',
        website: 'https://redis.io',
        license: 'BSD-3-Clause',
        created_by: 'Salvatore Sanfilippo',
        first_release_date: '2009-06-10',
        programming_language: 'C',
        dependencies: [],
        alternatives: ['memcached', 'aerospike', 'hazelcast'],
        popularity_score: 86,
        links: ['nodejs', 'python']
    },
    {
        id: 'elasticsearch',
        name: 'Elasticsearch',
        category: 'database',
        sub_category: 'Search Engine',
        description: 'Distributed, RESTful search and analytics engine.',
        website: 'https://www.elastic.co',
        license: 'Elastic License',
        created_by: 'Elastic NV',
        first_release_date: '2010-02-08',
        programming_language: 'Java',
        dependencies: ['java'],
        alternatives: ['solr', 'opensearch', 'meilisearch'],
        popularity_score: 87,
        links: ['kibana', 'logstash']
    }
]; 