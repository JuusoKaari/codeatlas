import { Node } from '../types';

export const mlTools: Node[] = [
    {
        id: 'tensorflow',
        name: 'TensorFlow',
        category: 'ml',
        sub_category: 'Deep Learning',
        description: 'Open source platform for machine learning.',
        website: 'https://www.tensorflow.org',
        license: 'Apache-2.0',
        created_by: 'Google Brain Team',
        first_release_date: '2015-11-09',
        programming_language: 'C++, Python',
        dependencies: ['python', 'cuda'],
        alternatives: ['pytorch', 'jax', 'mxnet'],
        popularity_score: 94,
        links: ['python', 'pytorch', 'onnx']
    },
    {
        id: 'pytorch',
        name: 'PyTorch',
        category: 'ml',
        sub_category: 'Deep Learning',
        description: 'Open source machine learning framework that accelerates the path from research prototyping to production deployment.',
        website: 'https://pytorch.org',
        license: 'BSD-3-Clause',
        created_by: 'Facebook AI Research',
        first_release_date: '2016-10-01',
        programming_language: 'C++, Python',
        dependencies: ['python', 'cuda'],
        alternatives: ['tensorflow', 'jax', 'mxnet'],
        popularity_score: 92,
        links: ['python', 'tensorflow', 'onnx']
    },
    {
        id: 'huggingface',
        name: 'Hugging Face Transformers',
        category: 'ml',
        sub_category: 'NLP',
        description: 'State-of-the-art Natural Language Processing for PyTorch and TensorFlow.',
        website: 'https://huggingface.co',
        license: 'Apache-2.0',
        created_by: 'Hugging Face',
        first_release_date: '2018-03-01',
        programming_language: 'Python',
        dependencies: ['python', 'pytorch', 'tensorflow'],
        alternatives: ['spacy', 'nltk', 'stanford-nlp'],
        popularity_score: 90,
        links: ['pytorch', 'tensorflow', 'python']
    },
    {
        id: 'opencv',
        name: 'OpenCV',
        category: 'ml',
        sub_category: 'Computer Vision',
        description: 'Open source computer vision and machine learning software library.',
        website: 'https://opencv.org',
        license: 'BSD-3-Clause',
        created_by: 'Intel Corporation',
        first_release_date: '2000-06-01',
        programming_language: 'C++',
        dependencies: [],
        alternatives: ['pillow', 'scikit-image', 'tensorflow'],
        popularity_score: 91,
        links: ['python', 'cuda', 'tensorflow']
    }
]; 