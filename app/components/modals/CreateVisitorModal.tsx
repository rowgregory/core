import { FormState } from '../dashboard/VisitorPanel'
import { Modal } from '../common/Modal'
import { Field, inputCls } from '../common/Field'
import { formatPhone } from '@/app/lib/utils/phone.utils'

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
  function handleChange(key: keyof FormState, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      accentColor="#38bdf8"
      tag={closestVisitorDay ? `Visitor Day — ${closestVisitorDay}` : 'Log a'}
      tagColor="#0284c7"
      title="Visitor"
      submitLabel="Log Visitor"
      onSubmit={handleSubmit}
      pending={status === 'loading'}
      error={errorMsg}
    >
      <div className="grid grid-cols-2 gap-1.5">
        <Field label="First name" htmlFor="visitor-first">
          <input
            id="visitor-first"
            type="text"
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Jane"
            className={`${inputCls}`}
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
            className={`${inputCls}`}
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
      <Field label="Company" htmlFor="visitor-company" optional>
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
      <Field label="Industry" htmlFor="visitor-industry" optional>
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
