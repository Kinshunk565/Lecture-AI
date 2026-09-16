export interface CurriculumTopic {
  subheading: string;
  content: string;
}

export interface CodeSample {
  caption: string;
  code: string;
}

export interface QuizItem {
  question: string;
  answer: string;
}

export interface LectureCurriculum {
  title: string;
  category: string;
  overview: string;
  theory: CurriculumTopic[];
  code_samples: CodeSample[];
  key_takeaways: string[];
  pitfalls: string[];
  quiz: QuizItem[];
}

export const LECTURE_CURRICULUM: Record<string, LectureCurriculum> = {
  "1": {
    "title": "Installing VS Code & How Websites Work",
    "category": "Foundations & Environment Setup",
    "overview": "In this foundational lecture, the instructor introduces the foundational mechanics of the modern World Wide Web and walks through setting up an industry-standard development environment. Students learn how the client-server architecture operates, how web browsers interpret files, and how to configure Visual Studio Code with the essential extensions for high-velocity front-end engineering.",
    "theory": [
      {
        "subheading": "1. Client-Server Architecture & HTTP",
        "content": "The web operates on a client-server model. The 'Client' (a web browser such as Chrome, Firefox, or Safari) requests resources across the internet, while the 'Server' (a computer hosting website files) responds with HTML, CSS, JavaScript, and media assets. When you enter a URL, the Domain Name System (DNS) resolves that human-readable domain name into an IP address (such as 142.250.190.46) to locate the target server."
      },
      {
        "subheading": "2. The Three Pillars of Web Development",
        "content": "Every modern website is built upon three core technologies: HTML (HyperText Markup Language) acts as the skeleton or structural backbone; CSS (Cascading Style Sheets) functions as the skin, clothing, and aesthetic styling; and JavaScript serves as the nervous system and muscles, handling dynamic behaviors, animations, and asynchronous server communications."
      },
      {
        "subheading": "3. VS Code Configuration & Productivity",
        "content": "Visual Studio Code is the world's most popular code editor. Key features covered include Emmet abbreviations for lightning-fast HTML scaffolding, the integrated terminal, split-screen editor layouts, and essential extensions such as 'Live Server' by Ritwick Dey. Live Server runs a local development server on port 5500 that automatically reloads your browser upon saving file changes."
      }
    ],
    "code_samples": [
      {
        "caption": "Basic HTML starter file created in VS Code",
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>My First Webpage</title>\n</head>\n<body>\n    <h1>Hello World! Web Development Begins Here</h1>\n    <p>This file is served locally via Live Server.</p>\n</body>\n</html>"
      }
    ],
    "key_takeaways": [
      "Web browsers only understand HTML, CSS, and JavaScript natively.",
      "Live Server eliminates manual browser refreshes by providing instant hot-reloading on port 5500.",
      "VS Code shortcuts: 'Ctrl + `' toggles the terminal, 'Alt + Click' adds multiple cursors, and '!' expands the full HTML5 boilerplate.",
      "Files should always be saved inside an organized project directory before opening in VS Code."
    ],
    "pitfalls": [
      "Opening the .html file by double-clicking it opens it via 'file://' protocol rather than 'http://', which breaks relative paths and Live Server reloading.",
      "Forgetting to save files before expecting updates in the browser (enable Auto Save in VS Code under File > Auto Save)."
    ],
    "quiz": [
      {
        "question": "What is the primary role of DNS in web browsing?",
        "answer": "DNS (Domain Name System) translates human-readable domain names (like example.com) into computer-routable IP addresses (like 93.184.216.34) so browsers can locate the hosting server."
      },
      {
        "question": "Why is the Live Server extension essential for beginners?",
        "answer": "It serves files over a local HTTP server (localhost:5500) and automatically refreshes the browser whenever code changes are saved, speeding up the feedback loop."
      }
    ]
  },
  "2": {
    "title": "Your First HTML Website",
    "category": "HTML Core Fundamentals",
    "overview": "This lecture guides students through creating their very first real HTML document from scratch. It explains why files are named index.html, demystifies tags, elements, and attributes, and demonstrates how to use the browser's developer tools (Inspect Element) to inspect and debug live webpage structure.",
    "theory": [
      {
        "subheading": "1. Why 'index.html' is the Universal Entrypoint",
        "content": "Web servers are preconfigured by default to look for a file named 'index.html' whenever a user navigates to a directory or root domain URL. Naming your homepage index.html ensures that visiting 'http://example.com/' automatically loads this file without requiring the user to type 'http://example.com/home.html'."
      },
      {
        "subheading": "2. Anatomical Breakdown of HTML Elements",
        "content": "An HTML element typically consists of an opening tag (<p>), inner text or nested content ('Hello'), and a closing tag (</p>). Some elements are 'self-closing' or 'void elements' (such as <br>, <hr>, and <img>) which do not encapsulate text and do not require a separate closing tag in HTML5."
      },
      {
        "subheading": "3. Mastering Browser Developer Tools",
        "content": "Pressing F12 or Right Click > Inspect in modern browsers opens Chrome DevTools. The Elements tab displays the live Document Object Model (DOM) tree. You can double click text to edit it in real-time, view applied CSS styles, and test design ideas before committing them to your source code."
      }
    ],
    "code_samples": [
      {
        "caption": "Basic tags: Headings, paragraphs, horizontal rules, and buttons",
        "code": "<h1>Welcome to My Coding Journey</h1>\n<hr>\n<p>HTML is easy to learn and provides the structure of every website.</p>\n<p>Click the button below to see an interactive element:</p>\n<button>Click Me!</button>"
      }
    ],
    "key_takeaways": [
      "Always name your project's main homepage 'index.html'.",
      "HTML is not case-sensitive, but lowercase tags and attribute names are the universal industry convention.",
      "Changes made inside the browser Inspect Element tool are temporary and reset when you reload."
    ],
    "pitfalls": [
      "Forgetting the forward slash '/' in closing tags (e.g. typing <p> instead of </p>), which causes elements to nest unintentionally.",
      "Using multiple spaces inside HTML text and expecting them to render\u2014browsers collapse consecutive whitespace into a single space."
    ],
    "quiz": [
      {
        "question": "What happens if you type five consecutive spaces inside a <p> tag in HTML?",
        "answer": "HTML collapses all consecutive whitespace characters (spaces, tabs, newlines) into a single space in the rendered output."
      },
      {
        "question": "What is the difference between an HTML tag and an HTML element?",
        "answer": "A tag is the markup token enclosed in angle brackets (e.g., <p> or </p>), whereas an element encompasses the opening tag, closing tag, attributes, and all content in between."
      }
    ]
  },
  "3": {
    "title": "Basic Structure of an HTML Website",
    "category": "HTML5 Boilerplate & Document Architecture",
    "overview": "This lecture dissects the mandatory architectural skeleton of every HTML5 document. The instructor meticulously unpacks <!DOCTYPE html>, the <html> root container, the <head> metadata registry, the responsive viewport tag, and the visible <body> container, teaching students how to write clean, standards-compliant markup.",
    "theory": [
      {
        "subheading": "1. The <!DOCTYPE html> Declaration",
        "content": "The <!DOCTYPE html> preamble is not an HTML tag; it is an instruction to the web browser indicating that the document is written in modern HTML5. Omitting it triggers 'Quirks Mode' in older browsers, where the browser attempts to emulate obsolete 1990s rendering engines, leading to layout bugs."
      },
      {
        "subheading": "2. The <head> vs <body> Dichotomy",
        "content": "An HTML document is strictly partitioned into two compartments: <head> holds metadata (data about data), page titles, character encodings, links to stylesheets, scripts, and SEO directives that are invisible on the webpage. The <body> contains all visible content that users interact with (text, images, forms, videos, and layouts)."
      },
      {
        "subheading": "3. The Viewport Meta Tag & Responsive Design",
        "content": "The tag <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> is critical for mobile responsiveness. It instructs mobile browsers to set the viewport width equal to the physical screen width of the device and initializes a 1:1 zoom ratio, preventing mobile browsers from shrinking desktop layouts."
      },
      {
        "subheading": "4. Character Encoding: UTF-8",
        "content": "<meta charset=\"UTF-8\"> ensures that your website supports virtually all human languages, international scripts, and Unicode emojis without corrupting characters into strange symbols (known as mojibake)."
      }
    ],
    "code_samples": [
      {
        "caption": "The standard HTML5 boilerplate generated via Emmet '!'",
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Lecture 3 - HTML Structure</title>\n    <!-- Stylesheets and metadata go here -->\n</head>\n<body>\n    <!-- All visible content goes here -->\n    <h1>Welcome to Standards-Compliant HTML5</h1>\n</body>\n</html>"
      }
    ],
    "key_takeaways": [
      "Typing '!' and pressing Tab/Enter in VS Code automatically expands the entire HTML5 structure.",
      "The <title> tag defines what appears on the browser tab and search engine result pages.",
      "Never place visible layout elements (like <h1> or <div>) inside the <head> element.",
      "The 'lang=\"en\"' attribute helps search engines and screen readers identify the language of the page."
    ],
    "pitfalls": [
      "Placing content tags like <p> or <button> inside <head>\u2014this violates HTML specifications.",
      "Deleting the viewport meta tag, which causes websites to render tiny and unreadable on smartphones."
    ],
    "quiz": [
      {
        "question": "What is the consequence of omitting <!DOCTYPE html>?",
        "answer": "Browsers may render the page in 'Quirks Mode', which alters CSS box calculations, typography, and layout rules to mimic legacy browsers."
      },
      {
        "question": "Where should the <meta charset='UTF-8'> tag be placed?",
        "answer": "Inside the <head> section, ideally as early as possible before any title or text content so the browser can decode bytes accurately."
      }
    ]
  },
  "4": {
    "title": "Heading, Paragraphs and Links",
    "category": "Content Semantics & Navigation",
    "overview": "This lecture dives into the primary textual building blocks of web pages. It covers heading hierarchy from h1 to h6, paragraph typography, and the transformative power of the anchor (<a>) tag for linking webpages across the internet, relative internal links, and opening links in new tabs.",
    "theory": [
      {
        "subheading": "1. Heading Hierarchy (h1 to h6)",
        "content": "HTML provides six levels of headings. <h1> represents the most important top-level page topic, while <h6> represents sub-sub-headings. Headings must be used to create an outline for screen readers and search engines, not simply to make text larger (styling should be handled by CSS). Crucially, a webpage should only have ONE <h1> tag."
      },
      {
        "subheading": "2. Paragraphs (<p>) and White Space",
        "content": "Paragraph elements are block-level containers. Browsers automatically append default top and bottom margins to separate paragraphs visually. Inside a paragraph, line breaks can be forced using <br>, while thematic transitions can be demarcated with <hr>."
      },
      {
        "subheading": "3. The Anchor Tag (<a>) & Hyperlinks",
        "content": "The anchor tag creates clickable hyperlinks using the 'href' (hypertext reference) attribute. It supports absolute URLs (https://google.com), relative URLs (about.html or ../contact.html), page fragment anchors (#section-id), and protocol handlers (mailto:info@site.com, tel:+123456789)."
      },
      {
        "subheading": "4. Target Attribute & Security",
        "content": "Setting target=\"_blank\" opens the destination link in a new browser tab. When doing so, always include rel=\"noopener noreferrer\" to prevent the linked page from accessing your window.opener object (a security exploit known as reverse tabnabbing)."
      }
    ],
    "code_samples": [
      {
        "caption": "Headings, paragraphs, and anchor tags with secure external links",
        "code": "<h1>Mastering HTML Text & Links</h1>\n<h2>Section 1: Navigating the Web</h2>\n<p>Click here to visit our <a href=\"about.html\">About Us</a> page.</p>\n<p>External resource: \n    <a href=\"https://wikipedia.org\" target=\"_blank\" rel=\"noopener noreferrer\">\n        Visit Wikipedia\n    </a>\n</p>"
      }
    ],
    "key_takeaways": [
      "Use exactly one <h1> per document to maintain SEO best practices.",
      "Do not skip heading levels (e.g. jumping from <h1> directly to <h3>).",
      "Use target=\"_blank\" judiciously so users don't get disoriented by unwanted tabs."
    ],
    "pitfalls": [
      "Using <h1> simply for large font sizes instead of semantic importance.",
      "Missing the 'href' attribute on anchor tags, rendering the link non-functional and inaccessible."
    ],
    "quiz": [
      {
        "question": "Why is rel='noopener noreferrer' recommended with target='_blank'?",
        "answer": "It prevents the newly opened page from accessing your original page's window object via JavaScript, closing a security vulnerability and protecting user performance."
      },
      {
        "question": "How do you link directly to a specific section on the same page?",
        "answer": "Assign an id to the target element (e.g. <h2 id='faq'>) and link to it using href='#faq'."
      }
    ]
  },
  "5": {
    "title": "Image, Lists, and Tables in HTML",
    "category": "Rich Media & Structured Data",
    "overview": "In this extensive lecture, students learn how to render graphic assets using <img>, organize structured information using ordered (<ol>) and unordered (<ul>) lists, and display tabular data using HTML5 tables with headers, rows, columns, and cell spanning.",
    "theory": [
      {
        "subheading": "1. Images (<img>) & Accessibility",
        "content": "The <img> tag is self-closing and requires two primary attributes: 'src' (the URL or relative file path to the image) and 'alt' (alternative descriptive text). The alt attribute is mandatory for screen readers (blind users) and displays if the image file fails to load. Adding loading='lazy' defers offscreen image loading, speeding up page speeds."
      },
      {
        "subheading": "2. Lists: Unordered, Ordered, and Definition",
        "content": "Unordered lists (<ul>) render bulleted lists using <li> (list items). Ordered lists (<ol>) render numbered lists (1, 2, 3 or A, B, C via type attribute). Definition lists (<dl>) structure terms (<dt>) and their corresponding definitions (<dd>), ideal for glossaries and metadata."
      },
      {
        "subheading": "3. Tables for Tabular Data",
        "content": "Tables display multidimensional datasets. Built using <table>, <thead> (table header), <tbody> (table body), <tr> (table row), <th> (header cell, bold and centered by default), and <td> (data cell). To merge cells horizontally, use 'colspan'; to merge vertically across rows, use 'rowspan'."
      }
    ],
    "code_samples": [
      {
        "caption": "Image embedding, nested list, and tabular data structure",
        "code": "<!-- Image with lazy loading and alt text -->\n<img src=\"assets/logo.png\" alt=\"Company Logo\" width=\"200\" height=\"80\" loading=\"lazy\">\n\n<!-- Nested Ordered and Unordered Lists -->\n<ul>\n    <li>Front-end Technologies\n        <ol>\n            <li>HTML5</li>\n            <li>CSS3</li>\n            <li>JavaScript</li>\n        </ol>\n    </li>\n</ul>\n\n<!-- Tabular data with colspan -->\n<table>\n    <thead>\n        <tr>\n            <th>Course</th>\n            <th>Duration</th>\n            <th>Difficulty</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <td>Web Dev Bootcamp</td>\n            <td>40 Hours</td>\n            <td>Beginner</td>\n        </tr>\n    </tbody>\n</table>"
      }
    ],
    "key_takeaways": [
      "Always include meaningful 'alt' descriptions on images (do not leave alt empty unless purely decorative).",
      "Never use <table> for page layouts; tables are strictly meant for displaying tabular datasets.",
      "Use 'colspan' to merge columns and 'rowspan' to merge rows in HTML tables."
    ],
    "pitfalls": [
      "Leaving out 'width' and 'height' attributes on images, which causes Cumulative Layout Shift (CLS) as images pop in.",
      "Putting text directly inside <ul> or <ol> without wrapping it in an <li> item."
    ],
    "quiz": [
      {
        "question": "What is the purpose of the 'alt' attribute on an <img> tag?",
        "answer": "It provides a textual fallback for screen readers and displays in the browser if the image file fails to load or connection is lost."
      },
      {
        "question": "How do you make a single table cell span across three columns?",
        "answer": "Add the attribute colspan='3' to the corresponding <th> or <td> element."
      }
    ]
  },
  "6": {
    "title": "SEO and Core Web Vitals in HTML",
    "category": "Search Engine Optimization & Web Performance",
    "overview": "This lecture uncovers how search engines crawl, parse, and index websites. The instructor explains the technical mechanics of on-page SEO, essential meta tags, social sharing Open Graph cards, and Google's Core Web Vitals performance benchmarks.",
    "theory": [
      {
        "subheading": "1. What is On-Page SEO?",
        "content": "Search Engine Optimization is the practice of optimizing website structure and content so web crawlers (like Googlebot) can discover, index, and rank pages higher in search queries. Key on-page signals include clear heading hierarchy, semantic HTML tags, clean URLs, and descriptive meta tags."
      },
      {
        "subheading": "2. Essential Meta Tags in <head>",
        "content": "The meta description (<meta name='description' content='...'>) provides the 150-160 character snippet shown beneath your page title in Google results. Open Graph tags (og:title, og:description, og:image) control how rich link previews render when shared on WhatsApp, LinkedIn, X/Twitter, or Discord."
      },
      {
        "subheading": "3. Google Core Web Vitals",
        "content": "Google evaluates web performance through three user experience metrics: Largest Contentful Paint (LCP - how fast main content loads, ideal < 2.5s), Cumulative Layout Shift (CLS - visual stability, preventing elements from shifting unexpectedly, ideal < 0.1), and Interaction to Next Paint (INP - responsiveness to clicks and input, ideal < 200ms)."
      }
    ],
    "code_samples": [
      {
        "caption": "Complete SEO and Open Graph meta configuration in <head>",
        "code": "<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Master Web Dev: Complete 2026 Guide</title>\n    <meta name=\"description\" content=\"Learn modern web development from HTML5 to React. Complete tutorials, projects, and interview preparation.\">\n    \n    <!-- Open Graph for Social Sharing -->\n    <meta property=\"og:title\" content=\"Master Web Dev\">\n    <meta property=\"og:description\" content=\"Learn modern web development from HTML5 to React.\">\n    <meta property=\"og:image\" content=\"https://example.com/preview.jpg\">\n    <meta property=\"og:url\" content=\"https://example.com\">\n    <link rel=\"canonical\" href=\"https://example.com\">\n</head>"
      }
    ],
    "key_takeaways": [
      "Keep meta descriptions between 140-160 characters to avoid truncation in search engine snippets.",
      "Open Graph images should ideally be 1200x630 pixels for sharp social media cards.",
      "Setting explicit dimensions on images and media prevents layout shifts and boosts your CLS score."
    ],
    "pitfalls": [
      "Stuffing repetitive keywords into meta tags (keyword stuffing), which triggers search engine penalties.",
      "Using generic titles like 'Home' or 'Untitled Page' instead of descriptive, branded titles."
    ],
    "quiz": [
      {
        "question": "What metric does CLS (Cumulative Layout Shift) measure?",
        "answer": "It measures visual stability\u2014whether page elements jump or shift position unexpectedly as fonts, images, or ads load."
      },
      {
        "question": "What is the role of Open Graph tags?",
        "answer": "They specify how a page's title, description, and thumbnail image preview appear when shared on social media and messaging apps."
      }
    ]
  },
  "7": {
    "title": "Forms and input tags in HTML",
    "category": "User Input & Form Handling",
    "overview": "This lecture explains how to capture user input, handle authentication, and submit data to web servers using HTML forms. It covers input types, validation attributes, labels, dropdowns, textareas, and the difference between GET and POST HTTP submission methods.",
    "theory": [
      {
        "subheading": "1. The <form> Architecture: Action and Method",
        "content": "The <form> element encapsulates all interactive inputs. The 'action' attribute designates the backend server endpoint that will process the payload. The 'method' specifies the HTTP verb: 'GET' appends form values directly to the URL query string (visible in address bar, ideal for search queries); 'POST' sends values hidden inside the HTTP request body (ideal for passwords, sensitive credentials, and file uploads)."
      },
      {
        "subheading": "2. The Importance of <label> and Accessibility",
        "content": "Every input should have an associated <label>. Using <label for='email-input'> binds the label to the input element with id='email-input'. This enables screen readers to announce the field clearly and allows users to click the text label to automatically focus or toggle the input."
      },
      {
        "subheading": "3. Input Types & Native Browser Validation",
        "content": "HTML5 offers specialized input types: text, email, password, number, date, checkbox, radio, color, and file. Native validation attributes (required, minlength, maxlength, min, max, pattern) allow browsers to enforce data integrity before triggering submission without requiring JavaScript."
      }
    ],
    "code_samples": [
      {
        "caption": "Complete accessible user registration form with validation",
        "code": "<form action=\"/api/register\" method=\"POST\">\n    <div>\n        <label for=\"username\">Full Name:</label>\n        <input type=\"text\" id=\"username\" name=\"fullname\" placeholder=\"Jane Doe\" required minlength=\"3\">\n    </div>\n    <div>\n        <label for=\"email\">Email Address:</label>\n        <input type=\"email\" id=\"email\" name=\"email\" placeholder=\"jane@example.com\" required>\n    </div>\n    <div>\n        <label for=\"pass\">Password:</label>\n        <input type=\"password\" id=\"pass\" name=\"password\" required minlength=\"8\">\n    </div>\n    <div>\n        <label for=\"role\">Select Role:</label>\n        <select id=\"role\" name=\"role\">\n            <option value=\"student\">Student</option>\n            <option value=\"developer\">Developer</option>\n        </select>\n    </div>\n    <button type=\"submit\">Create Account</button>\n</form>"
      }
    ],
    "key_takeaways": [
      "Never use GET method for passwords or sensitive user credentials.",
      "Every input must have a 'name' attribute, or its value will NOT be submitted to the server.",
      "Always pair inputs with <label> tags using matching 'for' and 'id' attributes."
    ],
    "pitfalls": [
      "Omitting the 'name' attribute on inputs (the server will receive an empty payload).",
      "Not grouping radio buttons with identical 'name' attributes, which prevents single-selection behavior."
    ],
    "quiz": [
      {
        "question": "Why should password forms always use method='POST' instead of 'GET'?",
        "answer": "GET appends all submitted data in plain text to the browser's URL query string, exposing passwords in browser history, logs, and bookmarks."
      },
      {
        "question": "What attribute links a <label> element to its corresponding <input>?",
        "answer": "The label's 'for' attribute must match the input's 'id' attribute."
      }
    ]
  },
  "8": {
    "title": "Inline & Block Elements in HTML",
    "category": "CSS Layout Mechanics & Display Models",
    "overview": "Understanding the visual geometry of HTML elements is essential for web design. This lecture clarifies the fundamental differences between Block-level elements and Inline elements, explaining how they interact with page flow, width, height, and margins.",
    "theory": [
      {
        "subheading": "1. Block-Level Elements",
        "content": "Block elements always begin on a new line and expand horizontally to occupy 100% of the available width of their parent container. They respect width, height, padding, and all four margins (top, bottom, left, right). Common block elements include <div>, <p>, <h1>-<h6>, <section>, <article>, and <ul>."
      },
      {
        "subheading": "2. Inline Elements",
        "content": "Inline elements do not start on a new line; they flow naturally alongside adjacent inline content (like words in a sentence). Their dimensions are strictly determined by their inner content. Crucially, inline elements ignore vertical margins (margin-top and margin-bottom) and cannot be assigned explicit width or height. Common inline elements include <span>, <a>, <strong>, <em>, and <code>."
      },
      {
        "subheading": "3. The <div> and <span> Utility Elements",
        "content": "<div> is a generic block container with no semantic meaning, used to group elements for CSS styling or layout grids. <span> is the generic inline equivalent, used to style a specific slice of text inside a paragraph without breaking into a new line."
      }
    ],
    "code_samples": [
      {
        "caption": "Contrasting block containers with inline text spans",
        "code": "<!-- Block element (starts on new line, full width) -->\n<div style=\"background: #e0f2fe; padding: 10px;\">\n    <h2>Block Container</h2>\n    <!-- Paragraph is also a block element -->\n    <p>This is a paragraph where <span style=\"color: #0284c7; font-weight: bold;\">this specific phrase</span> is wrapped in an inline span.</p>\n</div>\n\n<!-- Adjacent inline links stay on the same line -->\n<a href=\"#\">Link One</a>\n<a href=\"#\">Link Two</a>"
      }
    ],
    "key_takeaways": [
      "Block elements stack vertically on top of one another.",
      "Inline elements sit side-by-side horizontally until line length forces a wrap.",
      "You cannot set width or height on an inline element unless you change its display to block or inline-block."
    ],
    "pitfalls": [
      "Attempting to set margin-top or height on an inline <span> and wondering why nothing happens.",
      "Nesting a block element (like a <div>) inside an inline element (like a <span> or <a>), which invalidates HTML syntax."
    ],
    "quiz": [
      {
        "question": "Can you set width and height directly on a <span> element?",
        "answer": "No, because <span> is an inline element. Its dimensions are determined by its content unless its CSS display is set to inline-block or block."
      },
      {
        "question": "Which of these is a block-level element: <span>, <a>, <div>, or <strong>?",
        "answer": "<div> is the block-level element; the others are inline elements."
      }
    ]
  },
  "9": {
    "title": "Id & Classes in HTML",
    "category": "CSS Selectors & DOM Identification",
    "overview": "This lecture explains the primary targeting mechanisms in HTML: IDs and Classes. Students learn when to use unique IDs versus reusable classes, how CSS specificity calculates rules, and how to write clean, maintainable front-end code.",
    "theory": [
      {
        "subheading": "1. The 'id' Attribute: Unique Identifiers",
        "content": "The 'id' attribute must be unique across the entire HTML page\u2014no two elements can share the same ID. In CSS, IDs are selected using the hash symbol (#main-nav). IDs are also used for page fragment links (href='#top') and JavaScript lookups (document.getElementById)."
      },
      {
        "subheading": "2. The 'class' Attribute: Reusable Styling",
        "content": "Classes are reusable across as many elements as needed. In CSS, classes are selected using a period (.btn-primary). Multiple classes can be applied to a single HTML element by separating their names with spaces (class='btn btn-primary active'). This enables modular component design."
      },
      {
        "subheading": "3. CSS Specificity Hierarchy",
        "content": "When competing CSS rules target the same element, browsers resolve conflicts through specificity scoring: Inline styles (1000) > ID selectors (100) > Class selectors (10) > Element tag selectors (1). Because ID selectors have high specificity, modern CSS architectures strongly recommend using classes for styling."
      }
    ],
    "code_samples": [
      {
        "caption": "Combining multiple utility classes and unique element IDs",
        "code": "<!-- Unique ID for page navigation landmark -->\n<nav id=\"primary-navigation\">\n    <!-- Reusable component classes -->\n    <button class=\"btn btn-primary\">Submit</button>\n    <button class=\"btn btn-outline\">Cancel</button>\n</nav>\n\n<section id=\"about-section\" class=\"container py-4\">\n    <p class=\"text-muted\">Reusable class styling across sections.</p>\n</section>"
      }
    ],
    "key_takeaways": [
      "Use IDs only when an element is strictly unique (e.g. #navbar, #footer).",
      "Use classes for all repetitive styling, button states, cards, and grid systems.",
      "An element can have only ONE ID, but MULTIPLE classes."
    ],
    "pitfalls": [
      "Reusing the same ID on multiple elements (violates HTML5 spec and breaks JavaScript lookups).",
      "Starting ID or class names with a number (e.g. class='1card' is invalid in CSS)."
    ],
    "quiz": [
      {
        "question": "If an element has an ID style and a class style defining color, which wins?",
        "answer": "The ID selector wins because ID has a higher CSS specificity score (100) compared to a class selector (10)."
      },
      {
        "question": "How do you assign two classes named 'card' and 'dark-theme' to a single div?",
        "answer": "Separate the class names with a space inside the attribute: class='card dark-theme'."
      }
    ]
  },
  "10": {
    "title": "Video, Audio & Media in HTML",
    "category": "HTML5 Multimedia & Streaming",
    "overview": "This lecture covers embedding native video and audio directly into webpages without relying on third-party plugins. The instructor explains media container formats, codec compatibility, controls, fallback source tags, and embedding third-party players via iframes.",
    "theory": [
      {
        "subheading": "1. The HTML5 <video> Element",
        "content": "The <video> element provides built-in media playback. Crucial attributes include 'controls' (displays play/pause, seekbar, and volume UI), 'poster' (an image thumbnail shown before playback starts), 'width', 'height', 'loop' (repeats playback), and 'preload' (instructs the browser how much data to buffer)."
      },
      {
        "subheading": "2. Modern Autoplay Policies & Muting",
        "content": "Modern browsers (Chrome, Safari) strictly block video autoplay with audio enabled to protect user experience. To make a video autoplay automatically in the background, you MUST include the 'muted' attribute alongside 'autoplay' (autoplay muted playsinline)."
      },
      {
        "subheading": "3. The <source> Tag & Codec Fallbacks",
        "content": "Different browsers support different audio/video codecs. By wrapping multiple <source> elements inside <video> or <audio>, you allow the browser to pick the first compatible format (e.g. WebM for modern browsers, MP4 for broad compatibility)."
      },
      {
        "subheading": "4. Embedding External Media via <iframe>",
        "content": "To embed YouTube videos or interactive maps, browsers use an <iframe> (inline frame), which nests an independent HTML browsing context inside your webpage. Adding loading='lazy' ensures iframes do not block initial page loads."
      }
    ],
    "code_samples": [
      {
        "caption": "Cross-browser HTML5 video with fallbacks and YouTube iframe",
        "code": "<!-- Native HTML5 Video with multiple formats -->\n<video controls poster=\"thumbnail.jpg\" width=\"640\" height=\"360\">\n    <source src=\"video.mp4\" type=\"video/mp4\">\n    <source src=\"video.webm\" type=\"video/webm\">\n    Your browser does not support the video tag.\n</video>\n\n<!-- Responsive YouTube Embed via iframe -->\n<iframe \n    width=\"560\" \n    height=\"315\" \n    src=\"https://www.youtube-nocookie.com/embed/Edsxf_NBFrw\" \n    title=\"Lecture Player\"\n    allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" \n    allowfullscreen>\n</iframe>"
      }
    ],
    "key_takeaways": [
      "Always include the 'controls' attribute unless building custom JS media controls.",
      "Videos will NOT autoplay unless the 'muted' attribute is also present.",
      "Provide fallback text inside <video> tags for legacy browsers."
    ],
    "pitfalls": [
      "Hosting massive 1GB video files directly on web servers instead of streaming via compressed formats or CDN video providers."
    ],
    "quiz": [
      {
        "question": "Why won't a video with the 'autoplay' attribute play automatically on modern browsers?",
        "answer": "Modern browsers require the 'muted' attribute to be present alongside 'autoplay' to prevent unsolicited audio from playing."
      },
      {
        "question": "What is the purpose of nesting multiple <source> tags inside a <video> element?",
        "answer": "It provides format fallbacks (like MP4 and WebM) so browsers can choose the best codec they support."
      }
    ]
  },
  "11": {
    "title": "Semantic Tags in HTML",
    "category": "HTML5 Semantic Architecture",
    "overview": "This lecture explains why 'semantic markup' is a cornerstone of professional web development. Instead of wrapping everything inside generic <div> elements ('div soup'), students learn to structure documents using semantic landmarks like header, nav, main, article, section, aside, and footer.",
    "theory": [
      {
        "subheading": "1. What is Semantic HTML?",
        "content": "A semantic element clearly describes its meaning to both the browser and the developer. For example, <header> clearly denotes a banner or introductory section, whereas <div> reveals nothing about its contents. Semantic tags improve code readability, SEO ranking, and accessibility for assistive technologies."
      },
      {
        "subheading": "2. Key HTML5 Landmark Elements",
        "content": "- <header>: Introductory branding, logo, and main headings.\n- <nav>: Primary site navigation links.\n- <main>: The dominant, unique central content of the document (only one <main> per page).\n- <section>: A thematic grouping of content, typically introduced with a heading.\n- <article>: A self-contained piece of content that could be distributed independently (e.g. blog post, card, news article).\n- <aside>: Ancillary content, sidebars, related posts, or pull quotes.\n- <footer>: Concluding section containing copyright, legal links, author info."
      },
      {
        "subheading": "3. Accessibility & SEO Benefits",
        "content": "Screen readers allow visually impaired users to jump directly to page landmarks (e.g. 'Jump to Navigation' or 'Jump to Main Content'). Search engine bots use semantic tags to identify what is core editorial content versus boilerplate navigation."
      }
    ],
    "code_samples": [
      {
        "caption": "Semantic webpage architecture avoiding 'div soup'",
        "code": "<header>\n    <h1>CodeAcademy</h1>\n    <nav>\n        <a href=\"#courses\">Courses</a>\n        <a href=\"#pricing\">Pricing</a>\n    </nav>\n</header>\n\n<main>\n    <article>\n        <h2>Why Learn Semantic HTML5?</h2>\n        <p>Semantic tags boost SEO and screen reader accessibility...</p>\n    </article>\n    \n    <aside>\n        <h3>Related Articles</h3>\n        <p>Top 10 CSS Tricks in 2026</p>\n    </aside>\n</main>\n\n<footer>\n    <p>&copy; 2026 CodeAcademy. All rights reserved.</p>\n</footer>"
      }
    ],
    "key_takeaways": [
      "Use only ONE <main> element per HTML page.",
      "Choose <article> for standalone reusable items, and <section> for thematic groupings with a heading.",
      "Avoid using <div> when a semantic element (like <nav> or <footer>) better describes the role."
    ],
    "pitfalls": [
      "Using <section> purely for visual styling without including a heading tag (<h1>-<h6>).",
      "Nesting multiple <main> tags on the same webpage."
    ],
    "quiz": [
      {
        "question": "What is the key difference between <article> and <section>?",
        "answer": "<article> is self-contained and could stand alone independently (like a blog post), whereas <section> is a thematic grouping of related content that is part of a larger whole."
      },
      {
        "question": "How many <main> tags should exist in an HTML document?",
        "answer": "Exactly one, representing the unique primary content of that specific document."
      }
    ]
  },
  "12": {
    "title": "Exercise 1 - Pure HTML Media Player",
    "category": "Practical Challenge & Project Building",
    "overview": "In this hands-on project exercise, students apply everything learned so far to build an interactive audio and video media player website using strictly pure HTML\u2014without writing a single line of CSS or JavaScript.",
    "theory": [
      {
        "subheading": "1. Project Objective & Constraints",
        "content": "The challenge requires creating a multi-section media hub. The page must include a main video player with native controls, a podcast/music audio player, a structured playlist linking to different timestamps or tracks, song lyrics and artist biographies, and a feedback submission form."
      },
      {
        "subheading": "2. Structural Planning",
        "content": "Students learn to architect the document before coding: organizing the header branding, grouping media players inside a semantic <main> region, using lists (<ol> and <ul>) for the tracklist, and using a table for album metadata."
      }
    ],
    "code_samples": [
      {
        "caption": "Pure HTML media hub structure",
        "code": "<header>\n    <h1>Sigma Audio & Video Hub</h1>\n</header>\n<main>\n    <section>\n        <h2>Featured Video Lecture</h2>\n        <video controls width=\"500\" poster=\"cover.jpg\">\n            <source src=\"lecture.mp4\" type=\"video/mp4\">\n        </video>\n    </section>\n    <section>\n        <h2>Track Playlist</h2>\n        <ol>\n            <li>Track 1 - Ambient Beats <audio controls src=\"track1.mp3\"></audio></li>\n            <li>Track 2 - Coding Lo-Fi <audio controls src=\"track2.mp3\"></audio></li>\n        </ol>\n    </section>\n</main>"
      }
    ],
    "key_takeaways": [
      "Building projects with pure HTML reinforces the importance of document structure before aesthetics.",
      "Native HTML controls provide surprisingly rich built-in accessibility."
    ],
    "pitfalls": [
      "Relying on styling hacks before finalizing semantic hierarchy."
    ],
    "quiz": [
      {
        "question": "Why is it valuable to build pure HTML projects before learning CSS?",
        "answer": "It ensures developers understand semantic markup, accessibility, and content hierarchy without getting distracted by visual presentation."
      }
    ]
  },
  "13": {
    "title": "Entities, Code tag and more on HTML",
    "category": "HTML Text Formatting & Special Characters",
    "overview": "This lecture explains how to display reserved programming characters in HTML, format source code snippets, and use advanced typographic formatting elements like pre, code, kbd, and samp.",
    "theory": [
      {
        "subheading": "1. HTML Entities: Escaping Reserved Symbols",
        "content": "Characters like '<' and '>' are reserved in HTML because browsers interpret them as the beginning and end of tags. To display these literal symbols on your page, you must use HTML entities: '&lt;' for less-than (<), '&gt;' for greater-than (>), '&amp;' for ampersand (&), '&quot;' for quotes (\"), and '&copy;' for the copyright sign (\u00a9)."
      },
      {
        "subheading": "2. Rendering Programming Code: <code> and <pre>",
        "content": "The <code> tag formats text in a monospace font representing source code. However, like other inline elements, it collapses whitespace. To preserve indentation, spaces, and line breaks, wrap your code in a <pre> (preformatted) block: <pre><code>...</code></pre>."
      },
      {
        "subheading": "3. Semantic Keyboard & Sample Output",
        "content": "- <kbd>: Represents user keyboard input (e.g. <kbd>Ctrl</kbd> + <kbd>C</kbd>).\n- <samp>: Represents sample output from a computer program or console.\n- <var>: Represents a mathematical or programming variable.\n- <del> and <ins>: Represent deleted and inserted editorial changes."
      }
    ],
    "code_samples": [
      {
        "caption": "Using HTML entities and preformatted code blocks",
        "code": "<!-- HTML entities for reserved characters -->\n<p>To start an HTML document, write &lt;!DOCTYPE html&gt; at the top.</p>\n<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save your work.</p>\n\n<!-- Preformatted code block preserving indentation -->\n<pre><code>\nfunction calculateArea(width, height) {\n    return width * height;\n}\nconsole.log(calculateArea(5, 10)); // Output: 50\n</code></pre>"
      }
    ],
    "key_takeaways": [
      "Always use '&lt;' and '&gt;' when writing HTML tutorials or displaying code on a webpage.",
      "Use <pre><code> together for multiline syntax-highlighted code blocks.",
      "Use <kbd> for keyboard shortcut documentation."
    ],
    "pitfalls": [
      "Writing raw '<script>' inside a paragraph, which can execute unintended JavaScript instead of showing text."
    ],
    "quiz": [
      {
        "question": "What entity represents the ampersand symbol '&'?",
        "answer": "&amp;"
      },
      {
        "question": "Why should <pre> be used in conjunction with <code>?",
        "answer": "<code> provides monospace font semantics, while <pre> preserves indentation, spaces, and line breaks."
      }
    ]
  },
  "14": {
    "title": "Introduction to CSS",
    "category": "CSS Presentation Layer & Architecture",
    "overview": "This lecture marks the exciting transition into Cascading Style Sheets (CSS). The instructor explains what CSS is, how the browser applies visual styling to the HTML DOM tree, CSS syntax rule sets, and basic color, typography, and border properties.",
    "theory": [
      {
        "subheading": "1. What is CSS & Separation of Concerns",
        "content": "CSS is a stylesheet language used to describe the visual presentation and layout of an HTML document. Web standards enforce a clean separation of concerns: HTML handles structure, CSS controls design and responsive aesthetics, and JavaScript manages behavior."
      },
      {
        "subheading": "2. CSS Rule Anatomy",
        "content": "A CSS rule consists of a Selector and a Declaration Block. The selector points to the HTML element you want to style (e.g. 'h1'). The declaration block is wrapped in curly braces { } and contains one or more declarations consisting of a property name ('color'), a colon (:), a value ('#2563eb'), and a terminating semicolon (;)."
      },
      {
        "subheading": "3. The Browser Render Pipeline",
        "content": "When a page loads, the browser parses HTML to construct the DOM (Document Object Model) and parses CSS to construct the CSSOM (CSS Object Model). It merges both into a Render Tree, calculates layout geometry for every element, and paints pixels onto the screen."
      }
    ],
    "code_samples": [
      {
        "caption": "Basic CSS syntax rule set",
        "code": "/* Selector targeting all h1 elements */\nh1 {\n    color: #1e293b;            /* Text color */\n    background-color: #f1f5f9; /* Background */\n    font-family: 'Inter', sans-serif;\n    font-size: 28px;\n    text-align: center;\n    padding: 16px;\n    border-radius: 8px;\n}"
      }
    ],
    "key_takeaways": [
      "Every declaration MUST end with a semicolon ';'.",
      "Color values can be expressed via color names ('red'), hexadecimal ('#3b82f6'), rgb/rgba ('rgba(0,0,0,0.5)'), or hsl."
    ],
    "pitfalls": [
      "Forgetting the terminating semicolon on a CSS property, which breaks all subsequent declarations in that block."
    ],
    "quiz": [
      {
        "question": "What are the two main parts of a CSS rule?",
        "answer": "The Selector (which targets elements) and the Declaration Block (enclosed in curly braces containing properties and values)."
      },
      {
        "question": "What does CSSOM stand for?",
        "answer": "CSS Object Model, the tree of styles constructed by the browser to match against the HTML DOM tree."
      }
    ]
  },
  "15": {
    "title": "Inline, Internal & External CSS",
    "category": "CSS Cascading & Inclusion Strategies",
    "overview": "This lecture explains the three distinct methods of injecting CSS into webpages: Inline styles, Internal style blocks, and External stylesheets. Students learn about the cascade, precedence rules, browser caching benefits, and why external CSS is the golden standard.",
    "theory": [
      {
        "subheading": "1. The Three Methods of Adding CSS",
        "content": "1. Inline CSS: Applied directly on an HTML element via style='...' attribute. Highest specificity, but causes code clutter.\n2. Internal CSS: Placed inside a <style> element in the document's <head>. Good for single-page email templates.\n3. External CSS: Written in a separate .css file and linked via <link rel='stylesheet' href='style.css'> in <head>. The professional standard for modern web architecture."
      },
      {
        "subheading": "2. Precedence & The Cascade",
        "content": "If conflicting rules target the same element with equal specificity, the rule applied latest in the file cascade wins. Inline styles override both internal and external styles. The '!important' keyword forcefully overrides all specificity rules, but should be avoided as it creates brittle stylesheets."
      },
      {
        "subheading": "3. Browser Caching of External CSS",
        "content": "External stylesheets are downloaded once by the browser and cached locally. When the user visits other pages across the same site, the browser loads the cached CSS instantly without making new network requests, resulting in dramatically faster page loads."
      }
    ],
    "code_samples": [
      {
        "caption": "Linking an external stylesheet in HTML head",
        "code": "<head>\n    <meta charset=\"UTF-8\">\n    <title>Cascading Styles</title>\n    <!-- External stylesheet: best practice -->\n    <link rel=\"stylesheet\" href=\"styles/main.css\">\n    \n    <!-- Internal style tag for page-specific overrides -->\n    <style>\n        .hero-banner {\n            background-color: #0f172a;\n            color: white;\n        }\n    </style>\n</head>\n<body>\n    <!-- Inline style: use sparingly -->\n    <p style=\"color: crimson;\">Emergency alert message</p>\n</body>"
      }
    ],
    "key_takeaways": [
      "Always use external stylesheets for production websites to maximize code reusability and caching.",
      "The <link> tag for external CSS belongs in the <head> section.",
      "Avoid '!important' because it makes debugging CSS conflicts notoriously difficult."
    ],
    "pitfalls": [
      "Using inline styles for general design, making it impossible to change sitewide themes in one place."
    ],
    "quiz": [
      {
        "question": "Which has higher priority: an inline style or a style in an external CSS file?",
        "answer": "An inline style has higher priority (specificity score of 1000) and will override rules in external stylesheets."
      },
      {
        "question": "Why does external CSS improve website performance?",
        "answer": "Browsers cache the external .css file locally, so subsequent pages load instantly without re-downloading styling rules."
      }
    ]
  },
  "16": {
    "title": "Exercise 1 - Solution & Shoutouts",
    "category": "Code Review & Refactoring",
    "overview": "In this review session, the instructor provides a thorough solution walkthrough for Exercise 1 (Pure HTML Media Player). The lecture highlights best coding practices, cleans up common student pitfalls, and demonstrates refactoring techniques for clean indentation and semantics.",
    "theory": [
      {
        "subheading": "1. Analyzing the Reference Solution",
        "content": "The instructor walks through clean markup for an audio/video portal. Special attention is paid to using semantic landmarks, consistent lowercase attributes, quoting all attribute values, and formatting nested tags with 4-space or 2-space indentation."
      },
      {
        "subheading": "2. Common Student Bugs & Anti-Patterns",
        "content": "Common issues uncovered in community submissions: unclosed tags causing layout collapse, missing 'controls' attribute on audio elements, duplicate IDs on form inputs, and mixing content tags inside the <head> container."
      }
    ],
    "code_samples": [
      {
        "caption": "Refactored solution snippet for media playlist",
        "code": "<section id=\"playlist-section\" aria-label=\"Media Playlist\">\n    <h3>Course Audio Tracks</h3>\n    <ul>\n        <li>\n            <span>01. Web Architecture Overview</span>\n            <audio controls preload=\"metadata\">\n                <source src=\"audio/lesson1.mp3\" type=\"audio/mpeg\">\n            </audio>\n        </li>\n    </ul>\n</section>"
      }
    ],
    "key_takeaways": [
      "Consistent indentation is the mark of a professional software engineer.",
      "Always validate HTML markup using the W3C Markup Validation Service."
    ],
    "pitfalls": [
      "Neglecting accessibility attributes like 'aria-label' or 'alt' when building media UI."
    ],
    "quiz": [
      {
        "question": "What tool can you use to test if your HTML conforms to web standards?",
        "answer": "The official W3C Markup Validation Service (validator.w3.org)."
      }
    ]
  },
  "17": {
    "title": "CSS Selectors MasterClass",
    "category": "Advanced CSS Targeting & Combinators",
    "overview": "This deep-dive masterclass covers the full spectrum of CSS selectors. Students master simple selectors, descendant and child combinators, sibling selectors, attribute selectors, pseudo-classes (like :hover, :focus, :nth-child), and pseudo-elements (like ::before, ::after).",
    "theory": [
      {
        "subheading": "1. Combinator Selectors",
        "content": "- Descendant Selector ('div p'): Targets any <p> anywhere inside a <div>, regardless of nesting depth.\n- Child Selector ('div > p'): Targets only direct children <p> immediately nested inside a <div>.\n- Adjacent Sibling ('h2 + p'): Targets the first <p> that immediately follows an <h2>.\n- General Sibling ('h2 ~ p'): Targets all sibling <p> elements that follow an <h2>."
      },
      {
        "subheading": "2. Attribute Selectors",
        "content": "CSS allows targeting elements based on attribute values:\n- input[type='text']: Selects inputs with type text.\n- a[href^='https']: Selects links whose URL starts with 'https' (secure links).\n- a[href$='.pdf']: Selects links whose URL ends in '.pdf' (downloadable documents).\n- a[class*='btn']: Selects elements whose class name contains 'btn'."
      },
      {
        "subheading": "3. Pseudo-Classes & Pseudo-Elements",
        "content": "- Pseudo-classes define element states: :hover (cursor hover), :active (clicked), :focus (focused by tab/click), :visited, and structural selectors like :first-child, :last-child, :nth-child(odd), :nth-child(2n).\n- Pseudo-elements style specific parts of an element: ::before and ::after insert cosmetic content via the 'content' property; ::first-letter and ::selection customize user highlight colors."
      }
    ],
    "code_samples": [
      {
        "caption": "Advanced combinators, attribute matching, and pseudo-classes",
        "code": "/* Child combinator: only direct children */\n.card-container > .card {\n    border: 1px solid #e2e8f0;\n}\n\n/* Attribute selector: style PDF links with an icon */\na[href$='.pdf'] {\n    color: #b91c1c;\n    font-weight: 500;\n}\n\n/* Alternating zebra striping with nth-child */\ntr:nth-child(even) {\n    background-color: #f8fafc;\n}\n\n/* Interactive hover state */\n.btn:hover {\n    transform: translateY(-2px);\n    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n}"
      }
    ],
    "key_takeaways": [
      "Use '>' when you only want to style direct children and prevent styling from bleeding into nested sub-elements.",
      ":nth-child(odd/even) makes zebra-striped tables effortless without adding extra classes.",
      "::before and ::after require a 'content: \"\"' property to render."
    ],
    "pitfalls": [
      "Confusing ':nth-child()' (counts all sibling elements) with ':nth-of-type()' (counts only siblings of the matching tag type)."
    ],
    "quiz": [
      {
        "question": "What is the difference between 'ul li' and 'ul > li'?",
        "answer": "'ul li' selects all <li> elements at any depth inside the <ul>, whereas 'ul > li' only selects <li> elements that are direct children."
      },
      {
        "question": "Which selector targets every alternating even row in a table?",
        "answer": "tr:nth-child(even) or tr:nth-child(2n)."
      }
    ]
  },
  "18": {
    "title": "CSS Box Model - Margin, Padding & Borders",
    "category": "Core Layout Fundamentals",
    "overview": "The CSS Box Model is the foundation of all web layout. This lecture demystifies the four layers of every element: Content, Padding, Border, and Margin. The instructor explains margin collapse, the box-sizing property, and the universal border-box reset.",
    "theory": [
      {
        "subheading": "1. The Four Layers of the Box Model",
        "content": "Every single element on a webpage is rendered as a rectangular box comprising four concentric layers:\n1. Content: The actual text, image, or media dimensions (set by width and height).\n2. Padding: Transparent internal breathing room between the content and the border.\n3. Border: The perimeter line surrounding the padding (set by width, style, and color).\n4. Margin: Transparent external buffer space separating this element from neighboring elements."
      },
      {
        "subheading": "2. Shorthand Notation for Margin and Padding",
        "content": "- 4 values: margin: 10px 20px 15px 5px; (Top, Right, Bottom, Left - clockwise).\n- 2 values: margin: 10px 20px; (Top/Bottom, Left/Right).\n- Auto margins: 'margin: 0 auto;' automatically centers a block-level element with an explicit width horizontally inside its parent."
      },
      {
        "subheading": "3. The Box-Sizing Revolution (border-box)",
        "content": "By default in CSS, box-sizing is 'content-box'. In this mode, if you set width: 300px, padding: 20px, and border: 2px, the total physical width on screen becomes 344px (300 + 40 + 4), which constantly breaks grid layouts! Setting 'box-sizing: border-box' forces the padding and border to be absorbed INSIDE the 300px width."
      },
      {
        "subheading": "4. Margin Collapse Explained",
        "content": "When two vertical block margins touch (e.g. bottom margin of paragraph 1 touches top margin of paragraph 2), they do NOT add together. Instead, they 'collapse' into a single margin equal to the larger of the two values."
      }
    ],
    "code_samples": [
      {
        "caption": "The universal CSS reset and centered card layout",
        "code": "/* Universal border-box reset: industry standard */\n*, *::before, *::after {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n}\n\n/* Centered card with padding and border */\n.card {\n    width: 400px;\n    margin: 40px auto;        /* 40px vertical, auto-centered horizontally */\n    padding: 24px;            /* 24px internal breathing room */\n    border: 2px solid #cbd5e1;\n    border-radius: 12px;\n    background-color: #ffffff;\n}"
      }
    ],
    "key_takeaways": [
      "Always include the universal 'box-sizing: border-box' reset at the very top of your CSS files.",
      "'margin: 0 auto' only centers block elements that have an explicit width set.",
      "Vertical margins collapse; horizontal margins never collapse."
    ],
    "pitfalls": [
      "Leaving box-sizing as 'content-box', causing elements with 100% width and padding to overflow off the screen horizontally."
    ],
    "quiz": [
      {
        "question": "What is the total width of an element with width: 200px, padding: 20px, and border: 5px when box-sizing is border-box?",
        "answer": "Exactly 200px. The padding (20px each side) and border (5px each side) are subtracted from the interior content area."
      },
      {
        "question": "What is margin collapse in CSS?",
        "answer": "When two vertical block margins meet, they collapse into a single margin equal to the largest margin value, rather than summing together."
      }
    ]
  }
};
