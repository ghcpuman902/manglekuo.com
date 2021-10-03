---
title: 'Android Language XML Search'
date: '2021-07-30'
description: 'This project allows you to search through the translations xml files cames with the Android 8 OS, but you can use it with any Android source code.'
---

# Intro

- [Demo](https://next.manglekuo.com/androidlangxmlsearch/index.html)
- [GitHub page of the code](https://github.com/ghcpuman902/androidlangxmlsearch)

**This project allows you to search through the translations xml files came with the Android 8**, but you can use it with any Android source code.

They came in the form of XML files, and the file structure will look something like this:

![Folder Tree for Android 8](/images/android-lang-xml-search/folderTree.png)

The "value-_lang_" folders containing the XML files, and inside each of them, there is a `strings.xml`, which has entries of UI texts with msgID and the string in the language defined in the folder name (see pic below).

![Inside XML](/images/android-lang-xml-search/insideXML.png)

Inside _android8-res-xml/packages/apps/TV/res/values-en-rGB/strings.xml_

**The ideal is to extract all entries of all languages into one JSON file and use a React interface to search through it.**

This project is helpful if you are working on an Android App and want to see what translation came with the system that you can use directly. Or to calibrate any of your new translations that are UI related, or if you enjoy flipping through a dictionary that's full of OS phrases.

# Install and Run

You don't have to run it locally yourself unless you want to play around with it. The [demo](https://manglekuo.com/androidlangxmlsearch/index.html) on my website will work perfectly fine for the uses described above.

from `androidlangxmlsearch/`, run 

```
npm install
npm run dev
```

Then follow the output in the terminal.

# Generating your own androidMsgs.json (Optional)

This project comes with an androidMsgs.json containing all msgs from a version of Android 8. If you want to extract a different JSON file from another version of Android, you can do so with the `generateJson.js`.

Open the `generateJson.js`, edit the `CONFIGURATION.targetDirectory` and then from `androidlangxmlsearch/` run 

```
npm install
npm run generatejson
````

`generateJson.js` will dig through the directory you specified and try to find files that match the pattern `[AppName]/res/value-[langCode].xml`.

If no directory is specified, it will go through the directory it is in. It has two dependencies, `fast-xml-parser` (for reading the xml files) and `progress` (for displaying progress bar in the cli), so it's important to do `npm install`.

> Here is an example of a folder with the structure mentioned above, from the current Android open-sourced code: [https://cs.android.com/android/platform/superproject/+/master:frameworks/base/packages/](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/packages/), if you want to try generate yourself, download this folder.

Once a list of XML files is obtained, it goes through all entries within the XML files, checks if they are a valid entry, and adds them to a big JSON object and output it as `androidMsgs2.json` which you can rename and replace `androidMsgs.json` used for the React interface.

`androidMsgs.json` has the following structure:

```
{
  "7402231963862521000": {...},
  "6419439912885957000": {
    "AppName": "SystemUI",
    "MsgName": "guest_wipe_session_title",
    "Default": "",
    "Translations": {
      "af": "\"Welkom terug, gas!\"",
      "am": "\"እንኳን በደህና ተመለሱ እንግዳ!\"",
      "ar": "\"مرحبًا بك مجددًا في جلسة الضيف\"",
      "az": "\"Xoş gəlmisiniz!\"",
      "b+sr+Latn": "\"Dobro došli nazad, goste!\"",
      "be": "\"З вяртаннем, госць!\"",
      "bg": "\"Добре дошли отново в сесията като гост!\"",
      "bn": "\"অতিথি, আপনি ফিরে আসায় আপনাকে স্বাগত!\"",
      "bs": "\"Zdravo! Lijepo je opet vidjeti goste.\"",
      "ca": "\"Benvingut de nou, convidat.\"",
      "cs": "\"Vítejte zpět v relaci hosta!\"",
      "da": "\"Velkommen tilbage, gæst!\"",
      "de": "\"Willkommen zurück im Gastmodus\"",
      "el": "\"Επισκέπτη , καλώς όρισες ξανά!\"",
      "en-rAU": "\"Welcome back, guest!\"",
      "en-rCA": "\"Welcome back, guest!\"",
      "en-rGB": "\"Welcome back, guest!\"",
      "en-rIN": "\"Welcome back, guest!\"",
      "en-rXC": "\"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‏‏‎‏‏‎‎‏‎‎‎‏‎‏‏‎‎‏‏‎‏‏‏‎‏‎‎‏‎‏‏‎‏‏‎‏‎‎‎‎‏‎‎‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‏‎‎‏‎‎‎Welcome back, guest!‎‏‎‎‏‎\"",
      "es": "\"Hola de nuevo, invitado\"",
      "es-rUS": "\"Bienvenido nuevamente, invitado.\"",
      "et": "\"Tere tulemast tagasi, külaline!\"",
      "eu": "\"Ongi etorri berriro, gonbidatu hori!\"",
      "fa": "\"مهمان گرامی، بازگشتتان را خوش آمد می‌گوییم!\"",
      "fi": "\"Tervetuloa takaisin!\"",
      "fr": "\"Bienvenue à nouveau dans la session Invité\"",
      "fr-rCA": "\"Bienvenue à nouveau dans la session Invité\"",
      "gl": "\"Benvido de novo, convidado.\"",
      "gu": "\"ફરી સ્વાગત છે, અતિથિ!\"",
      "hi": "\"अतिथि, आपका पुन: स्वागत है!\"",
      "hr": "\"Dobro došli natrag, gostu!\"",
      "hu": "\"Örülünk, hogy visszatért, vendég!\"",
      "hy": "\"Բարի վերադարձ, հյուր:\"",
      "in": "\"Selamat datang kembali, tamu!\"",
      "is": "\"Velkominn aftur, gestur!\"",
      "it": "\"Bentornato, ospite.\"",
      "iw": "\"שמחים לראותך שוב!\"",
      "ja": "\"おかえりなさい、ゲストさん\"",
      "ka": "\"სტუმარო, გვიხარია, რომ დაბრუნდით!\"",
      "kk": "\"Қош келдіңіз, қонақ\"",
      "km": "\"សូម​ស្វាគមន៍​ការ​ត្រឡប់​មកវិញ, ភ្ញៀវ!\"",
      "kn": "\"ಮತ್ತೆ ಸುಸ್ವಾಗತ, ಅತಿಥಿ!\"",
      "ko": "\"손님 세션 다시 시작\"",
      "ky": "\"Кайтып келишиңиз менен, конок!\"",
      "lo": "\"ຍິນ​ດີ​ຕ້ອນ​ຮັບ​ກັບ​ມາ, ຜູ່​ຢ້ຽມ​ຢາມ!\"",
      "lt": "\"Sveiki sugrįžę, svety!\"",
      "lv": "\"Laipni lūdzam atpakaļ, viesi!\"",
      "mk": "\"Добредојде назад, гостине!\"",
      "ml": "\"അതിഥിയ്‌ക്ക് വീണ്ടും സ്വാഗതം!\"",
      "mn": "\"Тавтай морилно уу!\"",
      "mr": "\"अतिथी, आपले पुन्‍हा स्‍वागत आहे!\"",
      "ms": "\"Selamat kembali, tetamu!\"",
      "my": "\"ပြန်လာတာ ကြိုဆိုပါသည်၊ ဧည့်သည်!\"",
      "nb": "\"Velkommen tilbake, gjest!\"",
      "ne": "\"पुनः स्वागत, अतिथि!\"",
      "nl": "\"Welkom terug, gast!\"",
      "pa": "\"ਮਹਿਮਾਨ, ਫਿਰ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ!\"",
      "pl": "\"Witaj ponownie, gościu!\"",
      "pt": "\"Bem-vindo, convidado.\"",
      "pt-rBR": "\"Bem-vindo, convidado.\"",
      "pt-rPT": "\"Bem-vindo de volta, caro(a) convidado(a)!\"",
      "ro": "\"Bine ați revenit în sesiunea pentru invitați!\"",
      "ru": "\"Рады видеть вас снова!\"",
      "si": "\"නැවත සාදරයෙන් පිළිගනිමු, අමුත්තා!\"",
      "sk": "\"Hosť, vitajte späť!\"",
      "sl": "\"Znova pozdravljeni, gost!\"",
      "sq": "\"Mirë se erdhe, i ftuar!\"",
      "sr": "\"Добро дошли назад, госте!\"",
      "sv": "\"Välkommen tillbaka gäst!\"",
      "sw": "\"Karibu tena, mwalikwa!\"",
      "ta": "\"நல்வரவு!\"",
      "te": "\"పునఃస్వాగతం, అతిథి!\"",
      "th": "\"ยินดีต้อนรับท่านผู้เยี่ยมชมกลับมาอีกครั้ง!\"",
      "tl": "\"Maligayang pagbabalik, bisita!\"",
      "tr": "\"Tekrar hoş geldiniz sayın misafir!\"",
      "uk": "\"З поверненням!\"",
      "ur": "\"مہمان، پھر سے خوش آمدید!\"",
      "uz": "\"Xush kelibsiz, mehmon!\"",
      "vi": "\"Chào mừng bạn trở lại!\"",
      "zh-rCN": "\"访客，欢迎回来！\"",
      "zh-rHK": "\"訪客您好，歡迎回來！\"",
      "zh-rTW": "\"訪客你好，歡迎回來！\"",
      "zu": "\"Siyakwamukela futhi, sivakashi!\""
    },
    "8476238178270113000":{...},
    ...
}
```

The MsgID is now the key, inside is an object with each lang code as the key, and the string as the value.


# Ending

I hope you find this project useful.

