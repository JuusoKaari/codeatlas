import { Node } from '../types';

export const devopsTools: Node[] = [
    {
        id: 'docker',
        name: 'Docker',
        category: 'devops',
        sub_category: 'Containerization',
        description: 'Platform for developing, shipping, and running applications in containers.',
        website: 'https://www.docker.com',
        license: 'Apache-2.0',
        created_by: 'Docker, Inc.',
        first_release_date: '2013-03-13',
        programming_language: 'Go',
        dependencies: [],
        alternatives: ['podman', 'containerd'],
        popularity_score: 90,
        links: ['kubernetes']
    },
    {
        id: 'kubernetes',
        name: 'Kubernetes',
        category: 'devops',
        sub_category: 'Container Orchestration',
        description: 'Open-source container orchestration system for automating deployment, scaling, and management.',
        website: 'https://kubernetes.io',
        license: 'Apache-2.0',
        created_by: 'Google',
        first_release_date: '2014-06-07',
        programming_language: 'Go',
        dependencies: ['docker'],
        alternatives: ['docker-swarm', 'nomad', 'openshift'],
        popularity_score: 92,
        links: ['docker', 'helm', 'prometheus']
    },
    {
        id: 'terraform',
        name: 'Terraform',
        category: 'devops',
        sub_category: 'Infrastructure as Code',
        description: 'Infrastructure as Code software tool for building, changing, and versioning infrastructure safely and efficiently.',
        website: 'https://www.terraform.io',
        license: 'MPL-2.0',
        created_by: 'HashiCorp',
        first_release_date: '2014-07-28',
        programming_language: 'Go',
        dependencies: [],
        alternatives: ['pulumi', 'cloudformation', 'ansible'],
        popularity_score: 88,
        links: ['aws', 'kubernetes']
    },
    {
        id: 'github-actions',
        name: 'GitHub Actions',
        category: 'devops',
        sub_category: 'CI/CD',
        description: 'Automation and CI/CD platform that allows you to automate your build, test, and deployment pipeline.',
        website: 'https://github.com/features/actions',
        license: 'MIT',
        created_by: 'GitHub',
        first_release_date: '2018-10-16',
        programming_language: 'Various',
        dependencies: [],
        alternatives: ['jenkins', 'gitlab-ci', 'circleci'],
        popularity_score: 89,
        links: ['git', 'docker']
    }
]; 