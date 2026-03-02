'use client'

import { formatHours, calculateProgress, getMonthlyGoal, getMonthName } from '../lib/utils'

// SVG circular progress ring
function Ring({ percent, size = 100, stroke = 8, color = 'var(--color-primary)' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(percent, 100) / 100) * circ

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="var(--color-border)" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={percent >= 100 ? '#22c55e' : color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  )
}

function StatPill({ label, value, accent }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl" style={{ background: 'var(--color-bg)' }}>
      <span className="font-mono-num text-xl font-semibold" style={{ color: accent || 'var(--color-text)' }}>
        {value}
      </span>
      <span className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{label}</span>
    </div>
  )
}

function paceMessage(percent, hoursLeft, daysLeft) {
  if (percent >= 100) return { emoji: '🏆', text: "Annual goal complete!", color: '#22c55e' }
  if (percent >= 80) return { emoji: '🎯', text: 'Almost there — strong finish!', color: 'var(--color-primary)' }
  if (percent >= 50) return { emoji: '📈', text: `${formatHours(hoursLeft)}h to go — on track`, color: 'var(--color-primary)' }
  if (daysLeft > 200) return { emoji: '🌱', text: 'Early in the year — keep building', color: 'var(--color-gold)' }
  return { emoji: '⚡', text: `${formatHours(hoursLeft)}h remaining — pick up the pace`, color: '#f97316' }
}

export default function ProgressStats({ monthSummary, annualSummary, profile, currentDate }) {
  if (!monthSummary || !annualSummary || !profile) return null

  const monthlyGoal = getMonthlyGoal(profile.annualGoal)
  const monthPct = calculateProgress(monthSummary.totalHours, monthlyGoal)
  const annualPct = calculateProgress(annualSummary.totalHours, profile.annualGoal)

  const now = new Date()
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
  const daysLeft = 365 - dayOfYear
  const hoursLeft = Math.max(0, profile.annualGoal - annualSummary.totalHours)
  const pace = paceMessage(annualPct, hoursLeft, daysLeft)

  // Hours needed per remaining month to hit goal
  const monthsLeft = Math.max(1, 12 - currentDate.month)
  const hrsPerMonthNeeded = hoursLeft > 0 ? (hoursLeft / monthsLeft).toFixed(1) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-up">

      {/* ── Monthly Card ── */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
              {getMonthName(currentDate.month)}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
              Goal: {monthlyGoal}h this month
            </p>
          </div>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: monthPct >= 100 ? '#dcfce7' : 'var(--color-primary-l)',
              color: monthPct >= 100 ? '#15803d' : 'var(--color-primary)'
            }}
          >
            {monthPct}%
          </span>
        </div>

        {/* Ring + hours */}
        <div className="flex items-center gap-6 mb-5">
          <div className="relative flex-shrink-0">
            <Ring percent={monthPct} size={96} stroke={9} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono-num text-xl font-bold leading-none" style={{ color: 'var(--color-text)' }}>
                {formatHours(monthSummary.totalHours)}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-muted)' }}>hrs</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-muted)' }}>
                <span>Progress</span>
                <span>{formatHours(monthSummary.totalHours)} / {monthlyGoal}h</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(monthPct, 100)}%`,
                    background: monthPct >= 100 ? '#22c55e' : 'var(--color-primary)'
                  }}
                />
              </div>
            </div>
            {monthSummary.totalHours < monthlyGoal && (
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                {formatHours(monthlyGoal - monthSummary.totalHours)}h remaining
              </p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <StatPill label="Bible Studies" value={monthSummary.totalBibleStudies} />
          <StatPill label="Return Visits" value={monthSummary.totalReturnVisits} />
          <StatPill label="Days Active" value={monthSummary.daysActive} accent="var(--color-primary)" />
        </div>
      </div>

      {/* ── Annual Card ── */}
      <div className="card p-6 animate-fade-up delay-100">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
              {currentDate.year} Annual
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
              Goal: {profile.annualGoal}h/year
            </p>
          </div>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: annualPct >= 100 ? '#dcfce7' : 'var(--color-primary-l)',
              color: annualPct >= 100 ? '#15803d' : 'var(--color-primary)'
            }}
          >
            {annualPct}%
          </span>
        </div>

        {/* Ring + hours */}
        <div className="flex items-center gap-6 mb-5">
          <div className="relative flex-shrink-0">
            <Ring percent={annualPct} size={96} stroke={9} color="var(--color-gold)" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono-num text-xl font-bold leading-none" style={{ color: 'var(--color-text)' }}>
                {formatHours(annualSummary.totalHours)}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-muted)' }}>hrs</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-muted)' }}>
                <span>Progress</span>
                <span>{formatHours(annualSummary.totalHours)} / {profile.annualGoal}h</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(annualPct, 100)}%`,
                    background: annualPct >= 100 ? '#22c55e' : 'var(--color-gold)'
                  }}
                />
              </div>
            </div>
            {hoursLeft > 0 && (
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                ~{hrsPerMonthNeeded}h/month needed to finish
              </p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatPill label="Total BS" value={annualSummary.totalBibleStudies} />
          <StatPill label="Total RVs" value={annualSummary.totalReturnVisits} />
          <StatPill label="Avg/Month" value={`${formatHours(annualSummary.averageHoursPerMonth)}h`} accent="var(--color-gold)" />
        </div>

        {/* Pace banner */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
        >
          <span className="text-base">{pace.emoji}</span>
          <span style={{ color: pace.color, fontWeight: 500 }}>{pace.text}</span>
        </div>
      </div>
    </div>
  )
}