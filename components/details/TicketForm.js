import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { TextareaAutosize, TextField, Divider, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from "@mui/material";
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { createTicket } from "@/redux/features/project/projectSlice";
import ButtonUI from "../UI/ButtonUI";
import PaperUI from "../UI/PaperUI";
import Upload from "./Upload";

const initialState = {title: "", description: "", status: "New", priority: "High", type: "Bug", deadline: dayjs()};

const TicketForm = ({projectId}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  let [formData, setFormData] = useState(initialState);

  let {title, description, notes, status, priority, type, submitter, deadline} = formData;

  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

  const dateChangeHandler = (newValue) => {
    setFormData(formData = {...formData, deadline: newValue.$d.toISOString()});
  };

  const changeRadioHandler = (e) => {
    setFormData(formData = {...formData, [e.target.name]: e.target.value});
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createTicket({formData, projectId, router}));
  };

  return (<>
    <form
      className="login__form"
      onSubmit={submitHandler}
    >
      <FormControl style={{width: '100%'}}>
        <div className="modal__ticket">
          <div className="modal__ticket--container">
            <PaperUI
              className="ticket-paper box"
            >
              <div className="sub-box one">
                <TextField
                  className='ticket-title'
                  variant="standard"
                  label="Ticket Title"
                  name="title"
                  value={title}
                  onChange={onChange}
                  required
                />
                <TextareaAutosize
                  className='ticket-description'
                  maxRows={6}
                  minRows={3}
                  placeholder="Ticket description."
                  name="description"
                  value={description}
                  onChange={onChange}
                  required
                />
              </div>
              {/* <div className="sub-box two">
                <Upload />
              </div> */}
            </PaperUI>
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
                name="status"
                onChange={changeRadioHandler}
                value={status}
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
                name="priority"
                onChange={changeRadioHandler}
                value={priority}
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
                name="type"
                onChange={changeRadioHandler}
                value={type}
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
                name='deadline'
                value={deadline}
                // value={value}
                // onChange={e => dateChangeHandler(e)}
                onChange={dateChangeHandler}
                renderInput={(params) => <TextField {...params}/>}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="modal__actions">
          <ButtonUI
            variant="contained"
            type="submit"
            sx={{ color: 'primary.text' }}
          >
            Submit
          </ButtonUI>
        </div>
      </FormControl>
    </form>
  </>)
};
export default TicketForm;