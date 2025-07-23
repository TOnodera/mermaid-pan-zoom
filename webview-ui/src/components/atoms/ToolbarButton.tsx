import React, { useState } from 'react';
import { POSITION_BOTTOM, POSITION_TOP } from 'react-svg-pan-zoom';

export type ToolbarButtonProps = {
  title: string;
  name: string;
  toolbarPosition: string;
  activeColor: string;
  onClick: (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => void;
  active: boolean;
  children: React.ReactNode;
};

export default function ToolbarButton({
  title,
  name,
  toolbarPosition,
  activeColor,
  onClick,
  active,
  children,
}: ToolbarButtonProps) {
  const [hover, setHover] = useState(false);

  const handleEvent = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    switch (event.type) {
      case 'mouseenter':
      case 'touchstart':
        setHover(true);
        break;
      case 'mouseleave':
      case 'touchend':
      case 'touchcancel':
        setHover(false);
        break;
      default:
      // no-op
    }
  };

  const style: React.CSSProperties = {
    display: 'block',
    width: '24px',
    height: '24px',
    margin:
      toolbarPosition === POSITION_TOP || toolbarPosition === POSITION_BOTTOM
        ? '2px 1px'
        : '1px 2px',
    color: active || hover ? activeColor : '#FFF',
    transition: 'color 200ms ease',
    background: 'none',
    padding: '0px',
    border: '0px',
    outline: '0px',
    cursor: 'pointer',
  };

  return (
    <button
      onMouseEnter={handleEvent}
      onMouseLeave={handleEvent}
      onTouchStart={(e) => {
        handleEvent(e);
        onClick(e);
      }}
      onTouchEnd={handleEvent}
      onTouchCancel={handleEvent}
      onClick={onClick}
      style={style}
      title={title}
      name={name}
      type="button"
    >
      {children}
    </button>
  );
}
