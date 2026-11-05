import React, { type FormHTMLAttributes } from 'react'

interface FormProps extends FormHTMLAttributes<HTMLFormElement>{
    children: React.ReactNode;
}

export const Form = ({children, ...props}:FormProps) => {
  return (
      <form className='space-y-4' {...props} noValidate>
          {children}
    </form>
  )
}
