import React, {useCallback, useRef, useState} from 'react'
import {List, GroupedListProps, ListPropsBase} from '../ActionList/List'
import Overlay from '../Overlay'
import {DropdownButton, DropdownButtonProps} from './DropdownButton'
import {Item} from '../ActionList/Item'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {useFocusZone} from '../hooks/useFocusZone'

export interface DropdownMenuProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  renderAnchor?: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element
}

export function DropdownMenu({
  renderAnchor = <T extends DropdownButtonProps>(props: T) => <DropdownButton {...props} />,
  renderItem = Item,
  ...listProps
}: DropdownMenuProps): JSX.Element {
  const anchorRef = useRef<HTMLElement>(null)
  const anchorId = `dropdownMenuAnchor-${window.crypto.getRandomValues(new Uint8Array(4)).join('')}`
  const [selection, select] = useState<string>('')
  const [openState, setOpenState] = useState<'closed' | 'open' | 'ready'>('closed')
  const onDismiss = useCallback(() => setOpenState('closed'), [setOpenState])

  const overlayRef = React.useRef<HTMLDivElement>(null)

  useFocusZone({containerRef: overlayRef, disabled: openState !== 'ready'})
  useFocusTrap({containerRef: overlayRef, disabled: openState !== 'ready'})

  return (
    <>
      {renderAnchor({
        ref: anchorRef,
        id: anchorId,
        'aria-labelledby': anchorId,
        'aria-haspopup': 'listbox',
        children: selection,
        onClick: () => setOpenState(openState === 'closed' ? 'open' : 'closed')
      })}
      {openState !== 'closed' && (
        <Overlay
          anchorRef={anchorRef}
          returnFocusRef={anchorRef}
          onClickOutside={onDismiss}
          onEscape={onDismiss}
          ref={overlayRef}
          onPositionChanged={() => {
            setOpenState('ready')
          }}
        >
          <List
            {...listProps}
            role="listbox"
            renderItem={({onClick, ...itemProps}) =>
              renderItem({
                ...itemProps,
                role: 'option',
                selected: itemProps.text === selection,
                onClick: event => {
                  select(itemProps.text === selection ? '' : itemProps.text ?? '')
                  setOpenState('closed')
                  onClick && onClick(event)
                }
              })
            }
          />
        </Overlay>
      )}
    </>
  )
}
