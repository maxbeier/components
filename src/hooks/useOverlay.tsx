import {useOnOutsideClick, TouchOrMouseEvent} from './useOnOutsideClick'
import {useOpenAndCloseFocus} from './useOpenAndCloseFocus'
import {useOnEscapePress} from './useOnEscapePress'
import {AnchoredPositionHookSettings, useAnchoredPosition} from './useAnchoredPosition'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'

export type UseOverlaySettings = {
  ignoreClickRefs?: React.RefObject<HTMLElement>[]
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  onEscape: (e: KeyboardEvent) => void
  onClickOutside: (e: TouchOrMouseEvent) => void
  anchorRef: React.RefObject<HTMLElement>
  positionDeps?: React.DependencyList
  positionSettings?: AnchoredPositionHookSettings
  overlayRef?: React.RefObject<HTMLDivElement>
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement>
  position: {top: number; left: number} | undefined
}

export const useOverlay = ({
  anchorRef,
  positionSettings = {},
  positionDeps,
  returnFocusRef,
  initialFocusRef,
  onEscape,
  ignoreClickRefs,
  overlayRef: _overlayRef,
  onClickOutside
}: UseOverlaySettings): OverlayReturnProps => {
  const overlayRef = useProvidedRefOrCreate<HTMLDivElement>(_overlayRef)
  positionSettings.anchorElementRef = anchorRef
  positionSettings.floatingElementRef = overlayRef
  useOpenAndCloseFocus({containerRef: overlayRef, returnFocusRef, initialFocusRef})
  useOnOutsideClick({containerRef: overlayRef, ignoreClickRefs, onClickOutside})
  useOnEscapePress({onEscape})
  const {position} = useAnchoredPosition(positionSettings, positionDeps)
  return {ref: overlayRef, position}
}
