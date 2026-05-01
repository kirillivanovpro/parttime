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

const categories = [
  { label: "Помощь по дому", icon: icons.home },
  { label: "Доставка", icon: icons.truck },
  { label: "Физическая помощь", icon: icons.hammer },
  { label: "Онлайн-задачи", icon: icons.laptop },
];

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

function Header({ screen, setScreen, session, profile, onLogout }) {
  const nav = [
    ["home", "Главная"],
    ["feed", "Задания"],
    ["create", "Создать"],
    ["chats", "Чаты"],
    ["profile", "Профиль"],
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
          {session ? (
            <>
              <button
                onClick={() => setScreen("profile")}
                className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 sm:flex"
              >
                <Avatar profile={profile} size="sm" /> {profile?.full_name || session.user.email}
              </button>
              <Button onClick={onLogout} variant="outline" className="rounded-full">
                Выйти
              </Button>
            </>
          ) : (
            <Button onClick={() => setScreen("auth")} variant="outline" className="rounded-full">
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function Home({ setScreen }) {
  const popularTasks = [
    "Собрать мебель",
    "Доставка по Риге",
    "Помочь с переездом",
    "Уборка квартиры",
    "Дизайн баннера",
    "Мелкий ремонт",
  ];

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
            <Badge tone="green">Part:time · Латвия</Badge>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Найди помощь рядом — или заработай в свободное время
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Part:time помогает быстро найти исполнителя для бытовых, курьерских и онлайн-задач в Латвии.
            </p>

            <div className="mt-8 rounded-[1.75rem] bg-white p-3 shadow-xl shadow-slate-200/70 ring-1 ring-slate-100">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                  <span className="text-xl text-slate-400">{icons.search}</span>
                  <input
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Что нужно сделать? Например: собрать мебель, доставка, уборка"
                    onFocus={() => setScreen("feed")}
                    readOnly
                  />
                </div>
                <Button onClick={() => setScreen("create")} className="h-14 px-7 text-base">
                  Создать задание
                </Button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {popularTasks.map((task) => (
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
                Мне нужна помощь
              </Button>
              <Button onClick={() => setScreen("feed")} variant="outline" className="h-14 px-7 text-base">
                Найти подработку
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
                    <div className="text-xs font-black uppercase tracking-wide text-slate-400">Пример задания</div>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">Помочь перевезти стол</h2>
                  </div>
                  <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-2xl font-black text-emerald-700">
                    €25
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="text-sm font-black text-slate-500">Где</div>
                    <div className="mt-1 font-bold text-slate-950">Рига, Центр</div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="text-sm font-black text-slate-500">Когда</div>
                    <div className="mt-1 font-bold text-slate-950">Сегодня после 18:00</div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="text-sm font-black text-slate-500">Отклики</div>
                    <div className="mt-1 font-bold text-slate-950">3 исполнителя готовы помочь</div>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-900">
                  <div className="font-black">Безопаснее выбирать</div>
                  Профили, рейтинги, отзывы и история заданий помогают принять решение.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-950">Популярные категории</h2>
            <p className="mt-2 text-slate-600">Быстрые задачи для людей и малого бизнеса.</p>
          </div>
          <Button onClick={() => setScreen("feed")} variant="outline">
            Смотреть задания
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Дом и ремонт", icons.home, "Сборка мебели, мелкий ремонт, помощь по дому"],
            ["Доставка и поручения", icons.truck, "Документы, покупки, небольшие доставки"],
            ["Физическая помощь", icons.hammer, "Переезды, перенос вещей, сезонные работы"],
            ["Онлайн-задачи", icons.laptop, "Дизайн, тексты, IT-помощь, соцсети"],
          ].map(([title, icon, text]) => (
            <button
              key={title}
              onClick={() => setScreen("feed")}
              className="rounded-[1.5rem] border border-slate-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                {icon}
              </div>
              <h3 className="mt-5 text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">Как это работает</h2>
            <p className="mt-2 text-slate-600">Минимум шагов — от задачи до исполнителя.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Опишите задачу", "Укажите, что нужно сделать, где, когда и за какой бюджет."],
              ["2", "Получите отклики", "Исполнители видят задание и отправляют свои предложения."],
              ["3", "Выберите исполнителя", "Сравните профили, отзывы и договоритесь в чате."],
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
            <Badge tone="green">Доверие</Badge>
            <h2 className="mt-5 text-3xl font-black tracking-tight">Выбирайте людей, а не случайные объявления</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-300">
              У каждого пользователя есть профиль, отзывы, рейтинг и история взаимодействий. Это делает локальные задачи понятнее и безопаснее.
            </p>
          </div>

          <div className="grid gap-3">
            {["Проверенный профиль", "Отзывы после задания", "Чат с исполнителем"].map((item) => (
              <div key={item} className="rounded-3xl bg-white/10 p-4 font-bold">
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-indigo-50 p-8 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">Готовы попробовать?</h2>
          <p className="mt-3 text-slate-600">Создайте первое задание за 1 минуту.</p>
          <Button onClick={() => setScreen("create")} className="mt-6 h-14 px-8 text-base">
            Создать задание
          </Button>
        </div>
      </section>
    </main>
  );
}
function Auth({ onAuthReady, setScreen }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", fullName: "", phone: "", city: "Рига", role: "both" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMessage("");
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        setMessage("Supabase не подключён. Заполните .env: VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.");
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
          setMessage("Аккаунт создан. Если включено подтверждение email, проверьте почту.");
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
      setMessage(error.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_460px] lg:px-8">
        <section className="rounded-[2rem] bg-slate-950 p-8 text-white">
          <Badge tone="blue">Аккаунт и доверие</Badge>
          <h1 className="mt-5 text-4xl font-black">Регистрация нужна для безопасности</h1>
          <p className="mt-4 leading-8 text-slate-300">
            Профиль, рейтинг, отзывы и история взаимодействий создают доверие между заказчиком и исполнителем.
          </p>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-black ${mode === "login" ? "bg-white shadow-sm" : "text-slate-500"}`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-black ${mode === "register" ? "bg-white shadow-sm" : "text-slate-500"}`}
            >
              Регистрация
            </button>
          </div>

          <h2 className="mt-6 text-3xl font-black">{mode === "login" ? "Войти" : "Создать аккаунт"}</h2>

          <div className="mt-6 grid gap-4">
            {mode === "register" && (
              <>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Имя"
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
                />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Телефон"
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
                />
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Город"
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
                />
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
                >
                  <option value="both">Заказчик и исполнитель</option>
                  <option value="customer">Только заказчик</option>
                  <option value="performer">Только исполнитель</option>
                </select>
              </>
            )}

            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Пароль"
              className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
            />

            {message && <div className="rounded-2xl bg-indigo-50 p-4 text-sm font-bold leading-6 text-indigo-800">{message}</div>}

            <Button onClick={submit} disabled={loading} className="h-14 text-base">
              {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feed({ tasks, profiles, setSelectedTask, setScreen }) {
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
            <h1 className="text-4xl font-black">Лента заданий</h1>
            <p className="mt-2 text-slate-600">Данные загружаются из Supabase.</p>
          </div>
          <Button onClick={() => setScreen("create")}>+ Создать задание</Button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-white p-3 shadow-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск: доставка, уборка, дизайн..."
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
                  <span>Заказчик: {owner?.full_name || "Пользователь"}</span>
                </div>
                <div className="mt-5 flex gap-3">
                  <Button
                    onClick={() => {
                      setSelectedTask(task);
                      setScreen("task");
                    }}
                    className="flex-1"
                  >
                    Подробнее
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

function CreateTask({ session, setScreen, refreshTasks }) {
  const [form, setForm] = useState({ title: "", category: "Помощь по дому", city: "Рига", price: "", description: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-black">Сначала нужна регистрация</h1>
            <p className="mt-3 text-slate-600">Чтобы создать задание, нужен аккаунт Part:time.</p>
            <Button onClick={() => setScreen("auth")} className="mt-6">
              Войти / зарегистрироваться
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
      if (!form.title.trim()) throw new Error("Напишите, что нужно сделать.");
      if (!price || price <= 0) throw new Error("Укажите бюджет больше 0 €.");

      const { error } = await supabase.from("tasks").insert({
        customer_id: session.user.id,
        title: form.title.trim(),
        category: form.category,
        city: form.city.trim() || "Рига",
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
          <Badge tone="green">Supabase insert</Badge>
          <h1 className="mt-4 text-4xl font-black">Создать задание</h1>

          <div className="mt-8 grid gap-5">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Что нужно сделать?"
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
                placeholder="Город"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Бюджет, €"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
              />
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              placeholder="Детали"
              className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-500"
            />
            {message && <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{message}</div>}
            <Button onClick={submit} disabled={loading} className="h-14 text-base">
              {loading ? "Публикуем..." : "Опубликовать задание"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function TaskDetails({ task, session, setScreen, refreshApplications }) {
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
      setStatus("Напишите короткое сообщение для заказчика.");
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
        setStatus("Вы уже откликнулись на это задание.");
      } else {
        setStatus(error.message);
      }
      return;
    }

    setMessage("");
    setStatus("Отклик отправлен.");
    await refreshApplications();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <button onClick={() => setScreen("feed")} className="text-sm font-bold text-indigo-600">
            ← Назад к заданиям
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
            <h2 className="text-xl font-black">Описание</h2>
            <p className="mt-3 max-w-3xl leading-8 text-slate-600">{task.description || "Описание не добавлено."}</p>
          </div>
        </section>

        <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black">Откликнуться</h3>

          {!session && (
            <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-sm font-bold leading-6 text-indigo-800">
              Чтобы откликнуться, нужно войти.
            </div>
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-4 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-indigo-500"
            placeholder="Напишите коротко, когда можете выполнить задачу."
          />

          <Button onClick={apply} className="mt-3 h-12 w-full">
            {icons.send} Отправить отклик
          </Button>

          {status && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">{status}</div>}
        </aside>
      </div>
    </main>
  );
}

function Chats({ session, messages, setMessages, selectedChatTask, profiles, tasks, setScreen, setSelectedChatTask }) {
  const [draft, setDraft] = useState("");
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
            <h1 className="text-3xl font-black">Чат доступен после входа</h1>
            <Button onClick={() => setScreen("auth")} className="mt-6">
              Войти
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
            <h1 className="text-3xl font-black">Чаты</h1>
            <p className="mt-2 text-slate-600">
              Чат появляется после того, как заказчик выбрал исполнителя.
            </p>

            <div className="mt-6 grid gap-3">
              {chatTasks.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-5 text-slate-500">
                  Пока нет активных чатов. Выберите исполнителя в откликах или дождитесь выбора по вашему отклику.
                </div>
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
                        Заказчик: {customer?.full_name || "Пользователь"} · Исполнитель: {performer?.full_name || "Пользователь"}
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
          <h1 className="text-2xl font-black">Чаты</h1>
          <p className="mt-1 text-sm text-slate-500">Диалог по выбранному заданию.</p>

          <div className="mt-5 rounded-3xl bg-indigo-50 p-4">
            <div className="font-black text-indigo-950">{activeTask.title}</div>
            <div className="mt-1 text-sm text-indigo-700">
              Собеседник: {otherUser?.full_name || "Пользователь"}
            </div>
          </div>

          <Button onClick={() => setScreen("profile")} variant="outline" className="mt-4 w-full">
            Назад в профиль
          </Button>
        </aside>

        <section className="flex min-h-[620px] flex-col rounded-[2rem] bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="font-black">{activeTask.title}</div>
            <div className="mt-1 text-sm text-slate-500">
              Задание · {activeTask.city} · €{activeTask.price}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {chatMessages.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-5 text-center text-slate-500">
                Пока нет сообщений. Напишите первым.
              </div>
            ) : (
              chatMessages.map((m) => {
                const mine = m.sender_id === session.user.id;
                const sender = profiles[m.sender_id];

                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-3xl p-4 ${mine ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-900"}`}>
                      <div className="text-xs font-black opacity-70">
                        {mine ? "Вы" : sender?.full_name || "Пользователь"}
                      </div>
                      <div className="mt-2 leading-6">{m.body}</div>
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
                placeholder="Написать сообщение..."
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

function Profile({ session, profile, setProfile, reviews, setScreen, tasks, applications, profiles, refreshApplications, refreshTasks, setSelectedChatTask }) {
  const [draft, setDraft] = useState(profile || {});
  const [status, setStatus] = useState("");

  useEffect(() => setDraft(profile || {}), [profile]);

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-black">Профиль доступен после входа</h1>
            <Button onClick={() => setScreen("auth")} className="mt-6">
              Войти
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
      setStatus("Выберите изображение.");
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
      setStatus("Профиль сохранён.");
    }
  }

  async function addDemoReview() {
    const { error } = await supabase.from("reviews").insert({
      reviewee_id: session.user.id,
      reviewer_id: session.user.id,
      rating: 5,
      text: "Демо-отзыв: пользователь выполнил задачу вовремя и качественно.",
      task_id: null,
    });

    if (error) setStatus(error.message);
    else setStatus("Демо-отзыв добавлен. Обновите страницу или профиль.");
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

    setStatus("Исполнитель выбран. Теперь можно открыть чат.");
    await refreshApplications();
    await refreshTasks();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black">Профиль и доверие</h1>
            <p className="mt-2 text-slate-600">Профиль, фото, рейтинг, отзывы и отклики сохраняются в Supabase.</p>
          </div>
          <Badge tone={draft?.verified ? "green" : "orange"}>{draft?.verified ? "Профиль проверен" : "Требуется проверка"}</Badge>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar profile={draft} size="lg" />
              <div>
                <div className="text-2xl font-black">{draft?.full_name || session.user.email}</div>
                <div className="mt-1 text-sm text-slate-500">{draft?.city || "Рига"} · {draft?.phone || "телефон не указан"}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-amber-400">★★★★★</span>
                  <span className="font-black">{rating}</span>
                  <span className="text-sm text-slate-500">({myReviews.length} отзывов)</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Редактировать аккаунт</h2>

            <div className="mt-5 rounded-3xl bg-slate-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar profile={draft} size="lg" />
                  <div>
                    <div className="font-black">Фото профиля</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">Загружается в Supabase Storage bucket avatars.</div>
                  </div>
                </div>

                <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-700">
                  Загрузить фото
                  <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
                </label>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                value={draft?.full_name || ""}
                onChange={(e) => setDraft({ ...draft, full_name: e.target.value })}
                placeholder="Имя"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
              <input
                value={draft?.phone || ""}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                placeholder="Телефон"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
              <input
                value={draft?.city || ""}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                placeholder="Город"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
              <select
                value={draft?.role || "both"}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option value="both">Заказчик и исполнитель</option>
                <option value="customer">Только заказчик</option>
                <option value="performer">Только исполнитель</option>
              </select>
              <textarea
                value={draft?.bio || ""}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                placeholder="О себе"
                rows={4}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 sm:col-span-2"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={saveProfile}>Сохранить профиль</Button>
              <Button onClick={() => setDraft({ ...draft, verified: true })} variant="outline">
                Демо: пройти проверку
              </Button>
              <Button onClick={addDemoReview} variant="outline">
                Демо: добавить отзыв
              </Button>
            </div>

            {status && <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-sm font-bold text-indigo-800">{status}</div>}
          </section>
        </div>

        <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black">Отклики на мои задания</h2>
              <p className="mt-2 text-sm text-slate-500">
                Здесь заказчик видит, кто откликнулся на его опубликованные задания.
              </p>
            </div>
            <Badge tone="blue">{applicationsForMyTasks.length} откликов</Badge>
          </div>

          <div className="mt-5 grid gap-4">
            {applicationsForMyTasks.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-5 text-slate-500">
                Пока нет откликов на ваши задания.
              </div>
            ) : (
              applicationsForMyTasks.map((application) => {
                const relatedTask = tasks.find((task) => task.id === application.task_id);
                const performer = profiles[application.performer_id];

                return (
                  <div key={application.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="text-xs font-black uppercase tracking-wide text-slate-400">Задание</div>
                        <div className="mt-1 text-lg font-black">{relatedTask?.title || "Задание удалено"}</div>

                        <div className="mt-4 flex items-center gap-3">
                          <Avatar profile={performer} size="md" />
                          <div>
                            <div className="font-black">{performer?.full_name || "Исполнитель"}</div>
                            <div className="text-sm text-slate-500">
                              {performer?.city || "Город не указан"} · {performer?.phone || "телефон не указан"}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">
                          {application.message || "Без сообщения"}
                        </div>
                      </div>

                      <div className="flex min-w-[190px] flex-col gap-2">
                        <Badge tone={application.status === "accepted" ? "green" : "orange"}>
                          {application.status === "accepted" ? "Выбран" : "Ожидает решения"}
                        </Badge>

                        {application.status !== "accepted" && (
                          <Button onClick={() => acceptApplication(application)} className="mt-2">
                            Выбрать исполнителя
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
                            Открыть чат
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
              <h2 className="text-2xl font-black">Мои принятые задания</h2>
              <p className="mt-2 text-sm text-slate-500">
                Здесь исполнитель видит задания, где его выбрал заказчик.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {applications.filter((application) => application.performer_id === session.user.id && application.status === "accepted").length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-5 text-slate-500">
                Пока вас не выбрали исполнителем.
              </div>
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
                          <div className="text-lg font-black">{relatedTask?.title || "Задание"}</div>
                          <div className="mt-2 text-sm text-slate-500">
                            Заказчик: {customer?.full_name || "Пользователь"} · {relatedTask?.city || "Город не указан"}
                          </div>
                        </div>

                        {relatedTask && (
                          <Button
                            onClick={() => {
                              setSelectedChatTask(relatedTask);
                              setScreen("chats");
                            }}
                          >
                            Открыть чат
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
          <h2 className="text-2xl font-black">Отзывы</h2>
          <div className="mt-4 grid gap-3">
            {myReviews.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-5 text-slate-500">Пока нет отзывов.</div>
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

function BottomNav({ screen, setScreen }) {
  const items = [
    ["feed", icons.briefcase, "Задания"],
    ["create", icons.plus, "Создать"],
    ["chats", icons.message, "Чаты"],
    ["profile", icons.user, "Профиль"],
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
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedChatTask, setSelectedChatTask] = useState(null);

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
      setProfile(byId[activeSession.user.id] || { id: activeSession.user.id, full_name: activeSession.user.email, role: "both", city: "Рига" });
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
    setScreen("home");
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-slate-950 md:pb-0">
      <Header screen={screen} setScreen={setScreen} session={session} profile={profile} onLogout={logout} />

      {!isSupabaseConfigured && (
        <div className="bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700">
          Supabase не подключён. Создайте .env на основе .env.example.
        </div>
      )}

      {screen === "home" && <Home setScreen={setScreen} />}
      {screen === "auth" && <Auth onAuthReady={loadEverything} setScreen={setScreen} />}
      {screen === "feed" && <Feed tasks={tasks} profiles={profiles} setSelectedTask={setSelectedTask} setScreen={setScreen} />}
      {screen === "create" && <CreateTask session={session} setScreen={setScreen} refreshTasks={refreshTasks} />}
      {screen === "task" && <TaskDetails task={selectedTask} session={session} setScreen={setScreen} refreshApplications={refreshApplications} />}
      {screen === "chats" && <Chats session={session} messages={messages} setMessages={setMessages} selectedChatTask={selectedChatTask} profiles={profiles} tasks={tasks} setScreen={setScreen} setSelectedChatTask={setSelectedChatTask} />}
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
        />
      )}

      <BottomNav screen={screen} setScreen={setScreen} />
    </div>
  );
}
