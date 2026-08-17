export type Category =
  | "Academics"
  | "Campus Life"
  | "Money"
  | "Entertainment"
  | "Technology"
  | "Relationships";

export const CATEGORIES: Category[] = [
  "Academics",
  "Campus Life",
  "Money",
  "Entertainment",
  "Technology",
  "Relationships",
];

export const CATEGORY_META: Record<Category, { color: string; soft: string; blurb: string }> = {
  Academics: { color: "#14603f", soft: "#e2ede4", blurb: "Study tips, course guides, scholarships" },
  "Campus Life": { color: "#0e7c7b", soft: "#ddeeea", blurb: "Halls, clubs, SRC, traditions" },
  Money: { color: "#b07c00", soft: "#fbeec9", blurb: "Side hustles, budgeting, student biz" },
  Entertainment: { color: "#d93a5b", soft: "#f9e2e6", blurb: "Music, events, talent, campus culture" },
  Technology: { color: "#2456a6", soft: "#e0e8f4", blurb: "AI, gadgets, digital skills" },
  Relationships: { color: "#a34a8c", soft: "#f3e3ef", blurb: "Confessions, friendship, advice" },
};

export interface Writer {
  id: string;
  name: string;
  level: string;
  dept: string;
  initials: string;
  color: string;
  followers: number;
  articles: number;
  verified: boolean;
  badges: string[];
  bio: string;
}

export interface Comment {
  id: string;
  name: string;
  text: string;
  time: string;
  color: string;
}

export interface PollOption {
  label: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  voted: number | null;
}

export interface Draft {
  id: string;
  title: string;
  bodyHtml: string;
  category: Category;
  anonymous: boolean;
  updated: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  body: string[];
  author: Writer;
  anonymous?: boolean;
  sponsored?: boolean;
  category: Category;
  time: string;
  minsAgo: number;
  readMins: number;
  likes: number;
  liked: boolean;
  useful: number;
  usefulMarked: boolean;
  saved: boolean;
  trending?: boolean;
  reported?: boolean;
  image?: string;
  cover?: { bg: string; big: string; sub: string };
  poll?: Poll;
  comments: Comment[];
  tags: string[];
}

export interface Announcement {
  id: string;
  org: string;
  initials: string;
  color: string;
  kind: string;
  text: string;
  time: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  day: string;
  month: string;
  time: string;
  venue: string;
  tag: "Social" | "Sports" | "Career" | "Culture";
  going: number;
  image?: string;
  color: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  seller: string;
  level: string;
  location: string;
  image?: string;
  cover?: { bg: string; big: string };
  tag: string;
}

export interface Service {
  id: string;
  title: string;
  price: string;
  seller: string;
  rating: number;
  jobs: number;
  color: string;
}

export interface Community {
  id: string;
  name: string;
  members: number;
  color: string;
  desc: string;
  joined: boolean;
}

export interface Notification {
  id: string;
  kind: "like" | "comment" | "announce" | "event" | "poll";
  text: string;
  time: string;
  unread: boolean;
}

export const fmt = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : `${n}`;

export const fmtGHS = (n: number): string => `GHS ${n.toLocaleString()}`;

export const currentUser: Writer = {
  id: "w-yaw",
  name: "Yaw Mensah",
  level: "Level 300",
  dept: "Computer Science",
  initials: "YM",
  color: "#14603f",
  followers: 1820,
  articles: 32,
  verified: true,
  badges: ["Top Writer", "Trending Creator", "Academic Contributor", "Entrepreneur"],
  bio: "Writing about student money, code and campus survival. Started a GHS 200 business — ask me anything.",
};

const sarah: Writer = {
  id: "w-sarah", name: "Sarah Osei", level: "Level 200", dept: "Nursing",
  initials: "SO", color: "#d93a5b", followers: 2340, articles: 21, verified: true,
  badges: ["Top Writer", "Academic Contributor"],
  bio: "Surviving clinicals and sharing everything I wish someone told me in Level 100.",
};
const kofi: Writer = {
  id: "w-kofi", name: "Kofi Boateng", level: "Level 400", dept: "Business Admin",
  initials: "KB", color: "#b07c00", followers: 1510, articles: 17, verified: false,
  badges: ["Entrepreneur"],
  bio: "Food explorer. On a mission to rate every chop bar within 1km of campus.",
};
const efua: Writer = {
  id: "w-efua", name: "Efua Mensimah", level: "Level 300", dept: "Theatre Arts",
  initials: "EM", color: "#a34a8c", followers: 980, articles: 9, verified: false,
  badges: ["Culture Keeper"],
  bio: "If it's happening on campus, I'm front row. Talent show superfan.",
};
const kwame: Writer = {
  id: "w-kwame", name: "Kwame Asante", level: "Level 200", dept: "Computer Eng.",
  initials: "KA", color: "#2456a6", followers: 1120, articles: 14, verified: true,
  badges: ["Tech Voice"],
  bio: "Building things with code and telling students which AI tools are actually worth it.",
};
const abena: Writer = {
  id: "w-abena", name: "Abena Darko", level: "Level 100", dept: "Law",
  initials: "AD", color: "#0e7c7b", followers: 445, articles: 5, verified: false,
  badges: ["Fresh Voice"],
  bio: "Freshman with opinions. Hostel reviews, hall politics and honest stories.",
};

export const writers: Writer[] = [sarah, kofi, efua, kwame, abena];

export const initialPosts: Post[] = [
  {
    id: "p1",
    title: "How I survived Level 100 — and how you can too",
    excerpt:
      "I came in with 3 notebooks, zero direction and a CGPA scare by week six. Here is the exact system that pulled me from 1.9 to 3.4 — no 'just read more' advice, I promise.",
    body: [
      "Nobody tells you that the first semester of Level 100 is a trap. The lectures feel slow, the readings feel optional, and then the mid-semester exams arrive like a debt collector. I found out the hard way — my first quiz average was 41%.",
      "The turnaround started with one decision: I stopped treating lectures as the main event. The main event is past questions. Every department has a folder of them circulating on WhatsApp. Get it in week one, not week ten. I mapped every lecture topic to the questions it had produced in the last three years and studied backwards.",
      "Second: the 50-minute hall rule. I booked a seat in the library reading hall every single day from 4pm to 6pm — same seat, same time. It sounds boring. That is exactly why it works. My brain stopped negotiating with me about whether to study, because 4pm meant the hall.",
      "Third, find one person who is slightly ahead of you. Not the course genius — the person one step ahead who remembers being confused. I met Ama from Level 200 at a faculty fellowship and those 30-minute Sunday calls saved my GPA.",
      "If you are reading this mid-semester with a CGPA scare, breathe. One bad assessment is data, not destiny. Fix the system, not your self-esteem.",
    ],
    author: sarah,
    category: "Academics",
    time: "2h",
    minsAgo: 120,
    readMins: 6,
    likes: 1243,
    liked: false,
    useful: 986,
    usefulMarked: false,
    saved: false,
    trending: true,
    cover: { bg: "#14603f", big: "1.9→3.4", sub: "THE LEVEL 100 PLAYBOOK" },
    comments: [
      { id: "c1", name: "Kojo A.", text: "The past-questions-first method carried me through anatomy. Can confirm.", time: "1h", color: "#2456a6" },
      { id: "c2", name: "Linda M.", text: "Needed this today. My quiz average is 44% and I've been hiding from my parents' calls.", time: "58m", color: "#0e7c7b" },
      { id: "c3", name: "Yaw Mensah", text: "Bookmarking this for my little sister's freshers week. Pure gold.", time: "41m", color: "#14603f" },
    ],
    tags: ["#Level100", "#StudyTips", "#CGPA"],
  },
  {
    id: "p2",
    title: "5 affordable places to eat around campus (all under GHS 25)",
    excerpt:
      "I ate at 14 spots in three weeks so your stipend doesn't have to suffer. These five delivered big portions, clean kitchens and prices that respect a student budget.",
    body: [
      "Let's be honest: the cafeteria queue at 12:30 is a human rights situation. So I spent three weeks eating my way around campus with one rule — nothing above GHS 25. Fourteen spots. Some tragic. But these five earned a permanent spot in my rotation.",
      "Number one is Auntie Mercy's behind the east gate. Waakye with egg, fish and shito for GHS 22. She opens at 6am, which means she is also the best breakfast on this list. Go before 9am or accept the queue as a lifestyle.",
      "Number two: Baba Grill by the trotro station. Chicken kebab and fried rice for GHS 20 after 6pm. It is a night spot — the smoke, the music, the crowd. It is an experience, not just food.",
      "Number three is the quiet champion — the Hausa koko and koose stand opposite Hall 2. GHS 8. I said what I said. Eight cedis for a breakfast that holds you until lunch.",
      "Full rankings with photos of every plate (including the tragic ones) in the comments. Drop your own spots — I will update this list every semester.",
    ],
    author: kofi,
    category: "Money",
    time: "5h",
    minsAgo: 300,
    readMins: 5,
    likes: 892,
    liked: true,
    useful: 1450,
    usefulMarked: true,
    saved: true,
    trending: true,
    image: "images/food.jpg",
    comments: [
      { id: "c4", name: "Priya K.", text: "Auntie Mercy's shito is criminal. In a good way. Criminal.", time: "4h", color: "#d93a5b" },
      { id: "c5", name: "Daniel O.", text: "You missed the indomie spot inside the hostels. GHS 15 with egg and sausage!", time: "3h", color: "#b07c00" },
    ],
    tags: ["#CampusFood", "#Budget", "#HCUeats"],
  },
  {
    id: "p3",
    title: "I started a business with GHS 200 — here are my real numbers",
    excerpt:
      "Everyone posts the success story. I'm posting the spreadsheet: what GHS 200 actually became in 12 weeks of selling phone accessories between lectures.",
    body: [
      "Twelve weeks ago I had GHS 200, a phone case I bought from myself, and mild embarrassment about both. Today the same hustle has turned over GHS 3,840. These are the real numbers, including the mistakes.",
      "Week 1–2: I bought 12 phone cases and 20 screen protectors from Okaishie on a Saturday trotro run. Cost: GHS 186, leaving GHS 14 for transport and regret. I sold nothing for nine days because I was too shy to post. Lesson one: the product is not the hard part. Opening your mouth is.",
      "Week 3–6: I posted in three class WhatsApp groups and the hostel broadcast list. First sale came from my own roommate, which I count as a sale and also as nepotism. By week six I was at GHS 940 in revenue, reinvesting everything.",
      "Week 7–12: The breakthrough was bundles — case plus protector plus delivery to your hostel room for GHS 5 extra. Delivery-to-room is the whole business. Students will pay for not walking downstairs.",
      "Net profit after 12 weeks: GHS 1,610. Not life-changing. But I learned pricing, inventory, and that my classmates are my market. Next semester: power banks. Follow for the numbers on that too.",
    ],
    author: currentUser,
    category: "Money",
    time: "9h",
    minsAgo: 540,
    readMins: 7,
    likes: 731,
    liked: false,
    useful: 812,
    usefulMarked: false,
    saved: false,
    trending: true,
    cover: { bg: "#b07c00", big: "₵200→₵3,840", sub: "12 WEEKS · REAL NUMBERS" },
    comments: [
      { id: "c6", name: "Efua M.", text: "The delivery-to-room insight is everything. Convenience is the product.", time: "8h", color: "#a34a8c" },
      { id: "c7", name: "Michael T.", text: "Bro send me the Okaishie plug's number before semester resumes please.", time: "6h", color: "#2456a6" },
      { id: "c8", name: "Sarah O.", text: "This is the content this platform was made for. Following for the power bank arc.", time: "5h", color: "#d93a5b" },
    ],
    tags: ["#SideHustle", "#StudentBiz", "#Entrepreneur"],
  },
  {
    id: "p4",
    title: "What's the biggest problem students face this semester?",
    excerpt:
      "The SRC research desk is collecting student sentiment before the town hall on the 20th. One vote per student — results go straight into the presentation.",
    body: [
      "Before the all-students town hall on the 20th, the SRC research desk wants one clear answer: what is squeezing students the hardest right now?",
      "Vote once, vote honestly. The top three issues get dedicated slides and a committed response from the Dean of Students' office. Last semester's poll pushed the library to extend closing hours to midnight during exams — 2,300 votes did that.",
      "If your issue is not on the list, write it in the comments. We read every single one.",
    ],
    author: kwame,
    category: "Campus Life",
    time: "12h",
    minsAgo: 720,
    readMins: 2,
    likes: 445,
    liked: false,
    useful: 388,
    usefulMarked: false,
    saved: false,
    trending: true,
    poll: {
      question: "What's the biggest problem students face?",
      voted: null,
      options: [
        { label: "Accommodation", votes: 701 },
        { label: "Food prices", votes: 498 },
        { label: "Transport", votes: 350 },
        { label: "Internet", votes: 204 },
        { label: "Fees & payments", votes: 89 },
      ],
    },
    comments: [
      { id: "c9", name: "Rita B.", text: "Accommodation. My 'single room' has three wall cracks and a family of geckos I've named.", time: "11h", color: "#0e7c7b" },
      { id: "c10", name: "Selorm K.", text: "Internet. You cannot submit a 10MB assignment on campus wifi at 11pm. It is physically impossible.", time: "9h", color: "#2456a6" },
    ],
    tags: ["#SRC", "#CampusPulse", "#TownHall"],
  },
  {
    id: "p5",
    title: "Best hostels near campus — the 2026 honest review",
    excerpt:
      "I toured 9 hostels, interviewed 23 residents and read every complaint group I could find. Water pressure, security, landlord energy — all rated.",
    body: [
      "Hostel hunting in August is a competitive sport with no referees. Landlords show you the room at 10am with perfect lighting and by October you discover the water schedule is 'whenever God willing'. So I did the boring work for you.",
      "I scored each hostel on five things: rent value, water reliability, security, distance to the east gate, and landlord responsiveness. Full spreadsheet is linked in my profile.",
      "The winner surprised me: Crystal Lodge, 12 minutes from the east gate, GHS 1,900 per semester for a decent single, borehole with a storage tank (translation: water even when the main line fails), and a landlord who actually picks up calls. Residents gave him a 4.6/5, the highest I recorded.",
      "The one to avoid: I will not name it here because I enjoy having kneecaps, but it rhymes with 'Best View Lodge' and the 'self-contained' bathroom is contained in your imagination. Check the spreadsheet. You will know it when you see it.",
      "Tour tip: always visit at 7pm, never 10am. That is when you meet the real neighbours, hear the real noise level, and see whether the lights actually work.",
    ],
    author: abena,
    category: "Campus Life",
    time: "1d",
    minsAgo: 1440,
    readMins: 8,
    likes: 1104,
    liked: false,
    useful: 1620,
    usefulMarked: false,
    saved: false,
    image: "images/hostel.jpg",
    comments: [
      { id: "c11", name: "Yaw Mensah", text: "The 7pm visit rule changed my life last year. Everyone should read this before September.", time: "20h", color: "#14603f" },
      { id: "c12", name: "Grace N.", text: "Crystal Lodge resident confirming — the borehole carried us through the whole of January.", time: "16h", color: "#b07c00" },
    ],
    tags: ["#HostelLife", "#Freshers", "#Housing"],
  },
  {
    id: "p6",
    title: "I failed my first semester and didn't know how to tell my parents",
    excerpt:
      "Anonymous story. I sat on my results for six weeks. Here is what happened when I finally called home.",
    body: [
      "I got my first-semester results on a Tuesday and did not open the PDF for three days. When I did, I closed it and made a plan: never mention it, study harder, fix it quietly, and let my parents keep the version of me that gets Dean's List.",
      "Six weeks of that plan nearly broke me. I was skipping meals to buy extra handouts, sleeping four hours, and flinching every time my mother asked 'how is school?'. The secret was heavier than the grades.",
      "I called home on a Sunday evening. My voice shook so badly my father asked if I was sick. I said: 'Papa, my results were not good. I am sorry.' There was silence. Then my mother took the phone and said the thing I will never forget: 'We did not send you there to suffer alone. Come home for mid-semester break. We will talk.'",
      "Nobody screamed. Nobody withdrew fees. My father asked for the courses I struggled in and found me a cousin who teaches one of them. I spent the break with a whiteboard and a tutor instead of shame.",
      "I am retaking two courses this semester and I am fine. If you are sitting on results right now: the conversation you are dreading is almost certainly kinder than the one in your head.",
    ],
    author: currentUser,
    anonymous: true,
    category: "Relationships",
    time: "1d",
    minsAgo: 1560,
    readMins: 5,
    likes: 2011,
    liked: false,
    useful: 743,
    usefulMarked: false,
    saved: false,
    trending: true,
    comments: [
      { id: "c13", name: "Anonymous", text: "Read this in the library and cried a little. Thank you for posting it.", time: "22h", color: "#a34a8c" },
      { id: "c14", name: "Anonymous", text: "'The secret was heavier than the grades' — I felt that in my chest.", time: "18h", color: "#0e7c7b" },
      { id: "c15", name: "Anonymous", text: "Parents are scarier in our heads. Mine surprised me too when I finally told them.", time: "12h", color: "#2456a6" },
    ],
    tags: ["#Confessions", "#MentalHealth"],
  },
  {
    id: "p7",
    title: "5 AI tools that actually help with assignments (without writing them for you)",
    excerpt:
      "I tested 23 AI tools against a real thermodynamics problem set. Most are plagiarism traps. These five genuinely make you faster and sharper.",
    body: [
      "There are two kinds of AI students on campus right now: the ones getting flagged for copy-paste, and the ones quietly using AI as a study partner. This list is about becoming the second kind.",
      "Number one: NotebookLM. You feed it your lecture slides and past questions, then interrogate it like a patient senior. 'Explain this slide like I missed the lecture' is a legal cheat code. It cites the exact slide, so you can verify everything.",
      "Number two: Wolfram Alpha for anything mathematical. It shows steps, not just answers. Using it is like sitting next to the quiet genius in class who actually shows their work.",
      "Number three: a simple flashcard app with spaced repetition. AI generates the cards from your notes; your brain does the rest. This combination beat my 'reread the handout five times' method by a mile in a memory test I ran on myself.",
      "The rule I live by: if the tool produces text you are going to submit, it is a trap. If it produces understanding you are going to own, it is a tool. The difference shows up in exam hall, where there is no wifi.",
    ],
    author: kwame,
    category: "Technology",
    time: "2d",
    minsAgo: 2880,
    readMins: 6,
    likes: 655,
    liked: false,
    useful: 1290,
    usefulMarked: false,
    saved: false,
    comments: [
      { id: "c16", name: "Nana Y.", text: "The 'understanding vs text' rule should be printed on every faculty notice board.", time: "1d", color: "#14603f" },
    ],
    tags: ["#AI", "#StudySmart", "#Tech"],
  },
  {
    id: "p8",
    title: "Campus Talent Show: meet the five acts everyone will be talking about",
    excerpt:
      "Auditions ran three hours over schedule because nobody wanted to leave. Here are the acts that stopped the theatre — one of them is a Level 100 you have never heard of. Yet.",
    body: [
      "I have covered the talent show for two years and I have never seen auditions run three hours over schedule because the judges refused to stop watching. September 18 is going to be a problem.",
      "The headline act: 'Adom & The Voltage', a four-piece band from Hall 3 whose drummer plays in slippers. I asked why. He said grip. The set they ran at auditions had the cleaners dancing with mops still in hand.",
      "The dark horse: Efua's spoken word piece about trotro mates. I cannot describe it without ruining it, but two judges wiped their eyes and one asked her to perform it at the SRC dinner.",
      "And the one to watch: Kobby, a Level 100 who does something with a football, a chair and a speaker that I will simply call 'illegal in three regions'. He auditioned last, at 9:40pm, to an auditorium that had grown to twice its size because word got out.",
      "Tickets are free for students but the theatre holds 400. Last year 700 showed up. Do the maths. Arrive early or watch from the window like the rest of us did.",
    ],
    author: efua,
    category: "Entertainment",
    time: "2d",
    minsAgo: 2940,
    readMins: 4,
    likes: 534,
    liked: false,
    useful: 96,
    usefulMarked: false,
    saved: false,
    cover: { bg: "#d93a5b", big: "SEPT 18", sub: "TALENT SHOW · THE ACTS" },
    comments: [
      { id: "c17", name: "Hall 3 Rep", text: "Can confirm the drummer's slippers are regulation. We checked.", time: "1d", color: "#b07c00" },
    ],
    tags: ["#TalentShow", "#CampusCulture"],
  },
  {
    id: "p9",
    title: "Exam fuel: full-day meal plans for GHS 15 — Zaza's delivers to your hostel",
    excerpt:
      "Sponsored · Zaza's Kitchen is offering CampusVoice students a dedicated exam-week menu: breakfast, lunch and dinner bundles from GHS 15, delivered to all hostels between 7am and 10pm.",
    body: [
      "Exam week is not the time to negotiate with hunger at 11pm. Zaza's Kitchen, the student kitchen behind the science block, has built a dedicated exam menu for this season.",
      "The bundles: breakfast (koko + koose or bread + egg) for GHS 8, lunch plates from GHS 15, and the 9pm 'closing combo' — jollof or waakye plus a drink for GHS 18. Show your CampusVoice profile at pickup for 10% off, or order through their line for hostel delivery at GHS 2.",
      "Full menu and ordering line are pinned in the comments. This is a sponsored post — Zaza's paid for placement — but every price listed is the real student price.",
    ],
    author: kofi,
    sponsored: true,
    category: "Money",
    time: "3d",
    minsAgo: 4320,
    readMins: 2,
    likes: 210,
    liked: false,
    useful: 64,
    usefulMarked: false,
    saved: false,
    image: "images/food.jpg",
    comments: [],
    tags: ["#Sponsored", "#ExamSeason"],
  },
];

export const announcements: Announcement[] = [
  {
    id: "a1", org: "SRC", initials: "SR", color: "#14603f", kind: "Elections",
    text: "Student election nominations open Monday, 9:00 AM. Collect forms at the SRC office — bring your student ID and two passport photos. Deadline: Friday 5 PM sharp.",
    time: "1h",
  },
  {
    id: "a2", org: "Exams Office", initials: "EO", color: "#2456a6", kind: "Timetable",
    text: "Level 300 examination timetable has been released. Check your department notice boards and the student portal. Clash petitions close Wednesday.",
    time: "4h",
  },
  {
    id: "a3", org: "University", initials: "HU", color: "#b07c00", kind: "Orientation",
    text: "Orientation for all newly admitted students begins September 3 at the Assembly Hall, 8:00 AM. New students should report with admission letters.",
    time: "1d",
  },
  {
    id: "a4", org: "Library", initials: "LB", color: "#0e7c7b", kind: "Hours",
    text: "Reading halls will run extended hours (until midnight) from two weeks before exams. Group study rooms remain bookable via the front desk.",
    time: "2d",
  },
  {
    id: "a5", org: "Hall 2 Warden", initials: "H2", color: "#d93a5b", kind: "Notice",
    text: "Water supply will be interrupted on Saturday 6 AM – 2 PM for tank maintenance. Please store water on Friday evening. We apologise for the inconvenience.",
    time: "3d",
  },
];

export const events: CampusEvent[] = [
  {
    id: "e1", title: "Freshers Night '26", day: "03", month: "SEP",
    time: "7:00 PM", venue: "Assembly Hall", tag: "Social", going: 1240,
    image: "images/freshers.jpg", color: "#d93a5b",
  },
  {
    id: "e2", title: "Inter-Hall Football Final", day: "07", month: "SEP",
    time: "3:00 PM", venue: "Main Sports Field", tag: "Sports", going: 860,
    color: "#14603f",
  },
  {
    id: "e3", title: "Career Fair '26", day: "12", month: "SEP",
    time: "9:00 AM", venue: "Great Hall", tag: "Career", going: 640,
    color: "#2456a6",
  },
  {
    id: "e4", title: "Campus Talent Show", day: "18", month: "SEP",
    time: "6:30 PM", venue: "University Theatre", tag: "Culture", going: 980,
    image: "images/freshers.jpg", color: "#b07c00",
  },
  {
    id: "e5", title: "SRC Manifesto Debate", day: "22", month: "SEP",
    time: "5:00 PM", venue: "Lecture Hall A", tag: "Culture", going: 410,
    color: "#0e7c7b",
  },
  {
    id: "e6", title: "3-on-3 Basketball Open", day: "26", month: "SEP",
    time: "2:00 PM", venue: "Basketball Court", tag: "Sports", going: 230,
    color: "#a34a8c",
  },
];

export const listings: Listing[] = [
  {
    id: "l1", title: "iPhone 13 · 128GB, midnight", price: 5500, seller: "Michael",
    level: "Level 300", location: "Hall 1", image: "images/phone.jpg", tag: "Phones",
  },
  {
    id: "l2", title: "HP Pavilion laptop · i5, 16GB", price: 4200, seller: "Adwoa",
    level: "Level 400", location: "Hall 4", image: "images/laptop.jpg", tag: "Laptops",
  },
  {
    id: "l3", title: "Nike Court Vision · size 43", price: 350, seller: "Selorm",
    level: "Level 200", location: "Hall 3", image: "images/sneakers.jpg", tag: "Fashion",
  },
  {
    id: "l4", title: "Calculus I & II textbook bundle", price: 120, seller: "Rita",
    level: "Level 200", location: "Science Block",
    cover: { bg: "#14603f", big: "MATH" }, tag: "Books",
  },
  {
    id: "l5", title: "Mini fridge · 90L, barely used", price: 800, seller: "Kwabena",
    level: "Level 400", location: "Hostels (East)",
    cover: { bg: "#0e7c7b", big: "90L" }, tag: "Hostel",
  },
  {
    id: "l6", title: "Ring light + tripod + mic kit", price: 180, seller: "Efua",
    level: "Level 300", location: "Arts Block",
    cover: { bg: "#a34a8c", big: "GLOW" }, tag: "Creator",
  },
];

export const services: Service[] = [
  { id: "s1", title: "Graphic design & flyers", price: "GHS 100+", seller: "Derrick · L300, Design", rating: 4.8, jobs: 64, color: "#14603f" },
  { id: "s2", title: "Event photography", price: "GHS 300/event", seller: "Joselyn · L200, Media", rating: 4.9, jobs: 38, color: "#d93a5b" },
  { id: "s3", title: "Website development", price: "GHS 500+", seller: "Yaw Mensah · L300, CS", rating: 5.0, jobs: 21, color: "#2456a6" },
  { id: "s4", title: "Makeup & hair styling", price: "GHS 150+", seller: "Abigail · L400", rating: 4.7, jobs: 92, color: "#a34a8c" },
  { id: "s5", title: "Barber — hostel visits", price: "GHS 50", seller: "Kojo · L200", rating: 4.6, jobs: 140, color: "#b07c00" },
  { id: "s6", title: "CV & cover letter writing", price: "GHS 40", seller: "Naa · L400, Law", rating: 4.8, jobs: 57, color: "#0e7c7b" },
];

export const communities: Community[] = [
  { id: "g1", name: "HCU Entrepreneurs", members: 2140, color: "#b07c00", desc: "Side hustles, startup talk and supplier plugs.", joined: true },
  { id: "g2", name: "Campus Foodies", members: 1675, color: "#d93a5b", desc: "Every chop bar rated. No mercy, only shito.", joined: true },
  { id: "g3", name: "SRC Watch", members: 1204, color: "#14603f", desc: "Holding student government accountable, politely.", joined: false },
  { id: "g4", name: "Tech Club HCU", members: 980, color: "#2456a6", desc: "Build nights, hackathons and gadget gossip.", joined: false },
  { id: "g5", name: "Hall 3 Residents", members: 640, color: "#0e7c7b", desc: "The official group for the best hall on campus. (Sorry, Hall 1.)", joined: false },
  { id: "g6", name: "Freshers '26", members: 1890, color: "#a34a8c", desc: "Everything new students need, asked without judgement.", joined: false },
];

export const notifications: Notification[] = [
  { id: "n1", kind: "like", text: "Sarah Osei and 47 others found your article useful", time: "12m", unread: true },
  { id: "n2", kind: "announce", text: "SRC posted: election nominations open Monday", time: "1h", unread: true },
  { id: "n3", kind: "poll", text: "Your poll passed 1,800 votes — results inside", time: "3h", unread: true },
  { id: "n4", kind: "comment", text: "Kofi Boateng commented on your GHS 200 story", time: "6h", unread: false },
  { id: "n5", kind: "event", text: "Reminder: Freshers Night '26 is this Thursday", time: "1d", unread: false },
];

export const trendingTopics = [
  { tag: "#SRCelections26", posts: 342 },
  { tag: "#FreshersNight", posts: 289 },
  { tag: "#HostelLife", posts: 197 },
  { tag: "#SideHustle", posts: 154 },
  { tag: "#ExamSeason", posts: 121 },
];

export const pulsePoll: Poll = {
  question: "Best study spot on campus?",
  voted: null,
  options: [
    { label: "The Library", votes: 512 },
    { label: "My hostel room", votes: 301 },
    { label: "The cafeteria (chaos)", votes: 208 },
    { label: "Under the mango tree", votes: 140 },
  ],
};

export const tickerItems = [
  "SRC nominations open Monday 9AM",
  "Level 300 exam timetable released",
  "Freshers Night '26 — tickets moving fast",
  "Library midnight hours start exam week",
  "Inter-Hall final: Hall 3 vs Hall 1",
  "Career Fair '26 — 40+ employers confirmed",
  "Water maintenance in Hall 2 on Saturday",
];
