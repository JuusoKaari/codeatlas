import { Node } from '../types';

export const multimediaTools: Node[] = [
    {
        id: 'ffmpeg',
        name: 'FFmpeg',
        category: 'multimedia',
        sub_category: 'Media Processing',
        description: 'Complete solution for recording, converting, and streaming audio and video.',
        website: 'https://ffmpeg.org',
        license: 'LGPL/GPL',
        created_by: 'Fabrice Bellard',
        first_release_date: '2000-12-20',
        programming_language: 'C',
        dependencies: [],
        alternatives: ['gstreamer', 'vlc'],
        popularity_score: 92,
        links: ['gstreamer']
    },
    {
        id: 'gstreamer',
        name: 'GStreamer',
        category: 'multimedia',
        sub_category: 'Media Framework',
        description: 'Pipeline-based multimedia framework that links together a wide variety of media processing systems.',
        website: 'https://gstreamer.freedesktop.org',
        license: 'LGPL',
        created_by: 'GStreamer Team',
        first_release_date: '2001-01-11',
        programming_language: 'C',
        dependencies: [],
        alternatives: ['ffmpeg', 'directshow', 'mediafoundation'],
        popularity_score: 85,
        links: ['ffmpeg', 'qt']
    },
    {
        id: 'webrtc',
        name: 'WebRTC',
        category: 'multimedia',
        sub_category: 'Real-time Communication',
        description: 'Open-source project providing real-time communication capabilities to web browsers and mobile apps.',
        website: 'https://webrtc.org',
        license: 'BSD-3-Clause',
        created_by: 'Google',
        first_release_date: '2011-05-01',
        programming_language: 'C++, JavaScript',
        dependencies: [],
        alternatives: ['websocket', 'webrtc', 'sip'],
        popularity_score: 88,
        links: ['javascript', 'chrome']
    },
    {
        id: 'obs-studio',
        name: 'OBS Studio',
        category: 'multimedia',
        sub_category: 'Streaming & Recording',
        description: 'Free and open source software for video recording and live streaming.',
        website: 'https://obsproject.com',
        license: 'GPL-2.0',
        created_by: 'Hugh Bailey',
        first_release_date: '2012-09-01',
        programming_language: 'C++',
        dependencies: ['ffmpeg'],
        alternatives: ['xsplit', 'streamlabs', 'vmix'],
        popularity_score: 91,
        links: ['ffmpeg', 'x264']
    }
]; 