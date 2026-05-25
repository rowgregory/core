import { FormState } from '../dashboard/VisitorPanel'
import { Modal } from '../common/Modal'
import { Field, inputCls } from '../common/Field'
import { formatPhone } from '@/app/lib/utils/phone.utils'

function getUpcomingThursdays(count = 8): { value: string; label: string }[] {
  const thursdays = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find next Thursday (day 4). If today is Thursday, start with today.
  const daysUntilThursday = (4 - today.getDay() + 7) % 7
  const firstThursday = new Date(today)
  firstThursday.setDate(today.getDate() + daysUntilThursday)

  for (let i = 0; i < count; i++) {
    const d = new Date(firstThursday)
    d.setDate(firstThursday.getDate() + i * 7)
    const value = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    thursdays.push({ value, label })
  }

  return thursdays
}

export function CreateVisitorModal({
  form,
  setForm,
  handleClose,
  errorMsg,
  handleSubmit,
  open,
  status,
  closestVisitorDay
}) {
  const hasVisitorDay = Boolean(closestVisitorDay)
  const thursdayOptions = hasVisitorDay ? [] : getUpcomingThursdays(8)

  function handleChange(key: keyof FormState, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      accentColor="#38bdf8"
      tag={hasVisitorDay ? `Visitor Day — ${closestVisitorDay}` : 'No Visitor Day Scheduled'}
      tagColor="#0284c7"
      title="Log a Visitor"
      submitLabel="Log Visitor"
      onSubmit={handleSubmit}
      pending={status === 'loading'}
      error={errorMsg}
    >
      {!hasVisitorDay && (
        <>
          <p className="text-xs font-nunito text-muted-light dark:text-muted-dark leading-relaxed mb-2">
            There's no Visitor Day on the calendar right now, but you can still bring a guest to any Thursday meeting.
            Pick the date below so the group knows when to expect them.
          </p>

          <Field label="Visit date" htmlFor="visitor-date">
            <select
              id="visitor-date"
              value={form.visitDate || ''}
              onChange={(e) => handleChange('visitDate', e.target.value)}
              className={inputCls}
              required
            >
              <option value="" disabled>
                Select a Thursday
              </option>
              {thursdayOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        <Field label="First name" htmlFor="visitor-first">
          <input
            id="visitor-first"
            type="text"
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Jane"
            className={inputCls}
            required
          />
        </Field>
        <Field label="Last name" htmlFor="visitor-last">
          <input
            id="visitor-last"
            type="text"
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Smith"
            className={inputCls}
            required
          />
        </Field>
      </div>
      <Field label="Email" htmlFor="visitor-email">
        <input
          id="visitor-email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="jane@company.com"
          className={inputCls}
          required
        />
      </Field>
      <Field label="Company" htmlFor="visitor-company">
        <input
          id="visitor-company"
          type="text"
          value={form.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Smith & Associates"
          className={inputCls}
          required
        />
      </Field>
      <Field label="Industry" htmlFor="visitor-industry">
        <input
          id="visitor-industry"
          type="text"
          value={form.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
          placeholder="Real Estate"
          className={inputCls}
          required
        />
      </Field>
      <Field label="Phone" htmlFor="visitor-phone" optional>
        <input
          id="visitor-phone"
          type="tel"
          value={formatPhone(form.phone)}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="(617) 555-0100"
          className={inputCls}
        />
      </Field>
    </Modal>
  )
}
