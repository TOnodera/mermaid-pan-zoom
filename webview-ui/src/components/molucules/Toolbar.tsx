import {
  ALIGN_LEFT,
  ALIGN_TOP,
  POSITION_BOTTOM,
  POSITION_LEFT,
  POSITION_RIGHT,
  POSITION_TOP,
  TOOL_NONE,
  TOOL_PAN,
  TOOL_ZOOM_IN,
  TOOL_ZOOM_OUT,
  type ALIGN_BOTTOM,
  type ALIGN_CENTER,
  type ALIGN_RIGHT,
  type Tool,
  type Value,
} from 'react-svg-pan-zoom';
import ToolbarButton from '../atoms/ToolbarButton';
import IconCursor from '../atoms/IconCurosor';
import IconPan from '../atoms/IconPan';
import IconZoomIn from '../atoms/IconZoomIn';
import IconZoomOut from '../atoms/IconZoomOut';

const DEFAULT_ACTIVE_TOOL_COLOR = '#1CA6FC';

type ToolbarProps = {
  tool: string;
  value: Value;
  onChangeTool: (tool: Tool) => void;
  onChangeValue: (newValue: Value) => void;
  position?:
    | typeof POSITION_TOP
    | typeof POSITION_RIGHT
    | typeof POSITION_BOTTOM
    | typeof POSITION_LEFT;
  SVGAlignX?: typeof ALIGN_CENTER | typeof ALIGN_LEFT | typeof ALIGN_RIGHT;
  SVGAlignY?: typeof ALIGN_CENTER | typeof ALIGN_TOP | typeof ALIGN_BOTTOM;
  activeToolColor?: string;
};

const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  onChangeTool,
  activeToolColor = DEFAULT_ACTIVE_TOOL_COLOR,
  position = POSITION_RIGHT,
}) => {
  const handleChangeTool = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
    tool: Tool
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onChangeTool(tool);
  };

  const isHorizontal =
    position === POSITION_TOP || position === POSITION_BOTTOM;

  const style: React.CSSProperties = {
    position: 'absolute',
    transform: isHorizontal ? 'translate(-50%, 0px)' : 'none',
    top: [POSITION_LEFT, POSITION_RIGHT, POSITION_TOP].includes(position)
      ? '5px'
      : 'unset',
    left: isHorizontal ? '50%' : position === POSITION_LEFT ? '5px' : 'unset',
    right: position === POSITION_RIGHT ? '5px' : 'unset',
    bottom: position === POSITION_BOTTOM ? '5px' : 'unset',
    backgroundColor: 'rgba(19, 20, 22, 0.90)',
    borderRadius: '2px',
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    padding: isHorizontal ? '1px 2px' : '2px 1px',
  };

  return (
    <div style={style} role="toolbar">
      <ToolbarButton
        toolbarPosition={position}
        active={tool === TOOL_NONE}
        activeColor={activeToolColor}
        name="unselect-tools"
        title="Selection"
        onClick={(event) => handleChangeTool(event, TOOL_NONE)}
      >
        <IconCursor />
      </ToolbarButton>

      <ToolbarButton
        toolbarPosition={position}
        active={tool === TOOL_PAN}
        activeColor={activeToolColor}
        name="select-tool-pan"
        title="Pan"
        onClick={(event) => handleChangeTool(event, TOOL_PAN)}
      >
        <IconPan />
      </ToolbarButton>

      <ToolbarButton
        toolbarPosition={position}
        active={tool === TOOL_ZOOM_IN}
        activeColor={activeToolColor}
        name="select-tool-zoom-in"
        title="Zoom in"
        onClick={(event) => handleChangeTool(event, TOOL_ZOOM_IN)}
      >
        <IconZoomIn />
      </ToolbarButton>

      <ToolbarButton
        toolbarPosition={position}
        active={tool === TOOL_ZOOM_OUT}
        activeColor={activeToolColor}
        name="select-tool-zoom-out"
        title="Zoom out"
        onClick={(event) => handleChangeTool(event, TOOL_ZOOM_OUT)}
      >
        <IconZoomOut />
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;
