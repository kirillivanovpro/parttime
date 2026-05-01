import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

const icons = {
  search: "⌕",
  plus: "+",
  map: "⌖",
  star: "★",
  message: "◌",
  shield: "✓",
  user: "◉",
  briefcase: "▣",
  home: "⌂",
  truck: "▸",
  hammer: "⚒",
  laptop: "▤",
  send: "➤",
};

const TEXT = {
  ru: {
    navHome: "Главная",
    navFeed: "Задания",
    navCreate: "Создать",
    navChats: "Чаты",
    navProfile: "Профиль",
    login: "Войти",
    logout: "Выйти",
    language: "LV",

    homeBadge: "Part:time · Латвия",
    homeTitle: "Найди помощь рядом — или заработай в свободное время",
    homeSubtitle: "Part:time помогает быстро найти исполнителя для бытовых, курьерских и онлайн-задач в Латвии.",
    searchPlaceholder: "Что нужно сделать? Например: собрать мебель, доставка, уборка",
    createTask: "Создать задание",
    needHelp: "Мне нужна помощь",
    findWork: "Найти подработку",
    popularCategories: "Популярные категории",
    popularCategoriesText: "Быстрые задачи для людей и малого бизнеса.",
    viewTasks: "Смотреть задания",
    howItWorks: "Как это работает",
    howItWorksText: "Минимум шагов — от задачи до исполнителя.",
    step1Title: "Опишите задачу",
    step1Text: "Укажите, что нужно сделать, где, когда и за какой бюджет.",
    step2Title: "Получите отклики",
    step2Text: "Исполнители видят задание и отправляют свои предложения.",
    step3Title: "Выберите исполнителя",
    step3Text: "Сравните профили, отзывы и договоритесь в чате.",
    trustBadge: "Доверие",
    trustTitle: "Выбирайте людей, а не случайные объявления",
    trustText: "У каждого пользователя есть профиль, отзывы, рейтинг и история взаимодействий. Это делает локальные задачи понятнее и безопаснее.",
    verifiedProfile: "Проверенный профиль",
    reviewsAfterTask: "Отзывы после задания",
    chatWithPerformer: "Чат с исполнителем",
    readyTry: "Готовы попробовать?",
    firstTaskMinute: "Создайте первое задание за 1 минуту.",

    categoryHome: "Дом и ремонт",
    categoryHomeText: "Сборка мебели, мелкий ремонт, помощь по дому",
    categoryDelivery: "Доставка и поручения",
    categoryDeliveryText: "Документы, покупки, небольшие доставки",
    categoryPhysical: "Физическая помощь",
    categoryPhysicalText: "Переезды, перенос вещей, сезонные работы",
    categoryOnline: "Онлайн-задачи",
    categoryOnlineText: "Дизайн, тексты, IT-помощь, соцсети",

    authBadge: "Аккаунт и доверие",
    authTitle: "Регистрация нужна для безопасности",
    authText: "Профиль, рейтинг, отзывы и история взаимодействий создают доверие между заказчиком и исполнителем.",
    authLoginTab: "Вход",
    authRegisterTab: "Регистрация",
    authLoginTitle: "Войти",
    authRegisterTitle: "Создать аккаунт",
    name: "Имя",
    phone: "Телефон",
    city: "Город",
    role: "Роль",
    roleBoth: "Заказчик и исполнитель",
    roleCustomer: "Только заказчик",
    rolePerformer: "Только исполнитель",
    email: "Email",
    password: "Пароль",
    wait: "Подождите...",
    register: "Зарегистрироваться",
    authCreatedEmail: "Аккаунт создан. Если включено подтверждение email, проверьте почту.",
    authMissingSupabase: "Supabase не подключён. Заполните .env: VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.",

    feedTitle: "Лента заданий",
    feedSubtitle: "Данные загружаются из Supabase.",
    customer: "Заказчик",
    details: "Подробнее",

    createNeedLoginTitle: "Сначала нужна регистрация",
    createNeedLoginText: "Чтобы создать задание, нужен аккаунт Part:time.",
    createNeedLoginButton: "Войти / зарегистрироваться",
    createTitle: "Создать задание",
    createBadge: "Новое задание",
    titlePlaceholder: "Что нужно сделать?",
    budgetPlaceholder: "Бюджет, €",
    descriptionPlaceholder: "Детали",
    publishTask: "Опубликовать задание",
    publishing: "Публикуем...",
    errorTaskTitle: "Напишите, что нужно сделать.",
    errorTaskPrice: "Укажите бюджет больше 0 €.",

    backToTasks: "← Назад к заданиям",
    description: "Описание",
    noDescription: "Описание не добавлено.",
    applyTitle: "Откликнуться",
    applyLoginNotice: "Чтобы откликнуться, нужно войти.",
    applyPlaceholder: "Напишите коротко, когда можете выполнить задачу.",
    sendApplication: "Отправить отклик",
    emptyApplication: "Напишите короткое сообщение для заказчика.",
    duplicateApplication: "Вы уже откликнулись на это задание.",
    applicationSent: "Отклик отправлен.",

    chatsTitle: "Чаты",
    chatAfterAccept: "Чат появляется после того, как заказчик выбрал исполнителя.",
    noChats: "Пока нет активных чатов. Выберите исполнителя в откликах или дождитесь выбора по вашему отклику.",
    chatNeedsLogin: "Чат доступен после входа",
    taskChat: "Диалог по выбранному заданию.",
    interlocutor: "Собеседник",
    backToProfile: "Назад в профиль",
    noMessages: "Пока нет сообщений. Напишите первым.",
    writeMessage: "Написать сообщение...",
    you: "Вы",
    autoTranslateOn: "Автоперевод включён",
    autoTranslateOff: "Автоперевод выключен",
    autoTranslation: "Автоперевод",
    original: "Оригинал",
    demoTranslationNotice: "Демо-перевод. Позже подключим DeepL/OpenAI API для точного перевода.",

    profileLoginTitle: "Профиль доступен после входа",
    profileTitle: "Профиль и доверие",
    profileSubtitle: "Профиль, фото, рейтинг, отзывы и отклики сохраняются в Supabase.",
    profileVerified: "Профиль проверен",
    profileNeedsVerify: "Требуется проверка",
    reviews: "Отзывы",
    noReviews: "Пока нет отзывов.",
    ratingReviews: "отзывов",
    editProfile: "Редактировать аккаунт",
    avatarTitle: "Фото профиля",
    avatarText: "Загружается в Supabase Storage bucket avatars.",
    uploadPhoto: "Загрузить фото",
    bio: "О себе",
    saveProfile: "Сохранить профиль",
    demoVerify: "Демо: пройти проверку",
    demoReview: "Демо: добавить отзыв",
    profileSaved: "Профиль сохранён.",
    chooseImage: "Выберите изображение.",
    demoReviewAdded: "Демо-отзыв добавлен. Обновите страницу или профиль.",

    applicationsTitle: "Отклики на мои задания",
    applicationsSubtitle: "Здесь заказчик видит, кто откликнулся на его опубликованные задания.",
    applicationsCount: "откликов",
    noApplications: "Пока нет откликов на ваши задания.",
    task: "Задание",
    performer: "Исполнитель",
    waitingDecision: "Ожидает решения",
    accepted: "Выбран",
    acceptPerformer: "Выбрать исполнителя",
    openChat: "Открыть чат",
    performerSelected: "Исполнитель выбран. Теперь можно открыть чат.",
    deletedTask: "Задание удалено",
    cityUnknown: "Город не указан",
    phoneUnknown: "телефон не указан",
    noMessage: "Без сообщения",

    acceptedTasksTitle: "Мои принятые задания",
    acceptedTasksSubtitle: "Здесь исполнитель видит задания, где его выбрал заказчик.",
    noAcceptedTasks: "Пока вас не выбрали исполнителем.",

    supabaseNotConnected: "Supabase не подключён. Создайте .env на основе .env.example.",
  },

  lv: {
    navHome: "Sākums",
    navFeed: "Uzdevumi",
    navCreate: "Izveidot",
    navChats: "Čati",
    navProfile: "Profils",
    login: "Ienākt",
    logout: "Iziet",
    language: "RU",

    homeBadge: "Part:time · Latvija",
    homeTitle: "Atrodi palīdzību tuvumā — vai nopelni brīvajā laikā",
    homeSubtitle: "Part:time palīdz ātri atrast izpildītāju mājas, kurjera un tiešsaistes uzdevumiem Latvijā.",
    searchPlaceholder: "Kas jāizdara? Piemēram: salikt mēbeles, piegāde, uzkopšana",
    createTask: "Izveidot uzdevumu",
    needHelp: "Man vajag palīdzību",
    findWork: "Atrast darbu",
    popularCategories: "Populāras kategorijas",
    popularCategoriesText: "Ātri uzdevumi cilvēkiem un mazajiem uzņēmumiem.",
    viewTasks: "Skatīt uzdevumus",
    howItWorks: "Kā tas darbojas",
    howItWorksText: "Daži soļi — no uzdevuma līdz izpildītājam.",
    step1Title: "Apraksti uzdevumu",
    step1Text: "Norādi, kas jāizdara, kur, kad un par kādu budžetu.",
    step2Title: "Saņem pieteikumus",
    step2Text: "Izpildītāji redz uzdevumu un nosūta savus piedāvājumus.",
    step3Title: "Izvēlies izpildītāju",
    step3Text: "Salīdzini profilus, atsauksmes un vienojies čatā.",
    trustBadge: "Uzticība",
    trustTitle: "Izvēlies cilvēkus, nevis nejaušus sludinājumus",
    trustText: "Katram lietotājam ir profils, atsauksmes, vērtējums un sadarbības vēsture. Tas padara vietējos uzdevumus saprotamākus un drošākus.",
    verifiedProfile: "Pārbaudīts profils",
    reviewsAfterTask: "Atsauksmes pēc uzdevuma",
    chatWithPerformer: "Čats ar izpildītāju",
    readyTry: "Gatavs pamēģināt?",
    firstTaskMinute: "Izveido pirmo uzdevumu 1 minūtē.",

    categoryHome: "Māja un remonts",
    categoryHomeText: "Mēbeļu salikšana, sīks remonts, palīdzība mājās",
    categoryDelivery: "Piegāde un uzdevumi",
    categoryDeliveryText: "Dokumenti, pirkumi, nelielas piegādes",
    categoryPhysical: "Fiziska palīdzība",
    categoryPhysicalText: "Pārvākšanās, mantu nešana, sezonas darbi",
    categoryOnline: "Tiešsaistes uzdevumi",
    categoryOnlineText: "Dizains, teksti, IT palīdzība, sociālie tīkli",

    authBadge: "Konts un uzticība",
    authTitle: "Reģistrācija ir vajadzīga drošībai",
    authText: "Profils, vērtējums, atsauksmes un sadarbības vēsture veido uzticību starp pasūtītāju un izpildītāju.",
    authLoginTab: "Ienākt",
    authRegisterTab: "Reģistrācija",
    authLoginTitle: "Ienākt",
    authRegisterTitle: "Izveidot kontu",
    name: "Vārds",
    phone: "Tālrunis",
    city: "Pilsēta",
    role: "Loma",
    roleBoth: "Pasūtītājs un izpildītājs",
    roleCustomer: "Tikai pasūtītājs",
    rolePerformer: "Tikai izpildītājs",
    email: "E-pasts",
    password: "Parole",
    wait: "Lūdzu, uzgaidi...",
    register: "Reģistrēties",
    authCreatedEmail: "Konts izveidots. Ja e-pasta apstiprināšana ir ieslēgta, pārbaudi pastu.",
    authMissingSupabase: "Supabase nav pieslēgts. Aizpildi .env: VITE_SUPABASE_URL un VITE_SUPABASE_ANON_KEY.",

    feedTitle: "Uzdevumu lente",
    feedSubtitle: "Dati tiek ielādēti no Supabase.",
    customer: "Pasūtītājs",
    details: "Vairāk",

    createNeedLoginTitle: "Vispirms jāpieslēdzas",
    createNeedLoginText: "Lai izveidotu uzdevumu, vajadzīgs Part:time konts.",
    createNeedLoginButton: "Ienākt / reģistrēties",
    createTitle: "Izveidot uzdevumu",
    createBadge: "Jauns uzdevums",
    titlePlaceholder: "Kas jāizdara?",
    budgetPlaceholder: "Budžets, €",
    descriptionPlaceholder: "Detaļas",
    publishTask: "Publicēt uzdevumu",
    publishing: "Publicējam...",
    errorTaskTitle: "Uzraksti, kas jāizdara.",
    errorTaskPrice: "Norādi budžetu virs 0 €.",

    backToTasks: "← Atpakaļ pie uzdevumiem",
    description: "Apraksts",
    noDescription: "Apraksts nav pievienots.",
    applyTitle: "Pieteikties",
    applyLoginNotice: "Lai pieteiktos, jāpieslēdzas.",
    applyPlaceholder: "Uzraksti īsi, kad vari izpildīt uzdevumu.",
    sendApplication: "Nosūtīt pieteikumu",
    emptyApplication: "Uzraksti īsu ziņu pasūtītājam.",
    duplicateApplication: "Tu jau pieteicies šim uzdevumam.",
    applicationSent: "Pieteikums nosūtīts.",

    chatsTitle: "Čati",
    chatAfterAccept: "Čats parādās pēc tam, kad pasūtītājs izvēlas izpildītāju.",
    noChats: "Aktīvu čatu vēl nav. Izvēlies izpildītāju pieteikumos vai sagaidi, kad izvēlēsies tevi.",
    chatNeedsLogin: "Čats pieejams pēc pieslēgšanās",
    taskChat: "Dialogs par izvēlēto uzdevumu.",
    interlocutor: "Sarunas biedrs",
    backToProfile: "Atpakaļ uz profilu",
    noMessages: "Ziņu vēl nav. Uzraksti pirmais.",
    writeMessage: "Rakstīt ziņu...",
    you: "Tu",
    autoTranslateOn: "Automātiska tulkošana ieslēgta",
    autoTranslateOff: "Automātiska tulkošana izslēgta",
    autoTranslation: "Automātiskais tulkojums",
    original: "Oriģināls",
    demoTranslationNotice: "Demo tulkojums. Vēlāk pieslēgsim DeepL/OpenAI API precīzam tulkojumam.",

    profileLoginTitle: "Profils pieejams pēc pieslēgšanās",
    profileTitle: "Profils un uzticība",
    profileSubtitle: "Profils, foto, vērtējums, atsauksmes un pieteikumi glabājas Supabase.",
    profileVerified: "Profils pārbaudīts",
    profileNeedsVerify: "Nepieciešama pārbaude",
    reviews: "Atsauksmes",
    noReviews: "Atsauksmju vēl nav.",
    ratingReviews: "atsauksmes",
    editProfile: "Rediģēt kontu",
    avatarTitle: "Profila foto",
    avatarText: "Augšupielādējas Supabase Storage bucket avatars.",
    uploadPhoto: "Augšupielādēt foto",
    bio: "Par sevi",
    saveProfile: "Saglabāt profilu",
    demoVerify: "Demo: pārbaudīt profilu",
    demoReview: "Demo: pievienot atsauksmi",
    profileSaved: "Profils saglabāts.",
    chooseImage: "Izvēlies attēlu.",
    demoReviewAdded: "Demo atsauksme pievienota. Atjauno lapu vai profilu.",

    applicationsTitle: "Pieteikumi maniem uzdevumiem",
    applicationsSubtitle: "Šeit pasūtītājs redz, kas pieteicies viņa publicētajiem uzdevumiem.",
    applicationsCount: "pieteikumi",
    noApplications: "Taviem uzdevumiem vēl nav pieteikumu.",
    task: "Uzdevums",
    performer: "Izpildītājs",
    waitingDecision: "Gaida lēmumu",
    accepted: "Izvēlēts",
    acceptPerformer: "Izvēlēties izpildītāju",
    openChat: "Atvērt čatu",
    performerSelected: "Izpildītājs izvēlēts. Tagad var atvērt čatu.",
    deletedTask: "Uzdevums dzēsts",
    cityUnknown: "Pilsēta nav norādīta",
    phoneUnknown: "tālrunis nav norādīts",
    noMessage: "Bez ziņas",

    acceptedTasksTitle: "Mani pieņemtie uzdevumi",
    acceptedTasksSubtitle: "Šeit izpildītājs redz uzdevumus, kuros viņu izvēlējās pasūtītājs.",
    noAcceptedTasks: "Tevi vēl nav izvēlējušies par izpildītāju.",

    supabaseNotConnected: "Supabase nav pieslēgts. Izveido .env no .env.example.",
  },
};

const commonTasks = {
  ru: ["Собрать мебель", "Доставка по Риге", "Помочь с переездом", "Уборка квартиры", "Дизайн баннера", "Мелкий ремонт"],
  lv: ["Salikt mēbeles", "Piegāde Rīgā", "Palīdzēt pārvākties", "Dzīvokļa uzkopšana", "Banera dizains", "Sīks remonts"],
};

const localizedCategories = (ui) => [
  { label: ui.categoryHome, value: ui.categoryHome, icon: icons.home, text: ui.categoryHomeText },
  { label: ui.categoryDelivery, value: ui.categoryDelivery, icon: icons.truck, text: ui.categoryDeliveryText },
  { label: ui.categoryPhysical, value: ui.categoryPhysical, icon: icons.hammer, text: ui.categoryPhysicalText },
  { label: ui.categoryOnline, value: ui.categoryOnline, icon: icons.laptop, text: ui.categoryOnlineText },
];

function detectLanguage(text) {
  const value = (text || "").toLowerCase();
  if (/[а-яё]/i.test(value)) return "ru";
  if (/[āčēģīķļņšūž]/i.test(value)) return "lv";
  if (/\b(labdien|sveiki|paldies|varu|rīt|šodien|lūdzu|cik|kad|adrese|palīdzēt|atbraukt|sarunāts)\b/i.test(value)) return "lv";
  return "unknown";
}

function translateDemo(text, targetLang) {
  const original = text || "";
  const sourceLang = detectLanguage(original);

  if (sourceLang === targetLang || sourceLang === "unknown") return null;

  const normalized = original.trim().toLowerCase();

  const exact = {
    ru: {
      "labdien": "Здравствуйте",
      "sveiki": "Привет",
      "paldies": "Спасибо",
      "varu atbraukt pēc 18:00": "Могу приехать после 18:00",
      "varu palīdzēt rīt no rīta": "Могу помочь завтра утром",
      "cik tas maksās?": "Сколько это будет стоить?",
      "sarunāts": "Договорились",
    },
    lv: {
      "здравствуйте": "Labdien",
      "привет": "Sveiki",
      "спасибо": "Paldies",
      "могу приехать после 18:00": "Varu atbraukt pēc 18:00",
      "могу помочь завтра утром": "Varu palīdzēt rīt no rīta",
      "сколько это будет стоить?": "Cik tas maksās?",
      "договорились": "Sarunāts",
    },
  };

  if (exact[targetLang]?.[normalized]) return exact[targetLang][normalized];

  const ruToLv = [
    ["здравствуйте", "labdien"],
    ["привет", "sveiki"],
    ["спасибо", "paldies"],
    ["могу", "varu"],
    ["готов", "gatavs"],
    ["готова", "gatava"],
    ["помочь", "palīdzēt"],
    ["приеду", "atbraukšu"],
    ["сегодня", "šodien"],
    ["завтра", "rīt"],
    ["утром", "no rīta"],
    ["вечером", "vakarā"],
    ["после", "pēc"],
    ["адрес", "adrese"],
    ["когда", "kad"],
    ["сколько", "cik"],
    ["стоит", "maksā"],
    ["да", "jā"],
    ["нет", "nē"],
    ["ок", "labi"],
    ["договорились", "sarunāts"],
  ];

  const lvToRu = [
    ["labdien", "здравствуйте"],
    ["sveiki", "привет"],
    ["paldies", "спасибо"],
    ["varu", "могу"],
    ["gatavs", "готов"],
    ["gatava", "готова"],
    ["palīdzēt", "помочь"],
    ["atbraukšu", "приеду"],
    ["šodien", "сегодня"],
    ["rīt", "завтра"],
    ["no rīta", "утром"],
    ["vakarā", "вечером"],
    ["pēc", "после"],
    ["adrese", "адрес"],
    ["kad", "когда"],
    ["cik", "сколько"],
    ["maksā", "стоит"],
    ["jā", "да"],
    ["nē", "нет"],
    ["labi", "ок"],
    ["sarunāts", "договорились"],
  ];

  let translated = original;

  const pairs = targetLang === "lv" ? ruToLv : lvToRu;
  pairs.forEach(([from, to]) => {
    const regexp = new RegExp(`\\b${from}\\b`, "gi");
    translated = translated.replace(regexp, to);
  });

  return translated === original ? null : translated;
}

function Button({ children, onClick, variant = "solid", className = "", type = "button", disabled = false }) {
  const styles = {
    solid: "bg-indigo-600 text-white hover:bg-indigo-700",
    green: "bg-emerald-400 text-slate-950 hover:bg-emerald-300",
    outline: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-indigo-100 text-indigo-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-red-100 text-red-700",
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}

function Avatar({ profile, size = "md" }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-12 w-12 text-base", lg: "h-24 w-24 text-3xl" };

  if (profile?.avatar_url) {
    return <img src={profile.avatar_url} alt="Avatar" className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`} />;
  }

  return (
    <div className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-black text-indigo-700`}>
      {profile?.full_name?.[0]?.toUpperCase() || "U"}
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2 font-black tracking-tight text-slate-950">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-300">
        P
      </div>
      <span className="text-2xl">
        Part
        <motion.span
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-indigo-600"
        >
          :
        </motion.span>
        time
      </span>
    </div>
  );
}

function Header({ screen, setScreen, session, profile, onLogout, lang, setLang, ui }) {
  const nav = [
    ["home", ui.navHome],
    ["feed", ui.navFeed],
    ["create", ui.navCreate],
    ["chats", ui.navChats],
    ["profile", ui.navProfile],
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button onClick={() => setScreen("home")}>
          <Logo />
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setScreen(id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                screen === id ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ru" ? "lv" : "ru")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            {ui.language}
          </button>

          {session ? (
            <>
              <button
                onClick={() => setScreen("profile")}
                className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 sm:flex"
              >
                <Avatar profile={profile} size="sm" /> {profile?.full_name || session.user.email}
              </button>
              <Button onClick={onLogout} variant="outline" className="rounded-full">
                {ui.logout}
              </Button>
            </>
          ) : (
            <Button onClick={() => setScreen("auth")} variant="outline" className="rounded-full">
              {ui.login}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function Home({ setScreen, ui, lang }) {
  const categories = localizedCategories(ui);

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-slate-50">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-100 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative z-10"
          >
            <Badge tone="green">{ui.homeBadge}</Badge>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
              {ui.homeTitle}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{ui.homeSubtitle}</p>

            <div className="mt-8 rounded-[1.75rem] bg-white p-3 shadow-xl shadow-slate-200/70 ring-1 ring-slate-100">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                  <span className="text-xl text-slate-400">{icons.search}</span>
                  <input
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder={ui.searchPlaceholder}
                    onFocus={() => setScreen("feed")}
                    readOnly
                  />
                </div>
                <Button onClick={() => setScreen("create")} className="h-14 px-7 text-base">
                  {ui.createTask}
                </Button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {commonTasks[lang].map((task) => (
                <button
                  key={task}
                  onClick={() => setScreen("feed")}
                  className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-950 hover:text-white"
                >
                  {task}
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => setScreen("create")} variant="green" className="h-14 px-7 text-base">
                {ui.needHelp}
              </Button>
              <Button onClick={() => setScreen("feed")} variant="outline" className="h-14 px-7 text-base">
                {ui.findWork}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative z-10"
          >
            <div className="rounded-[2rem] bg-slate-950 p-4 shadow-2xl shadow-slate-300">
              <div className="rounded-[1.5rem] bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-slate-400">{ui.task}</div>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      {lang === "ru" ? "Помочь перевезти стол" : "Palīdzēt pārvest galdu"}
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-2xl font-black text-emerald-700">€25</div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="text-sm font-black text-slate-500">{ui.city}</div>
                    <div className="mt-1 font-bold text-slate-950">{lang === "ru" ? "Рига, Центр" : "Rīga, centrs"}</div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="text-sm font-black text-slate-500">{lang === "ru" ? "Когда" : "Kad"}</div>
                    <div className="mt-1 font-bold text-slate-950">{lang === "ru" ? "Сегодня после 18:00" : "Šodien pēc 18:00"}</div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="text-sm font-black text-slate-500">{ui.applicationsCount}</div>
                    <div className="mt-1 font-bold text-slate-950">
                      {lang === "ru" ? "3 исполнителя готовы помочь" : "3 izpildītāji gatavi palīdzēt"}
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-900">
                  <div className="font-black">{ui.trustBadge}</div>
                  {ui.trustText}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-950">{ui.popularCategories}</h2>
            <p className="mt-2 text-slate-600">{ui.popularCategoriesText}</p>
          </div>
          <Button onClick={() => setScreen("feed")} variant="outline">
            {ui.viewTasks}
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category.label}
              onClick={() => setScreen("feed")}
              className="rounded-[1.5rem] border border-slate-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">{category.icon}</div>
              <h3 className="mt-5 text-lg font-black">{category.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{category.text}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">{ui.howItWorks}</h2>
            <p className="mt-2 text-slate-600">{ui.howItWorksText}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["1", ui.step1Title, ui.step1Text],
              ["2", ui.step2Title, ui.step2Text],
              ["3", ui.step3Title, ui.step3Text],
            ].map(([number, title, text]) => (
              <div key={title} className="rounded-[1.75rem] bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white">
                  {number}
                </div>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] bg-slate-950 p-8 text-white lg:grid-cols-[1fr_0.8fr] lg:p-10">
          <div>
            <Badge tone="green">{ui.trustBadge}</Badge>
            <h2 className="mt-5 text-3xl font-black tracking-tight">{ui.trustTitle}</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-300">{ui.trustText}</p>
          </div>

          <div className="grid gap-3">
            {[ui.verifiedProfile, ui.reviewsAfterTask, ui.chatWithPerformer].map((item) => (
              <div key={item} className="rounded-3xl bg-white/10 p-4 font-bold">
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-indigo-50 p-8 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">{ui.readyTry}</h2>
          <p className="mt-3 text-slate-600">{ui.firstTaskMinute}</p>
          <Button onClick={() => setScreen("create")} className="mt-6 h-14 px-8 text-base">
            {ui.createTask}
          </Button>
        </div>
      </section>
    </main>
  );
}

function Auth({ onAuthReady, setScreen, ui }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", fullName: "", phone: "", city: "Рига", role: "both" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMessage("");
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        setMessage(ui.authMissingSupabase);
        return;
      }

      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.fullName,
              phone: form.phone,
              city: form.city,
              role: form.role,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: form.fullName || form.email,
            phone: form.phone,
            city: form.city,
            role: form.role,
          });
        }

        if (!data.session) {
          setMessage(ui.authCreatedEmail);
          return;
        }

        await onAuthReady(data.session);
        setScreen("profile");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;

        await onAuthReady(data.session);
        setScreen("profile");
      }
    } catch (error) {
      setMessage(error.message || "Auth error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_460px] lg:px-8">
        <section className="rounded-[2rem] bg-slate-950 p-8 text-white">
          <Badge tone="blue">{ui.authBadge}</Badge>
          <h1 className="mt-5 text-4xl font-black">{ui.authTitle}</h1>
          <p className="mt-4 leading-8 text-slate-300">{ui.authText}</p>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-black ${mode === "login" ? "bg-white shadow-sm" : "text-slate-500"}`}
            >
              {ui.authLoginTab}
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-black ${mode === "register" ? "bg-white shadow-sm" : "text-slate-500"}`}
            >
              {ui.authRegisterTab}
            </button>
          </div>

          <h2 className="mt-6 text-3xl font-black">{mode === "login" ? ui.authLoginTitle : ui.authRegisterTitle}</h2>

          <div className="mt-6 grid gap-4">
            {mode === "register" && (
              <>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder={ui.name}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
                />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={ui.phone}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
                />
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder={ui.city}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
                />
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
                >
                  <option value="both">{ui.roleBoth}</option>
                  <option value="customer">{ui.roleCustomer}</option>
                  <option value="performer">{ui.rolePerformer}</option>
                </select>
              </>
            )}

            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={ui.email}
              className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={ui.password}
              className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
            />

            {message && <div className="rounded-2xl bg-indigo-50 p-4 text-sm font-bold leading-6 text-indigo-800">{message}</div>}

            <Button onClick={submit} disabled={loading} className="h-14 text-base">
              {loading ? ui.wait : mode === "login" ? ui.login : ui.register}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feed({ tasks, profiles, setSelectedTask, setScreen, ui }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tasks.filter((task) => [task.title, task.description, task.category, task.city].join(" ").toLowerCase().includes(q));
  }, [tasks, search]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black">{ui.feedTitle}</h1>
            <p className="mt-2 text-slate-600">{ui.feedSubtitle}</p>
          </div>
          <Button onClick={() => setScreen("create")}>+ {ui.createTask}</Button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-white p-3 shadow-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={ui.searchPlaceholder}
            className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none"
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.map((task) => {
            const owner = profiles[task.customer_id];
            return (
              <div key={task.id} className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge tone="blue">{task.category}</Badge>
                    <h3 className="mt-4 text-xl font-black">{task.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{task.description}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-2xl font-black text-emerald-700">€{task.price}</div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>{icons.map} {task.city}</span>
                  <span>{ui.customer}: {owner?.full_name || "User"}</span>
                </div>
                <div className="mt-5 flex gap-3">
                  <Button
                    onClick={() => {
                      setSelectedTask(task);
                      setScreen("task");
                    }}
                    className="flex-1"
                  >
                    {ui.details}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function CreateTask({ session, setScreen, refreshTasks, ui, lang }) {
  const categories = localizedCategories(ui);
  const [form, setForm] = useState({ title: "", category: categories[0].label, city: lang === "ru" ? "Рига" : "Rīga", price: "", description: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      category: categories.some((category) => category.label === current.category) ? current.category : categories[0].label,
    }));
  }, [lang]);

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-black">{ui.createNeedLoginTitle}</h1>
            <p className="mt-3 text-slate-600">{ui.createNeedLoginText}</p>
            <Button onClick={() => setScreen("auth")} className="mt-6">
              {ui.createNeedLoginButton}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  async function submit() {
    setMessage("");
    setLoading(true);

    try {
      const price = Number(form.price);
      if (!form.title.trim()) throw new Error(ui.errorTaskTitle);
      if (!price || price <= 0) throw new Error(ui.errorTaskPrice);

      const { error } = await supabase.from("tasks").insert({
        customer_id: session.user.id,
        title: form.title.trim(),
        category: form.category,
        city: form.city.trim() || (lang === "ru" ? "Рига" : "Rīga"),
        price,
        description: form.description.trim(),
        status: "open",
      });

      if (error) throw error;

      await refreshTasks();
      setScreen("feed");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <Badge tone="green">{ui.createBadge}</Badge>
          <h1 className="mt-4 text-4xl font-black">{ui.createTitle}</h1>

          <div className="mt-8 grid gap-5">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={ui.titlePlaceholder}
              className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
            >
              {categories.map((c) => (
                <option key={c.label}>{c.label}</option>
              ))}
            </select>
            <div className="grid gap-5 sm:grid-cols-2">
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder={ui.city}
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder={ui.budgetPlaceholder}
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              placeholder={ui.descriptionPlaceholder}
              className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
            />
            {message && <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{message}</div>}
            <Button onClick={submit} disabled={loading} className="h-14 text-base">
              {loading ? ui.publishing : ui.publishTask}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function TaskDetails({ task, session, setScreen, refreshApplications, ui }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  if (!task) return null;

  async function apply() {
    if (!session) {
      setScreen("auth");
      return;
    }

    setStatus("");

    if (!message.trim()) {
      setStatus(ui.emptyApplication);
      return;
    }

    const { error } = await supabase.from("applications").insert({
      task_id: task.id,
      performer_id: session.user.id,
      message: message.trim(),
      status: "sent",
    });

    if (error) {
      if (error.message.includes("duplicate key")) {
        setStatus(ui.duplicateApplication);
      } else {
        setStatus(error.message);
      }
      return;
    }

    setMessage("");
    setStatus(ui.applicationSent);
    await refreshApplications();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <button onClick={() => setScreen("feed")} className="text-sm font-bold text-indigo-600">
            {ui.backToTasks}
          </button>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <Badge tone="blue">{task.category}</Badge>
              <h1 className="mt-4 text-4xl font-black">{task.title}</h1>
              <div className="mt-4 text-slate-500">
                {icons.map} {task.city}
              </div>
            </div>

            <div className="rounded-3xl bg-emerald-100 px-6 py-4 text-4xl font-black text-emerald-700">€{task.price}</div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8">
            <h2 className="text-xl font-black">{ui.description}</h2>
            <p className="mt-3 max-w-3xl leading-8 text-slate-600">{task.description || ui.noDescription}</p>
          </div>
        </section>

        <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black">{ui.applyTitle}</h3>

          {!session && (
            <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-sm font-bold leading-6 text-indigo-800">
              {ui.applyLoginNotice}
            </div>
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-4 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-indigo-500"
            placeholder={ui.applyPlaceholder}
          />

          <Button onClick={apply} className="mt-3 h-12 w-full">
            {icons.send} {ui.sendApplication}
          </Button>

          {status && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">{status}</div>}
        </aside>
      </div>
    </main>
  );
}

function Chats({ session, messages, setMessages, selectedChatTask, profiles, tasks, setScreen, setSelectedChatTask, ui, lang }) {
  const [draft, setDraft] = useState("");
  const [autoTranslate, setAutoTranslate] = useState(true);
  const activeTask = selectedChatTask || null;

  const chatMessages = useMemo(() => {
    if (!activeTask) return [];
    return messages.filter((message) => message.task_id === activeTask.id);
  }, [messages, activeTask]);

  const otherUserId = useMemo(() => {
    if (!session || !activeTask) return null;
    if (activeTask.customer_id === session.user.id) return activeTask.selected_performer_id || null;
    return activeTask.customer_id || null;
  }, [session, activeTask]);

  const otherUser = otherUserId ? profiles[otherUserId] : null;

  async function sendMessage() {
    if (!session || !activeTask || !draft.trim()) return;

    if (!otherUserId) return;

    const text = draft.trim();
    setDraft("");

    const { data, error } = await supabase
      .from("messages")
      .insert({
        task_id: activeTask.id,
        sender_id: session.user.id,
        recipient_id: otherUserId,
        body: text,
      })
      .select()
      .single();

    if (!error && data) {
      setMessages((current) => [...current, data]);
    }
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-black">{ui.chatNeedsLogin}</h1>
            <Button onClick={() => setScreen("auth")} className="mt-6">
              {ui.login}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!activeTask) {
    const acceptedCustomerTasks = tasks.filter((task) => task.customer_id === session.user.id && task.status === "assigned");
    const acceptedPerformerTasks = tasks.filter((task) => task.selected_performer_id === session.user.id && task.status === "assigned");
    const chatTasks = [...acceptedCustomerTasks, ...acceptedPerformerTasks];

    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black">{ui.chatsTitle}</h1>
            <p className="mt-2 text-slate-600">{ui.chatAfterAccept}</p>

            <div className="mt-6 grid gap-3">
              {chatTasks.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-5 text-slate-500">{ui.noChats}</div>
              ) : (
                chatTasks.map((task) => {
                  const customer = profiles[task.customer_id];
                  const performer = profiles[task.selected_performer_id];

                  return (
                    <button
                      key={task.id}
                      onClick={() => {
                        setSelectedChatTask(task);
                        setScreen("chats");
                      }}
                      className="rounded-3xl border border-slate-100 bg-slate-50 p-5 text-left transition hover:bg-white hover:shadow-sm"
                    >
                      <div className="font-black">{task.title}</div>
                      <div className="mt-2 text-sm text-slate-500">
                        {ui.customer}: {customer?.full_name || "User"} · {ui.performer}: {performer?.full_name || "User"}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside className="rounded-[2rem] bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-black">{ui.chatsTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">{ui.taskChat}</p>

          <div className="mt-5 rounded-3xl bg-indigo-50 p-4">
            <div className="font-black text-indigo-950">{activeTask.title}</div>
            <div className="mt-1 text-sm text-indigo-700">
              {ui.interlocutor}: {otherUser?.full_name || "User"}
            </div>
          </div>

          <button
            onClick={() => setAutoTranslate((current) => !current)}
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            {autoTranslate ? ui.autoTranslateOn : ui.autoTranslateOff}
          </button>

          <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            {ui.demoTranslationNotice}
          </div>

          <Button onClick={() => setScreen("profile")} variant="outline" className="mt-4 w-full">
            {ui.backToProfile}
          </Button>
        </aside>

        <section className="flex min-h-[620px] flex-col rounded-[2rem] bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="font-black">{activeTask.title}</div>
            <div className="mt-1 text-sm text-slate-500">
              {ui.task} · {activeTask.city} · €{activeTask.price}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {chatMessages.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-5 text-center text-slate-500">{ui.noMessages}</div>
            ) : (
              chatMessages.map((m) => {
                const mine = m.sender_id === session.user.id;
                const sender = profiles[m.sender_id];
                const translated = autoTranslate && !mine ? translateDemo(m.body, lang) : null;

                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-3xl p-4 ${mine ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-900"}`}>
                      <div className="text-xs font-black opacity-70">
                        {mine ? ui.you : sender?.full_name || "User"}
                      </div>
                      <div className="mt-2 leading-6">{m.body}</div>

                      {translated && (
                        <div className={`mt-3 rounded-2xl p-3 text-sm leading-6 ${mine ? "bg-white/10 text-white" : "bg-white text-slate-700"}`}>
                          <div className="mb-1 text-xs font-black opacity-70">{ui.autoTranslation}</div>
                          {translated}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="flex gap-2 rounded-3xl bg-slate-50 p-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                className="flex-1 bg-transparent px-3 outline-none"
                placeholder={ui.writeMessage}
              />
              <Button onClick={sendMessage} disabled={!draft.trim()}>
                {icons.send}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Profile({ session, profile, setProfile, reviews, setScreen, tasks, applications, profiles, refreshApplications, refreshTasks, setSelectedChatTask, ui }) {
  const [draft, setDraft] = useState(profile || {});
  const [status, setStatus] = useState("");

  useEffect(() => setDraft(profile || {}), [profile]);

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-black">{ui.profileLoginTitle}</h1>
            <Button onClick={() => setScreen("auth")} className="mt-6">
              {ui.login}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const myReviews = reviews.filter((r) => r.reviewee_id === session.user.id);
  const rating = myReviews.length ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1) : "5.0";
  const myTasks = tasks.filter((task) => task.customer_id === session.user.id);
  const applicationsForMyTasks = applications.filter((application) => myTasks.some((task) => task.id === application.task_id));

  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus(ui.chooseImage);
      return;
    }

    const ext = file.name.split(".").pop();
    const path = `${session.user.id}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });

    if (uploadError) {
      setStatus(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setDraft((current) => ({ ...current, avatar_url: data.publicUrl }));
  }

  async function saveProfile() {
    setStatus("");

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: session.user.id,
        full_name: draft.full_name,
        phone: draft.phone,
        city: draft.city,
        role: draft.role,
        bio: draft.bio,
        avatar_url: draft.avatar_url,
        verified: draft.verified || false,
      })
      .select()
      .single();

    if (error) setStatus(error.message);
    else {
      setProfile(data);
      setStatus(ui.profileSaved);
    }
  }

  async function addDemoReview() {
    const { error } = await supabase.from("reviews").insert({
      reviewee_id: session.user.id,
      reviewer_id: session.user.id,
      rating: 5,
      text: ui.demoReviewAdded,
      task_id: null,
    });

    if (error) setStatus(error.message);
    else setStatus(ui.demoReviewAdded);
  }

  async function acceptApplication(application) {
    setStatus("");

    const { error: appError } = await supabase
      .from("applications")
      .update({ status: "accepted" })
      .eq("id", application.id);

    if (appError) {
      setStatus(appError.message);
      return;
    }

    const { error: taskError } = await supabase
      .from("tasks")
      .update({
        status: "assigned",
        selected_performer_id: application.performer_id,
      })
      .eq("id", application.task_id)
      .eq("customer_id", session.user.id);

    if (taskError) {
      setStatus(taskError.message);
      return;
    }

    const relatedTask = tasks.find((task) => task.id === application.task_id);
    if (relatedTask) {
      setSelectedChatTask({
        ...relatedTask,
        status: "assigned",
        selected_performer_id: application.performer_id,
      });
    }

    setStatus(ui.performerSelected);
    await refreshApplications();
    await refreshTasks();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black">{ui.profileTitle}</h1>
            <p className="mt-2 text-slate-600">{ui.profileSubtitle}</p>
          </div>
          <Badge tone={draft?.verified ? "green" : "orange"}>{draft?.verified ? ui.profileVerified : ui.profileNeedsVerify}</Badge>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar profile={draft} size="lg" />
              <div>
                <div className="text-2xl font-black">{draft?.full_name || session.user.email}</div>
                <div className="mt-1 text-sm text-slate-500">{draft?.city || "Rīga"} · {draft?.phone || ui.phoneUnknown}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-amber-400">★★★★★</span>
                  <span className="font-black">{rating}</span>
                  <span className="text-sm text-slate-500">({myReviews.length} {ui.ratingReviews})</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">{ui.editProfile}</h2>

            <div className="mt-5 rounded-3xl bg-slate-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar profile={draft} size="lg" />
                  <div>
                    <div className="font-black">{ui.avatarTitle}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">{ui.avatarText}</div>
                  </div>
                </div>

                <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-700">
                  {ui.uploadPhoto}
                  <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
                </label>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                value={draft?.full_name || ""}
                onChange={(e) => setDraft({ ...draft, full_name: e.target.value })}
                placeholder={ui.name}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
              <input
                value={draft?.phone || ""}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                placeholder={ui.phone}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
              <input
                value={draft?.city || ""}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                placeholder={ui.city}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
              <select
                value={draft?.role || "both"}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option value="both">{ui.roleBoth}</option>
                <option value="customer">{ui.roleCustomer}</option>
                <option value="performer">{ui.rolePerformer}</option>
              </select>
              <textarea
                value={draft?.bio || ""}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                placeholder={ui.bio}
                rows={4}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 sm:col-span-2"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={saveProfile}>{ui.saveProfile}</Button>
              <Button onClick={() => setDraft({ ...draft, verified: true })} variant="outline">
                {ui.demoVerify}
              </Button>
              <Button onClick={addDemoReview} variant="outline">
                {ui.demoReview}
              </Button>
            </div>

            {status && <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-sm font-bold text-indigo-800">{status}</div>}
          </section>
        </div>

        <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black">{ui.applicationsTitle}</h2>
              <p className="mt-2 text-sm text-slate-500">{ui.applicationsSubtitle}</p>
            </div>
            <Badge tone="blue">{applicationsForMyTasks.length} {ui.applicationsCount}</Badge>
          </div>

          <div className="mt-5 grid gap-4">
            {applicationsForMyTasks.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-5 text-slate-500">{ui.noApplications}</div>
            ) : (
              applicationsForMyTasks.map((application) => {
                const relatedTask = tasks.find((task) => task.id === application.task_id);
                const performer = profiles[application.performer_id];

                return (
                  <div key={application.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="text-xs font-black uppercase tracking-wide text-slate-400">{ui.task}</div>
                        <div className="mt-1 text-lg font-black">{relatedTask?.title || ui.deletedTask}</div>

                        <div className="mt-4 flex items-center gap-3">
                          <Avatar profile={performer} size="md" />
                          <div>
                            <div className="font-black">{performer?.full_name || ui.performer}</div>
                            <div className="text-sm text-slate-500">
                              {performer?.city || ui.cityUnknown} · {performer?.phone || ui.phoneUnknown}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">
                          {application.message || ui.noMessage}
                        </div>
                      </div>

                      <div className="flex min-w-[190px] flex-col gap-2">
                        <Badge tone={application.status === "accepted" ? "green" : "orange"}>
                          {application.status === "accepted" ? ui.accepted : ui.waitingDecision}
                        </Badge>

                        {application.status !== "accepted" && (
                          <Button onClick={() => acceptApplication(application)} className="mt-2">
                            {ui.acceptPerformer}
                          </Button>
                        )}

                        {application.status === "accepted" && relatedTask && (
                          <Button
                            onClick={() => {
                              setSelectedChatTask({
                                ...relatedTask,
                                selected_performer_id: application.performer_id,
                                status: "assigned",
                              });
                              setScreen("chats");
                            }}
                            className="mt-2"
                          >
                            {ui.openChat}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black">{ui.acceptedTasksTitle}</h2>
              <p className="mt-2 text-sm text-slate-500">{ui.acceptedTasksSubtitle}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {applications.filter((application) => application.performer_id === session.user.id && application.status === "accepted").length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-5 text-slate-500">{ui.noAcceptedTasks}</div>
            ) : (
              applications
                .filter((application) => application.performer_id === session.user.id && application.status === "accepted")
                .map((application) => {
                  const relatedTask = tasks.find((task) => task.id === application.task_id);
                  const customer = relatedTask ? profiles[relatedTask.customer_id] : null;

                  return (
                    <div key={application.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                          <div className="text-lg font-black">{relatedTask?.title || ui.task}</div>
                          <div className="mt-2 text-sm text-slate-500">
                            {ui.customer}: {customer?.full_name || "User"} · {relatedTask?.city || ui.cityUnknown}
                          </div>
                        </div>

                        {relatedTask && (
                          <Button
                            onClick={() => {
                              setSelectedChatTask(relatedTask);
                              setScreen("chats");
                            }}
                          >
                            {ui.openChat}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">{ui.reviews}</h2>
          <div className="mt-4 grid gap-3">
            {myReviews.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-5 text-slate-500">{ui.noReviews}</div>
            ) : (
              myReviews.map((r) => (
                <div key={r.id} className="rounded-3xl bg-slate-50 p-5">
                  <div className="font-black text-amber-500">{"★".repeat(r.rating)}</div>
                  <p className="mt-2 leading-7 text-slate-600">{r.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function BottomNav({ screen, setScreen, ui }) {
  const items = [
    ["feed", icons.briefcase, ui.navFeed],
    ["create", icons.plus, ui.navCreate],
    ["chats", icons.message, ui.navChats],
    ["profile", icons.user, ui.navProfile],
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {items.map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => setScreen(id)}
            className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-bold ${
              screen === id ? "bg-indigo-50 text-indigo-700" : "text-slate-500"
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span className="mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function ParttimeApp() {
  const [screen, setScreen] = useState("home");
  const [lang, setLang] = useState(() => {
    try {
      return window.localStorage.getItem("parttime_lang") || "ru";
    } catch {
      return "ru";
    }
  });
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedChatTask, setSelectedChatTask] = useState(null);

  const ui = TEXT[lang];

  useEffect(() => {
    try {
      window.localStorage.setItem("parttime_lang", lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadEverything(data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) loadEverything(nextSession);
      else {
        setProfile(null);
        setTasks([]);
        setMessages([]);
        setReviews([]);
        setApplications([]);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function loadEverything(activeSession = session) {
    if (!isSupabaseConfigured) return;

    const [{ data: taskRows }, { data: profileRows }, { data: applicationRows }, { data: messageRows }, { data: reviewRows }] =
      await Promise.all([
        supabase.from("tasks").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*"),
        supabase.from("applications").select("*").order("created_at", { ascending: false }),
        supabase.from("messages").select("*").order("created_at", { ascending: true }).limit(50),
        supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      ]);

    setTasks(taskRows || []);
    setApplications(applicationRows || []);
    setMessages(messageRows || []);
    setReviews(reviewRows || []);

    const byId = {};
    (profileRows || []).forEach((p) => {
      byId[p.id] = p;
    });
    setProfiles(byId);

    if (activeSession?.user?.id) {
      setProfile(byId[activeSession.user.id] || { id: activeSession.user.id, full_name: activeSession.user.email, role: "both", city: "Rīga" });
    }
  }

  async function refreshTasks() {
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    setTasks(data || []);
  }

  async function refreshApplications() {
    const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    setApplications(data || []);
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setSelectedChatTask(null);
    setScreen("home");
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-slate-950 md:pb-0">
      <Header screen={screen} setScreen={setScreen} session={session} profile={profile} onLogout={logout} lang={lang} setLang={setLang} ui={ui} />

      {!isSupabaseConfigured && (
        <div className="bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700">
          {ui.supabaseNotConnected}
        </div>
      )}

      {screen === "home" && <Home setScreen={setScreen} ui={ui} lang={lang} />}
      {screen === "auth" && <Auth onAuthReady={loadEverything} setScreen={setScreen} ui={ui} />}
      {screen === "feed" && <Feed tasks={tasks} profiles={profiles} setSelectedTask={setSelectedTask} setScreen={setScreen} ui={ui} />}
      {screen === "create" && <CreateTask session={session} setScreen={setScreen} refreshTasks={refreshTasks} ui={ui} lang={lang} />}
      {screen === "task" && <TaskDetails task={selectedTask} session={session} setScreen={setScreen} refreshApplications={refreshApplications} ui={ui} />}
      {screen === "chats" && (
        <Chats
          session={session}
          messages={messages}
          setMessages={setMessages}
          selectedChatTask={selectedChatTask}
          profiles={profiles}
          tasks={tasks}
          setScreen={setScreen}
          setSelectedChatTask={setSelectedChatTask}
          ui={ui}
          lang={lang}
        />
      )}
      {screen === "profile" && (
        <Profile
          session={session}
          profile={profile}
          setProfile={setProfile}
          reviews={reviews}
          setScreen={setScreen}
          tasks={tasks}
          applications={applications}
          profiles={profiles}
          refreshApplications={refreshApplications}
          refreshTasks={refreshTasks}
          setSelectedChatTask={setSelectedChatTask}
          ui={ui}
        />
      )}

      <BottomNav screen={screen} setScreen={setScreen} ui={ui} />
    </div>
  );
}
