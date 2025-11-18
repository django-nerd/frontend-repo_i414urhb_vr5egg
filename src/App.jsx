import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Spline from '@splinetool/react-spline'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Play, BookOpen, User, LogOut, Trophy, MessageSquare, Sparkles, Menu, BarChart3, ShieldCheck } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('lh_token') || '')
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('lh_user') || 'null'))

  const save = (t, u) => {
    localStorage.setItem('lh_token', t)
    localStorage.setItem('lh_user', JSON.stringify(u))
    setToken(t); setUser(u)
  }
  const clear = () => { localStorage.removeItem('lh_token'); localStorage.removeItem('lh_user'); setToken(''); setUser(null) }
  return { token, user, save, clear }
}

function Layout({ children }) {
  const { token, user, clear } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
          <button className="md:hidden p-2 rounded bg-white/5" onClick={() => setOpen(v=>!v)}><Menu size={18} /></button>
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-8 w-8 rounded bg-gradient-to-br from-rose-500 to-pink-500 items-center justify-center">LH</span>
            <span>LearnHub</span>
          </Link>
          <nav className="hidden md:flex ml-6 gap-6 text-sm text-slate-300">
            <Link className={`hover:text-white transition ${location.pathname.startsWith('/dashboard')?'text-white':''}`} to="/dashboard">Dashboard</Link>
            <Link className={`hover:text-white transition ${location.pathname.startsWith('/courses')?'text-white':''}`} to="/courses">Courses</Link>
            <Link className={`hover:text-white transition ${location.pathname.startsWith('/community')?'text-white':''}`} to="/community">Community</Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input placeholder="Search skills, topics" className="pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300 hidden sm:block">Hi, {user.name}</span>
                <button onClick={clear} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"><LogOut size={16}/> Logout</button>
              </div>
            ) : (
              <Link to="/auth" className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white"><User size={16}/> Sign in</Link>
            )}
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="md:hidden border-t border-white/10">
              <div className="px-4 py-3 grid gap-2 bg-slate-900/70">
                <Link to="/dashboard" onClick={()=>setOpen(false)} className="py-2">Dashboard</Link>
                <Link to="/courses" onClick={()=>setOpen(false)} className="py-2">Courses</Link>
                <Link to="/community" onClick={()=>setOpen(false)} className="py-2">Community</Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {children}

      <footer className="mt-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-400 flex flex-col sm:flex-row gap-3 justify-between">
          <span>© {new Date().getFullYear()} LearnHub</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck size={16}/> Privacy-first • Secure • Accessible</span>
        </div>
      </footer>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative h-[72vh] min-h-[520px] grid place-items-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/40 to-slate-950 pointer-events-none" />
      <div className="relative z-10 px-4 w-full">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1 initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.6}} className="text-4xl md:text-6xl font-semibold tracking-tight">
            LearnHub – Your Platform for Skill Enhancement
          </motion.h1>
          <motion.p initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.1,duration:0.6}} className="mt-4 text-slate-300 text-lg">
            Personalized learning, real-time progress, interactive quizzes, and an AI assistant by your side.
          </motion.p>
          <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2,duration:0.6}} className="mt-8 flex justify-center gap-3">
            <Link to="/dashboard" className="px-5 py-3 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white inline-flex items-center gap-2"><Sparkles size={18}/> Get Started</Link>
            <Link to="/courses" className="px-5 py-3 rounded-lg bg-white/10 border border-white/10 inline-flex items-center gap-2"><Play size={18}/> Browse Courses</Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Stat({icon:Icon, label, value}){
  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
      <div className="text-slate-300 text-sm">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <Icon className="text-rose-400" size={18}/>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  )
}

function Dashboard(){
  const { token, user } = useAuth()
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{ fetch(`${API_BASE}/courses`).then(r=>r.json()).then(d=>setCourses(d.items||[])) },[])

  return (
    <main className="pt-24">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-semibold">Welcome{user?`, ${user.name}`:''}</h2>
        <p className="text-slate-400">Your personalized learning overview</p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat icon={BarChart3} label="Weekly Minutes" value="86"/>
          <Stat icon={Trophy} label="Achievements" value="5"/>
          <Stat icon={BookOpen} label="Active Courses" value={courses.length}/>
          <Stat icon={MessageSquare} label="Forum Posts" value="12"/>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(c => (
            <motion.button key={c.id} onClick={()=>navigate(`/courses/${c.id}`)} whileHover={{y:-3}} className="text-left rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="aspect-video w-full bg-cover bg-center" style={{backgroundImage:`url(${c.thumbnail_url})`}}/>
              <div className="p-4">
                <div className="text-sm text-rose-300">{c.category}</div>
                <div className="font-semibold mt-1">{c.title}</div>
                <div className="text-sm text-slate-400 line-clamp-2 mt-1">{c.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  )
}

function Auth(){
  const { save } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    const endpoint = isLogin? '/auth/login':'/auth/register'
    const body = isLogin? {email, password}:{name, email, password}
    const res = await fetch(`${API_BASE}${endpoint}`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
    const data = await res.json()
    if(res.ok){ save(data.token, data.user); navigate('/dashboard') } else { alert(data.detail || 'Error') }
  }

  return (
    <main className="pt-24">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{isLogin? 'Welcome back' : 'Create your account'}</h2>
            <button onClick={()=>setIsLogin(v=>!v)} className="text-sm text-rose-300">{isLogin? 'Need an account?' : 'Have an account?'}</button>
          </div>

          <form onSubmit={submit} className="mt-4 grid gap-3">
            {!isLogin && (
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="px-3 py-2 rounded bg-white/5 border border-white/10"/>
            )}
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="px-3 py-2 rounded bg-white/5 border border-white/10"/>
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="px-3 py-2 rounded bg-white/5 border border-white/10"/>
            <button className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500">{isLogin? 'Sign in' : 'Create account'}</button>
          </form>
        </div>
      </div>
    </main>
  )
}

function Courses(){
  const [courses, setCourses] = useState([])
  useEffect(()=>{ fetch(`${API_BASE}/courses`).then(r=>r.json()).then(d=>setCourses(d.items||[])) },[])
  return (
    <main className="pt-24">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-semibold">Courses</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(c => (
            <Link key={c.id} to={`/courses/${c.id}`} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:-translate-y-1 transition">
              <div className="aspect-video w-full bg-cover bg-center" style={{backgroundImage:`url(${c.thumbnail_url})`}}/>
              <div className="p-4">
                <div className="text-sm text-rose-300">{c.category}</div>
                <div className="font-semibold mt-1">{c.title}</div>
                <div className="text-sm text-slate-400 line-clamp-2 mt-1">{c.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

function ChatWidget({courseId}){
  const { token } = useAuth()
  const [messages, setMessages] = useState([{role:'assistant', content:'Hi! I can help with this course. Ask me anything.'}])
  const [input, setInput] = useState('')

  const send = async ()=>{
    if(!input.trim()) return
    const me = {role:'user', content: input}
    setMessages(m=>[...m, me])
    setInput('')
    try{
      const res = await fetch(`${API_BASE}/chatbot`, {method:'POST', headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify({course_id: courseId, message: me.content})})
      const data = await res.json()
      if(res.ok){
        setMessages(m=>[...m, {role:'assistant', content: data.reply, refs: data.references}])
      } else {
        setMessages(m=>[...m, {role:'assistant', content: data.detail || 'Sorry, something went wrong.'}])
      }
    }catch(err){ setMessages(m=>[...m, {role:'assistant', content: 'Network error'}]) }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-full max-w-sm">
      <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="px-3 py-2 bg-white/5 text-sm">Course Assistant</div>
        <div className="max-h-64 overflow-auto p-3 space-y-2">
          {messages.map((m,i)=> (
            <div key={i} className={`text-sm ${m.role==='user'?'text-right':''}`}>
              <div className={`inline-block px-3 py-2 rounded-lg ${m.role==='user'?'bg-rose-600/30':'bg-white/10'}`}>{m.content}</div>
              {m.refs && m.refs.length>0 && (
                <div className="text-xs text-slate-400 mt-1">Refs: {m.refs.map(r=>r.title).join(', ')}</div>
              )}
            </div>
          ))}
        </div>
        <div className="p-2 flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} placeholder="Ask about this topic" className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10" />
          <button onClick={send} className="px-3 py-2 rounded bg-gradient-to-r from-rose-500 to-pink-500">Send</button>
        </div>
      </div>
    </div>
  )
}

function CourseDetail(){
  const { token } = useAuth()
  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState({percentage: 0, completed: []})
  const courseId = location.pathname.split('/').pop()

  useEffect(()=>{ fetch(`${API_BASE}/courses/${courseId}`).then(r=>r.json()).then(setCourse) },[courseId])
  useEffect(()=>{ if(token) fetch(`${API_BASE}/courses/${courseId}/progress`, {headers:{'Authorization':`Bearer ${token}`}}).then(r=>r.json()).then(d=> setProgress(d.course_progress || {percentage:0, completed:[]})) },[courseId, token])

  const onTimeUpdate = (e)=>{
    if(!token) return
    const watched = Math.floor(e.target.currentTime)
    const lec = course.playlist[0]
    const completed = watched >= (lec.duration - 5)
    fetch(`${API_BASE}/courses/${courseId}/progress`, {method:'PATCH', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify({lecture_id: lec.id, watched_seconds: watched, completed })})
      .then(r=>r.json()).then(d=> setProgress(p=>({...p, percentage: d.percentage, completed: d.completed})))
  }

  if(!course) return <main className="pt-28 px-4">Loading...</main>

  const first = course.playlist?.[0]

  return (
    <main className="pt-24">
      <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
            {first && (
              <video src={first.url} controls className="w-full h-full" onTimeUpdate={onTimeUpdate} />
            )}
          </div>
          <div className="mt-4">
            <div className="text-sm text-rose-300">{course.category}</div>
            <h2 className="text-2xl font-semibold">{course.title}</h2>
            <p className="text-slate-400 mt-2">{course.description}</p>
          </div>
        </div>
        <div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-sm text-slate-300">Progress</div>
            <div className="mt-2 h-2 bg-white/10 rounded">
              <div className="h-full rounded bg-gradient-to-r from-rose-500 to-pink-500" style={{width: `${progress.percentage||0}%`}} />
            </div>
            <div className="text-xs text-slate-400 mt-1">{progress.percentage||0}% complete</div>
          </div>

          <div className="mt-4 rounded-xl bg-white/5 border border-white/10 divide-y divide-white/10">
            {course.playlist?.map(lec => (
              <div key={lec.id} className="p-3 text-sm flex items-center gap-2">
                <Play size={14}/> <span className="flex-1">{lec.title}</span>
                {progress.completed?.includes(lec.id) && <span className="text-emerald-400 text-xs">Done</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ChatWidget courseId={courseId} />
    </main>
  )
}

function Community(){
  const { token } = useAuth()
  const [threads, setThreads] = useState([])
  const [title, setTitle] = useState(''); const [content, setContent] = useState('')
  useEffect(()=>{ fetch(`${API_BASE}/discussions`).then(r=>r.json()).then(d=>setThreads(d.items||[])) },[])
  const create = async ()=>{
    const res = await fetch(`${API_BASE}/discussions`, {method:'POST', headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify({title, content, course_id: ''})})
    const data = await res.json(); if(res.ok){ setThreads(t=>[data, ...t]); setTitle(''); setContent('') } else alert(data.detail||'Error')
  }
  return (
    <main className="pt-24">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold">Community</h2>
          <div className="mt-4 space-y-3">
            {threads.map(t => (
              <div key={t.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-slate-400 mt-1">{t.content}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-sm text-slate-300">Start a discussion</div>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="mt-2 w-full px-3 py-2 rounded bg-white/5 border border-white/10"/>
            <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="What's on your mind?" className="mt-2 w-full px-3 py-2 rounded bg-white/5 border border-white/10"/>
            <button onClick={create} className="mt-3 w-full px-4 py-2 rounded bg-gradient-to-r from-rose-500 to-pink-500">Post</button>
          </div>
        </div>
      </div>
    </main>
  )
}

function Home(){
  return (
    <main className="pt-20">
      <Hero />
      <section className="mx-auto max-w-7xl px-4 -mt-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="font-semibold">Personalized Learning</div>
            <p className="text-sm text-slate-400 mt-1">Adaptive recommendations and dashboards tailored to your goals.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="font-semibold">Real-time Tracking</div>
            <p className="text-sm text-slate-400 mt-1">Visual progress and micro-interactions keep you engaged.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="font-semibold">AI Assistant</div>
            <p className="text-sm text-slate-400 mt-1">Context-aware tips for quicker mastery.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function App(){
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/courses" element={<Courses/>} />
          <Route path="/courses/:id" element={<CourseDetail/>} />
          <Route path="/community" element={<Community/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
