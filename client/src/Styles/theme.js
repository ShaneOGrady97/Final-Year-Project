import { createMuiTheme } from "@material-ui/core/styles";
import blue from '@material-ui/core/colors/blue';


export default createMuiTheme({

    palette: {
        primary: blue,
    },

    overrides: {
        MuiTableSortLabel: {
          
          iconDirectionAsc: {
            color: '#009900',
          },
          iconDirectionDesc: {
            color: '#e30b13',
          },
        },

          MuiTableCell: {
            head: {
              
              "&:nth-child(1)": {
                 maxWidth: 60, minWidth: 60, padding: 1,
              },
              "&:nth-child(2)": {
                maxWidth: 250, minWidth: 250, 
                paddingLeft: 35,
              },
              "&:nth-child(3)": {
                maxWidth: 140, minWidth: 140, 
                paddingLeft: 40
             },
             "&:nth-child(4)": {
                maxWidth: 150, minWidth: 150, 
                paddingLeft: 60
               },
               "&:nth-child(5)": {
                 maxWidth: 180, minWidth: 180, 
               },
               "&:nth-child(6)": {
                maxWidth: 180, minWidth: 180, 
               },
               "&:nth-child(7)": {
                padding: 0
               },
               
            },
            body: {
                height: 50,
                "&:nth-child(1)": {
                   maxWidth: 60, minWidth: 60, padding: 1,
                },
                "&:nth-child(2)": {
                maxWidth: 250, minWidth: 250, 
                },
                "&:nth-child(3)": {
                maxWidth: 140, minWidth: 140, 
               },
               "&:nth-child(4)": {
                    maxWidth: 150, minWidth: 150, 
      
                 },
                 "&:nth-child(5)": {
                     maxWidth: 180, minWidth: 180, 
                   },
                   "&:nth-child(6)": {
                    maxWidth: 180, minWidth: 180, 
                   },
                   "&:nth-child(7)": {
                    padding: 5
                   },
              }
          },

          MuiTableRow: {
            head: {
                 height: 50
            },
        },
      }

});