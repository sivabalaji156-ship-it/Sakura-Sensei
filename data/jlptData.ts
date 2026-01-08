
import { StudyItem, JLPTLevel, ReadingMaterial, RawKanji, ListeningMaterial } from '../types';

// --- Hiragana & Katakana Charts ---
export const HIRAGANA_CHART = [
    { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
    { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
    { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
    { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' },
    { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' },
    { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
    { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' },
    { char: 'や', romaji: 'ya' }, { char: '', romaji: '' }, { char: 'ゆ', romaji: 'yu' }, { char: '', romaji: '' }, { char: 'よ', romaji: 'yo' },
    { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' },
    { char: 'わ', romaji: 'wa' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: 'を', romaji: 'wo' },
    { char: 'ん', romaji: 'n' }
];

export const KATAKANA_CHART = [
    { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
    { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
    { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
    { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
    { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' },
    { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
    { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
    { char: 'ヤ', romaji: 'ya' }, { char: '', romaji: '' }, { char: 'ユ', romaji: 'yu' }, { char: '', romaji: '' }, { char: 'ヨ', romaji: 'yo' },
    { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
    { char: 'ワ', romaji: 'wa' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: 'ヲ', romaji: 'wo' },
    { char: 'ン', romaji: 'n' }
];

// === KANJI DATASET (For Flashcards Only) ===
// Kept for the Flashcards feature, but not organized into "Lessons" in the module list.
const KANJI_RAW: RawKanji[] = [
    { kanji: '一', level: 'N5', strokeCount: 1, onyomi: 'ICHI', kunyomi: 'hito-tsu', meaning: 'One', exampleWord: '一つ', exampleReading: 'hitotsu', exampleMeaning: 'One thing' },
    { kanji: '二', level: 'N5', strokeCount: 2, onyomi: 'NI', kunyomi: 'futa-tsu', meaning: 'Two', exampleWord: '二月', exampleReading: 'nigatsu', exampleMeaning: 'February' },
    { kanji: '三', level: 'N5', strokeCount: 3, onyomi: 'SAN', kunyomi: 'mit-tsu', meaning: 'Three', exampleWord: '三日', exampleReading: 'mikka', exampleMeaning: '3rd day' },
    { kanji: '四', level: 'N5', strokeCount: 5, onyomi: 'SHI', kunyomi: 'yon', meaning: 'Four', exampleWord: '四月', exampleReading: 'shigatsu', exampleMeaning: 'April' },
    { kanji: '五', level: 'N5', strokeCount: 4, onyomi: 'GO', kunyomi: 'itsu-tsu', meaning: 'Five', exampleWord: '五円', exampleReading: 'goen', exampleMeaning: '5 Yen' },
    { kanji: '日', level: 'N5', strokeCount: 4, onyomi: 'NICHI', kunyomi: 'hi', meaning: 'Day', exampleWord: '日本', exampleReading: 'nihon', exampleMeaning: 'Japan' },
    { kanji: '月', level: 'N5', strokeCount: 4, onyomi: 'GETSU', kunyomi: 'tsuki', meaning: 'Month', exampleWord: '月曜日', exampleReading: 'getsuyoubi', exampleMeaning: 'Monday' },
    { kanji: '火', level: 'N5', strokeCount: 4, onyomi: 'KA', kunyomi: 'hi', meaning: 'Fire', exampleWord: '火曜日', exampleReading: 'kayoubi', exampleMeaning: 'Tuesday' },
    { kanji: '水', level: 'N5', strokeCount: 4, onyomi: 'SUI', kunyomi: 'mizu', meaning: 'Water', exampleWord: '水曜日', exampleReading: 'suiyoubi', exampleMeaning: 'Wednesday' },
    { kanji: '木', level: 'N5', strokeCount: 4, onyomi: 'MOKU', kunyomi: 'ki', meaning: 'Tree', exampleWord: '木曜日', exampleReading: 'mokuyoubi', exampleMeaning: 'Thursday' },
    { kanji: '私', level: 'N4', strokeCount: 7, onyomi: 'SHI', kunyomi: 'watashi', meaning: 'I/Me', exampleWord: '私立', exampleReading: 'shiritsu', exampleMeaning: 'Private' },
    { kanji: '食', level: 'N4', strokeCount: 9, onyomi: 'SHOKU', kunyomi: 'ta-beru', meaning: 'Eat', exampleWord: '食事', exampleReading: 'shokuji', exampleMeaning: 'Meal' },
    { kanji: '心', level: 'N3', strokeCount: 4, onyomi: 'SHIN', kunyomi: 'kokoro', meaning: 'Heart', exampleWord: '心配', exampleReading: 'shinpai', exampleMeaning: 'Worry' },
    { kanji: '政', level: 'N2', strokeCount: 9, onyomi: 'SEI', kunyomi: 'matsurigoto', meaning: 'Politics', exampleWord: '政治', exampleReading: 'seiji', exampleMeaning: 'Politics' },
    { kanji: '議', level: 'N1', strokeCount: 20, onyomi: 'GI', kunyomi: '-', meaning: 'Deliberation', exampleWord: '会議', exampleReading: 'kaigi', exampleMeaning: 'Meeting' }
];

// --- HELPER FUNCTIONS ---
let itemIdCounter = 1;
const generateId = (prefix: string) => `${prefix}_${itemIdCounter++}`;

const createVocabLesson = (level: JLPTLevel, lessonNum: number, title: string, words: any[]): StudyItem[] => {
    return words.map(w => ({
        id: generateId('v'),
        level,
        type: 'vocabulary',
        lesson: lessonNum,
        lessonTitle: title,
        question: w.word,
        reading: w.romaji ? `${w.reading} (${w.romaji})` : w.reading,
        meaning: w.meaning,
        example: w.example.jp,
        exampleTranslation: w.example.en
    }));
};

const createGrammarLesson = (level: JLPTLevel, lessonNum: number, title: string, item: any): StudyItem => {
    return {
        id: generateId('g'),
        level,
        type: 'grammar',
        lesson: lessonNum,
        lessonTitle: title,
        question: item.formation ? `${item.title} (${item.formation})` : item.title,
        reading: item.explanation,
        meaning: item.explanation,
        example: item.examples[0].jp,
        exampleTranslation: item.examples[0].en
    };
};

// =================================================================================================
// DATA GENERATION START
// =================================================================================================

const generateStudyContent = (): StudyItem[] => {
    const allItems: StudyItem[] = [];

    // --- 1. KANJI (Flashcards) ---
    KANJI_RAW.forEach(k => {
        allItems.push({
            id: generateId('k'),
            level: k.level,
            type: 'kanji',
            lesson: 99, // General pool
            question: k.kanji,
            reading: `On: ${k.onyomi} | Kun: ${k.kunyomi}`,
            meaning: k.meaning,
            example: `${k.exampleWord} (${k.exampleReading})`,
            exampleTranslation: k.exampleMeaning,
            strokeCount: k.strokeCount
        });
    });

    // --- 2. VOCABULARY LESSONS ---
    
    // N5 Vocab (10 Lessons)
    allItems.push(...createVocabLesson('N5', 1, "Daily Activities", [
        {word:"起きる",reading:"おきる",romaji:"okiru",meaning:"to wake up",example:{jp:"6時に起きます。",en:"I wake up at 6."}},
        {word:"寝る",reading:"ねる",romaji:"neru",meaning:"to sleep",example:{jp:"11時に寝ます。",en:"I sleep at 11."}},
        {word:"行く",reading:"いく",romaji:"iku",meaning:"to go",example:{jp:"学校へ行きます。",en:"I go to school."}},
        {word:"来る",reading:"くる",romaji:"kuru",meaning:"to come",example:{jp:"友だちが来ます。",en:"A friend comes."}},
        {word:"帰る",reading:"かえる",romaji:"kaeru",meaning:"to return",example:{jp:"家に帰ります。",en:"I return home."}},
        {word:"食べる",reading:"たべる",romaji:"taberu",meaning:"to eat",example:{jp:"ご飯を食べます。",en:"I eat rice."}},
        {word:"飲む",reading:"のむ",romaji:"nomu",meaning:"to drink",example:{jp:"水を飲みます。",en:"I drink water."}},
        {word:"見る",reading:"みる",romaji:"miru",meaning:"to see/watch",example:{jp:"映画を見ます。",en:"I watch a movie."}},
        {word:"する",reading:"する",romaji:"suru",meaning:"to do",example:{jp:"勉強をします。",en:"I do studying."}},
        {word:"勉強する",reading:"べんきょうする",romaji:"benkyou suru",meaning:"to study",example:{jp:"日本語を勉強します。",en:"I study Japanese."}}
    ]));
    
    // N5 Procedural Vocab Generation for remaining 9 lessons
    const n5VocabThemes = ["Food & Drinks", "Places", "Time & Numbers", "Adjectives", "Family", "Transportation", "Shopping", "Weather", "Common Verbs"];
    n5VocabThemes.forEach((title, idx) => {
        const lessonNum = idx + 2;
        const dummyWords = Array.from({length: 12}, (_, i) => ({
            word: `${title} Word ${i+1}`,
            reading: `yomi-${i+1}`,
            romaji: `word${i+1}`,
            meaning: `Meaning of ${title} word ${i+1}`,
            example: { jp: `これは${title}の例文です。`, en: `This is an example for ${title}.` }
        }));
        allItems.push(...createVocabLesson('N5', lessonNum, title, dummyWords));
    });

    // N4 Vocab (15 Lessons)
    const n4VocabThemes = ["Work Environment", "Travel Terms", "Health & Body", "Hobbies", "Feelings", "City Life", "Nature", "Clothing", "Technology", "Education", "Relationships", "Household", "Emergency", "Events", "Culture"];
    n4VocabThemes.forEach((title, idx) => {
        const lessonNum = idx + 1;
        const dummyWords = Array.from({length: 12}, (_, i) => ({
            word: `N4 ${title} ${i+1}`,
            reading: `yomi-${i+1}`,
            meaning: `N4 Term for ${title} ${i+1}`,
            example: { jp: `N4レベルの${title}です。`, en: `This is N4 level ${title}.` }
        }));
        allItems.push(...createVocabLesson('N4', lessonNum, title, dummyWords));
    });

    // N3 Vocab (20 Lessons)
    for(let i=1; i<=20; i++) {
        const dummyWords = Array.from({length: 12}, (_, j) => ({
            word: `N3 Word ${i}-${j+1}`,
            reading: `yomi`,
            meaning: `N3 Complex Term ${j+1}`,
            example: { jp: `N3の例文です。`, en: `N3 Example sentence.` }
        }));
        allItems.push(...createVocabLesson('N3', i, `N3 Topic ${i}`, dummyWords));
    }

    // N2 Vocab (25 Lessons) & N1 Vocab (30 Lessons) - similar procedural generation
    ['N2', 'N1'].forEach(lvl => {
        const count = lvl === 'N2' ? 25 : 30;
        for(let i=1; i<=count; i++) {
            const dummyWords = Array.from({length: 15}, (_, j) => ({
                word: `${lvl} Word ${i}-${j+1}`,
                reading: `yomi`,
                meaning: `Advanced ${lvl} Term ${j+1}`,
                example: { jp: `${lvl}レベルの表現です。`, en: `This is a ${lvl} level expression.` }
            }));
            allItems.push(...createVocabLesson(lvl as JLPTLevel, i, `${lvl} Advanced Topic ${i}`, dummyWords));
        }
    });

    // --- 3. GRAMMAR LESSONS ---

    // N5 Grammar (12 Lessons)
    allItems.push(createGrammarLesson('N5', 1, "です・ます (Polite Form)", {
        title: "です・ます",
        explanation: "Basic polite sentence ending used in daily conversation.",
        formation: "Noun / Adjective / Verb + です / ます",
        examples: [{jp:"私は学生です。", en:"I am a student."}]
    }));
    allItems.push(createGrammarLesson('N5', 2, "Particles: は / が", {
        title: "Particles wa/ga",
        explanation: "Topic marker vs Subject marker.",
        formation: "N + は / N + が",
        examples: [{jp:"私は田中です。", en:"I am Tanaka."}]
    }));
    // ... Fill N5 Grammar
    const n5GrammarTitles = ["Particles: を / に / で", "も (Also)", "から (Because)", "と (And/With)", "があります/います", "ましょう (Let's)", "て-form Intro", "ください (Please)", "V-stem + たい", "Simple Past (た-form)"];
    n5GrammarTitles.forEach((t, i) => {
        allItems.push(createGrammarLesson('N5', i+3, t, {
            title: t,
            explanation: `Explanation for ${t}. Important for N5.`,
            formation: `Formation rule for ${t}`,
            examples: [{jp: `例文: ${t}`, en: `Example for ${t}`}]
        }));
    });

    // N4-N1 Grammar
    const grammarCounts = { 'N4': 18, 'N3': 25, 'N2': 30, 'N1': 35 };
    Object.entries(grammarCounts).forEach(([lvl, count]) => {
        for(let i=1; i<=count; i++) {
            allItems.push(createGrammarLesson(lvl as JLPTLevel, i, `${lvl} Grammar Point ${i}`, {
                title: `${lvl} Grammar ${i}`,
                explanation: `Detailed explanation of ${lvl} grammar point ${i}.`,
                formation: `Pattern for Grammar ${i}`,
                examples: [{jp: `${lvl}の文法${i}を使った文です。`, en: `Sentence using ${lvl} grammar ${i}.`}]
            }));
        }
    });

    return allItems;
};

export const FULL_JLPT_CONTENT = generateStudyContent();

// --- 4. READING LESSONS ---
const generateReadingContent = (): ReadingMaterial[] => {
    const materials: ReadingMaterial[] = [];
    
    // N5 Reading (10 Lessons)
    materials.push({
        id: 'read-n5-01',
        level: 'N5',
        lesson: 1,
        title: "My School",
        content: "私は学生です。毎日学校へ行きます。学校は大きいです。先生は親切です。私は日本語のクラスが好きです。",
        translation: "I am a student. I go to school every day. The school is big. The teacher is kind. I like the Japanese class.",
        questions: [
             { id: 'q-r-n5-1', type: 'reading', question: "Who is the speaker?", options: ["Teacher", "Student", "Worker"], correctIndex: 1, explanation: "First sentence says 'Watashi wa gakusei desu'." }
        ]
    });

    const n5ReadingTitles = ["Daily Routine", "My Family", "Weekend Plans", "Shopping Trip", "Weather Report", "Favorite Food", "Travel Diary", "Time Schedule", "My Hobbies"];
    n5ReadingTitles.forEach((t, i) => {
        materials.push({
            id: `read-n5-${i+2}`,
            level: 'N5',
            lesson: i+2,
            title: t,
            content: `[N5 Reading Text about ${t}]... 今日はいい天気です...`,
            translation: `[Translation for ${t}]...`,
            questions: [{ id: `q-r-n5-${i+2}`, type: 'reading', question: `Question about ${t}?`, options: ["A", "B", "C"], correctIndex: 0, explanation: "Answer A is correct." }]
        });
    });

    // N4-N1 Reading
    const readingCounts = { 'N4': 12, 'N3': 15, 'N2': 18, 'N1': 20 };
    Object.entries(readingCounts).forEach(([lvl, count]) => {
         for(let i=1; i<=count; i++) {
             materials.push({
                 id: `read-${lvl.toLowerCase()}-${i}`,
                 level: lvl as JLPTLevel,
                 lesson: i,
                 title: `${lvl} Reading Practice ${i}`,
                 content: `[${lvl} Level Text Paragraph ${i}]... 漢字と文法の練習...`,
                 translation: `[Translation for ${lvl} Lesson ${i}]...`,
                 questions: [{ id: `q-r-${lvl}-${i}`, type: 'reading', question: `Comprehension Q${i}?`, options: ["Option 1", "Option 2", "Option 3"], correctIndex: 0, explanation: "Explanation here." }]
             });
         }
    });

    return materials;
};

export const READING_MATERIALS = generateReadingContent();

// --- 5. LISTENING LESSONS ---
const generateListeningContent = (): ListeningMaterial[] => {
    const materials: ListeningMaterial[] = [];

    // N5 Listening (10 Lessons)
    materials.push({
        id: 'list-n5-01',
        level: 'N5',
        lesson: 1,
        title: "At the Station",
        description: "Asking for directions",
        duration: "0:45",
        transcript: "Excuse me, where is the toilet? ... It is over there.",
        audioScript: "すみません。トイレはどこですか。 ... あそこです。",
        questions: [{ id: 'q-l-n5-1', type: 'listening', question: "What is the speaker looking for?", options: ["Exit", "Toilet", "Train"], correctIndex: 1, explanation: "He asks for 'toire'." }]
    });

    const n5ListeningTitles = ["Convenience Store", "Restaurant", "School Office", "Introducing Self", "Asking Time", "Weather Forecast", "On the Train", "Family Chat", "Department Store"];
    n5ListeningTitles.forEach((t, i) => {
        materials.push({
            id: `list-n5-${i+2}`,
            level: 'N5',
            lesson: i+2,
            title: t,
            description: `Listening practice: ${t}`,
            duration: "1:00",
            transcript: `English transcript for ${t}...`,
            audioScript: `日本語のスクリプト (${t})...`,
            questions: [{ id: `q-l-n5-${i+2}`, type: 'listening', question: "What happened?", options: ["A", "B", "C"], correctIndex: 0, explanation: "Explanation." }]
        });
    });

    // N4-N1 Listening
    const listeningCounts = { 'N4': 12, 'N3': 15, 'N2': 18, 'N1': 20 };
    Object.entries(listeningCounts).forEach(([lvl, count]) => {
        for(let i=1; i<=count; i++) {
            materials.push({
                id: `list-${lvl.toLowerCase()}-${i}`,
                level: lvl as JLPTLevel,
                lesson: i,
                title: `${lvl} Listening Scenario ${i}`,
                description: `Scenario about topic ${i}`,
                duration: "1:30",
                transcript: `Transcript ${i}`,
                audioScript: `Audio Script ${i}`,
                questions: [{ id: `q-l-${lvl}-${i}`, type: 'listening', question: "Question?", options: ["1", "2", "3"], correctIndex: 0, explanation: "Exp." }]
            });
        }
    });

    return materials;
};

export const LISTENING_MATERIALS = generateListeningContent();
