export interface Node {
    id: string;
    name: string;
    category: string;
    sub_category?: string;
    description: string;
    website: string;
    license: string;
    created_by: string;
    first_release_date: string;  // ISO date string
    programming_language: string;
    dependencies: string[];
    alternatives: string[];
    popularity_score: number;  // 0-100 scale
    position?: { x: number; y: number; z: number };
    links: string[];  // Array of node IDs this node is connected to
}

export interface Category {
    id: string;
    name: string;
    color: string;
    description: string;
} 