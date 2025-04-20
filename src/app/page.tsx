'use client';

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function App() {
  const [user, setUser] = useState(null);
  const [goal, setGoal] = useState("");
  const [habits, setHabits] = useState([
    { name: "Sleep 8 hours", weight: 30, value: 0 },
    { name: "Drink 2L water", weight: 30, value: 0 },
    { name: "Walk 10K steps", weight: 40, value: 0 },
  ]);
  const [habitScore, setHabitScore] = useState(72);
  const [feelingScore, setFeelingScore] = useState(68);
  const [dailyFeeling, setDailyFeeling] = useState(50);
  const [period, setPeriod] = useState("7d");
  const [logs, setLogs] = useState([]);
  const filteredLogs =
    period === "all" ? logs : logs.slice(-1 * (period === "30d" ? 30 : 7));

  const totalWeight = habits.reduce((sum, h) => sum + h.weight, 0);

  const logToday = () => {
    const score = habits.reduce(
      (sum, h) => sum + (Math.min(h.value, 100) / 100) * h.weight,
      0
    );
    const logEntry = {
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      habit: Math.round(score),
      feeling: dailyFeeling,
    };
    setLogs((prev) => [...prev.slice(-6), logEntry]); // keep last 7 days
    setHabitScore(Math.round(score));
    setFeelingScore(dailyFeeling);
    alert("Today's log saved!");
  };

  if (!user) return <AuthScreen onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-6 space-y-6 max-w-md mx-auto text-neutral-800 font-sans">
      <div className="text-right text-sm text-gray-400">
        Logged in as {user.email}
      </div>

      <section className="bg-white p-6 rounded-2xl shadow-md space-y-3">
        <h2 className="text-xl font-semibold">What’s driving you right now?</h2>
        <input
          type="text"
          placeholder="e.g. Be more confident, fitter..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">
          Habits You Chose to Support Your Vision
        </h2>
        {habits.map((habit, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={habit.name}
                onChange={(e) => {
                  const updated = [...habits];
                  updated[index].name = e.target.value;
                  setHabits(updated);
                }}
                className="flex-1 mr-2 p-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => setHabits(habits.filter((_, i) => i !== index))}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Importance</span>
              <input
                type="number"
                value={habit.weight}
                onChange={(e) => {
                  const updated = [...habits];
                  updated[index].weight = parseInt(e.target.value) || 0;
                  setHabits(updated);
                }}
                className="w-16 p-1 border rounded text-center"
              />
            </div>
          </div>
        ))}
        {totalWeight !== 100 && (
          <p className="text-red-500 text-sm">
            ⚠️ Your weights must add up to 100%. Currently: {totalWeight}%
          </p>
        )}
        <button
          onClick={() =>
            setHabits([...habits, { name: "New Habit", weight: 0, value: 0 }])
          }
          className="w-full p-2 border border-sky-400 text-sky-600 rounded-xl hover:bg-sky-50"
        >
          + Add Habit
        </button>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Log Today's Progress</h2>
        {habits.map((habit, index) => (
          <div key={index} className="space-y-1">
            <label className="text-sm font-medium">{habit.name}</label>
            <input
              type="range"
              value={habit.value}
              max={100}
              step={1}
              onChange={(e) => {
                const updated = [...habits];
                updated[index].value = parseInt(e.target.value);
                setHabits(updated);
              }}
              className="w-full"
            />
            <p className="text-xs text-gray-500">{habit.value}% of goal</p>
          </div>
        ))}
        <div className="space-y-1 mt-4">
          <label className="text-sm font-medium">How do you feel today?</label>
          <input
            type="range"
            value={dailyFeeling}
            max={100}
            step={1}
            onChange={(e) => setDailyFeeling(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500">{dailyFeeling}/100</p>
        </div>
        <button
          onClick={logToday}
          className="w-full p-3 bg-sky-600 text-white rounded-xl font-medium shadow hover:bg-sky-700 transition"
        >
          Save Log
        </button>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Your Progress</h2>
        <div className="text-right">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Habit Score</p>
            <p className="text-lg font-semibold">{habitScore}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Feeling Score</p>
            <p className="text-lg font-semibold">{feelingScore}%</p>
          </div>
        </div>
        {logs.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={filteredLogs}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="habit"
                stroke="#3b82f6"
                name="Habit Score"
              />
              <Line
                type="monotone"
                dataKey="feeling"
                stroke="#10b981"
                name="Feeling Score"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400">
            No data logged yet. Your chart will appear here after saving your
            first log.
          </p>
        )}
      </section>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (email.trim()) {
      const user = { email };
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-white font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Please enter your email to continue
        </p>
        <input
          type="email"
          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full p-3 bg-sky-600 text-white rounded-xl font-medium shadow hover:bg-sky-700 transition"
        >
          Continue
        </button>
        <p className="text-xs text-gray-400 text-center">
          We’ll never share your email with anyone else.
        </p>
      </div>
    </div>
  );
}

export default App;
