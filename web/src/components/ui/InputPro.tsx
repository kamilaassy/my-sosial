// src/components/ui/InputPro/InputPro.tsx
import React, { useState, forwardRef, useEffect, Ref, ChangeEvent } from 'react'

import {
  PasswordInput,
  Textarea,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

type InputProProps = {
  id?: string
  name?: string
  label?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  required?: boolean
  helper?: string
  error?: string
  left?: React.ReactNode
  right?: React.ReactNode
  maxLength?: number
  textarea?: boolean
  minRows?: number
  rows?: number
  className?: string
  style?: React.CSSProperties
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const InputPro = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProProps
>(function InputPro(props, ref) {
  const {
    id,
    name,
    label,
    placeholder = '',
    value,
    defaultValue,
    required = false,
    helper,
    error,
    left,
    right,
    maxLength,
    textarea = false,
    minRows = 3,
    rows,
    className,
    style,
    type = 'text',
    onChange,
  } = props

  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  // value management
  const [focused, setFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(
    value ?? defaultValue ?? ''
  )

  const isControlled = value !== undefined

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value || '')
    }
  }, [value, isControlled])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!isControlled) setInternalValue(e.currentTarget.value)
    onChange?.(e)
  }

  const floating = focused || internalValue.length > 0

  // THEME COLORS
  const bg = dark ? theme.colors.purplelux[9] : theme.colors.purplelux[0]
  const border = dark ? theme.colors.purplelux[7] : theme.colors.purplelux[2]
  const text = dark ? theme.colors.purplelux[0] : theme.colors.purplelux[9]
  const labelColor = dark
    ? theme.colors.purplelux[2]
    : theme.colors.purplelux[7]
  const accent = theme.colors.purplelux[4]

  // ----------------------- RENDER INPUT -----------------------
  const renderTextInput = () => (
    <input
      id={id}
      name={name}
      ref={ref as Ref<HTMLInputElement>}
      type={type}
      value={internalValue}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      maxLength={maxLength}
      style={{
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: 15,
        color: text,
      }}
    />
  )

  const renderTextarea = () => (
    <Textarea
      id={id}
      name={name}
      ref={ref as Ref<HTMLTextAreaElement>}
      autosize
      minRows={minRows}
      rows={rows}
      value={internalValue}
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      maxLength={maxLength}
      styles={{
        input: {
          background: 'transparent',
          border: 'none',
          color: text,
          padding: 0,
          fontSize: '15px',
        },
      }}
    />
  )

  const renderPassword = () => (
    <PasswordInput
      id={id}
      name={name}
      ref={ref as Ref<HTMLInputElement>}
      value={internalValue}
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      styles={{
        input: {
          background: 'transparent',
          border: 'none',
          color: text,
          paddingLeft: 0,
        },
        innerInput: { background: 'transparent' },
      }}
      visibilityToggleIcon={({ reveal }: { reveal: boolean }) =>
        reveal ? <IconEyeOff size={16} /> : <IconEye size={16} />
      }
    />
  )

  // PICK INPUT TYPE
  const inputElement = textarea
    ? renderTextarea()
    : type === 'password'
      ? renderPassword()
      : renderTextInput()

  return (
    <div className={className} style={{ width: '100%', ...style }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          padding: `14px ${right ? 40 : 14}px 10px ${left ? 40 : 14}px`,
          borderRadius: theme.radius.md,
          background: bg,
          border: `1px solid ${border}`,
          boxShadow: dark
            ? 'inset 0 2px 6px rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.45)'
            : 'inset 0 2px 8px rgba(255,255,255,0.6), 0 6px 20px rgba(16,24,40,0.06)',
        }}
      >
        {/* LEFT ICON */}
        {left && (
          <div
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {left}
          </div>
        )}

        {/* INPUT */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {inputElement}
        </div>

        {/* RIGHT ICON */}
        {right && (
          <div
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {right}
          </div>
        )}

        {/* FLOATING LABEL */}
        {label && (
          <label
            htmlFor={id}
            style={{
              position: 'absolute',
              left: left ? 40 : 14,
              top: floating ? 4 : '50%',
              transform: floating
                ? 'translateY(0) scale(0.82)'
                : 'translateY(-50%) scale(1)',
              transformOrigin: 'left top',
              transition: 'all 150ms ease',
              fontSize: floating ? 12 : 15,
              fontWeight: floating ? 600 : 500,
              color: floating ? accent : labelColor,
              pointerEvents: 'none',
            }}
          >
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
          </label>
        )}
      </div>

      {/* HELPER / ERROR */}
      {(helper || error) && (
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            color: error ? 'red' : theme.colors.gray[5],
          }}
        >
          {error || helper}
        </div>
      )}
    </div>
  )
})

export const Input = forwardRef<HTMLInputElement, InputProProps>(
  (props, ref) => <InputPro {...props} ref={ref} />
)

export const Password = forwardRef<HTMLInputElement, InputProProps>(
  (props, ref) => <InputPro {...props} type="password" ref={ref} />
)
