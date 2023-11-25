import { Paper } from '@mui/material';

const PaperUI = ({
  className, variant,
  children, label, text, key, elevation,
  color,
  disabled, ...restProps
}) => {
  return (
    <Paper
      // color
      color={color ? color : 'secondary'}
      // sx={{ maxWidth: 345 }}
      elevation={elevation ? elevation : 0}
      className={className ? className : ''}
      variant={variant ? variant : 'outlined'}
      {...{...restProps}}
    >
      {children || label || text}
    </Paper>
  )
};
export default PaperUI;