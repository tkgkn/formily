import React from 'react'
import { connect, mapReadPretty } from '@formily/react'
import { Input } from '@alifd/next'
import { PasswordProps } from '@alifd/next/lib/input'
import { PasswordStrength } from '@formily/react-shared-components'
import { PreviewText } from '../preview-text'

export interface IPasswordProps extends PasswordProps {
  checkStrength: boolean
}

export const Password = connect((props: IPasswordProps) => {
  const { value, className, checkStrength, ...others } = props
  const blockStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 1,
    height: 8,
    top: 0,
    background: '#fff',
    width: 1,
    transform: 'translate(-50%, 0)'
  }
  return (
    <span className={className}>
      <Input.Password {...others} value={value} />
      {checkStrength && (
        <PasswordStrength value={String(value)}>
          {score => {
            return (
              <div
                style={{
                  background: '#e0e0e0',
                  marginBottom: 3,
                  position: 'relative'
                }}
              >
                <div style={{ ...blockStyle, left: '20%' }} />
                <div style={{ ...blockStyle, left: '40%' }} />
                <div style={{ ...blockStyle, left: '60%' }} />
                <div style={{ ...blockStyle, left: '80%' }} />
                <div
                  style={{
                    position: 'relative',
                    backgroundImage:
                      '-webkit-linear-gradient(left, #ff5500, #ff9300)',
                    transition: 'all 0.35s ease-in-out',
                    height: 8,
                    width: '100%',
                    marginTop: 5,
                    clipPath: `polygon(0 0,${score}% 0,${score}% 100%,0 100%)`
                  }}
                />
              </div>
            )
          }}
        </PasswordStrength>
      )}
    </span>
  )
}, mapReadPretty(PreviewText.Input))

export default Password
