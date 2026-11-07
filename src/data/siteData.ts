export type Language = 'en' | 'ar'
export type ThemeMode = 'dark' | 'light'

export type Project = {
  slug: string
  name: string
  category: 'Web' | 'Mobile' | 'AI' | 'Automation' | 'Tools' | 'Movies & TV / Entertainment' | 'Food / Nutrition / Web' | 'Health / Wellness / Web'
  description: {
    en: string
    ar: string
  }
  shortDescription: {
    en: string
    ar: string
  }
  technologies: string[]
  demo: string
  coverImage?: string
  screenshots?: string[]
  image: string
  accent: string
  overview: { en: string; ar: string }
  problem: { en: string; ar: string }
  solution: { en: string; ar: string }
  features: Array<{ en: string; ar: string }>
  process: Array<{ en: string; ar: string }>
  challenges: Array<{ en: string; ar: string }>
  results: Array<{ en: string; ar: string }>
}

export const projects: Project[] = [
  {
    slug: 'lumiere-restaurant',
    name: 'LUMIÈRE Restaurant',
    category: 'Web',
    description: {
      en: 'A modern Mediterranean restaurant website featuring an interactive menu, dish categories, search, shopping bag functionality, restaurant information, gallery, and table reservation experience.',
      ar: 'موقع مطعم متوسطي حديث يضم قائمة تفاعلية، تصنيفات للأطباق، بحث، سلة تسوق، معلومات المطعم، معرض صور، وتجربة حجز طاولات.'
    },
    shortDescription: {
      en: 'Premium Mediterranean dining experience with menu discovery, ordering, and reservations.',
      ar: 'تجربة طعام متوسطي فاخرة مع اكتشاف القائمة، الطلبات، والحجوزات.'
    },
    technologies: [],
    demo: 'https://resturant-one-lac.vercel.app/',
    coverImage: 'https://i.postimg.cc/dtTmSgvg/5c9e7f6e-621d-4a5c-8cf7-85ec172f2d86.jpg',
    image: 'from-orange-500 via-amber-500 to-rose-500',
    accent: '#f59e0b',
    overview: {
      en: 'LUMIÈRE is a premium Mediterranean restaurant web experience centered on elegant dining, seasonal dishes, and an intuitive reservation flow.',
      ar: 'LUMIÈRE هي تجربة ويب مطعم متوسطي فاخر تركز على تناول الطعام الأنيق والأطباق الموسمية وتدفق حجز ذكي.'
    },
    problem: {
      en: 'Restaurants need a polished digital experience that makes menu browsing, ordering, and reservations feel easy and premium for guests.',
      ar: 'تحتاج المطاعم إلى تجربة رقمية أنيقة تجعل تصفح القائمة، الطلب، والحجز سهلًا وفاخرًا للضيوف.'
    },
    solution: {
      en: 'The project brings the restaurant brand to life with a responsive interface, category-based menu filtering, a shopping bag, and a clear table reservation flow.',
      ar: 'تُحضر المشروع هوية المطعم إلى الحياة عبر واجهة متجاوبة، تصنيف القائمة، سلة شراء، وتدفق واضح لحجز الطاولات.'
    },
    features: [
      { en: 'Interactive restaurant menu', ar: 'قائمة مطعم تفاعلية' },
      { en: 'Dish search', ar: 'بحث عن الأطباق' },
      { en: 'Menu category filters', ar: 'تصفية القائمة حسب الفئة' },
      { en: 'Small Plates', ar: 'الأطباق الصغيرة' },
      { en: 'Mains', ar: 'الأطباق الرئيسية' },
      { en: 'From the Grill', ar: 'من الشواية' },
      { en: 'Sweets', ar: 'الحلويات' },
      { en: 'Food item cards', ar: 'بطاقات الأطباق' },
      { en: 'Food images', ar: 'صور الطعام' },
      { en: 'Prices', ar: 'الأسعار' },
      { en: 'Add to Bag functionality', ar: 'وظيفة إضافة إلى السلة' },
      { en: 'Seasonal dish labels', ar: 'تسميات الأطباق الموسمية' },
      { en: 'Chef\'s Pick section', ar: 'قسم اختيارات الشيف' },
      { en: 'Restaurant About section', ar: 'قسم نبذة عن المطعم' },
      { en: 'Restaurant story', ar: 'قصة المطعم' },
      { en: 'Dining room/gallery section', ar: 'قسم قاعة الطعام/المعرض' },
      { en: 'Table reservation section', ar: 'قسم حجز الطاولات' },
      { en: 'Restaurant contact information', ar: 'معلومات التواصل للمطعم' },
      { en: 'Responsive modern interface', ar: 'واجهة حديثة ومتجاوبة' }
    ],
    process: [
      { en: 'Structured the menu and dining experience around discoverability and flow', ar: 'تم تنظيم قائمة الطعام وتجربة المطعم حول سهولة الاكتشاف والتدفق' },
      { en: 'Built a premium restaurant presentation with strong visual hierarchy', ar: 'تم بناء عرض فاخر للمطعم مع هيكل بصري قوي' },
      { en: 'Polished the reservation and bag interactions for usability', ar: 'تم تنقيح تفاعلات الحجز والسلة لتسهيل الاستخدام' }
    ],
    challenges: [
      { en: 'Keeping the interface premium while staying easy to navigate', ar: 'الحفاظ على الواجهة فاخرة مع سهولة التنقل' },
      { en: 'Presenting menu content clearly across mobile and desktop layouts', ar: 'عرض محتوى القائمة بوضوح عبر تصميمات الهاتف والسطحية' }
    ],
    results: [
      { en: 'Created a polished real restaurant experience aligned with the live LUMIÈRE project.', ar: 'تم إنشاء تجربة مطعم أنيقة ومتوافقة مع مشروع LUMIÈRE الحقيقي.' }
    ]
  },
  {
    slug: 'edo-food',
    name: 'EDO FOOD',
    category: 'Food / Nutrition / Web',
    description: {
      en: 'A modern food and nutrition platform designed to help users discover healthy meals and explore nutrition-focused food content through a clean and user-friendly interface.',
      ar: 'منصة حديثة للطعام والتغذية مصممة لمساعدة المستخدمين على اكتشاف الوجبات الصحية واستكشاف محتوى غذائي موجه للتغذية عبر واجهة نظيفة وسهلة الاستخدام.'
    },
    shortDescription: {
      en: 'Healthy recipes and nutrition-focused browsing in a clean food-first experience.',
      ar: 'وصفات صحية وتصفح موجه للتغذية في تجربة غذائية أنيقة.'
    },
    technologies: [],
    demo: 'https://edo-health2.vercel.app/',
    coverImage: 'https://i.postimg.cc/Pxp932xG/Chat-GPT-Image-Sep-19-2026-03-37-38-PM.png',
    image: 'from-emerald-500 via-lime-500 to-amber-500',
    accent: '#22c55e',
    overview: {
      en: 'EDO FOOD is a food and nutrition platform focused on helping users discover healthy meals and browse nutrition-focused recipe content through a clean, approachable experience.',
      ar: 'EDO FOOD هي منصة للطعام والتغذية تركز على مساعدة المستخدمين في اكتشاف الوجبات الصحية وتصفح محتوى وصفات موجه للتغذية عبر تجربة نظيفة وسهلة.'
    },
    problem: {
      en: 'Healthy recipe discovery can feel scattered or overwhelming when users need a simple way to browse food options by dietary preference and meal type.',
      ar: 'قد يبدو اكتشاف الوصفات الصحية منتشرًا أو مرهقًا عندما يحتاج المستخدم إلى طريقة بسيطة لتصفية الخيارات الغذائية حسب التفضيلات الغذائية ونوع الوجبة.'
    },
    solution: {
      en: 'The live project presents a clear homepage with recipe discovery, search, filters for diet and meal type, and recipe cards that make healthy eating feel accessible and enjoyable.',
      ar: 'يعرض المشروع الفعلي صفحة رئيسية واضحة مع اكتشاف الوصفات، بحث، تصفية حسب النظام الغذائي ونوع الوجبة، وبطاقات وصفات تجعل تناول الطعام الصحي يبدو سهلًا وممتعًا.'
    },
    features: [
      { en: 'Recipe discovery and search', ar: 'اكتشاف الوصفات والبحث' },
      { en: 'Diet type filters', ar: 'تصفية حسب نوع النظام الغذائي' },
      { en: 'Meal type filters', ar: 'تصفية حسب نوع الوجبة' },
      { en: 'Healthy recipe cards', ar: 'بطاقات وصفات صحية' },
      { en: 'Cooking time, servings, and calories details', ar: 'تفاصيل وقت الطهي والحصص والسعرات الحرارية' },
      { en: 'Favorites section', ar: 'قسم المفضلة' },
      { en: 'Clean nutrition-focused UI', ar: 'واجهة نظيفة تركز على التغذية' }
    ],
    process: [
      { en: 'Organized the experience around recipe discovery and nutrition browsing', ar: 'تم تنظيم التجربة حول اكتشاف الوصفات وتجربة التغذية' },
      { en: 'Built a clean and approachable food-first interface', ar: 'تم بناء واجهة غذائية نظيفة وسهلة الوصول' },
      { en: 'Structured filtering and recipe presentation for quick browsing', ar: 'تم تنظيم التصفية وعرض الوصفات لتسهيل التصفح السريع' }
    ],
    challenges: [
      { en: 'Keeping the experience simple while supporting many dietary options', ar: 'الحفاظ على البساطة مع دعم خيارات غذائية متنوعة' },
      { en: 'Presenting recipe information clearly and consistently', ar: 'عرض معلومات الوصفات بوضوح وثبات' }
    ],
    results: [
      { en: 'Created a food-focused portfolio entry aligned with the live EDO FOOD project.', ar: 'تم إنشاء إدخال في المحفظة يركز على الطعام ويتوافق مع مشروع EDO FOOD الفعلي.' }
    ]
  },
  {
    slug: 'edo-health',
    name: 'EDO Health',
    category: 'Health / Wellness / Web',
    description: {
      en: 'A personal health companion designed to help users track activity, monitor nutrition, explore health insights, and follow their personal progress through a simple and user-friendly interface.',
      ar: 'مرافق صحي شخصي مصمم لمساعدة المستخدمين على تتبع النشاط، مراقبة التغذية، استكشاف الرؤى الصحية، ومتابعة تقدمهم من خلال واجهة بسيطة وسهلة الاستخدام.'
    },
    shortDescription: {
      en: 'Personal health companion for activity tracking, nutrition monitoring, and progress awareness.',
      ar: 'مرافق صحي شخصي لتتبع النشاط، مراقبة التغذية، ووعي التقدم.'
    },
    technologies: [],
    demo: 'https://edo-health.vercel.app/?embedded=0',
    coverImage: 'https://i.postimg.cc/8zd1wkYk/Chat-GPT-Image-Sep-19-2026-03-45-49-PM.png',
    image: 'from-green-500 via-emerald-500 to-teal-500',
    accent: '#10b981',
    overview: {
      en: 'EDO Health is a personal health companion built to help users build healthier routines by tracking activity, monitoring nutrition, and following progress through a simple interface.',
      ar: 'EDO Health هو مرفق صحي شخصي مصمم لمساعدة المستخدمين على بناء عادات صحية من خلال تتبع النشاط، مراقبة التغذية، ومتابعة التقدم عبر واجهة بسيطة.'
    },
    problem: {
      en: 'People often need a simple place to keep track of health habits without a complicated or overwhelming system.',
      ar: 'غالبًا يحتاج الناس إلى مكان بسيط لتتبع عاداتهم الصحية دون نظام معقد أو مرهق.'
    },
    solution: {
      en: 'The project brings health tracking, nutrition awareness, and personal progress into one clear, approachable platform.',
      ar: 'يجمع المشروع بين تتبع الصحة، الوعي بالتغذية، والتقدم الشخصي في منصة واضحة وسهلة الوصول.'
    },
    features: [
      { en: 'Activity tracking', ar: 'تتبع النشاط' },
      { en: 'Nutrition monitoring', ar: 'مراقبة التغذية' },
      { en: 'Health insights', ar: 'رؤى صحية' },
      { en: 'Personal progress tracking', ar: 'تتبع التقدم الشخصي' },
      { en: 'Simple and user-friendly interface', ar: 'واجهة بسيطة وسهلة الاستخدام' }
    ],
    process: [
      { en: 'Structured the experience around personal health routines', ar: 'تم تنظيم التجربة حول الروتينات الصحية الشخصية' },
      { en: 'Focused on clarity, tracking, and routine visibility', ar: 'تم التركيز على الوضوح وتتبع الروتينات' },
      { en: 'Kept the interface simple and approachable', ar: 'تم الحفاظ على واجهة بسيطة وسهلة الوصول' }
    ],
    challenges: [
      { en: 'Making health tracking feel usable and encouraging rather than overwhelming', ar: 'جعل تتبع الصحة يبدو عمليًا ومشجعًا بدلًا من أن يكون مرهقًا' },
      { en: 'Presenting progress and nutrition data in an easy-to-understand way', ar: 'عرض بيانات التقدم والتغذية بطريقة سهلة الفهم' }
    ],
    results: [
      { en: 'Created a real health-focused portfolio entry based on the live EDO Health product.', ar: 'تم إنشاء إدخال حقيقي يركز على الصحة واستند إلى المنتج الفعلي EDO Health.' }
    ]
  },
  {
    slug: 'cimahub',
    name: 'Cima Hub',
    category: 'Movies & TV / Entertainment',
    description: {
      en: 'A movie and TV discovery platform focused on browsing trending titles, searching entertainment content, and exploring a clean responsive catalog experience.',
      ar: 'منصة لاكتشاف الأفلام والمسلسلات تركز على تصفح العناوين الرائجة، البحث في المحتوى الترفيهي، واستكشاف تجربة كتالوج نظيفة ومتجاوبة.'
    },
    shortDescription: {
      en: 'Movie and TV discovery hub with search, trending titles, and an entertainment-first layout.',
      ar: 'منصة اكتشاف أفلام ومسلسلات مع بحث وعناوين رائجة وتصميم يركز على الترفيه.'
    },
    technologies: [],
    demo: 'https://cima-hub-1-38910527-75389.web.app/',
    coverImage: 'https://i.postimg.cc/0ynfpD9Q/f06ab813-e09c-466c-903a-743c73e045f5.jpg',
    image: 'from-violet-600 via-fuchsia-500 to-pink-500',
    accent: '#f43f5e',
    overview: {
      en: 'Cima Hub is a movie and TV entertainment experience built around discovery, quick search, and a polished browsing flow for trending titles.',
      ar: 'Cima Hub هي تجربة ترفيهية للأفلام والمسلسلات مبنية على الاكتشاف، البحث السريع، وتدفق تصفح أنيق للعناوين الرائجة.'
    },
    problem: {
      en: 'Entertainment catalogs can quickly become overwhelming when the browsing flow is unclear or dense.',
      ar: 'قد تصبح كتالوجات الترفيه مرهقة بسرعة عندما يكون تدفق التصفح غير واضح أو مزدحم.'
    },
    solution: {
      en: 'The live project uses a clear homepage hierarchy, search experience, trending section, and content cards that make browsing movies and TV shows straightforward.',
      ar: 'يستخدم المشروع الفعلي هيكل الصفحة الرئيسية بوضوح، وتجربة بحث، وقسم العناوين الرائجة، وبطاقات محتوى تجعل تصفح الأفلام والمسلسلات مباشرًا.'
    },
    features: [
      { en: 'Search for movies or TV shows', ar: 'بحث عن الأفلام أو المسلسلات' },
      { en: 'Trending this week section', ar: 'قسم العناوين الرائجة هذا الأسبوع' },
      { en: 'Popular Movies section', ar: 'قسم الأفلام الشعبية' },
      { en: 'Movie and TV title cards with posters', ar: 'بطاقات أفلام ومسلسلات بصور بوسترات' },
      { en: 'Rating badges', ar: 'شارات التقييم' },
      { en: 'Language toggle', ar: 'تبديل اللغة' },
      { en: 'Theme toggle', ar: 'تبديل الثيم' },
      { en: 'Responsive entertainment browsing experience', ar: 'تجربة تصفح ترفيهية متجاوبة' }
    ],
    process: [
      { en: 'Organized the experience around search and discovery', ar: 'تم تنظيم التجربة حول البحث والاكتشاف' },
      { en: 'Built a clean, visual catalog layout for entertainment content', ar: 'تم بناء تخطيط كتالوج بصري ونظيف للمحتوى الترفيهي' },
      { en: 'Shaped the app around browsing speed and readability', ar: 'تم تصميم التطبيق حول سرعة التصفح وسهولة القراءة' }
    ],
    challenges: [
      { en: 'Keeping the catalog easy to browse without visual clutter', ar: 'الحفاظ على سهولة التصفح دون فوضى بصرية' },
      { en: 'Presenting a large library of titles clearly across screen sizes', ar: 'عرض مكتبة كبيرة من العناوين بوضوح عبر أحجام الشاشات' }
    ],
    results: [
      { en: 'Created an entertainment-focused catalog experience consistent with the live Cima Hub project.', ar: 'تم إنشاء تجربة كتالوج ترفيهية متوافقة مع مشروع Cima Hub الفعلي.' }
    ]
  },
  {
    slug: 'careerpilot-ai',
    name: 'CareerPilot AI',
    category: 'AI',
    description: {
      en: 'An AI-powered career platform that helps users build stronger CVs, discover relevant opportunities, prepare for interviews, and identify skill gaps.',
      ar: 'منصة مهنية مدعومة بالذكاء الاصطناعي تساعد المستخدمين على بناء سيرة ذاتية أقوى، اكتشاف الفرص المناسبة، التحضير للمقابلات، وتحديد فجوات المهارات.'
    },
    shortDescription: {
      en: 'Career workspace for CV intelligence, role matching, interview prep, and skill-gap analysis.',
      ar: 'مساحة مهنية للتقييم الذكي للسيرة الذاتية ومطابقة الأدوار والتحضير للمقابلات وتحليل فجوات المهارات.'
    },
    technologies: ['AI', 'Career Insights', 'CV Optimization', 'Job Matching', 'Interview Coaching'],
    demo: 'https://careerpilot-ai-coral-kappa.vercel.app/',
    coverImage: 'https://i.postimg.cc/NjCs9C27/Chat-GPT-Image-Sep-19-2026-03-08-23-PM.png',
    image: 'from-blue-500 via-indigo-500 to-violet-600',
    accent: '#3b82f6',
    overview: {
      en: 'CareerPilot AI is a career workspace focused on helping users move forward with more clarity through CV intelligence, role matching, and interview preparation.',
      ar: 'CareerPilot AI هي مساحة مهنية تركز على مساعدة المستخدمين على التقدم بشكل أوضح عبر تقييم السيرة الذاتية، مطابقة الأدوار، والتحضير للمقابلات.'
    },
    problem: {
      en: 'Career decisions can feel uncertain when candidates lack a clear view of how their profile matches available roles or where their skills need improvement.',
      ar: 'قد تبدو قرارات المهنة غير مؤكدة عندما يفتقر المرشح إلى رؤية واضحة لكيفية تناسب ملفه مع الأدوار المتاحة وأين تحتاج مهاراته إلى تحسين.'
    },
    solution: {
      en: 'The platform brings key career tasks into one space: CV analysis, job fit insights, interview practice, and a clear view of skill gaps.',
      ar: 'تجمع المنصة المهام المهنية الأساسية في مساحة واحدة: تحليل السيرة الذاتية، رؤى مناسبة الوظائف، تدريب المقابلات، ورؤية واضحة لفجوات المهارات.'
    },
    features: [
      { en: 'CV intelligence and scoring', ar: 'تحليل السيرة الذاتية وتقييمها' },
      { en: 'Role matching and fit analysis', ar: 'مطابقة الأدوار وتحليل التناسب' },
      { en: 'Interview preparation and feedback', ar: 'التحضير للمقابلات وردود الفعل' },
      { en: 'Skill gap identification', ar: 'تحديد فجوات المهارات' }
    ],
    process: [
      { en: 'Mapped the core career workflow into a single product experience', ar: 'رسم تدفق العمل المهني الأساسي في تجربة منتج واحدة' },
      { en: 'Focused the experience on confidence, clarity, and actionable guidance', ar: 'ركزت التجربة على الثقة والوضوح والإرشاد العملي' },
      { en: 'Shaped a calm, modern interface for career decisions', ar: 'شكلت واجهة هادئة وحديثة لقرارات المهنة' }
    ],
    challenges: [
      { en: 'Making career support feel useful without becoming overwhelming', ar: 'جعل الدعم المهني مفيدًا دون أن يصبح مرهقًا' },
      { en: 'Turning professional insights into a clean and motivating user experience', ar: 'تحويل الرؤى المهنية إلى تجربة مستخدم نظيفة ومحفزة' }
    ],
    results: [
      { en: 'Delivered a real AI career product experience aligned with the live CareerPilot AI product.', ar: 'تم تقديم تجربة منتج حقيقي للذكاء الاصطناعي المهني متوافقة مع المنتج الفعلي CareerPilot AI.' }
    ]
  }
]

export type SkillGroup = {
  group: 'Languages' | 'Frameworks' | 'AI' | 'Tools'
  items: Array<{ name: string; description: { en: string; ar: string } }>
}

export const skillGroups: SkillGroup[] = [
  {
    group: 'Languages',
    items: [
      { name: 'HTML', description: { en: 'Semantic, accessible, and standards-driven structure.', ar: 'هيكل دلالي وقابل للوصول ومبني على المعايير.' } },
      { name: 'CSS', description: { en: 'Responsive design and polished visual systems.', ar: 'تصميم متجاوب وأنظمة بصرية مصقولة.' } },
      { name: 'JavaScript', description: { en: 'Interactive client-side logic and product behavior.', ar: 'منطق تفاعلي على العميل وسلوك المنتج.' } },
      { name: 'TypeScript', description: { en: 'Typed, scalable frontend and backend development.', ar: 'تطوير typed وقابل للتوسع في الواجهة والخلفية.' } },
      { name: 'Python', description: { en: 'Automation, scripting, and AI workflows.', ar: 'الأتمتة والبرمجة النصية وسير العمل الذكية.' } },
      { name: 'Java', description: { en: 'Strong OOP fundamentals and application logic.', ar: 'أساسيات قوية للبرمجة الكائنية وتطبيقات المنطق.' } },
      { name: 'C', description: { en: 'Systems-level thinking and algorithmic precision.', ar: 'فكر منخفض المستوى والدقة الخوارزمية.' } },
      { name: 'C++', description: { en: 'Performance-oriented engineering and software design.', ar: 'هندسة عالية الأداء وتصميم البرامج.' } },
      { name: 'C#', description: { en: 'Strong application development and platform concepts.', ar: 'تطوير التطبيقات بأساسيات قوية وأفكار منصات.' } },
      { name: 'PHP', description: { en: 'Backend logic and server-side integrations.', ar: 'منطق الخلفية وتكاملات الخادم.' } },
      { name: 'Swift', description: { en: 'iOS-focused development and mobile patterns.', ar: 'تطوير خاص بـ iOS وأنماط الجوال.' } },
      { name: 'Kotlin', description: { en: 'Modern Android and JVM application work.', ar: 'تطوير أندرويد ومعالجة JVM الحديثة.' } },
      { name: 'Dart', description: { en: 'Cross-platform app interfaces and product flows.', ar: 'واجهات تطبيقات متعددة المنصات وتيارات المنتج.' } },
      { name: 'Go', description: { en: 'Scalable services and efficient backend patterns.', ar: 'خدمات قابلة للتوسع وأنماط خلفية فعالة.' } },
      { name: 'Ruby', description: { en: 'Rapid prototyping and product scripting.', ar: 'نماذج سريعة وكتابة نصية للمنتجات.' } },
      { name: 'Rust', description: { en: 'Systems safety and performance-focused engineering.', ar: 'أمان الأنظمة وهندسة الأداء.' } },
      { name: 'SQL', description: { en: 'Data modeling and querying for real products.', ar: 'نمذجة البيانات والاستعلامات للمنتجات الحقيقية.' } },
      { name: 'R', description: { en: 'Analysis, data exploration, and statistical work.', ar: 'التحليل واستكشاف البيانات والعمل الإحصائي.' } },
      { name: 'MATLAB', description: { en: 'Technical computing and algorithm exploration.', ar: 'الحوسبة التقنية واستكشاف الخوارزميات.' } },
      { name: 'Shell', description: { en: 'Automation and operational scripting.', ar: 'الأتمتة والبرمجة التشغيلية.' } },
      { name: 'Bash', description: { en: 'Task automation and command-line workflows.', ar: 'أتمتة المهام وسير عمل سطر الأوامر.' } },
      { name: 'Lua', description: { en: 'Fast scripting and lightweight logic.', ar: 'برمجة نصية سريعة ومنطق خفيف.' } },
      { name: 'Objective-C', description: { en: 'Legacy iOS and platform compatibility work.', ar: 'عمل على iOS القديم وملاءمة المنصات.' } },
      { name: 'Scala', description: { en: 'Functional and JVM-based engineering.', ar: 'هندسة وظيفية مبنية على JVM.' } },
      { name: 'Perl', description: { en: 'Text processing and automation utilities.', ar: 'معالجة النصوص والأدوات الآلية.' } },
      { name: 'Assembly', description: { en: 'Low-level understanding and system behavior.', ar: 'فهم منخفض المستوى وسلوك الأنظمة.' } },
      { name: 'Visual Basic', description: { en: 'Quick tooling and desktop application logic.', ar: 'أدوات سريعة ومنطق تطبيقات سطح المكتب.' } },
      { name: 'Solidity', description: { en: 'Smart contracts and blockchain concepts.', ar: 'العقود الذكية ومفاهيم البلوكشين.' } },
      { name: 'JSON', description: { en: 'Structured data exchange and application APIs.', ar: 'تبادل البيانات المنظمة وواجهات التطبيق.' } },
      { name: 'XML', description: { en: 'Data representation and structured integration.', ar: 'تمثيل البيانات وتكاملات منظمة.' } },
      { name: 'YAML', description: { en: 'Configuration and automation definitions.', ar: 'إعدادات التعريفات والأتمتة.' } }
    ]
  },
  {
    group: 'Frameworks',
    items: [
      { name: 'React', description: { en: 'Component-driven interfaces that scale smoothly.', ar: 'واجهات قائمة على المكونات قابلة للتوسع بسلاسة.' } },
      { name: 'Next.js', description: { en: 'Modern production-ready web application architecture.', ar: 'هندسة حديثة جاهزة للإنتاج لتطبيقات الويب.' } },
      { name: 'Node.js', description: { en: 'Server-side logic and API-driven workflows.', ar: 'منطق الخادم وسير العمل القائمة على الواجهات.' } },
      { name: 'Tailwind CSS', description: { en: 'Fast, consistent, and elegant UI systems.', ar: 'نظم واجهة سريعة ومتسقة وأنيقة.' } },
      { name: 'TensorFlow', description: { en: 'Model experimentation and AI integrations.', ar: 'تجارب النماذج وتكاملات الذكاء الاصطناعي.' } },
      { name: 'PyTorch', description: { en: 'Deep learning pipelines and experimentation.', ar: 'خطوط أنابيب التعلم العميق وتجرباته.' } },
      { name: 'Docker', description: { en: 'Environment consistency and deployment readiness.', ar: 'تناسق البيئات والاستعداد للنشر.' } },
      { name: 'Git', description: { en: 'Version control and iterative product work.', ar: 'التحكم بالإصدارات والعمل التكراري على المنتج.' } },
      { name: 'Firebase', description: { en: 'App-ready data and auth infrastructure.', ar: 'بنية جاهزة للتطبيقات للبيانات والمصادقة.' } },
      { name: 'MongoDB', description: { en: 'Document data modeling for flexible products.', ar: 'نمذجة بيانات المستندات للمنتجات المرنة.' } },
      { name: 'MySQL', description: { en: 'Relational data and dependable application storage.', ar: 'بيانات علائقية وتخزين موثوق للتطبيقات.' } },
      { name: 'PostgreSQL', description: { en: 'Robust relational data for production systems.', ar: 'بيانات علائقية قوية للأنظمة الإنتاجية.' } }
    ]
  },
  {
    group: 'AI',
    items: [
      { name: 'Prompt Design', description: { en: 'Crafting useful AI interactions and workflows.', ar: 'صياغة تفاعلات وعمليات ذكاء اصطناعي مفيدة.' } },
      { name: 'OpenAI', description: { en: 'Building practical products with modern AI models.', ar: 'بناء منتجات عملية باستخدام نماذج الذكاء الاصطناعي الحديثة.' } },
      { name: 'AI', description: { en: 'Turning intelligent capabilities into useful product features.', ar: 'تحويل القدرات الذكية إلى ميزات منتج مفيدة.' } },
      { name: 'APIs', description: { en: 'Connecting products through reliable service contracts.', ar: 'ربط المنتجات عبر عقود خدمات موثوقة.' } },
      { name: 'Automation', description: { en: 'Automating repetitive digital tasks and decisions.', ar: 'أتمتة المهام الرقمية المتكررة والقرارات.' } },
      { name: 'LLM UX', description: { en: 'Designing trust-aware, usable AI experiences.', ar: 'تصميم تجارب ذكاء اصطناعي موثوقة وسهلة الاستخدام.' } },
      { name: 'Model Integration', description: { en: 'Connecting AI capabilities into products.', ar: 'ربط قدرات الذكاء الاصطناعي بالمنتجات.' } }
    ]
  },
  {
    group: 'Tools',
    items: [
      { name: 'Figma', description: { en: 'Design exploration and UI iteration.', ar: 'استكشاف التصميم وتكرار واجهة المستخدم.' } },
      { name: 'Vite', description: { en: 'Fast front-end builds and developer workflows.', ar: 'بناءات سريعة وتجربة مطور فعالة.' } },
      { name: 'Postman', description: { en: 'API testing and contract validation.', ar: 'اختبار الواجهات والتحقق من العقود.' } },
      { name: 'VS Code', description: { en: 'Core development environment and tooling.', ar: 'بيئة التطوير الأساسية والأدوات.' } }
    ]
  }
]

export const services = [
  { title: { en: 'Web Development', ar: 'تطوير الويب' }, description: { en: 'Modern responsive websites and web applications.', ar: 'مواقع وتطبيقات ويب حديثة ومتجاوبة.' } },
  { title: { en: 'App Development', ar: 'تطوير التطبيقات' }, description: { en: 'Cross-platform and mobile application development.', ar: 'تطوير تطبيقات متعددة المنصات والجوال.' } },
  { title: { en: 'UI/UX Implementation', ar: 'تنفيذ واجهات المستخدم' }, description: { en: 'Turning designs into responsive interactive interfaces.', ar: 'تحويل التصميمات إلى واجهات تفاعلية ومتجاوبة.' } },
  { title: { en: 'AI Applications', ar: 'تطبيقات الذكاء الاصطناعي' }, description: { en: 'AI-powered tools and intelligent web experiences.', ar: 'أدوات مدعومة بالذكاء الاصطناعي وتجارب ويب ذكية.' } },
  { title: { en: 'Automation', ar: 'الأتمتة' }, description: { en: 'Workflow automation and business process solutions.', ar: 'أتمتة سير العمل وحلول العمليات التجارية.' } },
  { title: { en: 'API & Backend', ar: 'الواجهة الخلفية والـ API' }, description: { en: 'Scalable APIs and backend integrations.', ar: 'واجهات برمجة تطبيقات قابلة للتوسع وتكاملات خلفية.' } }
]


export const contactLinks = {
  email: 'eyaddarwish257@gmail.com',
  phone: '+201025747646',
  github: 'https://github.com/edotyson',
  linkedin: 'https://linkedin.com/in/edotyson',
  x: 'https://twitter.com/edotyson',
  facebook: 'https://facebook.com/eyad.darwish.7798',
  whatsapp: 'https://wa.me/201025747646'
}

export const portfolioContent = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      services: 'Services',
      journey: 'Journey',
      contact: 'Contact',
      talk: "Let's Talk"
    },
    hero: {
      badge: '',
      title: 'I Build Digital Experiences That Make an Impact.',
      subtitle: 'I create modern web applications, mobile experiences, AI-powered products, and digital solutions with a focus on performance, usability, and clean design.',
      primary: 'View My Work',
      secondary: "Let's Work Together",
      intro: 'Web & App Developer',
      summary: 'I build modern digital experiences, web applications, and smart solutions.'
    },
    about: {
      label: 'About me',
      heading: 'Designing thoughtful digital experiences with code and product intuition.',
      body1: 'I am Eyad Darwish, a developer focused on web development, app development, modern UI/UX, APIs, automation, AI-powered applications, and solving real user problems with clear technical thinking.',
      body2: 'I am studying Computer Science / Computers & Information and continuously improving my skills through practical projects, experimentation, and building meaningful digital solutions.',
      stats: [
        { value: '20+', label: 'Technologies' },
        { value: 'Multiple', label: 'Projects' },
        { value: 'Always', label: 'Learning' }
      ]
    },
    skills: {
      label: 'Skills',
      heading: 'Tools and technologies I use to build thoughtful products.',
      search: 'Search technologies',
      all: 'All',
      description: 'Explore my stack across languages, frameworks, AI, and product tooling.'
    },
    projectsSection: {
      label: 'Projects',
      heading: 'Selected work built for usability, impact, and product thinking.',
      filter: ['All', 'Web', 'Mobile', 'AI', 'Automation', 'Tools'],
      details: 'View Details',
      live: 'Live Demo'
    },
    servicesSection: {
      label: 'What I can build',
      heading: 'Services designed around product quality and practical execution.'
    },
    contact: {
      label: 'Contact',
      heading: "Let's Build Something Great Together.",
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      note: 'Use the form or reach out directly through the contact links below.',
      success: 'Thanks! Your message is ready to send.',
      fallback: 'No EmailJS key is configured yet. Your draft is prepared to send via email.'
    },
    footer: {
      intro: 'Web & App Developer',
      rights: 'All rights reserved.'
    },
    admin: {
      title: 'Admin dashboard',
      subtitle: 'Update your portfolio content with secure access.',
      passwordLabel: 'Admin password',
      login: 'Access dashboard',
      disabled: 'Admin access is not configured. Add a VITE_ADMIN_PASSWORD in your environment to enable it.',
      logout: 'Logout'
    },
    notFound: {
      title: '404',
      heading: "Looks like you've entered the wrong dimension.",
      button: 'Back Home'
    },
    projectDetail: {
      overview: 'Overview',
      problem: 'Problem',
      solution: 'Solution',
      features: 'Features',
      tech: 'Technologies',
      screenshots: 'Screenshots',
      process: 'Development process',
      challenges: 'Challenges',
      results: 'Results',
      live: 'Live Demo',
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'نبذة',
      skills: 'المهارات',
      projects: 'المشاريع',
      services: 'الخدمات',
      journey: 'رحلتي',
      contact: 'تواصل',
      talk: 'تحدث معي'
    },
    hero: {
      badge: '',
      title: 'أبني تجارب رقمية تترك أثرًا.',
      subtitle: 'أقوم بإنشاء تطبيقات ويب حديثة وتجارب موبايل ومنتجات مدعومة بالذكاء الاصطناعي وحلول رقمية مع تركيز على الأداء وسهولة الاستخدام وتصميم نظيف.',
      primary: 'عرض مشاريعي',
      secondary: 'لنبدأ تعاونًا',
      intro: 'مطور ويب وتطبيقات',
      summary: 'أبني تجارب رقمية عصرية، تطبيقات ويب، وحلول ذكية.'
    },
    about: {
      label: 'نبذة عني',
      heading: 'أصمم تجارب رقمية مدروسة باستخدام الكود وفهم المنتج.',
      body1: 'أنا إياد درويش، مطور يركز على تطوير الويب، تطوير التطبيقات، تصميم واجهات المستخدم الحديثة، واجهات برمجة التطبيقات، الأتمتة، التطبيقات المدعومة بالذكاء الاصطناعي، وحل مشاكل المستخدمين من خلال تفكير تقني واضح.',
      body2: 'أنا أدرس علوم الحاسب / الحاسبات والمعلومات وأطور مهاراتي باستمرار من خلال مشاريع عملية وتجارب وبناء حلول رقمية ذات معنى.',
      stats: [
        { value: '20+', label: 'تقنيات' },
        { value: 'متعدد', label: 'المشاريع' },
        { value: 'دائمًا', label: 'متعلّم' }
      ]
    },
    skills: {
      label: 'المهارات',
      heading: 'الأدوات والتقنيات التي أستخدمها لبناء منتجات مدروسة.',
      search: 'ابحث عن التقنية',
      all: 'الكل',
      description: 'استكشف مكدستي عبر اللغات والأطر والذكاء الاصطناعي وأدوات المنتج.'
    },
    projectsSection: {
      label: 'المشاريع',
      heading: 'أعمال مختارة تم بناؤها مع التركيز على سهولة الاستخدام والأثر.',
      filter: ['الكل', 'ويب', 'موبايل', 'ذكاء', 'أتمتة', 'أدوات'],
      details: 'عرض التفاصيل',
      live: 'معاينة مباشرة'
    },
    servicesSection: {
      label: 'ما الذي أستطيع بناؤه',
      heading: 'خدمات مصممة حول جودة المنتج والتنفيذ العملي.'
    },
    contact: {
      label: 'تواصل',
      heading: 'لنُنشئ شيئًا رائعًا معًا.',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      subject: 'الموضوع',
      message: 'الرسالة',
      send: 'إرسال الرسالة',
      note: 'استخدم النموذج أو تواصل مباشرة عبر الروابط أدناه.',
      success: 'شكرًا! رسالتك جاهزة للإرسال.',
      fallback: 'لم يتم إعداد مفتاح EmailJS بعد. تم تجهيز المسودة لإرسالها عبر البريد الإلكتروني.'
    },
    footer: {
      intro: 'مطور ويب وتطبيقات',
      rights: 'جميع الحقوق محفوظة.'
    },
    admin: {
      title: 'لوحة الإدارة',
      subtitle: 'حدّث محتوى محفظتك عبر وصول آمن.',
      passwordLabel: 'كلمة مرور الإدارة',
      login: 'الدخول إلى اللوحة',
      disabled: 'الوصول إلى الإدارة غير مهيأ. أضف VITE_ADMIN_PASSWORD في المتغيرات البيئية لتفعيله.',
      logout: 'تسجيل الخروج'
    },
    notFound: {
      title: '404',
      heading: 'يبدو أنك دخلت بعدًا غير صحيح.',
      button: 'العودة إلى الرئيسية'
    },
    projectDetail: {
      overview: 'نظرة عامة',
      problem: 'المشكلة',
      solution: 'الحل',
      features: 'المميزات',
      tech: 'التقنيات',
      screenshots: 'لقطات الشاشة',
      process: 'عملية التطوير',
      challenges: 'التحديات',
      results: 'النتائج',
      live: 'معاينة مباشرة',
    }
  }
}
