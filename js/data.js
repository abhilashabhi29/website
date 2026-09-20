/**
 * Sample/placeholder content for the archive.
 * Replace every bracketed [PLACEHOLDER] value with real information.
 * Fields:
 *   id          - unique slug, used in work.html?id=...
 *   category    - "books" | "magazine" | "articles"
 *   title       - work title
 *   year        - publication year
 *   publisher   - publisher / journal name (leave "[PUBLISHER]" if unknown)
 *   shortDesc   - 2-3 line summary shown on listing cards
 *   longDesc    - fuller description shown on the detail page (can include \n\n for paragraphs)
 *   coverTone   - 1-4, controls the placeholder cover color (cosmetic only)
 *   featured    - true to surface on the homepage
 *   linkLabel   - text for the external/download button on the detail page
 *   linkUrl     - "#" until a real PDF/external link is available
 *   pdfFile     - path to a local PDF (e.g. "pdfs/book-1.pdf") to embed a reader
 *                 on the detail page. Leave "" if there's no PDF for this work yet
 *                 (or if linkUrl points somewhere external instead).
 *   coverImage  - path to a real cover photo (e.g. "covers/book-1.jpg"). Leave ""
 *                 to fall back to the generic colored placeholder cover.
 *
 * NOTE on the 7 real book entries below: titles, years, and compiler/translator
 * credits were read directly off each PDF's own title page (via a rendered
 * screenshot), so they should be accurate. A few details are marked [VERIFY] —
 * either a name that was hard to read precisely from a stylized/curved logo, or
 * a stylized font — please double-check those against the physical book/PDF.
 * The shortDesc/longDesc fields still need a real synopsis in your own words.
 */

const WORKS = [
  // ---------------- BOOKS ----------------
  {
    id: "book-1",
    category: "books",
    title: "ମନ୍ତ୍ରଜାହ୍ନବୀ (Mantra Janhabi)",
    year: "2025",
    publisher: "[PUBLISHER]",
    shortDesc: "Presented by Jyotsna Mahanti; compiled and edited by Shantilata Pradhan. [DESCRIPTION — add a short synopsis of this book's content and themes.]",
    longDesc: "Compiled and edited by Shantilata Pradhan, with a presentation (upasthapana) by Jyotsna Mahanti.\n\n[FULL DESCRIPTION — add a complete description of the book's content, origin, and significance.]",
    coverTone: 1,
    featured: true,
    linkLabel: "[VIEW / PURCHASE LINK]",
    linkUrl: "#",
    pdfFile: "pdfs/book-1.pdf",
    coverImage: "covers/book-1.jpg"
  },
  {
    id: "book-2",
    category: "books",
    title: "ଅମୃତ ଝଙ୍କାର (Amrut Jhankar)",
    year: "2021",
    publisher: "[PUBLISHER]",
    shortDesc: "A collection of spiritual sayings of Sri Maa and Sri Aurobindo rendered into Odia. Compiled and edited by Shantilata Pradhan. [DESCRIPTION — add a short synopsis.]",
    longDesc: "Odia translation credited to [VERIFY — the cover's stylized curved text was hard to read with confidence; it appears to read approximately \"Arora Ashram companions\"]. Compiled and edited by Shantilata Pradhan.\n\n[FULL DESCRIPTION — add a complete description of this compilation's scope and selection.]",
    coverTone: 2,
    featured: true,
    linkLabel: "[VIEW / PURCHASE LINK]",
    linkUrl: "#",
    pdfFile: "pdfs/book-2.pdf",
    coverImage: ""
  },
  {
    id: "book-3",
    category: "books",
    title: "ଦିବ୍ୟଧାରା (Dibyadhara)",
    year: "2018",
    publisher: "[PUBLISHER]",
    shortDesc: "A collection of spiritual writings of Sri Maa and Sri Aurobindo, translated into Odia by Jadunandan Samal. Compiled and edited by Shantilata Pradhan. [DESCRIPTION — add a short synopsis.]",
    longDesc: "Odia translation by Jadunandan Samal. Compiled and edited by Shantilata Pradhan.\n\n[FULL DESCRIPTION — add a complete description of this compilation.]",
    coverTone: 3,
    featured: false,
    linkLabel: "[DOWNLOAD PDF]",
    linkUrl: "#",
    pdfFile: "pdfs/book-3.pdf",
    coverImage: ""
  },
  {
    id: "book-4",
    category: "books",
    title: "ହିରଣ୍ମୟ (Hiranmaya)",
    year: "2018",
    publisher: "[PUBLISHER — VERIFY: the circular cover logo reads approximately \"… Prakashani, Bhubaneswar\"; please confirm the exact publisher name]",
    shortDesc: "Described on the cover as \"Sri Aurobindo's Sacred-Body Memorial Reading (1)\". Compiled and edited by Shantilata Pradhan. [DESCRIPTION — add a short synopsis.]",
    longDesc: "Compiled and edited by Shantilata Pradhan.\n\n[FULL DESCRIPTION — add a complete description of this book's content and its place in the memorial reading series.]",
    coverTone: 4,
    featured: false,
    linkLabel: "[VIEW / PURCHASE LINK]",
    linkUrl: "#",
    pdfFile: "pdfs/book-4.pdf",
    coverImage: ""
  },
  {
    id: "book-5",
    category: "books",
    title: "ନିଜକୁ ଆବିଷ୍କାର କରିବା (Nijaku Abiskar Kariba)",
    year: "2016",
    publisher: "[PUBLISHER — VERIFY: the circular cover logo reads approximately \"… Prakashani, Bhubaneswar\"; please confirm the exact publisher name]",
    shortDesc: "An original work by Shantilata Pradhan; the title translates to \"To Discover Oneself.\" [DESCRIPTION — add a short synopsis of its themes and content.]",
    longDesc: "Written by Shantilata Pradhan.\n\n[FULL DESCRIPTION — add a complete description of this book's content and themes.]",
    coverTone: 1,
    featured: false,
    linkLabel: "[VIEW / PURCHASE LINK]",
    linkUrl: "#",
    pdfFile: "pdfs/book-5.pdf",
    coverImage: ""
  },
  {
    id: "book-6",
    category: "books",
    title: "ପୂର୍ଣ୍ଣତାର ସନ୍ଧାନେ (Purnatara Sandhane)",
    year: "2022",
    publisher: "Prerana Publication, Cuttack",
    shortDesc: "An original work by Shantilata Pradhan; the title translates to \"In Search of Perfection.\" [DESCRIPTION — add a short synopsis of its themes and content.]",
    longDesc: "Written by Shantilata Pradhan. Published by Prerana Publication, Cuttack.\n\n[FULL DESCRIPTION — add a complete description of this book's content and themes.]",
    coverTone: 2,
    featured: true,
    linkLabel: "[VIEW / PURCHASE LINK]",
    linkUrl: "#",
    pdfFile: "pdfs/book-6.pdf",
    coverImage: ""
  },
  {
    id: "book-7",
    category: "books",
    title: "ଶୁଭ୍ର ଶତଦଳ (Subhra Satadala)",
    year: "2018",
    publisher: "[PUBLISHER]",
    shortDesc: "Described on the cover as \"Divine Words of Sri Maa and Sri Aurobindo,\" translated into Odia by Dr. Jadunandan Samal. [DESCRIPTION — add a short synopsis.]",
    longDesc: "Odia translation by Dr. Jadunandan Samal. [VERIFY — a compiler/editor credit was not visible on the rendered title page; please confirm if Shantilata Pradhan compiled/edited this one as well.]\n\n[FULL DESCRIPTION — add a complete description of this compilation.]",
    coverTone: 3,
    featured: false,
    linkLabel: "[DOWNLOAD PDF]",
    linkUrl: "#",
    pdfFile: "pdfs/book-7.pdf",
    coverImage: ""
  },

  // ---------------- MAGAZINE ----------------
  {
    id: "mag-1",
    category: "magazine",
    title: "[MAGAZINE_ISSUE_TITLE_1]",
    year: "[YEAR]",
    publisher: "[MAGAZINE / JOURNAL NAME]",
    shortDesc: "[DESCRIPTION — summary of this magazine feature or issue contribution, and its central theme.]",
    longDesc: "[FULL DESCRIPTION — details about the magazine issue, the editorial context, and a fuller summary of the piece.]",
    coverTone: 3,
    featured: true,
    linkLabel: "[READ ISSUE]",
    linkUrl: "#"
  },
  {
    id: "mag-2",
    category: "magazine",
    title: "[MAGAZINE_ISSUE_TITLE_2]",
    year: "[YEAR]",
    publisher: "[MAGAZINE / JOURNAL NAME]",
    shortDesc: "[DESCRIPTION — summary of this magazine feature.]",
    longDesc: "[FULL DESCRIPTION — replace with the complete description for this piece.]",
    coverTone: 1,
    featured: false,
    linkLabel: "[READ ISSUE]",
    linkUrl: "#"
  },
  {
    id: "mag-3",
    category: "magazine",
    title: "[MAGAZINE_ISSUE_TITLE_3]",
    year: "[YEAR]",
    publisher: "[MAGAZINE / JOURNAL NAME]",
    shortDesc: "[DESCRIPTION — summary of this magazine feature.]",
    longDesc: "[FULL DESCRIPTION — replace with the complete description for this piece.]",
    coverTone: 2,
    featured: false,
    linkLabel: "[DOWNLOAD PDF]",
    linkUrl: "#"
  },
  {
    id: "mag-4",
    category: "magazine",
    title: "[MAGAZINE_ISSUE_TITLE_4]",
    year: "[YEAR]",
    publisher: "[MAGAZINE / JOURNAL NAME]",
    shortDesc: "[DESCRIPTION — summary of this magazine feature.]",
    longDesc: "[FULL DESCRIPTION — replace with the complete description for this piece.]",
    coverTone: 4,
    featured: false,
    linkLabel: "[READ ISSUE]",
    linkUrl: "#"
  },

  // ---------------- ARTICLES ----------------
  {
    id: "article-1",
    category: "articles",
    title: "[ARTICLE_TITLE_1]",
    year: "[YEAR]",
    publisher: "[PUBLICATION / WEBSITE NAME]",
    shortDesc: "[DESCRIPTION — short summary of this article's subject and argument.]",
    longDesc: "[FULL DESCRIPTION — expand on the article's content, the occasion for writing it, and its key ideas, described in general terms rather than quoted text.]",
    coverTone: 2,
    featured: true,
    linkLabel: "[READ ARTICLE]",
    linkUrl: "#"
  },
  {
    id: "article-2",
    category: "articles",
    title: "[ARTICLE_TITLE_2]",
    year: "[YEAR]",
    publisher: "[PUBLICATION / WEBSITE NAME]",
    shortDesc: "[DESCRIPTION — short summary of this article.]",
    longDesc: "[FULL DESCRIPTION — replace with the complete description for this article.]",
    coverTone: 4,
    featured: false,
    linkLabel: "[READ ARTICLE]",
    linkUrl: "#"
  },
  {
    id: "article-3",
    category: "articles",
    title: "[ARTICLE_TITLE_3]",
    year: "[YEAR]",
    publisher: "[PUBLICATION / WEBSITE NAME]",
    shortDesc: "[DESCRIPTION — short summary of this article.]",
    longDesc: "[FULL DESCRIPTION — replace with the complete description for this article.]",
    coverTone: 1,
    featured: false,
    linkLabel: "[DOWNLOAD PDF]",
    linkUrl: "#"
  },
  {
    id: "article-4",
    category: "articles",
    title: "[ARTICLE_TITLE_4]",
    year: "[YEAR]",
    publisher: "[PUBLICATION / WEBSITE NAME]",
    shortDesc: "[DESCRIPTION — short summary of this article.]",
    longDesc: "[FULL DESCRIPTION — replace with the complete description for this article.]",
    coverTone: 3,
    featured: false,
    linkLabel: "[READ ARTICLE]",
    linkUrl: "#"
  },
  {
    id: "article-5",
    category: "articles",
    title: "[ARTICLE_TITLE_5]",
    year: "[YEAR]",
    publisher: "[PUBLICATION / WEBSITE NAME]",
    shortDesc: "[DESCRIPTION — short summary of this article.]",
    longDesc: "[FULL DESCRIPTION — replace with the complete description for this article.]",
    coverTone: 2,
    featured: false,
    linkLabel: "[READ ARTICLE]",
    linkUrl: "#"
  }
];

const CATEGORY_LABELS = {
  books: "Books",
  magazine: "Magazine",
  articles: "Articles"
};
