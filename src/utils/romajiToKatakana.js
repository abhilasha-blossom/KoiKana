
const KATAKANA_MAP = {
    a: 'ア', i: 'イ', u: 'ウ', e: 'エ', o: 'オ',
    ka: 'カ', ki: 'キ', ku: 'ク', ke: 'ケ', ko: 'コ',
    sa: 'サ', shi: 'シ', su: 'ス', se: 'セ', so: 'ソ',
    ta: 'タ', chi: 'チ', tsu: 'ツ', te: 'テ', to: 'ト',
    na: 'ナ', ni: 'ニ', nu: 'ヌ', ne: 'ネ', no: 'ノ',
    ha: 'ハ', hi: 'ヒ', fu: 'フ', he: 'ヘ', ho: 'ホ',
    ma: 'マ', mi: 'ミ', mu: 'ム', me: 'メ', mo: 'モ',
    ya: 'ヤ', yu: 'ユ', yo: 'ヨ',
    ra: 'ラ', ri: 'リ', ru: 'ル', re: 'レ', ro: 'ロ',
    wa: 'ワ', wo: 'ヲ', n: 'ン',

    // Dakuten
    ga: 'ガ', gi: 'ギ', gu: 'グ', ge: 'ゲ', go: 'ゴ',
    za: 'ザ', ji: 'ジ', zu: 'ズ', ze: 'ゼ', zo: 'ゾ',
    da: 'ダ', di: 'ヂ', du: 'ヅ', de: 'デ', do: 'ド',
    ba: 'バ', bi: 'ビ', bu: 'ブ', be: 'ベ', bo: 'ボ',
    pa: 'パ', pi: 'ピ', pu: 'プ', pe: 'ペ', po: 'ポ',

    // Combinations
    kya: 'キャ', kyi: 'キィ', kyu: 'キュ', kye: 'キェ', kyo: 'キョ',
    sha: 'シャ', she: 'シェ', shu: 'シュ', sho: 'ショ',
    cha: 'チャ', che: 'チェ', chu: 'チュ', cho: 'チョ',
    nya: 'ニャ', nyi: 'ニィ', nyu: 'ニュ', nye: 'ニェ', nyo: 'ニョ',
    hya: 'ヒャ', hyi: 'ヒィ', hyu: 'ヒュ', hye: 'ヒェ', hyo: 'ヒョ',
    mya: 'ミャ', myi: 'ミィ', myu: 'ミュ', mye: 'ミェ', myo: 'ミョ',
    rya: 'リャ', ryi: 'リィ', ryu: 'リュ', rye: 'リェ', ryo: 'リョ',
    gya: 'ギャ', gyi: 'ギィ', gyu: 'ギュ', gye: 'ギェ', gyo: 'ギョ',
    ja: 'ジャ', je: 'ジェ', ju: 'ジュ', jo: 'ジョ',
    bya: 'ビャ', byi: 'ビィ', byu: 'ビュ', bye: 'ビェ', byo: 'ビョ',
    pya: 'ピャ', pyi: 'ピィ', pyu: 'ピュ', pye: 'ピェ', pyo: 'ピョ',

    // Special
    fa: 'ファ', fi: 'フィ', fe: 'フェ', fo: 'フォ',
    va: 'ヴァ', vi: 'ヴィ', ve: 'ヴェ', vo: 'ヴォ',
};

const HIRAGANA_MAP = {
    a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
    ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
    sa: 'さ', shi: 'し', su: 'す', se: 'せ', so: 'そ',
    ta: 'た', chi: 'ち', tsu: 'つ', te: 'て', to: 'と',
    na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
    ha: 'は', hi: 'ひ', fu: 'ふ', he: 'へ', ho: 'ほ',
    ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
    ya: 'や', yu: 'ゆ', yo: 'よ',
    ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
    wa: 'わ', wo: 'を', n: 'ん',

    // Dakuten
    ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
    za: 'ざ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
    da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど',
    ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
    pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',

    // Combinations
    kya: 'きゃ', kyi: 'きぃ', kyu: 'きゅ', kye: 'きぇ', kyo: 'きょ',
    sha: 'しゃ', she: 'しぇ', shu: 'しゅ', sho: 'しょ',
    cha: 'ちゃ', che: 'ちぇ', chu: 'ちゅ', cho: 'ちょ',
    nya: 'にゃ', nyi: 'にぃ', nyu: 'にゅ', nye: 'にぇ', nyo: 'にょ',
    hya: 'ひゃ', hyi: 'ひぃ', hyu: 'ひゅ', hye: 'ひぇ', hyo: 'ひょ',
    mya: 'みゃ', myi: 'みぃ', myu: 'みゅ', mye: 'みぇ', myo: 'みょ',
    rya: 'りゃ', ryi: 'りぃ', ryu: 'りゅ', rye: 'りぇ', ryo: 'りょ',
    gya: 'ぎゃ', gyi: 'ぎぃ', gyu: 'ぎゅ', gye: 'ぎぇ', gyo: 'ぎょ',
    ja: 'じゃ', je: 'じぇ', ju: 'じゅ', jo: 'じょ',
    bya: 'びゃ', byi: 'びぃ', byu: 'びゅ', bye: 'びぇ', byo: 'びょ',
    pya: 'ぴゃ', pyi: 'ぴぃ', pyu: 'ぴゅ', pye: 'ぴぇ', pyo: 'ぴょ',

    // Special - Hiragana usually doesn't have these but for consistency
    fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ',
    va: 'ゔぁ', vi: 'ゔぃ', ve: 'ゔぇ', vo: 'ゔぉ',
};

const convertToKana = (input, map, smallTsu, longVowel) => {
    if (!input) return '';
    let str = input.toLowerCase();

    // Normalization / Pre-processing
    str = str.replace(/l/g, 'r');
    str = str.replace(/bhi/g, 'bi');
    str = str.replace(/dhi/g, 'di');
    str = str.replace(/ghi/g, 'gi');
    str = str.replace(/kh/g, 'k');
    str = str.replace(/ph/g, 'f');
    str = str.replace(/si/g, 'shi');
    str = str.replace(/ti/g, 'chi');
    str = str.replace(/tu/g, 'tsu');
    str = str.replace(/hu/g, 'fu');

    let result = '';
    let i = 0;

    // Handle 'tsu' manually to avoid conflicts
    str = str.replace(/tsu/g, 'T_TEMP');

    while (i < str.length) {
        let chunk3 = str.slice(i, i + 3);
        let chunk2 = str.slice(i, i + 2);
        let chunk1 = str.slice(i, i + 1);

        if (chunk3.includes('T_TEMP')) chunk3 = 'xxx';

        if (map[chunk3]) {
            result += map[chunk3];
            i += 3;
        } else if (map[chunk2]) {
            result += map[chunk2];
            i += 2;
        } else {
            if (chunk1 === 'T_TEMP') {
                result += map['tsu'];
                i += 6;
            } else if (map[chunk1]) {
                result += map[chunk1];
                i += 1;
            } else if (chunk1 === 'n') {
                result += map['n'];
                i += 1;
            } else if (chunk2.length === 2 && chunk2[0] === chunk2[1] && chunk2[0].match(/[a-z]/)) {
                result += smallTsu;
                i += 1;
            } else if (/[bcdfghjkmprsvwyz]/.test(chunk1)) {
                // Try adding 'u'
                if (map[chunk1 + 'u']) {
                    result += map[chunk1 + 'u'];
                } else {
                    result += chunk1;
                }
                i += 1;
            } else if (chunk1 === 't' || chunk1 === 'd') {
                // Try adding 'o' (To/Do)
                if (map[chunk1 + 'o']) {
                    result += map[chunk1 + 'o'];
                } else {
                    result += chunk1;
                }
                i += 1;
            } else {
                result += (chunk1 === '-' ? longVowel : chunk1);
                i += 1;
            }
        }
    }
    return result;
};

export const toKatakana = (input) => convertToKana(input, KATAKANA_MAP, 'ッ', 'ー');
export const toHiragana = (input) => convertToKana(input, HIRAGANA_MAP, 'っ', 'ー');
