<doctype html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<style>
pre { border: solid 1px #ccc; padding: .5em; border-radius: .2em; background: #f7f7f7; margin-bottom: 1em; }
</style>
</head>
<body>
<?php
$answers = json_decode( <<<EOD
{
    "groups": [
        {
            "legend": "お名前",
            "fields": [
                {
                    "id": "preset-common-1-1",
                    "type": "input",
                    "inputType": "text",
                    "label": "お名前",
                    "model": "name",
                    "placeholder": "山田　太郎",
                    "featured": true,
                    "styleClasses": "full-span flex-column",
                    "required": true,
                    "validator": "string",
                    "max": 40,
                    "attributes": {
                        "title": "必ずご記入ください"
                    }
                },
                {
                    "id": "preset-common-1-2",
                    "type": "input",
                    "inputType": "text",
                    "label": "フリガナ",
                    "model": "kana_name",
                    "placeholder": "ヤマダ　タロウ",
                    "featured": true,
                    "styleClasses": "full-span flex-column",
                    "required": true,
                    "hint": "カタカナでご記入ください",
                    "pattern": "^[ァ-ンヴー　 ]+$",
                    "validator": "regexp",
                    "attributes": {
                        "title": "必ずご記入ください"
                    }
                }
            ],
            "required": true,
            "enabled": 1
        },
        {
            "legend": "ご職業",
            "fields": [
                {
                    "id": "preset-common-7-1",
                    "type": "input",
                    "inputType": "text",
                    "label": "ご職業",
                    "model": "job",
                    "placeholder": "あなたのご職業",
                    "featured": true,
                    "styleClasses": "full-span flex-column",
                    "required": false,
                    "validator": "string",
                    "max": 100
                }
            ],
            "enabled": 2
        },
        {
            "legend": "複数行テキスト",
            "fields": [
                {
                    "id": "preset-custom-ln1grxtj2cfl67ts8-1",
                    "model": "cfae9c3d1ed1a54e9fbaecc6c9f1669a89",
                    "type": "textArea",
                    "label": "複数行テキスト",
                    "featured": true,
                    "styleClasses": "full-span flex-column justify-left",
                    "validator": "string",
                    "required": false,
                    "max": 1000
                }
            ],
            "required": false,
            "enabled": 3
        }
    ],
    "models": {
        "name": "勝海舟",
        "kana_name": "カツカイシュウ",
        "job": "軍艦奉行",
        "cfae9c3d1ed1a54e9fbaecc6c9f1669a89": "勝 海舟は、日本の武士、政治家。位階は正二位、勲等は勲一等、爵位は伯爵。初代海軍卿。江戸幕府幕府陸軍最後の陸軍総裁。日本の近代史最大の内戦戊辰戦争において即時停戦と江戸城無血開城を主張し実現させ日本の平和主義に貢献した。 山岡鉄舟、高橋泥舟とともに幕末の三舟と呼ばれる。幼名および通称は麟太郎（りんたろう）。諱は義邦（よしくに）。明治維新後は安芳（やすよし）と改名。これは幕末に武家官位である「安房守」を名乗ったことから勝 安房（かつ あわ）として知られていたため、維新後は「安房」を避けて同音（あん−ほう）の「安芳」に代えたもの。海舟は号で、佐久間象山直筆の書「海舟書屋」からとったものだが、「海舟」という号は本来誰のものであったかは分からないという。氏族としては物部氏を称し、氏姓＋諱の組み合わせで物部義邦[4]、物部安芳[5]という署名や蔵書印も残している。曽祖父は視覚障害を持ち新潟の農民に生まれ、江戸に出て米山検校となる。祖父はその九男男谷平蔵。父は男谷平蔵の三男、旗本小普請組（41石）の勝小吉、母は勝元良（甚三郎）の娘信。幕末の剣客・男谷信友（精一郎）は血縁上は又従兄で、信友が海舟の伯父に当たる男谷思孝（彦四郎）の婿養子に入ったことから系図上は従兄に当たる[6]。家紋は丸に剣花菱。10代の頃から島田虎之助に入門し剣術・禅を学び直心影流剣術の免許皆伝となる。16歳で家督を継ぎ、弘化2年（1845年）から永井青崖に蘭学を学んで赤坂田町に私塾「氷解塾」を開く。安政の改革で才能を見出され、長崎海軍伝習所に入所。万延元年（1860年）には咸臨丸で渡米し、帰国後に軍艦奉行並となり神戸海軍操練所を開設。戊辰戦争時には幕府軍の軍事総裁となり、徹底抗戦を主張する小栗忠順に対し、早期停戦と江戸城無血開城を主張し実現。明治維新後は参議、海軍卿、枢密顧問官を歴任し、伯爵に叙せられた。李鴻章を始めとする清の政治家を高く評価し、明治6年（1873年）には不和だった福沢諭吉(福澤諭吉)らの明六社へ参加、興亜会（亜細亜協会）を支援。また足尾銅山鉱毒事件の田中正造とも交友があり、哲学館（現：東洋大学）や専修学校（現：専修大学）の繁栄にも尽力し、専修学校に「律は甲乙の科を増し、以て澆俗を正す。礼は升降の制を崇め、以て頽風を極（と）む」という有名な言葉を贈って激励・鼓舞した。文政6年（1823年）、江戸本所亀沢町の生まれ。父・小吉の実家である男谷家で誕生した。"
    }
}
EOD, true );

var_dump( '<pre>', interviewsheet_answers_validation( $answers ), '</pre>' );

function interviewsheet_answers_validation( $answers ) {
    $filtered_answers = $answers;
    $_schema = $answers['groups'];
    $_models = $answers['models'];
    $isValid = true;
    foreach ( $_models as $_name => $_value ) {
        $minlength = null;
        $maxlength = null;
        foreach ( $_schema as $_fs ) {
            $_m = array_filter( $_fs['fields'], function( $_f ) use ( $_name ) {
                return $_f['model'] === $_name;
            } );
            if ( !empty( $_m ) ) {
                if ( isset( $_m[0]['min'] ) ) {
                    $minlength = (int)$_m[0]['min'];
                }
                if ( isset( $_m[0]['max'] ) ) {
                    $maxlength = (int)$_m[0]['max'];
                } elseif ( isset( $_m[0]['type'] ) && in_array( strtolower( $_m[0]['type'] ), [ 'input', 'textarea' ], true ) ) {
                    $maxlength = $_m[0]['type'] === 'input' ? 200 : 1000;
                }
            }
        }
        if ( $minlength ) {
            $isValid = mb_strlen( $_value ) >= $minlength;
        }
        if ( $maxlength && $isValid ) {
            $isValid = mb_strlen( $_value ) <= $maxlength;
        }
        var_dump( '<pre>', 'validate:', $isValid ? 'Ok' : 'NG', $_name, $_value, mb_strlen( $_value ), $maxlength, '</pre>' );
    }
    //var_dump( '<pre>', '$_target:', $_target, '</pre>' );
    //self::debug( [ $filtered_answers, $answers ], __METHOD__ );
    return $filtered_answers;
}

?>
</body>
</html>