import React, { useState, ReactNode } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';

interface TooltipProps {
  children?: ReactNode;
  text: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const CustomTooltip: React.FC<TooltipProps> = ({ text, placement = 'top' }) => {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setShow(true);
    setTarget(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setShow(false);
    setTarget(null);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block' }}
    >
      <i
        className="las la-exclamation-circle me-1"
        style={{
          marginLeft: '2px',
          marginTop: '0px',
          color: '#204661',
          cursor: 'pointer',
        }}
      />
      <Overlay target={target} show={show} placement={placement}>
        {(props) => <Tooltip {...props}>{text}</Tooltip>}
      </Overlay>
    </div>
  );
};

export default CustomTooltip;
