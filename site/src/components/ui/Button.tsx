'use client'

import Link from 'next/link'
import { forwardRef } from 'react'

type ButtonVariant = 'solidGold' | 'outlinePurple'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  as?: 'button'
  href?: never
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  as: 'link'
  href: string
  type?: never
  disabled?: never
  onClick?: never
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const variantClasses: Record<ButtonVariant, string> = {
  solidGold: [
    'bg-[--color-gold] border-2 border-[--color-gold] text-[--color-charcoal]',
    'hover:bg-[--color-purple] hover:border-[--color-purple] hover:text-[--color-green]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-purple] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-cream]',
  ].join(' '),
  outlinePurple: [
    'bg-transparent border-2 border-[--color-purple] text-[--color-purple]',
    'hover:bg-[--color-purple] hover:text-[--color-green]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-purple] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-cream]',
  ].join(' '),
}

const baseClasses = [
  'inline-flex items-center justify-center',
  'font-headline tracking-widest uppercase',
  'transition-all duration-200',
  'cursor-pointer',
].join(' ')

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'solidGold',
      size = 'md',
      className = '',
      children,
      ...rest
    } = props

    const classes = [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      className,
    ].join(' ')

    if (props.as === 'link') {
      return (
        <Link
          href={props.href}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {children}
        </Link>
      )
    }

    const { as, type = 'button', disabled, onClick, ...buttonRest } = rest as ButtonAsButtonProps

    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`${classes} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...buttonRest}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
export type { ButtonProps, ButtonVariant, ButtonSize }
