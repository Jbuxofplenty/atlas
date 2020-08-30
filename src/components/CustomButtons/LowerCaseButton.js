import Button from './Button';
import { withStyles } from '@material-ui/core/styles';

const LowerCaseButton = withStyles({
    root: {
      textTransform: 'none',
    },
  })(Button);

export default LowerCaseButton;