import React, { Fragment, useLayoutEffect, useRef, useState } from 'react'
import ReactDOM, { createPortal } from 'react-dom'
import { FormProvider, createForm } from '@formily/react'
import { isNum, isStr, isBool, isFn } from '@formily/shared'
import { Drawer } from '@alifd/next'
import { DrawerProps } from '@alifd/next/lib/drawer'
import { usePrefixCls } from '../__builtins__'

type FormDrawerContent =
  | React.ReactElement
  | ((resolve: () => any, reject: () => any) => React.ReactElement)

type DrawerTitle = string | number | React.ReactElement

const isDrawerTitle = (props: any): props is DrawerTitle => {
  return (
    isNum(props) || isStr(props) || isBool(props) || React.isValidElement(props)
  )
}

const getDrawerProps = (props: any): DrawerProps => {
  if (isDrawerTitle(props)) {
    return {
      title: props,
    }
  } else {
    return props
  }
}

export interface IFormDrawer {
  open(props?: Formily.Core.Types.IFormProps): Promise<any>
  close(): void
}

export interface IFormDrawerComponentProps {
  content: FormDrawerContent
  resolve: () => any
  reject: () => any
}

export function FormDrawer(
  title: DrawerProps,
  content: FormDrawerContent
): IFormDrawer
export function FormDrawer(
  title: DrawerTitle,
  content: FormDrawerContent
): IFormDrawer
export function FormDrawer(title: any, content: any): IFormDrawer {
  const env = {
    root: document.createElement('div'),
    form: null,
    promise: null,
  }
  const props = getDrawerProps(title)
  const drawer = {
    ...props,
    onClose: (reason: string, e: any) => {
      props?.onClose?.(reason, e)
      formDrawer.close()
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(env.root)
        env.root?.parentNode?.removeChild(env.root)
        env.root = undefined
      })
    },
  }
  const component = (props: IFormDrawerComponentProps) => {
    return (
      <Fragment>
        {isFn(props.content)
          ? props.content(props.resolve, props.reject)
          : props.content}
      </Fragment>
    )
  }
  const render = (visible = true, resolve?: () => any, reject?: () => any) => {
    ReactDOM.render(
      <Drawer {...drawer} visible={visible}>
        <FormProvider form={env.form}>
          {React.createElement(component, {
            content,
            resolve,
            reject,
          })}
        </FormProvider>
      </Drawer>,
      env.root
    )
  }
  document.body.appendChild(env.root)
  const formDrawer = {
    open: (props: Formily.Core.Types.IFormProps) => {
      if (env.promise) return env.promise
      env.form = env.form || createForm(props)
      env.promise = new Promise((resolve) => {
        render(
          true,
          () => {
            env.form.submit((values: any) => {
              resolve(values)
              formDrawer.close()
            })
          },
          () => {
            formDrawer.close()
          }
        )
      })
      return env.promise
    },
    close: () => {
      if (!env.root) return
      render(false)
    },
  }
  return formDrawer
}

export const DrawerFooter: React.FC = (props) => {
  const ref = useRef<HTMLDivElement>()
  const [footer, setFooter] = useState<HTMLDivElement>()
  const footerRef = useRef<HTMLDivElement>()
  const prefixCls = usePrefixCls('drawer')
  useLayoutEffect(() => {
    const content = ref.current?.closest(`.${prefixCls}-wrapper-body`)
    if (content) {
      if (!footerRef.current) {
        footerRef.current = content.querySelector(`.${prefixCls}-footer`)
        if (!footerRef.current) {
          footerRef.current = document.createElement('div')
          footerRef.current.classList.add(`.${prefixCls}-footer`)
          content.appendChild(footerRef.current)
        }
      }
      setFooter(footerRef.current)
    }
  })

  footerRef.current = footer

  return (
    <div ref={ref} style={{ display: 'none' }}>
      {footer && createPortal(props.children, footer)}
    </div>
  )
}

FormDrawer.DrawerFooter = DrawerFooter

export default FormDrawer
