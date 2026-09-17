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
    "overview": "In this foundational lecture of the Sigma Web Development Course, the instructor introduces the foundational mechanics of the modern World Wide Web and walks through setting up an industry-standard development environment. Students learn how the client-server architecture operates, how web browsers interpret files, how DNS resolves domain names into IP addresses, and how to configure Visual Studio Code with the essential extensions for high-velocity front-end engineering.",
    "theory": [
      {
        "subheading": "1. Client-Server Architecture & HTTP Lifecycle",
        "content": "The World Wide Web operates on a strict client-server model. The 'Client' (a web browser such as Google Chrome, Firefox, or Safari) requests resources across the internet, while the 'Server' (a high-uptime computer hosting website files) processes incoming HTTP/HTTPS GET requests and streams back the necessary HTML, CSS, JavaScript, and media assets. The browser engine parses this code, constructs the Document Object Model (DOM), and renders the interactive webpage."
      },
      {
        "subheading": "2. Domain Names, DNS (Domain Name System), and IP Addresses",
        "content": "Computers do not natively understand domain names like 'codewithharry.com'; they communicate via numerical IP (Internet Protocol) addresses like 142.250.190.46 (IPv4) or 2607:f8b0:4005:: (IPv6). The Domain Name System (DNS) functions as the decentralized phonebook of the internet. When you type a URL, your operating system queries DNS resolvers to translate the human-readable domain into the server's numeric IP address before establishing a TCP/TLS handshake."
      },
      {
        "subheading": "3. The Triad of Web Technologies: HTML, CSS, and JavaScript",
        "content": "Every modern website is built upon three distinct layers:\n\u2022 HTML (HyperText Markup Language): The structural skeleton that defines headings, text, forms, images, and semantic sections.\n\u2022 CSS (Cascading Style Sheets): The aesthetic presentation layer controlling colors, typography, layout grids, animations, and responsive breakpoints.\n\u2022 JavaScript: The programming logic layer providing interactivity, dynamic DOM updates, animations, and asynchronous server API communication."
      },
      {
        "subheading": "4. VS Code Configuration & Essential Extensions",
        "content": "Visual Studio Code is the world's most popular code editor. Key features covered include Emmet abbreviations for lightning-fast HTML scaffolding, the integrated terminal, split-screen editor layouts, and essential extensions such as 'Live Server' by Ritwick Dey. Live Server runs a local development server on port 5500 that automatically reloads your browser upon saving file changes."
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
      "Web browsers only understand HTML, CSS, and JavaScript natively; backend code compiles into these three.",
      "Live Server eliminates manual browser refreshes by providing instant hot-reloading on port 5500.",
      "VS Code shortcuts: 'Ctrl + `' toggles the terminal, 'Alt + Click' adds multiple cursors, and '!' expands the full HTML5 boilerplate.",
      "Files should always be saved inside an organized project directory before opening in VS Code."
    ],
    "pitfalls": [
      "Opening the .html file by double-clicking it opens it via 'file://' protocol rather than 'http://', which breaks relative paths and Live Server reloading.",
      "Forgetting to save files before expecting updates in the browser (enable Auto Save in VS Code under File > Auto Save)."
    ],
    "exercise": "Create a new folder named 'web_dev_journey' on your computer. Open it in VS Code, create a file named 'index.html', use the Emmet '!' shortcut to generate the boilerplate, add an <h1> tag with your name and a paragraph detailing your coding goals, and launch it using Live Server.",
    "quiz": [
      {
        "question": "What is the primary role of DNS in web browsing?",
        "answer": "DNS (Domain Name System) translates human-readable domain names (like example.com) into computer-routable IP addresses (like 93.184.216.34) so browsers can locate the hosting server."
      },
      {
        "question": "Why is the Live Server extension essential for beginners?",
        "answer": "It serves files over a local HTTP server (localhost:5500) and automatically refreshes the browser whenever code changes are saved, speeding up the feedback loop."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "From today's video, we will start the Sigma Web Development course."
      },
      {
        "time": "03:32",
        "text": "Click on the Create a Desktop icon."
      },
      {
        "time": "05:25",
        "text": "Yes, you close it."
      },
      {
        "time": "07:03",
        "text": "Just check this and close it."
      },
      {
        "time": "13:31",
        "text": "to the server, it says give me youtube.com"
      },
      {
        "time": "16:52",
        "text": "let me take the example of google, if i search harry bhai"
      },
      {
        "time": "20:14",
        "text": "so that we can show videos"
      },
      {
        "time": "23:47",
        "text": "you can start web development"
      },
      {
        "time": "27:08",
        "text": "Forbes is a website"
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
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In the last video, you guys gave me a lot of love."
      },
      {
        "time": "04:22",
        "text": "I will teach you all this."
      },
      {
        "time": "07:52",
        "text": "is liked by many people."
      },
      {
        "time": "10:23",
        "text": "write congratulations."
      },
      {
        "time": "12:45",
        "text": "Either this extension was not there"
      },
      {
        "time": "14:54",
        "text": "There will be a handshake here."
      },
      {
        "time": "17:17",
        "text": "Now, I will come here."
      },
      {
        "time": "21:26",
        "text": "Many people will say,"
      },
      {
        "time": "23:14",
        "text": "from web development"
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
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "What's up guys, you are back to the Sigma web development course."
      },
      {
        "time": "01:17",
        "text": "And many people said that blue theme is not good."
      },
      {
        "time": "02:28",
        "text": "So I will tell you what is the need to write so much?"
      },
      {
        "time": "03:39",
        "text": "Who is this background red?"
      },
      {
        "time": "04:39",
        "text": "So these titles of the page are used by the search engines"
      },
      {
        "time": "05:30",
        "text": "and which script do you want to link,"
      },
      {
        "time": "06:17",
        "text": "So now you can put the script tag"
      },
      {
        "time": "07:07",
        "text": "And if you hover in VS code,"
      },
      {
        "time": "07:47",
        "text": "Obviously, you will prefer to copy and paste it."
      },
      {
        "time": "08:33",
        "text": "Whatever we will develop here,"
      },
      {
        "time": "09:12",
        "text": "that you go to your Wi-Fi settings,"
      },
      {
        "time": "09:53",
        "text": "So we want our phone users,"
      }
    ]
  },
  "4": {
    "title": "Heading, Paragraphs and Links",
    "category": "Typography & Hypertext Navigation",
    "overview": "This lecture explores the fundamental textual building blocks of web pages. The instructor covers the hierarchical structure of headings from h1 to h6, paragraph typography, and the transformative power of the anchor (<a>) tag for linking webpages across the internet, relative internal links, protocol handlers, and opening links safely in new tabs.",
    "theory": [
      {
        "subheading": "1. Heading Hierarchy (h1 through h6)",
        "content": "HTML provides six levels of headings. <h1> represents the primary topic of the page, while <h6> represents sub-sub-headings. Headings create an outline for screen readers and search engine indexing bots. Crucially, a webpage should only have ONE <h1> tag to represent its core subject matter. Never use headings simply to enlarge text\u2014use CSS for visual styling."
      },
      {
        "subheading": "2. Paragraph Elements (<p>) & Thematic Breaks",
        "content": "Paragraph elements are block-level containers. Browsers automatically append default top and bottom margins to separate paragraphs visually. Inside a paragraph, line breaks can be forced using <br>, while thematic transitions can be demarcated with <hr>."
      },
      {
        "subheading": "3. The Anchor Tag (<a>) & Hyperlink Mechanics",
        "content": "The anchor tag creates clickable hyperlinks using the 'href' (hypertext reference) attribute. It supports absolute URLs (https://google.com), relative URLs (about.html or ../contact.html), page fragment anchors (#section-id), and protocol handlers (mailto:info@site.com, tel:+123456789)."
      },
      {
        "subheading": "4. Target Attribute & Tabnabbing Security",
        "content": "Setting target=\"_blank\" opens the destination link in a new browser tab. When doing so, always include rel=\"noopener noreferrer\" to prevent the linked page from accessing your window.opener object (a security exploit known as reverse tabnabbing)."
      }
    ],
    "code_samples": [
      {
        "caption": "Headings, paragraphs, and anchor tags with secure external links",
        "code": "<h1>Mastering HTML Text & Links</h1>\n<h2>Section 1: Navigating the Web</h2>\n<p>Click here to visit our <a href=\"about.html\">About Us</a> page.</p>\n<p>External resource: \n    <a href=\"https://wikipedia.org\" target=\"_blank\" rel=\"noopener noreferrer\">\n        Visit Wikipedia\n    </a>\n</p>"
      }
    ],
    "reference_table": [
      {
        "item": "<h1>",
        "type": "Top-Level Heading",
        "description": "The main title of the page; exactly one should exist per document."
      },
      {
        "item": "<h2> - <h6>",
        "type": "Sub-Headings",
        "description": "Sub-sections indicating structural outline hierarchy."
      },
      {
        "item": "<a>",
        "type": "Anchor Element",
        "description": "Creates hyperlinks linking across pages, URLs, or internal IDs."
      },
      {
        "item": "href",
        "type": "Anchor Attribute",
        "description": "Hypertext Reference specifying destination URL or page fragment."
      },
      {
        "item": "target='_blank'",
        "type": "Anchor Attribute",
        "description": "Instructs browser to open link in a fresh tab or window."
      },
      {
        "item": "rel='noopener'",
        "type": "Security Attribute",
        "description": "Blocks reverse tabnabbing vulnerabilities on target='_blank' links."
      }
    ],
    "key_takeaways": [
      "Use exactly one <h1> per document to maintain SEO best practices.",
      "Do not skip heading levels (e.g. jumping from <h1> directly to <h3>).",
      "Use target=\"_blank\" with rel=\"noopener noreferrer\" for external links."
    ],
    "pitfalls": [
      "Using <h1> simply for large font sizes instead of semantic importance.",
      "Missing the 'href' attribute on anchor tags, rendering the link non-functional and inaccessible."
    ],
    "exercise": "Create a multi-page site with 'index.html' and 'about.html'. Link both pages to each other using relative paths, and add an external link to Wikipedia that securely opens in a new tab.",
    "quiz": [
      {
        "question": "Why is rel='noopener noreferrer' recommended with target='_blank'?",
        "answer": "It prevents the newly opened page from accessing your original page's window object via JavaScript, closing a security vulnerability and protecting user performance."
      },
      {
        "question": "How do you link directly to a specific section on the same page?",
        "answer": "Assign an id to the target element (e.g. <h2 id='faq'>) and link to it using href='#faq'."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In today's video, I will tell you about heading and paragraphs."
      },
      {
        "time": "02:41",
        "text": "And here if I want to make it live,"
      },
      {
        "time": "05:44",
        "text": "So I will show you a practical demonstration of this."
      },
      {
        "time": "06:57",
        "text": "we will raise the bar like anything."
      },
      {
        "time": "08:12",
        "text": "you use this to fill the placeholder."
      },
      {
        "time": "09:42",
        "text": "But I can use a style attribute in p."
      },
      {
        "time": "11:33",
        "text": "And here you can choose any color you want."
      },
      {
        "time": "13:14",
        "text": "But in the coming videos I will tell you"
      },
      {
        "time": "14:56",
        "text": "But if you use a cheap editor"
      },
      {
        "time": "16:21",
        "text": "I brought multiple cursors by pressing alt."
      },
      {
        "time": "17:48",
        "text": "If you double click it and open it with VS code,"
      },
      {
        "time": "19:10",
        "text": "And I will see you next time."
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
    "reference_table": [
      {
        "item": "<img>",
        "type": "Void Element",
        "description": "Embeds bitmap or vector images via src attribute."
      },
      {
        "item": "alt",
        "type": "Image Attribute",
        "description": "Mandatory alternative text for screen readers and broken image fallback."
      },
      {
        "item": "<ul> / <ol>",
        "type": "List Containers",
        "description": "Unordered (bulleted) and ordered (numbered) list wrappers."
      },
      {
        "item": "<li>",
        "type": "List Item",
        "description": "Individual item nested inside ul or ol."
      },
      {
        "item": "<table>",
        "type": "Data Container",
        "description": "Encloses tabular rows and data cells."
      },
      {
        "item": "colspan / rowspan",
        "type": "Table Attributes",
        "description": "Merges adjacent columns or rows into a single cell."
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
    "exercise": "Build a product comparison table for three smartphones. Include an image for each phone, a list of pros/cons using unordered lists, and a table comparing price, battery capacity, and display size.",
    "quiz": [
      {
        "question": "What is the purpose of the 'alt' attribute on an <img> tag?",
        "answer": "It provides a textual fallback for screen readers and displays in the browser if the image file fails to load or connection is lost."
      },
      {
        "question": "How do you make a single table cell span across three columns?",
        "answer": "Add the attribute colspan='3' to the corresponding <th> or <td> element."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In this video, we will see how images are made,"
      },
      {
        "time": "02:07",
        "text": "So I pressed Windows, Shift and S here."
      },
      {
        "time": "03:41",
        "text": "And Alt is visible there."
      },
      {
        "time": "06:38",
        "text": "And let's say I want to put more things."
      },
      {
        "time": "07:57",
        "text": "it can be styled."
      },
      {
        "time": "12:19",
        "text": "my table content will come."
      },
      {
        "time": "16:39",
        "text": "VS Code is modern."
      },
      {
        "time": "17:55",
        "text": "And I will see you next time."
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
    "reference_table": [
      {
        "item": "meta description",
        "type": "SEO Tag",
        "description": "The 150-character summary displayed beneath search engine result headlines."
      },
      {
        "item": "og:image",
        "type": "Open Graph Tag",
        "description": "Specifies the preview card image when shared on social platforms."
      },
      {
        "item": "LCP",
        "type": "Core Web Vital",
        "description": "Largest Contentful Paint; measures load speed of the largest hero element."
      },
      {
        "item": "CLS",
        "type": "Core Web Vital",
        "description": "Cumulative Layout Shift; measures unexpected visual jumping during page load."
      },
      {
        "item": "canonical",
        "type": "Link Relation",
        "description": "Specifies preferred URL to prevent duplicate content penalties."
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
    "exercise": "Write a complete <head> section for an e-commerce book store containing title, meta description, favicon link, canonical link, and Open Graph tags for Facebook/LinkedIn preview cards.",
    "quiz": [
      {
        "question": "What metric does CLS (Cumulative Layout Shift) measure?",
        "answer": "It measures visual stability\u2014whether page elements jump or shift position unexpectedly as fonts, images, or ads load."
      },
      {
        "question": "What is the role of Open Graph tags?",
        "answer": "They specify how a page's title, description, and thumbnail image preview appear when shared on social media and messaging apps."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In today's video, we will learn about Core Web Vitals and why they are important."
      },
      {
        "time": "01:48",
        "text": "First of all, content is important."
      },
      {
        "time": "03:15",
        "text": "That is, the biggest element of the page should be loaded in 2.5 seconds."
      },
      {
        "time": "04:52",
        "text": "Your website can be loaded fast 2.7 seconds."
      },
      {
        "time": "06:13",
        "text": "So the desktop report will be generated."
      },
      {
        "time": "07:39",
        "text": "So I reduced 4 and 5."
      },
      {
        "time": "08:37",
        "text": "So you can see if your website is responsive or not."
      },
      {
        "time": "09:32",
        "text": "Your website looks like this."
      },
      {
        "time": "10:25",
        "text": "We do not know this."
      },
      {
        "time": "11:11",
        "text": "Now the content of your page is being parsed."
      },
      {
        "time": "11:45",
        "text": "It has Websocket."
      },
      {
        "time": "12:16",
        "text": "You can learn PWA."
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
    "reference_table": [
      {
        "item": "<form>",
        "type": "Form Wrapper",
        "description": "Encapsulates inputs, action URL, and submission method (GET/POST)."
      },
      {
        "item": "<input type='text'>",
        "type": "Single-Line Input",
        "description": "Generic single-line text entry field."
      },
      {
        "item": "<input type='email'>",
        "type": "Validated Input",
        "description": "Forces browser email syntax check (@ and domain)."
      },
      {
        "item": "<input type='password'>",
        "type": "Masked Input",
        "description": "Masks keystrokes with dots for security."
      },
      {
        "item": "<label for='...'>",
        "type": "Accessibility Tag",
        "description": "Ties descriptive label to input id; focuses on click."
      },
      {
        "item": "<textarea>",
        "type": "Multi-Line Input",
        "description": "Allows multi-line text input with customizable rows/cols."
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
    "exercise": "Build a job application form with fields for Name, Email, Phone, Resume file upload, a dropdown for Position, a group of radio buttons for Experience level, and a Submit button with required validation.",
    "quiz": [
      {
        "question": "Why should password forms always use method='POST' instead of 'GET'?",
        "answer": "GET appends all submitted data in plain text to the browser's URL query string, exposing passwords in browser history, logs, and bookmarks."
      },
      {
        "question": "What attribute links a <label> element to its corresponding <input>?",
        "answer": "The label's 'for' attribute must match the input's 'id' attribute."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In this video, we will know what are forms and what is the input tag in the form."
      },
      {
        "time": "00:16",
        "text": "The date and time to go to the flight or railway ticket, all these details we put, they are also submitted through the HTML forms."
      },
      {
        "time": "00:36",
        "text": "Let's roll the intro."
      },
      {
        "time": "00:58",
        "text": "And here I am going to make index.html and what I will do by putting an exclamation mark in it, I will wrap the view word, I will turn on the screen cast mode and you will see here I will write forms, let's learn it."
      },
      {
        "time": "01:29",
        "text": "Yes you can, here you click on the gear, click on settings and after clicking on settings, what you do simply, write live preview here, live preview and we can actually set it such that whenever we click, it will open on the external browser."
      },
      {
        "time": "02:12",
        "text": "Whenever you are working on design, you definitely want to see live previews here, which is why this extension was made and it was made different from the live server so that you can see the preview on the side."
      },
      {
        "time": "03:23",
        "text": "So form action is equal to post, I have written here, now I can show some input tags in it, I will tell you what are input tags, what elements will come in your form, like you can put a date, you can put in the form, you can tell the name, you can tell the pho"
      },
      {
        "time": "04:47",
        "text": "so write sigma batch op and give your village land to me, means if any English person is watching this or if any person is watching this who does not know Hindi at all, then he will say that what has happened so far and give your village land to me, it is very"
      },
      {
        "time": "06:07",
        "text": "now what happens here is that sometimes we wrap it in div, what is div, div is our block element, and what are inline and block elements, I have not told you in this course yet, but I will tell you in the coming videos, so for now you just understand that I am"
      },
      {
        "time": "07:34",
        "text": "what should be done is always put the id of the input tag, so you can see here I have put the label for is equal to female, along with that we have an input tag which is type is equal to check box, now see here if I put the input of type is equal to check box,"
      },
      {
        "time": "08:33",
        "text": "now see here I have given the placeholder, enter your comment here, so I have given the text here, ideally we will keep it empty, or we will not give any new line, so I will keep it here, enter your comment here, and now it will reach to the left side, so it h"
      },
      {
        "time": "09:51",
        "text": "means the easiest thing is that people think that you should put br tag and keep adding new spaces, I oppose this a lot, so I will copy this and show select tag to you, and now see here, as soon as I put select tag here, I put it inside div, so in select you g"
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
      },
      {
        "subheading": "4. The CSS 'display' Property",
        "content": "Any element's display mode can be transformed via CSS: display: block makes an inline element act like a block; display: inline makes a block element flow inline; display: inline-block allows setting width/height and vertical margins while still sitting horizontally side-by-side with siblings."
      }
    ],
    "code_samples": [
      {
        "caption": "Contrasting block containers with inline text spans",
        "code": "<!-- Block element (starts on new line, full width) -->\n<div style=\"background: #e0f2fe; padding: 10px;\">\n    <h2>Block Container</h2>\n    <!-- Paragraph is also a block element -->\n    <p>This is a paragraph where <span style=\"color: #0284c7; font-weight: bold;\">this specific phrase</span> is wrapped in an inline span.</p>\n</div>\n\n<!-- Adjacent inline links stay on the same line -->\n<a href=\"#\">Link One</a>\n<a href=\"#\">Link Two</a>"
      }
    ],
    "reference_table": [
      {
        "item": "<div>",
        "type": "Generic Block",
        "description": "Full-width block container with top/bottom line breaks."
      },
      {
        "item": "<span>",
        "type": "Generic Inline",
        "description": "Inline text container with no line breaks or vertical margins."
      },
      {
        "item": "display: block",
        "type": "CSS Property",
        "description": "Forces element to start on new line and occupy 100% width."
      },
      {
        "item": "display: inline",
        "type": "CSS Property",
        "description": "Forces element to flow alongside text without width/height."
      },
      {
        "item": "display: inline-block",
        "type": "CSS Property",
        "description": "Allows width/height while sitting side-by-side with siblings."
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
    "exercise": "Create three <div> elements and style them with background colors. Observe how each stacks vertically. Then add inline-block display and watch them align horizontally.",
    "quiz": [
      {
        "question": "Can you set width and height directly on a <span> element?",
        "answer": "No, because <span> is an inline element. Its dimensions are determined by its content unless its CSS display is set to inline-block or block."
      },
      {
        "question": "Which of these is a block-level element: <span>, <a>, <div>, or <strong>?",
        "answer": "<div> is the block-level element; the others are inline elements."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Learning the concept of inline and block elements in HTML is very important."
      },
      {
        "time": "01:16",
        "text": "But I will tell you more about it by putting more light on it."
      },
      {
        "time": "02:17",
        "text": "Let us say, I will have to put https."
      },
      {
        "time": "03:08",
        "text": "This happened because this is a paragraph block element."
      },
      {
        "time": "04:06",
        "text": "So see what happened?"
      },
      {
        "time": "04:45",
        "text": "Along with that, I can keep the span and anchor tag in the same line."
      },
      {
        "time": "05:38",
        "text": "And there is nothing in video 7."
      },
      {
        "time": "06:21",
        "text": "Inline and block elements."
      },
      {
        "time": "07:11",
        "text": "Write the code in such a way that in the coming time,"
      },
      {
        "time": "07:59",
        "text": "Everyone should answer this quiz."
      },
      {
        "time": "08:49",
        "text": "You are studying. You are doing this."
      },
      {
        "time": "09:37",
        "text": "I am telling you that all the people who have got success."
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
    "reference_table": [
      {
        "item": "id='#...'",
        "type": "Unique Identifier",
        "description": "Single-use identifier with high specificity (100)."
      },
      {
        "item": "class='....'",
        "type": "Reusable Classifier",
        "description": "Multi-use styling selector with medium specificity (10)."
      },
      {
        "item": "Specificity",
        "type": "Cascade Scoring",
        "description": "Algorithm resolving style conflicts: Inline (1000) > ID (100) > Class (10) > Tag (1)."
      },
      {
        "item": "#header",
        "type": "CSS ID Selector",
        "description": "Targets element with id='header'."
      },
      {
        "item": ".btn",
        "type": "CSS Class Selector",
        "description": "Targets any element with class='btn'."
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
    "exercise": "Build a card component layout using reusable classes (.card, .card-header, .card-body). Add unique IDs to each card and write CSS to demonstrate how class styles apply to all cards while ID styles customize one specific card.",
    "quiz": [
      {
        "question": "If an element has an ID style and a class style defining color, which wins?",
        "answer": "The ID selector wins because ID has a higher CSS specificity score (100) compared to a class selector (10)."
      },
      {
        "question": "How do you assign two classes named 'card' and 'dark-theme' to a single div?",
        "answer": "Separate the class names with a space inside the attribute: class='card dark-theme'."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In this video, I will tell you what are ID and Classes?"
      },
      {
        "time": "01:29",
        "text": "You must have an Aadhar card, right?"
      },
      {
        "time": "02:22",
        "text": "and this is my Aadhar number, okay?"
      },
      {
        "time": "03:20",
        "text": "So what is this?"
      },
      {
        "time": "04:01",
        "text": "So class means that"
      },
      {
        "time": "04:45",
        "text": "Let's say I made a div here, okay?"
      },
      {
        "time": "05:30",
        "text": "can also put multiple classes in one element."
      },
      {
        "time": "07:02",
        "text": "and here the preview is looking like this."
      },
      {
        "time": "07:49",
        "text": "Sorry, I will make it color red."
      },
      {
        "time": "08:37",
        "text": "I scroll down and here"
      },
      {
        "time": "10:11",
        "text": "I was reading the captions and I laughed."
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
    "reference_table": [
      {
        "item": "<video>",
        "type": "Media Element",
        "description": "Native HTML5 video playback container."
      },
      {
        "item": "<audio>",
        "type": "Media Element",
        "description": "Native HTML5 audio playback container."
      },
      {
        "item": "controls",
        "type": "Media Attribute",
        "description": "Enables native browser playback controls (play, pause, volume, fullscreen)."
      },
      {
        "item": "poster",
        "type": "Video Attribute",
        "description": "Image displayed while video is downloading or prior to playback."
      },
      {
        "item": "<iframe>",
        "type": "Browsing Context",
        "description": "Embeds external documents, YouTube players, or interactive maps."
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
    "exercise": "Create a multimedia page featuring an embedded YouTube video tutorial, an HTML5 audio player playing a sample track with controls, and a responsive iframe embedding Google Maps.",
    "quiz": [
      {
        "question": "Why won't a video with the 'autoplay' attribute play automatically on modern browsers?",
        "answer": "Modern browsers require the 'muted' attribute to be present alongside 'autoplay' to prevent unsolicited audio from playing."
      },
      {
        "question": "What is the purpose of nesting multiple <source> tags inside a <video> element?",
        "answer": "It provides format fallbacks (like MP4 and WebM) so browsers can choose the best codec they support."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In today's video, we will learn how audio, video and media elements are used in HTML."
      },
      {
        "time": "03:27",
        "text": "And our next attribute is loop."
      },
      {
        "time": "04:41",
        "text": "You know that it specifies the dimension of the video."
      },
      {
        "time": "07:22",
        "text": "Your user can play."
      },
      {
        "time": "08:07",
        "text": "And what will happen by doing auto."
      },
      {
        "time": "08:52",
        "text": "So that you can try out this thing."
      },
      {
        "time": "09:38",
        "text": "SVG is a format by which."
      },
      {
        "time": "11:02",
        "text": "this is called namespace declaration"
      },
      {
        "time": "12:39",
        "text": "and share it, that time will come here"
      },
      {
        "time": "14:09",
        "text": "tell me the code and explain"
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
    "reference_table": [
      {
        "item": "<header>",
        "type": "Semantic Landmark",
        "description": "Banner containing introductory content, titles, and top navigation."
      },
      {
        "item": "<nav>",
        "type": "Semantic Landmark",
        "description": "Section reserved specifically for major navigation link groups."
      },
      {
        "item": "<main>",
        "type": "Semantic Landmark",
        "description": "Unique central content of the page; exactly one allowed per document."
      },
      {
        "item": "<article>",
        "type": "Semantic Container",
        "description": "Self-contained, independently distributable entity (e.g. blog post)."
      },
      {
        "item": "<section>",
        "type": "Semantic Container",
        "description": "Thematic grouping of content, typically with its own heading."
      },
      {
        "item": "<footer>",
        "type": "Semantic Landmark",
        "description": "Footer for copyright, author metadata, and legal links."
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
    "exercise": "Refactor a webpage built entirely with <div> elements into a standards-compliant semantic layout utilizing <header>, <nav>, <main>, <article>, <aside>, and <footer>.",
    "quiz": [
      {
        "question": "What is the key difference between <article> and <section>?",
        "answer": "<article> is self-contained and could stand alone independently (like a blog post), whereas <section> is a thematic grouping of related content that is part of a larger whole."
      },
      {
        "question": "How many <main> tags should exist in an HTML document?",
        "answer": "Exactly one, representing the unique primary content of that specific document."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "What's up guys, you are in the 11th video of the Sigma Web Development course."
      },
      {
        "time": "00:43",
        "text": "Here you can see that I have made a folder named Video 11."
      },
      {
        "time": "02:01",
        "text": "Now if there is something in the header, then I know that it is header, that is, it is at the top."
      },
      {
        "time": "03:07",
        "text": "So if you spread your files in your entire computer, then definitely it is not arranged in one way."
      },
      {
        "time": "04:03",
        "text": "Using semantic tags."
      },
      {
        "time": "04:31",
        "text": "And I will write home here."
      },
      {
        "time": "05:09",
        "text": "And after that, my footer, let's say I write in the footer."
      },
      {
        "time": "05:54",
        "text": "Then after this, we will put the nav, which is in the navigation menu on our page, in the nav tag."
      },
      {
        "time": "06:50",
        "text": "What is figure and fig caption?"
      },
      {
        "time": "07:48",
        "text": "The first versions of our HTML did not have semantic tags."
      },
      {
        "time": "08:49",
        "text": "No, it is not at all."
      },
      {
        "time": "09:34",
        "text": "And I will tell you all this, why does CSS work here."
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
        "subheading": "2. Structural Planning Without CSS",
        "content": "Students learn to architect the document before coding: organizing the header branding, grouping media players inside a semantic <main> region, using lists (<ol> and <ul>) for the tracklist, and using a table for album metadata."
      }
    ],
    "code_samples": [
      {
        "caption": "Pure HTML media hub structure",
        "code": "<header>\n    <h1>Sigma Audio & Video Hub</h1>\n</header>\n<main>\n    <section>\n        <h2>Featured Video Lecture</h2>\n        <video controls width=\"500\" poster=\"cover.jpg\">\n            <source src=\"lecture.mp4\" type=\"video/mp4\">\n        </video>\n    </section>\n    <section>\n        <h2>Track Playlist</h2>\n        <ol>\n            <li>Track 1 - Ambient Beats <audio controls src=\"track1.mp3\"></audio></li>\n            <li>Track 2 - Coding Lo-Fi <audio controls src=\"track2.mp3\"></audio></li>\n        </ol>\n    </section>\n</main>"
      }
    ],
    "reference_table": [
      {
        "item": "<video controls>",
        "type": "Media Tag",
        "description": "Renders playable video with pause, scrub, and volume controls."
      },
      {
        "item": "<audio controls>",
        "type": "Media Tag",
        "description": "Renders audio player for podcasts or music tracks."
      },
      {
        "item": "<ol>",
        "type": "Numbered List",
        "description": "Renders sequential tracklist order."
      },
      {
        "item": "<dl>",
        "type": "Definition List",
        "description": "Formats metadata like Artist, Album, Release Date."
      }
    ],
    "key_takeaways": [
      "Building projects with pure HTML reinforces the importance of document structure before aesthetics.",
      "Native HTML controls provide surprisingly rich built-in accessibility."
    ],
    "pitfalls": [
      "Relying on styling hacks before finalizing semantic hierarchy."
    ],
    "exercise": "Build your own pure HTML media player with 2 video lectures, 3 audio tracks, an ordered playlist, lyrics in blockquotes, and an HTML form for user song requests.",
    "quiz": [
      {
        "question": "Why is it valuable to build pure HTML projects before learning CSS?",
        "answer": "It ensures developers understand semantic markup, accessibility, and content hierarchy without getting distracted by visual presentation."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, in today's video, I will give you an exercise and whoever solves this exercise, I will give a shoutout to them."
      },
      {
        "time": "00:24",
        "text": "I hope you are equally excited."
      },
      {
        "time": "00:45",
        "text": "And if you have not accessed the code, then it is also updated on GitHub till video 11."
      },
      {
        "time": "01:01",
        "text": "And everyone is accepting this challenge."
      },
      {
        "time": "02:03",
        "text": "Okay, you have these files."
      },
      {
        "time": "02:17",
        "text": "Because if you accept this challenge, then you write Challenge Accepted in the first time."
      },
      {
        "time": "02:33",
        "text": "And it's a very simple problem."
      },
      {
        "time": "02:47",
        "text": "So this was our question for today."
      },
      {
        "time": "02:58",
        "text": "So if I press Ctrl Forward Slash, then it will be uncomment."
      },
      {
        "time": "03:10",
        "text": "Everyone must solve it."
      },
      {
        "time": "03:21",
        "text": "Watch this video till the end."
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
    "reference_table": [
      {
        "item": "&lt; / &gt;",
        "type": "HTML Entity",
        "description": "Escapes '<' and '>' characters so browsers render text rather than tags."
      },
      {
        "item": "&amp;",
        "type": "HTML Entity",
        "description": "Escapes ampersand '&' symbol."
      },
      {
        "item": "<code>",
        "type": "Inline Code Tag",
        "description": "Monospace typography representing computer code snippets."
      },
      {
        "item": "<pre>",
        "type": "Preformatted Text",
        "description": "Preserves raw whitespace, indentation, and newlines."
      },
      {
        "item": "<kbd>",
        "type": "Keyboard Input",
        "description": "Indicates user keyboard keystrokes (e.g. Ctrl + C)."
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
    "exercise": "Write a technical cheatsheet tutorial page showing a Python hello world script enclosed in <pre><code>, using <kbd> for keyboard shortcuts, and HTML entities for special symbols.",
    "quiz": [
      {
        "question": "What entity represents the ampersand symbol '&'?",
        "answer": "&amp;"
      },
      {
        "question": "Why should <pre> be used in conjunction with <code>?",
        "answer": "<code> provides monospace font semantics, while <pre> preserves indentation, spaces, and line breaks."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, we have seen almost everything in HTML."
      },
      {
        "time": "01:12",
        "text": "I will show you the preview of this."
      },
      {
        "time": "03:04",
        "text": "So this happens in pre tag HTML."
      },
      {
        "time": "03:51",
        "text": "So if you see here,"
      },
      {
        "time": "04:32",
        "text": "So the quotation tag works like this."
      },
      {
        "time": "05:14",
        "text": "We don't use font tag."
      },
      {
        "time": "05:57",
        "text": "Many people ask me."
      },
      {
        "time": "07:14",
        "text": "then what I have to do is"
      },
      {
        "time": "07:47",
        "text": "then you select them."
      },
      {
        "time": "08:56",
        "text": "And I will see you"
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
        "subheading": "3. The Browser Render Pipeline (DOM + CSSOM)",
        "content": "When a page loads, the browser parses HTML to construct the DOM (Document Object Model) and parses CSS to construct the CSSOM (CSS Object Model). It merges both into a Render Tree, calculates layout geometry for every element, and paints pixels onto the screen."
      }
    ],
    "code_samples": [
      {
        "caption": "Basic CSS syntax rule set",
        "code": "/* Selector targeting all h1 elements */\nh1 {\n    color: #1e293b;            /* Text color */\n    background-color: #f1f5f9; /* Background */\n    font-family: 'Inter', sans-serif;\n    font-size: 28px;\n    text-align: center;\n    padding: 16px;\n    border-radius: 8px;\n}"
      }
    ],
    "reference_table": [
      {
        "item": "Selector",
        "type": "CSS Rule Part",
        "description": "Specifies which HTML elements to target for styling."
      },
      {
        "item": "Property",
        "type": "CSS Rule Part",
        "description": "The style characteristic being changed (e.g. color, font-size)."
      },
      {
        "item": "Value",
        "type": "CSS Rule Part",
        "description": "The exact setting applied to the property (e.g. blue, 16px)."
      },
      {
        "item": "CSSOM",
        "type": "Browser Tree",
        "description": "CSS Object Model constructed by the browser to match against the DOM."
      }
    ],
    "key_takeaways": [
      "Every declaration MUST end with a semicolon ';'.",
      "Color values can be expressed via color names ('red'), hexadecimal ('#3b82f6'), rgb/rgba ('rgba(0,0,0,0.5)'), or hsl."
    ],
    "pitfalls": [
      "Forgetting the terminating semicolon on a CSS property, which breaks all subsequent declarations in that block."
    ],
    "exercise": "Create an HTML page with three paragraphs and style each paragraph with different text colors, background colors, font families, and borders.",
    "quiz": [
      {
        "question": "What are the two main parts of a CSS rule?",
        "answer": "The Selector (which targets elements) and the Declaration Block (enclosed in curly braces containing properties and values)."
      },
      {
        "question": "What does CSSOM stand for?",
        "answer": "CSS Object Model, the tree of styles constructed by the browser to match against the HTML DOM tree."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, we are going to start CSS from today's video."
      },
      {
        "time": "01:02",
        "text": "So, I am very excited."
      },
      {
        "time": "02:03",
        "text": "then you can download HTML notes there."
      },
      {
        "time": "02:52",
        "text": "Skin, hair, all this is CSS."
      },
      {
        "time": "03:50",
        "text": "and by hitting exclamation mark,"
      },
      {
        "time": "04:35",
        "text": "Suppose I say this,"
      },
      {
        "time": "05:33",
        "text": "and here was this div,"
      },
      {
        "time": "06:07",
        "text": "this declaration was not applied."
      },
      {
        "time": "06:39",
        "text": "whose value is red."
      },
      {
        "time": "07:15",
        "text": "there are such technologies in the market,"
      },
      {
        "time": "07:58",
        "text": "Many people say that we have a phone,"
      },
      {
        "time": "08:38",
        "text": "that you are enjoying it."
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
    "reference_table": [
      {
        "item": "External CSS",
        "type": "Best Practice",
        "description": "Separate .css file linked via <link rel='stylesheet'>; cached by browser."
      },
      {
        "item": "Internal CSS",
        "type": "Scoped Method",
        "description": "Styles written in <style> inside the document head."
      },
      {
        "item": "Inline CSS",
        "type": "Direct Attribute",
        "description": "Style declared directly on element: <p style='color: red;'>."
      },
      {
        "item": "!important",
        "type": "Specificity Override",
        "description": "Forces a declaration to take precedence over all other cascade rules."
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
    "exercise": "Create an 'index.html' and 'style.css' file. Link the external stylesheet and verify that changing background color in 'style.css' instantly updates the browser via Live Server.",
    "quiz": [
      {
        "question": "Which has higher priority: an inline style or a style in an external CSS file?",
        "answer": "An inline style has higher priority (specificity score of 1000) and will override rules in external stylesheets."
      },
      {
        "question": "Why does external CSS improve website performance?",
        "answer": "Browsers cache the external .css file locally, so subsequent pages load instantly without re-downloading styling rules."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "In this video, we will see how to add CSS to an HTML page."
      },
      {
        "time": "01:44",
        "text": "Does this even make any sense?"
      },
      {
        "time": "02:41",
        "text": "Whatever I am thinking, it is giving me an auto-complete."
      },
      {
        "time": "04:17",
        "text": "The second method is internal CSS."
      },
      {
        "time": "05:01",
        "text": "Make the color yellow and background red."
      },
      {
        "time": "05:48",
        "text": "I want to bulk edit."
      },
      {
        "time": "06:35",
        "text": "then your style tag will keep growing."
      },
      {
        "time": "07:25",
        "text": "Now I show you that"
      },
      {
        "time": "08:50",
        "text": "And in most of the cases,"
      },
      {
        "time": "09:46",
        "text": "In most of the cases,"
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
    "reference_table": [
      {
        "item": "W3C Validator",
        "type": "Linter Tool",
        "description": "Online service validating syntax compliance of HTML code."
      },
      {
        "item": "Indentation",
        "type": "Code Quality",
        "description": "Standard 2 or 4 space indentation defining parent-child hierarchy."
      },
      {
        "item": "aria-label",
        "type": "Accessibility",
        "description": "Provides non-visual descriptive name to assistive screen readers."
      }
    ],
    "key_takeaways": [
      "Consistent indentation is the mark of a professional software engineer.",
      "Always validate HTML markup using the W3C Markup Validation Service."
    ],
    "pitfalls": [
      "Neglecting accessibility attributes like 'aria-label' or 'alt' when building media UI."
    ],
    "exercise": "Take your previous Exercise 1 submission and run it through validator.w3.org. Fix every warning and error until you achieve a clean validation pass.",
    "quiz": [
      {
        "question": "What tool can you use to test if your HTML conforms to web standards?",
        "answer": "The official W3C Markup Validation Service (validator.w3.org)."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, in video number 12, I gave you an exercise and I told you all to post your solution."
      },
      {
        "time": "00:52",
        "text": "Now I am going to open this video here."
      },
      {
        "time": "01:33",
        "text": "My videos for the day."
      },
      {
        "time": "02:23",
        "text": "And then I will write 5."
      },
      {
        "time": "02:56",
        "text": "Okay, so it is not becoming problematic."
      },
      {
        "time": "03:31",
        "text": "This is a jihad."
      },
      {
        "time": "04:01",
        "text": "Here Multiatmos, Desi Reddy, Shantop, Harsh Gularia."
      },
      {
        "time": "04:37",
        "text": "No one has solved yet."
      },
      {
        "time": "05:05",
        "text": "He has given width and height in the video."
      },
      {
        "time": "05:35",
        "text": "Shoutout to him too."
      },
      {
        "time": "06:03",
        "text": "Shoutout to him too."
      },
      {
        "time": "06:31",
        "text": "All the source code."
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
    "reference_table": [
      {
        "item": "div > p",
        "type": "Child Combinator",
        "description": "Targets only direct children p of div."
      },
      {
        "item": "h1 + p",
        "type": "Adjacent Sibling",
        "description": "Targets p immediately following h1."
      },
      {
        "item": ":nth-child(even)",
        "type": "Structural Pseudo-Class",
        "description": "Targets alternating even sibling elements."
      },
      {
        "item": "::before / ::after",
        "type": "Pseudo-Element",
        "description": "Generates cosmetic DOM content via 'content' property."
      },
      {
        "item": "[href^='https']",
        "type": "Attribute Selector",
        "description": "Matches elements whose attribute starts with 'https'."
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
    "exercise": "Build a table with alternating zebra striped rows using :nth-child(even), add a hover effect to rows, and style external links differently using the attribute selector a[target='_blank'].",
    "quiz": [
      {
        "question": "What is the difference between 'ul li' and 'ul > li'?",
        "answer": "'ul li' selects all <li> elements at any depth inside the <ul>, whereas 'ul > li' only selects <li> elements that are direct children."
      },
      {
        "question": "Which selector targets every alternating even row in a table?",
        "answer": "tr:nth-child(even) or tr:nth-child(2n)."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, we talked about selectors in CSS and we said that selectors are used to select an element on which style is going to be applied."
      },
      {
        "time": "01:51",
        "text": "Now what I am going to do here is a very simple thing."
      },
      {
        "time": "03:18",
        "text": "And you will want to use a specific selector."
      },
      {
        "time": "04:57",
        "text": "then I say that the color of the paragraph in the div should be blue."
      },
      {
        "time": "06:05",
        "text": "This selector will be applied or not."
      },
      {
        "time": "07:05",
        "text": "Now after this, there is another universal selector."
      },
      {
        "time": "08:05",
        "text": "I will tell you that."
      },
      {
        "time": "09:01",
        "text": "Now I will write here."
      },
      {
        "time": "09:57",
        "text": "What will be its color?"
      },
      {
        "time": "10:53",
        "text": "Background color red."
      },
      {
        "time": "11:49",
        "text": "I will put its name as one."
      },
      {
        "time": "12:45",
        "text": "I will put links about such things."
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
    "reference_table": [
      {
        "item": "Content",
        "type": "Box Layer",
        "description": "Innermost area containing text, image, or video (width/height)."
      },
      {
        "item": "Padding",
        "type": "Box Layer",
        "description": "Space between content and border; carries element's background color."
      },
      {
        "item": "Border",
        "type": "Box Layer",
        "description": "Surrounds padding with styled line (solid, dashed, dotted)."
      },
      {
        "item": "Margin",
        "type": "Box Layer",
        "description": "Transparent external spacing separating element from siblings."
      },
      {
        "item": "box-sizing: border-box",
        "type": "CSS Reset Rule",
        "description": "Forces width and height to include padding and border."
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
    "exercise": "Build two identical boxes: one with box-sizing: content-box and one with border-box. Add 30px padding and 5px border to both and inspect their physical dimensions in Chrome DevTools to visually see the difference.",
    "quiz": [
      {
        "question": "What is the total width of an element with width: 200px, padding: 20px, and border: 5px when box-sizing is border-box?",
        "answer": "Exactly 200px. The padding (20px each side) and border (5px each side) are subtracted from the interior content area."
      },
      {
        "question": "What is margin collapse in CSS?",
        "answer": "When two vertical block margins meet, they collapse into a single margin equal to the largest margin value, rather than summing together."
      }
    ],
    "milestones": [
      {
        "time": "00:00",
        "text": "Guys, in today's video we are going to talk about box model in CSS."
      },
      {
        "time": "02:15",
        "text": "CSS box model means that there is padding outside your content, there is a border outside it, and there is a margin outside it."
      },
      {
        "time": "04:37",
        "text": "And if any element has to give more than one class, then we give it by applying space."
      },
      {
        "time": "06:04",
        "text": "I have removed my mask for a while."
      },
      {
        "time": "08:26",
        "text": "But for now, you understand that if I write border 2px solid blue,"
      },
      {
        "time": "09:48",
        "text": "Then all this space will come out here."
      },
      {
        "time": "11:00",
        "text": "And here we give box sizing property."
      },
      {
        "time": "12:14",
        "text": "That hey CSS God."
      },
      {
        "time": "13:29",
        "text": "You will enjoy it."
      },
      {
        "time": "14:38",
        "text": "Look at my arrow above."
      },
      {
        "time": "15:44",
        "text": "I have given a margin of 30 pixels in box A."
      }
    ]
  }
};
