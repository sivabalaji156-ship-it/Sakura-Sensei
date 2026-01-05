
import { StudyItem, JLPTLevel, ReadingMaterial } from '../types';

// --- Hiragana & Katakana Data ---
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

// --- Reading Material Data ---
export const READING_MATERIALS: ReadingMaterial[] = [
    // N5 Level
    {
        id: 'n5_1',
        level: 'N5',
        title: '私の日曜日 (My Sunday)',
        content: '日曜日に私は朝8時に起きました。そして、朝ご飯を食べました。朝ご飯はパンと卵でした。10時に友達が家に来ました。私たちは一緒にゲームをしました。昼ご飯はレストランで食べました。おいしかったです。',
        translation: 'On Sunday I woke up at 8 in the morning. Then I ate breakfast. Breakfast was bread and eggs. At 10 o\'clock, a friend came to my house. We played games together. We ate lunch at a restaurant. It was delicious.',
        questions: [
            { id: 'q1', type: 'reading', question: '朝ご飯は何でしたか？', options: ['ご飯と魚', 'パンと卵', 'パンとコーヒー', '何も食べませんでした'], correctIndex: 1, explanation: 'It says "朝ご飯はパンと卵でした" (Breakfast was bread and eggs).' },
            { id: 'q2', type: 'reading', question: '昼ご飯はどこで食べましたか？', options: ['家で', '公園で', 'レストランで', '学校で'], correctIndex: 2, explanation: 'It says "レストランで食べました" (Ate at a restaurant).' }
        ]
    },
    {
        id: 'n5_2',
        level: 'N5',
        title: '新しい先生 (New Teacher)',
        content: '今日、学校に新しい先生が来ました。名前は田中先生です。田中先生は英語の先生です。とても背が高いです。そして、おもしろいです。私たちは田中先生が好きです。',
        translation: 'Today, a new teacher came to school. His name is Mr. Tanaka. Mr. Tanaka is an English teacher. He is very tall. And he is interesting/funny. We like Mr. Tanaka.',
        questions: [
            { id: 'q1', type: 'reading', question: '田中先生は何の先生ですか？', options: ['日本語', '英語', '数学', '歴史'], correctIndex: 1, explanation: 'Text: "英語の先生です" (English teacher).' }
        ]
    },

    // N4 Level
    {
        id: 'n4_1',
        level: 'N4',
        title: '京都旅行 (Trip to Kyoto)',
        content: '先週、新幹線で京都に行きました。東京から京都まで2時間半ぐらいかかりました。京都には古いお寺や神社がたくさんあります。私は金閣寺を見ました。とてもきれいでした。また行きたいです。',
        translation: 'Last week, I went to Kyoto by Shinkansen. It took about 2 and a half hours from Tokyo to Kyoto. There are many old temples and shrines in Kyoto. I saw Kinkakuji. It was very beautiful. I want to go again.',
        questions: [
            { id: 'q1', type: 'reading', question: '東京から京都までどのくらいかかりましたか？', options: ['1時間', '2時間', '2時間半', '3時間'], correctIndex: 2, explanation: 'Text: "2時間半ぐらい" (About 2.5 hours).' },
            { id: 'q2', type: 'reading', question: '京都には何がありますか？', options: ['高いビル', '海', '古いお寺や神社', '大きな空港'], correctIndex: 2, explanation: 'Text: "古いお寺や神社" (Old temples and shrines).' }
        ]
    },

    // N3 Level
    {
        id: 'n3_1',
        level: 'N3',
        title: '日本の自動販売機 (Japanese Vending Machines)',
        content: '日本の道には、たくさんの自動販売機があります。飲み物だけでなく、アイスクリームや温かい食べ物も売っています。また、災害の時に無料で飲み物を提供する機械もあります。これはとても便利で、安心できるシステムです。',
        translation: 'There are many vending machines on the streets of Japan. They sell not only drinks but also ice cream and hot food. Also, there are machines that provide free drinks during disasters. This is a very convenient and reassuring system.',
        questions: [
            { id: 'q1', type: 'reading', question: '自動販売機は何を売っていますか？', options: ['飲み物だけ', '服', '飲み物や食べ物', '車'], correctIndex: 2, explanation: 'Text mentions drinks, ice cream, and hot food.' },
            { id: 'q2', type: 'reading', question: '災害の時、どうなりますか？', options: ['壊れます', '無料で飲み物を出します', '高くなります', '使えなくなります'], correctIndex: 1, explanation: 'Text: "無料で飲み物を提供する" (Provide free drinks).' }
        ]
    },

    // N2 Level
    {
        id: 'n2_1',
        level: 'N2',
        title: '敬語の難しさ (Difficulty of Keigo)',
        content: '外国人にとって、日本語の敬語は非常に複雑です。相手との関係や状況によって、尊敬語、謙譲語、丁寧語を使い分けなければなりません。しかし、敬語を適切に使うことで、相手に良い印象を与え、円滑なコミュニケーションを築くことができます。',
        translation: 'For foreigners, Japanese Keigo is very complex. Depending on the relationship and situation, one must switch between Sonkeigo, Kenjougo, and Teineigo. However, by using Keigo appropriately, one can give a good impression and build smooth communication.',
        questions: [
            { id: 'q1', type: 'reading', question: '敬語を使うメリットは何ですか？', options: ['日本語が簡単になる', '相手に良い印象を与える', '友達が増える', '給料が上がる'], correctIndex: 1, explanation: 'Text: "相手に良い印象を与え" (Give a good impression).' }
        ]
    },

    // N1 Level
    {
        id: 'n1_1',
        level: 'N1',
        title: 'AIと未来 (AI and the Future)',
        content: '人工知能（AI）の急速な進化は、私たちの生活様式を根本から変えつつある。労働市場においては、単純作業の自動化が進む一方で、創造性や感情的知性を要する職業の価値が高まると予測されている。我々はAIと共存するための新たな倫理観とスキルを習得する必要があるだろう。',
        translation: 'The rapid evolution of AI is fundamentally changing our lifestyle. In the labor market, while automation of simple tasks progresses, the value of professions requiring creativity and emotional intelligence is predicted to rise. We will need to acquire new ethics and skills to coexist with AI.',
        questions: [
            { id: 'q1', type: 'reading', question: 'どのような職業の価値が高まると予測されていますか？', options: ['単純作業', '計算をする仕事', '創造性を要する仕事', '肉体労働'], correctIndex: 2, explanation: 'Text: "創造性や感情的知性を要する職業の価値が高まる" (Professions requiring creativity... value will rise).' }
        ]
    }
];

const generateContent = (): StudyItem[] => {
    const items: StudyItem[] = [];
    const levels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
    
    // Curated samples for realism
    const curated: Partial<StudyItem>[] = [
        // N5
        { level: 'N5', type: 'kanji', question: '日', reading: 'にち (nichi)', meaning: 'Day / Sun', example: '日曜日に海に行きます。', exampleTranslation: 'I go to the beach on Sundays.' },
        { level: 'N5', type: 'kanji', question: '国', reading: 'くに (kuni)', meaning: 'Country', example: 'どの国から来ましたか？', exampleTranslation: 'Which country are you from?' },
        { level: 'N5', type: 'vocabulary', question: '猫', reading: 'ねこ (neko)', meaning: 'Cat', example: '猫が好きです。', exampleTranslation: 'I like cats.' },
        { level: 'N5', type: 'grammar', question: '〜です', reading: 'desu', meaning: 'To be (is/am/are)', example: '私は学生です。', exampleTranslation: 'I am a student.' },
        
        // N4
        { level: 'N4', type: 'kanji', question: '試', reading: 'し (shi)', meaning: 'Test / Try', example: '試合に出ます。', exampleTranslation: 'I will participate in the match.' },
        { level: 'N4', type: 'vocabulary', question: '警察', reading: 'けいさつ (keisatsu)', meaning: 'Police', example: '警察を呼んでください。', exampleTranslation: 'Please call the police.' },
        { level: 'N4', type: 'grammar', question: '〜方', reading: 'kata', meaning: 'How to do...', example: 'この漢字の書き方がわかりません。', exampleTranslation: 'I don\'t know how to write this Kanji.' },

        // N3
        { level: 'N3', type: 'kanji', question: '政', reading: 'せい (sei)', meaning: 'Politics', example: '政治に興味があります。', exampleTranslation: 'I am interested in politics.' },
        { level: 'N3', type: 'vocabulary', question: '優勝', reading: 'ゆうしょう (yuushou)', meaning: 'Victory / Championship', example: '彼が優勝しました。', exampleTranslation: 'He won the championship.' },
        { level: 'N3', type: 'grammar', question: '〜に対して', reading: 'ni taishite', meaning: 'In contrast to / Regarding', example: '都会に対して、田舎は静かだ。', exampleTranslation: 'In contrast to the city, the countryside is quiet.' },

        // N2
        { level: 'N2', type: 'kanji', question: '爆', reading: 'ばく (baku)', meaning: 'Explode', example: '爆発が起きました。', exampleTranslation: 'An explosion occurred.' },
        { level: 'N2', type: 'vocabulary', question: '構造', reading: 'こうぞう (kouzou)', meaning: 'Structure', example: '社会の構造を学ぶ。', exampleTranslation: 'Learn the structure of society.' },
        { level: 'N2', type: 'grammar', question: '〜ざるを得ない', reading: 'zaru o enai', meaning: 'Cannot help but / Must', example: '嫌だが、行かざるを得ない。', exampleTranslation: 'I hate it, but I have no choice but to go.' },

        // N1
        { level: 'N1', type: 'kanji', question: '羅', reading: 'ら (ra)', meaning: 'Gauze / Net', example: '網羅する。', exampleTranslation: 'To cover comprehensively.' },
        { level: 'N1', type: 'vocabulary', question: '概念', reading: 'がいねん (gainen)', meaning: 'Concept', example: '新しい概念を提唱する。', exampleTranslation: 'Propose a new concept.' },
        { level: 'N1', type: 'grammar', question: '〜なり', reading: 'nari', meaning: 'As soon as', example: '彼は帰るなり、寝てしまった。', exampleTranslation: 'As soon as he got home, he fell asleep.' },
    ];

    let idCounter = 1;

    // 1. Add Curated Items
    curated.forEach(item => {
        items.push({
            id: `static_${idCounter++}`,
            level: item.level!,
            type: item.type as 'kanji' | 'vocabulary' | 'grammar',
            question: item.question!,
            reading: item.reading!,
            meaning: item.meaning!,
            example: item.example!,
            exampleTranslation: item.exampleTranslation!
        });
    });

    // 2. Procedurally Generate Bulk Items to fill the app (Simulation of a large DB)
    levels.forEach(lvl => {
        ['kanji', 'vocabulary', 'grammar'].forEach(type => {
            // Generate 15 items per category per level
            for (let i = 1; i <= 20; i++) {
                items.push({
                    id: `gen_${lvl}_${type}_${i}`,
                    level: lvl,
                    type: type as any,
                    question: `${type === 'kanji' ? '漢' : type === 'grammar' ? 'Grammar' : 'Word'} ${lvl}-${i}`,
                    reading: `yomi-${i}`,
                    meaning: `Sample ${lvl} ${type} content #${i} (Placeholder)`,
                    example: `これは${lvl}の${type}の例です。`,
                    exampleTranslation: `This is an example for ${lvl} ${type}.`
                });
            }
        });
    });

    return items;
};

export const FULL_JLPT_CONTENT = generateContent();
