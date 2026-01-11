import React from 'react'
import { Icon } from './UI'
import { isServerError } from '../utils/errorHandling'

export default function ErrorAlert({ error, onDismiss, className = '' }) {
  if (!error) return null

  const isServer = isServerError(error)
  const errorType = isServer ? 'error' : 'warning'

  return (
    <div className={`
      rounded-lg p-4 mb-4 flex items-start justify-between
      ${isServer 
        ? 'bg-error-50 border border-error-200 text-error-800' 
        : 'bg-warning-50 border border-warning-200 text-warning-800'
      }
      ${className}
    `}>
      <div className="flex items-start">
        <Icon 
          icon={isServer ? 'alert-circle' : 'alert-triangle'} 
          className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
            isServer ? 'text-error-500' : 'text-warning-500'
          }`}
        />
        <div className="flex-1">
          <div className="font-medium mb-1">
            {isServer ? 'Server Error' : 'Error'}
          </div>
          <div className="text-sm">
            {typeof error === 'string' ? error : error.message}
          </div>
          
          {/* Show additional info for server errors in development */}
          {isServer && process.env.NODE_ENV === 'development' && (
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer font-mono">Technical Details</summary>
              <pre className="mt-1 p-2 bg-error-100 rounded overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`ml-4 p-1 rounded hover:bg-${
            isServer ? 'error' : 'warning'
          }-100 transition-colors`}
        >
          <Icon 
            icon="close" 
            className={`w-4 h-4 ${
              isServer ? 'text-error-500' : 'text-warning-500'
            }`}
          />
        </button>
      )}
    </div>
  )
}
