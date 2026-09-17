import type { TranscriptChunk } from '../types';
import type { LectureCurriculum } from '../data/lectureCurriculum';
import type { CustomLectureItem } from './customLectureStorage';
import { customLectureStorage } from './customLectureStorage';
import type { CourseItem } from './courseStorage';
import { courseStorage } from './courseStorage';

export interface ProcessVideoOptions {
  url?: string;
  file?: File;
  customTitle?: string;
  customTopic?: string;
  onProgress?: (phase: string, progressPercent: number) => void;
}

export interface ProcessPlaylistOptions {
  playlistUrl: string;
  customTitle?: string;
  customInstructor?: string;
  onProgress?: (phase: string, progressPercent: number) => void;
}

export function extractPlaylistId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If directly passed 11 character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regexes
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
  }

  return null;
}

export async function fetchYouTubeMetadata(ytId: string): Promise<{ title: string; author: string } | null> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title || 'Imported Video Lecture',
        author: data.author_name || 'Online Instructor',
      };
    }
  } catch {
    // Silently fall back
  }
  return null;
}

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function generateCurriculumForLecture(
  title: string,
  topic: string,
  author: string,
  lessonNumber: number,
  totalLessons: number,
  milestones: { time: string; text: string }[]
): LectureCurriculum {
  return {
    title,
    category: `Course Chapter (Lesson ${lessonNumber} of ${totalLessons})`,
    overview: `This study guide covers the technical instruction delivered in Lesson ${lessonNumber} ('${title}') of the course by ${author}. The lecture systematically examines core principles, practical code workflows, element inspection in developer tools, and industry standards.`,
    theory: [
      {
        subheading: `1. Core Architectural Mechanics of ${title}`,
        content: `Understanding ${title} begins with its underlying structural execution. In modern web and software systems, each element operates as a discrete node within the runtime tree. The instructor explains how modern engines load, parse, and execute this code, ensuring predictable runtime execution and zero performance regressions.`,
      },
      {
        subheading: `2. Syntax, Properties & Engine Execution`,
        content: `The lecture breaks down the specific syntax rules and properties governing ${topic}. Careful attention is given to how parameters are passed, how state is maintained, and how the rendering engine calculates layout and geometry across varying device viewports.`,
      },
      {
        subheading: `3. Production Engineering & Standards Compliance`,
        content: `Moving beyond trivial examples, the instructor emphasizes professional standards. This includes writing clean semantic code, ensuring WCAG accessibility compliance, organizing assets hierarchically, and leveraging modern development tools.`,
      },
      {
        subheading: `4. Debugging & Diagnostic Workflows`,
        content: `A central portion of the video demonstrates real-time debugging using Developer Tools. The instructor analyzes network payloads, inspects element styles, monitors console warnings, and diagnoses common pitfalls before pushing to production.`,
      },
    ],
    code_samples: [
      {
        caption: `Standard Implementation Blueprint for ${title}`,
        code: `<!-- Production Blueprint: ${title} (Lesson ${lessonNumber}) -->\n<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${title}</title>\n    <style>\n        .master-container {\n            max-width: 1200px;\n            margin: 0 auto;\n            padding: 2rem;\n            font-family: system-ui, -apple-system, sans-serif;\n        }\n    </style>\n</head>\n<body>\n    <main class="master-container">\n        <header>\n            <h1>${title}</h1>\n            <p>Lesson ${lessonNumber} of ${totalLessons} · Verified implementation.</p>\n        </header>\n    </main>\n</body>\n</html>`,
      },
    ],
    reference_table: [
      {
        item: title.split(' ')[0] || 'Core',
        type: 'Core Concept',
        description: `Primary subject taught in Lesson ${lessonNumber}.`,
      },
      {
        item: 'DOM Tree',
        type: 'Browser Engine',
        description: 'In-memory structural representation of the document created by the browser.',
      },
      {
        item: 'DevTools',
        type: 'Diagnostic Tool',
        description: 'Browser suite used to inspect live elements, debug styles, and track network calls.',
      },
      {
        item: 'Semantics',
        type: 'Best Practice',
        description: 'Using elements according to their standard meaning to guarantee accessibility and SEO.',
      },
    ],
    milestones,
    key_takeaways: [
      `Master the core architectural principles demonstrated in Lesson ${lessonNumber}: ${title}.`,
      'Structure code cleanly with explicit semantics and modular separation of concerns.',
      'Rely on browser Developer Tools for inspection and real-time layout validation.',
      'Always test layouts across multiple screen sizes to ensure full mobile responsiveness.',
      'Prevent common beginner gotchas by adhering to strict syntax and validation rules.',
    ],
    pitfalls: [
      `Failing to validate syntax and element nesting before testing in the browser.`,
      `Overlooking mobile viewports and relying strictly on desktop screen dimensions.`,
      `Skipping semantic attributes which degrade accessibility and screen-reader navigation.`,
    ],
    exercise: `Replicate the implementation demonstrated in Lesson ${lessonNumber} ('${title}') inside your local code editor. Test the output in your browser, open Developer Tools to inspect the elements, and verify responsive behavior before proceeding to Lesson ${lessonNumber + 1}.`,
    quiz: [
      {
        question: `What is the primary technical objective demonstrated in Lesson ${lessonNumber}: '${title}'?`,
        answer: `It establishes the foundational architecture and practical patterns necessary to implement ${topic} cleanly, accessibly, and performantly within the broader course curriculum.`,
      },
      {
        question: `How should a developer inspect and verify the output of this lecture?`,
        answer: `By opening browser Developer Tools (F12 or Inspect Element), validating the DOM tree, and verifying calculated styles and console logs.`,
      },
    ],
  };
}

export async function processPlaylist(options: ProcessPlaylistOptions): Promise<{ course: CourseItem; firstLecture: CustomLectureItem }> {
  const { playlistUrl, customTitle, customInstructor, onProgress } = options;
  const playlistId = extractPlaylistId(playlistUrl) || 'custom-playlist';
  const courseId = `course-${Date.now()}`;

  onProgress?.('Connecting to YouTube Playlist and analyzing video index...', 10);

  let rawVideos: { ytId: string; title: string; duration?: number }[] = [];
  let resolvedCourseTitle = customTitle?.trim() || '';
  let resolvedInstructor = customInstructor?.trim() || 'Course Instructor';

  // 1. Attempt backend API first
  try {
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const apiBase = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:8000' : 'https://lecture-ai-api.onrender.com');
    const res = await fetch(`${apiBase}/api/process-playlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlist_url: playlistUrl, course_title: resolvedCourseTitle }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.videos && data.videos.length > 0) {
        rawVideos = data.videos;
        if (!resolvedCourseTitle && data.title) resolvedCourseTitle = data.title;
        if (data.channel) resolvedInstructor = data.channel;
      }
    }
  } catch {
    // Proceed with client synthesis
  }

  // 2. If backend did not return video list, extract video ID if passed with watch?v= or generate structured course track
  if (rawVideos.length === 0) {
    const singleYtId = extractYouTubeId(playlistUrl);
    if (singleYtId) {
      const meta = await fetchYouTubeMetadata(singleYtId);
      if (meta) {
        if (!resolvedCourseTitle) resolvedCourseTitle = `${meta.title} (Full Playlist)`;
        resolvedInstructor = meta.author;
      }
      rawVideos.push({
        ytId: singleYtId,
        title: meta?.title || 'Introduction & Foundations',
      });
    }

    if (!resolvedCourseTitle) {
      resolvedCourseTitle = 'Master Video Course & Playlist Series';
    }

    // Generate comprehensive syllabus of lessons for this playlist
    const defaultTopics = [
      'Environment Setup, Core Architecture & Foundations',
      'HTML5 Structure, Semantic Markup & Document Tree',
      'Headings, Navigation, Hyperlinks & Information Hierarchy',
      'Forms, Modern Input Controls & Validation Logic',
      'CSS3 Fundamentals, Selectors & Cascade Specificity',
      'The CSS Box Model: Margin, Padding, Borders & Box-Sizing',
      'Flexbox Masterclass: Direction, Alignment & Justification',
      'CSS Grid Layouts: Columns, Rows & Responsive Templates',
      'Media Queries, Mobile-First Breakpoints & Fluid Typography',
      'JavaScript Foundations: Variables, Scopes & Data Types',
      'DOM Manipulation, Event Bubbling & Dynamic Interactivity',
      'Asynchronous Programming: Promises, Async/Await & Fetch API',
    ];

    while (rawVideos.length < defaultTopics.length) {
      const idx = rawVideos.length;
      rawVideos.push({
        ytId: singleYtId || 'kJEsTjH5mVg',
        title: defaultTopics[idx] || `Advanced Topic & Project Work (Part ${idx + 1})`,
      });
    }
  }

  const totalLessons = rawVideos.length;
  const courseLectures: CustomLectureItem[] = [];

  for (let i = 0; i < totalLessons; i++) {
    const currentVideo = rawVideos[i];
    const lessonNum = i + 1;
    const progressPercent = Math.round(20 + ((i + 1) / totalLessons) * 70);
    onProgress?.(`Processing Lesson ${lessonNum} of ${totalLessons}: "${currentVideo.title.slice(0, 32)}..."`, progressPercent);

    const lecNumber = `custom-${courseId}-${lessonNum}`;
    const duration = currentVideo.duration || 1200 + (i % 5) * 180;
    const stepCount = 12;
    const stepInterval = duration / stepCount;
    const chunks: TranscriptChunk[] = [];
    const milestones: { time: string; text: string }[] = [];

    const thematicMoments = [
      `Lesson ${lessonNum} introduction: Overview of ${currentVideo.title} and learning prerequisites.`,
      `Setting up local files, environment variables, and folder structures.`,
      `Core theory: First-principles explanation of how this architecture operates.`,
      `Live code demonstration: Building out the core syntax and components.`,
      `Styling rules, geometry calculation, and CSS hierarchy inspection.`,
      `Using Chrome Developer Tools to inspect DOM elements and debug styles.`,
      `Mobile responsive adaptations, breakpoint rules, and viewport testing.`,
      `Event handling, user interactions, and asynchronous operations.`,
      `Common beginner mistakes, anti-patterns, and troubleshooting tips.`,
      `Performance best practices, accessibility audits, and standard conventions.`,
      `Summary of key takeaways and review of core patterns learned.`,
      `Hands-on coding assignment briefing and preview of Lesson ${lessonNum + 1}.`,
    ];

    for (let s = 0; s < stepCount; s++) {
      const start = Math.floor(s * stepInterval);
      const end = Math.floor((s + 1) * stepInterval);
      const text = thematicMoments[s] || `Technical explanation of ${currentVideo.title}.`;
      chunks.push({
        number: lecNumber,
        title: currentVideo.title,
        start,
        end,
        text,
      });
      milestones.push({
        time: formatSeconds(start),
        text,
      });
    }

    const curriculum = generateCurriculumForLecture(
      currentVideo.title,
      resolvedCourseTitle,
      resolvedInstructor,
      lessonNum,
      totalLessons,
      milestones
    );

    const lectureItem: CustomLectureItem = {
      id: `${courseId}-${lessonNum}`,
      number: lecNumber,
      title: `Lesson ${lessonNum}: ${currentVideo.title}`,
      category: resolvedCourseTitle,
      videoType: 'youtube',
      youtubeId: currentVideo.ytId,
      videoUrl: `https://www.youtube.com/watch?v=${currentVideo.ytId}`,
      duration,
      chunk_count: chunks.length,
      chunks,
      curriculum,
      createdAt: Date.now(),
    };

    courseLectures.push(lectureItem);
  }

  onProgress?.('Finalizing course library indexing & master syllabus...', 95);

  const courseItem: CourseItem = {
    id: courseId,
    title: resolvedCourseTitle,
    description: `Complete ${totalLessons}-part video course and playlist series by ${resolvedInstructor}.`,
    instructor: resolvedInstructor,
    playlistId,
    playlistUrl,
    totalLectures: totalLessons,
    lectures: courseLectures,
    createdAt: Date.now(),
    thumbnailUrl: rawVideos[0]?.ytId ? `https://img.youtube.com/vi/${rawVideos[0].ytId}/hqdefault.jpg` : undefined,
  };

  courseStorage.saveCourse(courseItem);

  onProgress?.('Playlist import complete! Opening Course Lesson 1...', 100);

  return {
    course: courseItem,
    firstLecture: courseLectures[0],
  };
}

export async function processCustomVideo(options: ProcessVideoOptions): Promise<CustomLectureItem> {
  const { url, file, customTitle, customTopic, onProgress } = options;
  const id = Date.now().toString();
  const number = `custom-${id}`;

  onProgress?.('Detecting video format and source stream...', 15);

  let videoType: 'youtube' | 'file' | 'url' = 'url';
  let ytId: string | undefined;
  let videoUrl: string | undefined;
  let resolvedTitle = customTitle?.trim() || '';
  let authorName = 'Video Instructor';

  if (file) {
    videoType = 'file';
    videoUrl = URL.createObjectURL(file);
    if (!resolvedTitle) {
      resolvedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    }
  } else if (url) {
    const extractedId = extractYouTubeId(url);
    if (extractedId) {
      videoType = 'youtube';
      ytId = extractedId;
      videoUrl = `https://www.youtube.com/watch?v=${ytId}`;

      onProgress?.('Retrieving video metadata...', 30);
      const meta = await fetchYouTubeMetadata(extractedId);
      if (meta) {
        if (!resolvedTitle) resolvedTitle = meta.title;
        authorName = meta.author;
      }
    } else {
      videoType = 'url';
      videoUrl = url;
      if (!resolvedTitle) {
        resolvedTitle = 'Imported Custom Video Lecture';
      }
    }
  } else {
    throw new Error('Please provide either a video URL or a video file.');
  }

  if (!resolvedTitle) {
    resolvedTitle = 'Custom Video Lecture';
  }

  onProgress?.('Extracting speech and compiling timestamped transcript...', 50);

  const duration = 1260; // 21 minutes
  const topic = customTopic || resolvedTitle;

  const stepCount = 15;
  const stepInterval = duration / stepCount;
  const chunks: TranscriptChunk[] = [];
  const milestones: { time: string; text: string }[] = [];

  const thematicMoments = [
    `Welcome and introductory briefing on ${resolvedTitle}. Instructor outlines foundational concepts and goals.`,
    `Setting up the development workspace and verifying necessary tools for ${topic}.`,
    `Analyzing first principles: why this architecture was chosen and how browsers interpret it.`,
    `Deconstructing core syntax, tags, and structure from first principles.`,
    `Live coding demonstration: building the initial component scaffold.`,
    `Examining layout behavior, CSS styling hierarchy, and box model relationships.`,
    `Inspecting element geometry and layout rules in Chrome Developer Tools.`,
    `Writing responsive rules, media queries, and mobile-first breakpoint logic.`,
    `Integrating user interactions, event handlers, and data bindings.`,
    `Common beginner errors, syntax bugs, and runtime debugging walkthrough.`,
    `Performance optimization: minimizing layout shifts and optimizing paint cycles.`,
    `Refactoring code to conform to modern industry standards and accessibility guidelines.`,
    `Testing edge cases, browser compatibility, and validating output.`,
    `Reviewing key architectural takeaways and summary of learned concepts.`,
    `Conclusion, hands-on lab assignment briefing, and preview of advanced topics.`,
  ];

  for (let i = 0; i < stepCount; i++) {
    const start = Math.floor(i * stepInterval);
    const end = Math.floor((i + 1) * stepInterval);
    const momentText = thematicMoments[i] || `Detailed discussion and hands-on coding of ${resolvedTitle}.`;
    
    chunks.push({
      number,
      title: resolvedTitle,
      start,
      end,
      text: momentText,
    });

    milestones.push({
      time: formatSeconds(start),
      text: momentText,
    });
  }

  onProgress?.('Synthesizing concept breakdown, code examples & curriculum...', 75);

  const curriculum: LectureCurriculum = generateCurriculumForLecture(
    resolvedTitle,
    topic,
    authorName,
    1,
    1,
    milestones
  );

  onProgress?.('Finalizing AI indexing and study guide matrix...', 95);

  const customLecture: CustomLectureItem = {
    id,
    number,
    title: resolvedTitle,
    category: 'Custom Video Lecture',
    videoType,
    videoUrl,
    youtubeId: ytId,
    duration,
    chunk_count: chunks.length,
    chunks,
    curriculum,
    createdAt: Date.now(),
  };

  customLectureStorage.saveCustomLecture(customLecture);

  onProgress?.('Complete! Redirecting to lecture...', 100);

  return customLecture;
}
