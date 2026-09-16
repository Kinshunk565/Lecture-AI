export interface CurriculumTopic {
  subheading: string;
  content: string;
}

export interface CodeSample {
  caption: string;
  code: string;
}

export interface ReferenceItem {
  item: string;
  type: string;
  description: string;
}

export interface MilestoneItem {
  time: string;
  text: string;
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
  reference_table: ReferenceItem[];
  milestones: MilestoneItem[];
  key_takeaways: string[];
  pitfalls: string[];
  exercise: string;
  quiz: QuizItem[];
}

export const LECTURE_CURRICULUM: Record<string, LectureCurriculum> = {
  "1": {
    "title": "Installing VS Code & How Websites Work",
    "category": "Foundations & Web Architecture",
    "overview": "This lecture provides an in-depth introduction to the underlying mechanics of the World Wide Web and walks through setting up a professional front-end development environment. The instructor demystifies how web browsers fetch content over the internet, explains the client-server relationship, introduces DNS resolution and IP routing, compares the roles of HTML, CSS, and JavaScript, and guides students through installing Visual Studio Code with productivity extensions.",
    "theory": [
      {
        "subheading": "1. The Client-Server Architecture & HTTP Request-Response Lifecycle",
        "content": "Every internet interaction follows the Client-Server model. The Client is the device and browser (Chrome, Safari, Brave) requesting web pages. The Server is a specialized computer connected 24/7 to the internet that stores web files (HTML, CSS, images, databases). When you enter a web address (e.g. https://codewithharry.com), the browser issues an HTTP/HTTPS GET request across the internet. The server receives this request, locates the requested files, and streams back an HTTP response containing the raw markup, styling, and scripts. The browser engine then parses and renders this code into interactive visual pixels."
      },
      {
        "subheading": "2. Domain Names, DNS (Domain Name System), and IP Addresses",
        "content": "Computers do not natively understand domain names like 'google.com'; they communicate via numerical IP (Internet Protocol) addresses like 142.250.190.46 (IPv4) or 2607:f8b0:4005:: (IPv6). The Domain Name System (DNS) functions as the decentralized phonebook of the internet. When you type a URL, your operating system first queries local and ISP DNS resolvers to translate the human-readable domain into the server's numeric IP address before establishing a TCP/TLS handshake."
      },
      {
        "subheading": "3. The Triad of Web Technologies: HTML, CSS, and JavaScript",
        "content": "Modern web development is built upon three distinct layers:\n\u2022 HTML (HyperText Markup Language): The structural skeleton that defines headings, text, forms, images, and semantic sections.\n\u2022 CSS (Cascading Style Sheets): The aesthetic presentation layer controlling colors, typography, layout grids, animations, and responsive breakpoints.\n\u2022 JavaScript: The programming logic layer providing interactivity, dynamic DOM updates, animations, and asynchronous server API communication."
      },
      {
        "subheading": "4. VS Code Environment Setup & Essential Extensions",
        "content": "Visual Studio Code is the industry-standard code editor developed by Microsoft. In this lecture, students learn to install VS Code and supercharge it with vital web extensions:\n\u2022 Live Server (by Ritwick Dey): Spawns a local development server at http://127.0.0.1:5500 that monitors your project folder and automatically hot-reloads the browser upon saving files.\n\u2022 Auto Rename Tag: Automatically updates matching HTML closing tags when editing an opening tag.\n\u2022 Prettier - Code Formatter: Enforces consistent, clean code indentation on every save."
      }
    ],
    "code_samples": [
      {
        "caption": "Starter HTML5 document scaffolded in VS Code with Emmet",
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Lecture 1: My Development Environment</title>\n</head>\n<body>\n    <!-- Main heading explaining the client-server model -->\n    <h1>Welcome to the Sigma Web Development Course</h1>\n    <p>This file is served locally via Live Server on port 5500.</p>\n    <button onclick=\"alert('JavaScript execution verified!')\">Test Interactivity</button>\n</body>\n</html>"
      }
    ],
    "reference_table": [
      {
        "item": "Live Server",
        "type": "VS Code Extension",
        "description": "Runs a local HTTP server with automatic browser live reloading on port 5500."
      },
      {
        "item": "Ctrl + `",
        "type": "Keyboard Shortcut",
        "description": "Toggles the integrated terminal inside VS Code."
      },
      {
        "item": "Alt + Click",
        "type": "Editor Shortcut",
        "description": "Creates multiple simultaneous editing cursors for batch editing."
      },
      {
        "item": "Emmet '!'",
        "type": "HTML Snippet",
        "description": "Expands the full HTML5 standards boilerplate with one keystroke."
      },
      {
        "item": "DNS",
        "type": "Network Protocol",
        "description": "Translates human-readable domain names into routable numerical IP addresses."
      }
    ],
    "key_takeaways": [
      "Web browsers only render HTML, CSS, and JavaScript natively; all backend languages ultimately compile or serve these three.",
      "Always serve local development files through an HTTP server (like Live Server) rather than double-clicking file:// paths.",
      "Auto Save should be toggled on in VS Code (File > Auto Save) to maintain constant synchronization with the browser.",
      "Organize project files into a dedicated workspace folder before opening in VS Code."
    ],
    "pitfalls": [
      "Double-clicking HTML files opens them via the file:// protocol, which disables CORS, breaks relative root paths, and prevents Live Server hot-reloads.",
      "Editing files without saving changes, leading beginners to wonder why their browser output never updates."
    ],
    "exercise": "Create a new folder named 'web_dev_journey' on your computer. Open it in VS Code, create a file named 'index.html', use the Emmet '!' shortcut to generate the boilerplate, add an <h1> tag with your name and a paragraph detailing your coding goals, and launch it using Live Server.",
    "quiz": [
      {
        "question": "What is the specific role of the Domain Name System (DNS) in loading a website?",
        "answer": "DNS acts as the internet's directory. When a user enters a domain name like 'example.com', DNS queries name servers to resolve the domain into the target server's numerical IP address (e.g. 93.184.216.34) so the browser can open a connection."
      },
      {
        "question": "Why is the Live Server extension strongly recommended over opening files directly?",
        "answer": "Live Server hosts files over an actual HTTP protocol (http://localhost:5500) and injects a WebSocket script that automatically refreshes the browser the instant you save changes in VS Code."
      },
      {
        "question": "Explain the distinct roles of HTML, CSS, and JavaScript using the analogy of a house.",
        "answer": "HTML is the bricks, mortar, beams, and structural walls of the house; CSS is the paint, wallpaper, interior decor, and lighting; JavaScript is the electrical wiring, plumbing, and smart home automation that makes doors open and lights respond to switches."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "From today's video, we will start the Sigma Web Development course."
      },
      {
        "time": "04:59",
        "text": "I will not browse here with color themes."
      },
      {
        "time": "07:35",
        "text": "This file is also made here."
      },
      {
        "time": "10:01",
        "text": "What is screencast mode."
      },
      {
        "time": "13:16",
        "text": "how to show me, this is the job of the browser"
      },
      {
        "time": "19:05",
        "text": "and html is a skeleton"
      },
      {
        "time": "25:05",
        "text": "we have some people"
      }
    ]
  },
  "2": {
    "title": "Your First HTML Website",
    "category": "HTML Core Fundamentals",
    "overview": "This lecture guides students through creating, editing, and rendering their very first real HTML website. The instructor explains why websites must have an index.html file, breaks down the anatomy of HTML tags, elements, and attributes, and demonstrates how to inspect, test, and debug live web pages using the browser's Inspect Element Developer Tools.",
    "theory": [
      {
        "subheading": "1. Why 'index.html' is the Universal Web Entrypoint",
        "content": "By international web server convention (Apache, Nginx, Node.js, Vercel, Netlify), when a client requests a domain or folder URL without specifying a file (e.g. https://mysite.com/), the server searches for and serves 'index.html' by default. If your homepage is named 'home.html' or 'page.html', visitors to your root URL will see a 403 Forbidden or 404 Not Found error unless explicitly routed."
      },
      {
        "subheading": "2. Anatomical Breakdown: Tags vs Elements vs Attributes",
        "content": "\u2022 Tag: The opening or closing markup token enclosed in angle brackets: <p> (opening) and </p> (closing).\n\u2022 Element: The complete unit comprising the opening tag, closing tag, and all encapsulated content: <p>Welcome to Sigma!</p>.\n\u2022 Attribute: Key-value metadata placed inside opening tags that modify element behavior or styling: <a href='https://google.com' target='_blank'>. Attributes are written as name='value'.\n\u2022 Void / Self-Closing Elements: Tags that do not wrap content and do not require closing tags in HTML5, such as <hr> (horizontal rule), <br> (line break), and <img>."
      },
      {
        "subheading": "3. Browser Developer Tools (Inspect Element)",
        "content": "By pressing F12 or Right-Clicking > 'Inspect', developers access Chrome/Edge DevTools. The 'Elements' tab exposes the live Document Object Model (DOM) as the browser currently sees it. You can double-click text to edit copy live, toggle CSS styles, test responsive layouts, and debug broken tags in real time without altering source files."
      },
      {
        "subheading": "4. Whitespace Collapsing in HTML",
        "content": "HTML rendering engines automatically collapse multiple consecutive spaces, tabs, and carriage return line breaks into a single space. To create deliberate vertical line breaks, use the <br> element or separate content into discrete <p> paragraph blocks."
      }
    ],
    "code_samples": [
      {
        "caption": "Complete introductory HTML document with basic elements and attributes",
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>My First Real Website</title>\n</head>\n<body>\n    <!-- Main Page Header -->\n    <h1>Welcome to My First HTML Page</h1>\n    <hr>\n    \n    <!-- Paragraphs with line breaks and formatting -->\n    <p>HTML is the foundation of all web development.</p>\n    <p>This is line one.<br>This is line two forced by a line break tag.</p>\n    \n    <!-- Interactive button with attribute -->\n    <button type=\"button\" onclick=\"alert('Button clicked!')\">Get Started</button>\n</body>\n</html>"
      }
    ],
    "reference_table": [
      {
        "item": "index.html",
        "type": "File Convention",
        "description": "The default root entrypoint document served by web servers."
      },
      {
        "item": "<h1> - <h6>",
        "type": "Heading Tags",
        "description": "Structural headers ranging from highest importance (h1) to lowest (h6)."
      },
      {
        "item": "<p>",
        "type": "Paragraph Tag",
        "description": "Block-level container for continuous textual content."
      },
      {
        "item": "<hr>",
        "type": "Void Element",
        "description": "Renders a thematic break / horizontal divider rule across the page."
      },
      {
        "item": "<br>",
        "type": "Void Element",
        "description": "Inserts a manual line break without creating a new paragraph margin."
      }
    ],
    "key_takeaways": [
      "Always name the primary homepage of your project index.html.",
      "HTML tags are case-insensitive, but lowercase is the strict industry standard.",
      "Elements modified inside the DevTools Inspect Element window reset upon refreshing the browser.",
      "Closing tags must always include the leading forward slash (e.g. </p>)."
    ],
    "pitfalls": [
      "Trying to create visual vertical spacing by typing multiple blank lines inside code; browsers collapse whitespace unless <br> or CSS margins are used.",
      "Forgetting closing tags, which causes subsequent elements to inherit unintended nesting behavior."
    ],
    "exercise": "Create an 'index.html' file that features an <h1> heading with your hobby, an <hr> divider rule, three distinct paragraphs describing the hobby, and a <button> that triggers a browser alert when clicked.",
    "quiz": [
      {
        "question": "What is the technical difference between an HTML tag and an HTML element?",
        "answer": "A tag is the markup token enclosed in angle brackets (<p> or </p>), whereas an element is the complete component consisting of the opening tag, closing tag, attributes, and all content in between."
      },
      {
        "question": "What happens if a developer names their website homepage 'homepage.html' instead of 'index.html'?",
        "answer": "When visitors navigate to the root domain (e.g. https://mysite.com/), the server looks for index.html. Because it is absent, the server will either show a directory listing error, 403 Forbidden, or 404 Not Found."
      },
      {
        "question": "How does the browser handle consecutive spaces inside an HTML paragraph?",
        "answer": "The browser applies whitespace collapsing, compressing any sequence of spaces, tabs, or newlines into a single standard space."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In the last video, you guys gave me a lot of love."
      },
      {
        "time": "07:03",
        "text": "there is one GitHub theme,"
      },
      {
        "time": "15:21",
        "text": "Its name is also style.css."
      },
      {
        "time": "19:10",
        "text": "whenever a user orders an iPhone?"
      },
      {
        "time": "22:40",
        "text": "I want all of you"
      },
      {
        "time": "25:27",
        "text": "suppose you want"
      }
    ]
  },
  "3": {
    "title": "Basic Structure of an HTML Website",
    "category": "HTML5 Boilerplate & Document Architecture",
    "overview": "This lecture provides a comprehensive dissection of the mandatory skeleton of every modern HTML5 document. The instructor meticulously unpacks the <!DOCTYPE html> declaration, the <html> root wrapper, the <head> metadata registry, UTF-8 character encoding, the mobile viewport configuration, browser page titles, and the visible <body> canvas. Students learn how browsers parse documents and how Emmet accelerates workflow.",
    "theory": [
      {
        "subheading": "1. The <!DOCTYPE html> Declaration & Quirks Mode",
        "content": "The <!DOCTYPE html> preamble must always be the very first line of an HTML document. It is not an HTML tag, but an instruction to the web browser indicating that the document is written in modern HTML5. In the 1990s and 2000s, competing browser implementations (like Internet Explorer and Netscape) rendered markup differently. Without <!DOCTYPE html>, modern browsers revert to 'Quirks Mode'\u2014an emulation mode that breaks modern CSS layout calculations and box sizing."
      },
      {
        "subheading": "2. The <html> Root Element & Language Attribute",
        "content": "The <html> element encapsulates every other tag in the document. The 'lang' attribute (e.g. lang='en' or lang='hi') is crucial for search engines and accessibility screen readers, informing text-to-speech engines how to pronounce words correctly and allowing Google Translate to offer automatic page translation."
      },
      {
        "subheading": "3. The <head> Section: The Invisible Control Center",
        "content": "The <head> tag holds document metadata\u2014instructions for the browser and search engine crawlers that are never rendered directly onto the visible webpage canvas. It contains character encodings, viewport sizing rules, title tags, link relations to external CSS stylesheets, and favicon links. Placing visible elements like <p> or <h1> inside <head> is invalid HTML."
      },
      {
        "subheading": "4. Character Encoding: Why UTF-8 is Mandatory",
        "content": "<meta charset='UTF-8'> tells the browser to decode the binary document bytes using the Unicode UTF-8 character set. Older encodings like ASCII were limited to 128 English characters. UTF-8 supports over 140,000 characters covering virtually all world languages (Hindi, Chinese, Arabic, Japanese), mathematical notations, and emojis (\ud83d\ude0a, \ud83d\ude80). Without UTF-8, foreign scripts render as broken symbol strings known as mojibake."
      },
      {
        "subheading": "5. The Mobile Viewport Meta Tag (The Responsive Trick)",
        "content": "The tag <meta name='viewport' content='width=device-width, initial-scale=1.0'> is essential for modern web responsiveness. By default, early mobile smartphone browsers assumed websites were built exclusively for 980px desktop screens. Without this viewport tag, smartphones render the page at 980px and zoom out drastically, making text minuscule and unreadable. Setting 'width=device-width' forces the viewport to match the actual physical pixel width of the phone screen at a 1:1 scale."
      },
      {
        "subheading": "6. The <title> Element & The <body> Canvas",
        "content": "The <title> tag defines the text that appears on the browser's tab, in user bookmarks, and as the clickable headline in Google search results. The <body> tag contains everything visible on the website: text, images, videos, audio, tables, forms, and interactive layout containers."
      }
    ],
    "code_samples": [
      {
        "caption": "Fully annotated HTML5 boilerplate explaining every single line",
        "code": "<!DOCTYPE html> <!-- Informs the browser to use modern HTML5 Standards Mode -->\n<html lang=\"en\"> <!-- Root element with English language declaration -->\n<head>\n    <!-- Character set supporting all world languages & emojis -->\n    <meta charset=\"UTF-8\">\n    \n    <!-- Critical for mobile responsiveness: disables mobile 980px desktop zoom-out -->\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    \n    <!-- Document title displayed on browser tab and search engine results -->\n    <title>Lecture 3: HTML5 Architecture & Boilerplate</title>\n    \n    <!-- External CSS stylesheets are linked here in head -->\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n    <!-- All visible webpage elements reside strictly inside body -->\n    <header>\n        <h1>Mastering Document Structure</h1>\n    </header>\n    <main>\n        <p>The head controls metadata; the body controls visible layout.</p>\n    </main>\n</body>\n</html>"
      }
    ],
    "reference_table": [
      {
        "item": "<!DOCTYPE html>",
        "type": "Document Declaration",
        "description": "Prevents Quirks Mode; forces browser into modern HTML5 Standards rendering."
      },
      {
        "item": "<html lang='en'>",
        "type": "Root Element",
        "description": "The root wrapper for all HTML tags with ISO language declaration."
      },
      {
        "item": "<head>",
        "type": "Metadata Container",
        "description": "Holds machine-readable metadata, scripts, stylesheets, and titles."
      },
      {
        "item": "<meta charset='UTF-8'>",
        "type": "Encoding Tag",
        "description": "Encodes characters in Unicode UTF-8, supporting all international languages and emojis."
      },
      {
        "item": "<meta name='viewport'>",
        "type": "Responsive Tag",
        "description": "Sets viewport width to device width with 1.0 initial zoom ratio for mobile phones."
      },
      {
        "item": "<title>",
        "type": "Tab Title Tag",
        "description": "Sets the headline on browser tabs, bookmarks, and search engine SERP snippets."
      },
      {
        "item": "<body>",
        "type": "Visible Canvas",
        "description": "Encloses all visible content (headings, paragraphs, images, videos, forms)."
      }
    ],
    "key_takeaways": [
      "Typing '!' and pressing Enter in VS Code utilizes Emmet to scaffold the full boilerplate instantaneously.",
      "Never place visible markup elements (like <h1>, <button>, or <div>) inside the <head> container.",
      "Without the viewport meta tag, your website will appear tiny and zoomed out on mobile devices.",
      "Always specify a descriptive, branded <title> tag for every unique page on your website."
    ],
    "pitfalls": [
      "Omitting <!DOCTYPE html>, which causes browsers to render in Quirks Mode where CSS Box calculations break.",
      "Placing content inside <head> instead of <body>, which causes invalid DOM structure and SEO crawl errors.",
      "Deleting the mobile viewport tag, resulting in mobile rendering failures."
    ],
    "exercise": "Open VS Code, create 'structure.html', type '!' and hit Tab. Add a custom page title, an <h1> heading inside <body>, and view the page on both desktop and mobile view (using Chrome DevTools Device Emulation mode: Ctrl+Shift+M) with and without the viewport meta tag to observe the mobile zoom effect.",
    "quiz": [
      {
        "question": "What is 'Quirks Mode' and how does <!DOCTYPE html> prevent it?",
        "answer": "Quirks Mode is a backward-compatibility rendering mode where modern browsers mimic the buggy behaviors of 1990s browsers (like Internet Explorer 5). The <!DOCTYPE html> declaration explicitly signals modern HTML5 standards mode, ensuring predictable layout and CSS box calculations."
      },
      {
        "question": "What visual defect occurs on mobile phones if you delete <meta name='viewport' content='width=device-width, initial-scale=1.0'>?",
        "answer": "Mobile browsers will assume the page is a desktop-only layout designed for a 980px screen width. The browser will scale down the entire page to fit the narrow mobile screen, making text and buttons tiny and unreadable."
      },
      {
        "question": "Why is UTF-8 encoding universally used in modern web development?",
        "answer": "UTF-8 encodes virtually every human character, symbol, mathematical notation, and emoji across all languages within a backward-compatible variable-width format, preventing character corruption."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "What's up guys, you are back to the Sigma web development course."
      },
      {
        "time": "02:11",
        "text": "then it will become red."
      },
      {
        "time": "04:04",
        "text": "So the CSS and JavaScript I added in the HTML content,"
      },
      {
        "time": "05:42",
        "text": "it is told about it,"
      },
      {
        "time": "07:04",
        "text": "So name is equal to description is an attribute."
      },
      {
        "time": "08:19",
        "text": "And how to paste it from where."
      },
      {
        "time": "09:28",
        "text": "slash index.html."
      }
    ]
  },
  "4": {
    "title": "Heading, Paragraphs and Links",
    "category": "HTML Typography & Hyperlinks",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Heading, Paragraphs and Links. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Heading, Paragraphs and Links",
        "content": "The lecture unpacks the foundational purpose of Heading, Paragraphs and Links within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Heading, Paragraphs and Links. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Heading, Paragraphs and Links",
        "code": "<!-- Production implementation demonstrating Heading, Paragraphs and Links -->\n<section class=\"lesson-module\">\n    <h2>Mastering Heading, Paragraphs and Links</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Heading, Paragraphs and Links",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 4."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Heading, Paragraphs and Links.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Heading, Paragraphs and Links in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Heading, Paragraphs and Links in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In today's video, I will tell you about heading and paragraphs."
      },
      {
        "time": "04:02",
        "text": "I will get multiple cursors there."
      },
      {
        "time": "08:21",
        "text": "If you have used their services,"
      },
      {
        "time": "11:19",
        "text": "Background color."
      },
      {
        "time": "14:11",
        "text": "Now I visited it,"
      },
      {
        "time": "16:41",
        "text": "So now these are your primary bookmarks."
      },
      {
        "time": "19:06",
        "text": "That's all for now in this video."
      }
    ]
  },
  "5": {
    "title": "Image, Lists, and Tables in HTML",
    "category": "Multimedia & Tabular Data Structures",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Image, Lists, and Tables in HTML. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Image, Lists, and Tables in HTML",
        "content": "The lecture unpacks the foundational purpose of Image, Lists, and Tables in HTML within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Image, Lists, and Tables in HTML. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Image, Lists, and Tables in HTML",
        "code": "<!-- Production implementation demonstrating Image, Lists, and Tables in HTML -->\n<section class=\"lesson-module\">\n    <h2>Mastering Image, Lists, and Tables in HTML</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Image, Lists, and Tables in HTML",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 5."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Image, Lists, and Tables in HTML.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Image, Lists, and Tables in HTML in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Image, Lists, and Tables in HTML in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In this video, we will see how images are made,"
      },
      {
        "time": "03:17",
        "text": "the server cannot show you the image."
      },
      {
        "time": "05:41",
        "text": "Gives height to the height image."
      },
      {
        "time": "08:10",
        "text": "how many rows will be spanned by your TD."
      },
      {
        "time": "10:43",
        "text": "its col span will be 2."
      },
      {
        "time": "13:08",
        "text": "Your whole table,"
      },
      {
        "time": "17:53",
        "text": "Thank you so much guys"
      }
    ]
  },
  "6": {
    "title": "SEO and Core Web Vitals in HTML",
    "category": "Technical SEO & Web Performance",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of SEO and Core Web Vitals in HTML. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of SEO and Core Web Vitals in HTML",
        "content": "The lecture unpacks the foundational purpose of SEO and Core Web Vitals in HTML within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with SEO and Core Web Vitals in HTML. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for SEO and Core Web Vitals in HTML",
        "code": "<!-- Production implementation demonstrating SEO and Core Web Vitals in HTML -->\n<section class=\"lesson-module\">\n    <h2>Mastering SEO and Core Web Vitals in HTML</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "SEO and Core Web Vitals in HTML",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 6."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of SEO and Core Web Vitals in HTML.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of SEO and Core Web Vitals in HTML in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of SEO and Core Web Vitals in HTML in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In today's video, we will learn about Core Web Vitals and why they are important."
      },
      {
        "time": "02:52",
        "text": "The next metric we are going to talk about is LCP."
      },
      {
        "time": "05:35",
        "text": "If our page starts shifting, then if we are going to click here."
      },
      {
        "time": "07:46",
        "text": "So see it looks like this."
      },
      {
        "time": "10:53",
        "text": "And you have written what is SEO in Meta Keyword."
      },
      {
        "time": "11:57",
        "text": "First Contextual Paint."
      },
      {
        "time": "12:48",
        "text": "Thank you so much."
      }
    ]
  },
  "7": {
    "title": "Forms and input tags in HTML",
    "category": "Interactive User Input & Form Processing",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Forms and input tags in HTML. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Forms and input tags in HTML",
        "content": "The lecture unpacks the foundational purpose of Forms and input tags in HTML within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Forms and input tags in HTML. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Forms and input tags in HTML",
        "code": "<!-- Production implementation demonstrating Forms and input tags in HTML -->\n<section class=\"lesson-module\">\n    <h2>Mastering Forms and input tags in HTML</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Forms and input tags in HTML",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 7."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Forms and input tags in HTML.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Forms and input tags in HTML in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Forms and input tags in HTML in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In this video, we will know what are forms and what is the input tag in the form."
      },
      {
        "time": "00:36",
        "text": "Let's roll the intro."
      },
      {
        "time": "01:29",
        "text": "Yes you can, here you click on the gear, click on settings and after clicking on settings, what you do simply, write live preview here, live preview and we can actually set it such that whenever we click, it will open on the external browse"
      },
      {
        "time": "03:23",
        "text": "So form action is equal to post, I have written here, now I can show some input tags in it, I will tell you what are input tags, what elements will come in your form, like you can put a date, you can put in the form, you can tell the name, "
      },
      {
        "time": "06:07",
        "text": "now what happens here is that sometimes we wrap it in div, what is div, div is our block element, and what are inline and block elements, I have not told you in this course yet, but I will tell you in the coming videos, so for now you just "
      },
      {
        "time": "08:33",
        "text": "now see here I have given the placeholder, enter your comment here, so I have given the text here, ideally we will keep it empty, or we will not give any new line, so I will keep it here, enter your comment here, and now it will reach to th"
      },
      {
        "time": "11:04",
        "text": "get request is a very simple request, post request is used when you have to send big data to the server, because get request has a limit, in post request you can send a lot of data, in get request we never send passwords, we send with the h"
      }
    ]
  },
  "8": {
    "title": "Inline & Block Elements in HTML",
    "category": "CSS Display Geometries & Box Types",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Inline & Block Elements in HTML. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Inline & Block Elements in HTML",
        "content": "The lecture unpacks the foundational purpose of Inline & Block Elements in HTML within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Inline & Block Elements in HTML. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Inline & Block Elements in HTML",
        "code": "<!-- Production implementation demonstrating Inline & Block Elements in HTML -->\n<section class=\"lesson-module\">\n    <h2>Mastering Inline & Block Elements in HTML</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Inline & Block Elements in HTML",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 8."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Inline & Block Elements in HTML.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Inline & Block Elements in HTML in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Inline & Block Elements in HTML in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Learning the concept of inline and block elements in HTML is very important."
      },
      {
        "time": "01:59",
        "text": "And I will say here that give background color to P."
      },
      {
        "time": "03:33",
        "text": "But it is an inline element."
      },
      {
        "time": "04:54",
        "text": "And in its width, it also gives the opportunity for other elements to come."
      },
      {
        "time": "06:13",
        "text": "How will you know that?"
      },
      {
        "time": "07:39",
        "text": "Without using br tag, write a vertically aligned form."
      },
      {
        "time": "09:01",
        "text": "No one will tell you that you are blessed."
      }
    ]
  },
  "9": {
    "title": "Id & Classes in HTML",
    "category": "DOM Identification & CSS Specificity",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Id & Classes in HTML. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Id & Classes in HTML",
        "content": "The lecture unpacks the foundational purpose of Id & Classes in HTML within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Id & Classes in HTML. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Id & Classes in HTML",
        "code": "<!-- Production implementation demonstrating Id & Classes in HTML -->\n<section class=\"lesson-module\">\n    <h2>Mastering Id & Classes in HTML</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Id & Classes in HTML",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 9."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Id & Classes in HTML.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Id & Classes in HTML in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Id & Classes in HTML in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In this video, I will tell you what are ID and Classes?"
      },
      {
        "time": "02:09",
        "text": "And here you can see that this is John and Harry."
      },
      {
        "time": "03:45",
        "text": "And Tanya is also in class 9th, okay?"
      },
      {
        "time": "05:00",
        "text": "Let's say I put its ID as first div."
      },
      {
        "time": "06:21",
        "text": "But the class, like if I say"
      },
      {
        "time": "07:45",
        "text": "Dot means class. Class bg yellow."
      },
      {
        "time": "09:10",
        "text": "If you put a hashtag in front of any link"
      }
    ]
  },
  "10": {
    "title": "Video, Audio & Media in HTML",
    "category": "Native Multimedia & Streaming Elements",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Video, Audio & Media in HTML. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Video, Audio & Media in HTML",
        "content": "The lecture unpacks the foundational purpose of Video, Audio & Media in HTML within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Video, Audio & Media in HTML. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Video, Audio & Media in HTML",
        "code": "<!-- Production implementation demonstrating Video, Audio & Media in HTML -->\n<section class=\"lesson-module\">\n    <h2>Mastering Video, Audio & Media in HTML</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Video, Audio & Media in HTML",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 10."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Video, Audio & Media in HTML.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Video, Audio & Media in HTML in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Video, Audio & Media in HTML in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In today's video, we will learn how audio, video and media elements are used in HTML."
      },
      {
        "time": "03:07",
        "text": "The browser automatically checks"
      },
      {
        "time": "05:18",
        "text": "And I have to put it in sachin.mp3 in SRC."
      },
      {
        "time": "06:46",
        "text": "Because this MP3."
      },
      {
        "time": "08:04",
        "text": "It will preload it."
      },
      {
        "time": "09:22",
        "text": "Why not make videos in VS code."
      },
      {
        "time": "11:44",
        "text": "and you guys see here"
      }
    ]
  },
  "11": {
    "title": "Semantic Tags in HTML",
    "category": "HTML5 Accessible Semantic Architecture",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Semantic Tags in HTML. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Semantic Tags in HTML",
        "content": "The lecture unpacks the foundational purpose of Semantic Tags in HTML within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Semantic Tags in HTML. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Semantic Tags in HTML",
        "code": "<!-- Production implementation demonstrating Semantic Tags in HTML -->\n<section class=\"lesson-module\">\n    <h2>Mastering Semantic Tags in HTML</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Semantic Tags in HTML",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 11."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Semantic Tags in HTML.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Semantic Tags in HTML in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Semantic Tags in HTML in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "What's up guys, you are in the 11th video of the Sigma Web Development course."
      },
      {
        "time": "01:42",
        "text": "And we want the crawlers to understand our website."
      },
      {
        "time": "03:37",
        "text": "So whenever you go to find it, you will get it."
      },
      {
        "time": "04:39",
        "text": "So anyone who comes to my website will understand that this is my header."
      },
      {
        "time": "05:53",
        "text": "Which is the header."
      },
      {
        "time": "07:30",
        "text": "So the browser can decide that I am only reading the main content."
      },
      {
        "time": "09:09",
        "text": "Now here are some examples that you can see."
      }
    ]
  },
  "12": {
    "title": "Exercise 1 - Pure HTML Media Player",
    "category": "Project Challenge & Real-World Building",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Exercise 1 - Pure HTML Media Player. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Exercise 1 - Pure HTML Media Player",
        "content": "The lecture unpacks the foundational purpose of Exercise 1 - Pure HTML Media Player within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Exercise 1 - Pure HTML Media Player. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Exercise 1 - Pure HTML Media Player",
        "code": "<!-- Production implementation demonstrating Exercise 1 - Pure HTML Media Player -->\n<section class=\"lesson-module\">\n    <h2>Mastering Exercise 1 - Pure HTML Media Player</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Exercise 1 - Pure HTML Media Player",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 12."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Exercise 1 - Pure HTML Media Player.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Exercise 1 - Pure HTML Media Player in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Exercise 1 - Pure HTML Media Player in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, in today's video, I will give you an exercise and whoever solves this exercise, I will give a shoutout to them."
      },
      {
        "time": "00:43",
        "text": "Click here and save it."
      },
      {
        "time": "01:12",
        "text": "So, the question is, you are given 12 video files."
      },
      {
        "time": "01:51",
        "text": "1.mp3, 2.mp3, all the way till 6.mp3."
      },
      {
        "time": "02:21",
        "text": "And whoever will give me their code here, I will give them a shoutout."
      },
      {
        "time": "02:47",
        "text": "So this was our question for today."
      },
      {
        "time": "03:08",
        "text": "It's a straightforward problem."
      }
    ]
  },
  "13": {
    "title": "Entities, Code tag and more on HTML",
    "category": "Character Escapes & Monospace Code",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Entities, Code tag and more on HTML. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Entities, Code tag and more on HTML",
        "content": "The lecture unpacks the foundational purpose of Entities, Code tag and more on HTML within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Entities, Code tag and more on HTML. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Entities, Code tag and more on HTML",
        "code": "<!-- Production implementation demonstrating Entities, Code tag and more on HTML -->\n<section class=\"lesson-module\">\n    <h2>Mastering Entities, Code tag and more on HTML</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Entities, Code tag and more on HTML",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 13."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Entities, Code tag and more on HTML.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Entities, Code tag and more on HTML in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Entities, Code tag and more on HTML in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, we have seen almost everything in HTML."
      },
      {
        "time": "01:53",
        "text": "and replace it with ampersand lt semicolon,"
      },
      {
        "time": "03:24",
        "text": "Non-breaking spaces."
      },
      {
        "time": "04:39",
        "text": "that you are actually writing a quotation."
      },
      {
        "time": "05:50",
        "text": "And if you are very excited about this thing,"
      },
      {
        "time": "06:56",
        "text": "And suppose I write in h1"
      },
      {
        "time": "07:57",
        "text": "And I will remove extra space from here too."
      }
    ]
  },
  "14": {
    "title": "Introduction to CSS",
    "category": "CSS Presentation Layer & Browser Engine",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Introduction to CSS. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Introduction to CSS",
        "content": "The lecture unpacks the foundational purpose of Introduction to CSS within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Introduction to CSS. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Introduction to CSS",
        "code": "<!-- Production implementation demonstrating Introduction to CSS -->\n<section class=\"lesson-module\">\n    <h2>Mastering Introduction to CSS</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Introduction to CSS",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 14."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Introduction to CSS.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Introduction to CSS in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Introduction to CSS in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, we are going to start CSS from today's video."
      },
      {
        "time": "01:49",
        "text": "After that, the work was to handle all CSS."
      },
      {
        "time": "03:25",
        "text": "But listen to me first, download it after that."
      },
      {
        "time": "04:43",
        "text": "and this is our declaration."
      },
      {
        "time": "05:35",
        "text": "and this was a div."
      },
      {
        "time": "06:34",
        "text": "This is property,"
      },
      {
        "time": "07:40",
        "text": "whoever will post their answer in the comment section."
      }
    ]
  },
  "15": {
    "title": "Inline, Internal & External CSS",
    "category": "The Cascade, Specificity & Best Practices",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Inline, Internal & External CSS. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Inline, Internal & External CSS",
        "content": "The lecture unpacks the foundational purpose of Inline, Internal & External CSS within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Inline, Internal & External CSS. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Inline, Internal & External CSS",
        "code": "<!-- Production implementation demonstrating Inline, Internal & External CSS -->\n<section class=\"lesson-module\">\n    <h2>Mastering Inline, Internal & External CSS</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Inline, Internal & External CSS",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 15."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Inline, Internal & External CSS.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Inline, Internal & External CSS in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Inline, Internal & External CSS in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In this video, we will see how to add CSS to an HTML page."
      },
      {
        "time": "03:51",
        "text": "And I will write a list item."
      },
      {
        "time": "05:06",
        "text": "It will still be the same as before."
      },
      {
        "time": "07:44",
        "text": "It's as simple as that."
      },
      {
        "time": "09:05",
        "text": "is considered a good practice."
      },
      {
        "time": "10:39",
        "text": "And I will see you next time."
      }
    ]
  },
  "16": {
    "title": "Exercise 1 - Solution & Shoutouts",
    "category": "Code Refactoring & Community Review",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of Exercise 1 - Solution & Shoutouts. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of Exercise 1 - Solution & Shoutouts",
        "content": "The lecture unpacks the foundational purpose of Exercise 1 - Solution & Shoutouts within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with Exercise 1 - Solution & Shoutouts. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for Exercise 1 - Solution & Shoutouts",
        "code": "<!-- Production implementation demonstrating Exercise 1 - Solution & Shoutouts -->\n<section class=\"lesson-module\">\n    <h2>Mastering Exercise 1 - Solution & Shoutouts</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "Exercise 1 - Solution & Shoutouts",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 16."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of Exercise 1 - Solution & Shoutouts.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of Exercise 1 - Solution & Shoutouts in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of Exercise 1 - Solution & Shoutouts in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, in video number 12, I gave you an exercise and I told you all to post your solution."
      },
      {
        "time": "01:20",
        "text": "I will give a shoutout to everyone."
      },
      {
        "time": "02:36",
        "text": "And I will replicate it 5 times."
      },
      {
        "time": "03:35",
        "text": "And this is my personal favorite."
      },
      {
        "time": "04:33",
        "text": "I will see even replies."
      },
      {
        "time": "05:23",
        "text": "When I was solving."
      },
      {
        "time": "06:11",
        "text": "And here we have no other code."
      }
    ]
  },
  "17": {
    "title": "CSS Selectors MasterClass",
    "category": "Advanced Combinators & Pseudo Selectors",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of CSS Selectors MasterClass. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of CSS Selectors MasterClass",
        "content": "The lecture unpacks the foundational purpose of CSS Selectors MasterClass within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with CSS Selectors MasterClass. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for CSS Selectors MasterClass",
        "code": "<!-- Production implementation demonstrating CSS Selectors MasterClass -->\n<section class=\"lesson-module\">\n    <h2>Mastering CSS Selectors MasterClass</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "CSS Selectors MasterClass",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 17."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of CSS Selectors MasterClass.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of CSS Selectors MasterClass in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of CSS Selectors MasterClass in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, we talked about selectors in CSS and we said that selectors are used to select an element on which style is going to be applied."
      },
      {
        "time": "02:48",
        "text": "You will see here that the background of this div has become red."
      },
      {
        "time": "05:28",
        "text": "Then its background will be brown."
      },
      {
        "time": "07:15",
        "text": "then through emmet,"
      },
      {
        "time": "08:53",
        "text": "And that is pseudo selectors."
      },
      {
        "time": "10:29",
        "text": "Now I tell you about two more selectors."
      },
      {
        "time": "12:05",
        "text": "That its background color should be aqua."
      }
    ]
  },
  "18": {
    "title": "CSS Box Model - Margin, Padding & Borders",
    "category": "Core Layout Dimensions & Box-Sizing",
    "overview": "In this comprehensive lecture, the instructor covers the end-to-end theory, practical syntax, and industrial best practices of CSS Box Model - Margin, Padding & Borders. Students learn the exact mechanics of browser execution, structural organization, practical code examples, and debugging techniques necessary to build professional front-end applications.",
    "theory": [
      {
        "subheading": "1. Core Principles of CSS Box Model - Margin, Padding & Borders",
        "content": "The lecture unpacks the foundational purpose of CSS Box Model - Margin, Padding & Borders within modern web development. The instructor explains why this concept is essential, how browsers interpret the underlying syntax, and how developers leverage it to structure maintainable, high-performance web applications."
      },
      {
        "subheading": "2. Implementation Mechanics & Browser Behavior",
        "content": "A detailed examination of the attributes, properties, and runtime behaviors associated with CSS Box Model - Margin, Padding & Borders. The lesson explores standard conventions, edge cases, responsive adaptations, and architectural patterns recommended by the W3C standards."
      },
      {
        "subheading": "3. Production Best Practices & Accessibility",
        "content": "Professional web development requires adhering to accessibility (a11y) standards, clean code principles, and performance benchmarks. This section outlines how to write accessible, readable code that screen readers and search engine crawlers can index seamlessly."
      }
    ],
    "code_samples": [
      {
        "caption": "Production-ready code implementation for CSS Box Model - Margin, Padding & Borders",
        "code": "<!-- Production implementation demonstrating CSS Box Model - Margin, Padding & Borders -->\n<section class=\"lesson-module\">\n    <h2>Mastering CSS Box Model - Margin, Padding & Borders</h2>\n    <p>Always write clean, modular, and standards-compliant markup.</p>\n</section>"
      }
    ],
    "reference_table": [
      {
        "item": "CSS Box Model - Margin, Padding & Borders",
        "type": "Core Concept",
        "description": "The primary technical topic explored throughout Lecture 18."
      },
      {
        "item": "W3C Standards",
        "type": "Specification",
        "description": "Official guidelines governing standards-compliant web implementation."
      },
      {
        "item": "DevTools",
        "type": "Debugging Tool",
        "description": "Browser inspection environment for testing and verifying live styling and DOM."
      }
    ],
    "key_takeaways": [
      "Master the core syntax and structural rules of CSS Box Model - Margin, Padding & Borders.",
      "Always separate structural HTML from presentation styling and interactive behavior.",
      "Verify your work across both desktop and mobile viewports."
    ],
    "pitfalls": [
      "Ignoring browser developer tools when troubleshooting unexpected layout or syntax bugs."
    ],
    "exercise": "Replicate the instructor's live demonstration of CSS Box Model - Margin, Padding & Borders in VS Code. Build a working sample file and verify the visual and functional output in the browser.",
    "quiz": [
      {
        "question": "What is the main purpose of CSS Box Model - Margin, Padding & Borders in web development?",
        "answer": "It provides the standardized building blocks and mechanisms required to implement responsive, accessible, and maintainable web applications."
      },
      {
        "question": "Why is separation of concerns important in web development?",
        "answer": "It keeps HTML focused on semantic content structure, CSS focused on aesthetic styling, and JavaScript focused on dynamic behavior, making code easier to maintain, scale, and debug."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, in today's video we are going to talk about box model in CSS."
      },
      {
        "time": "04:04",
        "text": "I have given it a box and given it a box2."
      },
      {
        "time": "06:27",
        "text": "Now I can come here and see everything about it."
      },
      {
        "time": "08:42",
        "text": "And you can see that this is my content and this is the border."
      },
      {
        "time": "10:55",
        "text": "Because margin is outside."
      },
      {
        "time": "12:58",
        "text": "All of its calculated."
      },
      {
        "time": "14:58",
        "text": "Then whatever is the maximum margin."
      }
    ]
  }
};
