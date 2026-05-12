import { useState } from 'react'
import { X } from 'lucide-react'

const RACKET_BRANDS = [
  'YONEX', 'MIZUNO', 'APACS', 'LI-NING', 'VICTOR', 'GOSEN', 'Kumpoo', 'Babolat', 'FZ FORZA', 'その他',
]

// ---- ラケット モデル（ブランド→シリーズ→モデル） ----
const RACKET_MODEL_GROUPS = {
  'YONEX': [
    {
      group: 'アストロクス（現行）',
      models: [
        'アストロクス100ZZ', 'アストロクス100ZZ VA', 'アストロクス100ツアー', 'アストロクス100ツアー VA',
        'アストロクス100ゲーム', 'アストロクス100ゲーム VA',
        'アストロクス99プロ', 'アストロクス99ツアー', 'アストロクス99ゲーム',
        'アストロクス88Dプロ', 'アストロクス88Dツアー', 'アストロクス88Dゲーム',
        'アストロクス88Sプロ', 'アストロクス88Sツアー', 'アストロクス88Sゲーム',
        'アストロクス77プロ', 'アストロクス77ツアー',
        'アストロクス70', 'アストロクス55A', 'アストロクス33', 'アストロクス22RX', 'アストロクス11',
        'アストロクス ネクステージ',
      ],
    },
    {
      group: 'アストロクス（廃番）',
      models: [
        'アストロクス99（初代）', 'アストロクス88S（初代）', 'アストロクス88D（初代）', 'アストロクス88',
        'アストロクス77（初代）', 'アストロクス66', 'アストロクス55（初代）', 'アストロクス44',
        'アストロクス38S', 'アストロクス38D',
        'アストロクス22プロ', 'アストロクス22ゲーム', 'アストロクス22', 'アストロクス22F',
        'アストロクス21', 'アストロクス00',
        'アストロクス9LT', 'アストロクス8DG', 'アストロクス7DG', 'アストロクス6DG',
        'アストロクス5', 'アストロクス5FX', 'アストロクス3DG', 'アストロクス2', 'アストロクス1DG',
        'アストロクス01フィール', 'アストロクス01クリアー', 'アストロクス01アビリティ',
        'アストロクス01グラウンド', 'アストロクス01フラッシュ',
        'アストロクス スマッシュ', 'アストロクス エース', 'アストロクス アタック',
        'アストロクス スキル', 'アストロクス ライト21',
      ],
    },
    {
      group: 'ナノフレア（現行）',
      models: [
        'ナノフレア1000Z', 'ナノフレア1000ゲーム',
        'ナノフレア800プロ', 'ナノフレア800ゲーム',
        'ナノフレア700プロ', 'ナノフレア700ツアー', 'ナノフレア700ゲーム',
        'ナノフレア70', 'ナノフレア400', 'ナノフレア300', 'ナノフレア111',
        'ナノフレア ネクステージ', 'ナノフレア ジュニア',
      ],
    },
    {
      group: 'ナノフレア（廃番）',
      models: [
        'ナノフレア1000S', 'ナノフレア700（初代）', 'ナノフレア600', 'ナノフレア555', 'ナノフレア500',
        'ナノフレア380スピード', 'ナノフレア380シャープ', 'ナノフレア270スピード', 'ナノフレア250', 'ナノフレア200',
        'ナノフレア170ライト', 'ナノフレア160FX', 'ナノフレア150', 'ナノフレア100',
        'ナノフレア ドライブ', 'ナノフレア E13',
        'ナノフレア002フィール', 'ナノフレア002アビリティ', 'ナノフレア002クリアー',
        'ナノフレア001フィール', 'ナノフレア001アビリティ', 'ナノフレア001クリアー',
      ],
    },
    {
      group: 'アークセイバー（現行）',
      models: [
        'アークセイバー11プロ', 'アークセイバー7プロ', 'アークセイバー7ツアー', 'アークセイバー3', 'アークセイバー1',
      ],
    },
    {
      group: 'アークセイバー（廃番）',
      models: [
        'アークセイバー11（初代）', 'アークセイバー Z-スラッシュ', 'アークセイバー10（タウフィック）',
        'アークセイバー10 LTH', 'アークセイバー10 LPG', 'アークセイバー9FL', 'アークセイバー8DX',
        'アークセイバー7（初代）', 'アークセイバー6', 'アークセイバー5DX', 'アークセイバー4DX',
        'アークセイバー3FL', 'アークセイバー2i', 'アークセイバー i-スラッシュ',
        'アークセイバー FB', 'アークセイバー FD', 'アークセイバー7D', 'アークセイバー5i',
        'アークセイバー001', 'アークセイバー ライト', 'アークセイバー タクティカル',
      ],
    },
    {
      group: 'デュオラ（現行）',
      models: ['デュオラ Zストライク'],
    },
    {
      group: 'デュオラ（廃番）',
      models: [
        'デュオラ10（リー・チョンウェイ）', 'デュオラ10LT', 'デュオラ10LCW', 'デュオラ9',
        'デュオラ8XP', 'デュオラ8', 'デュオラ7', 'デュオラ77', 'デュオラ6', 'デュオラ55',
        'デュオラ33', 'デュオラJ', 'デュオラ ZストライクLCW',
      ],
    },
    {
      group: 'ボルトリック（全廃番）',
      models: [
        'ボルトリック Z-フォースII', 'ボルトリック Z-フォース', 'ボルトリック グランツ',
        'ボルトリック80', 'ボルトリック80 E-チューン', 'ボルトリック70', 'ボルトリック70 E-チューン',
        'ボルトリック60', 'ボルトリック50', 'ボルトリック30', 'ボルトリック7', 'ボルトリック5',
        'ボルトリック5FX', 'ボルトリック1',
        'ボルトリック1DG', 'ボルトリック2DGスリム', 'ボルトリック8DGスリム', 'ボルトリック10DG',
        'ボルトリック11DGスリム', 'ボルトリック21DGスリム',
        'ボルトリック i-フォース', 'ボルトリック FB', 'ボルトリック フラッシュブースト',
      ],
    },
    {
      group: 'ナノレイ（全廃番）',
      models: [
        'ナノレイ グローイング', 'ナノレイ Zスピード', 'ナノレイ Zスピード・リターンズ',
        'ナノレイ800', 'ナノレイ800pro', 'ナノレイ700', 'ナノレイ700pro',
        'ナノレイ600', 'ナノレイ500', 'ナノレイ400', 'ナノレイ300',
        'ナノレイ95', 'ナノレイ80', 'ナノレイ70', 'ナノレイ50', 'ナノレイ10',
      ],
    },
    {
      group: 'ナノスピード（全廃番）',
      models: [
        'ナノスピード9000', 'ナノスピード8000', 'ナノスピード7000', 'ナノスピード6000',
        'ナノスピード9000S', 'ナノスピード900S', 'ナノスピード700', 'ナノスピード100',
      ],
    },
    {
      group: 'アーマーテック（全廃番）',
      models: [
        'アーマーテック900', 'アーマーテック800', 'アーマーテック700', 'アーマーテック500',
      ],
    },
    {
      group: 'カーボネックス',
      models: [
        'カーボネックス8000', 'カーボネックス6000', 'カーボネックス5000', 'カーボネックス3000',
      ],
    },
    {
      group: 'マッスルパワー（現行/廃番）',
      models: [
        'マッスルパワー33', 'マッスルパワー29', 'マッスルパワー', 'マッスルパワー03',
      ],
    },
    {
      group: 'Ti（チタン・全廃番）',
      models: [
        'Ti 1000', 'Ti 800', 'Ti 500', 'Ti 200', 'Ti 100',
      ],
    },
    {
      group: 'アイソメトリック（廃番）',
      models: [
        'アイソメトリック', 'アイソメトリック70', 'アイソメトリック50',
      ],
    },
    {
      group: 'その他',
      models: ['その他'],
    },
  ],

  'MIZUNO': [
    {
      group: 'アクロスピード',
      models: ['アクロスピード', 'アクロスピード50S', 'アクロスピード70'],
    },
    {
      group: 'アクロフォース',
      models: ['アクロフォース', 'アクロフォース PRO'],
    },
    {
      group: 'フォルティウス（現行）',
      models: ['フォルティウス TOUR', 'フォルティウス POWER', 'フォルティウス SPEED'],
    },
    {
      group: 'フォルティウス（廃番）',
      models: ['フォルティウス SUPER', 'フォルティウス'],
    },
    {
      group: 'アルティウス（現行）',
      models: [
        'アルティウス01 SPEED', 'アルティウス01 FEEL', 'アルティウス01 SONIC',
        'アルティウス TOUR', 'アルティウス TOUR-J',
      ],
    },
    {
      group: 'JPX（現行）',
      models: ['JPX 8 POWER', 'JPX 8.1 PRO', 'JPX 3 RAGE', 'JPX 8 ZOOM'],
    },
    {
      group: 'JPX（廃番）',
      models: ['JPX LIMITED EDITION SPEED+', 'JPX LIMITED EDITION ATTACK+', 'JPX 10.1', 'JPX 10.3'],
    },
    {
      group: 'キャリバー（廃番）',
      models: ['キャリバー S-LITE', 'キャリバー S-BOOST', 'キャリバー VS TOUR', 'キャリバー VA TOUR', 'キャリバー VF TOUR', 'キャリバー REGL'],
    },
    {
      group: 'ルミナソニック（廃番）',
      models: ['ルミナソニック IF', 'ルミナソニック AF', 'ルミナソニック VF TOUR', 'ルミナソニック S-TOUR'],
    },
    {
      group: 'その他・限定',
      models: ['ALTAIR T327', 'ALTAIR T329', 'FIORIA SL', 'CITIUS 71', 'CITIUS 73', 'PROTOTYPE X1', 'その他'],
    },
  ],

  'VICTOR': [
    {
      group: 'THRUSTER（スラスター・現行）',
      models: [
        'THRUSTER F C Ultra CX', 'THRUSTER F C Ultra X',
        'THRUSTER RYUGA CLS I', 'THRUSTER RYUGA Chosen One DB',
        'THRUSTER RYUGA SPORT E', 'THRUSTER RYUGA SPORT F', 'THRUSTER RYUGA SPORT I', 'THRUSTER RYUGA SPORT R',
        'THRUSTER RYUGA II', 'THRUSTER RYUGA II PRO B', 'THRUSTER RYUGA II PRO CPS',
        'THRUSTER RYUGA METALLIC CPS', 'THRUSTER RYUGA MUSE-F', 'THRUSTER RYUGA JR J', 'THRUSTER RYUGA（初代）',
        'THRUSTER 66 AJ', 'THRUSTER ROCKET O',
        'THRUSTER HAMMER LIGHT EXTRA H', 'THRUSTER HAMMER LIGHT EXTRA A',
        'THRUSTER HAMMER LIGHT Jelly MI', 'THRUSTER HAMMER LIGHT Chocolate W',
        'THRUSTER HAWK PRO J', 'THRUSTER HAWK PRO S',
        'THRUSTER K6 C', 'THRUSTER 100K M', 'THRUSTER M134 C', 'THRUSTER M134 J',
        'THRUSTER ULTRAMANTIGA S', 'THRUSTER ULTRAMANZ F', 'THRUSTER BABY MILO G', 'THRUSTER 11 E',
      ],
    },
    {
      group: 'THRUSTER（廃番）',
      models: ['THRUSTER F', 'THRUSTER F Claw', 'THRUSTER 9000', 'THRUSTER 8000', 'THRUSTER ONIGIRI'],
    },
    {
      group: 'AURASPEED（オーラスピード・現行）',
      models: [
        'AURASPEED 99 J', 'AURASPEED 100X B', 'AURASPEED Pulse Astral X Q',
        'AURASPEED PANTHER C', 'AURASPEED PEGASUS CI', 'AURASPEED 1130AL T', 'AURASPEED 1130AL M',
        'AURASPEED 99TUC26 D', 'AURASPEED 99BAC26 J', 'AURASPEED BABY MILO O',
        'AURASPEED HS PLUS CNY26 GB', 'AURASPEED 080X',
        'AURASPEED 9 T', 'AURASPEED 9 R', 'AURASPEED LYC B', 'AURASPEED LJH E', 'AURASPEED 33H J',
        'AURASPEED 100X TD', 'AURASPEED 25MACH E', 'AURASPEED KT C', 'AURASPEED 3200',
        'AURASPEED SN POW C', 'AURASPEED 1 JR', 'AURASPEED 120CL', 'AURASPEED 110CL',
        'AURASPEED FANTÔME F AC',
      ],
    },
    {
      group: 'AURASPEED（廃番）',
      models: ['AURASPEED 90S', 'AURASPEED 80X', 'AURASPEED 70K', 'AURASPEED 30H'],
    },
    {
      group: 'DRIVE X（ドライブX・現行）',
      models: [
        'DRIVE X 8SP I', 'DRIVE X 6SP QM', 'DRIVE X 7SP AJ', 'DRIVE X 12 O', 'DRIVE X 12 ZSW J',
        'DRIVE X 3H R', 'DRIVE X PHECDA A', 'DRIVE X DRM GB', 'DRIVE X 1 A', 'DRIVE X METALLIC C',
        'DRIVE X 3H V', 'DRIVE X F T', 'DRIVE X 10METALLIC B', 'DRIVE X 7SP V', 'DRIVE X 6SP W',
        'DRIVE X KT A', 'DRIVE X 09 M', 'DRIVE X 09 I', 'DRIVE X 888H C',
        'DRIVE X 1L A', 'DRIVE X 1L V', 'DRIVE X 520CL', 'DRIVE X 12WT25 IA',
      ],
    },
    {
      group: 'DRIVE X（廃番）',
      models: ['DRIVE X 9X B', 'DRIVE X 8S J', 'DRIVE X 7K C'],
    },
    {
      group: 'JETSPEED（ジェットスピード）',
      models: [
        'JETSPEED 12TD R', 'JETSPEED 12F TD T', 'JETSPEED 12 II R', 'JETSPEED CBC I',
        'JETSPEED 800HT G', 'JETSPEED 800HT C', 'JETSPEED 800HT A',
        'JETSPEED T1PRO C', 'JETSPEED 520 A', 'JETSPEED T1 R', 'JETSPEED T1',
        'JETSPEED 7000', 'JETSPEED 6000', 'JETSPEED 12FTD', 'JETSPEED 12TD',
        'JETSPEED 06JR', 'JETSPEED 1111AL', 'JETSPEED 2SP', 'JETSPEED 10Q', 'JETSPEED 12', 'JETSPEED 7JR',
      ],
    },
    {
      group: 'BRAVE SWORD（廃番）',
      models: ['BRAVE SWORD 12', 'BRAVE SWORD 09', 'BRAVE SWORD 10', 'BRAVE SWORD 11', 'BRAVE SWORD LHI', 'BRAVE SWORD 1800O'],
    },
    {
      group: 'HYPERNANO X（廃番）',
      models: ['HYPERNANO X 900', 'HYPERNANO X 800', 'HYPERNANO X 500 POWER'],
    },
    {
      group: 'METEOR X（廃番）',
      models: ['METEOR X JJS', 'METEOR X 80', 'METEOR X 90', 'METEOR X 80 B'],
    },
    {
      group: 'その他・エントリー',
      models: [
        'CHALLENGER 9500 PRO A', 'CHALLENGER 9500 PRO T', 'BEAST TAMER AL 3000',
        'ST-1800', 'ST-2000', 'MIRAGE 500 E', 'BLADE-2000',
        'Arrow Power 5000', 'Thunder Pro Blue', 'SkyFire 1000', 'その他',
      ],
    },
  ],

  'LI-NING': [
    {
      group: 'AXFORCE（現行）',
      models: [
        'AXFORCE 100 II', 'AXFORCE 90 Max Dragon', 'AXFORCE 90 Max Tiger',
        'AXFORCE 80', 'AXFORCE 80 Light', 'AXFORCE 70', 'AXFORCE 60', 'AXFORCE 50',
        'AXFORCE CANNON PRO', 'AXFORCE BIGBANG',
      ],
    },
    {
      group: 'BLADEX（現行）',
      models: [
        'BLADEX 900 Moon Max', 'BLADEX 900 Sun Max', 'BLADEX 900 NEW CHINA MASTERS LIMITED 2025',
        'BLADEX 800 Butterfly Green', 'BLADEX 800', 'BLADEX 700', 'BLADEX 600',
      ],
    },
    {
      group: 'HALBERTEC（現行）',
      models: ['HALBERTEC 9000', 'HALBERTEC 9000 POWER', 'HALBERTEC 8000', 'HALBERTEC 7000', 'HALBERTEC 6000', 'HALBERTEC MOTOR', 'HALBERTEC MOTOR PRO'],
    },
    {
      group: 'TECTONIC（現行）',
      models: ['TECTONIC 9', 'TECTONIC 7', 'TECTONIC 7C', 'TECTONIC 7D', 'TECTONIC 7I', 'TECTONIC 1'],
    },
    {
      group: 'WINDSTORM / 超軽量系',
      models: [
        'WINDSTORM Matrix', 'WINDSTORM 79S', 'WINDSTORM 78', 'WINDSTORM 74',
        'WINDSTORM 72', 'WINDSTORM 72 PURPLE/PINK', 'WINDSTORM 72 Blue/Orange',
        'WINDSTORM 72 Purple/Black', 'WINDSTORM 72 S', 'WINDSTORM 72 Speed',
        'WINDSTORM 300', 'WINDSTORM 700',
      ],
    },
    {
      group: 'AERONAUT（廃番）',
      models: ['AERONAUT 9000', 'AERONAUT 9000C', 'AERONAUT 9000D', 'AERONAUT 8000', 'AERONAUT 7000', 'AERONAUT 7000B', 'AERONAUT 7000C', 'AERONAUT 7000I', 'AERONAUT 5000'],
    },
    {
      group: '3D CALIBAR（廃番）',
      models: ['3D CALIBAR 900', '3D CALIBAR 900B', '3D CALIBAR 900C', '3D CALIBAR 800', '3D CALIBAR 600', '3D CALIBAR 500 PRO', '3D CALIBAR 300', '3D CALIBAR 009'],
    },
    {
      group: 'TURBO CHARGING（廃番）',
      models: [
        'TURBO CHARGING 75', 'TURBO CHARGING 75C', 'TURBO CHARGING 75D', 'TURBO CHARGING 75I',
        'TURBO CHARGING 70', 'TURBO CHARGING 70C', 'TURBO CHARGING 70I', 'TURBO CHARGING 50', 'TURBO CHARGING 40', 'TURBO CHARGING 10',
      ],
    },
    {
      group: 'N シリーズ（廃番）',
      models: [
        'N90', 'N90 II', 'N90 III', 'N90 IV', 'N80', 'N80 II', 'N7', 'N7 II', 'N7 II Light',
        'N9', 'N9 II', 'N99', 'N55', 'N55 II', 'N55 III', 'N50', 'N50 II', 'N50 III',
        'N36', 'N33', 'N30', 'N20', 'N60',
        'Ultra Carbon 9000', 'Ultra Carbon 8000', 'Ultra Carbon 7000',
      ],
    },
    { group: 'その他', models: ['その他'] },
  ],

  'APACS': [
    { group: 'Woven', models: ['Woven Aggressive', 'Woven Power', 'Woven Accurate', 'Woven Control', 'Woven Speed', 'Woven Gold', 'Woven Ruby'] },
    { group: 'Nano Fusion Speed', models: ['Nano Fusion Speed 722', 'Nano Fusion Speed XR'] },
    { group: 'Duplex Power', models: ['Duplex Power 55', 'Duplex Power 63', 'Duplex Power 68', 'Duplex Power 72', 'Duplex Power 78'] },
    { group: 'Feather Weight', models: ['Feather Weight 55', 'Feather Weight 65', 'Feather Weight 75', 'Feather Weight 500', 'Feather Weight X II', 'Feather Weight X Special'] },
    { group: 'Z-Ziggler', models: ['Z-Ziggler', 'Z-Ziggler 72', 'Z-Ziggler Lite', 'Z-Ziggler Limited', 'Z-Ziggler Force II', 'Ziggler LHI Pro III'] },
    { group: 'Stardom', models: ['Stardom 202', 'Stardom 90', 'Stardom 800', 'Stardom Fierce', 'Stardom Force', 'Stardom Pro III'] },
    { group: 'Virtuoso', models: ['Virtuoso Light', 'Virtuoso 10', 'Virtuoso 20', 'Virtuoso 30', 'Virtuoso 50', 'Virtuoso 68', 'Virtuoso 80', 'Virtuoso 90', 'Virtuoso Pro III'] },
    { group: 'Lethal', models: ['Lethal 6', 'Lethal 8', 'Lethal 9', 'Lethal 10', 'Lethal 28', 'Lethal Light Special', 'Lethal Light Power'] },
    { group: 'Commander', models: ['Commander 10', 'Commander 20', 'Commander 30', 'Commander 50', 'Commander 60', 'Commander 80', 'Pro Commander'] },
    { group: 'Slayer', models: ['Slayer 95 III', 'Slayer 95 II', 'Slayer 99'] },
    { group: 'Tantrum', models: ['Tantrum 500 III', 'Tantrum 200 III', 'Tantrum Light'] },
    { group: 'Nano', models: ['Nano 9900', 'Nano Tube 9990', 'Nano Power 900'] },
    { group: 'その他', models: ['その他'] },
  ],

  'GOSEN': [
    {
      group: 'INFERNO（インフェルノ・現行）',
      models: [
        'インフェルノ（スタンダード）', 'インフェルノ SMART', 'インフェルノ SMART +CORE Metallic Brown',
        'インフェルノ RAID', 'インフェルノ Touch', 'インフェルノ AIR', 'インフェルノ AIR +CORE',
      ],
    },
    {
      group: 'INFERNO（廃番）',
      models: ['インフェルノ Lite Mint', 'インフェルノ Lite White', 'インフェルノ EX', 'インフェルノ PLUS'],
    },
    {
      group: 'GRAVITAS（グラビタス・現行）',
      models: ['グラビタス SIGMA', 'グラビタス CORE', 'グラビタス GRAVITY'],
    },
    {
      group: 'GRAVITAS（廃番）',
      models: ['グラビタス EXTRA'],
    },
    {
      group: 'COCYTUS（コキュートス・現行）',
      models: ['コキュートス EX', 'コキュートス CORE', 'コキュートス PRO'],
    },
    {
      group: 'RYOGA（凌駕）',
      models: ['凌駕 REG', '凌駕', '凌駕02'],
    },
    {
      group: 'CUSTOMEDGE（廃番）',
      models: ['カスタムエッジ', 'カスタムエッジ SPECIAL'],
    },
    {
      group: 'ROOTS（廃番）',
      models: ['ルーツ', 'ルーツ PRO'],
    },
    {
      group: 'LEGENDARY（現行）',
      models: ['レジェンダリー', 'レジェンダリー PRO'],
    },
    {
      group: 'その他・レガシー',
      models: ['その他'],
    },
  ],
}

// ---- ストリング（ブランド→シリーズ→モデル） ----
const STRING_TYPE_GROUPS = {
  'YONEX': [
    { series: 'エクスボルト', strings: ['エクスボルト63', 'エクスボルト65', 'エクスボルト68'] },
    { series: 'BG', strings: ['BG80パワー', 'BG80', 'BG66アルティマックス', 'BG66フォース', 'BG65チタン', 'BG65', 'スカイアーク'] },
    { series: 'エアロバイト / エアロソニック', strings: ['エアロバイトブースト', 'エアロバイト', 'エアロソニック'] },
    { series: 'ナノジー', strings: ['ナノジー99エース', 'ナノジー99', 'ナノジー98', 'ナノジー95'] },
  ],
  'VICTOR': [
    { series: 'VBS', strings: ['VBS-63', 'VBS-66ナノ', 'VBS-68', 'VBS-68パワー', 'VBS-69ナノ', 'VBS-70', 'VS-69'] },
  ],
  'GOSEN': [
    { series: 'ライゾニック', strings: ['ライゾニック58', 'ライゾニック65'] },
  ],
  'MIZUNO': [
    { series: 'M-スムース', strings: ['M-スムース65H', 'M-スムース65R', 'M-スムース66H', 'M-スムース68S'] },
  ],
  'LI-NING': [
    { series: 'N シリーズ', strings: ['N58', 'N61', 'N63', 'N65', 'N68', 'N69', 'N70'] },
    { series: 'No. シリーズ', strings: ['No.1', 'No.5'] },
  ],
  'Ashaway': [
    { series: 'ジーマックス', strings: ['ジーマックス66ファイア', 'ジーマックス68TX'] },
  ],
}

const WEEKLY_FREQ_OPTIONS = [
  { value: 1, label: '週1回',   recommendedDays: 90 },
  { value: 2, label: '週2回',   recommendedDays: 60 },
  { value: 3, label: '週3回',   recommendedDays: 45 },
  { value: 4, label: '週4回',   recommendedDays: 30 },
  { value: 5, label: '週5回',   recommendedDays: 21 },
  { value: 6, label: '週6回以上', recommendedDays: 14 },
]

// Build flat string lists from nested data for optgroups
function buildStringOptions() {
  const options = []
  for (const brand of Object.keys(STRING_TYPE_GROUPS)) {
    const series = STRING_TYPE_GROUPS[brand]
    for (const s of series) {
      for (const str of s.strings) {
        options.push({ label: str, brand, series: s.series })
      }
    }
  }
  return options
}

const STRING_OPTIONS = buildStringOptions()

const DEFAULT_FORM = {
  brand: '',
  name: '',
  stringType: '',
  stringDate: new Date().toISOString().slice(0, 10),
  tension: '',
  replacementDays: 90,
  weeklyFreq: 2,
  memo: '',
}

export default function RacketForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? {
    brand: initial.brand ?? '',
    name: initial.name ?? '',
    stringType: initial.stringType ?? '',
    stringDate: initial.stringDate ?? DEFAULT_FORM.stringDate,
    tension: initial.tension ?? '',
    replacementDays: initial.replacementDays ?? 90,
    weeklyFreq: initial.weeklyFreq ?? 2,
    memo: initial.memo ?? '',
  } : DEFAULT_FORM)

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name?.trim()) return
    onSave({
      ...form,
      tension: form.tension ? Number(form.tension) : null,
      replacementDays: form.replacementDays ? Number(form.replacementDays) : null,
      weeklyFreq: Number(form.weeklyFreq),
    })
  }

  // Get model options for selected brand
  const brandModels = form.brand ? RACKET_MODEL_GROUPS[form.brand] ?? [] : []

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? 'ラケット情報を編集' : 'ラケットを追加'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* ブランド */}
          <Field label="ブランド">
            <select value={form.brand} onChange={e => set('brand', e.target.value)} className="input">
              <option value="">選択してください</option>
              {RACKET_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>

          {/* ラケット名 */}
          <Field label="ラケット名 *">
            {form.brand && brandModels.length > 0 ? (
              <select value={form.name} onChange={e => set('name', e.target.value)} className="input">
                <option value="">選択してください</option>
                {brandModels.map(group => (
                  <optgroup key={group.group} label={group.group}>
                    {group.models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                placeholder="例: アストロクス99 PRO"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="input"
              />
            )}
          </Field>

          {/* ストリング */}
          <Field label="ストリングの種類">
            <select value={form.stringType} onChange={e => set('stringType', e.target.value)} className="input">
              <option value="">選択してください</option>
              {['YONEX', 'VICTOR', 'GOSEN', 'MIZUNO', 'LI-NING', 'Ashaway'].map(brand => (
                <optgroup key={brand} label={brand}>
                  {STRING_TYPE_GROUPS[brand]?.map(series =>
                    series.strings.map(str => (
                      <option key={str} value={str}>{series.series} / {str}</option>
                    ))
                  )}
                </optgroup>
              ))}
              <optgroup label="その他">
                <option value="">直接入力...</option>
              </optgroup>
            </select>
          </Field>

          {form.stringType === '' && form.stringType !== undefined && (
            <Field label="ストリング名を入力">
              <input
                type="text"
                placeholder="ストリング名"
                value={form.stringType}
                onChange={e => set('stringType', e.target.value)}
                className="input"
              />
            </Field>
          )}

          {/* 張り日 */}
          <Field label="ストリング張った日">
            <input
              type="date"
              value={form.stringDate}
              onChange={e => set('stringDate', e.target.value)}
              className="input"
            />
          </Field>

          {/* テンション */}
          <Field label="テンション (lbs)">
            <input
              type="number"
              min="10"
              max="40"
              step="0.5"
              placeholder="例: 24"
              value={form.tension}
              onChange={e => set('tension', e.target.value)}
              className="input"
            />
          </Field>

          {/* 頻度 */}
          <Field label="バドミントンの頻度">
            <select
              value={form.weeklyFreq}
              onChange={e => {
                const freq = Number(e.target.value)
                const opt = WEEKLY_FREQ_OPTIONS.find(o => o.value === freq)
                setForm(prev => ({
                  ...prev,
                  weeklyFreq: freq,
                  replacementDays: opt ? opt.recommendedDays : prev.replacementDays,
                }))
              }}
              className="input"
            >
              {WEEKLY_FREQ_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          {/* 張替え目安 */}
          <Field label="張替え目安 (日)">
            <input
              type="number"
              min="1"
              max="365"
              placeholder="例: 90"
              value={form.replacementDays}
              onChange={e => set('replacementDays', e.target.value)}
              className="input"
            />
            <p className="text-xs text-gray-400 mt-1">
              ※ 頻度に応じた目安日数が自動入力されます（手動変更も可）
            </p>
          </Field>

          {/* メモ */}
          <Field label="メモ">
            <textarea
              placeholder="張り方のメモ、ショップ名など"
              value={form.memo}
              onChange={e => set('memo', e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 btn-secondary">
              キャンセル
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {initial ? '更新する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
