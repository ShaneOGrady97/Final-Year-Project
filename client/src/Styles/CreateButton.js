import Button from "@material-ui/core/Button";
import withStyles from '@material-ui/core/styles/withStyles';
import green from '@material-ui/core/colors/green';

export default withStyles({
    root: {
        background: green[500],
        color: 'white',
        '&:hover': {
            backgroundColor: green[700],
        },
    },

})(Button);