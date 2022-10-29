import { useState } from "react";
import dayjs from "dayjs";
import { TextareaAutosize, Divider, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from "@mui/material";
import { TextField } from "@mui/material";
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import ButtonUI from "../UI/ButtonUI";
import Upload from "./Upload";

const TicketForm = () => {
  const [value, setValue] = useState(dayjs("2020-08-12T21:11:54"));
  
  const dateChangeHandler = (newValue) => {
    setValue(newValue);
  };

  return (<>
    <FormControl style={{width: '100%'}}>
      <div className="modal__ticket">
        <div className="modal__ticket--container">
          <div className="">
            <TextField
              className='ticket-title'
              variant="standard"
              label="Ticket Title"
            />
            <TextareaAutosize
              className='ticket-description'
              maxRows={6}
              minRows={6}
              placeholder="Ticket description."
            />
          </div>
          <Upload />
        </div>
        <div className="modal__radio-selects">
          <div className="modal__radio-group status">
            <FormLabel
              aria-label="status-radio-buttons-group"
              defaultValue="new"
              name="status-radio-buttons-group"
            >
              Status
            </FormLabel>
            <RadioGroup
              row
              defaultValue="New"
            >
              <FormControlLabel value="New" control={<Radio />} label="New"/>
              <FormControlLabel value="Open" control={<Radio />} label="Open"/>
              <FormControlLabel value="On Hold" control={<Radio />} label="On Hold"/>
              <FormControlLabel value="In Progress" control={<Radio />} label="In Progress"/>
              <FormControlLabel value="Closed" control={<Radio />} label="Closed"/>
              <FormControlLabel value="Unconfirmed" control={<Radio />} label="Unconfirmed"/>
            </RadioGroup>
          </div>
          <Divider />
          <div className="modal__radio-group priority">
            <FormLabel
              aria-label="status-radio-buttons-group"
              defaultValue="new"
              name="status-radio-buttons-group"
            >
              Priority
            </FormLabel>
            <RadioGroup
              row
              defaultValue="High"
            >
              <FormControlLabel value="Urgent" control={<Radio />} label="Urgent"/>
              <FormControlLabel value="High" control={<Radio />} label="High"/>
              <FormControlLabel value="Medium" control={<Radio />} label="Medium"/>
              <FormControlLabel value="Low" control={<Radio />} label="Low"/>
              <FormControlLabel value="None" control={<Radio />} label="None"/>
            </RadioGroup>
          </div>
          <Divider />
          <div className="modal__radio-group type">
            <FormLabel
              aria-label="status-radio-buttons-group"
              defaultValue="new"
              name="status-radio-buttons-group"
            >
              Type
            </FormLabel>
            <RadioGroup
              row
              defaultValue="Bug"
            >
              <FormControlLabel value="Bug" control={<Radio />} label="Bug"/>
              <FormControlLabel value="Breaking Change" control={<Radio />} label="Breaking Change"/>
              <FormControlLabel value="Discussion" control={<Radio />} label="Discussion"/>
              <FormControlLabel value="Error" control={<Radio />} label="Error"/>
              <FormControlLabel value="Enhancement" control={<Radio />} label="Enhancement"/>
              <FormControlLabel value="Feature Request" control={<Radio />} label="Feature Request"/>
              <FormControlLabel value="Needs Investigation" control={<Radio />} label="Needs Investigation"/>
              <FormControlLabel value="Question" control={<Radio />} label="Question"/>
              <FormControlLabel value="Release" control={<Radio />} label="Release"/>
              <FormControlLabel value="Regression" control={<Radio />} label="Regression"/>
              <FormControlLabel value="Security" control={<Radio />} label="Security"/>
              <FormControlLabel value="Misc" control={<Radio />} label="Misc"/>
            </RadioGroup>
          </div>
        </div>
        <Divider />
        <div className="modal__date-picker">
          <h4 className="date-picker-header">Date Deadline (Optional):</h4>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label="Date Deadline"
              inputFormat="MM/DD/YYYY"
              value={value}
              onChange={dateChangeHandler}
              renderInput={(params) => <TextField {...params}/>}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div className="modal__actions">
        <ButtonUI
          variant="contained"
        >
          Submit
        </ButtonUI>
      </div>
    </FormControl>
  </>)
};
export default TicketForm;